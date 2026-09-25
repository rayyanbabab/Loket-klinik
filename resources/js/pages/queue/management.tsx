import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQueueStatus, useQueueActions, useCounters, useCurrentTicket, useSoundSystem, useNotifications, useCounterStats } from '@/hooks/useQueue';
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
  Headphones
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function Management() {
  const { data, refetch: refetchQueueStatus } = useQueueStatus();
  const { counters } = useCounters();
  const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
  const { currentTicket, refetch: refetchCurrentTicket } = useCurrentTicket(selectedCounter);
  const { stats, refetch: refetchStats } = useCounterStats(selectedCounter);
  const { callNext, recall, finish, loading } = useQueueActions();
  const { isEnabled, playTicketCall, toggleSound } = useSoundSystem();
  const { notification, showNotification } = useNotifications();
  const [isServing, setIsServing] = useState(false);
  const [servingTicket, setServingTicket] = useState<any>(null);

  const isServingRef = useRef(isServing);
  const servingTicketRef = useRef(servingTicket);

  useEffect(() => { isServingRef.current = isServing; }, [isServing]);
  useEffect(() => { servingTicketRef.current = servingTicket; }, [servingTicket]);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Panel Operator', href: '/queue/management' },
  ];

  useEffect(() => {
    if (currentTicket) {
      setIsServing(true);
      setServingTicket(currentTicket);
    } else {
      setIsServing(false);
      setServingTicket(null);
    }
  }, [currentTicket]);

  useEffect(() => {
    setIsServing(false);
    setServingTicket(null);
  }, [selectedCounter]);

  const getWaitingCount = useCallback(() => {
    if (!selectedCounter || !counters || !data) return 0;
    const counter = counters.find(c => c.id === selectedCounter);
    const service = data.services?.find(s => s.service === counter?.service.name);
    return service?.total_waiting || 0;
  }, [selectedCounter, counters, data]);

  const getNextTickets = useCallback(() => {
    if (!selectedCounter || !counters || !data) return [];
    const counter = counters.find(c => c.id === selectedCounter);
    const service = data.services?.find(s => s.service === counter?.service.name);
    return service?.next || [];
  }, [selectedCounter, counters, data]);

  const getCounterInfo = useCallback(() => {
    if (!selectedCounter || !counters) return null;
    return counters.find(c => c.id === selectedCounter);
  }, [selectedCounter, counters]);

  const executeCallNext = useCallback(async (counterId: number) => {
    try {
      const ticket = await callNext(counterId);
      if (ticket) {
        setIsServing(true);
        setServingTicket(ticket);

        const counter = counters?.find(c => c.id === counterId);
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

        showNotification(`Memanggil ${ticket.number_str}`, 'success');
        return ticket;
      }
    } catch {
      showNotification('Gagal memanggil antrian', 'error');
    }
    return null;
  }, [callNext, counters, isEnabled, playTicketCall, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const handleCallNext = useCallback(async () => {
    if (!selectedCounter) return;
    if (isServingRef.current && servingTicketRef.current) {
      showNotification('Selesaikan pelayanan saat ini dulu', 'warning');
      return;
    }
    await executeCallNext(selectedCounter);
  }, [selectedCounter, executeCallNext, showNotification]);

  const handleRecall = useCallback(async () => {
    if (!servingTicket || !selectedCounter) return;

    try {
      const ticket = await recall(servingTicket.id);
      if (ticket) {
        const counter = counters?.find(c => c.id === selectedCounter);
        if (counter && isEnabled) {
          setTimeout(() => {
            playTicketCall(ticket.number_str, counter.service.name, counter.name);
          }, 300);
        }
        showNotification(`Panggil ulang ${ticket.number_str}`, 'info');
      }
    } catch {
      showNotification('Gagal panggil ulang', 'error');
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

        await Promise.all([
          refetchCurrentTicket(),
          refetchQueueStatus(),
          refetchStats()
        ]);

        showNotification(`${finishedNumber} selesai`, 'success');
      }
    } catch {
      showNotification('Gagal menyelesaikan', 'error');
    }
  }, [finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const handleFinishAndNext = useCallback(async () => {
    if (!selectedCounter) return;
    const currentTicketToFinish = servingTicketRef.current;
    const currentNumber = currentTicketToFinish?.number_str;

    // Backend callNext secara otomatis menyelesaikan tiket yang berstatus 'called' di loket ini
    const nextTicket = await executeCallNext(selectedCounter);

    if (nextTicket) {
      showNotification(`${currentNumber || 'Pelayanan'} selesai. Memanggil ${nextTicket.number_str}`, 'success');
    } else {
      // Jika tidak ada antrian berikutnya yang menunggu, selesaikan tiket saat ini
      if (currentTicketToFinish) {
        await finish(currentTicketToFinish.id);
        setIsServing(false);
        setServingTicket(null);
        await Promise.all([
          refetchCurrentTicket(),
          refetchQueueStatus(),
          refetchStats()
        ]);
        showNotification(`${currentNumber} selesai. Tidak ada antrian menunggu.`, 'info');
      }
    }
  }, [selectedCounter, executeCallNext, finish, refetchCurrentTicket, refetchQueueStatus, refetchStats, showNotification]);

  const waitingCount = getWaitingCount();
  const nextTickets = getNextTickets();
  const counterInfo = getCounterInfo();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel Operator" />

      <div className="p-6 h-full">
        {/* Notification Toast */}
        {notification && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-5 text-sm font-medium ${
            notification.type === 'error'   ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            notification.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' :
                                              'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {!selectedCounter ? (
          /* No Counter Selected - Premium Landing */
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-full max-w-sm space-y-6 text-center">
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl" />
                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/30">
                  <PhoneCall className="h-12 w-12 text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-1">Panel Operator</h2>
                <p className="text-muted-foreground text-sm">Pilih loket Anda untuk mulai melayani pasien</p>
              </div>

              <div className="text-left space-y-2">
                {counters?.map((counter) => (
                  <button
                    key={counter.id}
                    type="button"
                    onClick={() => setSelectedCounter(counter.id)}
                    className="group w-full flex items-center justify-between p-4 rounded-2xl border-2 border-border bg-card hover:border-teal-500/50 hover:bg-teal-500/5 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-muted group-hover:bg-teal-500/15 transition-colors">
                        <Headphones className="h-4 w-4 text-muted-foreground group-hover:text-teal-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm">{counter.name}</div>
                        <div className="text-xs text-muted-foreground">{counter.service.name}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Main Layout - Desktop Optimized Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* Left Column - Main Action Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{counterInfo?.name}</h1>
                    <p className="text-muted-foreground">{counterInfo?.service.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSound}
                    className={`gap-2 ${isEnabled ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}
                  >
                    {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    {isEnabled ? 'Suara ON' : 'Suara OFF'}
                  </Button>
                  <Select
                    value={selectedCounter?.toString() || ''}
                    onValueChange={(value) => setSelectedCounter(Number(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {counters?.map((counter) => (
                        <SelectItem key={counter.id} value={counter.id.toString()}>
                          {counter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Main Action Card */}
              {isServing && servingTicket ? (
                /* SERVING STATE */
                <Card className="border-2 border-orange-400 shadow-xl">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        <span className="font-semibold">SEDANG MELAYANI</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">Aktif</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    {/* Ticket Number - Prominent Display */}
                    <div className="text-center mb-8">
                      <div className="inline-block px-8 py-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border-2 border-dashed border-orange-300">
                        <p className="text-sm text-muted-foreground mb-2">Nomor Antrian</p>
                        <div className="text-8xl font-black text-orange-600 tracking-wider">
                          {servingTicket.number_str}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Grid Layout for Desktop */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Primary Action */}
                      <Button
                        onClick={handleFinishAndNext}
                        disabled={loading}
                        size="lg"
                        className="col-span-2 h-16 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg"
                      >
                        <FastForward className="mr-3 h-6 w-6" />
                        SELESAI & PANGGIL BERIKUTNYA
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </Button>

                      {/* Secondary Actions */}
                      <Button
                        onClick={handleFinish}
                        disabled={loading}
                        size="lg"
                        variant="outline"
                        className="h-14 text-base border-2 border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Selesai Saja
                      </Button>
                      <Button
                        onClick={handleRecall}
                        disabled={loading}
                        size="lg"
                        variant="outline"
                        className="h-14 text-base border-2 border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Panggil Ulang
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* IDLE STATE */
                <Card className="border-2 border-primary/20 shadow-xl">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        <span className="font-semibold">SIAP MEMANGGIL</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">
                        {waitingCount} Menunggu
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    {/* Preview Next Ticket */}
                    <div className="text-center mb-8">
                      <div className="inline-block px-8 py-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-sm text-muted-foreground mb-2">Antrian Berikutnya</p>
                        <div className="text-8xl font-black text-primary/30 tracking-wider">
                          {waitingCount > 0 ? nextTickets[0] || '---' : '---'}
                        </div>
                      </div>
                    </div>

                    {/* Call Button */}
                    <Button
                      onClick={handleCallNext}
                      disabled={loading || waitingCount === 0}
                      size="lg"
                      className="w-full h-16 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg disabled:opacity-50"
                    >
                      <Phone className="mr-3 h-6 w-6" />
                      {waitingCount > 0 ? 'PANGGIL ANTRIAN BERIKUTNYA' : 'TIDAK ADA ANTRIAN'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Stats & Queue List */}
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{waitingCount}</div>
                      <div className="text-sm text-muted-foreground">Menunggu</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-500 rounded-xl">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{isServing ? 1 : 0}</div>
                      <div className="text-sm text-muted-foreground">Dilayani</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">{stats?.done_today ?? 0}</div>
                      <div className="text-sm text-muted-foreground">Selesai Hari Ini</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Queue List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Daftar Antrian</span>
                    <Badge variant="secondary">{waitingCount} total</Badge>
                  </CardTitle>
                  <CardDescription>Antrian menunggu untuk dipanggil</CardDescription>
                </CardHeader>
                <CardContent>
                  {nextTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">Tidak ada antrian menunggu</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {nextTickets.slice(0, 8).map((ticket, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${index === 0
                              ? 'bg-primary/10 border border-primary/30'
                              : 'bg-muted/50 hover:bg-muted'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${index === 0
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted-foreground/20 text-muted-foreground'
                              }`}>
                              {index + 1}
                            </div>
                            <span className={`text-xl font-bold ${index === 0 ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                              {ticket}
                            </span>
                          </div>
                          {index === 0 && (
                            <Badge>Berikutnya</Badge>
                          )}
                        </div>
                      ))}
                      {waitingCount > 8 && (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          +{waitingCount - 8} antrian lainnya
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
