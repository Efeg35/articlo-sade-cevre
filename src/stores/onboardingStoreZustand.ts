import { create } from 'zustand';

// Quiz seçenekleri için enum'lar
export enum UserContextOptions {
    TENANT_HOME = 'tenant_home',
    OFFICIAL_NOTICE = 'official_notice',
    WORK_CONTRACT = 'work_contract',
    CURIOSITY = 'curiosity'
}

export enum PainPointOptions {
    DONT_UNDERSTAND = 'dont_understand',
    RISK_CONCERN = 'risk_concern',
    TOO_LONG = 'too_long',
    WHAT_TO_REPLY = 'what_to_reply'
}

export enum DesiredOutcomeOptions {
    RISK_ANALYSIS = 'risk_analysis',
    ACTION_PLAN = 'action_plan',
    TERM_EXPLANATION = 'term_explanation',
    RESPONSE_WRITING = 'response_writing'
}

export enum UsageFrequencyOptions {
    MONTHLY_PLUS = 'monthly_plus',
    YEARLY_FEW = 'yearly_few',
    VERY_RARE = 'very_rare'
}

export enum ValueLevelOptions {
    ONLY_TRANSLATION = 'only_translation',
    RISK_WARNING_PLAN = 'risk_warning_plan',
    FULL_PROCESS_MANAGEMENT = 'full_process_management'
}

// Quiz soruları için static data
export const QUIZ_QUESTIONS = {
    [UserContextOptions.TENANT_HOME]: 'Kiracı/Ev Sahibi',
    [UserContextOptions.OFFICIAL_NOTICE]: 'Resmi Tebligat',
    [UserContextOptions.WORK_CONTRACT]: 'İş Sözleşmesi',
    [UserContextOptions.CURIOSITY]: 'Sadece Merak',

    [PainPointOptions.DONT_UNDERSTAND]: 'Anlamadım',
    [PainPointOptions.RISK_CONCERN]: 'Risk var mı?',
    [PainPointOptions.TOO_LONG]: 'Çok uzun',
    [PainPointOptions.WHAT_TO_REPLY]: 'Ne cevap vereyim?',

    [DesiredOutcomeOptions.RISK_ANALYSIS]: 'Risk analizi',
    [DesiredOutcomeOptions.ACTION_PLAN]: 'Adım planı',
    [DesiredOutcomeOptions.TERM_EXPLANATION]: 'Terim açıklaması',
    [DesiredOutcomeOptions.RESPONSE_WRITING]: 'Cevap yazımı',

    [UsageFrequencyOptions.MONTHLY_PLUS]: 'Ayda 1+',
    [UsageFrequencyOptions.YEARLY_FEW]: 'Yılda birkaç',
    [UsageFrequencyOptions.VERY_RARE]: 'Çok nadir',

    [ValueLevelOptions.ONLY_TRANSLATION]: 'Sadece çeviri',
    [ValueLevelOptions.RISK_WARNING_PLAN]: 'Risk uyarı + plan',
    [ValueLevelOptions.FULL_PROCESS_MANAGEMENT]: 'Tam süreç yönetimi'
} as const;

// Quiz cevapları interface'i
export interface QuizAnswers {
    userContext: UserContextOptions | null;
    painPoint: PainPointOptions | null;
    desiredOutcome: DesiredOutcomeOptions | null;
    usageFrequency: UsageFrequencyOptions | null;
    valueLevel: ValueLevelOptions | null;
}

// Analytics interface
interface OnboardingAnalytics {
    answers: QuizAnswers;
    currentStep: number;
    selectedPlan: 'free' | 'basic' | 'pro' | 'enterprise' | null;
    completionRate: number;
    isComplete: boolean;
    timestamp: string;
    userJourney: {
        hasReachedQuiz: boolean;
        hasCompletedQuiz: boolean;
        hasSeenPaywall: boolean;
        selectedPlan: 'free' | 'basic' | 'pro' | 'enterprise' | null;
    };
}

// Ana onboarding state interface'i
export interface OnboardingState {
    // Navigation
    currentStep: number; // 0-10 (11 ekran)
    isCompleted: boolean;
    hasCompletedOnboarding: boolean; // AsyncStorage flag

    // Quiz Answers
    quizAnswers: QuizAnswers;

    // Backward compatibility - deprecated
    answers: QuizAnswers;

    // Additional state
    selectedPlan: 'free' | 'basic' | 'pro' | 'enterprise' | null;
    isTransitioning: boolean;
    transitionDirection: 'forward' | 'backward' | null;

    // Actions
    setCurrentStep: (step: number) => void;
    setQuizAnswer: (question: keyof QuizAnswers, answer: string) => void;
    nextStep: () => void;
    previousStep: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;

    // Backward compatibility - deprecated
    setAnswer: (question: keyof QuizAnswers, answer: string) => void;

    // Navigation helpers
    goToStep: (step: number) => void;
    canGoNext: () => boolean;
    canGoPrevious: () => boolean;

    // Animation helpers
    setTransitioning: (transitioning: boolean, direction?: 'forward' | 'backward') => void;

    // Quiz helpers
    isQuizComplete: () => boolean;
    getPersonalizationMessage: () => string;
    getQuizProgress: () => number;

    // Plan selection
    setSelectedPlan: (plan: 'free' | 'basic' | 'pro' | 'enterprise') => void;

    // Analytics helpers
    getAnswerAnalytics: () => OnboardingAnalytics;

    // AsyncStorage helpers
    loadFromStorage: () => Promise<void>;
    saveToStorage: () => Promise<void>;
}

// Onboarding ekranları konfigürasyonu
export const ONBOARDING_SCREENS = {
    WELCOME: 0,
    FEATURE_SIMPLIFICATION: 1,
    FEATURE_RISK_DETECTION: 2,
    FEATURE_ACTION_PLAN: 3,
    QUIZ_USER_CONTEXT: 4,
    QUIZ_PAIN_POINT: 5,
    QUIZ_DESIRED_OUTCOME: 6,
    QUIZ_USAGE_FREQUENCY: 7,
    QUIZ_VALUE_LEVEL: 8,
    PERSONALIZATION: 9,
    PAYWALL: 10
} as const;

export type OnboardingScreen = typeof ONBOARDING_SCREENS[keyof typeof ONBOARDING_SCREENS];

// Screen metadata helper
export const getScreenMetadata = (screen: OnboardingScreen) => {
    const screenData = {
        [ONBOARDING_SCREENS.WELCOME]: {
            title: "Artiklo'ya Hoş Geldiniz",
            section: "introduction",
            canSkip: false,
            showProgress: false
        },
        [ONBOARDING_SCREENS.FEATURE_SIMPLIFICATION]: {
            title: "Anlaşılmaz Metinlere Son",
            section: "introduction",
            canSkip: false,
            showProgress: true
        },
        [ONBOARDING_SCREENS.FEATURE_RISK_DETECTION]: {
            title: "Gizli Riskleri Keşfedin",
            section: "introduction",
            canSkip: false,
            showProgress: true
        },
        [ONBOARDING_SCREENS.FEATURE_ACTION_PLAN]: {
            title: "Ne Yapacağınızı Bilin",
            section: "introduction",
            canSkip: false,
            showProgress: true
        },
        [ONBOARDING_SCREENS.QUIZ_USER_CONTEXT]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 1,
            question: "En çok hangi konularda hukuki belgelerle karşılaşıyorsun?"
        },
        [ONBOARDING_SCREENS.QUIZ_PAIN_POINT]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 2,
            question: "Hukuki belgelerle karşılaştığında en büyük zorluğun ne oluyor?"
        },
        [ONBOARDING_SCREENS.QUIZ_DESIRED_OUTCOME]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 3,
            question: "Hukuki belgeler konusunda en çok neye ihtiyacın var?"
        },
        [ONBOARDING_SCREENS.QUIZ_USAGE_FREQUENCY]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 4,
            question: "Ne sıklıkla hukuki belgelerle karşılaşıyorsun?"
        },
        [ONBOARDING_SCREENS.QUIZ_VALUE_LEVEL]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 5,
            question: "Hangi seviyede destek almak istiyorsun?"
        },
        [ONBOARDING_SCREENS.PERSONALIZATION]: {
            title: "Sana Özel Deneyim Hazırlıyoruz",
            section: "finale",
            canSkip: false,
            showProgress: true
        },
        [ONBOARDING_SCREENS.PAYWALL]: {
            title: "Artiklo'nun Tüm Gücünü Açığa Çıkarın",
            section: "finale",
            canSkip: true,
            showProgress: false
        }
    };

    return screenData[screen] || {
        title: "Onboarding",
        section: "unknown",
        canSkip: true,
        showProgress: false
    };
};

// Initial quiz answers
const initialQuizAnswers: QuizAnswers = {
    userContext: null,
    painPoint: null,
    desiredOutcome: null,
    usageFrequency: null,
    valueLevel: null
};

// Main Zustand store
export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    // Initial state
    currentStep: 0,
    isCompleted: false,
    hasCompletedOnboarding: false,
    quizAnswers: initialQuizAnswers,
    selectedPlan: null,
    isTransitioning: false,
    transitionDirection: null,

    // Backward compatibility - direct reference
    answers: initialQuizAnswers,

    // Navigation actions
    setCurrentStep: (step: number) => {
        const currentStep = get().currentStep;
        const direction = step > currentStep ? 'forward' : 'backward';

        set({
            currentStep: Math.max(0, Math.min(step, 10)),
            transitionDirection: direction
        });
    },

    nextStep: () => {
        const { currentStep, canGoNext } = get();
        if (canGoNext()) {
            set({
                currentStep: Math.min(currentStep + 1, 10),
                transitionDirection: 'forward'
            });

            // Auto-save progress
            get().saveToStorage();
        }
    },

    previousStep: () => {
        const { currentStep, canGoPrevious } = get();
        if (canGoPrevious()) {
            set({
                currentStep: Math.max(currentStep - 1, 0),
                transitionDirection: 'backward'
            });
        }
    },

    goToStep: (step: number) => {
        const currentStep = get().currentStep;
        const direction = step > currentStep ? 'forward' : 'backward';

        set({
            currentStep: Math.max(0, Math.min(step, 10)),
            transitionDirection: direction
        });
    },

    // Quiz answer management
    setQuizAnswer: (question: keyof QuizAnswers, answer: string) => {
        const typedAnswer = answer as UserContextOptions | PainPointOptions | DesiredOutcomeOptions | UsageFrequencyOptions | ValueLevelOptions;

        set((state) => ({
            quizAnswers: {
                ...state.quizAnswers,
                [question]: typedAnswer
            },
            // Keep answers in sync for backward compatibility
            answers: {
                ...state.quizAnswers,
                [question]: typedAnswer
            }
        }));

        // Auto-save after each answer
        setTimeout(() => get().saveToStorage(), 100);
    },

    // Backward compatibility - deprecated
    setAnswer: (question: keyof QuizAnswers, answer: string) => {
        get().setQuizAnswer(question, answer);
    },


    // Completion management
    completeOnboarding: async () => {
        set({
            isCompleted: true,
            hasCompletedOnboarding: true
        });

        await get().saveToStorage();

        // Track completion event
        console.log('[Onboarding] Completed successfully', {
            answers: get().quizAnswers,
            selectedPlan: get().selectedPlan
        });
    },

    resetOnboarding: () => {
        set({
            currentStep: 0,
            isCompleted: false,
            hasCompletedOnboarding: false,
            quizAnswers: initialQuizAnswers,
            answers: initialQuizAnswers, // Keep in sync
            selectedPlan: null,
            isTransitioning: false,
            transitionDirection: null
        });

        // Clear storage
        localStorage.removeItem('artiklo-onboarding-state');
    },

    // Plan selection
    setSelectedPlan: (plan: 'free' | 'basic' | 'pro' | 'enterprise') => {
        set({ selectedPlan: plan });
        get().saveToStorage();
    },

    // Animation helpers
    setTransitioning: (transitioning: boolean, direction?: 'forward' | 'backward') => {
        set({
            isTransitioning: transitioning,
            transitionDirection: direction || null
        });
    },

    // Helper functions
    canGoNext: () => {
        const { currentStep, quizAnswers } = get();

        // Introduction screens (0-3) - always can go next
        if (currentStep <= 3) return true;

        // Quiz screens (4-8) - need answer to proceed
        if (currentStep === 4) return quizAnswers.userContext !== null;
        if (currentStep === 5) return quizAnswers.painPoint !== null;
        if (currentStep === 6) return quizAnswers.desiredOutcome !== null;
        if (currentStep === 7) return quizAnswers.usageFrequency !== null;
        if (currentStep === 8) return quizAnswers.valueLevel !== null;

        // Personalization screen (9) - always can go next
        if (currentStep === 9) return true;

        // Paywall screen (10) - final screen
        return false;
    },

    canGoPrevious: () => {
        const { currentStep } = get();
        return currentStep > 0;
    },

    isQuizComplete: () => {
        const { quizAnswers } = get();
        return Object.values(quizAnswers).every(answer => answer !== null);
    },

    getQuizProgress: () => {
        const { quizAnswers } = get();
        const completedAnswers = Object.values(quizAnswers).filter(answer => answer !== null).length;
        return (completedAnswers / 5) * 100; // 5 quiz questions
    },

    getPersonalizationMessage: () => {
        const { quizAnswers } = get();

        let message = "Görünüşe göre ";

        // Based on desired outcome (question 3)
        if (quizAnswers.desiredOutcome === DesiredOutcomeOptions.RISK_ANALYSIS) {
            message += "senin için en önemlisi, gözden kaçırdığın riskli maddeleri tespit etmek";
        } else if (quizAnswers.desiredOutcome === DesiredOutcomeOptions.ACTION_PLAN) {
            message += "bir sonraki adımda ne yapman gerektiğini bilmek en önemlisi";
        } else if (quizAnswers.desiredOutcome === DesiredOutcomeOptions.TERM_EXPLANATION) {
            message += "teknik terimlerin ne anlama geldiğini öğrenmek önceliğin";
        } else if (quizAnswers.desiredOutcome === DesiredOutcomeOptions.RESPONSE_WRITING) {
            message += "karşı belge hazırlanması konusunda destek almak istiyorsun";
        } else {
            message += "belgelerini daha iyi anlama konusunda yardım arıyorsun";
        }

        message += "...";

        // Add frequency-based message
        if (quizAnswers.usageFrequency === UsageFrequencyOptions.MONTHLY_PLUS) {
            message += "\n\nSık sık karşılaştığın bu durumlar için artık yalnız değilsin.";
        } else if (quizAnswers.usageFrequency === UsageFrequencyOptions.YEARLY_FEW) {
            message += "\n\nYılda birkaç kez karşılaştığın bu durumlar için artık yalnız değilsin.";
        } else if (quizAnswers.usageFrequency === UsageFrequencyOptions.VERY_RARE) {
            message += "\n\nNadiren de olsa karşılaştığın bu durumlarda artık hazırlıklı olacaksın.";
        }

        return message;
    },

    getAnswerAnalytics: () => {
        const { quizAnswers, currentStep, selectedPlan } = get();

        return {
            answers: quizAnswers,
            currentStep,
            selectedPlan,
            completionRate: get().getQuizProgress(),
            isComplete: get().isQuizComplete(),
            timestamp: new Date().toISOString(),
            userJourney: {
                hasReachedQuiz: currentStep >= 4,
                hasCompletedQuiz: get().isQuizComplete(),
                hasSeenPaywall: currentStep >= 10,
                selectedPlan: selectedPlan
            }
        };
    },

    // AsyncStorage integration
    loadFromStorage: async () => {
        try {
            const savedState = localStorage.getItem('artiklo-onboarding-state');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                const loadedAnswers = parsedState.quizAnswers || initialQuizAnswers;
                set({
                    currentStep: parsedState.currentStep || 0,
                    isCompleted: parsedState.isCompleted || false,
                    hasCompletedOnboarding: parsedState.hasCompletedOnboarding || false,
                    quizAnswers: loadedAnswers,
                    answers: loadedAnswers, // Keep in sync
                    selectedPlan: parsedState.selectedPlan || null
                });

                console.log('[Onboarding] State loaded from storage');
            }
        } catch (error) {
            console.error('[Onboarding] Error loading from storage:', error);
        }
    },

    saveToStorage: async () => {
        try {
            const { currentStep, isCompleted, hasCompletedOnboarding, quizAnswers, selectedPlan } = get();
            const stateToSave = {
                currentStep,
                isCompleted,
                hasCompletedOnboarding,
                quizAnswers,
                selectedPlan
            };

            localStorage.setItem('artiklo-onboarding-state', JSON.stringify(stateToSave));
            console.log('[Onboarding] State saved to storage');
        } catch (error) {
            console.error('[Onboarding] Error saving to storage:', error);
        }
    }
}));

// Quiz seçenekleri helper'ları
export const getUserContextOptions = () => [
    { value: UserContextOptions.TENANT_HOME, label: QUIZ_QUESTIONS[UserContextOptions.TENANT_HOME] },
    { value: UserContextOptions.OFFICIAL_NOTICE, label: QUIZ_QUESTIONS[UserContextOptions.OFFICIAL_NOTICE] },
    { value: UserContextOptions.WORK_CONTRACT, label: QUIZ_QUESTIONS[UserContextOptions.WORK_CONTRACT] },
    { value: UserContextOptions.CURIOSITY, label: QUIZ_QUESTIONS[UserContextOptions.CURIOSITY] }
];

export const getPainPointOptions = () => [
    { value: PainPointOptions.DONT_UNDERSTAND, label: QUIZ_QUESTIONS[PainPointOptions.DONT_UNDERSTAND] },
    { value: PainPointOptions.RISK_CONCERN, label: QUIZ_QUESTIONS[PainPointOptions.RISK_CONCERN] },
    { value: PainPointOptions.TOO_LONG, label: QUIZ_QUESTIONS[PainPointOptions.TOO_LONG] },
    { value: PainPointOptions.WHAT_TO_REPLY, label: QUIZ_QUESTIONS[PainPointOptions.WHAT_TO_REPLY] }
];

export const getDesiredOutcomeOptions = () => [
    { value: DesiredOutcomeOptions.RISK_ANALYSIS, label: QUIZ_QUESTIONS[DesiredOutcomeOptions.RISK_ANALYSIS] },
    { value: DesiredOutcomeOptions.ACTION_PLAN, label: QUIZ_QUESTIONS[DesiredOutcomeOptions.ACTION_PLAN] },
    { value: DesiredOutcomeOptions.TERM_EXPLANATION, label: QUIZ_QUESTIONS[DesiredOutcomeOptions.TERM_EXPLANATION] },
    { value: DesiredOutcomeOptions.RESPONSE_WRITING, label: QUIZ_QUESTIONS[DesiredOutcomeOptions.RESPONSE_WRITING] }
];

export const getUsageFrequencyOptions = () => [
    { value: UsageFrequencyOptions.MONTHLY_PLUS, label: QUIZ_QUESTIONS[UsageFrequencyOptions.MONTHLY_PLUS] },
    { value: UsageFrequencyOptions.YEARLY_FEW, label: QUIZ_QUESTIONS[UsageFrequencyOptions.YEARLY_FEW] },
    { value: UsageFrequencyOptions.VERY_RARE, label: QUIZ_QUESTIONS[UsageFrequencyOptions.VERY_RARE] }
];

export const getValueLevelOptions = () => [
    { value: ValueLevelOptions.ONLY_TRANSLATION, label: QUIZ_QUESTIONS[ValueLevelOptions.ONLY_TRANSLATION] },
    { value: ValueLevelOptions.RISK_WARNING_PLAN, label: QUIZ_QUESTIONS[ValueLevelOptions.RISK_WARNING_PLAN] },
    { value: ValueLevelOptions.FULL_PROCESS_MANAGEMENT, label: QUIZ_QUESTIONS[ValueLevelOptions.FULL_PROCESS_MANAGEMENT] }
];

// Uygulama başlangıcında storage'dan yükleme helper'ı
export const initializeOnboardingStore = async () => {
    await useOnboardingStore.getState().loadFromStorage();
    console.log('[Onboarding] Store initialized');
};

// Analytics ve tracking helper'ları
export const trackOnboardingEvent = (eventName: string, data?: Record<string, unknown>) => {
    console.log(`[Onboarding Analytics] ${eventName}`, {
        currentStep: useOnboardingStore.getState().currentStep,
        ...data
    });
};

// Subscription helper'ları
export const subscribeToStep = (callback: (step: number) => void) => {
    return useOnboardingStore.subscribe((state) => {
        callback(state.currentStep);
    });
};

export const subscribeToQuizAnswers = (callback: (answers: QuizAnswers) => void) => {
    return useOnboardingStore.subscribe((state) => {
        callback(state.quizAnswers);
    });
};