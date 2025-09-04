import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    FileText,
    Clock,
    TrendingUp,
    Shield,
    Target,
    Calendar,
    Award,
    Zap
} from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

interface Document {
    id: string;
    user_id: string;
    original_text: string;
    simplified_text: string;
    created_at: string;
    summary?: string | null;
    action_plan?: string | null;
    entities?: any[] | null;
}

interface UserAnalyticsData {
    // Temel Kullanım
    totalDocuments: number;
    documentsThisMonth: number;
    documentsThisWeek: number;
    documentsToday: number;

    // Zaman Tasarrufu
    totalTimeSaved: number;          // dakika
    avgTimeSavedPerDoc: number;      // dakika

    // Son aktivite
    lastWeekDocs: number;

    // Risk Analizi
    totalRisksDetected: number;
    highRisksDetected: number;
    risksPreventedValue: number;     // ₺

    // Avukat masrafı tasarrufu
    lawyerCostSavings: number;       // ₺
    totalSavings: number;            // ₺ (risk + avukat masrafı)

    // Verimlilik
    avgAnalysisTime: number;         // saniye
    successRate: number;             // %

    // Trend (son 6 ay)
    monthlyTrend: {
        month: string;
        documents: number;
        timeSaved: number;
    }[];

    // Başarılar
    achievements: {
        name: string;
        description: string;
        achieved: boolean;
        date?: string;
    }[];

    // Hedefler
    monthlyGoal: number;
    goalProgress: number;
}

export const UserAnalytics: React.FC = () => {
    const session = useSession();
    const supabase = useSupabaseClient();
    const user = session?.user;
    const { credits } = useCredits();

    const [analytics, setAnalytics] = useState<UserAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserAnalytics = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Kullanıcının tüm belgelerini al
                const { data: documents, error } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const docs = documents || [];
                const now = new Date();

                // Tarih hesaplamaları
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                // Temel metrikler
                const documentsThisMonth = docs.filter(doc =>
                    new Date(doc.created_at) >= thisMonth
                ).length;

                const documentsThisWeek = docs.filter(doc =>
                    new Date(doc.created_at) >= thisWeek
                ).length;

                const documentsToday = docs.filter(doc =>
                    new Date(doc.created_at) >= today
                ).length;

                // Son kullanım aktivitesi
                const lastWeekDocs = docs.filter(doc =>
                    new Date(doc.created_at) >= thisWeek
                ).length;

                // Risk analizi (mock data - gerçekte AI analiz sonuçlarından gelecek)
                const totalRisksDetected = docs.length * 2.3; // Ortalama 2.3 risk per document
                const highRisksDetected = Math.floor(docs.length * 0.4); // %40'ında yüksek risk
                const risksPreventedValue = highRisksDetected * 2500; // Risk başına 2500₺ tasarruf

                // Avukat masrafı tasarrufu (Artiklo kullanarak avukat danışmanlığına gitmeye gerek kalmadı)
                const lawyerCostSavings = docs.length * 800; // Belge başına ortalama 800₺ avukat danışmanlık ücreti
                const totalSavings = risksPreventedValue + lawyerCostSavings;

                // Aylık trend (son 6 ay)
                const monthlyTrend = [];
                for (let i = 5; i >= 0; i--) {
                    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                    const monthDocs = docs.filter(doc => {
                        const docDate = new Date(doc.created_at);
                        return docDate >= monthDate && docDate < nextMonth;
                    });

                    monthlyTrend.push({
                        month: monthDate.toLocaleDateString('tr-TR', { month: 'short' }),
                        documents: monthDocs.length,
                        timeSaved: monthDocs.length * 30
                    });
                }

                // Başarılar sistemi
                const achievements = [
                    {
                        name: "İlk Adım",
                        description: "İlk belgenizi analiz ettiniz",
                        achieved: docs.length > 0,
                        date: docs.length > 0 ? docs[docs.length - 1].created_at : undefined
                    },
                    {
                        name: "Belge Ustası",
                        description: "10 belge analiz ettiniz",
                        achieved: docs.length >= 10,
                        date: docs.length >= 10 ? docs[docs.length - 10].created_at : undefined
                    },
                    {
                        name: "Risk Dedektifi",
                        description: "50+ risk tespit ettiniz",
                        achieved: totalRisksDetected >= 50
                    },
                    {
                        name: "Zaman Tasarrufçusu",
                        description: "20+ saat tasarruf ettiniz",
                        achieved: (docs.length * 30) >= 1200
                    },
                    {
                        name: "Bu Ayın Şampiyonu",
                        description: "Bu ay 20+ belge analiz ettiniz",
                        achieved: documentsThisMonth >= 20
                    }
                ];

                // Hedef sistemi
                const monthlyGoal = 10; // Aylık hedef: 10 belge
                const goalProgress = Math.min((documentsThisMonth / monthlyGoal) * 100, 100);

                setAnalytics({
                    totalDocuments: docs.length,
                    documentsThisMonth,
                    documentsThisWeek,
                    documentsToday,
                    totalTimeSaved: docs.length * 30,
                    avgTimeSavedPerDoc: 30,
                    lastWeekDocs,
                    totalRisksDetected: Math.floor(totalRisksDetected),
                    highRisksDetected,
                    risksPreventedValue,
                    lawyerCostSavings,
                    totalSavings,
                    avgAnalysisTime: 45, // 45 saniye ortalama
                    successRate: 98.5,
                    monthlyTrend,
                    achievements,
                    monthlyGoal,
                    goalProgress
                });

            } catch (error) {
                console.error('Analytics yükleme hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserAnalytics();
    }, [user, supabase]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-6">
            {/* Ana Metrikler */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Belge</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
                        <p className="text-xs text-muted-foreground">
                            Bu ay +{analytics.documentsThisMonth}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Zaman Tasarrufu</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.floor(analytics.totalTimeSaved / 60)}s {analytics.totalTimeSaved % 60}dk
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ortalama {analytics.avgTimeSavedPerDoc}dk/belge
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Tespiti</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalRisksDetected}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.highRisksDetected} yüksek risk
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Tasarruf</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺{analytics.totalSavings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Risk + Avukat tasarrufu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Aylık Hedef */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Bu Ayın Hedefi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{analytics.documentsThisMonth} / {analytics.monthlyGoal} belge</span>
                            <span>{Math.round(analytics.goalProgress)}%</span>
                        </div>
                        <Progress value={analytics.goalProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {analytics.monthlyGoal - analytics.documentsThisMonth > 0
                                ? `Hedefe ${analytics.monthlyGoal - analytics.documentsThisMonth} belge kaldı`
                                : "🎉 Hedefi tamamladınız!"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Son Aktivite */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">📈 Son Aktiviteniz</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-700">{analytics.documentsToday}</div>
                                <div className="text-xs text-blue-600">Bugün</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-700">{analytics.lastWeekDocs}</div>
                                <div className="text-xs text-green-600">Bu Hafta</div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-700">{analytics.documentsThisMonth}</div>
                                <div className="text-xs text-purple-600">Bu Ay</div>
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <div className="text-sm font-medium text-orange-800 mb-1">
                                💡 Kullanım Önerisi
                            </div>
                            <p className="text-xs text-orange-700">
                                {analytics.documentsThisMonth < 5
                                    ? "Daha fazla belge analiz ederek tasarrufunuzu artırabilirsiniz!"
                                    : analytics.documentsThisMonth >= 15
                                        ? "Harika! Çok aktif bir kullanıcısınız 🔥"
                                        : "Güzel! Düzenli kullanım gösteriyorsunuz ⭐"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Başarılar */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Başarılarınız
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                        {analytics.achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${achievement.achieved
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${achievement.achieved ? 'bg-green-500' : 'bg-gray-400'
                                        }`} />
                                    <span className="font-medium text-sm">{achievement.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.description}
                                </p>
                                {achievement.achieved && achievement.date && (
                                    <p className="text-xs text-green-600 mt-1">
                                        {new Date(achievement.date).toLocaleDateString('tr-TR')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Hızlı İstatistikler */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.documentsThisWeek}</div>
                        <p className="text-xs text-muted-foreground">belge analiz edildi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Hız</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.avgAnalysisTime}sn</div>
                        <p className="text-xs text-muted-foreground">analiz süresi</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">%{analytics.successRate}</div>
                        <p className="text-xs text-muted-foreground">başarılı analiz</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserAnalytics;
