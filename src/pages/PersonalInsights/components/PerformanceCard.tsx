import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Star } from "lucide-react";
import { EfficiencyMetrics } from '../types';

interface PerformanceCardProps {
    efficiency: EfficiencyMetrics;
    totalDocuments: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
    efficiency,
    totalDocuments
}) => {
    const getUserLevel = () => {
        if (totalDocuments >= 20) {
            return {
                level: "🔥 Power User - Platform ustası!",
                description: "En aktif kullanıcı seviyesi"
            };
        } else if (totalDocuments >= 10) {
            return {
                level: "⭐ Active User - Düzenli kullanıcı",
                description: "Aktif kullanım gösteriyor"
            };
        } else {
            return {
                level: "🌱 New User - Yeni başlangıç",
                description: "Platform keşif aşamasında"
            };
        }
    };

    const userLevel = getUserLevel();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    ⚡ Performansınız
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Başarı Oranı</span>
                        <span className="font-semibold">%{efficiency.successRate}</span>
                    </div>
                    <Progress value={efficiency.successRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-700">{efficiency.avgAnalysisTime}sn</div>
                        <div className="text-xs text-blue-600">Ortalama Analiz</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-700">{efficiency.userRank}</div>
                        <div className="text-xs text-purple-600">Kullanıcı Sıralaması</div>
                    </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-sm">Kullanım Seviyeniz</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                        {userLevel.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {userLevel.description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};