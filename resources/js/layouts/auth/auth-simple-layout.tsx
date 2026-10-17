import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Shield, Ticket, Monitor, BarChart3, Building2 } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    variant?: 'user' | 'admin';
}

export default function AuthSimpleLayout({ children, title, description, variant = 'user' }: PropsWithChildren<AuthLayoutProps>) {
    const isAdmin = variant === 'admin';

    return (
        <div className="relative min-h-svh flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-slate-50 dark:bg-slate-950">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Clinic Logo */}
                    <Link href={home()} className="flex items-center justify-center gap-3 mb-8">
                        <div className={`w-10 h-10 ${isAdmin ? 'bg-slate-900 text-white' : 'bg-teal-700 text-white'} rounded-xl flex items-center justify-center shadow-xs`}>
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Poliklinik</span>
                            <span className={`text-xl font-bold ml-1.5 ${isAdmin ? 'text-slate-600 dark:text-slate-400' : 'text-teal-700 dark:text-teal-400'}`}>Pratama</span>
                        </div>
                    </Link>

                    {/* Title & Description */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
                        © {new Date().getFullYear()} Poliklinik Pratama Terpadu • Sistem Antrian
                    </p>
                </div>
            </div>

            {/* Right Side - Clean Information Section */}
            <div className={`hidden lg:flex flex-1 flex-col justify-center items-center p-12 ${isAdmin ? 'bg-slate-900 text-slate-100' : 'bg-teal-900 text-white'} border-l border-slate-800 relative overflow-hidden`}>
                <div className="relative z-10 max-w-md text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isAdmin ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-teal-800/80 text-teal-200 border border-teal-700'} mb-6`}>
                        {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                        <span>{isAdmin ? 'Portal Akses Administrator' : 'Sistem Antrian Pelayanan'}</span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight mb-3">
                        {isAdmin ? 'Pusat Manajemen Antrian' : 'Pelayanan Rawat Jalan Nyaman'}
                    </h2>
                    <p className={`text-sm ${isAdmin ? 'text-slate-400' : 'text-teal-200'} leading-relaxed mb-10`}>
                        {isAdmin
                            ? 'Akses terpadu untuk monitoring loket, manajemen user, pemanggilan nomor tiket, dan pencatatan operasional.'
                            : 'Pantau antrian poliklinik secara transparan, hemat waktu tunggu, dan nikmati kemudahan pelayanan kesehatan.'
                        }
                    </p>

                    {/* Standardized Vector Feature Cards */}
                    <div className="grid grid-cols-3 gap-3 text-left">
                        {[
                            {
                                icon: Ticket,
                                title: 'Tiket Mandiri',
                                desc: 'Cetak fisik & digital'
                            },
                            {
                                icon: Monitor,
                                title: 'Display TV',
                                desc: 'Panggilan realtime'
                            },
                            {
                                icon: BarChart3,
                                title: 'Rekap Data',
                                desc: 'Statistik terpusat'
                            },
                        ].map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`p-3.5 rounded-xl border ${isAdmin ? 'bg-slate-800/60 border-slate-700/80' : 'bg-teal-800/40 border-teal-700/60'}`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2.5">
                                        <IconComponent className="w-4 h-4" strokeWidth={1.75} />
                                    </div>
                                    <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
                                    <div className={`text-[10px] ${isAdmin ? 'text-slate-400' : 'text-teal-300'}`}>{item.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

