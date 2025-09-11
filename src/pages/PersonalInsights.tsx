import React from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { Capacitor } from "@capacitor/core";

// Import custom hooks
import { useInsightsData } from './PersonalInsights/hooks/useInsightsData';

// Import components
import { FinancialMetrics } from './PersonalInsights/components/FinancialMetrics';
import { TrendChart } from './PersonalInsights/components/TrendChart';
import { FinancialBreakdown } from './PersonalInsights/components/FinancialBreakdown';
import { ActivityChart } from './PersonalInsights/components/ActivityChart';
import { BadgeSystem } from './PersonalInsights/components/BadgeSystem';
import { PerformanceCard } from './PersonalInsights/components/PerformanceCard';
import { ProjectionCard } from './PersonalInsights/components/ProjectionCard';

const PersonalInsights: React.FC = () => {
    const session = useSession();
    const supabase = useSupabaseClient();
    const user = session?.user;
    const { credits } = useCredits();

    // Use custom hook for data management
    const { insights, loading, error } = useInsightsData();

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'pb-safe' : 'pb-16'}`}>
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error or no data state
    if (error || !insights) {
        return (
            <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'pb-safe' : 'pb-16'}`}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Veriler yüklenemedi</h2>
                        <p className="text-muted-foreground mb-6">
                            {error || 'Kişisel istatistikler şu anda kullanılamıyor.'}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Tekrar Dene
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'pb-safe' : 'pb-16'}`}>
            <div className="container mx-auto px-4 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Kişisel Başarılarım
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        Artiklo ile kazandığınız zaman, para ve güvenlik. Kişisel istatistikleriniz ve başarılarınız.
                    </p>
                </div>

                {/* Ana Finansal Metrikler */}
                <div className="mb-8">
                    <FinancialMetrics
                        totalSavings={insights.totalSavings}
                        risksPreventedValue={insights.risksPreventedValue}
                        lawyerCostSavings={insights.lawyerCostSavings}
                        totalTimeSaved={insights.totalTimeSaved}
                        avgSavingsPerDocument={insights.avgSavingsPerDocument}
                        totalDocuments={insights.totalDocuments}
                        highRisksDetected={insights.highRisksDetected}
                    />
                </div>

                {/* Trend Analizi ve Finansal Breakdown */}
                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    <TrendChart data={insights.monthlyTrend} />
                    <FinancialBreakdown insights={insights} />
                </div>

                {/* Aktivite Analizi ve Rozet Sistemi */}
                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    <ActivityChart
                        weeklyActivity={insights.weeklyActivity}
                        weeklyPattern={insights.weeklyPattern}
                    />
                    <BadgeSystem badges={insights.specialBadges} />
                </div>

                {/* Performans ve Projeksiyonlar */}
                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    <PerformanceCard
                        efficiency={insights.efficiency}
                        totalDocuments={insights.totalDocuments}
                    />
                    <ProjectionCard
                        projections={insights.projections}
                        totalSavings={insights.totalSavings}
                        documentsThisMonth={insights.documentsThisMonth}
                    />
                </div>

                {/* CTA Button */}
                <div className="text-center mb-8">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-3 text-lg"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        <FileText className="h-5 w-5 mr-3" />
                        Yeni Belge Analiz Et
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </Button>
                </div>

                {/* Alt Bilgi */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        📊 Bu istatistikler gerçek kullanım verilerinize dayanır ve günlük güncellenir.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PersonalInsights;
