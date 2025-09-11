import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Sparkles, Zap } from "lucide-react";
import { ArchiveStats as StatsType } from '../types';
import { Skeleton } from "@/components/ui/skeleton";

interface ArchiveStatsProps {
    stats: StatsType;
    credits: number;
    loading: boolean;
}

const StatsSkeleton = () => (
    <Card className="group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
        </CardContent>
    </Card>
);

export const ArchiveStats: React.FC<ArchiveStatsProps> = ({ stats, credits, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsSkeleton />
                <StatsSkeleton />
                <StatsSkeleton />
                <StatsSkeleton />
            </div>
        );
    }

    const statsCards = [
        {
            title: "Bu Ay",
            value: stats.thisMonth.toString(),
            subtitle: "Sadeleştirilen Belge",
            icon: <FileText className="h-4 w-4 text-primary" />,
            badge: stats.thisMonth > 0 ? "Aktif" : null
        },
        {
            title: "Tasarruf Edilen Süre",
            value: `${stats.timeSaved} dk`,
            subtitle: `Yaklaşık ${Math.round(stats.timeSaved / 60)} saat`,
            icon: <Clock className="h-4 w-4 text-primary" />,
            badge: stats.timeSaved > 60 ? `${Math.round(stats.timeSaved / 60)}+ saat` : null
        },
        {
            title: "Kullanılan Kredi",
            value: stats.creditsUsed.toString(),
            subtitle: `Kalan: ${credits} kredi`,
            icon: <Sparkles className="h-4 w-4 text-primary" />,
            badge: credits > 0 ? `${credits} kredi kaldı` : null
        },
        {
            title: "Toplam Belge",
            value: stats.totalDocs.toString(),
            subtitle: "Tüm zamanlar",
            icon: <Zap className="h-4 w-4 text-primary" />,
            badge: stats.totalDocs > 10 ? "10+ belge" : null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsCards.map((card, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-primary transition-colors">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {card.icon}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold group-hover:text-primary transition-colors">
                            {card.value}
                        </div>
                        <div className="flex items-center mt-1">
                            <p className="text-sm text-muted-foreground">
                                {card.subtitle}
                            </p>
                            {card.badge && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {card.badge}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};