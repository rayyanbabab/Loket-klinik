import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useQueue';
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  BarChart3,
  Timer,
  Sparkles,
  Monitor,
  Ticket,
  Headphones,
  ArrowRight,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

export default function Dashboard() {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const { stats, loading } = useDashboardStats(15000); // Refresh every 15 seconds

  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );
  }, []);

  if (loading && !stats) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard Ringkasan Antrian" />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/25">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">
              Memuat statistik antrian klinik…
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const completionRate = stats?.total_today
    ? Math.round((stats.done_today / stats.total_today) * 100)
    : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Ringkasan Antrian" />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">

        {/* ── Welcome & Operational Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-lg shadow-teal-500/25">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Dashboard Antrian Poliklinik
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Selamat datang kembali, <span className="font-bold text-foreground">{auth?.user?.name || 'Petugas'}</span> • {currentDateStr}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wide">
              Sistem Aktif & Terhubung
            </span>
          </div>
        </div>

        {/* ── Quick Access Launcher (Shortcuts to main modules) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/queue/display"
            className="group relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-teal-500/10 border-2 border-teal-500/30 hover:border-teal-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20 group-hover:scale-110 transition-transform">
                <Monitor className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-black text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Monitor Display TV
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Buka tampilan layar penuh untuk TV ruang tunggu pasien
            </p>
          </Link>

          <Link
            href="/queue/ticket"
            className="group relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-sky-500/10 border-2 border-sky-500/30 hover:border-sky-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                <Ticket className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-black text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Mesin Tiket Kiosk
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Buka terminal pengambilan nomor antrian mandiri pasien
            </p>
          </Link>

          <Link
            href="/queue/management"
            className="group relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-500/30 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Headphones className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-black text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Panel Operator Loket
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Panggil antrian dengan audio text-to-speech bahasa Indonesia
            </p>
          </Link>
        </div>

        {/* ── Main Statistics Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Today */}
          <Card className="rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Total Antrian Hari Ini
              </span>
              <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <BarChart3 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {stats?.total_today ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tiket terbit sejak pkl 00:00 WIB
              </p>
            </CardContent>
          </Card>

          {/* Selesai Dilayani */}
          <Card className="rounded-3xl border-2 border-emerald-500/30 hover:border-emerald-500 shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Selesai Dilayani
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {stats?.done_today ?? 0}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tingkat Penyelesaian</span>
                  <span className="font-bold text-emerald-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sedang Dilayani */}
          <Card className="rounded-3xl border-2 border-orange-500/30 hover:border-orange-500 shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Sedang Dilayani
              </span>
              <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Activity className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tight text-orange-600 dark:text-orange-400 font-mono">
                {stats?.currently_serving ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Loket aktif berkonsultasi sekarang
              </p>
            </CardContent>
          </Card>

          {/* Menunggu */}
          <Card className="rounded-3xl border-2 border-blue-500/30 hover:border-blue-500 shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Pasien Menunggu
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-mono">
                {stats?.waiting ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pasien di ruang tunggu antrian
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Average Service Duration Benchmark Card ── */}
        <Card className="rounded-3xl border-2 border-teal-500/20 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 shadow-xl">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/25 shrink-0">
                <Timer className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Rata-rata Waktu Pelayanan Konsultasi
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Durasi rata-rata dihitung dari saat tiket dipanggil hingga loket menyelesaikan sesi pasien
                </p>
              </div>
            </div>

            <div className="text-right px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-teal-500/20 shadow-sm shrink-0">
              <div className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight">
                {stats?.avg_service_time ?? 0}{' '}
                <span className="text-base text-muted-foreground font-normal">menit</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Efisiensi Standar Pelayanan Baik
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Services Workload & Counter Performance Grid ── */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Statistics per Service */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
                Beban Antrian per Layanan
              </CardTitle>
              <CardDescription className="text-xs">
                Rincian total tiket, pasien dilayani, dan yang masih menunggu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {stats?.services?.map((service) => {
                const total = service.total_today || 0;
                const done = service.done_today || 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div key={service.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-base text-slate-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ {service.done_today} selesai
                          </span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">
                            ● {service.serving} dilayani
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            ⌛ {service.waiting} antri
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">
                          {service.total_today}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          Total Tiket
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {!stats?.services?.length && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada data antrian layanan tercatat hari ini
                </div>
              )}
            </CardContent>
          </Card>

          {/* Counter Performance */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                Aktivitas & Performa Loket
              </CardTitle>
              <CardDescription className="text-xs">
                Status operasional dan jumlah antrian diselesaikan setiap loket
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {stats?.counters?.map((counter) => (
                <div
                  key={counter.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-base text-slate-900 dark:text-white">
                      {counter.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {counter.service.name}
                      </Badge>
                      {counter.serving > 0 ? (
                        <Badge className="bg-orange-500 text-white text-[10px] font-bold">
                          Sedang Melayani
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Siaga</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {counter.done_today}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Pasien Selesai
                    </span>
                  </div>
                </div>
              ))}

              {!stats?.counters?.length && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada data counter aktif hari ini
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </AppLayout>
  );
}
