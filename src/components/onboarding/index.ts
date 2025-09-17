// Main Onboarding Flow with Modern Zustand Store Integration
export { default as OnboardingFlow } from './OnboardingFlow';

// Introduction Screens
export { default as WelcomeScreen } from './WelcomeScreen';
export { default as FeatureSimplificationScreen } from './FeatureSimplificationScreen';
export { default as FeatureRiskDetectionScreen } from './FeatureRiskDetectionScreen';
export { default as FeatureActionPlanScreen } from './FeatureActionPlanScreen';

// Quiz Screens
export { default as QuizUserContextScreen } from './QuizUserContextScreen';
export { default as QuizPainPointScreen } from './QuizPainPointScreen';
export { default as QuizDesiredOutcomeScreen } from './QuizDesiredOutcomeScreen';
export { default as QuizUsageFrequencyScreen } from './QuizUsageFrequencyScreen';
export { default as QuizValueLevelScreen } from './QuizValueLevelScreen';

// Finale Screens
export { default as PersonalizationScreen } from './PersonalizationScreen';
export { default as PaywallScreen } from './PaywallScreen';

// Success Components
export { default as SuccessConfetti } from './SuccessConfetti';
export { default as PremiumFeaturesDemo } from './PremiumFeaturesDemo';

// Modern Zustand Store - Primary Export
export {
    useOnboardingStore,
    ONBOARDING_SCREENS,
    getScreenMetadata,
    trackOnboardingEvent,
    persistOnboardingStateToMobile,
    loadOnboardingStateFromMobile,
    subscribeToStep,
    subscribeToAnswers
} from '../../stores/onboardingStoreZustand';

// Legacy Store Export (for backwards compatibility during migration)
export * from '../../stores/onboardingStore';

// Types
export type {
    OnboardingScreen
} from '../../stores/onboardingStoreZustand';

// Legacy Types (for backwards compatibility)
export type {
    OnboardingScreen as LegacyOnboardingScreen
} from '../../stores/onboardingStore';