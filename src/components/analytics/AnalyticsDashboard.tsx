import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    Eye,
    Download,
    Search,
    FileText,
    TrendingUp,
    Calendar,
    Activity,
    MousePointer,
    Clock
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface DashboardStats {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    totalTemplateViews: number;
    totalDownloads: number;
    totalSearches: number;
    avgSessionDuration: number;
    bounceRate: number;
}

interface ChartData {
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
    interactions: number;
}

interface TemplateStats {
    templateId: string;
    title: string;
    category: string;
    views: number;
    generations: number;
    downloads: number;
}

interface SearchQuery {
    query: string;
    count: number;
    avgResults: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalSessions: 0,
        totalPageViews: 0,
        totalTemplateViews: 0,
        totalDownloads: 0,
        totalSearches: 0,
        avgSessionDuration: 0,
        bounceRate: 0
    });

    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [templateStats, setTemplateStats] = useState<TemplateStats[]>([]);
    const [topSearches, setTopSearches] = useState<SearchQuery[]>([]);
    const [categoryStats, setCategoryStats] = useState<Array<{ name: string; value: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    const loadAnalyticsData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadDashboardStats(),
                loadChartData(),
                loadTemplateStats(),
                loadSearchStats(),
                loadCategoryStats()
            ]);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

    const loadDashboardStats = async () => {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: events } = await supabase
            .from('analytics_events')
            .select('*')
            .gte('timestamp', startDate.toISOString());

        const { data: sessions } = await supabase
            .from('user_sessions')
            .select('*')
            .gte('start_time', startDate.toISOString());

        if (events && sessions) {
            const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
            const pageViews = events.filter(e => e.event_type === 'page_view').length;
            const templateViews = events.filter(e => e.event_type === 'template_interaction' && e.event_name === 'Template View').length;
            const downloads = events.filter(e => e.event_type === 'document_action').length;
            const searches = events.filter(e => e.event_type === 'search').length;

            setStats({
                totalUsers: uniqueUsers,
                totalSessions: sessions.length,
                totalPageViews: pageViews,
                totalTemplateViews: templateViews,
                totalDownloads: downloads,
                totalSearches: searches,
                avgSessionDuration: sessions.reduce((acc, s) => acc + (s.page_views || 0), 0) / sessions.length || 0,
                bounceRate: sessions.filter(s => s.page_views === 1).length / sessions.length * 100 || 0
            });
        }
    };

    const loadChartData = async () => {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const { data } = await supabase
            .from('daily_platform_stats')
            .select('*')
            .order('date', { ascending: true })
            .limit(days);

        if (data) {
            setChartData(data.map(d => ({
                date: new Date(d.date).toLocaleDateString('tr-TR'),
                users: d.unique_users || 0,
                sessions: d.unique_sessions || 0,
                pageViews: d.page_views || 0,
                interactions: d.template_interactions || 0
            })));
        }
    };

    const loadTemplateStats = async () => {
        const { data } = await supabase
            .from('popular_templates')
            .select('*')
            .order('total_views', { ascending: false })
            .limit(10);

        if (data) {
            setTemplateStats(data.map(t => ({
                templateId: t.template_id,
                title: t.template_title,
                category: t.template_category,
                views: t.total_views || 0,
                generations: t.total_generations || 0,
                downloads: t.total_downloads || 0
            })));
        }
    };

    const loadSearchStats = async () => {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data } = await supabase
            .from('search_analytics')
            .select('search_query, results_count')
            .gte('timestamp', startDate.toISOString());

        if (data) {
            const queryStats = data.reduce((acc: { [key: string]: { count: number; totalResults: number } }, item) => {
                const query = item.search_query.toLowerCase();
                if (!acc[query]) {
                    acc[query] = { count: 0, totalResults: 0 };
                }
                acc[query].count++;
                acc[query].totalResults += item.results_count || 0;
                return acc;
            }, {});

            const topQueries = Object.entries(queryStats)
                .map(([query, stats]) => ({
                    query,
                    count: stats.count,
                    avgResults: Math.round(stats.totalResults / stats.count)
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            setTopSearches(topQueries);
        }
    };

    const loadCategoryStats = async () => {
        const { data } = await supabase
            .from('template_analytics')
            .select('template_category, views')
            .not('template_category', 'is', null);

        if (data) {
            const categoryTotals = data.reduce((acc: { [key: string]: number }, item) => {
                const category = item.template_category || 'Diğer';
                acc[category] = (acc[category] || 0) + (item.views || 0);
                return acc;
            }, {});

            const categoryData = Object.entries(categoryTotals)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 8);

            setCategoryStats(categoryData);
        }
    };

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; change?: string }> = ({
        title,
        value,
        icon,
        change
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className="text-xs text-muted-foreground">
                        {change}
                    </p>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="p-6">
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">
                        Platform kullanım istatistikleri ve performans metrikleri
                    </p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((range) => (
                        <Button
                            key={range}
                            variant={dateRange === range ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDateRange(range)}
                        >
                            {range === '7d' ? '7 Gün' : range === '30d' ? '30 Gün' : '90 Gün'}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers.toLocaleString()}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Toplam Oturum"
                    value={stats.totalSessions.toLocaleString()}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Sayfa Görüntüleme"
                    value={stats.totalPageViews.toLocaleString()}
                    icon={<Eye className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Şablon Görüntüleme"
                    value={stats.totalTemplateViews.toLocaleString()}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Toplam İndirme"
                    value={stats.totalDownloads.toLocaleString()}
                    icon={<Download className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Toplam Arama"
                    value={stats.totalSearches.toLocaleString()}
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Ortalama Oturum Süresi"
                    value={`${Math.round(stats.avgSessionDuration)} say.`}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Çıkış Oranı"
                    value={`${Math.round(stats.bounceRate)}%`}
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                    <TabsTrigger value="templates">Şablonlar</TabsTrigger>
                    <TabsTrigger value="search">Arama</TabsTrigger>
                    <TabsTrigger value="categories">Kategoriler</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Günlük Kullanıcı Aktivitesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="users" stroke="#8884d8" name="Kullanıcılar" />
                                        <Line type="monotone" dataKey="sessions" stroke="#82ca9d" name="Oturumlar" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sayfa Görüntüleme ve Etkileşimler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="pageViews" fill="#8884d8" name="Sayfa Görüntüleme" />
                                        <Bar dataKey="interactions" fill="#82ca9d" name="Şablon Etkileşimi" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>En Popüler Şablonlar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {templateStats.map((template, index) => (
                                    <div key={template.templateId} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    #{index + 1}
                                                </Badge>
                                                <h3 className="font-medium">{template.title}</h3>
                                                <Badge variant="secondary">{template.category}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {template.views}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-4 w-4" />
                                                {template.generations}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Download className="h-4 w-4" />
                                                {template.downloads}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="search" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>En Çok Aranan Terimler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topSearches.map((search, index) => (
                                    <div key={search.query} className="flex items-center justify-between p-3 border rounded">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">#{index + 1}</Badge>
                                            <span className="font-medium">{search.query}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{search.count} arama</span>
                                            <span>~{search.avgResults} sonuç</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori Dağılımı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={categoryStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryStats.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};