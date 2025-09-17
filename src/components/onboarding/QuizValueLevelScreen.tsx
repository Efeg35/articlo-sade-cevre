import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, FileText, Shield, Lightning, Crown, Target } from 'phosphor-react';
import { useOnboardingStore } from '@/stores/onboardingStoreZustand';

interface QuizValueLevelScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

const valueLevelOptions = [
    {
        id: 'basic_translation',
        icon: FileText,
        text: 'Sadece belgeleri benim için \'Türkçe\'ye çevirsin yeter.',
        value: 'basic_translation',
        level: 'Temel',
        intensity: 1,
        color: 'from-blue-500/20 to-cyan-500/10',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-400/40'
    },
    {
        id: 'risk_management',
        icon: Shield,
        text: 'Beni olası risklere karşı uyarsın ve ne yapacağımı söylesin.',
        value: 'risk_management',
        level: 'Gelişmiş',
        intensity: 2,
        color: 'from-orange-500/20 to-amber-500/10',
        iconColor: 'text-orange-400',
        borderColor: 'border-orange-400/50'
    },
    {
        id: 'full_management',
        icon: Lightning,
        text: 'Tüm süreci yönetsin, hatta gerekirse karşı belgeyi bile hazırlasın.',
        value: 'full_management',
        level: 'Premium',
        intensity: 3,
        color: 'from-purple-500/20 to-pink-500/10',
        iconColor: 'text-purple-400',
        borderColor: 'border-purple-400/60',
        premium: true
    }
];

export const QuizValueLevelScreen: React.FC<QuizValueLevelScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, setAnswer } = useOnboardingStore();
    const selectedAnswer = answers.valueLevel;

    // DEBUG LOG - Soru 5 için
    console.log('🐛 [QuizValueLevelScreen] State:', {
        'answers': answers,
        'answers.valueLevel': answers.valueLevel,
        'selectedAnswer': selectedAnswer,
        'buttonDisabled': !selectedAnswer
    });

    const [isButtonReady, setIsButtonReady] = useState(false);

    // Force button state update after selection
    useEffect(() => {
        setIsButtonReady(!!selectedAnswer);
    }, [selectedAnswer]);

    const handleSelect = (value: string) => {
        console.log('🐛 [QuizValueLevelScreen] Selecting:', value);
        setAnswer('valueLevel', value);
        // Force immediate button update
        setTimeout(() => setIsButtonReady(true), 100);
    };

    return (
        <div className="flex flex-col w-full h-screen bg-white text-[#33373B]">
            {/* Header with Progress */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                {/* Progress Bar - All filled! */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                    </div>
                    <span className="text-sm text-[#22C58B] font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>Son soru! 5/5</span>
                </div>

                {/* Professional Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Abstract Human Character at Finish Line */}
                    <motion.div
                        animate={{
                            y: [0, -5, 0],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mb-4 relative"
                    >
                        <div className="relative">
                            {/* Abstract Human Figure */}
                            <div className="relative w-16 h-20">
                                {/* Head */}
                                <motion.div
                                    animate={{
                                        y: [0, -2, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full"
                                />
                                {/* Body */}
                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-lg" />
                                {/* Arms - Victory gesture */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 15, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-8 right-2 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full transform -rotate-30"
                                />
                                <motion.div
                                    animate={{
                                        rotate: [0, -15, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute top-8 left-2 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full transform rotate-30"
                                />
                                {/* Legs */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full" />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full" />
                            </div>

                            {/* Professional Finish Line Indicator */}
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -right-8 top-0 w-8 h-8 bg-[#FFD166] rounded-full flex items-center justify-center shadow-lg"
                            >
                                <Target className="w-4 h-4 text-white" weight="bold" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Son Olarak...
                    </h1>
                    <h2 className="text-lg font-medium mb-4 text-[#22C58B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Artiklo'nun nasıl bir yol arkadaşı olmasını istersin?
                    </h2>
                </motion.div>
            </div>

            {/* Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >

                    <div className="space-y-2">
                        {valueLevelOptions.map((option, index) => {
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C
                            return (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.4 + index * 0.2,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${selectedAnswer === option.value
                                            ? 'bg-[#22C58B]/10 border-2 border-[#22C58B] shadow-lg shadow-[#22C58B]/20 scale-[1.01]'
                                            : 'bg-white border border-gray-200 hover:border-[#22C58B]/30'
                                            } ${option.premium ? 'ring-2 ring-[#FFD166]/30' : ''
                                            }`}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                {/* A, B, C Letter */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === option.value
                                                    ? 'bg-[#22C58B] text-white'
                                                    : 'bg-gray-100 text-[#33373B]'
                                                    }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                    {optionLetter}
                                                </div>

                                                {/* Professional Icon with Level Indicator */}
                                                <div className="relative flex flex-col items-center">
                                                    <motion.div
                                                        className={`w-14 h-14 rounded-full flex items-center justify-center relative ${selectedAnswer === option.value
                                                            ? 'bg-[#22C58B]/20 border-2 border-[#22C58B]'
                                                            : 'bg-gray-100 border border-gray-200'
                                                            } ${option.premium ? 'shadow-lg' : ''}`}
                                                        animate={selectedAnswer === option.value ? {
                                                            scale: [1, 1.05, 1],
                                                            boxShadow: [
                                                                "0 0 0 rgba(34, 197, 139, 0)",
                                                                "0 0 20px rgba(34, 197, 139, 0.4)",
                                                                "0 0 0 rgba(34, 197, 139, 0)"
                                                            ]
                                                        } : {}}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <option.icon className={`w-7 h-7 ${selectedAnswer === option.value ? 'text-[#22C58B]' : 'text-[#33373B]/60'
                                                            }`} weight="regular" />

                                                        {/* Premium crown - Professional */}
                                                        {option.premium && (
                                                            <motion.div
                                                                animate={{
                                                                    rotate: [0, -5, 5, 0],
                                                                    scale: [1, 1.1, 1]
                                                                }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="absolute -top-1 -right-1"
                                                            >
                                                                <Crown className="w-4 h-4 text-[#FFD166]" weight="fill" />
                                                            </motion.div>
                                                        )}

                                                        {/* Professional premium effects */}
                                                        {option.premium && selectedAnswer === option.value && (
                                                            <>
                                                                {Array.from({ length: 3 }).map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        animate={{
                                                                            scale: [0, 1, 0],
                                                                            opacity: [0, 1, 0],
                                                                            rotate: [0, 180]
                                                                        }}
                                                                        transition={{
                                                                            duration: 1.5,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.5
                                                                        }}
                                                                        className="absolute"
                                                                        style={{
                                                                            right: `${-8 - i * 4}px`,
                                                                            top: `${-4 + i * 6}px`
                                                                        }}
                                                                    >
                                                                        <Target className="w-3 h-3 text-[#FFD166]" weight="fill" />
                                                                    </motion.div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </motion.div>

                                                    {/* Level Badge */}
                                                    <span className={`text-xs font-bold mt-2 px-3 py-1 rounded-full ${selectedAnswer === option.value
                                                        ? option.premium ? 'bg-[#FFD166] text-[#33373B]' : 'bg-[#22C58B] text-white'
                                                        : 'bg-gray-200 text-[#33373B]/70'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {option.level}
                                                    </span>
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex-1 pt-1">
                                                    <p className={`text-sm font-medium leading-relaxed ${selectedAnswer === option.value ? 'text-[#33373B]' : 'text-[#33373B]/80'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {option.text}
                                                    </p>

                                                    {/* Intensity Bars */}
                                                    <div className="flex items-center gap-1 mt-3">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-2 w-8 rounded-full ${i < option.intensity
                                                                    ? (selectedAnswer === option.value ? 'bg-[#22C58B]' : 'bg-gray-300')
                                                                    : 'bg-gray-200'
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="text-xs ml-2 text-[#33373B]/60" style={{ fontFamily: 'Nunito, sans-serif' }}>Yoğunluk</span>
                                                    </div>
                                                </div>

                                                {/* Selection Indicator */}
                                                <div className="flex items-center">
                                                    {selectedAnswer === option.value && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ duration: 0.4, type: "spring" }}
                                                            className="w-6 h-6 bg-[#22C58B] rounded-full flex items-center justify-center shadow-lg"
                                                        >
                                                            <CheckCircle className="w-3 h-3 text-white" weight="fill" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                </motion.div>
            </div>

            {/* Navigation Footer - Final Quiz Button */}
            <div className="flex-shrink-0 px-6 pb-8 pt-4">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={onPrevious}
                        variant="outline"
                        className="border-2 border-gray-200 text-[#33373B] bg-white hover:bg-gray-50 hover:border-gray-300 px-6 py-2 rounded-full flex items-center gap-2"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                        <ArrowLeft className="w-4 h-4" weight="regular" />
                        Geri
                    </Button>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            onClick={onNext}
                            disabled={!selectedAnswer && !isButtonReady}
                            className="bg-gradient-to-r from-[#22C58B] to-[#1FAB73] hover:from-[#1FAB73] hover:to-[#22C58B] text-white px-10 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center gap-2"
                            style={{
                                fontFamily: 'Nunito, sans-serif',
                                boxShadow: '0 6px 25px rgba(34, 197, 139, 0.4)'
                            }}
                        >
                            <span>Planımı Göster</span>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Target className="w-5 h-5" weight="fill" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizValueLevelScreen;