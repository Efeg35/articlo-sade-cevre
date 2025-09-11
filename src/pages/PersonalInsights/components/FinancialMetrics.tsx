import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Shield, FileText, Clock } from "lucide-react";
import { FinancialMetric } from '../types';

interface FinancialMetricsProps {
    totalSavings: number;
    risksPreventedValue: number;
    lawyerCostSavings: number;
    totalTimeSaved: number;
    avgSavingsPerDocument: number;
    totalDocuments: number;
    highRisksDetected: number;
}

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
    totalSavings,
    risksPreventedValue,
    lawyerCostSavings,
    totalTimeSaved,
    avgSavingsPerDocument,
    totalDocuments,
    highRisksDetected
}) => {
    const metrics: FinancialMetric[] = [
        {
            title: "💰 Toplam Tasarruf",
            value: `₺${totalSavings.toLocaleString()}`,
            subtitle: `Belge başına ₺${Math.round(avgSavingsPerDocument).toLocaleString()}`,
            icon: "DollarSign",
            gradient: "from-green-500/10 to-emerald-500/10",
            iconColor: "text-green-600",
            valueColor: "text-green-700"
        },
        {
            title: "🛡️ Risk Tasarrufu",
            value: `₺${risksPreventedValue.toLocaleString()}`,
            subtitle: `${highRisksDetected} yüksek risk önlendi`,
            icon: "Shield",
            gradient: "from-blue-500/10 to-cyan-500/10",
            iconColor: "text-blue-600",
            valueColor: "text-blue-700"
        },
        {
            title: "⚖️ Avukat Tasarrufu",
            value: `₺${lawyerCostSavings.toLocaleString()}`,
            subtitle: `${totalDocuments} danışmanlık yerine Artiklo`,
            icon: "FileText",
            gradient: "from-purple-500/10 to-pink-500/10",
            iconColor: "text-purple-600",
            valueColor: "text-purple-700"
        },
        {
            title: "⏰ Zaman Tasarrufu",
            value: `${Math.floor(totalTimeSaved / 60)}s ${totalTimeSaved % 60}dk`,
            subtitle: "Anlık belge analizi",
            icon: "Clock",
            gradient: "from-orange-500/10 to-red-500/10",
            iconColor: "text-orange-600",
            valueColor: "text-orange-700"
        }
    ];

    const getIcon = (iconName: string) => {
        const iconProps = { className: "h-4 w-4" };
        switch (iconName) {
            case 'DollarSign': return <DollarSign {...iconProps} />;
            case 'Shield': return <Shield {...iconProps} />;
            case 'FileText': return <FileText {...iconProps} />;
            case 'Clock': return <Clock {...iconProps} />;
            default: return <DollarSign {...iconProps} />;
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient}`}></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <div className={`${metric.iconColor}`}>
                            {getIcon(metric.icon)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${metric.valueColor}`}>
                            {metric.value}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {metric.subtitle}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};