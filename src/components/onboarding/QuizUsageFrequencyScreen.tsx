import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Calendar, Clock, Hourglass, Lightbulb } from 'phosphor-react';
import { useOnboardingStore } from '@/stores/onboardingStoreZustand';

interface QuizUsageFrequencyScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

const frequencyOptions = [
    {
        id: 'monthly',
        icon: Calendar,
        text: 'Ayda en az bir kez karşılaşıyorum.',
        value: 'monthly',
        color: 'from-red-500/20 to-orange-500/10',
        iconColor: 'text-red-400',
        bgGlow: 'bg-red-500/5'
    },
    {
        id: 'yearly',
        icon: Clock,
        text: 'Yılda birkaç kez, önemli anlarda.',
        value: 'yearly',
        color: 'from-blue-500/20 to-cyan-500/10',
        iconColor: 'text-blue-400',
        bgGlow: 'bg-blue-500/5'
    },
    {
        id: 'rarely',
        icon: Hourglass,
        text: 'Çok nadir, umarım bir daha karşılaşmam.',
        value: 'rarely',
        color: 'from-green-500/20 to-emerald-500/10',
        iconColor: 'text-green-400',
        bgGlow: 'bg-green-500/5'
    }
];

export const QuizUsageFrequencyScreen: React.FC<QuizUsageFrequencyScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, setAnswer } = useOnboardingStore();
    const selectedAnswer = answers.usageFrequency;

    const handleSelect = (value: string) => {
        setAnswer('usageFrequency', value);
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
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                    </div>
                    <span className="text-sm text-[#33373B]/60 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>Soru 4/5</span>
                </div>

                {/* Professional Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Abstract Human Character with Time Tool */}
                    <motion.div
                        animate={{
                            y: [0, -5, 0]
                        }}
                        transition={{ duration: 2.2, repeat: Infinity }}
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
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#FFD166] rounded-full"
                                />
                                {/* Body */}
                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-[#FFD166] rounded-lg" />
                                {/* Arms - Thoughtful gesture */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-8 right-2 w-1.5 h-6 bg-[#FFD166] rounded-full transform rotate-30"
                                />
                                <div className="absolute top-8 left-2 w-1.5 h-6 bg-[#FFD166] rounded-full transform -rotate-12" />
                                {/* Legs */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-[#FFD166] rounded-full" />
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-[#FFD166] rounded-full" />
                            </div>

                            {/* Professional Time Tool */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity }
                                }}
                                className="absolute -right-8 top-1 w-8 h-8 bg-[#22C58B] rounded-full flex items-center justify-center shadow-lg"
                            >
                                <Clock className="w-4 h-4 text-white" weight="bold" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Harika Bir Seçim!
                    </h1>
                    <h2 className="text-lg font-medium mb-4 text-[#FFD166]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Bu tür belgeler ne sıklıkta hayatınızda?
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

                    <div className="space-y-3">
                        {frequencyOptions.map((option, index) => {
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C
                            return (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.2,
                                        type: "spring",
                                        stiffness: 120
                                    }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${selectedAnswer === option.value
                                            ? 'bg-[#FFD166]/10 border-2 border-[#FFD166] shadow-lg shadow-[#FFD166]/20 scale-[1.01]'
                                            : 'bg-white border border-gray-200 hover:border-[#FFD166]/40'
                                            }`}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                {/* A, B, C Letter */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === option.value
                                                    ? 'bg-[#FFD166] text-[#33373B]'
                                                    : 'bg-gray-100 text-[#33373B]'
                                                    }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                    {optionLetter}
                                                </div>

                                                {/* Professional Phosphor Icon with enhanced animation */}
                                                <div className="relative">
                                                    <motion.div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedAnswer === option.value
                                                            ? 'bg-[#FFD166]/20'
                                                            : 'bg-gray-100'
                                                            }`}
                                                        animate={selectedAnswer === option.value ? {
                                                            scale: [1, 1.15, 1],
                                                            boxShadow: [
                                                                "0 0 0 rgba(255, 209, 102, 0)",
                                                                "0 0 20px rgba(255, 209, 102, 0.4)",
                                                                "0 0 0 rgba(255, 209, 102, 0)"
                                                            ],
                                                            rotate: option.id === 'monthly' ? [0, 360] : 0
                                                        } : {}}
                                                        transition={{
                                                            duration: option.id === 'monthly' ? 3 : 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    >
                                                        <option.icon className={`w-6 h-6 ${selectedAnswer === option.value
                                                            ? 'text-[#FFD166]'
                                                            : 'text-[#33373B]/60'
                                                            }`} weight="regular" />
                                                    </motion.div>

                                                    {/* Professional frequency indicators */}
                                                    {selectedAnswer === option.value && (
                                                        <>
                                                            {Array.from({ length: option.id === 'monthly' ? 4 : option.id === 'yearly' ? 2 : 1 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{
                                                                        scale: [0, 1, 0],
                                                                        opacity: [0, 1, 0]
                                                                    }}
                                                                    transition={{
                                                                        duration: 1.5,
                                                                        repeat: Infinity,
                                                                        delay: i * 0.3
                                                                    }}
                                                                    className="absolute w-2 h-2 bg-[#FFD166] rounded-full"
                                                                    style={{
                                                                        right: `${-8 - i * 4}px`,
                                                                        top: `${6 + i * 3}px`
                                                                    }}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium leading-relaxed ${selectedAnswer === option.value ? 'text-[#33373B]' : 'text-[#33373B]/80'
                                                        }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                        {option.text}
                                                    </p>
                                                </div>

                                                {/* Professional Selection Indicator */}
                                                <div className="relative">
                                                    <div className={`w-5 h-5 rounded-full border-2 ${selectedAnswer === option.value
                                                        ? 'border-[#22C58B] bg-[#22C58B]'
                                                        : 'border-gray-300 bg-transparent'
                                                        }`}>
                                                        {selectedAnswer === option.value && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ duration: 0.2, type: "spring" }}
                                                                className="w-full h-full rounded-full bg-white scale-[0.4]"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Professional Context */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="mt-6 p-4 bg-[#22C58B]/10 rounded-xl border border-[#22C58B]/20"
                    >
                        <div className="text-center">
                            <Lightbulb className="w-6 h-6 text-[#22C58B] mx-auto mb-2" weight="regular" />
                            <p className="text-sm text-[#33373B]/80 leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                Cevabınıza göre size en uygun planı önerebilmek için soruyoruz.
                            </p>
                        </div>
                    </motion.div>
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

export default QuizUsageFrequencyScreen;