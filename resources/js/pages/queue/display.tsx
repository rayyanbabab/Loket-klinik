import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueueStatus, useSoundSystem, useGlobalStats } from '@/hooks/useQueue';
import {
  Volume2,
  VolumeX,
  Users,
  Clock,
  CheckCircle,
  Wifi,
  Maximize2,
  Minimize2,
  Activity,
  Megaphone,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  HeartPulse,
  Info
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Clear medical icon mapping
const SERVICE_ICONS: Record<string, any> = {
  'Poli Umum': Stethoscope,
  'Poli Gigi': Smile,
  'Farmasi': Pill,
  'Poli KIA (Kesehatan Ibu dan Anak)': Baby,
  'Poli KIA': Baby,
  'Laboratorium': FlaskConical
};

export default function Display() {
  const { data, loading } = useQueueStatus(3000);
  const { stats: globalStats } = useGlobalStats(10000);
  const { isEnabled, playTicketCall, testSound, toggleSound } = useSoundSystem();

  const prevDataRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [latestCall, setLatestCall] = useState<{
    ticket: string;
    service: string;
    counter: string;
    timestamp: number;
  } | null>(null);

  const breadcrumbs = [
    { title: 'Layanan Antrian', href: '/queue/display' },
    { title: 'Monitor Display TV', href: '/queue/display' },
  ];

  // Live Clock updating every second in Indonesian format
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen TV Mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Auto-play sound when ticket is called or recalled
  useEffect(() => {
    if (!data || !prevDataRef.current) {
      prevDataRef.current = data;
      if (data?.services) {
        const active = data.services.find((s) => s.current);
        if (active && active.current) {
          setLatestCall({
            ticket: active.current,
            service: active.service,
            counter: active.counter || 'Loket',
            timestamp: Date.now()
          });
        }
      }
      return;
    }

    data.services?.forEach((service) => {
      const prevService = prevDataRef.current?.services?.find(
        (s: any) => s.service === service.service
      );

      const isNewTicket = Boolean(service.current && service.current !== prevService?.current);
      const isRecalled = Boolean(
        service.current &&
        prevService?.current === service.current &&
        service.called_at &&
        service.called_at !== prevService?.called_at
      );

      if ((isNewTicket || isRecalled) && service.current) {
        const ticketNum = service.current;
        const counterName = service.counter || 'Loket';

        setLatestCall({
          ticket: ticketNum,
          service: service.service,
          counter: counterName,
          timestamp: Date.now()
        });

        playTicketCall(ticketNum, service.service, counterName);
      }
    });

    prevDataRef.current = data;
  }, [data, playTicketCall]);

  if (loading && !data) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Display Antrian Poliklinik" />
        <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-900/60 border border-teal-700 text-teal-300 mx-auto">
              <Wifi className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              Menghubungkan ke monitor display antrian...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Layar Display Ruang Tunggu Poliklinik" />

      <div className="min-h-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between gap-5 font-sans">

        {/* Top Header Bar for Waiting Room TV */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Clinic Branding */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="p-3 rounded-xl bg-teal-800 text-white border border-teal-700 shrink-0">
              <HeartPulse className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                  Poliklinik Pratama Terpadu
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-teal-900/80 text-teal-300 border border-teal-700">
                  MONITOR RUANG TUNGGU
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Panggilan Audio Aktif • Silakan Menunggu Nomor Tiket Dipanggil
              </p>
            </div>
          </div>

          {/* Clock & TV Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700">
              <div className="text-base sm:text-lg font-bold text-teal-300 font-mono tracking-wider">
                {currentTime || '00:00:00 WIB'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {currentDate || 'Memuat tanggal...'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={toggleSound}
                className={`h-9 px-3 rounded-xl font-semibold text-xs gap-1.5 transition-colors ${
                  isEnabled
                    ? 'bg-teal-700 hover:bg-teal-800 text-white border-0'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="hidden sm:inline">{isEnabled ? 'Audio Aktif' : 'Mute'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound('A-001', 'Poli Umum', 'Loket 1')}
                title="Uji coba speaker suara panggilan"
                className="h-9 px-3 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                <Megaphone className="h-3.5 w-3.5 mr-1 text-teal-400" />
                <span className="hidden lg:inline">Tes Suara</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh TV'}
                className="h-9 w-9 rounded-xl border-slate-700 hover:bg-slate-800 text-slate-300 shrink-0"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 text-teal-400" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Showcase: Active Calling Ticket Spotlight */}
        {latestCall && (
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-900 border-2 border-teal-500/80 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              {/* Callout Information */}
              <div className="flex items-center gap-3.5 text-center md:text-left">
                <div className="p-3.5 rounded-xl bg-teal-700 text-white shrink-0">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold tracking-wider uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Panggilan Terkini
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {latestCall.service}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Silakan segera menuju ke <span className="text-teal-300 font-bold">{latestCall.counter}</span>
                  </p>
                </div>
              </div>

              {/* Big Solid Number Display */}
              <div className="text-center px-8 py-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                  Nomor Antrian
                </span>
                <span className="text-5xl sm:text-6xl font-bold tracking-widest text-teal-300 font-mono">
                  {latestCall.ticket}
                </span>
              </div>

              {/* Destination Loket & Audio Waves */}
              <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                <div className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-sm sm:text-base">
                  {latestCall.counter}
                </div>

                <div className="flex items-center gap-1 h-5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                  <span className="text-[10px] font-bold text-teal-300 mr-1">SUARA AKTIF</span>
                  <div className="w-1 bg-teal-400 rounded-full wave-bar-1" />
                  <div className="w-1 bg-teal-300 rounded-full wave-bar-2" />
                  <div className="w-1 bg-teal-400 rounded-full wave-bar-3" />
                  <div className="w-1 bg-teal-200 rounded-full wave-bar-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Summary Mini Counters */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pasien Menunggu', value: globalStats?.waiting ?? 0, icon: Clock, color: 'text-sky-300', bg: 'bg-slate-900' },
            { label: 'Sedang Dilayani', value: globalStats?.currently_serving ?? 0, icon: Activity, color: 'text-amber-300', bg: 'bg-slate-900' },
            { label: 'Selesai Hari Ini', value: globalStats?.done_today ?? 0, icon: CheckCircle, color: 'text-emerald-300', bg: 'bg-slate-900' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 ${bg}`}>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className={`text-xl sm:text-2xl font-bold ${color} font-mono leading-tight`}>
                  {value}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Poliklinik Services Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 flex-1">
          {data?.services?.map((service) => {
            const IconComp = SERVICE_ICONS[service.service] || HeartPulse;
            const isCurrentlyServing = Boolean(service.current);

            return (
              <div
                key={service.service}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-colors ${
                  isCurrentlyServing
                    ? 'bg-slate-900 border-teal-500/70 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div>
                  {/* Service Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate">
                          {service.service}
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {service.counter ? (
                            <span className="text-teal-400 font-semibold">{service.counter}</span>
                          ) : (
                            <span className="text-slate-500">Loket Siaga</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {service.total_waiting} Antri
                    </span>
                  </div>

                  {/* Number Display Box */}
                  <div className="my-3 text-center py-4 px-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                      Nomor Dipanggil
                    </span>
                    <div className="text-5xl font-bold font-mono tracking-wider text-teal-300">
                      {service.current ? service.current : (
                        <span className="text-slate-600 font-normal text-4xl">---</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Tickets in Line */}
                <div className="pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 text-[11px]">Antrian Berikutnya:</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {service.next?.length || 0} Tiket
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {service.next && service.next.length > 0 ? (
                      service.next.slice(0, 3).map((nextTicket, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-semibold"
                        >
                          {nextTicket}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Tidak ada antrian berikutnya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Running Information Marquee */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-800 text-white text-xs font-bold uppercase tracking-wider shrink-0">
              <Info className="h-3 w-3" />
              PENGUMUMAN
            </div>
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee text-xs font-medium text-slate-300 tracking-wide">
                <span>
                  Selamat Datang di Poliklinik Rawat Jalan Terpadu. Harap perhatikan nomor antrian dan panggilan suara di layar monitor. Silakan siapkan kartu identitas (KTP, BPJS, atau Kartu Pasien) Anda sebelum menuju ke loket poliklinik. Jam Operasional Pelayanan: Senin hingga Sabtu pukul 08:00 sampai 16:00 WIB. Demi kenyamanan bersama, mohon menjaga ketertiban di ruang tunggu.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
