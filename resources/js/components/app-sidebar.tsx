import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Monitor, Ticket, Headphones, Home } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isOperator = auth?.user?.role === 'operator';

    const mainNavItems: NavItem[] = isOperator
        ? [
              {
                  title: 'Meja Operator Loket',
                  href: '/queue/management',
                  icon: Headphones,
              },
              {
                  title: 'Dashboard Ringkasan',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Layanan Antrian',
                  href: '/queue/display',
                  icon: Ticket,
                  items: [
                      {
                          title: 'Monitor Display TV',
                          href: '/queue/display',
                      },
                      {
                          title: 'Kiosk Ambil Tiket',
                          href: '/queue/ticket',
                      },
                  ],
              },
          ]
        : [
              {
                  title: 'Dashboard Operasional',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Panel Operator Loket',
                  href: '/queue/management',
                  icon: Headphones,
              },
              {
                  title: 'Layanan Antrian',
                  href: '/queue/display',
                  icon: Ticket,
                  items: [
                      {
                          title: 'Monitor Display TV',
                          href: '/queue/display',
                      },
                      {
                          title: 'Kiosk Ambil Tiket',
                          href: '/queue/ticket',
                      },
                  ],
              },
          ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Beranda Publik Klinik',
            href: '/',
            icon: Home,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/50">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
