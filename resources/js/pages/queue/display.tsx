import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueueStatus, useSoundSystem, useGlobalStats } from '@/hooks/useQueue';
import { Volume2, VolumeX, Users, Clock, CheckCircle, Wifi, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Display() {
  const { data, loading } = useQueueStatus(3000); // Polling every 3 seconds for fast queue display updates
  const { stats: globalStats } = useGlobalStats(15000); // Refresh every 15 seconds
  const { isEnabled, playTicketCall, toggleSound } = useSoundSystem();
  const prevDataRef = useRef<any>(null);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Display Antrian', href: '/queue/display' },
  ];

  // Auto-play sound when current ticket changes or when recalled
  useEffect(() => {
    if (!data || !prevDataRef.current) {
      prevDataRef.current = data;
      return;
    }

    // Deteksi perubahan nomor tiket ATAU timestamp pemanggilan ulang (recall)
    data.services?.forEach((service) => {
      const prevService = prevDataRef.current?.services?.find(
        (s: any) => s.service === service.service
      );
      
      const isNewTicket = service.current && service.current !== prevService?.current;
      const isRecalled = service.current && prevService?.current === service.current && service.called_at && service.called_at !== prevService?.called_at;

      if (isNewTicket || isRecalled) {
        playTicketCall(service.current, service.service, service.counter || 'Counter');
      }
    });

    prevDataRef.current = data;
  }, [data, playTicketCall]);


  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Display Antrian" />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600">
                <Wifi className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Memuat data antrian…</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Display Antrian" />

      <div className="min-h-full bg-gradient-to-b from-background to-muted/30 p-6 space-y-6">

        {/* ── Header Bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Display Antrian</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Memperbarui otomatis setiap 3 detik
              </p>
            </div>
          </div>

          <Button
            variant={isEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={toggleSound}
            className={`gap-2 transition-all ${isEnabled ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25' : ''}`}
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isEnabled ? 'Suara ON' : 'Suara OFF'}
          </Button>
        </div>

        {/* ── Global Stats Strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Menunggu', value: globalStats?.waiting ?? 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: 'Sedang Dilayani', value: globalStats?.currently_serving ?? 0, icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
            { label: 'Selesai Hari Ini', value: globalStats?.done_today ?? 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`flex items-center gap-3 p-4 rounded-2xl border ${border} ${bg}`}>
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Service Cards ── */}
        <div className="grid gap-4 md:grid-cols-2">
          {data?.services?.map((service) => (
            <div
              key={service.service}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                service.current
                  ? 'border-teal-500/40 bg-gradient-to-br from-teal-500/5 via-background to-emerald-500/5 shadow-lg shadow-teal-500/10'
                  : 'border-border bg-card hover:shadow-md'
              }`}
            >
              {service.current && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />
              )}

              <div className="p-5 space-y-4">
                {/* Service header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-foreground">{service.service}</h2>
                    {service.current && service.counter && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block" />
                        {service.counter}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${service.total_waiting > 0 ? 'border-amber-400/50 text-amber-600 bg-amber-50 dark:bg-amber-950/30' : 'text-muted-foreground'}`}
                  >
                    {service.total_waiting || 0} menunggu
                  </Badge>
                </div>

                {/* Current ticket – big number display */}
                <div className={`rounded-xl p-5 text-center transition-all ${
                  service.current
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md shadow-teal-500/30'
                    : 'bg-muted/50'
                }`}>
                  <p className={`text-xs font-semibold mb-1 uppercase tracking-widest ${service.current ? 'text-teal-100' : 'text-muted-foreground'}`}>
                    Sedang Dilayani
                  </p>
                  <div className={`text-5xl font-black tracking-wider ${service.current ? 'text-white' : 'text-muted-foreground/25'}`}>
                    {service.current || '—'}
                  </div>
                </div>

                {/* Next queue preview */}
                {service.next && service.next.length > 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      Antrian berikutnya
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.next.map((ticket, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className={`text-xs font-bold ${idx === 0 ? 'bg-primary/15 text-primary border border-primary/30' : ''}`}
                        >
                          {ticket}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  !service.current && (
                    <p className="text-xs text-muted-foreground italic text-center">Tidak ada antrian</p>
                  )
                )}
              </div>
            </div>
          ))}

          {(!data?.services || data.services.length === 0) && (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Wifi className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Tidak ada layanan aktif saat ini</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
