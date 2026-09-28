import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  useQueueStatus,
  useQueueActions,
  useCounters,
  useCurrentTicket,
  useSoundSystem,
  useNotifications,
  useCounterStats
} from '@/hooks/useQueue';
import {
  Volume2,
  VolumeX,
  Phone,
  Clock,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FastForward,
  Users,
  PhoneCall,
  ArrowRight,
  Headphones,
  Timer,
  Keyboard,
  Sparkles,
  Megaphone,
  Activity,
  CheckCircle2,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  HeartPulse
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Icon mapping per service
const SERVICE_ICONS: Record<string, any> = {
  'Poli Umum': Stethoscope,
  'Poli Gigi': Smile,
  'Farmasi': Pill,
  'Poli KIA (Kesehatan Ibu dan Anak)': Baby,
  'Poli KIA': Baby,
  'Laboratorium': FlaskConical
};

export default function Management() {
  const { data, refetch: refetchQueueStatus } = useQueueStatus(3000);
  const { counters } = useCounters();
  const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
  const { currentTicket, refetch: refetchCurrentTicket } = useCurrentTicket(selectedCounter);
  const { stats, refetch: refetchStats } = useCounterStats(selectedCounter);
  const { callNext, recall, finish, loading } = useQueueActions();
  const { isEnabled, volume, playTicketCall, testSound, toggleSound, updateVolume } = useSoundSystem();
  const { notification, showNotification } = useNotifications();

  const [isServing, setIsServing] = useState(false);
  const [servingTicket, setServingTicket] = useState<any>(null);
  const [serviceTimer, setServiceTimer] = useState<number>(0);

  const isServingRef = useRef(isServing);
  const servingTicketRef = useRef(servingTicket);

  useEffect(() => { isServingRef.current = isServing; }, [isServing]);
  useEffect(() => { servingTicketRef.current = servingTicket; }, [servingTicket]);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Panel Operator Loket', href: '/queue/management' },
  ];

  // Sync state with current ticket from backend
  useEffect(() => {
    if (currentTicket) {
      setIsServing(true);
      setServingTicket(currentTicket);
      // Calculate elapsed time if ticket has called_at
      if (currentTicket.called_at) {
        const calledTime = new Date(currentTicket.called_at).getTime();
        const diffSeconds = Math.max(0, Math.floor((Date.now() - calledTime) / 1000));
        setServiceTimer(diffSeconds);
      } else {
        setServiceTimer(0);
      }
    } else {
      setIsServing(false);
      setServingTicket(null);
      setServiceTimer(0);
    }
  }, [currentTicket]);

  // Reset when changing counter
  useEffect(() => {
    setIsServing(false);
    setServingTicket(null);
    setServiceTimer(0);
  }, [selectedCounter]);

  // Live Consultation Stopwatch Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isServing && servingTicket) {
      interval = setInterval(() => {
        setServiceTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setServiceTimer(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isServing, servingTicket]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWaitingCount = useCallback(() => {
    if (!selectedCounter || !counters || !data) return 0;
    const counter = counters.find((c) => c.id === selectedCounter);
    const service = data.services?.find((s) => s.service === counter?.service.name);
    return service?.total_waiting || 0;
  }, [selectedCounter, counters, data]);

  const getNextTickets = useCallback(() => {
    if (!selectedCounter || !counters || !data) return [];
    const counter = counters.find((c) => c.id === selectedCounter);
    const service = data.services?.find((s) => s.service === counter?.service.name);
    return service?.next || [];
  }, [selectedCounter, counters, data]);

  const getCounterInfo = useCallback(() => {
    if (!selectedCounter || !counters) return null;
    return counters.find((c) => c.id === selectedCounter);
  }, [selectedCounter, counters]);

  // Call Next Ticket Execution
  const executeCallNext = useCallback(async (counterId: number) => {
    try {
      const ticket = await callNext(counterId);
      if (ticket) {
        setIsServing(true);
        setServingTicket(ticket);
        setServiceTimer(0);

        const counter = counters?.find((c) => c.id === counterId);
        if (counter && isEnabled) {
          setTimeout(() => {
            playTicketCall(ticket.number_str, counter.service.name, counter.name);
          }, 300);
        }

        setTimeout(() => {
          refetchCurrentTicket();
          refetchQueueStatus();
          refetchStats();
        }, 500);

        showNotification(`Memanggil nomor ${ticket.number_str} ke ${counter?.name || 'loket'}`, 'success');
        return ticket;
      }
    } catch {
      showNotification('Gagal memanggil antrian. Silakan coba lagi.', 'error');
    }
    return null;
  }, [callNext, counters, isEnabled, playTicketCall, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const handleCallNext = useCallback(async () => {
    if (!selectedCounter) return;
    if (isServingRef.current && servingTicketRef.current) {
      showNotification('Selesaikan pelayanan pasien saat ini terlebih dahulu.', 'warning');
      return;
    }
    await executeCallNext(selectedCounter);
  }, [selectedCounter, executeCallNext, showNotification]);

  const handleRecall = useCallback(async () => {
    if (!servingTicket || !selectedCounter) return;

    try {
      const ticket = await recall(servingTicket.id);
      if (ticket) {
        const counter = counters?.find((c) => c.id === selectedCounter);
        if (counter && isEnabled) {
          setTimeout(() => {
            playTicketCall(ticket.number_str, counter.service.name, counter.name);
          }, 300);
        }
        showNotification(`Panggil ulang nomor ${ticket.number_str}`, 'info');
      }
    } catch {
      showNotification('Gagal memanggil ulang nomor antrian.', 'error');
    }
  }, [servingTicket, selectedCounter, recall, counters, isEnabled, playTicketCall, showNotification]);

  const handleFinish = useCallback(async () => {
    if (!servingTicketRef.current) return;

    try {
      const finishedNumber = servingTicketRef.current.number_str;
      const ticket = await finish(servingTicketRef.current.id);

      if (ticket !== null) {
        setIsServing(false);
        setServingTicket(null);
        setServiceTimer(0);

        await Promise.all([
          refetchCurrentTicket(),
          refetchQueueStatus(),
          refetchStats()
        ]);

        showNotification(`Pelayanan tiket ${finishedNumber} telah selesai`, 'success');
      }
    } catch {
      showNotification('Gagal menyelesaikan pelayanan.', 'error');
    }
  }, [finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const handleFinishAndNext = useCallback(async () => {
    if (!selectedCounter) return;
    const currentTicketToFinish = servingTicketRef.current;
    const currentNumber = currentTicketToFinish?.number_str;

    // Backend callNext automatically finishes current called ticket
    const nextTicket = await executeCallNext(selectedCounter);

    if (nextTicket) {
      showNotification(`Nomor ${currentNumber || 'sebelumnya'} selesai. Memanggil ${nextTicket.number_str}`, 'success');
    } else {
      if (currentTicketToFinish) {
        await finish(currentTicketToFinish.id);
        setIsServing(false);
        setServingTicket(null);
        setServiceTimer(0);

        await Promise.all([
          refetchCurrentTicket(),
          refetchQueueStatus(),
          refetchStats()
        ]);
        showNotification(`Nomor ${currentNumber} selesai. Tidak ada antrian tersisa.`, 'info');
      }
    }
  }, [selectedCounter, executeCallNext, finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (isServingRef.current) {
          handleFinishAndNext();
        } else {
          handleCallNext();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (isServingRef.current) {
          e.preventDefault();
          handleRecall();
        }
      } else if (e.key === 's' || e.key === 'S') {
        if (isServingRef.current) {
          e.preventDefault();
          handleFinish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinishAndNext, handleCallNext, handleRecall, handleFinish]);

  const waitingCount = getWaitingCount();
  const nextTickets = getNextTickets();
  const counterInfo = getCounterInfo();
  const ServiceIcon = (counterInfo ? SERVICE_ICONS[counterInfo.service.name] : null) || HeartPulse;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel Operator Loket Poliklinik" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ── Notification Toast ── */}
        {notification && (
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold shadow-lg transition-all animate-in slide-in-from-top-2 ${
              notification.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                : notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : notification.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {!selectedCounter ? (
          /* ── No Counter Selected Landing Screen ── */
          <div className="flex items-center justify-center min-h-[calc(100vh-220px)]">
            <div className="w-full max-w-lg space-y-6 text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse" />
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/30">
                  <Headphones className="h-12 w-12 text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Panel Petugas Loket
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Silakan pilih loket pelayanan Anda untuk mulai memanggil dan melayani pasien
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {counters?.map((counter) => {
                  const Icon = SERVICE_ICONS[counter.service.name] || HeartPulse;
                  return (
                    <button
                      key={counter.id}
                      type="button"
                      onClick={() => setSelectedCounter(counter.id)}
                      className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 hover:bg-teal-500/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-emerald-600 group-hover:text-white transition-all shadow-sm">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {counter.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {counter.service.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 hidden sm:inline">
                          Buka Loket
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Main Operator Panel Layout ── */
          <div className="space-y-6">

            {/* Top Bar with Counter Info, Audio Center & Quick Switch */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
              {/* Active Counter Header */}
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 shrink-0">
                  <ServiceIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {counterInfo?.name}
                    </h1>
                    <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 text-xs font-bold">
                      AKTIF
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Layanan: <span className="font-bold text-foreground">{counterInfo?.service.name}</span>
                  </p>
                </div>
              </div>

              {/* Sound Controls & Switcher */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Sound toggle & volume */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSound}
                    className="h-8 w-8 rounded-lg"
                    title={isEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
                  >
                    {isEnabled ? <Volume2 className="h-4 w-4 text-teal-600" /> : <VolumeX className="h-4 w-4 text-red-500" />}
                  </Button>

                  <div className="w-20 sm:w-24 px-1">
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={5}
                      onValueChange={(vals) => updateVolume(vals[0] / 100)}
                      className="cursor-pointer"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testSound('A-001', counterInfo?.service.name || 'Poli Umum', counterInfo?.name || 'Loket 1')}
                    className="h-8 px-2.5 rounded-xl text-xs font-bold border-slate-300 dark:border-slate-600 hover:bg-teal-500/10"
                    title="Uji coba suara panggilan loket"
                  >
                    <Megaphone className="h-3.5 w-3.5 mr-1 text-teal-600" />
                    Tes
                  </Button>
                </div>

                {/* Counter Selector Dropdown */}
                <Select
                  value={selectedCounter.toString()}
                  onValueChange={(val) => setSelectedCounter(Number(val))}
                >
                  <SelectTrigger className="w-[180px] h-11 rounded-2xl font-bold border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Pilih Loket" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {counters?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()} className="font-medium">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Interactive Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Left 2 Columns: Primary Action Console ── */}
              <div className="lg:col-span-2 space-y-6">

                {isServing && servingTicket ? (
                  /* ── STATE: SERVING PATIENT ── */
                  <Card className="rounded-3xl border-2 border-orange-400 dark:border-orange-500 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="flex h-3.5 w-3.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white" />
                        </span>
                        <span className="font-black text-sm tracking-wider uppercase">
                          SEDANG DILAYANI DI LOKET
                        </span>
                      </div>

                      {/* Live Consultation Stopwatch Badge */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/20">
                        <Timer className="h-4 w-4 animate-spin" />
                        <span className="font-mono font-black text-sm tracking-wider">
                          {formatTimer(serviceTimer)}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-8">
                      {/* Big Ticket Display */}
                      <div className="text-center py-6 px-4 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-100/30 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-orange-900/10 border-2 border-dashed border-orange-300 dark:border-orange-700/50">
                        <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">
                          NOMOR TIKET PASIEN AKTIF
                        </span>
                        <div className="text-7xl sm:text-8xl lg:text-9xl font-black text-orange-600 dark:text-orange-400 font-mono tracking-wider my-1 filter drop-shadow-sm">
                          {servingTicket.number_str}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-2">
                          Pasien sedang berada di hadapan loket atau menuju ruang pelayanan
                        </p>
                      </div>

                      {/* Operator Action Buttons */}
                      <div className="space-y-4">
                        {/* Primary: Selesai & Panggil Berikutnya */}
                        <Button
                          onClick={handleFinishAndNext}
                          disabled={loading}
                          size="lg"
                          className="w-full h-16 text-lg font-black bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-between px-6"
                        >
                          <div className="flex items-center gap-3">
                            <FastForward className="h-6 w-6" />
                            <span>SELESAI & PANGGIL BERIKUTNYA</span>
                          </div>
                          <kbd className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-mono font-bold">
                            Space / Enter
                          </kbd>
                        </Button>

                        {/* Secondary Actions Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button
                            onClick={handleRecall}
                            disabled={loading}
                            size="lg"
                            variant="outline"
                            className="h-14 font-extrabold text-base rounded-2xl border-2 border-blue-500/60 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-between px-5"
                          >
                            <div className="flex items-center gap-2">
                              <RotateCcw className="h-5 w-5 text-blue-600" />
                              <span>Panggil Ulang</span>
                            </div>
                            <kbd className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-mono font-bold">
                              R
                            </kbd>
                          </Button>

                          <Button
                            onClick={handleFinish}
                            disabled={loading}
                            size="lg"
                            variant="outline"
                            className="h-14 font-extrabold text-base rounded-2xl border-2 border-emerald-500/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-between px-5"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-emerald-600" />
                              <span>Selesai Saja</span>
                            </div>
                            <kbd className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold">
                              S
                            </kbd>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* ── STATE: IDLE / READY TO CALL ── */
                  <Card className="rounded-3xl border-2 border-teal-500/30 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2 font-black text-sm tracking-wider uppercase">
                        <Phone className="h-4 w-4" />
                        LOKET SIAP MEMANGGIL
                      </div>
                      <Badge className="bg-white/20 text-white border-0 text-xs font-bold">
                        {waitingCount} Pasien Menunggu
                      </Badge>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-8">
                      {/* Next Ticket Preview */}
                      <div className="text-center py-8 px-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground mb-2 block">
                          ANTRIAN BERIKUTNYA YANG MENUNGGU
                        </span>
                        <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-wider my-2 text-slate-800 dark:text-slate-100">
                          {waitingCount > 0 ? (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                              {nextTickets[0] || '---'}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">---</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {waitingCount > 0
                            ? `Ada ${waitingCount} pasien menunggu giliran di ruang tunggu`
                            : 'Belum ada pasien yang mengambil tiket untuk layanan ini'}
                        </p>
                      </div>

                      {/* Primary Call Next Button */}
                      <Button
                        onClick={handleCallNext}
                        disabled={loading || waitingCount === 0}
                        size="lg"
                        className="w-full h-16 text-lg font-black bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/35 transition-all flex items-center justify-between px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <Phone className="h-6 w-6" />
                          <span>
                            {waitingCount > 0 ? 'PANGGIL ANTRIAN BERIKUTNYA' : 'TIDAK ADA ANTRIAN MENUNGGU'}
                          </span>
                        </div>
                        {waitingCount > 0 && (
                          <kbd className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-mono font-bold">
                            Space / Enter
                          </kbd>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Keyboard Shortcuts Hint Bar */}
                <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4 text-teal-600" />
                    <span className="font-bold text-foreground">Shortcut Keyboard:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold shadow-sm">Space</kbd> Panggil / Selesai
                    </span>
                    <span>
                      <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold shadow-sm">R</kbd> Panggil Ulang
                    </span>
                    <span>
                      <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-mono font-bold shadow-sm">S</kbd> Selesai Saja
                    </span>
                  </div>
                </div>

              </div>

              {/* ── Right Column: Stats & Queue List ── */}
              <div className="space-y-6">

                {/* Counter Statistics Mini Cards */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/50 flex items-center gap-3">
                    <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-md shadow-blue-500/20 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {waitingCount}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium truncate">
                        Menunggu
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/50 flex items-center gap-3">
                    <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-md shadow-orange-500/20 shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">
                        {isServing ? 1 : 0}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium truncate">
                        Sedang Dilayani
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-md shadow-emerald-500/20 shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {stats?.done_today ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium truncate">
                        Selesai Hari Ini
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue Waiting List Card */}
                <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-base font-extrabold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-teal-600" />
                        Daftar Antrian Menunggu
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs font-bold">
                        {waitingCount} Total
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Urutan pasien berikutnya untuk layanan {counterInfo?.service.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    {nextTickets.length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <Clock className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                          Tidak ada antrian menunggu
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Nomor baru akan otomatis muncul saat pasien mengambil tiket
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {nextTickets.slice(0, 8).map((ticket, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                              index === 0
                                ? 'bg-teal-500/10 border-2 border-teal-500/40 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-mono ${
                                  index === 0
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <span className={`text-lg font-black font-mono ${index === 0 ? 'text-teal-700 dark:text-teal-300' : 'text-foreground'}`}>
                                  {ticket}
                                </span>
                              </div>
                            </div>

                            {index === 0 ? (
                              <Badge className="bg-teal-500 text-white text-[11px] font-bold">
                                BERIKUTNYA
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-muted-foreground font-medium">
                                Antrian #{index + 1}
                              </span>
                            )}
                          </div>
                        ))}

                        {waitingCount > 8 && (
                          <div className="text-center py-2 text-xs font-bold text-muted-foreground">
                            +{waitingCount - 8} pasien lainnya menunggu
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>

            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
}
