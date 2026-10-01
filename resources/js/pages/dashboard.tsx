import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useQueue';
import { getRoleBadgeInfo } from '@/components/user-info';
import {
  Users,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Timer,
  Monitor,
  Ticket,
  Headphones,
  ArrowRight,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard Operasional',
    href: dashboard().url,
  },
];

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function Dashboard() {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const { stats, loading, refetch: refetchStats } = useDashboardStats(10000);

  const [currentDateStr, setCurrentDateStr] = useState('');
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  const userRole = auth?.user?.role || 'user';
  const isAdmin = userRole === 'administrator' || userRole === 'admin';
  const isOperator = userRole === 'operator';
  const roleBadge = getRoleBadgeInfo(userRole);
  const RoleIcon = roleBadge.icon;

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

  // Fetch users list for administrator role
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  // Handle role update
  const handleUpdateRole = async (userId: number, newRole: string) => {
    setUpdatingUserId(userId);
    setRoleMessage(null);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setRoleMessage(`Role berhasil diperbarui menjadi ${newRole}`);
        fetchUsers();
        // If current logged in user changed their own role, reload Inertia state
        if (userId === auth?.user?.id) {
          router.reload();
        }
      }
    } catch (e) {
      setRoleMessage('Gagal memperbarui role');
    } finally {
      setUpdatingUserId(null);
      setTimeout(() => setRoleMessage(null), 4000);
    }
  };

  // Quick role switcher for testing
  const handleSwitchMyRole = async (targetRole: string) => {
    if (userRole === targetRole) return;
    try {
      const res = await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        router.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !stats) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard Ringkasan Antrian" />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 mx-auto">
              <BarChart3 className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Memuat data operasional poliklinik...
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
      <Head title="Dashboard Operasional Poliklinik" />

      <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">

        {/* Operational Header with Active Role Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-xl border border-teal-200 dark:border-teal-800">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Sistem Antrian Poliklinik
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border ${roleBadge.className}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleBadge.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Petugas aktif: <span className="font-semibold text-slate-800 dark:text-slate-200">{auth?.user?.name || 'Petugas'}</span> ({auth?.user?.email}) • {currentDateStr}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Role Switcher Pill for Demo & Testing */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="px-2 text-slate-500 font-medium">Uji Role:</span>
              <button
                type="button"
                onClick={() => handleSwitchMyRole('administrator')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${isAdmin ? 'bg-teal-600 text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMyRole('operator')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${isOperator ? 'bg-sky-600 text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Operator
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMyRole('user')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${!isAdmin && !isOperator ? 'bg-slate-600 text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Staf
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold">
                Sistem Terhubung
              </span>
            </div>
          </div>
        </div>

        {/* Role-Specific Banner: If user is Operator, highlight desk actions */}
        {isOperator && (
          <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-sky-600 text-white rounded-xl shadow-sm">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Meja Pelayanan Operator Loket
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Anda bertugas sebagai operator pemanggilan pasien. Buka panel meja loket untuk memulai pemanggilan nomor tiket.
                </p>
              </div>
            </div>
            <Link
              href="/queue/management"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
            >
              Masuk Meja Pemanggilan Loket
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Quick Access to System Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/queue/management"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-colors shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <Headphones className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300">
              Panel Operator Loket
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pemanggilan pasien dengan audio TTS bahasa Indonesia dan kontrol timer
            </p>
          </Link>

          <Link
            href="/queue/display"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-colors shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Monitor className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">
              Monitor Display TV
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tampilan layar monitor ruang tunggu dengan pengumuman nomor panggilan
            </p>
          </Link>

          <Link
            href="/queue/ticket"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-colors shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Ticket className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300">
              Kiosk Ambil Tiket
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Layar sentuh mandiri bagi pasien untuk mencetak tiket antrian poliklinik
            </p>
          </Link>
        </div>

        {/* Real Statistics Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Today */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Antrian Hari Ini
              </span>
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {stats?.total_today ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tiket diterbitkan per hari ini
              </p>
            </CardContent>
          </Card>

          {/* Selesai Dilayani */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selesai Dilayani
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {stats?.done_today ?? 0}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Penyelesaian</span>
                  <span className="font-semibold text-emerald-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sedang Dilayani */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sedang Dilayani
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono">
                {stats?.currently_serving ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pasien di ruang konsultasi loket
              </p>
            </CardContent>
          </Card>

          {/* Pasien Menunggu */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pasien Menunggu
              </span>
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-sky-600 dark:text-sky-400 font-mono">
                {stats?.waiting ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pasien di ruang tunggu antrian
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Average Consultation Duration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
              <Timer className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rata-rata Durasi Konsultasi Pelayanan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dihitung dari selisih waktu saat nomor antrean dipanggil hingga loket menyelesaikan sesi pasien
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <span className="text-3xl font-bold text-teal-700 dark:text-teal-300 font-mono">
              {stats?.avg_service_time ?? 0}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              menit / pasien
            </span>
          </div>
        </div>

        {/* Workload per Poliklinik & Counter Performance */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Beban Antrian per Layanan Poli */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Distribusi Antrian per Poliklinik
              </CardTitle>
              <CardDescription className="text-xs">
                Rincian tiket selesai, sedang dilayani, dan antrean menunggu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {stats?.services?.map((service) => {
                const total = service.total_today || 0;
                const done = service.done_today || 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div key={service.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            {service.done_today} selesai
                          </span>
                          <span className="text-amber-700 dark:text-amber-400 font-medium">
                            {service.serving} dilayani
                          </span>
                          <span className="text-sky-700 dark:text-sky-400 font-medium">
                            {service.waiting} antri
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-700 dark:text-teal-300 font-mono">
                          {service.total_today}
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Total
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {!stats?.services?.length && (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada catatan antrian poli untuk hari ini.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Keaktifan Loket */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                Status Operasional Meja Loket
              </CardTitle>
              <CardDescription className="text-xs">
                Keaktifan pemanggilan dan jumlah pasien yang terselesaikan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {stats?.counters?.map((counter) => (
                <div
                  key={counter.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {counter.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {counter.service.name}
                      </span>
                      {counter.serving > 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Melayani Pasien
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Siaga
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      {counter.done_today}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Selesai
                    </span>
                  </div>
                </div>
              ))}

              {!stats?.counters?.length && (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada data loket terdaftar.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Administrator Role Exclusive Section: Role & Staf Management Table */}
        {isAdmin && (
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mt-2">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  Manajemen Hak Akses & Role Pengguna
                </CardTitle>
                <CardDescription className="text-xs">
                  Kelola peran akun staf dan operator loket yang memiliki akses ke sistem poliklinik
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="text-xs h-8"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                Segarkan Data
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {roleMessage && (
                <div className="mb-4 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-200">
                  {roleMessage}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Nama Petugas</th>
                      <th className="py-2.5 px-3">Email Akun</th>
                      <th className="py-2.5 px-3">Role Saat Ini</th>
                      <th className="py-2.5 px-3 text-right">Ubah Hak Akses / Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {usersList.map((u) => {
                      const isCurrentUser = u.id === auth?.user?.id;
                      const uBadge = getRoleBadgeInfo(u.role);
                      const URoleIcon = uBadge.icon;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {u.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-[10px] text-teal-700 dark:text-teal-300 font-normal">
                                (Akun Anda)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                            {u.email}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${uBadge.className}`}>
                              <URoleIcon className="w-3 h-3" />
                              {uBadge.label}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <select
                                value={u.role || 'user'}
                                disabled={updatingUserId === u.id}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                              >
                                <option value="administrator">Admin Sistem</option>
                                <option value="operator">Operator Loket</option>
                                <option value="user">Staf / Pasien</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {usersList.length === 0 && !loadingUsers && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                          Tidak ada daftar pengguna ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </AppLayout>
  );
}
