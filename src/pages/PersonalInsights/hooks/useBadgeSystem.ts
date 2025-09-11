import { useMemo } from 'react';
import { Document, BadgeData } from '../types';

export function useBadgeSystem() {
    const calculateBadges = useMemo(() => (
        docs: Document[],
        totalRisksDetected: number,
        documentsThisMonth: number,
        totalSavings: number
    ): BadgeData[] => {
        const badges: BadgeData[] = [
            {
                id: 'night_owl',
                name: '🦉 Gece Baykuşu',
                description: 'Gece saatlerinde aktif kullanım',
                icon: '🦉',
                earned: docs.some(doc => {
                    const hour = new Date(doc.created_at).getHours();
                    return hour >= 22 || hour <= 6;
                }),
                category: 'time',
                rarity: 'rare'
            },
            {
                id: 'weekend_warrior',
                name: '🏆 Hafta Sonu Kahramanı',
                description: 'Hafta sonları aktif kullanım',
                icon: '🏆',
                earned: docs.some(doc => [0, 6].includes(new Date(doc.created_at).getDay())),
                category: 'time',
                rarity: 'epic'
            },
            {
                id: 'speed_demon',
                name: '⚡ Hızlı Çekim',
                description: 'Aynı gün 3+ belge analizi',
                icon: '⚡',
                earned: (() => {
                    const dailyCounts: { [key: string]: number } = {};
                    docs.forEach(doc => {
                        const day = new Date(doc.created_at).toDateString();
                        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
                    });
                    return Object.values(dailyCounts).some(count => count >= 3);
                })(),
                category: 'usage',
                rarity: 'rare'
            },
            {
                id: 'money_saver',
                name: '💰 Tasarruf Kralı',
                description: '10.000₺+ toplam tasarruf',
                icon: '💰',
                earned: totalSavings >= 10000,
                category: 'financial',
                rarity: 'epic'
            },
            {
                id: 'consistent_user',
                name: '📅 Düzenli Kullanıcı',
                description: '3+ ay ardışık kullanım',
                icon: '📅',
                earned: docs.length >= 15 && documentsThisMonth > 0,
                category: 'usage',
                rarity: 'common'
            },
            {
                id: 'risk_detective',
                name: '🔍 Risk Dedektifi',
                description: '50+ risk tespit edildi',
                icon: '🔍',
                earned: totalRisksDetected >= 50,
                category: 'usage',
                rarity: 'rare'
            },
            {
                id: 'early_adopter',
                name: '🌟 Öncü Kullanıcı',
                description: 'Platform öncü kullanıcısı',
                icon: '🌟',
                earned: docs.length >= 20,
                category: 'special',
                rarity: 'legendary'
            },
            {
                id: 'power_user',
                name: '🔥 Power User',
                description: 'Aylık 15+ belge analizi',
                icon: '🔥',
                earned: documentsThisMonth >= 15,
                category: 'usage',
                rarity: 'epic'
            }
        ];

        // Add earnedDate to earned badges
        return badges.map(badge => ({
            ...badge,
            earnedDate: badge.earned ? docs[0]?.created_at : undefined
        }));
    }, []);

    const getBadgesByCategory = useMemo(() => (badges: BadgeData[]) => {
        return {
            usage: badges.filter(b => b.category === 'usage'),
            time: badges.filter(b => b.category === 'time'),
            financial: badges.filter(b => b.category === 'financial'),
            special: badges.filter(b => b.category === 'special')
        };
    }, []);

    const getBadgeStats = useMemo(() => (badges: BadgeData[]) => {
        const earned = badges.filter(b => b.earned);
        const legendary = earned.filter(b => b.rarity === 'legendary');
        const epic = earned.filter(b => b.rarity === 'epic');
        const rare = earned.filter(b => b.rarity === 'rare');
        const common = earned.filter(b => b.rarity === 'common');

        return {
            total: badges.length,
            earned: earned.length,
            rarest: legendary.length > 0 ? '⭐ Efsane' :
                epic.length > 0 ? '💜 Epik' :
                    rare.length > 0 ? '💙 Nadir' :
                        common.length > 0 ? '🤍 Yaygın' : 'Henüz yok'
        };
    }, []);

    return {
        calculateBadges,
        getBadgesByCategory,
        getBadgeStats
    };
}