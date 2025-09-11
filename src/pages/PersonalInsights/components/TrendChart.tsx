import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChartData } from '../types';

interface TrendChartProps {
    data: ChartData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    📈 6 Aylık Tasarruf Trendi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                            formatter={(value: string | number, name: string) => [
                                name === 'savings' ? `₺${value.toLocaleString()}` : value,
                                name === 'savings' ? 'Tasarruf' : name === 'documents' ? 'Belge' : 'Zaman (dk)'
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="savings"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};