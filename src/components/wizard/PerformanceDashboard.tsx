/**
 * 🎯 Performance Monitoring Dashboard
 * 
 * FAZ B: Real-time performance tracking for wizard components
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity,
    Clock,
    Zap,
    Database,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
    componentLoadTime: number;
    mcpResponseTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    errorCount: number;
    successCount: number;
    averageUserInputDelay: number;
    lastUpdated: Date;
}

interface PerformanceDashboardProps {
    isVisible?: boolean;
    onClose?: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
    isVisible = false,
    onClose
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        componentLoadTime: 0,
        mcpResponseTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        errorCount: 0,
        successCount: 0,
        averageUserInputDelay: 0,
        lastUpdated: new Date()
    });

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            collectPerformanceMetrics();
            const interval = setInterval(collectPerformanceMetrics, 5000); // 5 saniyede bir güncelle
            return () => clearInterval(interval);
        }
    }, [isVisible]);

    const collectPerformanceMetrics = async () => {
        setIsRefreshing(true);

        try {
            // Performance API'den metrikleri topla
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const resources = performance.getEntriesByType('resource');

            // Component load time (DOM Content Loaded)
            const componentLoadTime = navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0;

            // MCP response time estimation (network resources ortalaması)
            const networkRequests = resources.filter(entry =>
                entry.name.includes('supabase') || entry.name.includes('mcp')
            );
            const avgMcpResponseTime = networkRequests.length > 0
                ? networkRequests.reduce((sum, entry) => sum + entry.duration, 0) / networkRequests.length
                : 0;

            // Memory usage (eğer mevcut ise)
            const memoryInfo = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
            const memoryUsage = memoryInfo ?
                ((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 0;

            // Cache hit rate (localStorage'dan simüle ediyoruz)
            const cacheStats = getCacheStats();
            const cacheHitRate = cacheStats.total > 0 ?
                (cacheStats.hits / cacheStats.total * 100) : 0;

            // Error tracking (console.error calls)
            const errorCount = getErrorCount();
            const successCount = getSuccessCount();

            // User input delay (ortalama)
            const averageUserInputDelay = getAverageInputDelay();

            setMetrics({
                componentLoadTime: Math.round(componentLoadTime),
                mcpResponseTime: Math.round(avgMcpResponseTime),
                memoryUsage: Math.round(memoryUsage),
                cacheHitRate: Math.round(cacheHitRate),
                errorCount,
                successCount,
                averageUserInputDelay: Math.round(averageUserInputDelay),
                lastUpdated: new Date()
            });

        } catch (error) {
            console.error('Performance metrics collection failed:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getCacheStats = () => {
        try {
            const cacheStats = localStorage.getItem('wizard-cache-stats');
            return cacheStats ? JSON.parse(cacheStats) : { hits: 0, misses: 0, total: 0 };
        } catch {
            return { hits: 0, misses: 0, total: 0 };
        }
    };

    const getErrorCount = () => {
        try {
            return parseInt(localStorage.getItem('wizard-error-count') || '0');
        } catch {
            return 0;
        }
    };

    const getSuccessCount = () => {
        try {
            return parseInt(localStorage.getItem('wizard-success-count') || '0');
        } catch {
            return 0;
        }
    };

    const getAverageInputDelay = () => {
        try {
            const delays = JSON.parse(localStorage.getItem('wizard-input-delays') || '[]');
            return delays.length > 0 ? delays.reduce((sum: number, delay: number) => sum + delay, 0) / delays.length : 0;
        } catch {
            return 0;
        }
    };

    const getStatusColor = (value: number, thresholds: { good: number; warning: number }): "default" | "destructive" | "outline" | "secondary" => {
        if (value <= thresholds.good) return 'default';
        if (value <= thresholds.warning) return 'secondary';
        return 'destructive';
    };

    const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
        if (value <= thresholds.good) return CheckCircle;
        if (value <= thresholds.warning) return AlertTriangle;
        return AlertTriangle;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4">
            <Card className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto">
                <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="hidden sm:inline">Wizard Performans İzleme</span>
                                <span className="sm:hidden">Performans İzleme</span>
                            </CardTitle>
                            <CardDescription className="text-sm">
                                <span className="hidden sm:inline">Gerçek zamanlı performans metrikleri ve sistem durumu</span>
                                <span className="sm:hidden">Performans metrikleri</span>
                                <span className="block text-xs sm:text-sm mt-1">
                                    Son güncelleme: {metrics.lastUpdated.toLocaleTimeString('tr-TR')}
                                </span>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={collectPerformanceMetrics}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Yenile
                            </Button>
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Kapat
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Component Load Time */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Component Yükleme
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold">
                                            {metrics.componentLoadTime}ms
                                        </p>
                                    </div>
                                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <Badge variant={getStatusColor(metrics.componentLoadTime, { good: 500, warning: 1000 })}>
                                        {metrics.componentLoadTime <= 500 ? 'Mükemmel' :
                                            metrics.componentLoadTime <= 1000 ? 'İyi' : 'Yavaş'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* MCP Response Time */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            MCP Yanıt Süresi
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold">
                                            {metrics.mcpResponseTime}ms
                                        </p>
                                    </div>
                                    <Database className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <Badge variant={getStatusColor(metrics.mcpResponseTime, { good: 1000, warning: 2000 })}>
                                        {metrics.mcpResponseTime <= 1000 ? 'Hızlı' :
                                            metrics.mcpResponseTime <= 2000 ? 'Normal' : 'Yavaş'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Memory Usage */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Bellek Kullanımı
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold">
                                            {metrics.memoryUsage}%
                                        </p>
                                    </div>
                                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <Progress value={metrics.memoryUsage} className="h-2" />
                                    <Badge variant={getStatusColor(metrics.memoryUsage, { good: 50, warning: 80 })} className="mt-1">
                                        {metrics.memoryUsage <= 50 ? 'Optimal' :
                                            metrics.memoryUsage <= 80 ? 'Normal' : 'Yüksek'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cache Hit Rate */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Cache Başarısı
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold">
                                            {metrics.cacheHitRate}%
                                        </p>
                                    </div>
                                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <Progress value={metrics.cacheHitRate} className="h-2" />
                                    <Badge variant={getStatusColor(100 - metrics.cacheHitRate, { good: 20, warning: 50 })} className="mt-1">
                                        {metrics.cacheHitRate >= 80 ? 'Mükemmel' :
                                            metrics.cacheHitRate >= 50 ? 'İyi' : 'Düşük'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Error & Success Tracking */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Hatalar
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold text-red-600">
                                            {metrics.errorCount}
                                        </p>
                                    </div>
                                    <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Başarılı İşlemler
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {metrics.successCount}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Ortalama Giriş Gecikmesi
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {metrics.averageUserInputDelay}ms
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="mt-2">
                                    <Badge variant={getStatusColor(metrics.averageUserInputDelay, { good: 100, warning: 300 })}>
                                        {metrics.averageUserInputDelay <= 100 ? 'Anlık' :
                                            metrics.averageUserInputDelay <= 300 ? 'Hızlı' : 'Yavaş'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Performans Önerileri</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {metrics.componentLoadTime > 1000 && (
                                    <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Component yükleme süresi yüksek</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Lazy loading ve code splitting kullanımını artırın.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {metrics.mcpResponseTime > 2000 && (
                                    <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                                        <Database className="h-5 w-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">MCP yanıt süresi yavaş</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Caching stratejisini gözden geçirin ve request batching kullanın.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {metrics.memoryUsage > 80 && (
                                    <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                                        <Zap className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Bellek kullanımı yüksek</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Memory leaks kontrolü yapın ve component cleanup'ını iyileştirin.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {metrics.cacheHitRate < 50 && (
                                    <div className="flex items-start gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                                        <TrendingDown className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Cache hit rate düşük</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Cache stratejisini ve TTL değerlerini optimize edin.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {metrics.errorCount === 0 && metrics.componentLoadTime <= 500 && metrics.mcpResponseTime <= 1000 && (
                                    <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Performans optimal durumda!</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tüm metrikler hedef değerlerin içinde. Mükemmel çalışma!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};