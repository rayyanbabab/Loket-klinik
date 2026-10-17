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
                className: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                icon: ShieldCheck,
            };
        case 'operator':
            return {
                label: 'Operator Loket',
                className: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
                icon: Stethoscope,
            };
        default:
            return {
                label: 'Staf Klinik',
                className: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
                icon: UserCheck,
            };
    }
}

export function UserInfo({ user, showEmail = false, showRole = true, isSidebar = true }: { user: User; showEmail?: boolean; showRole?: boolean; isSidebar?: boolean }) {
    const getInitials = useInitials();
    const roleInfo = getRoleBadgeInfo(user.role);
    const RoleIcon = roleInfo.icon;

    return (
        <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full border border-teal-500/40 shadow-xs shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-teal-800 text-teal-100 text-xs font-bold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`truncate font-semibold ${isSidebar ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                        {user.name}
                    </span>
                </div>
                {showEmail && <span className="truncate text-xs text-slate-400">{user.email}</span>}
                {showRole && (
                    <div className="mt-0.5 flex items-center">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-md border ${roleInfo.className}`}>
                            <RoleIcon className="w-2.5 h-2.5" />
                            {roleInfo.label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
