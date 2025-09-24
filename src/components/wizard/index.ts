// Wizard Framework - Main Exports
export { WizardProvider, useWizard } from './WizardContext';
export { WizardInterface } from './WizardInterface';
export { WizardStep } from './WizardStep';
export { ProgressBar, CompactProgressBar } from './ProgressBar';
export { TemplateSelector } from './TemplateSelector';
export { LegalReferencePopup } from './LegalReferencePopup';
export { RealTimeRiskWarning } from './RealTimeRiskWarning';
export { CourtAnalysisModal } from './CourtAnalysisModal';

// Re-export types for convenience
export type {
    WizardTemplate,
    WizardStep as WizardStepType,
    WizardField,
    WizardState,
    WizardAnswers,
    WizardStepAnswers,
    WizardContextType,
    WizardInterfaceProps,
    WizardStepProps,
    ProgressBarProps,
    WizardInputType,
    WizardCategory,
    WizardEvent
} from '@/types/wizard';

export { WIZARD_CATEGORIES } from '@/types/wizard';