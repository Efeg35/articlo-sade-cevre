// Type definitions for PersonalInsights components

export interface Document {
    id: string;
    user_id: string;
    original_text: string;
    simplified_text: string;
    created_at: string;
    summary?: string | null;
    action_plan?: string | null;
    entities?: Record<string, unknown>[] | null;
}

export interface PersonalInsightsData {
    // Finansal Tasarruf
    totalSavings: number;
    risksPreventedValue: number;
    lawyerCostSavings: number;
    avgSavingsPerDocument: number;

    // Detaylı Finansal Analiz
    financialBreakdown: {
        documentType: string;
        savings: number;
        count: number;
    }[];

    // Kullanım İstatistikleri
    totalDocuments: number;
    documentsThisMonth: number;
    totalTimeSaved: number;
    totalRisksDetected: number;
    highRisksDetected: number;

    // Özel Rozetler
    specialBadges: {
        id: string;
        name: string;
        description: string;
        icon: string;
        earned: boolean;
        earnedDate?: string;
        category: 'usage' | 'time' | 'financial' | 'special';
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }[];

    // Trend Verileri
    monthlyTrend: {
        month: string;
        documents: number;
        savings: number;
        timeSaved: number;
    }[];

    // Haftalık Aktivite
    weeklyActivity: {
        week: string;
        documents: number;
        color: string;
    }[];

    // Günlük Pattern
    weeklyPattern: {
        day: string;
        count: number;
    }[];

    // Başarılar ve Hedefler
    achievements: {
        name: string;
        description: string;
        achieved: boolean;
        reward?: string;
    }[];

    // Özel Metrikler
    efficiency: {
        avgAnalysisTime: number;
        successRate: number;
        userRank: string; // "Top 10%" gibi
    };

    // Gelecek Projeksiyonlar
    projections: {
        yearEndSavings: number;
        monthlyGoal: number;
        goalProgress: number;
    };
}

export interface FinancialMetric {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    gradient: string;
    iconColor: string;
    valueColor: string;
}

export interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    category: 'usage' | 'time' | 'financial' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChartData {
    month: string;
    documents: number;
    savings: number;
    timeSaved: number;
}

export interface WeeklyActivityData {
    week: string;
    documents: number;
    color: string;
}

export interface WeeklyPatternData {
    day: string;
    count: number;
}

export interface Achievement {
    name: string;
    description: string;
    achieved: boolean;
    reward?: string;
}

export interface EfficiencyMetrics {
    avgAnalysisTime: number;
    successRate: number;
    userRank: string;
}

export interface ProjectionData {
    yearEndSavings: number;
    monthlyGoal: number;
    goalProgress: number;
}

export interface InsightsState {
    insights: PersonalInsightsData | null;
    loading: boolean;
    error: string | null;
}