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
  AlertCircle,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  Maximize2,
  Minimize2,
  RefreshCw,
  HeartPulse
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
    { title: 'Layanan Antrian', href: '/queue/display' },
    { title: 'Kiosk Ambil Tiket', href: '/queue/ticket' },
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
      // Play brief chime
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
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto">
              <Ticket className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Memuat data layanan poliklinik...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kiosk Ambil Tiket Antrian" />

      <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Kiosk Header & Live Clock Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-teal-700 text-white shrink-0">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Mesin Antrian Mandiri Pasien
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Terminal Kiosk
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Sentuh poliklinik tujuan Anda untuk mencetak nomor tiket antrian
                </p>
              </div>
            </div>

            {/* Clock & Fullscreen Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
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
            </div>
          </div>

          {!generatedTicket ? (
            /* Step 1: Select Service Screen */
            <div className="space-y-6">
              {/* Instructions banner */}
              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                <span className="font-bold text-teal-800 dark:text-teal-200">Petunjuk Pasien:</span> Silakan sentuh salah satu poliklinik di bawah ini sesuai rujukan atau kebutuhan pemeriksaan Anda. Setelah itu tekan tombol cetak tiket.
              </div>

              {/* Service Cards Grid */}
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {services?.map((service) => {
                  const isSelected = selectedService === service.id;
                  const IconComponent = SERVICE_ICONS[service.code] || HeartPulse;
                  const queueInfo = getServiceQueueInfo(service.name);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`text-left w-full rounded-2xl p-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-2 border-teal-600 shadow-md -translate-y-0.5'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400'
                      }`}
                    >
                      {/* Header with Icon & Code */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-3 rounded-xl transition-colors ${
                            isSelected
                              ? 'bg-teal-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            KODE {service.prefix}
                          </span>
                          {isSelected && (
                            <span className="p-0.5 rounded-full bg-teal-600 text-white">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Title */}
                      <div className="mb-4">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {service.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Nomor Tiket: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{service.prefix}-XXX</span>
                        </p>
                      </div>

                      {/* Live Queue Status Badge Strip */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          <span>Menunggu:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {queueInfo.waiting}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono">
                          {queueInfo.current ? (
                            <span className="text-teal-700 dark:text-teal-300 font-semibold">
                              Aktif: {queueInfo.current}
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
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Layanan Terpilih
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedServiceObj ? (
                        <span className="text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          {selectedServiceObj.name} (Awalan {selectedServiceObj.prefix})
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">
                          Pilih salah satu poliklinik di atas untuk melanjutkan
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateTicket}
                    disabled={!selectedService || generating}
                    size="lg"
                    className={`w-full sm:w-auto h-12 px-6 text-sm font-bold rounded-xl transition-colors ${
                      selectedService
                        ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Mencetak Tiket...
                      </>
                    ) : (
                      <>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Nomor Tiket Saya
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Realistic Thermal Ticket Receipt */
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-1">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Nomor Antrian Berhasil Dicetak
                </h2>
                <p className="text-xs text-slate-500">
                  Silakan simpan nomor tiket Anda dan tunggu panggilan di ruang tunggu.
                </p>
              </div>

              {/* Thermal Paper Slip */}
              <div className="ticket-paper rounded-2xl border border-slate-300 overflow-hidden shadow-lg bg-white">
                <div className="ticket-zigzag-top" />

                <div className="p-6 text-center text-slate-900 space-y-4">
                  {/* Clinic Header */}
                  <div className="border-b border-dashed border-slate-300 pb-3">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <div className="w-5 h-5 rounded bg-teal-700 flex items-center justify-center text-white font-bold text-xs">
                        +
                      </div>
                      <span className="font-bold text-base tracking-wider text-teal-900 uppercase">
                        Klinik Pratama Terpadu
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Pelayanan Rawat Jalan Poliklinik
                    </p>
                  </div>

                  {/* Service Badge & Number Display */}
                  <div className="py-1">
                    <span className="inline-block px-3 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
                      {services.find((s) => s.id === generatedTicket.service_id)?.name}
                    </span>

                    <div className="text-6xl font-bold tracking-widest text-slate-900 font-mono py-1">
                      {generatedTicket.number_str}
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Nomor Antrian Pemeriksaan
                    </p>
                  </div>

                  {/* Ticket Details Table */}
                  <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2 text-xs text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Waktu Cetak:</span>
                      <span className="font-semibold text-slate-800 font-mono">
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
                      <span className="text-slate-500">Antrian di Depan:</span>
                      <span className="font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-50">
                        {generatedTicket.waiting_ahead ?? 0} Pasien
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50">
                        Menunggu Panggilan
                      </span>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="pt-1 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-end justify-center h-7 gap-[2px]">
                      {[4, 2, 5, 1, 3, 5, 2, 6, 3, 1, 4, 5, 2, 5, 1, 3, 5, 2, 4, 1, 5, 3].map((w, i) => (
                        <div
                          key={i}
                          className="bg-slate-900"
                          style={{ width: `${w}px`, height: '100%' }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-600 font-bold">
                      *{generatedTicket.number_str}*
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    Harap menunggu di ruang tunggu. Dengarkan pengumuman suara saat nomor Anda dipanggil ke meja loket.
                  </div>
                </div>

                <div className="ticket-zigzag-bottom" />
              </div>

              {/* Action Buttons & Countdown Bar */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handlePrint}
                    size="lg"
                    className="h-12 font-bold text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm"
                  >
                    <Printer className="mr-2 h-4 w-4" />
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
                    className="h-12 font-semibold text-sm rounded-xl border-slate-300 dark:border-slate-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Menu
                  </Button>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-teal-600" />
                      Kiosk akan reset otomatis ke menu:
                    </span>
                    <span className="font-bold text-teal-700 dark:text-teal-400 font-mono">{countdown} detik</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full transition-all duration-1000 ease-linear rounded-full"
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
