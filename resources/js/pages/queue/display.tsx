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
  Sparkles,
  Info
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Color themes per service for high-contrast TV visibility
const DISPLAY_THEMES: Record<string, {
  color: string;
  bgGrad: string;
  accentBg: string;
  borderColor: string;
  icon: any;
}> = {
  'Poli Umum': {
    color: 'text-teal-600 dark:text-teal-400',
    bgGrad: 'from-teal-500 to-emerald-600',
    accentBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-500/30',
    icon: Stethoscope
  },
  'Poli Gigi': {
    color: 'text-sky-600 dark:text-sky-400',
    bgGrad: 'from-sky-500 to-blue-600',
    accentBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-500/30',
    icon: Smile
  },
  'Farmasi': {
    color: 'text-amber-600 dark:text-amber-400',
    bgGrad: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-500/30',
    icon: Pill
  },
  'Poli KIA (Kesehatan Ibu dan Anak)': {
    color: 'text-rose-600 dark:text-rose-400',
    bgGrad: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-500/30',
    icon: Baby
  },
  'Poli KIA': {
    color: 'text-rose-600 dark:text-rose-400',
    bgGrad: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-500/30',
    icon: Baby
  },
  'Laboratorium': {
    color: 'text-purple-600 dark:text-purple-400',
    bgGrad: 'from-purple-500 to-indigo-600',
    accentBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-500/30',
    icon: FlaskConical
  }
};

const DEFAULT_DISPLAY_THEME = {
  color: 'text-teal-600 dark:text-teal-400',
  bgGrad: 'from-teal-500 to-emerald-600',
  accentBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
  borderColor: 'border-teal-500/30',
  icon: HeartPulse
};

export default function Display() {
  const { data, loading } = useQueueStatus(3000); // Polling every 3 seconds for fast queue updates
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
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Monitor Display TV', href: '/queue/display' },
  ];

  // Live Clock updating every second
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

  // Auto-play sound when current ticket changes or when recalled
  useEffect(() => {
    if (!data || !prevDataRef.current) {
      prevDataRef.current = data;
      // Initialize latest call from first available active service
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
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/25">
                <Wifi className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">Menghubungkan ke server antrian display…</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Layar Display Antrian Poliklinik" />

      <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between gap-6">

        {/* ── Top Header Bar for Waiting Room TV ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-teal-500/30 shadow-2xl shadow-teal-500/10">
          {/* Clinic Branding */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/30">
                <HeartPulse className="h-7 w-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  Sistem Antrian Poliklinik
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hidden sm:inline-flex">
                  LIVE REAL-TIME
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Panggilan Suara Aktif • Ruang Tunggu Utama
              </p>
            </div>
          </div>

          {/* Clock & Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Live Digital Clock */}
            <div className="text-right px-5 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
              <div className="text-lg sm:text-xl font-black text-teal-300 font-mono tracking-wider">
                {currentTime || '00:00:00 WIB'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {currentDate || 'Memuat tanggal...'}
              </div>
            </div>

            {/* Audio Toggle & Test */}
            <div className="flex items-center gap-2">
              <Button
                variant={isEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={toggleSound}
                className={`h-11 px-4 rounded-2xl font-bold text-xs gap-2 transition-all ${
                  isEnabled
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 border-0'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="hidden sm:inline">{isEnabled ? 'Suara ON' : 'Suara OFF'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound('A-001', 'Poli Umum', 'Loket 1')}
                title="Uji coba speaker suara panggilan"
                className="h-11 px-3 rounded-2xl border-slate-700 text-slate-300 hover:bg-teal-500/10 hover:border-teal-500/40 text-xs font-bold"
              >
                <Megaphone className="h-4 w-4" />
                <span className="hidden lg:inline ml-1.5">Tes Speaker</span>
              </Button>

              {/* Fullscreen TV Mode */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Mode TV' : 'Mode Layar Penuh TV'}
                className="h-11 w-11 rounded-2xl border-slate-700 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all shrink-0"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5 text-teal-400" /> : <Maximize2 className="h-5 w-5 text-slate-300" />}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Featured Showcase: Panggilan Terkini / Hero Callout ── */}
        {latestCall && (
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border-2 border-teal-500/50 shadow-2xl shadow-teal-500/20 animate-pulse-ring">
            {/* Background glowing blur */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Column: Callout label */}
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="relative p-4 rounded-2xl bg-teal-500 text-white shadow-xl shadow-teal-500/40">
                  <Megaphone className="h-8 w-8 animate-bounce" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black tracking-widest uppercase mb-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
                    Panggilan Terkini
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {latestCall.service}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Silakan segera menuju <span className="text-teal-300 font-bold underline underline-offset-4">{latestCall.counter}</span>
                  </p>
                </div>
              </div>

              {/* Center: Gigantic Ticket Number */}
              <div className="text-center px-8 py-3 rounded-2xl bg-black/40 border border-teal-500/40 shadow-inner">
                <span className="text-xs uppercase tracking-widest text-teal-300/80 font-bold block mb-1">
                  Nomor Antrian
                </span>
                <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-widest text-teal-300 font-mono filter drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                  {latestCall.ticket}
                </span>
              </div>

              {/* Right Column: Audio Waves Indicator & Counter badge */}
              <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-500/30">
                  {latestCall.counter}
                </div>

                {/* Animated sound wave bars */}
                <div className="flex items-center gap-1.5 h-6 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30">
                  <span className="text-[11px] font-bold text-teal-300 mr-1">AUDIO</span>
                  <div className="w-1 bg-teal-400 rounded-full wave-bar-1" />
                  <div className="w-1 bg-teal-300 rounded-full wave-bar-2" />
                  <div className="w-1 bg-teal-400 rounded-full wave-bar-3" />
                  <div className="w-1 bg-teal-200 rounded-full wave-bar-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Global Summary Mini Ticker ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Total Pasien Menunggu', value: globalStats?.waiting ?? 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
            { label: 'Sedang Berlangsung Dilayani', value: globalStats?.currently_serving ?? 0, icon: Activity, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
            { label: 'Selesai Dilayani Hari Ini', value: globalStats?.done_today ?? 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border ${border} ${bg} backdrop-blur-md`}>
              <div className={`p-2.5 sm:p-3 rounded-2xl ${bg} shrink-0`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-2xl sm:text-3xl font-black ${color} tracking-tight font-mono`}>
                  {value}
                </div>
                <div className="text-xs sm:text-xs text-slate-400 font-medium truncate">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Services Display Cards Grid ── */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 flex-1">
          {data?.services?.map((service) => {
            const theme = DISPLAY_THEMES[service.service] || DEFAULT_DISPLAY_THEME;
            const IconComp = theme.icon;
            const isCurrentlyServing = Boolean(service.current);

            return (
              <div
                key={service.service}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isCurrentlyServing
                    ? 'bg-slate-900/90 border-2 border-teal-400/60 shadow-xl shadow-teal-500/15'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {/* Top Glowing bar */}
                {isCurrentlyServing && (
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.bgGrad}`} />
                )}

                <div>
                  {/* Service Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.bgGrad} text-white shadow-md shrink-0`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-base sm:text-lg text-white truncate leading-tight">
                          {service.service}
                        </h3>
                        {service.counter ? (
                          <span className="text-xs text-teal-400 font-semibold flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
                            {service.counter}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Loket Siaga</span>
                        )}
                      </div>
                    </div>

                    <Badge
                      className={`text-xs font-bold shrink-0 ${
                        service.total_waiting > 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-0'
                      }`}
                    >
                      {service.total_waiting} Menunggu
                    </Badge>
                  </div>

                  {/* Big Number Display */}
                  <div className="my-4 text-center py-4 px-6 rounded-2xl bg-black/40 border border-slate-800 shadow-inner">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Nomor Dipanggil
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest">
                      {service.current ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-200">
                          {service.current}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-normal text-4xl sm:text-5xl">
                          ---
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Tickets in Line */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium">Antrian Selanjutnya:</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {service.next?.length || 0} Tiket
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {service.next && service.next.length > 0 ? (
                      service.next.slice(0, 3).map((nextTicket, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 font-mono text-xs font-bold"
                        >
                          {nextTicket}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Tidak ada antrian menunggu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom Running Marquee Banner (Running Text) ── */}
        <div className="overflow-hidden rounded-2xl bg-teal-950/80 border border-teal-500/30 py-3 px-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-black uppercase tracking-wider shrink-0">
              <Info className="h-3.5 w-3.5" />
              INFO KLINIK
            </div>
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee text-xs sm:text-sm font-medium text-teal-200 tracking-wide">
                <span>
                  Selamat Datang di Poliklinik Rawat Jalan Terpadu • Harap perhatikan nomor antrian dan panggilan suara di layar monitor • Silakan siapkan kartu identitas (KTP/BPJS/Kartu Pasien) Anda sebelum menuju loket • Jam Pelayanan Poliklinik: Senin s/d Sabtu pukul 08:00 - 16:00 WIB • Demi kenyamanan bersama, mohon menjaga ketertiban di ruang tunggu • Terima kasih atas kepercayaan Anda.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
