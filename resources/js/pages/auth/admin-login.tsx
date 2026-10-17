import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { home } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, LogIn, Shield, ArrowLeft, Users, Building2, BarChart3 } from 'lucide-react';

interface AdminLoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function AdminLogin({ status, canResetPassword }: AdminLoginProps) {
    return (
        <>
            <Head title="Login Administrator" />

            <div className="relative min-h-svh flex">
                {/* Left Side - Form */}
                <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-slate-50 dark:bg-slate-950">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        {/* Back to Home Link */}
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Kembali ke Beranda Klinik
                        </Link>

                        {/* Clinic Logo */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xs">
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Poliklinik</span>
                                <span className="text-xl font-bold ml-1.5 text-slate-600 dark:text-slate-400">Pratama</span>
                            </div>
                        </div>

                        {/* Admin Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-3">
                            <Shield className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Akses Khusus Administrator</span>
                        </div>

                        {/* Title & Description */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Login Administrator</h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Masuk dengan kredensial pengelola sistem antrian</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">{status}</p>
                            </div>
                        )}

                        {/* Form */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                            <Form
                                method="post"
                                action="/admin/login"
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Email Field */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Email Admin
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="admin@poliklinik.com"
                                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-slate-500"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Masukkan password"
                                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-slate-500"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center gap-2.5 pt-1">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="rounded border-slate-300 dark:border-slate-600 text-slate-700 focus:ring-slate-500"
                                            />
                                            <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                                Ingat sesi ini di perangkat ini
                                            </Label>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            tabIndex={4}
                                            disabled={processing}
                                            className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                                        >
                                            {processing ? (
                                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <LogIn className="h-4 w-4 mr-2" />
                                            )}
                                            Masuk ke Panel Admin
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-5 p-3.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                            <div className="flex items-start gap-2.5">
                                <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Keamanan Sistem</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                        Modul khusus konfigurasi loket & petugas. Seluruh aktivitas login diawasi dan tercatat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-slate-500">
                            © {new Date().getFullYear()} Poliklinik Pratama Terpadu
                        </p>
                    </div>
                </div>

                {/* Right Side - Clean Information Section */}
                <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-slate-900 text-slate-100 border-l border-slate-800 relative">
                    <div className="relative z-10 max-w-md text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 mb-6">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Panel Administrator</span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight mb-3">
                            Pusat Manajemen Antrian
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed mb-10">
                            Kelola loket poliklinik, pantau pemanggilan pasien, atur role petugas, dan lihat ringkasan operasional secara langsung.
                        </p>

                        {/* Standardized Vector Feature Cards */}
                        <div className="grid grid-cols-3 gap-3 text-left">
                            {[
                                { icon: Users, title: 'Kelola Petugas', desc: 'Hak akses & role' },
                                { icon: Building2, title: 'Layanan Loket', desc: 'Poli umum s/d lab' },
                                { icon: BarChart3, title: 'Statistik', desc: 'Laporan kunjungan' },
                            ].map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-xl border bg-slate-800/60 border-slate-700/80"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2.5">
                                            <IconComponent className="w-4 h-4" strokeWidth={1.75} />
                                        </div>
                                        <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
                                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

