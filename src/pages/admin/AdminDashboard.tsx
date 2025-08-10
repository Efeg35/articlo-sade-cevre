import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    FileText,
    Activity,
    TrendingUp,
    Database,
    Shield,
    Clock,
    AlertTriangle,
    CheckCircle,
    Eye,
    Download
} from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalDocuments: number;
    documentsToday: number;
    totalAnalyses: number;
    analysesToday: number;
    systemHealth: 'healthy' | 'warning' | 'error';
    lastUpdated: string;
}

interface RecentActivity {
    id: string;
    created_at: string;
    original_text: string;
    profiles: {
        email: string | null;
    } | null;
}

type UserRow = { id: string; created_at: string };
type DocumentRow = { id: string; created_at: string };

const AdminDashboard: React.FC = () => {
    const supabase = useSupabaseClient();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        totalDocuments: 0,
        documentsToday: 0,
        totalAnalyses: 0,
        analysesToday: 0,
        systemHealth: 'healthy',
        lastUpdated: new Date().toLocaleString('tr-TR')
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);



    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Kullanıcı istatistikleri - profiles tablosundan alıyoruz
            const { data: users, count: totalUsersCount } = await supabase
                .from('profiles')
                .select('id, created_at', { count: 'exact' })
                .returns<UserRow[]>();

            // Son 7 gündeki aktif kullanıcılar için last_sign_in_at kullanamadığımız için
            // documents tablosundan son 7 gündeki belgesi olan kullanıcıları sayıyoruz
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { data: activeUserDocs } = await supabase
                .from('documents')
                .select('user_id')
                .gte('created_at', weekAgo.toISOString())
                .returns<Array<{ user_id: string }>>();

            // Unique aktif kullanıcı sayısı
            const uniqueActiveUsers = new Set(activeUserDocs?.map(doc => doc.user_id) || []);

            // Belge istatistikleri
            const { data: documents, count: totalDocumentsCount } = await supabase
                .from('documents')
                .select('id, created_at', { count: 'exact' })
                .returns<DocumentRow[]>();

            // Bugünkü belgeler
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: todayDocs, count: todayDocsCount } = await supabase
                .from('documents')
                .select('id', { count: 'exact' })
                .gte('created_at', today.toISOString())
                .returns<Array<{ id: string }>>();

            // Son aktiviteler
            const { data: activities } = await supabase
                .from('documents')
                .select(`
          id,
          created_at,
          original_text,
          profiles:user_id (
            email
          )
        `)
                .order('created_at', { ascending: false })
                .limit(10)
                .returns<RecentActivity[]>();

            // İstatistikleri güncelle
            setStats({
                totalUsers: totalUsersCount || 0,
                activeUsers: uniqueActiveUsers.size,
                totalDocuments: totalDocumentsCount || 0,
                documentsToday: todayDocsCount || 0,
                totalAnalyses: totalDocumentsCount || 0, // Toplam analiz = toplam belge
                analysesToday: todayDocsCount || 0, // Bugünkü analiz = bugünkü belge
                systemHealth: 'healthy',
                lastUpdated: new Date().toLocaleString('tr-TR')
            });

            setRecentActivities(activities ?? []);

        } catch (error) {
            console.error('Dashboard data loading error:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        void loadDashboardData();
    }, [loadDashboardData]);

    const StatCard: React.FC<{
        title: string;
        value: string | number;
        icon: React.ReactNode;
        trend?: string;
        trendType?: 'up' | 'down' | 'neutral';
        linkTo?: string;
    }> = ({ title, value, icon, trend, trendType, linkTo }) => {
        const CardWrapper = linkTo ? Link : 'div';

        return (
            <CardWrapper to={linkTo || ''} className={linkTo ? 'block' : ''}>
                <Card className={`hover:shadow-md transition-shadow ${linkTo ? 'cursor-pointer' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        {icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                        {trend && (
                            <p className={`text-xs flex items-center mt-1 ${trendType === 'up' ? 'text-green-600' :
                                trendType === 'down' ? 'text-red-600' :
                                    'text-muted-foreground'
                                }`}>
                                {trendType === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                                {trend}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </CardWrapper>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Badge variant="outline">Yükleniyor...</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Platform genel durumu ve istatistikleri
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge
                        variant={stats.systemHealth === 'healthy' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                    >
                        {stats.systemHealth === 'healthy' ? (
                            <CheckCircle className="h-3 w-3" />
                        ) : (
                            <AlertTriangle className="h-3 w-3" />
                        )}
                        {stats.systemHealth === 'healthy' ? 'Sistem Sağlıklı' : 'Sistem Uyarısı'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={loadDashboardData}>
                        Yenile
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers.toLocaleString()}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    trend={`${stats.activeUsers} aktif (7 gün)`}
                    trendType="up"
                    linkTo="/admin/users"
                />

                <StatCard
                    title="Toplam Belge"
                    value={stats.totalDocuments.toLocaleString()}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    trend={`+${stats.documentsToday} bugün`}
                    trendType="up"
                    linkTo="/admin/documents"
                />

                <StatCard
                    title="Toplam Analiz"
                    value={stats.totalAnalyses.toLocaleString()}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    trend={`+${stats.analysesToday} bugün`}
                    trendType="up"
                    linkTo="/admin/analytics"
                />

                <StatCard
                    title="Sistem Durumu"
                    value="Çevrimiçi"
                    icon={<Shield className="h-4 w-4 text-green-600" />}
                    trend="Tüm servisler aktif"
                    trendType="up"
                    linkTo="/admin/system"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Hızlı İşlemler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link to="/admin/users">
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="h-4 w-4 mr-2" />
                                Kullanıcı Yönetimi
                            </Button>
                        </Link>
                        <Link to="/admin/analytics">
                            <Button variant="outline" className="w-full justify-start">
                                <Eye className="h-4 w-4 mr-2" />
                                Detaylı Analytics
                            </Button>
                        </Link>
                        <Link to="/admin/documents">
                            <Button variant="outline" className="w-full justify-start">
                                <Database className="h-4 w-4 mr-2" />
                                Belge Yönetimi
                            </Button>
                        </Link>
                        <Link to="/admin/settings">
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="h-4 w-4 mr-2" />
                                Sistem Ayarları
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Son Aktiviteler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivities.length > 0 ? (
                            <div className="space-y-3">
                                {recentActivities.slice(0, 5).map((activity, index) => (
                                    <div key={activity.id} className="flex items-start space-x-3 text-sm">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground">
                                                <span className="font-medium">
                                                    {activity.profiles?.email || 'Anonim'}
                                                </span>{' '}
                                                yeni bir belge analiz etti
                                            </p>
                                            <p className="text-muted-foreground truncate">
                                                {activity.original_text?.substring(0, 60)}...
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {recentActivities.length > 5 && (
                                    <Link to="/admin/documents">
                                        <Button variant="ghost" size="sm" className="w-full mt-2">
                                            Tümünü Görüntüle
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                Henüz aktivite bulunmamaktadır.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground text-center">
                Son güncelleme: {stats.lastUpdated}
            </div>
        </div>
    );
};

export default AdminDashboard;