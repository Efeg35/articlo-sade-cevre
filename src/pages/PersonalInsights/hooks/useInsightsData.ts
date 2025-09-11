import { useState, useEffect } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { PersonalInsightsData, Document, InsightsState } from '../types';
import { useFinancialCalculations } from './useFinancialCalculations';
import { useBadgeSystem } from './useBadgeSystem';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function useInsightsData(): InsightsState {
    const session = useSession();
    const supabase = useSupabaseClient();
    const user = session?.user;

    const [insights, setInsights] = useState<PersonalInsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const financialCalculations = useFinancialCalculations();
    const badgeSystem = useBadgeSystem();

    useEffect(() => {
        const loadPersonalInsights = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Kullanıcının tüm belgelerini al
                const { data: documents, error: dbError } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (dbError) throw dbError;

                const docs = documents || [];
                const now = new Date();

                // Finansal hesaplamalar
                const {
                    totalSavings,
                    risksPreventedValue,
                    lawyerCostSavings,
                    avgSavingsPerDocument,
                    financialBreakdown
                } = financialCalculations.calculateFinancials(docs);

                // Bu ay belge sayısı
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const documentsThisMonth = docs.filter(doc =>
                    new Date(doc.created_at) >= thisMonth
                ).length;

                // Risk analizi
                const totalRisksDetected = Math.floor(docs.length * 2.3);
                const highRisksDetected = Math.floor(docs.length * 0.4);

                // Aylık trend (son 6 ay)
                const monthlyTrend = [];
                for (let i = 5; i >= 0; i--) {
                    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                    const monthDocs = docs.filter(doc => {
                        const docDate = new Date(doc.created_at);
                        return docDate >= monthDate && docDate < nextMonth;
                    });

                    const monthSavings = (Math.floor(monthDocs.length * 0.4) * 2500) + (monthDocs.length * 800);

                    monthlyTrend.push({
                        month: monthDate.toLocaleDateString('tr-TR', { month: 'short' }),
                        documents: monthDocs.length,
                        savings: monthSavings,
                        timeSaved: monthDocs.length * 30
                    });
                }

                // Özel rozetler sistemi
                const specialBadges = badgeSystem.calculateBadges(docs, totalRisksDetected, documentsThisMonth, totalSavings);

                // Haftalık aktivite analizi (son 4 hafta)
                const weeklyActivity = [];
                for (let i = 3; i >= 0; i--) {
                    const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
                    const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));

                    const weekDocs = docs.filter(doc => {
                        const docDate = new Date(doc.created_at);
                        return docDate >= weekStart && docDate < weekEnd;
                    });

                    weeklyActivity.push({
                        week: `${Math.floor(i + 1)}. Hafta`,
                        documents: weekDocs.length,
                        color: COLORS[3 - i]
                    });
                }

                // En aktif günler analizi
                const dayActivity: { [key: string]: number } = {};
                docs.forEach(doc => {
                    const dayName = new Date(doc.created_at).toLocaleDateString('tr-TR', { weekday: 'long' });
                    dayActivity[dayName] = (dayActivity[dayName] || 0) + 1;
                });

                const weeklyPattern = Object.entries(dayActivity)
                    .map(([day, count]) => ({ day, count }))
                    .sort((a, b) => b.count - a.count);

                // Başarılar
                const achievements = [
                    {
                        name: "💰 Tasarruf Şampiyonu",
                        description: `${totalSavings.toLocaleString()}₺ toplam tasarruf sağladınız`,
                        achieved: totalSavings > 5000,
                        reward: "Özel tasarruf rozeti"
                    },
                    {
                        name: "⚡ Hız Ustası",
                        description: "Belge başına ortalama 30 dakika tasarruf",
                        achieved: docs.length >= 5,
                        reward: "Verimlilik rozeti"
                    },
                    {
                        name: "🛡️ Risk Dedektifi",
                        description: `${totalRisksDetected} risk tespit ettiniz`,
                        achieved: totalRisksDetected >= 20,
                        reward: "Güvenlik uzmanı rozeti"
                    },
                    {
                        name: "📚 Belge Koleksiyoncusu",
                        description: `${docs.length} belge analiz ettiniz`,
                        achieved: docs.length >= 15,
                        reward: "Arşiv ustası rozeti"
                    },
                    {
                        name: "🏆 Bu Ayın Yıldızı",
                        description: `Bu ay ${documentsThisMonth} belge analiz ettiniz`,
                        achieved: documentsThisMonth >= 10,
                        reward: "Aylık başarı rozeti"
                    }
                ];

                // Verimlilik metrikleri
                const efficiency = {
                    avgAnalysisTime: 45, // saniye
                    successRate: 98.5,
                    userRank: docs.length >= 20 ? "Top 10%" : docs.length >= 10 ? "Top 25%" : "Yeni Kullanıcı"
                };

                // Projeksiyonlar
                const monthlyAverage = docs.length > 0 ? docs.length / Math.max(1, Math.ceil((now.getTime() - new Date(docs[docs.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))) : 0;
                const yearEndSavings = totalSavings + (monthlyAverage * (12 - now.getMonth()) * avgSavingsPerDocument);
                const monthlyGoal = 10;
                const goalProgress = Math.min((documentsThisMonth / monthlyGoal) * 100, 100);

                setInsights({
                    totalSavings,
                    risksPreventedValue,
                    lawyerCostSavings,
                    avgSavingsPerDocument,
                    financialBreakdown,
                    totalDocuments: docs.length,
                    documentsThisMonth,
                    totalTimeSaved: docs.length * 30,
                    totalRisksDetected,
                    highRisksDetected,
                    specialBadges,
                    monthlyTrend,
                    weeklyActivity,
                    weeklyPattern,
                    achievements,
                    efficiency,
                    projections: {
                        yearEndSavings,
                        monthlyGoal,
                        goalProgress
                    }
                });

            } catch (error) {
                console.error('Personal Insights yükleme hatası:', error);
                setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
            } finally {
                setLoading(false);
            }
        };

        loadPersonalInsights();
    }, [user, supabase, financialCalculations, badgeSystem]);

    return {
        insights,
        loading,
        error
    };
}