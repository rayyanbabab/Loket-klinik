import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useServices, useQueueActions, useQueueStatus } from '@/hooks/useQueue';
import {
  Printer,
  Ticket,
  Users,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  Maximize2,
  Minimize2,
  RefreshCw,
  QrCode,
  HeartPulse
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';

// Icon and color mapping per service
const SERVICE_THEMES: Record<string, {
  icon: any;
  color: string;
  bgGrad: string;
  badgeBg: string;
  accentBorder: string;
  lightBg: string;
}> = {
  'POLI-UMUM': {
    icon: Stethoscope,
    color: 'text-teal-600 dark:text-teal-400',
    bgGrad: 'from-teal-500 to-emerald-600',
    badgeBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
    accentBorder: 'border-teal-500',
    lightBg: 'bg-teal-500/5'
  },
  'POLI-GIGI': {
    icon: Smile,
    color: 'text-sky-600 dark:text-sky-400',
    bgGrad: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
    accentBorder: 'border-sky-500',
    lightBg: 'bg-sky-500/5'
  },
  'FARMASI': {
    icon: Pill,
    color: 'text-amber-600 dark:text-amber-400',
    bgGrad: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    accentBorder: 'border-amber-500',
    lightBg: 'bg-amber-500/5'
  },
  'POLI-KIA': {
    icon: Baby,
    color: 'text-rose-600 dark:text-rose-400',
    bgGrad: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    accentBorder: 'border-rose-500',
    lightBg: 'bg-rose-500/5'
  },
  'LABORATORIUM': {
    icon: FlaskConical,
    color: 'text-purple-600 dark:text-purple-400',
    bgGrad: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    accentBorder: 'border-purple-500',
    lightBg: 'bg-purple-500/5'
  }
};

const DEFAULT_THEME = {
  icon: HeartPulse,
  color: 'text-teal-600 dark:text-teal-400',
  bgGrad: 'from-teal-500 to-emerald-600',
  badgeBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
  accentBorder: 'border-teal-500',
  lightBg: 'bg-teal-500/5'
};

export default function TicketPage() {
  const { services, loading: loadingServices } = useServices();
  const { data: queueData, refetch: refetchQueue } = useQueueStatus(4000);
  const { generateTicket, loading: generating, error: queueError } = useQueueActions();

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState<number>(12);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Mesin Tiket Kiosk', href: '/queue/ticket' },
  ];

  // Clock in Indonesian format
  useEffect(() => {
    const updateTime = () => {
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

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer when ticket is generated
  useEffect(() => {
    if (generatedTicket) {
      setCountdown(12);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            setGeneratedTicket(null);
            setSelectedService(null);
            refetchQueue();
            return 12;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [generatedTicket, refetchQueue]);

  // Fullscreen toggle handler
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

  // Generate Ticket handler
  const handleGenerateTicket = async () => {
    if (!selectedService) return;

    setError(null);
    const ticket = await generateTicket(selectedService);
    if (ticket) {
      // Play affirmative chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // audio context optional
      }

      setGeneratedTicket(ticket);
      refetchQueue();
    } else {
      setError(queueError || 'Gagal membuat nomor tiket. Silakan coba lagi.');
    }
  };

  // Thermal Print Handler
  const handlePrint = () => {
    if (!generatedTicket) return;
    const service = services.find((s) => s.id === generatedTicket.service_id);
    const serviceName = service?.name || 'Poliklinik';
    const createdAt = new Date(generatedTicket.created_at).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tiket Antrian - ${generatedTicket.number_str}</title>
        <style>
          @page {
            size: 80mm 120mm;
            margin: 4mm;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace, sans-serif;
            text-align: center;
            color: #000;
            padding: 8px 12px;
          }
          .clinic-name {
            font-size: 15px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .sub {
            font-size: 9px;
            margin-bottom: 6px;
            line-height: 1.2;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 6px 0;
          }
          .service-name {
            font-size: 13px;
            font-weight: bold;
            margin: 6px 0;
            text-transform: uppercase;
          }
          .ticket-number {
            font-size: 48px;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            margin: 10px 0;
          }
          .info-table {
            width: 100%;
            font-size: 10px;
            margin: 8px 0;
          }
          .info-table td {
            padding: 2px 0;
          }
          .barcode-bars {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 28px;
            gap: 2px;
            margin: 8px 0 4px;
          }
          .barcode-bars div {
            background: #000;
            height: 100%;
          }
          .note {
            font-size: 8px;
            margin-top: 6px;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <div class="clinic-name">KLINIK PRATAMA SEHAT</div>
        <div class="sub">Pelayanan Rawat Jalan Terpadu<br>Jl. Kesehatan No. 1 • Telp: (021) 555-0199</div>
        <div class="divider"></div>
        <div class="service-name">${serviceName}</div>
        <div class="ticket-number">${generatedTicket.number_str}</div>
        <div class="divider"></div>
        <table class="info-table">
          <tr>
            <td align="left">Waktu Cetak:</td>
            <td align="right">${createdAt}</td>
          </tr>
          <tr>
            <td align="left">Antrian di Depan:</td>
            <td align="right">${generatedTicket.waiting_ahead ?? 0} Pasien</td>
          </tr>
          <tr>
            <td align="left">Status:</td>
            <td align="right">MENUNGGU</td>
          </tr>
        </table>
        <div class="divider"></div>
        <div class="barcode-bars">
          <div style="width:3px"></div><div style="width:1px"></div><div style="width:4px"></div>
          <div style="width:2px"></div><div style="width:1px"></div><div style="width:3px"></div>
          <div style="width:2px"></div><div style="width:4px"></div><div style="width:1px"></div>
          <div style="width:3px"></div><div style="width:2px"></div><div style="width:1px"></div>
          <div style="width:4px"></div><div style="width:2px"></div><div style="width:3px"></div>
        </div>
        <div style="font-size:9px; font-weight:bold; letter-spacing:1px">${generatedTicket.number_str}</div>
        <div class="note">
          Harap menunggu di ruang tunggu.<br>
          Perhatikan panggilan suara & layar monitor display.
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 150);
          }
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=420,height=600');
    if (printWin) {
      printWin.document.write(printContent);
      printWin.document.close();
    }
  };

  // Helper to get live queue info for a service
  const getServiceQueueInfo = (serviceName: string) => {
    const queue = queueData?.services?.find((s) => s.service === serviceName);
    return {
      waiting: queue?.total_waiting ?? 0,
      current: queue?.current || null,
      counter: queue?.counter || null
    };
  };

  const selectedServiceObj = useMemo(() => {
    return services.find((s) => s.id === selectedService);
  }, [services, selectedService]);

  if (loadingServices) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Ambil Tiket Antrian" />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/25">
                <Ticket className="h-7 w-7 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">Memuat data layanan poliklinik…</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kiosk Ambil Tiket Antrian" />

      <div className="min-h-full bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Kiosk Header & Live Clock Bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 shadow-xl shadow-teal-500/5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30">
                  <Ticket className="h-7 w-7 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Mesin Antrian Mandiri
                  </h1>
                  <Badge variant="outline" className="hidden sm:inline-flex bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 text-xs font-bold">
                    Kiosk K-1
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Sentuh layanan yang Anda tuju untuk mencetak nomor antrian
                </p>
              </div>
            </div>

            {/* Clock & Fullscreen Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-wide font-mono">
                  {currentTime || '00:00:00 WIB'}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  {currentDate || 'Memuat tanggal...'}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh Kiosk'}
                className="h-11 w-11 rounded-2xl border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all shrink-0"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5 text-teal-600" /> : <Maximize2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
              </Button>
            </div>
          </div>

          {!generatedTicket ? (
            /* ── Step 1: Select Service Screen ── */
            <div className="space-y-6">
              {/* Instructions banner */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 border border-teal-500/20 text-slate-700 dark:text-slate-200">
                <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 animate-pulse" />
                <div className="text-xs sm:text-sm font-medium">
                  <span className="font-bold text-teal-700 dark:text-teal-300">Langkah 1:</span> Silakan pilih poliklinik atau loket tujuan di bawah ini. Anda dapat melihat jumlah antrian yang sedang menunggu secara langsung.
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {services?.map((service) => {
                  const isSelected = selectedService === service.id;
                  const theme = SERVICE_THEMES[service.code] || DEFAULT_THEME;
                  const IconComponent = theme.icon;
                  const queueInfo = getServiceQueueInfo(service.name);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`group relative text-left w-full rounded-3xl p-5 sm:p-6 transition-all duration-300 transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50 ${
                        isSelected
                          ? `bg-white dark:bg-slate-900 border-2 ${theme.accentBorder} shadow-2xl shadow-teal-500/20 -translate-y-1.5`
                          : 'bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-400/60 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {/* Top indicator strip when selected */}
                      {isSelected && (
                        <div className={`absolute -top-1 left-4 right-4 h-1.5 rounded-full bg-gradient-to-r ${theme.bgGrad}`} />
                      )}

                      {/* Header with Icon & Checkmark */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3.5 rounded-2xl transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-br ${theme.bgGrad} text-white shadow-lg shadow-teal-500/30 scale-105`
                              : `${theme.lightBg} ${theme.color} group-hover:scale-105`
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wider ${theme.badgeBg}`}>
                            KODE {service.prefix}
                          </span>
                          {isSelected && (
                            <div className="p-1 rounded-full bg-teal-500 text-white animate-in zoom-in">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Title */}
                      <div className="mb-4">
                        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
                          {service.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nomor Tiket: <span className="font-mono font-bold text-foreground">{service.prefix}-XXX</span>
                        </p>
                      </div>

                      {/* Live Queue Status Badge Strip */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground font-medium">Menunggu:</span>
                          <span className={`font-bold ${queueInfo.waiting > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {queueInfo.waiting} orang
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          {queueInfo.current ? (
                            <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold">
                              Sedang: {queueInfo.current}
                            </span>
                          ) : (
                            <span className="text-slate-400">Siap Panggil</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Bottom Bar */}
              <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Layanan Terpilih
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {selectedServiceObj ? (
                        <span className="text-teal-600 dark:text-teal-400 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          {selectedServiceObj.name} (Awalan {selectedServiceObj.prefix})
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">
                          Silakan klik salah satu kartu poli di atas
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateTicket}
                    disabled={!selectedService || generating}
                    size="lg"
                    className={`w-full sm:w-auto h-14 px-8 text-base font-extrabold rounded-2xl transition-all duration-300 ${
                      selectedService
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-0.5'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                        Mencetak Tiket…
                      </>
                    ) : (
                      <>
                        <Printer className="mr-3 h-6 w-6" />
                        CETAK NOMOR TIKET SAYA
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Step 2: Realistic Thermal Ticket Receipt Modal ── */
            <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Success Banner */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Nomor Antrian Anda Berhasil Dibuat!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Silakan simpan tiket Anda dan perhatikan nomor pada layar monitor display.
                </p>
              </div>

              {/* Thermal Ticket Slip Card */}
              <div className="ticket-paper rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xl">
                <div className="ticket-zigzag-top" />

                <div className="p-6 sm:p-8 text-center text-slate-900 space-y-5">
                  {/* Clinic Header */}
                  <div className="border-b border-dashed border-slate-300 pb-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                        +
                      </div>
                      <span className="font-black text-base sm:text-lg tracking-wider text-teal-800 uppercase">
                        Klinik Poliklinik Terpadu
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Sistem Pelayanan Rawat Jalan Digital Modern
                    </p>
                  </div>

                  {/* Service Badge & Number Display */}
                  <div className="py-2">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
                      {services.find((s) => s.id === generatedTicket.service_id)?.name}
                    </span>

                    <div className="text-6xl sm:text-7xl font-black tracking-widest text-teal-600 font-mono py-2 filter drop-shadow-sm">
                      {generatedTicket.number_str}
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Simpan tiket ini untuk bukti pelayanan loket
                    </p>
                  </div>

                  {/* Ticket Details Table */}
                  <div className="border-t border-b border-dashed border-slate-300 py-4 space-y-2.5 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Waktu Registrasi:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {new Date(generatedTicket.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Antrian di Depan Anda:</span>
                      <span className="font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-50">
                        {generatedTicket.waiting_ahead ?? 0} Pasien
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Status Pelayanan:</span>
                      <span className="font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50">
                        Menunggu Dipanggil
                      </span>
                    </div>
                  </div>

                  {/* Simulated Barcode Graphics */}
                  <div className="pt-2 flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-end justify-center h-8 gap-[3px]">
                      {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 6, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 6].map((w, i) => (
                        <div
                          key={i}
                          className="bg-slate-800 rounded-sm"
                          style={{ width: `${w}px`, height: '100%' }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono tracking-widest text-slate-600 font-bold">
                      *{generatedTicket.number_str}*
                    </span>
                  </div>

                  {/* Friendly Advice */}
                  <div className="text-[11px] text-slate-500 leading-relaxed pt-2">
                    Mohon duduk di ruang tunggu dan dengarkan pengumuman suara saat nomor Anda dipanggil ke loket.
                  </div>
                </div>

                <div className="ticket-zigzag-bottom" />
              </div>

              {/* Action Buttons & Countdown reset bar */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handlePrint}
                    size="lg"
                    className="h-14 font-extrabold text-base bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/25 rounded-2xl"
                  >
                    <Printer className="mr-2 h-5 w-5" />
                    Cetak Fisik Tiket
                  </Button>

                  <Button
                    onClick={() => {
                      setGeneratedTicket(null);
                      setSelectedService(null);
                      refetchQueue();
                    }}
                    variant="outline"
                    size="lg"
                    className="h-14 font-bold text-base rounded-2xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Selesai & Ambil Tiket Baru
                  </Button>
                </div>

                {/* Auto reset progress countdown */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-teal-600" />
                      Kiosk akan reset otomatis:
                    </span>
                    <span className="font-bold text-teal-600 font-mono">{countdown} detik</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${(countdown / 12) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
