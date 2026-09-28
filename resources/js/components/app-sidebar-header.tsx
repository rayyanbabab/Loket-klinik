import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Monitor, Ticket, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 sm:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="-ml-1 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition-colors" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Status Indicator */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live {currentTime}</span>
                </div>

                {/* Quick Launch Buttons */}
                <Link
                    href="/queue/display"
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:bg-teal-500/10 transition-colors border border-slate-200 dark:border-slate-800"
                    title="Buka Layar Display TV"
                >
                    <Monitor className="h-3.5 w-3.5 text-teal-600" />
                    Display TV
                </Link>

                <Link
                    href="/queue/ticket"
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:bg-teal-500/10 transition-colors border border-slate-200 dark:border-slate-800"
                    title="Buka Kiosk Ambil Tiket"
                >
                    <Ticket className="h-3.5 w-3.5 text-teal-600" />
                    Kiosk Tiket
                </Link>

                {/* Theme Switcher */}
                <AppearanceToggleDropdown />
            </div>
        </header>
    );
}
