import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    WizardState,
    WizardTemplate,
    WizardStep,
    WizardContextType,
    WizardAnswers,
    WizardStepAnswers
} from '@/types/wizard';

// Wizard actions
type WizardAction =
    | { type: 'INITIALIZE_WIZARD'; template: WizardTemplate }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'GO_TO_STEP'; stepIndex: number }
    | { type: 'UPDATE_ANSWERS'; stepId: string; answers: WizardStepAnswers }
    | { type: 'RESET_WIZARD' }
    | { type: 'COMPLETE_WIZARD' };

// Initial state
const initialState: WizardState = {
    templateId: '',
    currentStepIndex: 0,
    totalSteps: 0,
    answers: {},
    isComplete: false,
    startedAt: new Date(),
};

// Wizard reducer
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'INITIALIZE_WIZARD':
            return {
                ...initialState,
                templateId: action.template.id,
                totalSteps: action.template.steps.length,
                startedAt: new Date(),
            };

        case 'NEXT_STEP':
            if (state.currentStepIndex < state.totalSteps - 1) {
                return {
                    ...state,
                    currentStepIndex: state.currentStepIndex + 1,
                };
            }
            return state;

        case 'PREVIOUS_STEP':
            if (state.currentStepIndex > 0) {
                return {
                    ...state,
                    currentStepIndex: state.currentStepIndex - 1,
                };
            }
            return state;

        case 'GO_TO_STEP':
            if (action.stepIndex >= 0 && action.stepIndex < state.totalSteps) {
                return {
                    ...state,
                    currentStepIndex: action.stepIndex,
                };
            }
            return state;

        case 'UPDATE_ANSWERS':
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.stepId]: action.answers,
                },
            };

        case 'RESET_WIZARD':
            return {
                ...initialState,
                templateId: state.templateId,
                totalSteps: state.totalSteps,
                startedAt: new Date(),
            };

        case 'COMPLETE_WIZARD':
            return {
                ...state,
                isComplete: true,
                completedAt: new Date(),
            };

        default:
            return state;
    }
}

// Context
const WizardContext = createContext<WizardContextType | null>(null);

// Provider props
interface WizardProviderProps {
    children: ReactNode;
    template: WizardTemplate | null;
}

// Provider component
export function WizardProvider({ children, template }: WizardProviderProps) {
    const [state, dispatch] = useReducer(wizardReducer, initialState);

    // Initialize wizard when template changes
    React.useEffect(() => {
        if (template) {
            dispatch({ type: 'INITIALIZE_WIZARD', template });
        }
    }, [template]);

    // Get current step
    const currentStep: WizardStep | null = React.useMemo(() => {
        if (!template || state.currentStepIndex >= template.steps.length) {
            return null;
        }
        return template.steps[state.currentStepIndex];
    }, [template, state.currentStepIndex]);

    // Validation helper
    const validateCurrentStep = React.useCallback((): boolean => {
        if (!currentStep) return false;

        const stepAnswers = state.answers[currentStep.id] || {};

        try {
            currentStep.validation.parse(stepAnswers);
            return true;
        } catch (error) {
            return false;
        }
    }, [currentStep, state.answers]);

    // Can go next/previous
    const canGoNext = React.useMemo(() => {
        return state.currentStepIndex < state.totalSteps - 1 && validateCurrentStep();
    }, [state.currentStepIndex, state.totalSteps, validateCurrentStep]);

    const canGoPrevious = React.useMemo(() => {
        return state.currentStepIndex > 0;
    }, [state.currentStepIndex]);

    // Actions
    const nextStep = React.useCallback(() => {
        if (canGoNext) {
            dispatch({ type: 'NEXT_STEP' });
        }
    }, [canGoNext]);

    const previousStep = React.useCallback(() => {
        if (canGoPrevious) {
            dispatch({ type: 'PREVIOUS_STEP' });
        }
    }, [canGoPrevious]);

    const goToStep = React.useCallback((stepIndex: number) => {
        dispatch({ type: 'GO_TO_STEP', stepIndex });
    }, []);

    const updateAnswers = React.useCallback((stepId: string, answers: WizardStepAnswers) => {
        dispatch({ type: 'UPDATE_ANSWERS', stepId, answers });
    }, []); // Empty deps - dispatch is stable

    const resetWizard = React.useCallback(() => {
        dispatch({ type: 'RESET_WIZARD' });
    }, []);

    const completeWizard = React.useCallback(() => {
        dispatch({ type: 'COMPLETE_WIZARD' });
    }, []);

    const contextValue: WizardContextType = {
        state,
        template,
        currentStep,
        nextStep,
        previousStep,
        goToStep,
        updateAnswers,
        resetWizard,
        completeWizard,
        validateCurrentStep,
        canGoNext,
        canGoPrevious,
    };

    return (
        <WizardContext.Provider value={contextValue}>
            {children}
        </WizardContext.Provider>
    );
}

// Custom hook
export function useWizard(): WizardContextType {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}