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
        $today = now()->toDateString();
        // Ambil last called per service + next 5 waiting (display preview) + total waiting count
        $services = Service::where('is_active', true)->get();
        $payload = [];

        foreach ($services as $service) {
            $current = Ticket::where('service_id', $service->id)
                ->where('status', 'called')
                ->where('served_date', $today)
                ->latest('called_at')
                ->first();

            $next = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->where('served_date', $today)
                ->orderBy('number_int')
                ->take(5)
                ->get(['number_str']);

            // Total waiting count for accurate display
            $totalWaiting = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->where('served_date', $today)
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
        $today = now()->toDateString();

        $current = Ticket::where('service_id', $service->id)
            ->where('status', 'called')
            ->where('served_date', $today)
            ->latest('called_at')
            ->first();

        $next = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
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
     * createTicket dengan:
     * - Penomoran harian: reset ke 001 setiap hari (via served_date)
     * - Mutex lock pada Service + lockForUpdate() tiket untuk mencegah race condition pada tiket pertama
     * - Filter outlier durasi pelayanan untuk estimasi waktu tunggu yang akurat
     */
    public function createTicket(Request $request)
    {
        $serviceId = $request->service_id;
        $today     = now()->toDateString();

        $ticket = DB::transaction(function () use ($serviceId, $today) {
            // Lock row service sebagai mutex agar tidak ada race condition saat tiket nomor 1
            $service = Service::where('id', $serviceId)->lockForUpdate()->firstOrFail();

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

        // Estimasi waktu tunggu dengan memperhitungkan antrian di depan
        $waitingAhead = Ticket::where('service_id', $ticket->service_id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
            ->where('number_int', '<', $ticket->number_int)
            ->count();

        // Hitung rata-rata waktu layanan hari ini (dalam menit), filter outlier (> 45 menit diabaikan)
        $doneTickets = Ticket::where('service_id', $ticket->service_id)
            ->where('status', 'done')
            ->where('served_date', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get(['called_at', 'finished_at']);

        $avgServiceTime = 5; // default 5 menit
        if ($doneTickets->count() > 0) {
            $validDurations = $doneTickets->map(fn($t) => $t->called_at->diffInSeconds($t->finished_at))
                ->filter(fn($sec) => $sec >= 30 && $sec <= 2700); // 30 detik s/d 45 menit wajar

            if ($validDurations->count() > 0) {
                $avgMinutes     = ($validDurations->sum() / $validDurations->count()) / 60;
                $avgServiceTime = max(1, round($avgMinutes, 1));
            }
        }

        // Loket aktif & loket yang sedang melayani saat ini
        $activeCounters = Counter::where('service_id', $ticket->service_id)
            ->where('is_active', true)
            ->count();
        $effectiveCounters = max(1, $activeCounters);

        // Jika loket sedang melayani, tambahkan bobot antrian
        $busyCounters = Ticket::where('service_id', $ticket->service_id)
            ->where('status', 'called')
            ->where('served_date', $today)
            ->count();

        $effectiveQueueAhead = $waitingAhead;
        if ($waitingAhead == 0 && $busyCounters > 0) {
            // Pasien baru tetap menunggu sisa waktu pelayanan pasien saat ini
            $effectiveQueueAhead = 0.5;
        }

        $estimatedWaitMinutes = (int) ceil(($effectiveQueueAhead / $effectiveCounters) * $avgServiceTime);
        $estimatedServiceTime = now()->addMinutes($estimatedWaitMinutes);

        return response()->json([
            'id'                     => $ticket->id,
            'service_id'             => $ticket->service_id,
            'number_int'             => $ticket->number_int,
            'number_str'             => $ticket->number_str,
            'status'                 => $ticket->status,
            'created_at'             => $ticket->created_at,
            'waiting_ahead'          => $waitingAhead,
            'avg_service_time'       => $avgServiceTime,
            'estimated_wait_minutes' => $estimatedWaitMinutes,
            'estimated_service_time' => $estimatedServiceTime->format('H:i'),
        ]);
    }

    /**
     * callNext dengan:
     * - DB::transaction() + lockForUpdate() + filter served_date
     * - Auto-finish tiket 'called' sebelumnya di loket ini
     * - Menggunakan auth()->id()
     */
    public function callNext(Request $request)
    {
        $counter = Counter::findOrFail($request->counter_id);
        $today   = now()->toDateString();

        $ticket = DB::transaction(function () use ($counter, $today) {
            // Auto-finish tiket yang masih berstatus 'called' di loket ini
            Ticket::where('counter_id', $counter->id)
                ->where('status', 'called')
                ->update([
                    'status'      => 'done',
                    'finished_at' => now(),
                ]);

            // lockForUpdate() + filter served_date mencegah pemanggilan sisa antrian hari sebelumnya
            $ticket = Ticket::where('service_id', $counter->service_id)
                ->where('status', 'waiting')
                ->where('served_date', $today)
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

        Call::create([
            'ticket_id'  => $ticket->id,
            'counter_id' => $counter->id,
            'user_id'    => auth()->id() ?? 1,
            'type'       => 'call',
        ]);

        return $ticket->fresh(['counter']);
    }

    /**
     * recall dengan perbaruan called_at agar audio display ter-trigger kembali
     */
    public function recall(Ticket $ticket)
    {
        if ($ticket->status !== 'called') {
            abort(422, 'Tiket belum dalam status dipanggil');
        }

        // Perbarui called_at agar timestamp berubah dan sound system di display bisa mendeteksi recall
        $ticket->update([
            'called_at' => now(),
        ]);

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
        $today = now()->toDateString();

        $ticket = Ticket::where('counter_id', $counter->id)
            ->where('status', 'called')
            ->where('served_date', $today)
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
            ->where('served_date', $today)
            ->count();

        $waiting = Ticket::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
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
        $currentlyServing = Ticket::where('status', 'called')->where('served_date', $today)->count();
        $waiting          = Ticket::where('status', 'waiting')->where('served_date', $today)->count();

        $serviceStats = Service::withCount([
            'tickets as total_today' => fn($q) => $q->where('served_date', $today),
            'tickets as done_today'  => fn($q) => $q->where('status', 'done')->where('served_date', $today),
            'tickets as waiting'     => fn($q) => $q->where('status', 'waiting')->where('served_date', $today),
            'tickets as serving'     => fn($q) => $q->where('status', 'called')->where('served_date', $today),
        ])->where('is_active', true)->get();

        $counterStats = Counter::with('service')->withCount([
            'tickets as done_today' => fn($q) => $q->where('status', 'done')->where('served_date', $today),
            'tickets as serving'    => fn($q) => $q->where('status', 'called')->where('served_date', $today),
        ])->where('is_active', true)->get();

        // Hitung rata-rata waktu layanan dengan filter outlier wajar (30 detik s/d 45 menit)
        $doneTickets = Ticket::where('status', 'done')
            ->where('served_date', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get(['called_at', 'finished_at']);

        $avgServiceTime = 0;
        if ($doneTickets->count() > 0) {
            $validDurations = $doneTickets->map(fn($t) => $t->called_at->diffInSeconds($t->finished_at))
                ->filter(fn($sec) => $sec >= 30 && $sec <= 2700);

            if ($validDurations->count() > 0) {
                $avgServiceTime = round(($validDurations->sum() / $validDurations->count()) / 60, 1);
            }
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
        $currentlyServing = Ticket::where('status', 'called')->where('served_date', $today)->count();
        $waiting          = Ticket::where('status', 'waiting')->where('served_date', $today)->count();

        return response()->json([
            'done_today'        => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting'           => $waiting,
        ]);
    }
}
