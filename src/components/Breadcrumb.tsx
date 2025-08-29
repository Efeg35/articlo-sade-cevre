import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

// Route name mappings for Turkish labels
const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'archive': 'Belgelerim',
    'templates': 'Şablonlar',
    'blog': 'Blog',
    'nasil-calisir': 'Nasıl Çalışır?',
    'fiyatlandirma': 'Fiyatlandırma',
    'neden-artiklo': 'Neden Artiklo?',
    'yorumlar': 'Kullanıcı Yorumları',
    'senaryolar': 'Kullanım Senaryoları',
    'sss': 'SSS',
    'hakkimizda': 'Hakkımızda',
    'kullanici-sozlesmesi': 'Kullanıcı Sözleşmesi',
    'kvkk-aydinlatma': 'KVKK Aydınlatma Metni',
    'iletisim': 'İletişim',
    'notifications': 'Bildirim Ayarları',
    'admin': 'Admin Paneli'
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    className = "",
    showHome = true
}) => {
    const location = useLocation();

    // Auto-generate breadcrumb items from current path if not provided
    const generateBreadcrumbItems = (): BreadcrumbItem[] => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        if (pathSegments.length === 0) {
            return [];
        }

        const breadcrumbItems: BreadcrumbItem[] = [];
        let currentPath = '';

        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathSegments.length - 1;

            // Skip dynamic route parameters (e.g., blog post IDs)
            if (segment.match(/^[0-9a-f-]+$/i) && pathSegments[index - 1] === 'blog') {
                // For blog posts, we'll show "Blog Yazısı" as the label
                breadcrumbItems.push({
                    label: 'Blog Yazısı',
                    href: isLast ? undefined : currentPath
                });
                return;
            }

            const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            breadcrumbItems.push({
                label,
                href: isLast ? undefined : currentPath
            });
        });

        return breadcrumbItems;
    };

    const breadcrumbItems = items || generateBreadcrumbItems();

    // Don't show breadcrumb on home page
    if (location.pathname === '/' || breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <nav
            className={cn("flex items-center space-x-1 text-sm", className)}
            aria-label="Breadcrumb"
        >
            {showHome && (
                <>
                    <Link
                        to="/"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Ana Sayfa</span>
                    </Link>
                    {breadcrumbItems.length > 0 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </>
            )}

            {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-40"
                            title={item.label}
                        >
                            {item.icon && <item.icon className="h-4 w-4 mr-1 inline" />}
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className="text-foreground font-medium truncate max-w-40"
                            title={item.label}
                        >
                            {item.icon && <item.icon className="h-4 w-4 mr-1 inline" />}
                            {item.label}
                        </span>
                    )}

                    {index < breadcrumbItems.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;