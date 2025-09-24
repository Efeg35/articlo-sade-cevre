import { ReactNode } from 'react';
import { z } from 'zod';

// Wizard step validation için Zod schema
export type WizardStepSchema = z.ZodSchema<Record<string, unknown>>;

// Form input türleri
export type WizardInputType =
    | 'text'
    | 'textarea'
    | 'email'
    | 'tel'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'number';

// Form field tanımı
export interface WizardField {
    id: string;
    type: WizardInputType;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[]; // select/radio için
    helpText?: string;
    validation?: WizardStepSchema;
}

// Wizard step tanımı
export interface WizardStep {
    id: string;
    title: string;
    description?: string;
    fields: WizardField[];
    validation: WizardStepSchema;
    conditional?: (answers: WizardAnswers) => boolean; // Bu step gösterilmeli mi?
}

// Wizard template tanımı
export interface WizardTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    estimatedTime: string; // "~10 dakika"
    difficulty: 'kolay' | 'orta' | 'zor';
    tags: string[];
    steps: WizardStep[];
    documentTemplate?: string; // Handlebars template
    premium: boolean;
    legalReferences?: string[]; // 📚 FAZ 1: Hukuki referanslar (TBK m.299, İŞK m.17 vs.)
}

// Wizard step answers
export interface WizardStepAnswers {
    [fieldId: string]: string | string[] | number | boolean | Date | null;
}

// Wizard state
export interface WizardAnswers {
    [stepId: string]: WizardStepAnswers;
}

export interface WizardState {
    templateId: string;
    currentStepIndex: number;
    totalSteps: number;
    answers: WizardAnswers;
    isComplete: boolean;
    startedAt: Date;
    completedAt?: Date;
}

// Wizard context
export interface WizardContextType {
    state: WizardState;
    template: WizardTemplate | null;
    currentStep: WizardStep | null;

    // Actions
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (stepIndex: number) => void;
    updateAnswers: (stepId: string, answers: WizardStepAnswers) => void;
    resetWizard: () => void;
    completeWizard: () => void;

    // Validations
    validateCurrentStep: () => boolean;
    canGoNext: boolean;
    canGoPrevious: boolean;
}

// Component props
export interface WizardInterfaceProps {
    template: WizardTemplate;
    onComplete: (state: WizardState) => void;
    onCancel: () => void;
    className?: string;
}

export interface WizardStepProps {
    step: WizardStep;
    answers: WizardStepAnswers;
    onUpdateAnswers: (answers: WizardStepAnswers) => void;
    errors?: Record<string, string>;
}

export interface ProgressBarProps {
    current: number;
    total: number;
    showLabels?: boolean;
    className?: string;
}

// Template categories
export const WIZARD_CATEGORIES = {
    EMPLOYMENT: 'employment',
    RENTAL: 'rental',
    LEGAL: 'legal',
    CONSUMER: 'consumer',
    FAMILY: 'family',
} as const;

export type WizardCategory = typeof WIZARD_CATEGORIES[keyof typeof WIZARD_CATEGORIES];

// Wizard events (analytics için)
export interface WizardEvent {
    type: 'step_started' | 'step_completed' | 'wizard_completed' | 'wizard_abandoned';
    templateId: string;
    stepId?: string;
    stepIndex?: number;
    timestamp: Date;
    duration?: number; // ms
}