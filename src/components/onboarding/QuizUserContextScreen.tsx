import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { House, EnvelopeSimple, Briefcase, MagnifyingGlass, ArrowLeft, ArrowRight, CheckCircle } from 'phosphor-react';
import { useOnboardingStore, trackOnboardingEvent } from '@/stores/onboardingStoreZustand';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface QuizUserContextScreenProps {
    onNext: () => void;
    onPrevious: () => void;
}

const contextOptions = [
    {
        id: 'tenant_landlord',
        icon: House,
        title: 'Kiracı/Ev Sahibi Anlaşmazlığı',
        subtitle: 'Şu kira sözleşmesi yok mu...',
        value: 'tenant_landlord'
    },
    {
        id: 'official_notice',
        icon: EnvelopeSimple,
        title: 'Resmi Bir Tebligat Aldım',
        subtitle: 'Eve bir kağıt gelmiş, ne anlama geldiğini çözemedim.',
        value: 'official_notice'
    },
    {
        id: 'work_contract',
        icon: Briefcase,
        title: 'İş veya Hizmet Sözleşmesi',
        subtitle: 'İmzalamadan önce emin olmak istedim.',
        value: 'work_contract'
    },
    {
        id: 'just_curious',
        icon: MagnifyingGlass,
        title: 'Sadece Merak Ediyorum',
        subtitle: 'Henüz bir sorunum yok, ne yaptığınızı keşfediyorum.',
        value: 'just_curious'
    }
];

// Form validation schema
const userContextSchema = z.object({
    userContext: z.string().min(1, 'Lütfen bir seçenek seçin'),
});

type UserContextFormData = z.infer<typeof userContextSchema>;

export const QuizUserContextScreen: React.FC<QuizUserContextScreenProps> = ({ onNext, onPrevious }) => {
    const { answers, setAnswer, getQuizProgress } = useOnboardingStore();
    const progress = getQuizProgress();

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<UserContextFormData>({
        resolver: zodResolver(userContextSchema),
        defaultValues: {
            userContext: answers.userContext || ''
        },
        mode: 'onChange'
    });

    const selectedAnswer = watch('userContext');

    // Sync with Zustand store
    useEffect(() => {
        if (answers.userContext && !selectedAnswer) {
            setValue('userContext', answers.userContext);
        }
    }, [answers.userContext, selectedAnswer, setValue]);

    const handleSelect = (value: string) => {
        setValue('userContext', value, { shouldValidate: true });
        setAnswer('userContext', value);

        // Track answer selection
        trackOnboardingEvent('quiz_answer_selected', {
            question: 'user_context',
            answer: value,
            question_number: 1,
            progress: progress,
            form_valid: true
        });
    };

    const onSubmit = (data: UserContextFormData) => {
        trackOnboardingEvent('quiz_question_completed', {
            question: 'user_context',
            answer: data.userContext,
            question_number: 1,
            form_data: data
        });
        onNext();
    };

    return (
        <div className="flex flex-col w-full h-screen bg-white text-[#33373B]">
            {/* Header with Progress */}
            <div className="flex-shrink-0 px-6 pt-8 pb-6">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-[#22C58B] rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                    </div>
                    <span className="text-sm text-[#33373B]/60 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>Soru 1/5</span>
                </div>

                {/* Professional Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Abstract Human Character - Artiklo Rehberi */}
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
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
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#22C58B] rounded-full"
                            />
                            {/* Body */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-[#22C58B] rounded-lg" />
                            {/* Arms - Welcoming gesture */}
                            <motion.div
                                animate={{
                                    rotate: [0, 10, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 right-2 w-1.5 h-6 bg-[#22C58B] rounded-full transform rotate-45"
                            />
                            <motion.div
                                animate={{
                                    rotate: [0, -10, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-8 left-2 w-1.5 h-6 bg-[#22C58B] rounded-full transform -rotate-45"
                            />
                            {/* Legs */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1.5 h-6 bg-[#22C58B] rounded-full" />
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-6 bg-[#22C58B] rounded-full" />
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2 text-[#33373B]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Seni Tanıyalım!
                    </h1>
                    <h2 className="text-lg font-medium mb-4 text-[#22C58B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Hoş geldin! Size nasıl yardım edebilirim?
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
                    <h3 className="text-base font-medium mb-6 text-center text-[#33373B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Hukuki bir belgeyle en son ne zaman başın derde girdi?
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <Controller
                            name="userContext"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {contextOptions.map((option, index) => {
                                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                                        return (
                                            <motion.div
                                                key={option.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                            >
                                                <Card
                                                    className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${selectedAnswer === option.value
                                                        ? 'bg-[#22C58B]/10 border-2 border-[#22C58B] shadow-lg shadow-[#22C58B]/20'
                                                        : 'bg-white border border-gray-200 hover:border-[#22C58B]/30'
                                                        } ${errors.userContext ? 'border-red-400 bg-red-50' : ''
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

                                                            {/* Professional Phosphor Icon */}
                                                            <motion.div
                                                                animate={selectedAnswer === option.value ? {
                                                                    scale: [1, 1.1, 1],
                                                                    rotate: [0, 5, -5, 0]
                                                                } : {}}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAnswer === option.value
                                                                    ? 'bg-[#22C58B]/20 text-[#22C58B]'
                                                                    : 'bg-gray-100 text-[#33373B]/60'
                                                                    }`}>
                                                                <option.icon className="w-5 h-5" weight="regular" />
                                                            </motion.div>

                                                            <div className="flex-1">
                                                                <h4 className={`font-semibold mb-1 text-sm ${selectedAnswer === option.value ? 'text-[#22C58B]' : 'text-[#33373B]'
                                                                    }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                    {option.title}
                                                                </h4>
                                                                <p className={`text-xs ${selectedAnswer === option.value ? 'text-[#33373B]' : 'text-[#33373B]/70'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                                    {option.subtitle}
                                                                </p>
                                                            </div>

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

                                    {/* Error Message */}
                                    {errors.userContext && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-xs mt-2 flex items-center gap-2"
                                            style={{ fontFamily: 'Nunito, sans-serif' }}
                                        >
                                            <CheckCircle className="w-4 h-4" weight="fill" />
                                            {errors.userContext.message}
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        />
                    </form>
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
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            disabled={!isValid || !selectedAnswer}
                            className="bg-[#22C58B] hover:bg-[#1FAB73] text-white px-8 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            style={{
                                fontFamily: 'Nunito, sans-serif',
                                boxShadow: '0 4px 15px rgba(34, 197, 139, 0.3)'
                            }}
                        >
                            <span>Devam</span>
                            {(isValid && selectedAnswer) && (
                                <motion.div
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-4 h-4" weight="regular" />
                                </motion.div>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizUserContextScreen;