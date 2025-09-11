import { useState, useCallback } from 'react';
import { DashboardState, View, AnalysisResponse, Entity, LoadingState, NativeFile } from '../types';

export interface DashboardStateHook extends DashboardState {
    // Text input actions
    setOriginalText: (text: string) => void;

    // File upload actions
    setSelectedFiles: (files: File[]) => void;
    clearSelectedFiles: () => void;
    removeSelectedFile: (index: number) => void;

    // Analysis actions
    setAnalysisResult: (result: AnalysisResponse | null) => void;
    setLoading: (loading: LoadingState) => void;

    // Legacy actions (for backwards compatibility)
    setSimplifiedText: (text: string) => void;
    setSummary: (text: string) => void;
    setActionPlan: (text: string) => void;
    setEntities: (entities: Entity[]) => void;

    // View actions
    setView: (view: View) => void;

    // Validation actions
    setValidationErrors: (errors: Record<string, string>) => void;
    clearValidationErrors: () => void;

    // Modal actions
    setIsProModalOpen: (open: boolean) => void;
    setShowTip: (show: boolean) => void;
    setShowOnboarding: (show: boolean) => void;
    setProfileId: (id: string | null) => void;

    // Document drafting actions
    setDraftedText: (text: string) => void;
    setIsModalOpen: (open: boolean) => void;
    setEditMode: (edit: boolean) => void;

    // Credits actions
    setCredits: (credits: number | null) => void;

    // Reset actions
    resetForm: () => void;
    resetAll: () => void;
}

const initialState: DashboardState = {
    // Form state
    originalText: '',
    selectedFiles: [],

    // Analysis results
    analysisResult: null,
    loading: null,

    // Legacy states for backwards compatibility
    simplifiedText: '',
    summary: '',
    actionPlan: '',
    entities: [],

    // UI state
    view: 'input',
    validationErrors: {},

    // Modal states
    isProModalOpen: false,
    showTip: false,
    showOnboarding: false,
    profileId: null,

    // Document drafting
    draftedText: '',
    isModalOpen: false,
    editMode: false,

    // Credits
    credits: 999,

    // Error states (these will be managed by useErrorHandling)
    criticalError: null,
    apiFallbackMode: false,
    nativeFeatureFallback: false,
    isRecovering: false,
};

export function useDashboardState(): DashboardStateHook {
    // Form state
    const [originalText, setOriginalText] = useState(initialState.originalText);
    const [selectedFiles, setSelectedFiles] = useState<File[]>(initialState.selectedFiles);

    // Analysis results
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(initialState.analysisResult);
    const [loading, setLoading] = useState<LoadingState>(initialState.loading);

    // Legacy states for backwards compatibility
    const [simplifiedText, setSimplifiedText] = useState(initialState.simplifiedText);
    const [summary, setSummary] = useState(initialState.summary);
    const [actionPlan, setActionPlan] = useState(initialState.actionPlan);
    const [entities, setEntities] = useState<Entity[]>(initialState.entities);

    // UI state
    const [view, setView] = useState<View>(initialState.view);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>(initialState.validationErrors);

    // Modal states
    const [isProModalOpen, setIsProModalOpen] = useState(initialState.isProModalOpen);
    const [showTip, setShowTip] = useState(initialState.showTip);
    const [showOnboarding, setShowOnboarding] = useState(initialState.showOnboarding);
    const [profileId, setProfileId] = useState<string | null>(initialState.profileId);

    // Document drafting
    const [draftedText, setDraftedText] = useState(initialState.draftedText);
    const [isModalOpen, setIsModalOpen] = useState(initialState.isModalOpen);
    const [editMode, setEditMode] = useState(initialState.editMode);

    // Credits
    const [credits, setCredits] = useState<number | null>(initialState.credits);

    // Error states (placeholder - will be overridden by useErrorHandling)
    const [criticalError] = useState<string | null>(initialState.criticalError);
    const [apiFallbackMode] = useState(initialState.apiFallbackMode);
    const [nativeFeatureFallback] = useState(initialState.nativeFeatureFallback);
    const [isRecovering] = useState(initialState.isRecovering);

    // File actions
    const clearSelectedFiles = useCallback(() => {
        setSelectedFiles([]);
    }, []);

    const removeSelectedFile = useCallback((index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Validation actions
    const clearValidationErrors = useCallback(() => {
        setValidationErrors({});
    }, []);

    // Reset actions
    const resetForm = useCallback(() => {
        setOriginalText('');
        setSelectedFiles([]);
        setAnalysisResult(null);
        setSimplifiedText('');
        setSummary('');
        setActionPlan('');
        setEntities([]);
        setView('input');
        setValidationErrors({});
        setDraftedText('');
        setIsModalOpen(false);
        setEditMode(false);
    }, []);

    const resetAll = useCallback(() => {
        // Reset form
        resetForm();

        // Reset modals
        setIsProModalOpen(false);
        setShowTip(false);
        setShowOnboarding(false);
        setProfileId(null);

        // Reset loading
        setLoading(null);
    }, [resetForm]);

    return {
        // State
        originalText,
        selectedFiles,
        analysisResult,
        loading,
        simplifiedText,
        summary,
        actionPlan,
        entities,
        view,
        validationErrors,
        isProModalOpen,
        showTip,
        showOnboarding,
        profileId,
        draftedText,
        isModalOpen,
        editMode,
        credits,
        criticalError,
        apiFallbackMode,
        nativeFeatureFallback,
        isRecovering,

        // Actions
        setOriginalText,
        setSelectedFiles,
        clearSelectedFiles,
        removeSelectedFile,
        setAnalysisResult,
        setLoading,
        setSimplifiedText,
        setSummary,
        setActionPlan,
        setEntities,
        setView,
        setValidationErrors,
        clearValidationErrors,
        setIsProModalOpen,
        setShowTip,
        setShowOnboarding,
        setProfileId,
        setDraftedText,
        setIsModalOpen,
        setEditMode,
        setCredits,
        resetForm,
        resetAll,
    };
}