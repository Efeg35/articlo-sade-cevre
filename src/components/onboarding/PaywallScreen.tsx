import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Clock,
    Shield,
    Users,
    Crown,
    Lightning,
    Star,
    ArrowRight,
    User,
    CreditCard,
    Gift,
    Timer,
    CheckCircle,
    Sparkle,
    Target,
    Hand,
    LockKey
} from 'phosphor-react';
import { useOnboardingStore } from '@/stores/onboardingStoreZustand';
import SuccessConfetti from './SuccessConfetti';

interface PaywallScreenProps {
    onSelectPlan: (plan: 'free' | 'basic' | 'pro' | 'enterprise') => void;
    onSkip: () => void;
}

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    id: 'free' | 'basic' | 'pro' | 'enterprise';
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    badge?: string;
    badgeColor?: string;
    highlighted?: boolean;
    icon: React.ComponentType<{ className?: string; weight?: string }>;
    features: PlanFeature[];
    buttonText: string;
    buttonVariant: 'default' | 'outline' | 'secondary';
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'ÜCRETSİZ',
        description: 'Temel özellikleri keşfetmek için harika bir seçenek.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: User,
        features: [
            { text: 'Ayda 1 analiz', included: true },
            { text: 'Belge özeti ve sadeleştirme', included: true },
            { text: 'Standart AI modeli', included: true },
            { text: 'Risk önizlemesi (kısıtlı)', included: true },
            { text: 'Filigranli PDF çıktısı', included: true },
            { text: 'Son 3 dosya geçmişi', included: true },
            { text: 'E-posta desteği', included: true }
        ],
        buttonText: 'Hemen Başla',
        buttonVariant: 'outline'
    },
    {
        id: 'basic',
        name: 'BAŞLANGIÇ',
        description: 'Düzenli ama hafif kullanım için ideal.',
        monthlyPrice: 199,
        yearlyPrice: 159,
        icon: Lightning,
        features: [
            { text: 'Ayda 10 analiz', included: true },
            { text: 'Tam risk listesi + detaylı eylem planı', included: true },
            { text: 'Gelişmiş AI modeli', included: true },
            { text: 'Filigranlsız PDF/Word çıktısı', included: true },
            { text: '3 aylık analiz geçmişi', included: true },
            { text: 'E-posta desteği', included: true },
            { text: 'Belge oluşturma (üst paketlerde)', included: false }
        ],
        buttonText: 'BASIC\'e Geç',
        buttonVariant: 'secondary'
    },
    {
        id: 'pro',
        name: 'PRO',
        description: 'Profesyoneller ve sık kullanım için ideal.',
        monthlyPrice: 299,
        yearlyPrice: 239,
        badge: 'En Popüler',
        badgeColor: 'bg-[#D4A056] text-white',
        highlighted: true,
        icon: Crown,
        features: [
            { text: 'Ayda 50 analiz + 5 belge oluşturma', included: true },
            { text: 'Sınırsız belge sadeleştirme', included: true },
            { text: 'Gelişmiş PRO AI modeli', included: true },
            { text: 'Kişiye özel belge oluşturma (5/ay)', included: true },
            { text: 'Sınırsız analiz geçmişi', included: true },
            { text: 'Klasörleme + terim sözlüğü', included: true },
            { text: 'Bildirim/hatırlatmalar', included: true },
            { text: 'Öncelikli destek', included: true }
        ],
        buttonText: 'PRO\'ya Geç',
        buttonVariant: 'default'
    },
    {
        id: 'enterprise',
        name: 'KURUMSAL',
        description: 'Küçük çaplı ekip ve şirketler (Avukatlar, Kobilier) için özel çözümler.',
        monthlyPrice: 899,
        yearlyPrice: 719,
        icon: Users,
        features: [
            { text: '5 kullanıcı + 25 belge oluşturma/ay', included: true },
            { text: 'PRO\'daki her şey', included: true },
            { text: 'Ekip yönetimi + rol/izin sistemi', included: true },
            { text: 'Paylaşımlı workspace', included: true },
            { text: 'Sektör önerileri + risk skoru', included: true },
            { text: 'Toplu analiz (10 eşzamanlı)', included: true },
            { text: 'Avukat modülleri: mütevekil portalı', included: true },
            { text: 'Öncelikli destek', included: true }
        ],
        buttonText: 'Ekiple Başla',
        buttonVariant: 'secondary'
    }
];

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ onSelectPlan, onSkip }) => {
    const [isYearly, setIsYearly] = useState(true);
    const { selectedPlan, setSelectedPlan } = useOnboardingStore();
    const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);
    const [selectedPlanForConfetti, setSelectedPlanForConfetti] = useState<string>('');

    const handlePlanSelect = (planId: 'free' | 'basic' | 'pro' | 'enterprise') => {
        setSelectedPlan(planId);
        setSelectedPlanForConfetti(planId);
        setShowSuccessConfetti(true);

        // Delay the actual plan selection to show confetti
        setTimeout(() => {
            setShowSuccessConfetti(false);
            onSelectPlan(planId);
        }, 2500);
    };

    const getConfettiMessage = () => {
        const planNames = {
            free: 'Ücretsiz Plan Seçildi',
            basic: 'Başlangıç Planı Seçildi',
            pro: 'Pro Planı Seçildi',
            enterprise: 'Kurumsal Plan Seçildi'
        };
        return planNames[selectedPlanForConfetti as keyof typeof planNames] || 'Plan Seçildi';
    };

    const getConfettiColors = () => {
        const colors = {
            free: ['#34D399', '#10B981', '#059669', '#047857'],
            basic: ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'],
            pro: ['#D4A056', '#B8834A', '#9C6B3E', '#F59E0B'],
            enterprise: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6']
        };
        return colors[selectedPlanForConfetti as keyof typeof colors] || ['#D4A056', '#B8834A', '#9C6B3E'];
    };

    const getPrice = (plan: Plan) => {
        if (plan.monthlyPrice === 0) return 'Ücretsiz';
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        return `₺${price}`;
    };

    return (
        <div className="flex flex-col w-full h-full min-h-screen bg-white text-[#33373B]">
            {/* Header with Professional Guide */}
            <div className="flex-shrink-0 px-6 pt-8 pb-4">
                {/* Artiklo Guide Character - Professional Design */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center mb-6 relative"
                >
                    {/* Professional Abstract Human Character */}
                    <div className="relative flex items-center gap-4">
                        {/* Character Body */}
                        <motion.div
                            animate={{
                                y: [0, -2, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            {/* Head */}
                            <div className="w-12 h-12 bg-[#22C58B] rounded-full mb-2 mx-auto relative">
                                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                    <User weight="fill" className="w-5 h-5 text-[#22C58B]" />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="w-16 h-20 bg-gradient-to-b from-[#22C58B] to-[#1FAB73] rounded-2xl relative">
                                {/* Arms pointing to plans */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 8, 0]
                                    }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-2 top-6"
                                >
                                    <div className="w-8 h-3 bg-[#22C58B] rounded-full rotate-45 origin-left"></div>
                                    <Target weight="bold" className="w-4 h-4 text-[#22C58B] absolute -right-1 -top-2" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Professional Recommendation Card */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-white border border-[#22C58B]/20 rounded-xl px-4 py-3 shadow-lg max-w-[200px]"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Star weight="fill" className="w-4 h-4 text-[#FFD166]" />
                                <span className="text-xs font-bold text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Artiklo Rehberi
                                </span>
                            </div>
                            <div className="text-xs text-[#33373B]/80" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Profesyoneller için <span className="font-bold text-[#22C58B]">PRO planını</span> öneriyorum
                            </div>
                            {/* Arrow */}
                            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-l border-b border-[#22C58B]/20"></div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-4"
                >
                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Potansiyelinizi Tam Olarak Kullanın!
                    </h1>
                    <p className="text-sm text-[#33373B]/70" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Size en uygun planı seçin ve hukuki belgelerinizdeki gücü keşfedin.
                    </p>
                </motion.div>

                {/* Professional Offer Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-r from-[#FFD166]/20 to-[#FFD166]/10 rounded-xl px-4 py-3 border border-[#FFD166]/30 mb-4"
                >
                    <div className="flex items-center justify-center gap-3">
                        <Gift weight="fill" className="w-5 h-5 text-[#FFD166]" />
                        <span className="text-sm font-semibold text-[#33373B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                            Yıllık ödemede %20 indirim!
                        </span>
                    </div>
                </motion.div>

                {/* Pricing Toggle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center justify-center mb-4"
                >
                    <div className="bg-gray-100 rounded-full p-1 flex">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isYearly
                                ? 'bg-[#22C58B] text-white shadow-lg'
                                : 'text-[#33373B]/70 hover:text-[#33373B]'
                                }`}
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${isYearly
                                ? 'bg-[#22C58B] text-white shadow-lg'
                                : 'text-[#33373B]/70 hover:text-[#33373B]'
                                }`}
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                            Yıllık
                            {isYearly && (
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-2 -right-2 bg-[#FFD166] text-[#33373B] text-xs px-2 py-0.5 rounded-full font-bold"
                                >
                                    -20%
                                </motion.div>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Plans Grid - Full Screen */}
            <div className="flex-1 px-2 pb-1 max-h-[calc(100vh-250px)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.4 + index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            className="flex"
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] flex-1 flex flex-col ${plan.highlighted
                                    ? 'bg-gradient-to-br from-[#22C58B]/10 to-[#22C58B]/5 border-2 border-[#22C58B] shadow-xl shadow-[#22C58B]/20 scale-[1.02]'
                                    : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                                    }`}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                <CardContent className="p-2 flex flex-col h-full">
                                    {/* Badge */}
                                    {plan.badge && (
                                        <motion.div
                                            animate={{ scale: [1, 1.02, 1] }}
                                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Badge className="bg-[#22C58B] text-white text-xs px-3 py-1 mb-2 self-start font-bold">
                                                {plan.badge}
                                            </Badge>
                                        </motion.div>
                                    )}

                                    {/* Header */}
                                    <div className="text-center mb-2">
                                        <div className="flex items-center justify-center mb-2">
                                            <motion.div
                                                animate={plan.highlighted ? {
                                                    rotate: [0, 2, -2, 0],
                                                    scale: [1, 1.03, 1]
                                                } : {}}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <plan.icon
                                                    className={`w-6 h-6 ${plan.highlighted ? 'text-[#22C58B]' : 'text-[#33373B]/60'}`}
                                                    weight="regular"
                                                />
                                            </motion.div>
                                        </div>
                                        <h3 className={`font-bold text-sm mb-1 ${plan.highlighted ? 'text-[#22C58B]' : 'text-[#33373B]'
                                            }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs text-[#33373B]/60 leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-2">
                                        <div className={`text-lg font-bold ${plan.highlighted ? 'text-[#22C58B]' : 'text-[#33373B]'
                                            }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {getPrice(plan)}
                                            {plan.monthlyPrice > 0 && (
                                                <span className="text-xs text-[#33373B]/60">/ay</span>
                                            )}
                                        </div>
                                        {plan.monthlyPrice > 0 && isYearly && (
                                            <div className="text-xs text-[#22C58B] font-medium">
                                                Yıllık: ₺{plan.yearlyPrice * 12} (₺{plan.monthlyPrice * 12 - plan.yearlyPrice * 12} tasarruf)
                                            </div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 mb-2">
                                        <div className="space-y-1">
                                            {plan.features.slice(0, 3).map((feature, fIndex) => (
                                                <div key={fIndex} className="flex items-start gap-2 text-xs">
                                                    {feature.included ? (
                                                        <Check className="w-3 h-3 text-[#22C58B] mt-0.5 flex-shrink-0" weight="bold" />
                                                    ) : (
                                                        <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" weight="bold" />
                                                    )}
                                                    <span className={`leading-tight ${feature.included ? 'text-[#33373B]/80' : 'text-[#33373B]/50'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {feature.text}
                                                    </span>
                                                </div>
                                            ))}
                                            {plan.features.length > 3 && (
                                                <div className="text-xs text-[#22C58B] font-medium">
                                                    +{plan.features.length - 3} özellik daha
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            size="sm"
                                            className={`w-full text-xs font-bold rounded-full ${plan.highlighted
                                                ? 'bg-[#22C58B] hover:bg-[#1FAB73] text-white shadow-lg'
                                                : plan.buttonVariant === 'outline'
                                                    ? 'border-2 border-[#22C58B] text-[#22C58B] bg-white hover:bg-[#22C58B] hover:text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-[#33373B]'
                                                }`}
                                            style={{
                                                fontFamily: 'Nunito, sans-serif',
                                                boxShadow: plan.highlighted ? '0 4px 15px rgba(34, 197, 139, 0.3)' : undefined
                                            }}
                                        >
                                            {plan.id === 'pro' ? 'PRO Planını Seç' : plan.buttonText}
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Trust Signals & Footer - Full Width */}
            <div className="flex-shrink-0 px-6 py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="space-y-4"
                >
                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 justify-center p-3 bg-[#22C58B]/10 rounded-lg">
                            <Gift weight="fill" className="w-4 h-4 text-[#22C58B]" />
                            <span className="text-[#33373B] font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>7 gün ücretsiz deneme</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center p-3 bg-[#FFD166]/20 rounded-lg">
                            <LockKey weight="fill" className="w-4 h-4 text-[#FFD166]" />
                            <span className="text-[#33373B] font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>Güvenli ödeme</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-[#33373B]/70 mb-3">
                            <Hand weight="regular" className="w-4 h-4 text-[#22C58B]" />
                            <span className="font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>İstediğin zaman kolayca iptal edebilirsin</span>
                        </div>
                    </div>

                    {/* Skip Option */}
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSkip}
                            className="text-sm text-[#33373B]/60 hover:text-[#33373B] underline font-medium"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                            Şimdilik ücretsiz devam et
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Success Confetti */}
            <SuccessConfetti
                isActive={showSuccessConfetti}
                message={getConfettiMessage()}
                duration={2000}
                confettiConfig={{
                    particleCount: 200,
                    spread: 80,
                    colors: getConfettiColors()
                }}
                onComplete={() => setShowSuccessConfetti(false)}
            />
        </div>
    );
};

export default PaywallScreen;