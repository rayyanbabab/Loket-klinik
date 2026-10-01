import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { type SharedData } from '@/types';
import { getRoleBadgeInfo } from '@/components/user-info';
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
  Timer,
  Keyboard,
  Megaphone,
  CheckCircle2,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

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
  const { auth } = usePage<SharedData>().props;
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
    { title: 'Layanan Antrian', href: '/queue/display' },
    { title: 'Panel Operator Loket', href: '/queue/management' },
  ];

  const userRole = auth?.user?.role || 'operator';
  const roleBadge = getRoleBadgeInfo(userRole);
  const RoleIcon = roleBadge.icon;

  // Sync state with current ticket from backend
  useEffect(() => {
    if (currentTicket) {
      setIsServing(true);
      setServingTicket(currentTicket);
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
    await executeCallNext(selectedCounter);
  }, [selectedCounter, executeCallNext]);

  const handleRecall = useCallback(async () => {
    if (!selectedCounter || !servingTicketRef.current) return;
    try {
      await recall(servingTicketRef.current.id);
      const counter = counters?.find((c) => c.id === selectedCounter);
      if (counter && isEnabled) {
        playTicketCall(servingTicketRef.current.number_str, counter.service.name, counter.name);
      }
      showNotification(`Memanggil ulang nomor ${servingTicketRef.current.number_str}`, 'info');
    } catch {
      showNotification('Gagal memanggil ulang antrian.', 'error');
    }
  }, [selectedCounter, recall, counters, isEnabled, playTicketCall, showNotification]);

  const handleFinish = useCallback(async () => {
    if (!selectedCounter || !servingTicketRef.current) return;
    try {
      const finishedNumber = servingTicketRef.current.number_str;
      await finish(servingTicketRef.current.id);
      setIsServing(false);
      setServingTicket(null);
      setServiceTimer(0);
      await Promise.all([
        refetchCurrentTicket(),
        refetchQueueStatus(),
        refetchStats()
      ]);
      showNotification(`Nomor ${finishedNumber} selesai dilayani.`, 'success');
    } catch {
      showNotification('Gagal menyelesaikan tiket antrian.', 'error');
    }
  }, [selectedCounter, finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const handleFinishAndNext = useCallback(async () => {
    if (!selectedCounter) return;
    const currentNumber = servingTicketRef.current?.number_str;
    if (servingTicketRef.current) {
      await finish(servingTicketRef.current.id);
    }
    const next = await executeCallNext(selectedCounter);
    if (!next) {
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
  }, [selectedCounter, executeCallNext, finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

        {/* Notification Toast */}
        {notification && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
              notification.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-teal-600" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {!selectedCounter ? (
          /* Selection Screen: No Loket Chosen */
          <div className="flex items-center justify-center min-h-[calc(100vh-240px)]">
            <div className="w-full max-w-lg space-y-6 text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto">
                <Headphones className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Pilih Meja Loket Bertugas
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border ${roleBadge.className}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleBadge.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Petugas: <span className="font-semibold text-slate-800 dark:text-slate-200">{auth?.user?.name || 'Operator'}</span>. Pilih loket poliklinik tempat Anda bertugas hari ini.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {counters?.map((counter) => {
                  const Icon = SERVICE_ICONS[counter.service.name] || HeartPulse;
                  return (
                    <button
                      key={counter.id}
                      type="button"
                      onClick={() => setSelectedCounter(counter.id)}
                      className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                            {counter.name}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {counter.service.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                          Buka Loket
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}

                {(!counters || counters.length === 0) && (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Tidak ada counter loket aktif yang terdaftar di sistem.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Main Operator Desk Workspace */
          <div className="space-y-6">

            {/* Top Bar with Counter Info, Audio Controls & Quick Counter Switch */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
                  <ServiceIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {counterInfo?.name}
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Loket Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Layanan: <span className="font-semibold text-slate-800 dark:text-slate-200">{counterInfo?.service.name}</span> • Operator: <span className="font-semibold text-slate-800 dark:text-slate-200">{auth?.user?.name}</span>
                  </p>
                </div>
              </div>

              {/* Sound Controls & Counter Switcher */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSound}
                    className="h-7 w-7 rounded-lg"
                    title={isEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
                  >
                    {isEnabled ? <Volume2 className="h-4 w-4 text-teal-600" /> : <VolumeX className="h-4 w-4 text-rose-500" />}
                  </Button>

                  <div className="w-20 px-1">
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
                    className="h-7 px-2 text-xs font-semibold border-slate-300 dark:border-slate-600"
                    title="Uji coba suara panggilan"
                  >
                    <Megaphone className="h-3 w-3 mr-1 text-teal-600" />
                    Tes Suara
                  </Button>
                </div>

                <Select
                  value={selectedCounter.toString()}
                  onValueChange={(val) => setSelectedCounter(Number(val))}
                >
                  <SelectTrigger className="w-[170px] h-10 rounded-xl text-xs font-semibold border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Pilih Loket" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {counters?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()} className="text-xs font-medium">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Interactive Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left 2 Columns: Primary Calling Console */}
              <div className="lg:col-span-2 space-y-6">

                {isServing && servingTicket ? (
                  /* STATE: Serving Patient */
                  <Card className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/80 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-200">
                          Sedang Berkonsultasi di Meja Loket
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold">
                        <Timer className="h-3.5 w-3.5" />
                        <span>{formatTimer(serviceTimer)}</span>
                      </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                      <div className="text-center py-6 px-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50">
                        <span className="text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 mb-1 block">
                          Nomor Tiket Pasien Aktif
                        </span>
                        <div className="text-6xl sm:text-7xl font-bold text-amber-800 dark:text-amber-300 font-mono tracking-wider my-1">
                          {servingTicket.number_str}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Pasien sedang berada di hadapan loket pelayanan
                        </p>
                      </div>

                      {/* Operator Action Buttons */}
                      <div className="space-y-3">
                        <Button
                          onClick={handleFinishAndNext}
                          disabled={loading}
                          size="lg"
                          className="w-full h-14 text-sm sm:text-base font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm transition-colors flex items-center justify-between px-5"
                        >
                          <div className="flex items-center gap-2.5">
                            <FastForward className="h-5 w-5" />
                            <span>Selesai & Panggil Berikutnya</span>
                          </div>
                          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-teal-800/80 text-teal-100 text-xs font-mono font-semibold">
                            Space / Enter
                          </kbd>
                        </Button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            onClick={handleRecall}
                            disabled={loading}
                            size="lg"
                            variant="outline"
                            className="h-11 font-semibold text-xs sm:text-sm rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between px-4"
                          >
                            <div className="flex items-center gap-2">
                              <RotateCcw className="h-4 w-4 text-sky-600" />
                              <span>Panggil Ulang Suara</span>
                            </div>
                            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold">
                              R
                            </kbd>
                          </Button>

                          <Button
                            onClick={handleFinish}
                            disabled={loading}
                            size="lg"
                            variant="outline"
                            className="h-11 font-semibold text-xs sm:text-sm rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between px-4"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Tandai Selesai Saja</span>
                            </div>
                            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold">
                              S
                            </kbd>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* STATE: Idle / Ready to Call */
                  <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Meja Loket Siap Memanggil
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {waitingCount} Pasien Menunggu
                      </span>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                      <div className="text-center py-8 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1 block">
                          Antrian Berikutnya yang Menunggu
                        </span>
                        <div className="text-6xl sm:text-7xl font-bold font-mono tracking-wider my-2 text-slate-900 dark:text-white">
                          {waitingCount > 0 ? (nextTickets[0] || '---') : '---'}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {waitingCount > 0
                            ? `Terdapat ${waitingCount} pasien menunggu giliran di ruang tunggu`
                            : 'Belum ada antrian yang menunggu untuk layanan ini'}
                        </p>
                      </div>

                      <Button
                        onClick={handleCallNext}
                        disabled={loading || waitingCount === 0}
                        size="lg"
                        className="w-full h-14 text-sm sm:text-base font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm transition-colors flex items-center justify-between px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-2.5">
                          <Phone className="h-5 w-5" />
                          <span>
                            {waitingCount > 0 ? 'Panggil Nomor Antrian Berikutnya' : 'Tidak Ada Antrian Menunggu'}
                          </span>
                        </div>
                        {waitingCount > 0 && (
                          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-teal-800/80 text-teal-100 text-xs font-mono font-semibold">
                            Space / Enter
                          </kbd>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Keyboard Shortcuts Hint Bar */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200">
                    <Keyboard className="h-4 w-4 text-teal-600" />
                    <span>Pintasan Keyboard:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 font-medium">
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono font-semibold text-[11px]">Space</kbd> Panggil / Selesai
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono font-semibold text-[11px]">R</kbd> Panggil Ulang
                    </span>
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono font-semibold text-[11px]">S</kbd> Selesai Saja
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Mini Counter Stats & Queue Waiting List */}
              <div className="space-y-6">

                {/* Counter Statistics Mini Cards */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-lg shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-bold text-sky-700 dark:text-sky-300 font-mono">
                        {waitingCount}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        Menunggu Giliran
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-bold text-amber-700 dark:text-amber-300 font-mono">
                        {isServing ? 1 : 0}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        Sedang Dilayani
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {stats?.done_today ?? 0}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        Pasien Selesai
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue Waiting List Card */}
                <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-teal-600" />
                        Antrian Menunggu
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {waitingCount} Tiket
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Urutan pasien berikutnya di {counterInfo?.service.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-3.5">
                    {nextTickets.length === 0 ? (
                      <div className="text-center py-8 space-y-1.5">
                        <Clock className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Tidak ada antrian menunggu
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Nomor baru akan otomatis tertera saat pasien mengambil tiket
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {nextTickets.slice(0, 8).map((ticket, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                              index === 0
                                ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono ${
                                  index === 0
                                    ? 'bg-teal-700 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <span className={`text-base font-bold font-mono ${index === 0 ? 'text-teal-800 dark:text-teal-200' : 'text-slate-800 dark:text-slate-200'}`}>
                                {ticket}
                              </span>
                            </div>

                            {index === 0 ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white">
                                BERIKUTNYA
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Antrian ke-{index + 1}
                              </span>
                            )}
                          </div>
                        ))}

                        {waitingCount > 8 && (
                          <div className="text-center py-1 text-xs font-medium text-slate-500">
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
