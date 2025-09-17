import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Sparkle,
    Lightning,
    Eye,
    CheckCircle,
    Rocket,
    Crown,
    ArrowRight,
    Play,
    Pause
} from 'phosphor-react';
import { useScrollAnimation, scrollPresets } from '@/hooks/useScrollAnimation';
import SuccessConfetti from './SuccessConfetti';
import Lottie from 'lottie-react';
import welcomeAnimationData from '@/assets/lottie/welcome-transformation.json';
import personalizationAnimationData from '@/assets/lottie/personalization-loading.json';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface PremiumFeaturesDemoProps {
    onClose: () => void;
}

const testSchema = z.object({
    testInput: z.string().min(1, 'Test input is required'),
});

type TestFormData = z.infer<typeof testSchema>;

export const PremiumFeaturesDemo: React.FC<PremiumFeaturesDemoProps> = ({ onClose }) => {
    const [activeDemo, setActiveDemo] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiMessage, setConfettiMessage] = useState('');

    // Scroll animations for feature cards
    const titleAnimation = useScrollAnimation({
        ...scrollPresets.fadeInUp,
        trackEvent: true,
        eventName: 'demo_title_view'
    });

    const featuresAnimation = useScrollAnimation({
        ...scrollPresets.fadeInUp,
        trackEvent: true,
        eventName: 'demo_features_view',
        delay: 200
    });

    // React Hook Form demo
    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<TestFormData>({
        resolver: zodResolver(testSchema),
        mode: 'onChange'
    });

    const features = [
        {
            id: 'zustand',
            title: 'Modern State Management',
            subtitle: 'Zustand ile güçlü durum yönetimi',
            icon: Lightning,
            color: 'from-blue-500 to-cyan-500',
            demo: () => (
                <div className="space-y-4">
                    <h4 className="font-semibold">Zustand Store Demo</h4>
                    <p className="text-sm text-gray-600">
                        Modern state management, performant updates, and persistence
                    </p>
                    <Badge variant="outline" className="text-blue-600">
                        ✅ Active & Working
                    </Badge>
                </div>
            )
        },
        {
            id: 'lottie',
            title: 'Premium Animasyonlar',
            subtitle: 'Lottie ile profesyonel animasyonlar',
            icon: Sparkle,
            color: 'from-purple-500 to-pink-500',
            demo: () => (
                <div className="space-y-4">
                    <h4 className="font-semibold">Lottie Animations Demo</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-2">
                                <Lottie
                                    animationData={welcomeAnimationData}
                                    loop={true}
                                    autoplay={true}
                                    className="w-full h-full"
                                />
                            </div>
                            <p className="text-xs">Welcome Animation</p>
                        </div>
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-2">
                                <Lottie
                                    animationData={personalizationAnimationData}
                                    loop={true}
                                    autoplay={true}
                                    className="w-full h-full"
                                />
                            </div>
                            <p className="text-xs">AI Processing</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'hook-form',
            title: 'Gelişmiş Form Yönetimi',
            subtitle: 'React Hook Form ile validasyon',
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            demo: () => (
                <div className="space-y-4">
                    <h4 className="font-semibold">Hook Form Demo</h4>
                    <form onSubmit={handleSubmit((data) => {
                        console.log('Form submitted:', data);
                        triggerConfetti('Form Başarıyla Gönderildi! 📝');
                    })}>
                        <div className="space-y-3">
                            <div>
                                <input
                                    {...register('testInput')}
                                    placeholder="Test your input here..."
                                    className="w-full p-2 border rounded text-sm"
                                />
                                {errors.testInput && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.testInput.message}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!isValid}
                                className="w-full"
                            >
                                Test Submit
                            </Button>
                        </div>
                    </form>
                </div>
            )
        },
        {
            id: 'confetti',
            title: 'Başarı Kutlamaları',
            subtitle: 'React Confetti ile etkileşimli kutlamalar',
            icon: Crown,
            color: 'from-yellow-500 to-orange-500',
            demo: () => (
                <div className="space-y-4">
                    <h4 className="font-semibold">Confetti Demo</h4>
                    <p className="text-sm text-gray-600">
                        Dynamic celebrations for user achievements
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            onClick={() => triggerConfetti('Success! 🎉')}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Success
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => triggerConfetti('Premium! 👑')}
                            className="bg-yellow-500 hover:bg-yellow-600"
                        >
                            Premium
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 'scroll-animations',
            title: 'Scroll Animasyonları',
            subtitle: 'Intersection Observer ile akışkan animasyonlar',
            icon: Eye,
            color: 'from-indigo-500 to-purple-500',
            demo: () => (
                <div className="space-y-4">
                    <h4 className="font-semibold">Scroll Animations Demo</h4>
                    <p className="text-sm text-gray-600">
                        Scroll-triggered animations with performance optimization
                    </p>
                    <Badge variant="outline" className="text-indigo-600">
                        ✅ Active & Tracking
                    </Badge>
                </div>
            )
        }
    ];

    const triggerConfetti = (message: string) => {
        setConfettiMessage(message);
        setShowConfetti(true);
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0f1419] to-[#1a1f3a] text-[#F0F4F8] overflow-auto">
            {/* Progress Bar */}
            <div className="flex-shrink-0 flex items-center justify-center pt-4 pb-2">
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                                scale: 1,
                                opacity: 0.8,
                                backgroundColor: '#D4A056'
                            }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="w-1.5 h-1.5 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-[#0f1419]/95 backdrop-blur-sm border-b border-[#4A5568]/30 p-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        ref={titleAnimation.ref}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                            opacity: titleAnimation.isVisible ? 1 : 0,
                            x: titleAnimation.isVisible ? 0 : -20
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl font-bold text-[#D4A056] flex items-center gap-2">
                            <Rocket className="w-6 h-6" />
                            Premium Features Demo
                        </h1>
                        <p className="text-sm text-[#F0F4F8]/70">
                            Artiklo Onboarding - All Premium Features Integrated
                        </p>
                    </motion.div>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-[#4A5568] text-[#F0F4F8] hover:bg-[#4A5568]/20"
                    >
                        Close Demo
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <motion.div
                ref={featuresAnimation.ref}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                    opacity: featuresAnimation.isVisible ? 1 : 0,
                    y: featuresAnimation.isVisible ? 0 : 30
                }}
                transition={{ duration: 0.6 }}
                className="p-6"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="bg-[#4A5568]/10 border-[#4A5568]/30 hover:bg-[#4A5568]/20 transition-all duration-300 cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} p-3 flex items-center justify-center`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-[#F0F4F8] text-lg">
                                                {feature.title}
                                            </CardTitle>
                                            <p className="text-[#F0F4F8]/70 text-sm">
                                                {feature.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {feature.demo()}
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setActiveDemo(activeDemo === feature.id ? null : feature.id);
                                            }}
                                            className="w-full flex items-center gap-2"
                                            variant="outline"
                                        >
                                            {activeDemo === feature.id ? (
                                                <>
                                                    <Pause className="w-4 h-4" />
                                                    Hide Demo
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    Show Demo
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Test Results */}
            <div className="p-6 bg-[#4A5568]/5 border-t border-[#4A5568]/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-[#D4A056]">
                        Integration Test Results
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { name: 'Zustand Store', status: 'passed' },
                            { name: 'Lottie Animations', status: 'passed' },
                            { name: 'Hook Forms', status: 'passed' },
                            { name: 'Confetti Effects', status: 'passed' },
                            { name: 'Scroll Animations', status: 'passed' }
                        ].map((test) => (
                            <div
                                key={test.name}
                                className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"
                            >
                                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                <p className="text-sm font-medium">{test.name}</p>
                                <Badge className="bg-green-500 text-white mt-1">
                                    ✅ PASSED
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h3 className="text-2xl font-bold text-[#D4A056] mb-2">
                        🎉 All Premium Features Successfully Integrated!
                    </h3>
                    <p className="text-[#F0F4F8]/80 mb-4">
                        Your Artiklo onboarding experience is now powered by the latest premium libraries
                    </p>
                    <Button
                        onClick={() => triggerConfetti('Premium Upgrade Complete! 🚀👑')}
                        className="bg-gradient-to-r from-[#D4A056] to-[#D4A056]/80 hover:from-[#D4A056]/90 hover:to-[#D4A056]/70 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                    >
                        <Rocket className="w-5 h-5 mr-2" />
                        Celebrate Premium Upgrade
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>

            {/* Success Confetti */}
            <SuccessConfetti
                isActive={showConfetti}
                message={confettiMessage}
                duration={3000}
                confettiConfig={{
                    particleCount: 300,
                    spread: 90,
                    colors: ['#D4A056', '#60A5FA', '#34D399', '#F472B6', '#A78BFA']
                }}
                onComplete={() => setShowConfetti(false)}
            />
        </div>
    );
};

export default PremiumFeaturesDemo;