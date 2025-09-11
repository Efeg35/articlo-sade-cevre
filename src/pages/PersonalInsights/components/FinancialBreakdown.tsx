import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { PersonalInsightsData } from '../types';

interface FinancialBreakdownProps {
    insights: PersonalInsightsData;
}

export const FinancialBreakdown: React.FC<FinancialBreakdownProps> = ({
    insights
}) => {
    // Mock previous month data for comparison (in real app, this would come from API)
    const previousMonthSavings = insights.totalSavings * 0.8;

    const getComparisonText = (current: number, previous: number) => {
        if (previous === 0) return "İlk ay";
        const change = ((current - previous) / previous * 100).toFixed(1);
        return Number(change) > 0 ? `+${change}%` : `${change}%`;
    };

    const getChangeColor = (current: number, previous: number) => {
        if (previous === 0) return "text-muted-foreground";
        const change = (current - previous) / previous * 100;
        return change > 0 ? "text-green-600" : "text-red-600";
    };

    const getChangeIcon = (current: number, previous: number) => {
        if (previous === 0) return <CheckCircle className="h-3 w-3" />;
        const change = (current - previous) / previous * 100;
        return change > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
        ) : (
            <AlertTriangle className="h-3 w-3 text-red-600" />
        );
    };

    const avgPerAnalysis = insights.totalDocuments > 0 ? (insights.totalSavings / insights.totalDocuments).toFixed(2) : "0";

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    💰 Detaylı Finansal Analiz
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Ana Metriklər */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Toplam Tasarruf</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${insights.totalSavings.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                            {getChangeIcon(insights.totalSavings, previousMonthSavings)}
                            <span className={getChangeColor(insights.totalSavings, previousMonthSavings)}>
                                {getComparisonText(insights.totalSavings, previousMonthSavings)}
                            </span>
                            <span className="text-muted-foreground">geçen aya göre</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Doküman Başına Ort.</p>
                        <p className="text-2xl font-bold text-blue-600">
                            ${avgPerAnalysis}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                            <span className="text-muted-foreground">
                                {insights.totalDocuments} doküman bazında
                            </span>
                        </div>
                    </div>
                </div>

                {/* Performans Göstergeleri */}
                <div className="space-y-3">
                    <h4 className="font-medium text-sm">Performans Göstergeleri</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Bu Ay Hedef</span>
                            <Badge variant={insights.totalSavings >= 100 ? "default" : "secondary"}>
                                ${insights.totalSavings.toFixed(2)} / $100.00
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Trend Durumu</span>
                            <Badge variant={insights.totalSavings > previousMonthSavings ? "default" : "destructive"}>
                                {insights.totalSavings > previousMonthSavings ? "Artış Trendi" : "Düşüş Trendi"}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Kullanım Yoğunluğu</span>
                            <Badge variant={insights.totalDocuments >= 10 ? "default" : "outline"}>
                                {insights.totalDocuments >= 20 ? "Yüksek" : insights.totalDocuments >= 10 ? "Orta" : "Düşük"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Projeksiyonlar */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Aylık Projeksiyon
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-muted-foreground">Mevcut Tempo:</span>
                            <p className="font-medium">${(insights.totalSavings * 1.2).toFixed(2)}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Hedef Tempo:</span>
                            <p className="font-medium">${Math.max(120, insights.totalSavings * 1.5).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};