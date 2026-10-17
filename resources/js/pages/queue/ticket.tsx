import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useServices, useQueueActions, useQueueStatus } from '@/hooks/useQueue';
import {
  Printer,
  Ticket,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  Maximize2,
  Minimize2,
  RefreshCw,
  HeartPulse,
  Home,
  Check,
  Building2,
  Info
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';

// Icon and theme mapping per service
const SERVICE_ICONS: Record<string, any> = {
  'POLI-UMUM': Stethoscope,
  'POLI-GIGI': Smile,
  'FARMASI': Pill,
  'POLI-KIA': Baby,
  'LABORATORIUM': FlaskConical
};

const SERVICE_THEMES: Record<string, { bg: string; text: string; border: string; activeBorder: string; badge: string }> = {
  'POLI-UMUM': {
    bg: 'bg-teal-500/10',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30',
    activeBorder: 'border-teal-600 ring-2 ring-teal-500/30',
    badge: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800'
  },
  'POLI-GIGI': {
    bg: 'bg-sky-500/10',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30',
    activeBorder: 'border-sky-600 ring-2 ring-sky-500/30',
    badge: 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  },
  'FARMASI': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/30',
    badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  'POLI-KIA': {
    bg: 'bg-purple-500/10',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30',
    activeBorder: 'border-purple-600 ring-2 ring-purple-500/30',
    badge: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  'LABORATORIUM': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/30',
    badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  }
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

  // Live Clock in Indonesian format
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

  // Countdown timer when ticket receipt is displayed
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

  // Fullscreen Kiosk toggle
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
      // Audio feedback chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // audio optional
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
          @page { size: 80mm 120mm; margin: 4mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace, sans-serif;
            text-align: center;
            color: #000;
            padding: 8px 12px;
          }
          .clinic-name { font-size: 15px; font-weight: 900; text-transform: uppercase; margin-bottom: 2px; }
          .sub { font-size: 9px; margin-bottom: 6px; line-height: 1.2; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .service-name { font-size: 13px; font-weight: bold; margin: 6px 0; text-transform: uppercase; }
          .ticket-number { font-size: 48px; font-weight: 900; letter-spacing: 2px; line-height: 1; margin: 10px 0; }
          .info-table { width: 100%; font-size: 10px; margin: 8px 0; }
          .info-table td { padding: 2px 0; }
          .barcode-bars { display: flex; justify-content: center; align-items: flex-end; height: 28px; gap: 2px; margin: 8px 0 4px; }
          .barcode-bars div { background: #000; height: 100%; }
          .note { font-size: 8px; margin-top: 6px; line-height: 1.2; }
        </style>
      </head>
      <body>
        <div class="clinic-name">POLIKLINIK PRATAMA TERPADU</div>
        <div class="sub">Pelayanan Rawat Jalan Terpadu<br>Jl. Kesehatan No. 1 • Telp: (021) 555-0199</div>
        <div class="divider"></div>
        <div class="service-name">${serviceName}</div>
        <div class="ticket-number">${generatedTicket.number_str}</div>
        <div class="divider"></div>
        <table class="info-table">
          <tr><td align="left">Waktu Cetak:</td><td align="right">${createdAt}</td></tr>
          <tr><td align="left">Antrian di Depan:</td><td align="right">${generatedTicket.waiting_ahead ?? 0} Pasien</td></tr>
          <tr><td align="left">Status:</td><td align="right">MENUNGGU</td></tr>
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
            setTimeout(function() { window.print(); }, 150);
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
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Head title="Kiosk Ambil Tiket Antrian" />
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto shadow-sm">
            <Ticket className="h-8 w-8 animate-pulse text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Memuat Kiosk Mesin Antrian</h2>
            <p className="text-xs text-slate-500 mt-1">Menyiapkan daftar layanan poliklinik...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans select-none overflow-x-hidden">
      <Head title="Mesin Kiosk Mandiri - Ambil Nomor Antrian Pasien" />

      {/* Kiosk Header: Branding, Live Clock & Kiosk Mode Controls */}
      <header className="max-w-6xl w-full mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-teal-700 text-white shadow-md shrink-0">
            <Ticket className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Mesin Antrian Mandiri Pasien
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                TERMINAL KIOSK
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Sentuh poliklinik tujuan Anda untuk mencetak nomor tiket antrian secara mandiri
            </p>
          </div>
        </div>

        {/* Digital Clock & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="text-base sm:text-lg font-bold text-teal-700 dark:text-teal-300 font-mono tracking-wider leading-tight">
              {currentTime || '00:00:00 WIB'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {currentDate || 'Memuat tanggal...'}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh Kiosk'}
            className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 text-teal-600" /> : <Maximize2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
          </Button>

          <Link
            href="/"
            title="Kembali ke Beranda Klinik"
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center text-xs font-semibold"
          >
            <Home className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden md:inline">Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Touch Content Area */}
      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center mb-6">
        {!generatedTicket ? (
          /* STEP 1: Touch Selection Grid */
          <div className="space-y-6">
            {/* Friendly Patient Instructions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-700 text-white shrink-0">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-extrabold text-teal-800 dark:text-teal-300 block">
                    Petunjuk Pendaftaran Pasien:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-xs sm:text-sm">
                    Sentuh salah satu poliklinik di bawah ini, kemudian tekan tombol <span className="font-bold text-teal-700 dark:text-teal-300">Cetak Nomor Tiket</span> di bagian bawah layar.
                  </p>
                </div>
              </div>
            </div>

            {/* Tactile Service Selection Cards Grid */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {services?.map((service) => {
                const isSelected = selectedService === service.id;
                const IconComponent = SERVICE_ICONS[service.code] || HeartPulse;
                const queueInfo = getServiceQueueInfo(service.name);
                const theme = SERVICE_THEMES[service.code] || {
                  bg: 'bg-teal-500/10',
                  text: 'text-teal-700 dark:text-teal-300',
                  border: 'border-teal-500/30',
                  activeBorder: 'border-teal-600 ring-2 ring-teal-500/30',
                  badge: 'bg-teal-50 text-teal-800 border-teal-200'
                };

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`text-left w-full rounded-2xl p-5 transition-all focus:outline-none cursor-pointer transform active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? `bg-white dark:bg-slate-900 border-2 ${theme.activeBorder} shadow-lg -translate-y-1`
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon & Prefix Code */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3.5 rounded-2xl transition-colors ${
                            isSelected
                              ? 'bg-teal-700 text-white shadow-md'
                              : `${theme.bg} ${theme.text}`
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            KODE {service.prefix}
                          </span>
                          {isSelected && (
                            <span className="p-1 rounded-full bg-teal-600 text-white shadow-xs">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Name */}
                      <div className="mb-4">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                          {service.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Format Tiket: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{service.prefix}-XXX</span>
                        </p>
                      </div>
                    </div>

                    {/* Waiting Count Strip */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-2">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-[11px]">Menunggu:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {queueInfo.waiting}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Siap Melayani
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Touch Action Bar */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    POLIKLINIK TERPILIH
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedServiceObj ? (
                      <span className="text-teal-700 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600" />
                        {selectedServiceObj.name} (Kode Tiket: {selectedServiceObj.prefix})
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-sm">
                        Silakan sentuh salah satu poliklinik di atas untuk melanjutkan
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateTicket}
                  disabled={!selectedService || generating}
                  size="lg"
                  className={`w-full sm:w-auto h-14 px-8 text-base font-extrabold rounded-2xl transition-all shadow-md ${
                    selectedService
                      ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2.5 h-5 w-5 animate-spin" />
                      Mencetak Tiket Antrian...
                    </>
                  ) : (
                    <>
                      <Printer className="mr-2.5 h-5 w-5" />
                      Cetak Nomor Tiket Saya
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* STEP 2: Realistic Thermal Ticket Receipt Modal */
          <div className="max-w-md mx-auto w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Simulated Thermal Ticket Receipt */}
            <div className="rounded-2xl bg-white text-slate-900 border-2 border-slate-300 shadow-2xl p-6 sm:p-8 font-mono text-center relative overflow-hidden">
              {/* Jagged paper top decor */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal-700" />

              <div className="space-y-1 mb-4">
                <div className="text-base font-black tracking-tight text-slate-900 uppercase">
                  POLIKLINIK PRATAMA TERPADU
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Pelayanan Rawat Jalan Terpadu<br />
                  Jl. Kesehatan No. 1 • Telp: (021) 555-0199
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 my-4" />

              {/* Service & Number */}
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-slate-600 block">
                  {services.find((s) => s.id === generatedTicket.service_id)?.name || 'Poliklinik'}
                </span>
                <div className="text-6xl font-black tracking-widest text-teal-800 py-2">
                  {generatedTicket.number_str}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 my-4" />

              {/* Ticket Details */}
              <div className="text-xs space-y-1.5 text-left text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Cetak:</span>
                  <span className="font-bold">
                    {new Date(generatedTicket.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Antrian di Depan:</span>
                  <span className="font-bold text-teal-700">
                    {generatedTicket.waiting_ahead ?? 0} Pasien
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Pelayanan:</span>
                  <span className="font-bold">
                    {generatedTicket.estimated_service_time ? `${generatedTicket.estimated_service_time} WIB` : 'Segera'}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 my-4" />

              {/* Simulated Barcode */}
              <div className="flex justify-center items-end h-8 gap-1.5 my-3 opacity-80">
                <div className="w-1 h-full bg-slate-900" />
                <div className="w-2 h-full bg-slate-900" />
                <div className="w-0.5 h-full bg-slate-900" />
                <div className="w-1.5 h-full bg-slate-900" />
                <div className="w-2.5 h-full bg-slate-900" />
                <div className="w-1 h-full bg-slate-900" />
                <div className="w-2 h-full bg-slate-900" />
                <div className="w-1.5 h-full bg-slate-900" />
                <div className="w-0.5 h-full bg-slate-900" />
                <div className="w-2 h-full bg-slate-900" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-500">
                {generatedTicket.number_str}
              </div>

              <div className="text-[10px] text-slate-500 leading-tight mt-4 pt-2 border-t border-slate-200">
                Harap menunggu di ruang tunggu.<br />
                Perhatikan panggilan suara & layar monitor display TV.
              </div>
            </div>

            {/* Print & Return Controls with Countdown */}
            <div className="space-y-3">
              <Button
                onClick={handlePrint}
                size="lg"
                className="w-full h-12 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-colors"
              >
                <Printer className="mr-2 h-4 w-4" />
                Cetak Fisik Tiket (Kertas Thermal)
              </Button>

              <Button
                onClick={() => {
                  setGeneratedTicket(null);
                  setSelectedService(null);
                  refetchQueue();
                }}
                variant="outline"
                size="lg"
                className="w-full h-12 text-sm font-bold rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                Ambil Tiket & Selesai ({countdown}s)
              </Button>

              {/* Visual Countdown Progress Bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 12) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Kiosk Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 dark:text-slate-400 py-2 shrink-0">
        Poliklinik Pratama Terpadu • Sistem Antrian Kiosk Mandiri Terintegrasi
      </footer>
    </div>
  );
}
