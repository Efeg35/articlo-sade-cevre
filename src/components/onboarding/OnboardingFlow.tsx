import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';

// FULL PREMIUM COMPONENTS IMPORT - İLK İSTEDİĞİN GİBİ
import WelcomeScreen from './WelcomeScreen';
import FeatureSimplificationScreen from './FeatureSimplificationScreen';
import FeatureRiskDetectionScreen from './FeatureRiskDetectionScreen';
import FeatureActionPlanScreen from './FeatureActionPlanScreen';
import QuizUserContextScreen from './QuizUserContextScreen';
import QuizPainPointScreen from './QuizPainPointScreen';
import QuizDesiredOutcomeScreen from './QuizDesiredOutcomeScreen';
import QuizUsageFrequencyScreen from './QuizUsageFrequencyScreen';
import QuizValueLevelScreen from './QuizValueLevelScreen';
import PersonalizationScreen from './PersonalizationScreen';
import PaywallScreen from './PaywallScreen';
import SuccessConfetti from './SuccessConfetti';

// iOS-Safe Premium Integrations
import { useOnboardingStore, ONBOARDING_SCREENS } from '@/stores/onboardingStoreZustand';
import { usePlatform } from '@/hooks/usePlatform';
import welcomeAnimation from '@/assets/lottie/welcome-transformation.json';
import personalizationAnimation from '@/assets/lottie/personalization-loading.json';

interface OnboardingFlowProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
    console.log('[OnboardingFlow] FULL PREMIUM ONBOARDING FLOW - iOS Compatible - İLK İSTEDİĞİN GİBİ');

    // iOS-SAFE Zustand Store
    const {
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
        answers,
        setAnswer,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        canGoNext,
        canGoPrevious
    } = useOnboardingStore();

    // Platform Detection
    const { isNative, platform, canUseHaptics } = usePlatform();

    // React Hook Form for data collection
    const form = useForm({
        defaultValues: answers
    });

    // Premium Animation States
    const [showConfetti, setShowConfetti] = useState(false);
    const [lottieLoaded, setLottieLoaded] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Scroll Animation Hook
    const { ref: scrollRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    console.log('[OnboardingFlow] Full Premium State:', {
        currentStep,
        screenName: Object.keys(ONBOARDING_SCREENS)[currentStep],
        hasCompletedOnboarding,
        platform,
        isNative,
        answers,
        canGoNext: canGoNext(),
        canGoPrevious: canGoPrevious()
    });

    // SORU 5 DEBUG - valueLevel problemi için
    if (currentStep === ONBOARDING_SCREENS.QUIZ_VALUE_LEVEL) {
        console.log('🐛 [QUIZ VALUE LEVEL DEBUG]:', {
            currentStep,
            'answers.valueLevel': answers.valueLevel,
            'selectedAnswer': answers.valueLevel,
            'canGoNext': canGoNext(),
            'allAnswers': answers,
            'buttonShouldBeDisabled': !answers.valueLevel
        });
    }

    // Enhanced Step Navigation with Haptic Feedback - No Flash
    const handleNext = async () => {
        if (canUseHaptics) {
            try {
                const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
                await Haptics.impact({ style: ImpactStyle.Light });
            } catch (error) {
                console.log('[OnboardingFlow] Haptics not available');
            }
        }

        // Direct transition without loading screen
        nextStep();
    };

    const handlePrevious = () => {
        if (canGoPrevious()) {
            // Direct transition without loading screen
            previousStep();
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        } else {
            completeOnboarding();
            onComplete();
        }
    };

    // Answer Collection for Quiz Screens
    const handleQuizAnswer = (questionKey: keyof typeof answers, value: string) => {
        console.log(`[OnboardingFlow] Quiz answer: ${String(questionKey)} = ${value}`);
        setAnswer(questionKey, value);
        // Note: Store handles the conversion from string to enum type

        // Auto advance after selection
        setTimeout(() => {
            handleNext();
        }, 500);
    };

    // Complete onboarding with celebration
    const handleComplete = () => {
        console.log('[OnboardingFlow] FULL PREMIUM ONBOARDING COMPLETED!');
        setShowConfetti(true);
        completeOnboarding();

        // Celebration duration
        setTimeout(() => {
            setShowConfetti(false);
            onComplete();
        }, 4000);
    };

    // Reset onboarding for testing
    const handleReset = () => {
        console.log('[OnboardingFlow] Resetting full premium onboarding');
        resetOnboarding();
        form.reset();
        setLottieLoaded(0);
        setShowConfetti(false);
    };

    // Render Current Screen - TAM PREMİUM FLOW
    const renderCurrentScreen = () => {
        const commonProps = {
            onNext: handleNext,
            onPrevious: handlePrevious,
            onSkip: handleSkip,
            currentStep,
            totalSteps: 11
        };

        switch (currentStep) {
            case ONBOARDING_SCREENS.WELCOME:
                return <WelcomeScreen {...commonProps} />;

            case ONBOARDING_SCREENS.FEATURE_SIMPLIFICATION:
                return <FeatureSimplificationScreen {...commonProps} />;

            case ONBOARDING_SCREENS.FEATURE_RISK_DETECTION:
                return <FeatureRiskDetectionScreen {...commonProps} />;

            case ONBOARDING_SCREENS.FEATURE_ACTION_PLAN:
                return <FeatureActionPlanScreen {...commonProps} />;

            case ONBOARDING_SCREENS.QUIZ_USER_CONTEXT:
                return <QuizUserContextScreen {...commonProps} />;

            case ONBOARDING_SCREENS.QUIZ_PAIN_POINT:
                return <QuizPainPointScreen {...commonProps} />;

            case ONBOARDING_SCREENS.QUIZ_DESIRED_OUTCOME:
                return <QuizDesiredOutcomeScreen {...commonProps} />;

            case ONBOARDING_SCREENS.QUIZ_USAGE_FREQUENCY:
                return <QuizUsageFrequencyScreen {...commonProps} />;

            case ONBOARDING_SCREENS.QUIZ_VALUE_LEVEL:
                return <QuizValueLevelScreen {...commonProps} />;

            case ONBOARDING_SCREENS.PERSONALIZATION:
                return <PersonalizationScreen {...commonProps} />;

            case ONBOARDING_SCREENS.PAYWALL:
                return (
                    <PaywallScreen
                        {...commonProps}
                        onSelectPlan={(plan) => {
                            console.log('[OnboardingFlow] Plan selected:', plan);
                            handleComplete();
                        }}
                    />
                );

            default:
                return <WelcomeScreen {...commonProps} />;
        }
    };

    // Remove loading state - direct smooth transitions only

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            backgroundColor: '#ffffff',
            // Sadece kritik safe area'lar için minimal padding
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Success Confetti */}
            {showConfetti && (
                <SuccessConfetti
                    isActive={showConfetti}
                    onComplete={() => setShowConfetti(false)}
                    message="Premium Onboarding Tamamlandı! 🎉"
                />
            )}

            {/* Premium Debug Panel - Development Only */}
            {process.env.NODE_ENV === 'development' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        zIndex: 1000,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#33373B',
                        border: '1px solid #22C58B',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong style={{ color: '#22C58B' }}>FRIENDLY ONBOARDING - iOS-SAFE</strong>
                            <div>Screen: {Object.keys(ONBOARDING_SCREENS)[currentStep]} ({currentStep + 1}/11)</div>
                            <div>Platform: {platform} | Native: {isNative ? 'Yes' : 'No'} | Lottie: {lottieLoaded}/2</div>
                            <div>Answers: {Object.values(answers).filter(Boolean).length}/5 complete</div>
                        </div>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                backgroundColor: '#22C58B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Friendly Background Elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                pointerEvents: 'none',
                zIndex: 1
            }}>
                {/* Soft colored circles */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    right: '10%',
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#22C58B',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '15%',
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#FFD166',
                    borderRadius: '50%',
                    filter: 'blur(25px)'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#22C58B',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    transform: 'translate(-50%, -50%)'
                }} />
            </div>

            {/* Main Content with Scroll Animation */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 10,
                    transform: `translateY(${inView ? 0 : 15}px)`,
                    opacity: inView ? 1 : 0,
                    transition: 'all 0.4s ease-out'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut",
                            opacity: { duration: 0.2 }
                        }}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        {renderCurrentScreen()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar - Friendly Style */}
            <motion.div
                style={{
                    height: '6px',
                    backgroundColor: '#f3f4f6',
                    margin: '0 20px 20px 20px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #22C58B, #FFD166)',
                        borderRadius: '3px',
                        boxShadow: '0 0 10px rgba(34, 197, 139, 0.3)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / 11) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </motion.div>
        </div>
    );
};

export default OnboardingFlow;