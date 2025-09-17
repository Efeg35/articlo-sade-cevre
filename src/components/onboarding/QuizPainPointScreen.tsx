import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, SmileyXEyes, Warning, Clock, Question } from 'phosphor-react';
import { useOnboardingStore } from '@/stores/onboardingStoreZustand';

interface QuizPainPointScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

const painPointOptions = [
    {
        id: 'confused',
        icon: SmileyXEyes,
        text: 'Hiçbir şey anlamadım!',
        value: 'confused',
        color: '#FF6B6B'
    },
    {
        id: 'worried',
        icon: Warning,
        text: 'Acaba başıma bir iş açar mı?',
        value: 'worried',
        color: '#FFD93D'
    },
    {
        id: 'lazy',
        icon: Clock,
        text: 'Okumaya üşendim, çok uzun.',
        value: 'lazy',
        color: '#6BCF7F'
    },
    {
        id: 'lost',
        icon: Question,
        text: 'Ne cevap vermem gerektiğini bilmiyorum.',
        value: 'lost',
        color: '#4D96FF'
    }
];

export const QuizPainPointScreen: React.FC<QuizPainPointScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, setAnswer } = useOnboardingStore();
    const selectedAnswer = answers.painPoint;

    const handleSelect = (value: string) => {
        setAnswer('painPoint', value);
    };

    return (
        <div className="flex flex-col w-full h-screen bg-white text-[#33373B]">
            {/* Header with Progress */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                    </div>
                    <span className="text-sm text-[#33373B]/60 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>Soru 2/5</span>
                </div>

                {/* Professional Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Abstract Human Character - Empathetic */}
                    <motion.div
                        animate={{
                            y: [0, -3, 0],
                            rotate: [0, -2, 2, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mb-4"
                    >
                        <div className="relative w-16 h-20">
                            {/* Head */}
                            <motion.div
                                animate={{
                                    y: [0, -2, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#FFD166] rounded-full"
                            />
                            {/* Body */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-[#FFD166] rounded-lg" />
                            {/* Arms - Understanding gesture */}
                            <motion.div
                                animate={{
                                    rotate: [0, 15, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 right-2 w-1.5 h-6 bg-[#FFD166] rounded-full transform rotate-30"
                            />
                            <motion.div
                                animate={{
                                    rotate: [0, -15, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-8 left-2 w-1.5 h-6 bg-[#FFD166] rounded-full transform -rotate-30"
                            />
                            {/* Legs */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-[#FFD166] rounded-full" />
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-[#FFD166] rounded-full" />
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Anlıyorum...
                    </h1>
                    <h2 className="text-lg font-medium mb-4 text-[#FFD166]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Bu hissi çok iyi biliyorum!
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
                    <h3 className="text-base font-medium mb-6 text-center leading-relaxed text-[#33373B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Peki o karmaşık metni ilk okuduğunda aklından geçen ilk düşünce neydi?
                    </h3>

                    <div className="space-y-3">
                        {painPointOptions.map((option, index) => {
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                            return (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.4 + index * 0.1,
                                        type: "spring",
                                        stiffness: 200
                                    }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${selectedAnswer === option.value
                                            ? 'bg-[#FFD166]/10 border-2 border-[#FFD166] shadow-lg shadow-[#FFD166]/20'
                                            : 'bg-white border border-gray-200 hover:border-[#FFD166]/40'
                                            }`}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                {/* A, B, C, D Letter */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === option.value
                                                    ? 'bg-[#FFD166] text-[#33373B]'
                                                    : 'bg-gray-100 text-[#33373B]'
                                                    }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                    {optionLetter}
                                                </div>

                                                {/* Professional Phosphor Icon - Enhanced animation */}
                                                <motion.div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedAnswer === option.value
                                                        ? 'bg-[#FFD166]/20 border border-[#FFD166]/40'
                                                        : 'bg-gray-100'
                                                        }`}
                                                    animate={selectedAnswer === option.value ? {
                                                        scale: [1, 1.2, 1],
                                                        rotate: [0, -10, 10, 0],
                                                        y: [0, -5, 0]
                                                    } : {}}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: selectedAnswer === option.value ? Infinity : 0
                                                    }}
                                                    style={{
                                                        color: selectedAnswer === option.value ? option.color : '#6B7280'
                                                    }}
                                                >
                                                    <option.icon className="w-6 h-6" weight="regular" />
                                                </motion.div>

                                                {/* Text */}
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${selectedAnswer === option.value ? 'text-[#33373B]' : 'text-[#33373B]/80'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {option.text}
                                                    </p>
                                                </div>

                                                {/* Selection Indicator */}
                                                {selectedAnswer === option.value && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="w-5 h-5 bg-[#22C58B] rounded-full flex items-center justify-center"
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-white" weight="fill" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Navigation Footer - Professional */}
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
                            disabled={!selectedAnswer}
                            className="bg-[#22C58B] hover:bg-[#1FAB73] text-white px-8 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            style={{
                                fontFamily: 'Nunito, sans-serif',
                                boxShadow: '0 4px 15px rgba(34, 197, 139, 0.3)'
                            }}
                        >
                            <span>Devam</span>
                            <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-4 h-4" weight="regular" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizPainPointScreen;