import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import {
  Clock,
  Users,
  LayoutDashboard,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Ticket,
  Monitor,
  Bell,
  Shield,
  ShieldCheck,
  Sparkles,
  Heart,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  PhoneCall,
  Activity,
  CheckCircle2,
  Calendar,
  Building2,
  HelpCircle,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [liveStats, setLiveStats] = useState<{
    waiting: number;
    currently_serving: number;
    done_today: number;
  } | null>(null);

  // Fetch live stats for landing page widget
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await fetch('/api/stats/global');
        if (res.ok) {
          const data = await res.json();
          setLiveStats(data);
        }
      } catch (e) {
        // Fallback or offline
      }
    };

    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const servicesList = [
    {
      name: 'Poli Umum',
      code: 'POLI-UMUM',
      prefix: 'A',
      desc: 'Pemeriksaan kesehatan umum, diagnosis medis, dan penanganan keluhan harian.',
      icon: Stethoscope,
      color: 'from-teal-500 to-emerald-600',
      badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
    },
    {
      name: 'Poli Gigi',
      code: 'POLI-GIGI',
      prefix: 'B',
      desc: 'Perawatan gigi, penambalan, pencabutan, dan konsultasi kesehatan mulut.',
      icon: Smile,
      color: 'from-sky-500 to-blue-600',
      badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300'
    },
    {
      name: 'Farmasi & Obat',
      code: 'FARMASI',
      prefix: 'C',
      desc: 'Penebusan resep obat dokter, racikan, serta edukasi penggunaan dosis obat.',
      icon: Pill,
      color: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    },
    {
      name: 'Poli KIA (Ibu & Anak)',
      code: 'POLI-KIA',
      prefix: 'D',
      desc: 'Pemeriksaan kehamilan, tumbuh kembang balita, imunisasi dasar, dan KB.',
      icon: Baby,
      color: 'from-rose-500 to-pink-600',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
    },
    {
      name: 'Laboratorium',
      code: 'LABORATORIUM',
      prefix: 'E',
      desc: 'Pemeriksaan darah lengkap, urine, tes gula darah, kolesterol, dan diagnostik.',
      icon: FlaskConical,
      color: 'from-purple-500 to-indigo-600',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    }
  ];

  const features = [
    {
      icon: Ticket,
      title: 'Tiket Antrian Digital',
      description: 'Ambil nomor antrian instan melalui layar sentuh mandiri tanpa perlu antri fisik yang melelahkan.',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      icon: Monitor,
      title: 'Display TV Real-Time',
      description: 'Layar monitor besar dengan pembaruan instan, audio visual, dan running text informasi di ruang tunggu.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bell,
      title: 'Panggilan Suara Otomatis',
      description: 'Teknologi text-to-speech bahasa Indonesia bersuara jernih yang memanggil nomor dan loket tujuan pasien.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Dashboard & Statistik',
      description: 'Analisis beban antrian, rata-rata durasi konsultasi, dan laporan kinerja pelayanan poliklinik.',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Pilih Layanan Poli',
      description: 'Sentuh poli yang Anda tuju pada mesin kiosk mandiri atau akses langsung dari perangkat Anda.'
    },
    {
      number: '02',
      title: 'Dapatkan Nomor Tiket',
      description: 'Simpan tiket cetak fisik atau digital Anda dan perhatikan estimasi waktu tunggu yang tertera.'
    },
    {
      number: '03',
      title: 'Tunggu Panggilan Suara',
      description: 'Pantau layar monitor ruang tunggu sampai nomor Anda dipanggil dengan pengumuman suara ke loket.'
    }
  ];

  return (
    <>
      <Head title="Sistem Antrian Poliklinik Terpadu - Cepat, Nyaman, & Modern">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white">

        {/* ── Fixed Navigation Bar ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">

              {/* Clinic Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Poliklinik<span className="text-teal-600 dark:text-teal-400">Queue</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold tracking-wider uppercase">
                    Klinik Pratama Terpadu
                  </span>
                </div>
              </Link>

              {/* Navigation Menu */}
              <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <a href="#live-queue" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Status Antrian
                </a>
                <a href="#services" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Layanan Poli
                </a>
                <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Fitur Unggulan
                </a>
                <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Cara Kerja
                </a>
              </div>

              {/* Action Buttons & Theme toggle */}
              <div className="flex items-center gap-3">
                <AppearanceToggleDropdown />

                {auth?.user ? (
                  <Link
                    href={dashboard().url}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href={login().url}
                      className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors"
                    >
                      Login Petugas
                    </Link>
                    <Link
                      href="/queue/ticket"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-extrabold rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5"
                    >
                      <Ticket className="w-4 h-4" />
                      Ambil Tiket
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ── Hero Section ── */}
        <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-teal-500/30 shadow-lg shadow-teal-500/5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="text-xs sm:text-sm font-extrabold text-teal-700 dark:text-teal-300">
                  Layanan Poliklinik Buka • Sistem Antrian Digital Aktif
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Pelayanan Kesehatan Jadi Lebih{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600">
                  Cepat, Teratur,
                </span>{' '}
                & Bebas Antri
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Sistem antrian cerdas poliklinik dengan mesin tiket mandiri, display monitor TV real-time, dan notifikasi panggilan suara otomatis untuk kenyamanan maksimal pasien.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/queue/ticket"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-base font-extrabold rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1"
                >
                  <Ticket className="w-5 h-5" />
                  Ambil Nomor Antrian Mandiri
                </Link>

                <Link
                  href="/queue/display"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-extrabold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <Monitor className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  Lihat Monitor Display TV
                </Link>
              </div>

            </div>

            {/* ── Live Queue Ticker Widget Card ── */}
            <div id="live-queue" className="mt-16 max-w-4xl mx-auto">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-teal-500/30 shadow-2xl shadow-teal-500/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Activity className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        Status Antrian Saat Ini (Real-Time)
                      </h2>
                      <p className="text-xs text-muted-foreground font-medium">
                        Diperbarui otomatis langsung dari sistem loket poliklinik
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE DATA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 text-center">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">
                      {liveStats?.waiting ?? 0}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      Pasien Menunggu
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                    <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">
                      {liveStats?.currently_serving ?? 0}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      Sedang Dilayani
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {liveStats?.done_today ?? 0}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      Selesai Hari Ini
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Services Directory Section ── */}
        <section id="services" className="py-20 lg:py-28 bg-white/70 dark:bg-slate-900/70 border-t border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold text-xs uppercase tracking-wider">
                Layanan Poliklinik
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Daftar Poliklinik Tersedia
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Pilih poliklinik sesuai kebutuhan medis Anda. Setiap layanan memiliki nomor antrian terdedikasi.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servicesList.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-500/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-md shadow-teal-500/20`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${service.badge}`}>
                          KODE {service.prefix}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        {service.desc}
                      </p>
                    </div>

                    <Link
                      href="/queue/ticket"
                      className="inline-flex items-center justify-between w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 transition-colors font-bold text-xs group"
                    >
                      <span>Ambil Tiket {service.name}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold text-xs uppercase tracking-wider">
                Keunggulan Sistem
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Dirancang untuk Kepuasan Pasien & Petugas
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Inovasi teknologi digital terintegrasi untuk menghapus antrean fisik yang menumpuk.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 space-y-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-lg shadow-teal-500/20`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works Section ── */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold text-xs uppercase tracking-wider">
                Alur Mudah Pasien
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                3 Langkah Mudah Mendapatkan Pelayanan
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Pengalaman berobat yang teratur, transparan, dan nyaman dari awal hingga selesai.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, idx) => (
                <div key={idx} className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-mono font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/25">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Operational Hours & Info Strip ── */}
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <Clock className="h-8 w-8 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Jam Operasional Loket
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Senin - Sabtu • 08:00 - 16:00 WIB
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Melayani Pasien BPJS & Umum
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bawa KTP & Kartu BPJS aktif Anda
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <MapPin className="h-8 w-8 text-sky-600 dark:text-sky-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Lokasi Klinik Utama
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Gedung Rawat Jalan Terpadu Lt. 1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-white">Poliklinik</span>
                  <span className="text-base font-black text-teal-400">Queue</span>
                  <p className="text-[11px] text-slate-500">Sistem Manajemen Antrian Mandiri & Real-Time</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
                <Link href="/queue/ticket" className="hover:text-teal-400 transition-colors">
                  Kiosk Ambil Tiket
                </Link>
                <Link href="/queue/display" className="hover:text-teal-400 transition-colors">
                  Monitor Display TV
                </Link>
                <Link href="/queue/management" className="hover:text-teal-400 transition-colors">
                  Panel Operator Loket
                </Link>
                <Link href={dashboard().url} className="hover:text-teal-400 transition-colors">
                  Portal Petugas
                </Link>
              </div>

              {/* Copyright */}
              <div className="text-xs text-slate-500">
                © {new Date().getFullYear()} Sistem Antrian Poliklinik. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
