export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-700 text-white shadow-xs">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                >
                    <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-slate-900 dark:text-white">
                    Poliklinik Pratama
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Sistem Antrian Terpadu
                </span>
            </div>
        </div>
    );
}

