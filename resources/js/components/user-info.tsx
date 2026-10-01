import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

export function getRoleBadgeInfo(role?: string) {
    switch (role) {
        case 'administrator':
        case 'admin':
            return {
                label: 'Admin Sistem',
                className: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
                icon: ShieldCheck,
            };
        case 'operator':
            return {
                label: 'Operator Loket',
                className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
                icon: Stethoscope,
            };
        default:
            return {
                label: 'Staf Klinik',
                className: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
                icon: UserCheck,
            };
    }
}

export function UserInfo({ user, showEmail = false, showRole = true }: { user: User; showEmail?: boolean; showRole?: boolean }) {
    const getInitials = useInitials();
    const roleInfo = getRoleBadgeInfo(user.role);
    const RoleIcon = roleInfo.icon;

    return (
        <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 text-xs font-bold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                </div>
                {showEmail && <span className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</span>}
                {showRole && (
                    <div className="mt-0.5 flex items-center">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-semibold rounded-md border ${roleInfo.className}`}>
                            <RoleIcon className="w-2.5 h-2.5" />
                            {roleInfo.label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
