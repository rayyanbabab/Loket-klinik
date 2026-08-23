<?php

namespace App\Http\Controllers;

use App\Events\TicketCalled;
use App\Models\Call;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    public function status()
    {
        // Ambil last called per service + next 5 waiting (display preview) + total waiting count
        $services = Service::where('is_active', true)->get();
        $payload = [];

        foreach ($services as $service) {
            $current = Ticket::where('service_id', $service->id)
                ->where('status', 'called')
                ->latest('called_at')
                ->first();

            $next = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->orderBy('number_int')
                ->take(5)
                ->get(['number_str']);

            // Total waiting count for accurate display
            $totalWaiting = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->count();

            $payload[] = [
                'service'         => $service->name,
                'current'         => $current?->number_str,
                'counter'         => $current?->counter?->name,
                'next'            => $next->pluck('number_str'),
                'total_waiting'   => $totalWaiting,
                'current_ticket'  => $current?->number_str,  // For sound system
                'current_counter' => $current?->counter?->name, // For sound system
                'called_at'       => $current?->called_at?->timestamp, // For sound system timing
            ];
        }

        return response()->json([
            'services'  => $payload,
            'timestamp' => now()->timestamp,
        ]);
    }

    public function statusByService(Service $service)
    {
        $current = Ticket::where('service_id', $service->id)
            ->where('status', 'called')
            ->latest('called_at')
            ->first();

        $next = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->orderBy('number_int')
            ->take(5)
            ->get(['number_str']);

        return [
            'service' => $service->name,
            'current' => $current?->number_str,
            'counter' => $current?->counter?->name,
            'next'    => $next->pluck('number_str'),
        ];
    }

    /**
     * FIX 1 + 2: createTicket dengan:
     * - Penomoran harian: reset ke 001 setiap hari (via served_date)
     * - DB::transaction() + lockForUpdate() untuk mencegah race condition
     * - Tidak lagi menghapus data historis lama
     */
    public function createTicket(Request $request)
    {
        $service = Service::findOrFail($request->service_id);
        $today   = now()->toDateString();

        $ticket = DB::transaction(function () use ($service, $today) {
            // lockForUpdate() mencegah dua request bersamaan mendapatkan nomor yang sama
            $last = Ticket::where('service_id', $service->id)
                ->where('served_date', $today)
                ->lockForUpdate()
                ->max('number_int');

            $num = ($last ?? 0) + 1;

            if ($num > 999) {
                abort(422, 'Kuota antrian hari ini sudah habis untuk layanan ini. Silakan hubungi admin.');
            }

            return Ticket::create([
                'service_id'  => $service->id,
                'served_date' => $today,
                'number_int'  => $num,
                'number_str'  => $service->prefix . '-' . str_pad($num, 3, '0', STR_PAD_LEFT),
            ]);
        });

        // FIX 6: Estimasi waktu tunggu dengan memperhitungkan jumlah loket aktif
        $waitingAhead = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
            ->where('number_int', '<', $ticket->number_int)
            ->count();

        // Hitung rata-rata waktu layanan hari ini (dalam menit)
        $doneTickets = Ticket::where('service_id', $service->id)
            ->where('status', 'done')
            ->where('served_date', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get(['called_at', 'finished_at']);

        $avgServiceTime = 5; // default 5 menit
        if ($doneTickets->count() > 0) {
            $totalSeconds = $doneTickets->sum(function ($t) {
                return $t->called_at->diffInSeconds($t->finished_at);
            });
            $avgSeconds    = $totalSeconds / $doneTickets->count();
            $avgMinutes    = $avgSeconds / 60;
            // Minimal 1 menit agar estimasi tidak 0
            $avgServiceTime = max(1, round($avgMinutes, 1));
        }

        // FIX 6: Bagi dengan jumlah loket aktif agar estimasi lebih akurat
        $activeCounters = Counter::where('service_id', $service->id)
            ->where('is_active', true)
            ->count();

        $effectiveCounters       = max(1, $activeCounters);
        $estimatedWaitMinutes    = (int) ceil(($waitingAhead / $effectiveCounters) * $avgServiceTime);
        $estimatedServiceTime    = now()->addMinutes($estimatedWaitMinutes);

        return response()->json([
            'id'                      => $ticket->id,
            'service_id'              => $ticket->service_id,
            'number_int'              => $ticket->number_int,
            'number_str'              => $ticket->number_str,
            'status'                  => $ticket->status,
            'created_at'              => $ticket->created_at,
            'waiting_ahead'           => $waitingAhead,
            'avg_service_time'        => $avgServiceTime,
            'estimated_wait_minutes'  => $estimatedWaitMinutes,
            'estimated_service_time'  => $estimatedServiceTime->format('H:i'),
        ]);
    }

    /**
     * FIX 2 + 3 + 5: callNext dengan:
     * - DB::transaction() + lockForUpdate() → cegah race condition dua loket panggil pasien sama
     * - Auto-finish tiket 'called' sebelumnya di loket ini → cegah tiket nyangkut selamanya
     * - Gunakan auth()->id() untuk user_id di log Call
     */
    public function callNext(Request $request)
    {
        $counter = Counter::findOrFail($request->counter_id);

        $ticket = DB::transaction(function () use ($counter) {
            // FIX 3: Auto-finish tiket yang masih berstatus 'called' di loket ini
            // agar tidak ada tiket nyangkut dengan status called selamanya
            Ticket::where('counter_id', $counter->id)
                ->where('status', 'called')
                ->update([
                    'status'      => 'done',
                    'finished_at' => now(),
                ]);

            // FIX 2: lockForUpdate() mencegah 2 loket memanggil pasien yang sama secara bersamaan
            $ticket = Ticket::where('service_id', $counter->service_id)
                ->where('status', 'waiting')
                ->orderBy('number_int')
                ->lockForUpdate()
                ->first();

            if (!$ticket) {
                abort(404, 'Tidak ada antrian yang menunggu');
            }

            $ticket->update([
                'status'     => 'called',
                'called_at'  => now(),
                'counter_id' => $counter->id,
            ]);

            return $ticket;
        });

        event(new TicketCalled($ticket));

        // FIX 5: Gunakan auth()->id() bukan hardcoded 1
        Call::create([
            'ticket_id'  => $ticket->id,
            'counter_id' => $counter->id,
            'user_id'    => auth()->id() ?? 1,
            'type'       => 'call',
        ]);

        return $ticket->fresh(['counter']);
    }

    /**
     * FIX 5: recall menggunakan auth()->id()
     */
    public function recall(Ticket $ticket)
    {
        if ($ticket->status !== 'called') {
            abort(422, 'Tiket belum dalam status dipanggil');
        }

        event(new TicketCalled($ticket));

        Call::create([
            'ticket_id'  => $ticket->id,
            'counter_id' => $ticket->counter_id,
            'user_id'    => auth()->id() ?? 1,
            'type'       => 'recall',
        ]);

        return $ticket->refresh();
    }

    public function finish(Ticket $ticket)
    {
        if ($ticket->status !== 'called') {
            abort(422, 'Tiket belum dalam status dipanggil');
        }

        $ticket->update([
            'status'      => 'done',
            'finished_at' => now(),
        ]);

        return $ticket->refresh();
    }

    public function services()
    {
        return Service::where('is_active', true)->get();
    }

    public function counters()
    {
        return Counter::with('service')->where('is_active', true)->get();
    }

    public function currentTicket(Counter $counter)
    {
        $ticket = Ticket::where('counter_id', $counter->id)
            ->where('status', 'called')
            ->latest('called_at')
            ->first();

        if (!$ticket) {
            return response()->json(null, 404);
        }

        return $ticket;
    }

    public function counterStats(Counter $counter)
    {
        $today = now()->toDateString();

        $doneToday = Ticket::where('counter_id', $counter->id)
            ->where('status', 'done')
            ->where('served_date', $today)
            ->count();

        $currentlyServing = Ticket::where('counter_id', $counter->id)
            ->where('status', 'called')
            ->count();

        $waiting = Ticket::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->count();

        return response()->json([
            'done_today'        => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting'           => $waiting,
        ]);
    }

    public function dashboardStats()
    {
        $today = now()->toDateString();

        $totalToday       = Ticket::where('served_date', $today)->count();
        $doneToday        = Ticket::where('status', 'done')->where('served_date', $today)->count();
        $currentlyServing = Ticket::where('status', 'called')->count();
        $waiting          = Ticket::where('status', 'waiting')->count();

        $serviceStats = Service::withCount([
            'tickets as total_today' => fn($q) => $q->where('served_date', $today),
            'tickets as done_today'  => fn($q) => $q->where('status', 'done')->where('served_date', $today),
            'tickets as waiting'     => fn($q) => $q->where('status', 'waiting'),
            'tickets as serving'     => fn($q) => $q->where('status', 'called'),
        ])->where('is_active', true)->get();

        $counterStats = Counter::with('service')->withCount([
            'tickets as done_today' => fn($q) => $q->where('status', 'done')->where('served_date', $today),
            'tickets as serving'    => fn($q) => $q->where('status', 'called'),
        ])->where('is_active', true)->get();

        // FIX 6: Hitung rata-rata waktu layanan dengan minimum 0 detik
        $doneTickets = Ticket::where('status', 'done')
            ->where('served_date', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get(['called_at', 'finished_at']);

        $avgServiceTime = 0;
        if ($doneTickets->count() > 0) {
            $totalSeconds   = $doneTickets->sum(fn($t) => $t->called_at->diffInSeconds($t->finished_at));
            $avgServiceTime = round(($totalSeconds / $doneTickets->count()) / 60, 1);
        }

        return response()->json([
            'total_today'       => $totalToday,
            'done_today'        => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting'           => $waiting,
            'avg_service_time'  => $avgServiceTime,
            'services'          => $serviceStats,
            'counters'          => $counterStats,
        ]);
    }

    public function globalStats()
    {
        $today = now()->toDateString();

        $doneToday        = Ticket::where('status', 'done')->where('served_date', $today)->count();
        $currentlyServing = Ticket::where('status', 'called')->count();
        $waiting          = Ticket::where('status', 'waiting')->count();

        return response()->json([
            'done_today'        => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting'           => $waiting,
        ]);
    }
}
