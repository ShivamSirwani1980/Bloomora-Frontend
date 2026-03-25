import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Tag, Calendar,
    Warehouse, BarChart3, Settings, Bell, Flower2, ChevronLeft,
    ChevronRight, LogOut, Menu, X, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Bouquets', path: '/admin/bouquets', icon: Sparkles },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Decorations', path: '/admin/decorations', icon: Calendar },
    { name: 'Inventory', path: '/admin/inventory', icon: Warehouse },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { setAdminAuthenticated, isAdminAuthenticated } = useStore();

    useEffect(() => {
        if (!isAdminAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAdminAuthenticated, navigate]);

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-4 border-b border-border/50">
                <Link to="/admin" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Flower2 className="w-5 h-5 text-primary" />
                    </div>
                    {!collapsed && (
                        <div>
                            <span className="font-display text-lg font-bold text-gradient">Bloomora</span>
                            <p className="text-[10px] text-muted-foreground -mt-1">Admin Panel</p>
                        </div>
                    )}
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                            isActive(link.path)
                                ? 'bg-primary text-primary-foreground shadow-soft'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                    >
                        <link.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{link.name}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-border/50 space-y-1">
                <Link
                    to="/admin/notifications"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive('/admin/notifications')
                            ? 'bg-primary text-primary-foreground shadow-soft'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                >
                    <Bell className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Notifications</span>}
                    {!collapsed && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">3</span>
                    )}
                </Link>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 w-full"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Back to Site</span>}
                </button>
                <button
                    onClick={() => { setAdminAuthenticated(false); navigate('/admin/login'); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:flex flex-col border-r border-border/50 bg-card transition-all duration-300 shrink-0 sticky top-0 h-screen',
                    collapsed ? 'w-16' : 'w-60'
                )}
            >
                <SidebarContent />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm z-10"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-lg border-b border-border/50 flex items-center px-4 gap-4">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 hover:bg-muted rounded-lg"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            A
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Admin</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
