import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { WeeklyActivityData, WeeklyPatternData } from '../types';

interface ActivityChartProps {
    weeklyActivity: WeeklyActivityData[];
    weeklyPattern: WeeklyPatternData[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
    weeklyActivity,
    weeklyPattern
}) => {
    const maxActivity = Math.max(...weeklyActivity.map(w => w.documents));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    📊 Son 4 Hafta Aktiviteniz
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {weeklyActivity.map((week, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{week.week}</span>
                                <span className="font-semibold">{week.documents} belge</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        backgroundColor: week.color,
                                        width: `${Math.max(10, (week.documents / maxActivity) * 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}

                    {/* En aktif günler */}
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="font-medium text-sm mb-3">📅 En Aktif Günleriniz</h4>
                        <div className="space-y-2">
                            {weeklyPattern.slice(0, 3).map((day, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">{day.day}</span>
                                    <Badge variant="outline">{day.count} belge</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};