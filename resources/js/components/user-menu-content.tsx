import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, ShieldCheck, Stethoscope, UserCheck, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [switching, setSwitching] = useState(false);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const handleSwitchRole = async (newRole: string) => {
        if (switching || user.role === newRole) return;
        setSwitching(true);
        try {
            const res = await fetch('/api/user/switch-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                router.reload();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSwitching(false);
            cleanup();
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2.5 py-2 text-left text-sm">
                    <UserInfo user={user} showEmail={true} showRole={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {/* Role Switcher for Testing & Demonstration */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer text-xs font-semibold">
                        <RefreshCw className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span>Ganti Tampilan Role</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-52 p-1">
                        <DropdownMenuItem
                            onClick={() => handleSwitchRole('administrator')}
                            className={`cursor-pointer text-xs flex items-center justify-between ${user.role === 'administrator' || user.role === 'admin' ? 'font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' : ''}`}
                        >
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                                Admin Sistem
                            </span>
                            {(user.role === 'administrator' || user.role === 'admin') && <span className="text-[10px] bg-teal-500/20 px-1 rounded">Aktif</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSwitchRole('operator')}
                            className={`cursor-pointer text-xs flex items-center justify-between ${user.role === 'operator' ? 'font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' : ''}`}
                        >
                            <span className="flex items-center gap-2">
                                <Stethoscope className="h-3.5 w-3.5 text-sky-600" />
                                Operator Loket
                            </span>
                            {user.role === 'operator' && <span className="text-[10px] bg-sky-500/20 px-1 rounded">Aktif</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSwitchRole('user')}
                            className={`cursor-pointer text-xs flex items-center justify-between ${user.role === 'user' ? 'font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : ''}`}
                        >
                            <span className="flex items-center gap-2">
                                <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                Staf / Pasien
                            </span>
                            {user.role === 'user' && <span className="text-[10px] bg-slate-500/20 px-1 rounded">Aktif</span>}
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem asChild>
                    <Link className="block w-full cursor-pointer text-xs font-semibold" href={edit()} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2 h-4 w-4" />
                        Pengaturan Akun
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full cursor-pointer text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700" href={logout()} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar Sistem
                </Link>
            </DropdownMenuItem>
        </>
    );
}
