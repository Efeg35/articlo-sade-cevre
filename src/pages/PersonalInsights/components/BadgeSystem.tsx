import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { BadgeData } from '../types';

interface BadgeSystemProps {
    badges: BadgeData[];
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges }) => {
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return '⭐ Efsane';
            case 'epic': return '💜 Epik';
            case 'rare': return '💙 Nadir';
            default: return '🤍 Yaygın';
        }
    };

    const earnedBadges = badges.filter(b => b.earned);
    const highestRarity = earnedBadges.reduce((highest, badge) => {
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
        const current = rarityOrder[badge.rarity as keyof typeof rarityOrder] || 0;
        const existing = rarityOrder[highest as keyof typeof rarityOrder] || 0;
        return current > existing ? badge.rarity : highest;
    }, 'common');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    🏅 Özel Rozetleriniz
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                    {badges.map((badge) => (
                        <Card
                            key={badge.id}
                            className={`transition-all ${badge.earned
                                ? 'border-primary/20 shadow-sm'
                                : 'opacity-60 bg-muted/30'
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">{badge.icon}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                                            {badge.earned && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {getRarityColor(badge.rarity)}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {badge.description}
                                        </p>
                                        {badge.earned && badge.earnedDate && (
                                            <p className="text-xs text-green-600">
                                                Kazanıldı: {new Date(badge.earnedDate).toLocaleDateString('tr-TR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                    <div className="text-sm font-medium mb-2">
                        🎖️ Rozet İstatistikleri
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-muted-foreground">Kazanılan: </span>
                            <span className="font-semibold">{earnedBadges.length}/{badges.length}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">En Nadir: </span>
                            <span className="font-semibold">
                                {getRarityColor(highestRarity)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};