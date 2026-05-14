import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, ArrowRightLeft, Users, ClipboardList } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Products', href: '/products', icon: Package },
    { title: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { title: 'Staff Management', href: '/staff-management', icon: Users },
];

const staffNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/staff/dashboard', icon: LayoutGrid },
    { title: 'Products', href: '/products', icon: Package },
    { title: 'Transactions', href: '/transactions', icon: ClipboardList },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.role === 'admin';
    const navItems = isAdmin ? adminNavItems : staffNavItems;
    const homeHref = isAdmin ? '/dashboard' : '/staff/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
