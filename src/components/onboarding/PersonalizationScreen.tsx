import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, ArrowLeft, FileText, FolderSimple, Sparkle, Target, Rocket, Brain, User, Trophy, Gear, MagicWand } from 'phosphor-react';
import { useOnboardingStore, trackOnboardingEvent } from '@/stores/onboardingStoreZustand';
import Lottie from 'lottie-react';
import personalizationAnimationData from '@/assets/lottie/personalization-loading.json';
import { useScrollAnimation, scrollPresets } from '@/hooks/useScrollAnimation';

interface PersonalizationScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

export const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, getPersonalizationMessage, isQuizComplete, getAnswerAnalytics } = useOnboardingStore();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [showContent, setShowContent] = useState(false);

    // Professional loading phases
    const phases = [
        { text: "Cevaplarınız analiz ediliyor...", icon: Brain },
        { text: "Kişisel profiliniz oluşturuluyor...", icon: User },
        { text: "Size özel deneyim hazırlanıyor...", icon: MagicWand }
    ];

    useEffect(() => {
        // Track personalization started
        trackOnboardingEvent('personalization_started', {
            quiz_complete: isQuizComplete(),
            answers_count: Object.values(answers).filter(a => a !== '').length,
            analytics: getAnswerAnalytics()
        });

        // Simulate loading process
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setShowContent(true);

                    // Track personalization completed
                    trackOnboardingEvent('personalization_completed', {
                        personalized_message: getPersonalizationMessage(),
                        analytics: getAnswerAnalytics()
                    });

                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        // Phase progression with tracking
        const phaseInterval = setInterval(() => {
            setCurrentPhase(prev => {
                if (prev >= phases.length - 1) {
                    clearInterval(phaseInterval);
                    return phases.length - 1;
                }
                const nextPhase = prev + 1;

                // Track phase progression
                trackOnboardingEvent('personalization_phase', {
                    phase: nextPhase,
                    phase_text: phases[nextPhase].text,
                    progress: loadingProgress
                });

                return nextPhase;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(phaseInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const personalizationMessage = getPersonalizationMessage();

    return (
        <div className="flex flex-col w-full h-full min-h-screen bg-white text-[#33373B] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-8 pb-4">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl font-bold mb-2 text-[#33373B]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Harika! Size özel yol haritanız hazırlanıyor...
                    </motion.h1>
                </div>
            </div>

            {/* Content - Full Screen */}
            <div className="flex-1 flex flex-col justify-center px-6">
                <AnimatePresence mode="wait">
                    {!showContent ? (
                        // Professional Loading Phase
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center space-y-8"
                        >
                            {/* Professional Document Organization Illustration */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative w-80 h-48"
                            >
                                {/* Abstract Human Character - Artiklo Rehberi Organizing */}
                                <motion.div
                                    animate={{
                                        y: [0, -3, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-8 top-8 z-20"
                                >
                                    {/* Abstract Human Figure */}
                                    <div className="relative w-20 h-24">
                                        {/* Head - Professional subtle movement */}
                                        <motion.div
                                            animate={{
                                                y: [0, -1, 0]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#22C58B] rounded-full"
                                        />
                                        {/* Body */}
                                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-[#22C58B] rounded-lg" />
                                        {/* Arms - Subtle organizing gesture */}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 8, 0]
                                            }}
                                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-8 right-2 w-1.5 h-6 bg-[#22C58B] rounded-full transform rotate-45"
                                        />
                                        <div className="absolute top-8 left-2 w-1.5 h-6 bg-[#22C58B] rounded-full transform -rotate-12" />
                                        {/* Legs */}
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-[#22C58B] rounded-full" />
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-[#22C58B] rounded-full" />
                                    </div>

                                    {/* Professional approval gesture - more subtle */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 3, -3, 0]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -right-6 top-2 w-6 h-6 bg-[#22C58B] rounded-full flex items-center justify-center"
                                    >
                                        <Gear className="w-4 h-4 text-white" weight="fill" />
                                    </motion.div>
                                </motion.div>

                                {/* Professional Document being organized */}
                                <motion.div
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{
                                        x: [100, 50, 0],
                                        y: [0, -10, 0],
                                        opacity: 1,
                                        rotate: [5, 0, -2, 0]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        delay: 1,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute right-8 top-16 z-10"
                                >
                                    <div className="w-16 h-20 bg-white border-2 border-[#22C58B] rounded-lg shadow-lg p-2 relative">
                                        {/* Professional document content */}
                                        <div className="space-y-1">
                                            <div className="h-1 bg-[#22C58B] rounded w-full"></div>
                                            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-1 bg-[#22C58B] rounded w-full"></div>
                                            <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                                            <div className="h-1 bg-[#22C58B] rounded w-5/6"></div>
                                        </div>

                                        {/* Professional completion stamp */}
                                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center">
                                            <Target className="w-3 h-3 text-white" weight="fill" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Professional Filing System */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="absolute right-4 bottom-8"
                                >
                                    <div className="w-20 h-16 bg-gradient-to-b from-[#FFD166] to-[#FFD166]/80 rounded-lg shadow-md relative">
                                        {/* Professional folder tab */}
                                        <div className="absolute -top-2 left-2 w-8 h-4 bg-[#FFD166] rounded-t-md"></div>
                                        <div className="absolute inset-2 flex items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: 3 }}
                                            >
                                                <FolderSimple className="w-6 h-6 text-white" weight="fill" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Professional success indicators */}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 1.2, 0],
                                            opacity: [0, 1, 0],
                                            rotate: [0, 180]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: 2 + i * 0.3,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute"
                                        style={{
                                            left: `${30 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                                            top: `${40 + Math.cos(i * 60 * Math.PI / 180) * 40}%`
                                        }}
                                    >
                                        <Sparkle className="w-4 h-4 text-[#FFD166]" weight="fill" />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Professional Progress Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="w-full max-w-sm"
                            >
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#22C58B] to-[#FFD166] rounded-full"
                                        initial={{ width: '75%' }}
                                        animate={{ width: `${25 + loadingProgress * 0.75}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="flex justify-center text-sm text-[#33373B]/60 mt-2">
                                    <span className="font-medium">%{Math.round(25 + loadingProgress * 0.75)} tamamlandı</span>
                                </div>
                            </motion.div>

                            {/* Professional Phase Message */}
                            <motion.div
                                key={currentPhase}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="mb-3 flex justify-center">
                                    {React.createElement(phases[currentPhase].icon, {
                                        className: "w-8 h-8 text-[#22C58B]",
                                        weight: "regular"
                                    })}
                                </div>
                                <p className="text-lg font-medium text-[#22C58B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {phases[currentPhase].text}
                                </p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        // Professional Success Content Phase
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="text-center space-y-8"
                        >
                            {/* Professional Success Indicator */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                                className="flex justify-center"
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, 2, -2, 0],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-gradient-to-br from-[#22C58B]/20 to-[#22C58B]/10 rounded-full flex items-center justify-center border-2 border-[#22C58B]"
                                    style={{
                                        boxShadow: '0 8px 32px rgba(34, 197, 139, 0.3)'
                                    }}
                                >
                                    <Trophy className="w-12 h-12 text-[#22C58B]" weight="fill" />
                                </motion.div>
                            </motion.div>

                            {/* Professional Success Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-3xl font-bold text-[#22C58B] flex items-center justify-center gap-3"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                Mükemmel!
                                <Target className="w-8 h-8" weight="fill" />
                            </motion.h2>

                            {/* Personalized Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="bg-gradient-to-br from-[#22C58B]/10 to-[#22C58B]/5 rounded-xl p-6 border border-[#22C58B]/20"
                            >
                                <p className="text-lg leading-relaxed text-[#33373B] whitespace-pre-line" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {personalizationMessage}
                                </p>
                            </motion.div>

                            {/* Professional Ready to Go Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="bg-gradient-to-r from-[#FFD166]/20 to-[#FFD166]/10 rounded-xl p-5 border border-[#FFD166]/30"
                            >
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <Rocket className="w-6 h-6 text-[#33373B]" weight="fill" />
                                    <span className="font-semibold text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>Artık Hazırsın!</span>
                                </div>
                                <p className="text-base text-[#33373B]/80 leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    Size özel deneyiminiz hazırlandı. Şimdi potansiyelinizin tamamını kullanmaya başlayalım!
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Footer - Professional */}
            <div className="flex-shrink-0 px-4 pb-8 pt-0">
                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className="flex items-center justify-between"
                        >
                            <Button
                                onClick={onPrevious}
                                variant="outline"
                                className="border-2 border-gray-200 text-[#33373B] bg-white hover:bg-gray-50 hover:border-gray-300 px-6 py-2 rounded-full flex items-center gap-2"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            >
                                <ArrowLeft className="w-4 h-4" weight="regular" />
                                Geri
                            </Button>

                            <Button
                                onClick={() => {
                                    trackOnboardingEvent('personalization_proceed_to_paywall', {
                                        personalized_message: getPersonalizationMessage(),
                                        user_ready: true
                                    });
                                    onNext();
                                }}
                                className="bg-gradient-to-r from-[#22C58B] to-[#1FAB73] hover:from-[#1FAB73] hover:to-[#22C58B] text-white px-8 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2"
                                style={{ fontFamily: 'Nunito, sans-serif' }}
                            >
                                Planları Gör
                                <ArrowRight className="w-4 h-4" weight="regular" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PersonalizationScreen;