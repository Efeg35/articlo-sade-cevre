import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Target, TrendingUp, Award } from "lucide-react";
import { ProjectionData } from '../types';

interface ProjectionCardProps {
    projections: ProjectionData;
    totalSavings: number;
    documentsThisMonth: number;
}

export const ProjectionCard: React.FC<ProjectionCardProps> = ({
    projections,
    totalSavings,
    documentsThisMonth
}) => {
    const monthsLeft = 12 - new Date().getMonth();
    const currentMonth = new Date().toLocaleString('tr-TR', { month: 'long' });

    const getGoalStatus = () => {
        if (projections.goalProgress >= 100) {
            return {
                status: "Tamamlandı! 🎉",
                color: "text-green-600",
                badge: "default" as const
            };
        } else if (projections.goalProgress >= 75) {
            return {
                status: "Çok İyi Gidiyor! 🚀",
                color: "text-blue-600",
                badge: "default" as const
            };
        } else if (projections.goalProgress >= 50) {
            return {
                status: "İyi Tempo 📈",
                color: "text-orange-600",
                badge: "secondary" as const
            };
        } else {
            return {
                status: "Hızlanmaya İhtiyaç 💪",
                color: "text-red-600",
                badge: "destructive" as const
            };
        }
    };

    const goalStatus = getGoalStatus();
    const monthlyAverage = totalSavings > 0 ? totalSavings / (new Date().getMonth() + 1) : 0;
    const remainingForGoal = Math.max(0, projections.monthlyGoal - totalSavings);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    🎯 Yıl Sonu Projeksiyonları
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Yıl Sonu Hedef */}
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">2024 Yıl Sonu Tahmini</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-700">
                        ${projections.yearEndSavings.toFixed(2)}
                    </div>
                    <p className="text-sm text-purple-600 mt-1">
                        Mevcut tempo bazında tasarruf
                    </p>
                </div>

                {/* Aylık Hedef İlerleme */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Aylık Hedef İlerlemesi</span>
                        <Badge variant={goalStatus.badge} className="text-xs">
                            {goalStatus.status}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>${totalSavings.toFixed(2)}</span>
                            <span className="text-muted-foreground">
                                ${projections.monthlyGoal.toFixed(2)} hedef
                            </span>
                        </div>
                        <Progress
                            value={projections.goalProgress}
                            className="h-3"
                        />
                        <p className="text-xs text-center text-muted-foreground">
                            %{projections.goalProgress.toFixed(1)} tamamlandı
                        </p>
                    </div>
                </div>

                {/* Detaylı İstatistikler */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <CalendarDays className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600">Aylık Ortalama</span>
                        </div>
                        <div className="font-bold text-blue-700">
                            ${monthlyAverage.toFixed(2)}
                        </div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">Bu Ay</span>
                        </div>
                        <div className="font-bold text-green-700">
                            {documentsThisMonth} doküman
                        </div>
                    </div>
                </div>

                {/* Motivasyon Mesajı */}
                <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                    <div className="text-sm">
                        {remainingForGoal > 0 ? (
                            <>
                                <p className="font-medium text-amber-800 mb-1">
                                    🎯 {currentMonth} hedefine ${remainingForGoal.toFixed(2)} kaldı!
                                </p>
                                <p className="text-xs text-amber-700">
                                    Günde ~${(remainingForGoal / (30 - new Date().getDate())).toFixed(2)} tasarruf etmen yeterli.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium text-green-800 mb-1">
                                    🎉 {currentMonth} hedefini tamamladın!
                                </p>
                                <p className="text-xs text-green-700">
                                    Harika gidiyorsun! Bu tempo ile yıl sonu hedeflerini aşacaksın.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* İpucu */}
                <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
                    💡 İpucu: Düzenli doküman analizi yaparak hedeflerine daha hızlı ulaşabilirsin!
                </div>
            </CardContent>
        </Card>
    );
};