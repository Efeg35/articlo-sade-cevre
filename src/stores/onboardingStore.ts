import { useState, useEffect } from 'react';

interface OnboardingAnswers {
    userContext: string;
    painPoint: string;
    desiredOutcome: string;
    usageFrequency: string;
    valueLevel: string;
}

interface OnboardingState {
    // Current state
    currentStep: number;
    answers: OnboardingAnswers;
    hasCompletedOnboarding: boolean;
    selectedPlan: 'free' | 'basic' | 'pro' | 'enterprise' | null;
}

const initialAnswers: OnboardingAnswers = {
    userContext: '',
    painPoint: '',
    desiredOutcome: '',
    usageFrequency: '',
    valueLevel: ''
};

// Local storage keys
const STORAGE_KEYS = {
    ONBOARDING_STATE: 'artiklo-onboarding-state',
    HAS_COMPLETED: 'artiklo-has-completed-onboarding',
    ANSWERS: 'artiklo-onboarding-answers',
    SELECTED_PLAN: 'artiklo-selected-plan'
} as const;

// Storage utilities
const storage = {
    get: (key: string) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage key ${key}:`, error);
            return null;
        }
    },

    set: (key: string, value: unknown) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key ${key}:`, error);
        }
    },

    remove: (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage key ${key}:`, error);
        }
    }
};

// Screen configuration
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

// Screen metadata
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
            questionNumber: 1
        },
        [ONBOARDING_SCREENS.QUIZ_PAIN_POINT]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 2
        },
        [ONBOARDING_SCREENS.QUIZ_DESIRED_OUTCOME]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 3
        },
        [ONBOARDING_SCREENS.QUIZ_USAGE_FREQUENCY]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 4
        },
        [ONBOARDING_SCREENS.QUIZ_VALUE_LEVEL]: {
            title: "Hukuki Labirentten Çıkış Rehberin",
            section: "quiz",
            canSkip: false,
            showProgress: true,
            questionNumber: 5
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

// Main store class
class OnboardingStore {
    private state: OnboardingState;
    private listeners: Set<() => void> = new Set();

    constructor() {
        // Initialize state from localStorage or defaults
        const savedAnswers = storage.get(STORAGE_KEYS.ANSWERS) || initialAnswers;
        const hasCompletedOnboarding = storage.get(STORAGE_KEYS.HAS_COMPLETED) || false;
        const selectedPlan = storage.get(STORAGE_KEYS.SELECTED_PLAN) || null;

        this.state = {
            currentStep: 0,
            answers: savedAnswers,
            hasCompletedOnboarding,
            selectedPlan
        };
    }

    // State management methods
    private setState(updates: Partial<OnboardingState>) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    // Public method to update state from external functions
    updateState(updates: Partial<OnboardingState>) {
        this.setState(updates);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    getState() {
        return this.state;
    }

    // Action implementations
    setCurrentStep(step: number) {
        this.setState({ currentStep: step });
    }

    setAnswer(question: keyof OnboardingAnswers, answer: string) {
        const newAnswers = { ...this.state.answers, [question]: answer };
        this.setState({ answers: newAnswers });
        storage.set(STORAGE_KEYS.ANSWERS, newAnswers);
    }

    nextStep() {
        const newStep = Math.min(this.state.currentStep + 1, 10);
        this.setState({ currentStep: newStep });
    }

    previousStep() {
        const newStep = Math.max(this.state.currentStep - 1, 0);
        this.setState({ currentStep: newStep });
    }

    goToStep(step: number) {
        const newStep = Math.max(0, Math.min(step, 10));
        this.setState({ currentStep: newStep });
    }

    resetOnboarding() {
        this.setState({
            currentStep: 0,
            answers: initialAnswers,
            hasCompletedOnboarding: false,
            selectedPlan: null
        });

        // Clear localStorage
        Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
    }

    completeOnboarding() {
        this.setState({ hasCompletedOnboarding: true });
        storage.set(STORAGE_KEYS.HAS_COMPLETED, true);
    }

    setSelectedPlan(plan: 'free' | 'basic' | 'pro' | 'enterprise') {
        this.setState({ selectedPlan: plan });
        storage.set(STORAGE_KEYS.SELECTED_PLAN, plan);
    }

    // Helper methods
    canGoNext(): boolean {
        const { currentStep, answers } = this.state;

        // Introduction screens (0-3) - always can go next
        if (currentStep <= 3) return true;

        // Quiz screens (4-8) - need answer to proceed
        if (currentStep === 4) return answers.userContext !== '';
        if (currentStep === 5) return answers.painPoint !== '';
        if (currentStep === 6) return answers.desiredOutcome !== '';
        if (currentStep === 7) return answers.usageFrequency !== '';
        if (currentStep === 8) return answers.valueLevel !== '';

        // Personalization screen (9) - always can go next after 3s
        if (currentStep === 9) return true;

        // Paywall screen (10) - final screen
        return false;
    }

    canGoPrevious(): boolean {
        return this.state.currentStep > 0;
    }

    isQuizComplete(): boolean {
        return Object.values(this.state.answers).every(answer => answer !== '');
    }

    getPersonalizationMessage(): string {
        const { answers } = this.state;

        let message = "Görünüşe göre ";

        // Based on desired outcome (question 3)
        if (answers.desiredOutcome === 'risk_detection') {
            message += "senin için en önemlisi, gözden kaçırdığın riskli maddeleri tespit etmek";
        } else if (answers.desiredOutcome === 'action_plan') {
            message += "bir sonraki adımda ne yapman gerektiğini bilmek en önemlisi";
        } else if (answers.desiredOutcome === 'terminology') {
            message += "teknik terimlerin ne anlama geldiğini öğrenmek önceliğin";
        } else if (answers.desiredOutcome === 'document_creation') {
            message += "karşı belge hazırlanması konusunda destek almak istiyorsun";
        } else {
            message += "belgelerini daha iyi anlama konusunda yardım arıyorsun";
        }

        message += "...";

        // Add frequency-based message
        if (answers.usageFrequency === 'monthly') {
            message += "\n\nSık sık karşılaştığın bu durumlar için artık yalnız değilsin.";
        } else if (answers.usageFrequency === 'yearly') {
            message += "\n\nYılda birkaç kez karşılaştığın bu durumlar için artık yalnız değilsin.";
        } else if (answers.usageFrequency === 'rarely') {
            message += "\n\nNadiren de olsa karşılaştığın bu durumlarda artık hazırlıklı olacaksın.";
        }

        return message;
    }
}

// Global store instance
export const onboardingStore = new OnboardingStore();

// React hook to use the store
export const useOnboardingStore = () => {
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const unsubscribe = onboardingStore.subscribe(() => {
            forceUpdate({});
        });

        return unsubscribe;
    }, []);

    return {
        ...onboardingStore.getState(),
        // Actions
        setCurrentStep: onboardingStore.setCurrentStep.bind(onboardingStore),
        setAnswer: onboardingStore.setAnswer.bind(onboardingStore),
        nextStep: onboardingStore.nextStep.bind(onboardingStore),
        previousStep: onboardingStore.previousStep.bind(onboardingStore),
        resetOnboarding: onboardingStore.resetOnboarding.bind(onboardingStore),
        completeOnboarding: onboardingStore.completeOnboarding.bind(onboardingStore),
        setSelectedPlan: onboardingStore.setSelectedPlan.bind(onboardingStore),
        goToStep: onboardingStore.goToStep.bind(onboardingStore),
        // Helpers
        canGoNext: onboardingStore.canGoNext.bind(onboardingStore),
        canGoPrevious: onboardingStore.canGoPrevious.bind(onboardingStore),
        isQuizComplete: onboardingStore.isQuizComplete.bind(onboardingStore),
        getPersonalizationMessage: onboardingStore.getPersonalizationMessage.bind(onboardingStore)
    };
};

// AsyncStorage alternative for mobile platforms
export const persistOnboardingState = async () => {
    try {
        // For mobile, we can use Capacitor Preferences
        const { Preferences } = await import('@capacitor/preferences');
        const state = onboardingStore.getState();

        await Preferences.set({
            key: STORAGE_KEYS.HAS_COMPLETED,
            value: JSON.stringify(state.hasCompletedOnboarding)
        });

        await Preferences.set({
            key: STORAGE_KEYS.ANSWERS,
            value: JSON.stringify(state.answers)
        });

        if (state.selectedPlan) {
            await Preferences.set({
                key: STORAGE_KEYS.SELECTED_PLAN,
                value: JSON.stringify(state.selectedPlan)
            });
        }

        console.log('Onboarding state persisted to mobile storage');
    } catch (error) {
        console.error('Error persisting onboarding state to mobile:', error);
        // Fallback to localStorage
        storage.set(STORAGE_KEYS.HAS_COMPLETED, onboardingStore.getState().hasCompletedOnboarding);
        storage.set(STORAGE_KEYS.ANSWERS, onboardingStore.getState().answers);
        if (onboardingStore.getState().selectedPlan) {
            storage.set(STORAGE_KEYS.SELECTED_PLAN, onboardingStore.getState().selectedPlan);
        }
    }
};

// Load onboarding state from mobile storage
export const loadOnboardingStateFromMobile = async () => {
    try {
        const { Preferences } = await import('@capacitor/preferences');

        const hasCompletedResult = await Preferences.get({ key: STORAGE_KEYS.HAS_COMPLETED });
        const answersResult = await Preferences.get({ key: STORAGE_KEYS.ANSWERS });
        const selectedPlanResult = await Preferences.get({ key: STORAGE_KEYS.SELECTED_PLAN });

        const hasCompleted = hasCompletedResult.value ? JSON.parse(hasCompletedResult.value) : false;
        const answers = answersResult.value ? JSON.parse(answersResult.value) : initialAnswers;
        const selectedPlan = selectedPlanResult.value ? JSON.parse(selectedPlanResult.value) : null;

        // Update the store with loaded data
        onboardingStore.updateState({
            hasCompletedOnboarding: hasCompleted,
            answers,
            selectedPlan
        });

        console.log('Onboarding state loaded from mobile storage');
    } catch (error) {
        console.error('Error loading onboarding state from mobile:', error);
        // Fallback to localStorage
        const hasCompleted = storage.get(STORAGE_KEYS.HAS_COMPLETED) || false;
        const answers = storage.get(STORAGE_KEYS.ANSWERS) || initialAnswers;
        const selectedPlan = storage.get(STORAGE_KEYS.SELECTED_PLAN) || null;

        console.log('Loaded onboarding state from localStorage fallback');
    }
};