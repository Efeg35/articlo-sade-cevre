import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, MagnifyingGlass, Warning, ClipboardText, BookOpen, PenNib, FileText, Sparkle, Crosshair } from 'phosphor-react';
import { useOnboardingStore } from '@/stores/onboardingStoreZustand';

interface QuizDesiredOutcomeScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

const desiredOutcomeOptions = [
    {
        id: 'risk_detection',
        icons: [Crosshair, Warning],
        text: 'Gözden kaçırdığım riskli bir madde var mı?',
        value: 'risk_detection',
        color: 'from-red-500/20 to-orange-500/20',
        iconColor: 'text-red-400'
    },
    {
        id: 'action_plan',
        icons: [ClipboardText],
        text: 'Bir sonraki adımda ne yapmam gerektiğini söylemesini.',
        value: 'action_plan',
        color: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-400'
    },
    {
        id: 'terminology',
        icons: [BookOpen],
        text: 'Bu teknik terimler aslında ne anlama geliyor?',
        value: 'terminology',
        color: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-400'
    },
    {
        id: 'document_creation',
        icons: [PenNib, FileText],
        text: 'Buna karşılık nasıl bir dilekçe/cevap yazmam gerektiğini göstermesini.',
        value: 'document_creation',
        color: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-400'
    }
];

export const QuizDesiredOutcomeScreen: React.FC<QuizDesiredOutcomeScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, setAnswer } = useOnboardingStore();
    const selectedAnswer = answers.desiredOutcome;

    const handleSelect = (value: string) => {
        setAnswer('desiredOutcome', value);
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
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                    </div>
                    <span className="text-sm text-[#33373B]/60 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>Soru 3/5</span>
                </div>

                {/* Professional Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Abstract Human Character with Professional Tool */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, 3, -3, 0]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="flex justify-center mb-4"
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
                                {/* Arms - One with professional tool */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 15, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-8 right-2 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full transform rotate-45"
                                />
                                <div className="absolute top-8 left-2 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full transform -rotate-12" />
                                {/* Legs */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full" />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-gradient-to-br from-[#22C58B] to-[#1FAB73] rounded-full" />
                            </div>

                            {/* Professional Tool */}
                            <motion.div
                                animate={{
                                    rotate: [0, -20, 20, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -right-8 top-2 w-8 h-8 bg-[#FFD166] rounded-full flex items-center justify-center shadow-lg"
                            >
                                <MagnifyingGlass className="w-4 h-4 text-white" weight="bold" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Sihirli Değneğim Olsaydı...
                    </h1>
                    <h2 className="text-lg font-medium mb-4 text-[#22C58B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Hangi süper gücü kullanmamı isterdin?
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
                        O belgeyle ilgili en çok neyi bilmek isterdin?
                    </h3>

                    <div className="space-y-3">
                        {desiredOutcomeOptions.map((option, index) => {
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                            return (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.15,
                                        type: "spring",
                                        stiffness: 150
                                    }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${selectedAnswer === option.value
                                            ? 'bg-[#22C58B]/10 border-2 border-[#22C58B] shadow-lg shadow-[#22C58B]/20 scale-[1.01]'
                                            : 'bg-white border border-gray-200 hover:border-[#22C58B]/30'
                                            }`}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                {/* A, B, C, D Letter */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === option.value
                                                    ? 'bg-[#22C58B] text-white'
                                                    : 'bg-gray-100 text-[#33373B]'
                                                    }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                    {optionLetter}
                                                </div>

                                                {/* Professional Phosphor Icons */}
                                                <div className={`flex items-center gap-1 ${selectedAnswer === option.value ? 'text-[#22C58B]' : 'text-[#33373B]/60'
                                                    }`}>
                                                    {option.icons.map((Icon, iconIndex) => (
                                                        <motion.div
                                                            key={iconIndex}
                                                            animate={selectedAnswer === option.value ? {
                                                                scale: [1, 1.3, 1],
                                                                rotate: [0, 15, -15, 0],
                                                                y: [0, -3, 0]
                                                            } : {}}
                                                            transition={{
                                                                duration: 1.5,
                                                                delay: iconIndex * 0.2,
                                                                repeat: selectedAnswer === option.value ? Infinity : 0
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center relative"
                                                        >
                                                            <Icon className="w-5 h-5" weight="regular" />

                                                            {/* Professional sparkle effect when selected */}
                                                            {selectedAnswer === option.value && (
                                                                <motion.div
                                                                    animate={{
                                                                        scale: [0, 1, 0],
                                                                        opacity: [0, 1, 0],
                                                                        rotate: [0, 180]
                                                                    }}
                                                                    transition={{
                                                                        duration: 1,
                                                                        repeat: Infinity,
                                                                        delay: 0.5 + iconIndex * 0.3
                                                                    }}
                                                                    className="absolute -top-1 -right-1"
                                                                >
                                                                    <Sparkle className="w-3 h-3 text-[#FFD166]" weight="fill" />
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium leading-relaxed ${selectedAnswer === option.value ? 'text-[#33373B]' : 'text-[#33373B]/80'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {option.text}
                                                    </p>
                                                </div>

                                                {/* Selection Indicator */}
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

export default QuizDesiredOutcomeScreen;