import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    ArrowRight,
    X,
    CheckCircle,
    Clock,
    Sparkles,
    AlertTriangle,
    Scale,
    BookOpen,
    Loader2,
    Zap,
    Activity
} from 'lucide-react';
import { WizardInterfaceProps, WizardState, WizardStepAnswers } from '@/types/wizard';
import { WizardProvider, useWizard } from './WizardContext';
import { ProgressBar, CompactProgressBar } from './ProgressBar';
import { WizardStep } from './WizardStep';
import { DocumentWarning } from '@/components/DocumentWarning';
import { LegalReferencePopup } from './LegalReferencePopup';
import { CourtAnalysisModal } from './CourtAnalysisModal';
import { RealTimeLegalSuggestions } from './RealTimeLegalSuggestions';
import { wizardMcpIntegration, type WizardLegalReference } from '@/services/wizardMcpIntegration';
import { cn } from '@/lib/utils';

// FAZ B: Performance monitoring
interface PerformanceMetrics {
    stepLoadTime: number;
    mcpResponseTime: number;
    lastInteraction: Date;
    errorCount: number;
}

// FAZ B: Enhanced Error Boundary
class WizardErrorBoundary extends React.Component<
    { children: React.ReactNode; onError?: (error: Error) => void },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🚨 Wizard Error:', error, errorInfo);
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-900">Wizard Hatası</h3>
                                <p className="text-red-700 mt-2">Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => window.location.reload()}
                                >
                                    Sayfayı Yenile
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}

// FAZ B: Optimized Inner component with performance monitoring
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

    // 📚 FAZ B: Enhanced MCP Legal Context State with performance tracking
    const [legalContext, setLegalContext] = useState<{
        lawReferences: WizardLegalReference[];
        loading: boolean;
        lastFetch: Date | null;
        cacheValid: boolean;
    }>({
        lawReferences: [],
        loading: false,
        lastFetch: null,
        cacheValid: false
    });

    // FAZ B: Performance metrics
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
        stepLoadTime: 0,
        mcpResponseTime: 0,
        lastInteraction: new Date(),
        errorCount: 0
    });

    // FAZ B: Transition state for smooth animations
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward' | null>(null);

    // 📚 FAZ B: Optimized legal context loading with caching and performance tracking
    const loadLegalContext = useCallback(async (forceReload = false) => {
        if (!template) return;

        // Cache validation
        const now = new Date();
        const cacheAge = legalContext.lastFetch
            ? now.getTime() - legalContext.lastFetch.getTime()
            : Infinity;

        // Use cache if valid and not forcing reload (cache valid for 5 minutes)
        if (legalContext.cacheValid && cacheAge < 300000 && !forceReload) {
            console.log('🎯 Using cached legal context');
            return;
        }

        setLegalContext(prev => ({ ...prev, loading: true }));
        const startTime = performance.now();

        try {
            console.log('🔄 Loading legal context for template:', template.name);

            // Mock template for MCP integration
            const mockTemplate = {
                template_id: template.id,
                template_name: template.name,
                template_description: template.description,
                category: 'Konut Hukuku' as const,
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

            const endTime = performance.now();
            const responseTime = endTime - startTime;

            setLegalContext({
                lawReferences: enrichedData.legalContext?.lawReferences || [],
                loading: false,
                lastFetch: now,
                cacheValid: true
            });

            // Update performance metrics
            setPerformanceMetrics(prev => ({
                ...prev,
                mcpResponseTime: responseTime,
                lastInteraction: now
            }));

            console.log(`✅ Legal context loaded in ${responseTime.toFixed(2)}ms`);

        } catch (error) {
            console.error('❌ Failed to load legal context:', error);
            setLegalContext(prev => ({
                ...prev,
                loading: false,
                lastFetch: now,
                cacheValid: false
            }));

            // Increment error count
            setPerformanceMetrics(prev => ({
                ...prev,
                errorCount: prev.errorCount + 1,
                lastInteraction: now
            }));
        }
    }, [template, state.answers, legalContext.lastFetch, legalContext.cacheValid]);

    // Load legal context when template changes
    useEffect(() => {
        loadLegalContext();
    }, [template?.id, loadLegalContext]);

    // FAZ B: Optimized handlers with performance tracking and smooth transitions
    const handleUpdateAnswers = useCallback((answers: WizardStepAnswers) => {
        if (currentStep) {
            const startTime = performance.now();
            updateAnswers(currentStep.id, answers);

            // Track interaction
            setPerformanceMetrics(prev => ({
                ...prev,
                lastInteraction: new Date()
            }));

            console.log(`📝 Answers updated for step ${currentStep.id} in ${(performance.now() - startTime).toFixed(2)}ms`);
        }
    }, [updateAnswers, currentStep?.id]);

    // Handle completion with performance summary
    const handleComplete = useCallback(() => {
        console.log('🎯 Wizard completion metrics:', {
            totalSteps: state.totalSteps,
            totalErrors: performanceMetrics.errorCount,
            avgMcpResponseTime: performanceMetrics.mcpResponseTime
        });

        completeWizard();
        onComplete(state);
    }, [completeWizard, onComplete, state, performanceMetrics]);

    // FAZ B: Enhanced step navigation with smooth transitions
    const handleNext = useCallback(async () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTransitionDirection('forward');

        const stepStartTime = performance.now();

        try {
            if (state.currentStepIndex === state.totalSteps - 1) {
                // Last step - complete wizard
                handleComplete();
            } else {
                nextStep();

                // Preload legal context for next step if needed
                if (state.currentStepIndex < state.totalSteps - 2) {
                    // Don't wait for this, run in background
                    loadLegalContext(false);
                }
            }

            const stepEndTime = performance.now();
            setPerformanceMetrics(prev => ({
                ...prev,
                stepLoadTime: stepEndTime - stepStartTime,
                lastInteraction: new Date()
            }));

        } finally {
            // Smooth transition delay
            setTimeout(() => {
                setIsTransitioning(false);
                setTransitionDirection(null);
            }, 300);
        }
    }, [isTransitioning, state.currentStepIndex, state.totalSteps, handleComplete, nextStep, loadLegalContext]);

    const handlePrevious = useCallback(async () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTransitionDirection('backward');

        try {
            previousStep();
        } finally {
            setTimeout(() => {
                setIsTransitioning(false);
                setTransitionDirection(null);
            }, 300);
        }
    }, [isTransitioning, previousStep]);

    // FAZ B: Memoized computed values for better performance
    const computedValues = useMemo(() => {
        if (!template || !currentStep) return null;

        return {
            isLastStep: state.currentStepIndex === state.totalSteps - 1,
            currentAnswers: state.answers[currentStep.id] || {},
            progressPercentage: ((state.currentStepIndex + 1) / state.totalSteps) * 100,
            canProceed: validateCurrentStep() && !isTransitioning
        };
    }, [template, currentStep, state.currentStepIndex, state.totalSteps, state.answers, validateCurrentStep, isTransitioning]);

    // Loading skeleton for template
    if (!template || !currentStep) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-2 border-dashed">
                    <CardContent className="pt-8 pb-8">
                        <div className="flex items-center justify-center space-y-4">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48 mx-auto" />
                                    <Skeleton className="h-4 w-64 mx-auto" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!computedValues) return null;

    const { isLastStep, currentAnswers, progressPercentage, canProceed } = computedValues;

    return (
        <WizardErrorBoundary onError={(error) => {
            setPerformanceMetrics(prev => ({
                ...prev,
                errorCount: prev.errorCount + 1
            }));
        }}>
            <div className={cn(
                "max-w-4xl mx-auto space-y-6 transition-all duration-300",
                isTransitioning && "opacity-95 scale-[0.99]",
                className
            )}>
                {/* FAZ B: Enhanced Header with performance indicators */}
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 relative overflow-hidden">
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

                {/* 📚 FAZ B: Enhanced Layout with Live MCP Data */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Ana İçerik */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Current Step */}
                        <WizardStep
                            step={currentStep}
                            answers={currentAnswers}
                            onUpdateAnswers={handleUpdateAnswers}
                        />

                        {/* ✨ FAZ B: Real-Time Legal Suggestions (Mobile) */}
                        <div className="lg:hidden">
                            <RealTimeLegalSuggestions
                                templateId={template.id}
                                currentStep={state.currentStepIndex}
                                currentAnswers={state.answers}
                                templateCategory={template.category}
                                compact={true}
                                className="mb-4"
                                onSuggestionClick={(suggestion) => {
                                    console.log('📱 Mobile suggestion clicked:', suggestion.title);
                                }}
                            />
                        </div>

                        {/* Legal Warning for high-risk templates */}
                        {(template.category === 'legal' || currentStep.id.includes('legal')) && (
                            <DocumentWarning
                                documentType={template.name}
                                riskLevel="medium"
                                variant="inline"
                            />
                        )}
                    </div>

                    {/* 📚 FAZ B: Enhanced Sidebar with Real-Time Suggestions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-4">
                            {/* ✨ FAZ B: Real-Time Legal Suggestions (Desktop) */}
                            <div className="hidden lg:block">
                                <RealTimeLegalSuggestions
                                    templateId={template.id}
                                    currentStep={state.currentStepIndex}
                                    currentAnswers={state.answers}
                                    templateCategory={template.category}
                                    compact={true}
                                    onSuggestionClick={(suggestion) => {
                                        console.log('💻 Desktop suggestion clicked:', suggestion.title);
                                    }}
                                />
                            </div>

                            {/* 📚 Hukuki Referanslar Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-4 w-4 text-blue-600" />
                                        <h3 className="text-sm font-medium">Hukuki Referanslar</h3>
                                        {legalContext.lawReferences.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {legalContext.lawReferences.length}
                                            </Badge>
                                        )}
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

                                    {/* ⚖️ FAZ B: Enhanced "Mahkemeler Ne Diyor?" Analiz Butonu */}
                                    <div className="pt-3 border-t">
                                        <CourtAnalysisModal
                                            clause={template.category}
                                            userContext={state.answers}
                                        >
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-full justify-center gap-2 text-xs hover:bg-purple-100 transition-colors"
                                            >
                                                <BookOpen className="h-3 w-3" />
                                                Mahkemeler Ne Diyor?
                                            </Button>
                                        </CourtAnalysisModal>
                                    </div>

                                    {/* 📊 FAZ B: Live Data Status */}
                                    <div className="pt-2 text-center">
                                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Canlı MCP Verileri
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation */}
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            {/* FAZ B: Enhanced Navigation with loading states */}
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={!canGoPrevious || isTransitioning}
                                className="flex items-center gap-2 transition-all duration-200"
                            >
                                {isTransitioning && transitionDirection === 'backward' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowLeft className="h-4 w-4" />
                                )}
                                Önceki
                            </Button>

                            {/* Enhanced Step info with progress */}
                            <div className="text-center space-y-1">
                                <div className="flex items-center gap-2 justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        Adım {state.currentStepIndex + 1} / {state.totalSteps}
                                    </p>
                                    <Badge variant="outline" className="text-xs px-2 py-0">
                                        {progressPercentage.toFixed(0)}%
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {isLastStep ? 'Son adım - tamamlamaya hazır' : 'Devam edin'}
                                </p>

                                {/* FAZ B: Performance indicator */}
                                {performanceMetrics.errorCount === 0 && (
                                    <div className="flex items-center gap-1 justify-center text-xs text-green-600">
                                        <Activity className="h-3 w-3" />
                                        Sorunsuz çalışıyor
                                    </div>
                                )}
                            </div>

                            {/* FAZ B: Enhanced Next/Complete button */}
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={cn(
                                    "flex items-center gap-2 transition-all duration-200",
                                    canProceed && "hover:scale-105",
                                    !canProceed && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isTransitioning && transitionDirection === 'forward' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isLastStep ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                )}
                                {isLastStep ? 'Tamamla' : 'Sonraki'}
                            </Button>
                        </div>

                        {/* FAZ B: Enhanced Validation message with specific guidance */}
                        {!canProceed && !isTransitioning && (
                            <Alert className="mt-4 border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                    <div className="space-y-1">
                                        <p className="font-medium">Devam etmek için:</p>
                                        <p className="text-sm">Lütfen tüm gerekli alanları doldurun ve form validasyonunu tamamlayın.</p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* FAZ B: Enhanced Debug info with performance metrics */}
                {process.env.NODE_ENV === 'development' && (
                    <Card className="border border-dashed border-muted">
                        <CardContent className="p-4">
                            <details className="text-xs text-muted-foreground">
                                <summary className="cursor-pointer flex items-center gap-2">
                                    <Zap className="h-3 w-3" />
                                    Debug & Performance Info
                                </summary>
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <p className="font-medium mb-1">Performance Metrics:</p>
                                        <pre className="text-xs bg-gray-100 p-2 rounded">
                                            {JSON.stringify({
                                                stepLoadTime: `${performanceMetrics.stepLoadTime.toFixed(2)}ms`,
                                                mcpResponseTime: `${performanceMetrics.mcpResponseTime.toFixed(2)}ms`,
                                                errorCount: performanceMetrics.errorCount,
                                                lastInteraction: performanceMetrics.lastInteraction.toLocaleTimeString()
                                            }, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">Wizard State:</p>
                                        <pre className="text-xs bg-gray-100 p-2 rounded">
                                            {JSON.stringify({
                                                currentStep: state.currentStepIndex,
                                                totalSteps: state.totalSteps,
                                                canGoNext,
                                                canGoPrevious,
                                                isValid: validateCurrentStep(),
                                                isTransitioning,
                                                cacheValid: legalContext.cacheValid,
                                                answersCount: Object.keys(currentAnswers).length
                                            }, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </details>
                        </CardContent>
                    </Card>
                )}
            </div>
        </WizardErrorBoundary>
    );
};

// FAZ B: Main component with Suspense for better loading experience
export const WizardInterface: React.FC<WizardInterfaceProps> = ({
    template,
    onComplete,
    onCancel,
    className
}) => {
    return (
        <WizardProvider template={template}>
            <Suspense fallback={
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="border-2 border-purple-200">
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">Wizard Hazırlanıyor...</p>
                                    <p className="text-sm text-muted-foreground">
                                        MCP entegrasyonu ve hukuki veriler yükleniyor
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }>
                <WizardInterfaceInner
                    onComplete={onComplete}
                    onCancel={onCancel}
                    className={className}
                />
            </Suspense>
        </WizardProvider>
    );
};

export default WizardInterface;