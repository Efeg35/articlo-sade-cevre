import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminRouteGuard } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    Users,
    BarChart3,
    Settings,
    Home,
    Shield,
    LogOut,
    Database,
    Activity
} from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { isAdmin, isLoading, shouldRedirect } = useAdminRouteGuard();
    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect logic
    if (shouldRedirect) {
        navigate('/auth', { replace: true });
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Admin erişimi kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    // Access denied
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6 text-center">
                        <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Erişim Reddedildi</h2>
                        <p className="text-muted-foreground mb-4">
                            Bu sayfaya erişim yetkiniz bulunmamaktadır.
                        </p>
                        <Button onClick={() => navigate('/')} variant="outline">
                            Ana Sayfaya Dön
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const navItems = [
        {
            icon: Home,
            label: 'Dashboard',
            href: '/admin',
            active: location.pathname === '/admin'
        },
        {
            icon: Users,
            label: 'Kullanıcılar',
            href: '/admin/users',
            active: location.pathname === '/admin/users'
        },
        {
            icon: BarChart3,
            label: 'Analytics',
            href: '/admin/analytics',
            active: location.pathname === '/admin/analytics'
        },
        {
            icon: Database,
            label: 'Belgeler',
            href: '/admin/documents',
            active: location.pathname === '/admin/documents'
        },
        {
            icon: Activity,
            label: 'Sistem Durumu',
            href: '/admin/system',
            active: location.pathname === '/admin/system'
        },
        {
            icon: Settings,
            label: 'Ayarlar',
            href: '/admin/settings',
            active: location.pathname === '/admin/settings'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/admin" className="flex items-center space-x-2">
                                <Shield className="h-8 w-8 text-primary" />
                                <div>
                                    <span className="font-bold text-lg">ARTIKLO</span>
                                    <span className="text-xs text-muted-foreground ml-2">Admin Panel</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                            >
                                Siteye Dön
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="text-destructive hover:text-destructive"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Çıkış
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm border-r border-border min-h-[calc(100vh-4rem)]">
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        item.active
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;