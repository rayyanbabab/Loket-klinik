import { Head, Link } from '@inertiajs/react';
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
  Info,
  Home,
  LayoutDashboard,
  Radio
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

  // Live Clock in Indonesian format
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
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <Head title="Display Monitor Antrian Poliklinik" />
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-900/60 border border-teal-700 text-teal-300 mx-auto">
            <Wifi className="h-8 w-8 animate-pulse text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Menghubungkan ke Monitor Antrian</h2>
            <p className="text-xs text-slate-400 mt-1">Mengambil data layanan poliklinik secara langsung...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-5 lg:p-6 font-sans select-none overflow-x-hidden">
      <Head title="Monitor Display TV - Ruang Tunggu Pasien Rawat Jalan" />

      {/* Top TV Bar: Clinic Identity, Live Clock, and Screen Controls */}
      <header className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 mb-4 shrink-0">
        {/* Clinic Identity */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2.5 sm:p-3 rounded-xl bg-teal-800 text-white border border-teal-700/80 shadow-xs shrink-0">
            <HeartPulse className="h-6 w-6 sm:h-7 sm:w-7 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-white uppercase">
                Poliklinik Pratama Terpadu
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-900/90 text-teal-300 border border-teal-700">
                MONITOR RUANG TUNGGU
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Suara Terhubung • Silakan Menunggu Nomor Tiket Anda Dipanggil
            </p>
          </div>
        </div>

        {/* Live Clock & Interactive Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Digital Clock */}
          <div className="text-right px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-950/80 border border-slate-800 shadow-xs">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-teal-300 font-mono tracking-wider">
              {currentTime || '00:00:00 WIB'}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              {currentDate || 'Memuat tanggal...'}
            </div>
          </div>

          {/* Audio & TV Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
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
              className="h-9 px-2.5 sm:px-3 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              <Megaphone className="h-3.5 w-3.5 text-teal-400 sm:mr-1" />
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

            {/* Quick Exit Links */}
            <Link
              href="/"
              title="Kembali ke Beranda Publik"
              className="h-9 px-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
            >
              <Home className="h-4 w-4 sm:mr-1" />
              <span className="hidden xl:inline">Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Featured Call Spotlight Banner (Active Call / Recall) */}
      {latestCall && (
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border-2 border-teal-500 shadow-lg mb-4 shrink-0 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            {/* Callout Information */}
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="p-3.5 rounded-xl bg-teal-700 text-white shadow-xs shrink-0">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold tracking-wider uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  PANGGILAN AKTIF SEKARANG
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {latestCall.service}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Silakan segera menuju ke <span className="text-teal-300 font-bold underline decoration-teal-500 underline-offset-4">{latestCall.counter}</span>
                </p>
              </div>
            </div>

            {/* Huge High-Visibility Ticket Number */}
            <div className="text-center px-8 py-2.5 rounded-2xl bg-slate-950 border-2 border-teal-500/50 shadow-inner">
              <span className="text-[10px] uppercase tracking-widest text-teal-400 font-bold block mb-0.5">
                NOMOR TIKET
              </span>
              <span className="text-5xl sm:text-6xl font-black tracking-widest text-teal-300 font-mono">
                {latestCall.ticket}
              </span>
            </div>

            {/* Target Destination & Audio Wave Indicator */}
            <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <div className="px-4 py-2 rounded-xl bg-teal-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xs">
                {latestCall.counter}
              </div>

              <div className="flex items-center gap-1.5 h-6 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                {isEnabled ? (
                  <>
                    <span className="text-[10px] font-bold text-teal-300 mr-1.5">AUDIO AKTIF</span>
                    <div className="w-1 h-3 bg-teal-400 rounded-full animate-pulse" />
                    <div className="w-1 h-4 bg-teal-300 rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-2 bg-teal-400 rounded-full animate-pulse delay-150" />
                    <div className="w-1 h-3.5 bg-teal-200 rounded-full animate-pulse" />
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">AUDIO NONAKTIF</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 5-Service Grid Board */}
      <main className="grid gap-3.5 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 flex-1 items-stretch mb-4">
        {data?.services?.map((service) => {
          const IconComp = SERVICE_ICONS[service.service] || HeartPulse;
          const isCurrentlyServing = Boolean(service.current);

          return (
            <div
              key={service.service}
              className={`rounded-2xl p-4 sm:p-4.5 border flex flex-col justify-between transition-all ${
                isCurrentlyServing
                  ? 'bg-slate-900 border-teal-500/80 shadow-md ring-1 ring-teal-500/30'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div>
                {/* Service Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 shrink-0">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-white truncate" title={service.service}>
                        {service.service}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        {service.counter ? (
                          <span className="text-teal-400 font-semibold truncate">{service.counter}</span>
                        ) : (
                          <span className="text-slate-500">Loket Siaga</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {service.total_waiting} Antri
                  </span>
                </div>

                {/* Big Ticket Number Box */}
                <div className="my-2 text-center py-3.5 px-3 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    NOMOR DIPANGGIL
                  </span>
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-teal-300">
                    {service.current ? service.current : (
                      <span className="text-slate-700 font-normal text-3xl">---</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Waiting Tickets Chips */}
              <div className="pt-2.5 border-t border-slate-800/80 mt-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Antrian Berikutnya</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {service.next?.length || 0} Tiket
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 min-h-[26px] items-center">
                  {service.next && service.next.length > 0 ? (
                    service.next.slice(0, 3).map((nextTicket, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 font-mono text-xs font-bold"
                      >
                        {nextTicket}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Tidak ada antrian
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Global Quick Summary Mini Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 shrink-0">
        {[
          { label: 'Pasien Menunggu', value: globalStats?.waiting ?? 0, icon: Clock, color: 'text-sky-300', bg: 'bg-slate-900/90' },
          { label: 'Sedang Dilayani', value: globalStats?.currently_serving ?? 0, icon: Activity, color: 'text-amber-300', bg: 'bg-slate-900/90' },
          { label: 'Selesai Dilayani Hari Ini', value: globalStats?.done_today ?? 0, icon: CheckCircle, color: 'text-emerald-300', bg: 'bg-slate-900/90' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border border-slate-800 ${bg} shadow-xs`}>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className={`text-xl sm:text-2xl font-black ${color} font-mono leading-none`}>
                {value}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-1">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Running Announcement Marquee Ticker */}
      <footer className="rounded-xl bg-slate-900 border border-slate-800 py-2 px-4 shadow-md shrink-0 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-800 text-white text-[11px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
          <Info className="h-3 w-3 text-teal-200" />
          PENGUMUMAN
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee whitespace-nowrap text-xs font-medium text-slate-300 tracking-wide">
            <span>
              Selamat Datang di Poliklinik Pratama Terpadu • Harap perhatikan nomor antrian dan panggilan suara di layar monitor • Mohon siapkan berkas identitas (KTP / Kartu BPJS / Kartu Pasien) Anda sebelum memasuki loket poliklinik • Jam Pelayanan Rawat Jalan: Senin s/d Sabtu pukul 08:00 - 16:00 WIB • Demi kenyamanan bersama, mohon menjaga ketertiban di area ruang tunggu.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
