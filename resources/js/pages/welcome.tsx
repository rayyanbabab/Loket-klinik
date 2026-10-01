import { dashboard, login } from '@/routes';
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
  HeartPulse,
  Stethoscope,
  Smile,
  Pill,
  Baby,
  FlaskConical,
  Building2,
  MapPin,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [liveStats, setLiveStats] = useState<{
    waiting: number;
    currently_serving: number;
    done_today: number;
  } | null>(null);

  // Fetch real global stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await fetch('/api/global/stats');
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

  const poliklinikList = [
    {
      name: 'Poli Umum',
      code: 'POLI-UMUM',
      prefix: 'A',
      desc: 'Pemeriksaan kesehatan dasar, diagnosis dokter umum, dan rujukan lanjutan.',
      icon: Stethoscope,
      hours: '08:00 - 15:30 WIB'
    },
    {
      name: 'Poli Gigi & Mulut',
      code: 'POLI-GIGI',
      prefix: 'B',
      desc: 'Penambalan, pembersihan karang gigi, pencabutan, dan konsultasi kesehatan mulut.',
      icon: Smile,
      hours: '08:30 - 14:00 WIB'
    },
    {
      name: 'Farmasi & Apotek',
      code: 'FARMASI',
      prefix: 'C',
      desc: 'Penyiapan resep obat dokter, racikan, dan edukasi aturan minum obat.',
      icon: Pill,
      hours: '08:00 - 16:00 WIB'
    },
    {
      name: 'Poli KIA (Ibu & Anak)',
      code: 'POLI-KIA',
      prefix: 'D',
      desc: 'Pemeriksaan kehamilan, imunisasi balita, tumbuh kembang, dan program KB.',
      icon: Baby,
      hours: '08:00 - 14:00 WIB'
    },
    {
      name: 'Laboratorium Medis',
      code: 'LABORATORIUM',
      prefix: 'E',
      desc: 'Pemeriksaan darah lengkap, tes urin, gula darah, kolesterol, dan diagnostik.',
      icon: FlaskConical,
      hours: '08:00 - 15:00 WIB'
    }
  ];

  return (
    <>
      <Head title="Poliklinik Pratama Terpadu - Sistem Antrian Rawat Jalan">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Clinic Brand */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-700 text-white rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white leading-none">
                    Poliklinik Pratama Terpadu
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Sistem Antrian & Informasi Layanan
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <a href="#jadwal-poli" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
                  Jadwal Poliklinik
                </a>
                <a href="#status-antrian" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
                  Status Antrian Hari Ini
                </a>
                <a href="#informasi-layanan" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
                  Informasi Pasien
                </a>
              </nav>

              {/* Action Buttons & Theme toggle */}
              <div className="flex items-center gap-2.5">
                <AppearanceToggleDropdown />

                {auth?.user ? (
                  <Link
                    href={dashboard().url}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard Petugas
                  </Link>
                ) : (
                  <>
                    <Link
                      href={login().url}
                      className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 transition-colors"
                    >
                      Login Petugas
                    </Link>
                    <Link
                      href="/queue/ticket"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Ambil Tiket
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Layanan Rawat Jalan Buka • Jam Pelayanan 08:00 - 16:00 WIB
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Pelayanan Kesehatan Rawat Jalan yang Teratur dan Transparan
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Pantau antrean poliklinik secara langsung, ambil nomor tiket mandiri di mesin kiosk, dan ikuti panggilan suara di ruang tunggu klinik.
              </p>

              {/* Direct Role Action Entry Points */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/queue/ticket"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  Ambil Nomor Tiket Mandiri
                </Link>

                <Link
                  href="/queue/display"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                >
                  <Monitor className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                  Monitor Display TV Ruang Tunggu
                </Link>

                <Link
                  href="/queue/management"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  <Headphones className="w-4 h-4 text-slate-400" />
                  Meja Operator Loket
                </Link>
              </div>
            </div>

            {/* Live Queue Status Strip */}
            <div id="status-antrian" className="mt-10 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Status Antrian Poliklinik Hari Ini
                    </h2>
                    <p className="text-xs text-slate-500">
                      Data langsung dari loket pelayanan yang sedang aktif
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Data Terhubung
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-sky-700 dark:text-sky-300 font-mono">
                    {liveStats?.waiting ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Pasien Menunggu
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-300 font-mono">
                    {liveStats?.currently_serving ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Sedang Dilayani
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {liveStats?.done_today ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Selesai Hari Ini
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Poliklinik Services Directory */}
        <section id="jadwal-poli" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 space-y-1">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Daftar Pelayanan Medis
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Poliklinik dan Jam Pelayanan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilih poliklinik sesuai kebutuhan medis Anda. Setiap layanan memiliki loket dan nomor antrian tersendiri.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {poliklinikList.map((poli) => {
                const IconComponent = poli.icon;
                return (
                  <div
                    key={poli.code}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          KODE {poli.prefix}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {poli.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 mb-4">
                        {poli.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {poli.hours}
                      </span>
                      <Link
                        href="/queue/ticket"
                        className="text-teal-700 dark:text-teal-300 font-semibold hover:underline flex items-center gap-1"
                      >
                        Ambil Tiket
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Patient Guide & Requirements */}
        <section id="informasi-layanan" className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 w-fit mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Dokumen yang Perlu Dibawa
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Pasien BPJS Kesehatan mohon menyiapkan KTP, Kartu BPJS aktif, atau surat rujukan faskes tingkat pertama. Pasien umum cukup membawa identitas KTP.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 w-fit mb-3">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Panggilan Suara Otomatis
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Setelah mengambil nomor tiket, silakan duduk di ruang tunggu utama. Nomor antrian dan loket tujuan akan diumumkan melalui speaker dan layar TV.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 w-fit mb-3">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Lokasi & Jam Kerja
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Gedung Rawat Jalan Poliklinik Pratama, Lantai 1. Pendaftaran loket dibuka setiap hari kerja pukul 08:00 hingga 15:30 WIB.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-slate-950 text-slate-400 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                  +
                </div>
                <span className="font-semibold text-slate-200">Poliklinik Pratama Terpadu</span>
                <span className="text-slate-600">•</span>
                <span>Sistem Antrian & Pelayanan Loket</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <Link href="/queue/ticket" className="hover:text-teal-300 transition-colors">
                  Kiosk Tiket
                </Link>
                <Link href="/queue/display" className="hover:text-teal-300 transition-colors">
                  Display TV
                </Link>
                <Link href="/queue/management" className="hover:text-teal-300 transition-colors">
                  Meja Loket
                </Link>
                <Link href={dashboard().url} className="hover:text-teal-300 transition-colors">
                  Dashboard
                </Link>
              </div>

              <div className="text-slate-500">
                © {new Date().getFullYear()} Poliklinik Pratama Terpadu.
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
