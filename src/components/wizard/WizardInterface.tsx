import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    ArrowLeft,
    ArrowRight,
    X,
    CheckCircle,
    Clock,
    Sparkles,
    AlertTriangle,
    Scale,
    BookOpen
} from 'lucide-react';
import { WizardInterfaceProps, WizardState, WizardStepAnswers } from '@/types/wizard';
import { WizardProvider, useWizard } from './WizardContext';
import { ProgressBar, CompactProgressBar } from './ProgressBar';
import { WizardStep } from './WizardStep';
import { DocumentWarning } from '@/components/DocumentWarning';
import { LegalReferencePopup } from './LegalReferencePopup';
import { CourtAnalysisModal } from './CourtAnalysisModal';
import { wizardMcpIntegration, type WizardLegalReference } from '@/services/wizardMcpIntegration';
import { cn } from '@/lib/utils';

// Inner component that uses wizard context
const WizardInterfaceInner: React.FC<{
    onComplete: (state: WizardState) => void;
    onCancel: () => void;
    className?: string;
}> = ({ onComplete, onCancel, className }) => {
    const {
        state,
        template,
        currentStep,
        nextStep,
        previousStep,
        updateAnswers,
        canGoNext,
        canGoPrevious,
        completeWizard,
        validateCurrentStep
    } = useWizard();

    // 📚 FAZ 1: MCP Legal Context State
    const [legalContext, setLegalContext] = useState<{
        lawReferences: WizardLegalReference[];
        loading: boolean;
    }>({
        lawReferences: [],
        loading: false
    });

    // 📚 Load legal context when template changes
    useEffect(() => {
        if (!template) return;

        const loadLegalContext = async () => {
            setLegalContext(prev => ({ ...prev, loading: true }));

            try {
                // Mock template for MCP integration
                const mockTemplate = {
                    template_id: template.id,
                    template_name: template.name,
                    template_description: template.description,
                    category: 'Konut Hukuku' as const, // Template kategorisinden derive edilebilir
                    initial_questions: [],
                    questions: [],
                    metadata: {
                        version: '1.0.0',
                        complexity_level: 'BASIC' as const,
                        estimated_completion_time: 10,
                        legal_references: template.legalReferences || [],
                        created_date: new Date().toISOString(),
                        updated_date: new Date().toISOString()
                    },
                    output_config: {
                        default_format: 'PDF' as const,
                        supported_formats: ['PDF' as const]
                    }
                };

                const enrichedData = await wizardMcpIntegration.enrichTemplateWithLegalContext(
                    mockTemplate,
                    state.answers
                );

                setLegalContext({
                    lawReferences: enrichedData.legalContext?.lawReferences || [],
                    loading: false
                });

            } catch (error) {
                console.error('❌ Failed to load legal context:', error);
                setLegalContext({ lawReferences: [], loading: false });
            }
        };

        loadLegalContext();
    }, [template?.id]);

    // Handle answers update with stable callback to prevent infinite loops
    const handleUpdateAnswers = React.useCallback((answers: WizardStepAnswers) => {
        if (currentStep) {
            updateAnswers(currentStep.id, answers);
        }
    }, [updateAnswers, currentStep?.id]);

    // Handle completion
    const handleComplete = () => {
        completeWizard();
        onComplete(state);
    };

    // Handle step navigation
    const handleNext = () => {
        if (state.currentStepIndex === state.totalSteps - 1) {
            // Last step - complete wizard
            handleComplete();
        } else {
            nextStep();
        }
    };

    if (!template || !currentStep) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Wizard template yüklenemedi</p>
                </div>
            </div>
        );
    }

    const isLastStep = state.currentStepIndex === state.totalSteps - 1;
    const currentAnswers = state.answers[currentStep.id] || {};

    return (
        <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
            {/* Header */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-purple-600" />
                                <h1 className="text-2xl font-bold text-foreground">
                                    {template.name}
                                </h1>
                                {template.premium && (
                                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                        PRO
                                    </Badge>
                                )}
                            </div>

                            <p className="text-muted-foreground max-w-2xl">
                                {template.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {template.estimatedTime}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs">
                                        {template.difficulty.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCancel}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    {/* Mobile: Compact progress bar */}
                    <div className="md:hidden mb-4">
                        <CompactProgressBar
                            current={state.currentStepIndex + 1}
                            total={state.totalSteps}
                        />
                    </div>

                    {/* Desktop: Full progress bar */}
                    <div className="hidden md:block">
                        <ProgressBar
                            current={state.currentStepIndex + 1}
                            total={state.totalSteps}
                            showLabels={state.totalSteps <= 8}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 📚 FAZ 1: Hukuki Referanslar Sidebar (Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Ana İçerik */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Current Step */}
                    <WizardStep
                        step={currentStep}
                        answers={currentAnswers}
                        onUpdateAnswers={handleUpdateAnswers}
                    />

                    {/* Legal Warning for high-risk templates */}
                    {(template.category === 'legal' || currentStep.id.includes('legal')) && (
                        <DocumentWarning
                            documentType={template.name}
                            riskLevel="medium"
                            variant="inline"
                        />
                    )}
                </div>

                {/* 📚 FAZ 1: Hukuki Referanslar Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Scale className="h-4 w-4 text-blue-600" />
                                <h3 className="text-sm font-medium">Hukuki Referanslar</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {legalContext.loading ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                                    Yükleniyor...
                                </div>
                            ) : legalContext.lawReferences.length > 0 ? (
                                legalContext.lawReferences.slice(0, 5).map((law) => (
                                    <LegalReferencePopup
                                        key={law.id}
                                        reference={law.legalReference || 'Hukuki Referans'}
                                        searchTerm={law.title}
                                        className="w-full justify-start text-left text-xs p-2"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-left text-xs p-2 h-auto"
                                        >
                                            <BookOpen className="h-3 w-3 mr-1" />
                                            <div className="text-left">
                                                <div className="font-medium line-clamp-2">
                                                    {law.legalReference}
                                                </div>
                                                <div className="text-muted-foreground text-xs line-clamp-1 mt-1">
                                                    {law.title}
                                                </div>
                                            </div>
                                        </Button>
                                    </LegalReferencePopup>
                                ))
                            ) : (
                                <div className="text-xs text-muted-foreground text-center py-4">
                                    Bu template için hukuki referans bulunamadı
                                </div>
                            )}

                            {/* Template'e özel sabit referanslar */}
                            {template.legalReferences && template.legalReferences.map((ref, index) => (
                                <LegalReferencePopup
                                    key={`template-ref-${index}`}
                                    reference={ref}
                                    className="w-full justify-start text-left text-xs p-2"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start text-left text-xs p-2 h-auto"
                                    >
                                        <Scale className="h-3 w-3 mr-1" />
                                        {ref}
                                    </Button>
                                </LegalReferencePopup>
                            ))}

                            {/* ⚖️ FAZ 2: "Mahkemeler Ne Diyor?" Analiz Butonu */}
                            <div className="pt-3 border-t">
                                <CourtAnalysisModal
                                    clause={template.category}
                                    userContext={state.answers}
                                >
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full justify-center gap-2 text-xs"
                                    >
                                        <BookOpen className="h-3 w-3" />
                                        Mahkemeler Ne Diyor?
                                    </Button>
                                </CourtAnalysisModal>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <Card className="border shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        {/* Previous button */}
                        <Button
                            variant="outline"
                            onClick={previousStep}
                            disabled={!canGoPrevious}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Önceki
                        </Button>

                        {/* Step info */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Adım {state.currentStepIndex + 1} / {state.totalSteps}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isLastStep ? 'Son adım' : 'Devam edin'}
                            </p>
                        </div>

                        {/* Next/Complete button */}
                        <Button
                            onClick={handleNext}
                            disabled={!validateCurrentStep()}
                            className="flex items-center gap-2"
                        >
                            {isLastStep ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Tamamla
                                </>
                            ) : (
                                <>
                                    Sonraki
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Validation message */}
                    {!validateCurrentStep() && (
                        <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Devam etmek için lütfen tüm gerekli alanları doldurun.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Debug info (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="border border-dashed border-muted">
                    <CardContent className="p-4">
                        <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer">Debug Info</summary>
                            <pre className="mt-2 text-xs">
                                {JSON.stringify({
                                    currentStep: state.currentStepIndex,
                                    totalSteps: state.totalSteps,
                                    canGoNext,
                                    canGoPrevious,
                                    isValid: validateCurrentStep(),
                                    answers: currentAnswers
                                }, null, 2)}
                            </pre>
                        </details>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

// Main component with provider
export const WizardInterface: React.FC<WizardInterfaceProps> = ({
    template,
    onComplete,
    onCancel,
    className
}) => {
    return (
        <WizardProvider template={template}>
            <WizardInterfaceInner
                onComplete={onComplete}
                onCancel={onCancel}
                className={className}
            />
        </WizardProvider>
    );
};

export default WizardInterface;