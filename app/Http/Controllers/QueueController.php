<?php

namespace App\Http\Controllers;

use App\Events\TicketCalled;
use App\Models\Call;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    /**
     * Clear dynamic queue caches upon any ticket state change
     */
    private function clearQueueCaches(?string $date = null): void
    {
        $date = $date ?? now()->toDateString();
        Cache::forget("queue_status_payload_{$date}");
        Cache::forget("queue_dashboard_stats_{$date}");
        Cache::forget("queue_global_stats_{$date}");
    }

    public function status()
    {
        $today = now()->toDateString();
        $cacheKey = "queue_status_payload_{$today}";

        // Micro-cache (2s) menyerap beban polling simultan dari Display TV, Kiosk, dan Panel Operator
        return response()->json(Cache::remember($cacheKey, 2, function () use ($today) {
            $services = Cache::remember('active_services_all', 120, function () {
                return Service::where('is_active', true)->orderBy('id')->get();
            });

            $serviceIds = $services->pluck('id');

            // 1 query untuk SEMUA tiket 'called' hari ini beserta relasi counter (mencegah N+1)
            $calledTickets = Ticket::with('counter:id,name')
                ->whereIn('service_id', $serviceIds)
                ->where('status', 'called')
                ->where('served_date', $today)
                ->orderByDesc('called_at')
                ->get(['id', 'service_id', 'counter_id', 'number_str', 'called_at'])
                ->groupBy('service_id');

            // 1 query untuk SEMUA tiket 'waiting' hari ini
            $waitingTickets = Ticket::whereIn('service_id', $serviceIds)
                ->where('status', 'waiting')
                ->where('served_date', $today)
                ->orderBy('number_int')
                ->get(['id', 'service_id', 'number_str', 'number_int'])
                ->groupBy('service_id');

            $payload = [];

            foreach ($services as $service) {
                $serviceCalled = $calledTickets->get($service->id);
                $current = $serviceCalled?->first();

                $serviceWaiting = $waitingTickets->get($service->id, collect());
                $next = $serviceWaiting->take(5)->pluck('number_str')->values()->all();
                $totalWaiting = $serviceWaiting->count();

                $payload[] = [
                    'service'         => $service->name,
                    'current'         => $current?->number_str,
                    'counter'         => $current?->counter?->name,
                    'next'            => $next,
                    'total_waiting'   => $totalWaiting,
                    'current_ticket'  => $current?->number_str,
                    'current_counter' => $current?->counter?->name,
                    'called_at'       => $current?->called_at?->timestamp,
                ];
            }

            return [
                'services'  => $payload,
                'timestamp' => now()->timestamp,
            ];
        }));
    }

    public function statusByService(Service $service)
    {
        $today = now()->toDateString();

        $current = Ticket::with('counter:id,name')
            ->where('service_id', $service->id)
            ->where('status', 'called')
            ->where('served_date', $today)
            ->latest('called_at')
            ->first();

        $next = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
            ->orderBy('number_int')
            ->take(5)
            ->pluck('number_str');

        return [
            'service' => $service->name,
            'current' => $current?->number_str,
            'counter' => $current?->counter?->name,
            'next'    => $next,
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

        // Hitung rata-rata waktu layanan hari ini (dalam menit) langsung di SQL database
        $avgServiceTime = 5; // default 5 menit
        $avgDuration = Ticket::where('service_id', $ticket->service_id)
            ->where('status', 'done')
            ->where('served_date', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (finished_at - called_at))) as avg_sec')
            ->whereRaw('EXTRACT(EPOCH FROM (finished_at - called_at)) BETWEEN 30 AND 2700')
            ->value('avg_sec');

        if ($avgDuration && $avgDuration > 0) {
            $avgServiceTime = max(1, round(($avgDuration / 60), 1));
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

        $this->clearQueueCaches($today);

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

        $this->clearQueueCaches($today);

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

        $this->clearQueueCaches(now()->toDateString());

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

        $this->clearQueueCaches(now()->toDateString());

        return $ticket->refresh();
    }

    public function services()
    {
        return Cache::remember('active_services_list', 300, function () {
            return Service::where('is_active', true)->orderBy('id')->get();
        });
    }

    public function counters()
    {
        return Cache::remember('active_counters_list', 300, function () {
            return Counter::with('service')->where('is_active', true)->orderBy('id')->get();
        });
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

        // 1 single query untuk status selesai & sedang dilayani
        $counterCounts = Ticket::where('counter_id', $counter->id)
            ->where('served_date', $today)
            ->whereIn('status', ['done', 'called'])
            ->selectRaw("
                COUNT(CASE WHEN status = 'done' THEN 1 END) as done_today,
                COUNT(CASE WHEN status = 'called' THEN 1 END) as currently_serving
            ")
            ->first();

        $waiting = Ticket::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->where('served_date', $today)
            ->count();

        return response()->json([
            'done_today'        => (int) ($counterCounts->done_today ?? 0),
            'currently_serving' => (int) ($counterCounts->currently_serving ?? 0),
            'waiting'           => $waiting,
        ]);
    }

    public function dashboardStats()
    {
        $today = now()->toDateString();
        $cacheKey = "queue_dashboard_stats_{$today}";

        return response()->json(Cache::remember($cacheKey, 5, function () use ($today) {
            $overall = Ticket::where('served_date', $today)
                ->selectRaw("
                    COUNT(*) as total_today,
                    COUNT(CASE WHEN status = 'done' THEN 1 END) as done_today,
                    COUNT(CASE WHEN status = 'called' THEN 1 END) as currently_serving,
                    COUNT(CASE WHEN status = 'waiting' THEN 1 END) as waiting
                ")
                ->first();

            $serviceStats = Service::withCount([
                'tickets as total_today' => fn($q) => $q->where('served_date', $today),
                'tickets as done_today'  => fn($q) => $q->where('status', 'done')->where('served_date', $today),
                'tickets as waiting'     => fn($q) => $q->where('status', 'waiting')->where('served_date', $today),
                'tickets as serving'     => fn($q) => $q->where('status', 'called')->where('served_date', $today),
            ])->where('is_active', true)->orderBy('id')->get();

            $counterStats = Counter::with('service')->withCount([
                'tickets as done_today' => fn($q) => $q->where('status', 'done')->where('served_date', $today),
                'tickets as serving'    => fn($q) => $q->where('status', 'called')->where('served_date', $today),
            ])->where('is_active', true)->orderBy('id')->get();

            $avgDuration = Ticket::where('status', 'done')
                ->where('served_date', $today)
                ->whereNotNull('called_at')
                ->whereNotNull('finished_at')
                ->selectRaw('AVG(EXTRACT(EPOCH FROM (finished_at - called_at))) as avg_sec')
                ->whereRaw('EXTRACT(EPOCH FROM (finished_at - called_at)) BETWEEN 30 AND 2700')
                ->value('avg_sec');

            $avgServiceTime = ($avgDuration && $avgDuration > 0)
                ? round(($avgDuration / 60), 1)
                : 0;

            return [
                'total_today'       => (int) ($overall->total_today ?? 0),
                'done_today'        => (int) ($overall->done_today ?? 0),
                'currently_serving' => (int) ($overall->currently_serving ?? 0),
                'waiting'           => (int) ($overall->waiting ?? 0),
                'avg_service_time'  => $avgServiceTime,
                'services'          => $serviceStats,
                'counters'          => $counterStats,
            ];
        }));
    }

    public function globalStats()
    {
        $today = now()->toDateString();
        $cacheKey = "queue_global_stats_{$today}";

        return response()->json(Cache::remember($cacheKey, 5, function () use ($today) {
            $stats = Ticket::where('served_date', $today)
                ->whereIn('status', ['done', 'called', 'waiting'])
                ->selectRaw("
                    COUNT(CASE WHEN status = 'done' THEN 1 END) as done_today,
                    COUNT(CASE WHEN status = 'called' THEN 1 END) as currently_serving,
                    COUNT(CASE WHEN status = 'waiting' THEN 1 END) as waiting
                ")
                ->first();

            return [
                'done_today'        => (int) ($stats->done_today ?? 0),
                'currently_serving' => (int) ($stats->currently_serving ?? 0),
                'waiting'           => (int) ($stats->waiting ?? 0),
            ];
        }));
    }
}
