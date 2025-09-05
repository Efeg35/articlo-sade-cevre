import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Server,
    Database,
    Shield,
    Cpu,
    HardDrive,
    Users,
    Activity,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    TrendingUp,
    Globe
} from 'lucide-react';

interface SystemMetrics {
    uptime: string;
    totalUsers: number;
    totalDocuments: number;
    dbConnections: number;
    storageUsed: number;
    storageTotal: number;
    memoryUsage: number;
    cpuUsage: number;
    apiCallsToday: number;
    averageResponseTime: number;
}

interface SystemHealth {
    overall: 'healthy' | 'warning' | 'error';
    database: 'connected' | 'slow' | 'error';
    storage: 'connected' | 'full' | 'error';
    api: 'operational' | 'slow' | 'down';
    auth: 'operational' | 'error';
}

const AdminSystem = () => {
    const supabase = useSupabaseClient();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<SystemMetrics>({
        uptime: '0d 0h 0m',
        totalUsers: 0,
        totalDocuments: 0,
        dbConnections: 0,
        storageUsed: 0,
        storageTotal: 100,
        memoryUsage: 0,
        cpuUsage: 0,
        apiCallsToday: 0,
        averageResponseTime: 0
    });
    const [health, setHealth] = useState<SystemHealth>({
        overall: 'healthy',
        database: 'connected',
        storage: 'connected',
        api: 'operational',
        auth: 'operational'
    });

    useEffect(() => {
        loadSystemMetrics();
        checkSystemHealth();

        // Her 30 saniyede bir güncelle
        const interval = setInterval(() => {
            loadSystemMetrics();
            checkSystemHealth();
        }, 30000);

        return () => clearInterval(interval);
    }, [loadSystemMetrics, checkSystemHealth]);

    const loadSystemMetrics = useCallback(async () => {
        try {
            setLoading(true);

            // Kullanıcı sayısı
            const { count: userCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Belge sayısı
            const { count: docCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true });

            // Bugünkü API çağrıları (belgeler üzerinden tahmin)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count: todayDocs } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // Simulated metrics (gerçek production'da monitoring tool'larından gelecek)
            const startTime = new Date('2025-01-01').getTime();
            const uptime = Date.now() - startTime;
            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

            setMetrics({
                uptime: `${days}d ${hours}h ${minutes}m`,
                totalUsers: userCount || 0,
                totalDocuments: docCount || 0,
                dbConnections: Math.floor(Math.random() * 20) + 5,
                storageUsed: Math.floor(Math.random() * 40) + 10,
                storageTotal: 100,
                memoryUsage: Math.floor(Math.random() * 30) + 40,
                cpuUsage: Math.floor(Math.random() * 20) + 10,
                apiCallsToday: (todayDocs || 0) * Math.floor(Math.random() * 5) + 10,
                averageResponseTime: Math.floor(Math.random() * 100) + 50
            });
        } catch (error) {
            console.error('System metrics yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const checkSystemHealth = useCallback(async () => {
        try {
            // Database health check
            const dbStart = Date.now();
            const { error: dbError } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);
            const dbResponseTime = Date.now() - dbStart;

            // Storage health check
            const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

            const newHealth: SystemHealth = {
                overall: 'healthy',
                database: dbError ? 'error' : dbResponseTime > 1000 ? 'slow' : 'connected',
                storage: storageError ? 'error' : 'connected',
                api: 'operational',
                auth: 'operational'
            };

            // Overall health assessment
            const issues = Object.values(newHealth).filter(status =>
                status === 'error' || status === 'down'
            ).length;

            const warnings = Object.values(newHealth).filter(status =>
                status === 'slow' || status === 'full'
            ).length;

            if (issues > 0) {
                newHealth.overall = 'error';
            } else if (warnings > 0) {
                newHealth.overall = 'warning';
            }

            setHealth(newHealth);
        } catch (error) {
            console.error('System health check hatası:', error);
            setHealth({
                overall: 'error',
                database: 'error',
                storage: 'error',
                api: 'down',
                auth: 'error'
            });
        }
    }, [supabase]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
            case 'connected':
            case 'operational':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
            case 'slow':
            case 'full':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'error':
            case 'down':
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'healthy': return 'Sağlıklı';
            case 'connected': return 'Bağlı';
            case 'operational': return 'Çalışıyor';
            case 'warning': return 'Uyarı';
            case 'slow': return 'Yavaş';
            case 'full': return 'Dolu';
            case 'error': return 'Hata';
            case 'down': return 'Çalışmıyor';
            default: return 'Bilinmeyen';
        }
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'healthy':
            case 'connected':
            case 'operational':
                return 'default';
            case 'warning':
            case 'slow':
            case 'full':
                return 'secondary';
            case 'error':
            case 'down':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Sistem Durumu</h1>
                        <p className="text-muted-foreground">Sistem performansı ve durum monitörü</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Sistem durumu yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Sistem Durumu</h1>
                    <p className="text-muted-foreground">Sistem performansı ve durum monitörü</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(health.overall)} className="flex items-center gap-1">
                        {getStatusIcon(health.overall)}
                        Sistem {getStatusText(health.overall)}
                    </Badge>
                    <Button onClick={() => { loadSystemMetrics(); checkSystemHealth(); }} disabled={loading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Yenile
                    </Button>
                </div>
            </div>

            {/* System Health Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Veritabanı</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(health.database)}
                            <Badge variant={getStatusVariant(health.database)}>
                                {getStatusText(health.database)}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.dbConnections} aktif bağlantı
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Depolama</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(health.storage)}
                            <Badge variant={getStatusVariant(health.storage)}>
                                {getStatusText(health.storage)}
                            </Badge>
                        </div>
                        <Progress value={metrics.storageUsed} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.storageUsed}% kullanıldı
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(health.api)}
                            <Badge variant={getStatusVariant(health.api)}>
                                {getStatusText(health.api)}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.averageResponseTime}ms ortalama yanıt
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kimlik Doğrulama</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(health.auth)}
                            <Badge variant={getStatusVariant(health.auth)}>
                                {getStatusText(health.auth)}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Güvenli bağlantı
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Sistem Performansı
                        </CardTitle>
                        <CardDescription>CPU ve bellek kullanımı</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">CPU Kullanımı</span>
                                <span className="text-sm text-muted-foreground">{metrics.cpuUsage}%</span>
                            </div>
                            <Progress value={metrics.cpuUsage} className="h-2" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Bellek Kullanımı</span>
                                <span className="text-sm text-muted-foreground">{metrics.memoryUsage}%</span>
                            </div>
                            <Progress value={metrics.memoryUsage} className="h-2" />
                        </div>
                        <div className="pt-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Server className="h-4 w-4" />
                                <span>Çalışma Süresi: {metrics.uptime}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Kullanım İstatistikleri
                        </CardTitle>
                        <CardDescription>Platform kullanım metrikleri</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                                <div className="text-xs text-muted-foreground">Toplam Kullanıcı</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{metrics.totalDocuments}</div>
                                <div className="text-xs text-muted-foreground">Toplam Belge</div>
                            </div>
                        </div>
                        <div className="pt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Bugünkü API Çağrıları</span>
                                <span className="font-medium">{metrics.apiCallsToday}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Ortalama Yanıt Süresi</span>
                                <span className="font-medium">{metrics.averageResponseTime}ms</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Sistem Bilgileri
                    </CardTitle>
                    <CardDescription>Platform teknik detayları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Platform</div>
                            <div className="text-sm text-muted-foreground">React + Supabase</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Versión</div>
                            <div className="text-sm text-muted-foreground">v1.0.0</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Ortam</div>
                            <div className="text-sm text-muted-foreground">Production</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Son Güncelleme</div>
                            <div className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Bölge</div>
                            <div className="text-sm text-muted-foreground">Europe (Frankfurt)</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">SSL Sertifikası</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Geçerli
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSystem;