/**
 * ✨ Real-Time Legal Suggestions Component
 * 
 * FAZ B: Wizard sırasında anlık hukuki öneriler sunar
 * MCP verilerini kullanarak contextual suggestions gösterir
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    Lightbulb,
    Scale,
    BookOpen,
    AlertTriangle,
    CheckCircle,
    ExternalLink,
    Sparkles,
    Clock,
    TrendingUp,
    Shield,
    Info,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { wizardMcpIntegration, type WizardLegalReference } from '@/services/wizardMcpIntegration';

interface RealTimeLegalSuggestionsProps {
    /** Mevcut wizard template ID */
    templateId: string;
    /** Mevcut wizard step number */
    currentStep: number;
    /** Kullanıcının mevcut cevapları */
    currentAnswers: Record<string, unknown>;
    /** Template kategorisi */
    templateCategory?: string;
    /** Compact mode (sidebar için) */
    compact?: boolean;
    /** Custom className */
    className?: string;
    /** Suggestion'a tıklandığında callback */
    onSuggestionClick?: (suggestion: LegalSuggestion) => void;
}

interface LegalSuggestion {
    id: string;
    type: 'tip' | 'warning' | 'reference' | 'precedent' | 'clause';
    title: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
    action?: {
        label: string;
        type: 'insert' | 'modify' | 'research' | 'external';
        data?: unknown;
    };
    source?: WizardLegalReference;
    timestamp: number;
}

interface SuggestionState {
    suggestions: LegalSuggestion[];
    loading: boolean;
    lastUpdate: number;
    error?: string;
}

export const RealTimeLegalSuggestions: React.FC<RealTimeLegalSuggestionsProps> = ({
    templateId,
    currentStep,
    currentAnswers,
    templateCategory = 'general',
    compact = false,
    className,
    onSuggestionClick
}) => {
    const [suggestionState, setSuggestionState] = useState<SuggestionState>({
        suggestions: [],
        loading: false,
        lastUpdate: 0
    });

    const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
    const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

    /**
     * Real-time suggestions fetch
     */
    const fetchLegalSuggestions = useCallback(async () => {
        const now = Date.now();

        // Throttle: 2 saniyede bir güncelle
        if (now - suggestionState.lastUpdate < 2000 && suggestionState.suggestions.length > 0) {
            return;
        }

        setSuggestionState(prev => ({ ...prev, loading: true, error: undefined }));

        try {
            console.log('✨ Fetching real-time legal suggestions...', {
                templateId,
                currentStep,
                answersCount: Object.keys(currentAnswers).length
            });

            // MCP'den live context çek
            const liveContext = await wizardMcpIntegration.getLiveContextForStep(
                templateId,
                currentStep,
                currentAnswers
            );

            // Context'i suggestion'lara dönüştür
            const generatedSuggestions = await generateSuggestionsFromContext(
                liveContext,
                templateCategory,
                currentAnswers,
                currentStep
            );

            setSuggestionState({
                suggestions: generatedSuggestions,
                loading: false,
                lastUpdate: now
            });

        } catch (error) {
            console.error('❌ Failed to fetch legal suggestions:', error);
            setSuggestionState(prev => ({
                ...prev,
                loading: false,
                error: 'Hukuki öneriler yüklenemedi'
            }));
        }
    }, [templateId, currentStep, currentAnswers, templateCategory, suggestionState.lastUpdate]);

    /**
     * Auto-fetch on changes
     */
    useEffect(() => {
        if (Object.keys(currentAnswers).length > 0) {
            const timer = setTimeout(() => {
                fetchLegalSuggestions();
            }, 800); // Debounce 800ms

            return () => clearTimeout(timer);
        }
    }, [fetchLegalSuggestions]);

    /**
     * Handle suggestion click
     */
    const handleSuggestionClick = (suggestion: LegalSuggestion) => {
        console.log('🔍 Suggestion clicked:', suggestion.title);

        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        }

        // Toggle expanded state
        setExpandedSuggestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(suggestion.id)) {
                newSet.delete(suggestion.id);
            } else {
                newSet.add(suggestion.id);
            }
            return newSet;
        });
    };

    /**
     * Dismiss suggestion
     */
    const dismissSuggestion = (suggestionId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
    };

    // Filter out dismissed suggestions
    const visibleSuggestions = suggestionState.suggestions
        .filter(s => !dismissedSuggestions.has(s.id))
        .sort((a, b) => {
            // Priority sort: high > medium > low
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

    const highPrioritySuggestions = visibleSuggestions.filter(s => s.priority === 'high');
    const displaySuggestions = compact
        ? visibleSuggestions.slice(0, 3)
        : visibleSuggestions;

    if (suggestionState.loading && visibleSuggestions.length === 0) {
        return (
            <Card className={cn("border-blue-200 bg-blue-50/30", className)}>
                <CardContent className="pt-3 sm:pt-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                        <span className="text-xs sm:text-sm text-blue-700">Hukuki öneriler hazırlanıyor...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (suggestionState.error) {
        return (
            <Alert className={cn("border-yellow-200", className)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    {suggestionState.error}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchLegalSuggestions}
                        className="ml-2 h-6 px-2"
                    >
                        Tekrar dene
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (displaySuggestions.length === 0) {
        return null;
    }

    return (
        <Card className={cn("border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/30", className)}>
            <CardHeader className={cn("pb-2 sm:pb-3", compact && "pb-2")}>
                <div className="flex items-center justify-between">
                    <CardTitle className={cn(
                        "flex items-center gap-2",
                        compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                    )}>
                        <Sparkles className={cn("text-purple-600", compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4 sm:h-5 sm:w-5")} />
                        <span className="hidden sm:inline">Akıllı Hukuki Öneriler</span>
                        <span className="sm:hidden">Hukuki Öneriler</span>
                        {highPrioritySuggestions.length > 0 && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                {highPrioritySuggestions.length} Önemli
                            </Badge>
                        )}
                    </CardTitle>

                    {suggestionState.loading && (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-purple-500 border-t-transparent" />
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2 sm:space-y-3">
                {displaySuggestions.map((suggestion) => {
                    const isExpanded = expandedSuggestions.has(suggestion.id);
                    const config = getSuggestionConfig(suggestion.type, suggestion.priority);

                    return (
                        <div
                            key={suggestion.id}
                            className={cn(
                                "relative group cursor-pointer transition-all duration-200",
                                "hover:scale-[1.02] hover:shadow-sm"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <Alert className={cn(
                                "border-l-4 transition-colors",
                                config.borderColor,
                                config.bgColor,
                                suggestion.priority === 'high' && "ring-1 ring-red-200"
                            )}>
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <config.icon className={cn(
                                        "flex-shrink-0 mt-0.5",
                                        config.iconColor,
                                        compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4 sm:h-5 sm:w-5"
                                    )} />

                                    <div className="flex-1 space-y-1 sm:space-y-2">
                                        <div className="flex items-start sm:items-center justify-between gap-2">
                                            <h4 className={cn(
                                                "font-medium leading-tight flex-1",
                                                compact ? "text-xs" : "text-xs sm:text-sm"
                                            )}>
                                                {suggestion.title}
                                            </h4>

                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        config.badgeColor
                                                    )}
                                                >
                                                    {config.label}
                                                </Badge>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 text-xs"
                                                    onClick={(e) => dismissSuggestion(suggestion.id, e)}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        </div>

                                        <AlertDescription className={cn(
                                            "text-gray-700 leading-relaxed",
                                            compact ? "text-xs" : "text-xs sm:text-sm",
                                            !isExpanded && compact && "line-clamp-2"
                                        )}>
                                            {suggestion.content}
                                        </AlertDescription>

                                        {/* Expanded content */}
                                        {isExpanded && suggestion.source && (
                                            <div className="mt-2 sm:mt-3 pt-2 border-t border-gray-200">
                                                <div className="flex items-start gap-2">
                                                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-0.5" />
                                                    <div className="text-xs text-gray-600">
                                                        <p className="font-medium">{suggestion.source.court}</p>
                                                        <p className="line-clamp-2">{suggestion.source.title}</p>
                                                        {suggestion.source.caseNumber && (
                                                            <p className="text-gray-500">Karar No: {suggestion.source.caseNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action button */}
                                        {suggestion.actionable && suggestion.action && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-6 sm:h-7 text-xs px-2 sm:px-3"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('🔄 Action clicked:', suggestion.action);
                                                    }}
                                                >
                                                    {suggestion.action.label}
                                                    <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Alert>
                        </div>
                    );
                })}

                {/* Load more compact mode */}
                {compact && visibleSuggestions.length > 3 && (
                    <div className="text-center pt-1 sm:pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-purple-600 h-5 sm:h-6 px-2"
                        >
                            +{visibleSuggestions.length - 3} daha fazla
                        </Button>
                    </div>
                )}

                {/* Footer info */}
                {!compact && visibleSuggestions.length > 0 && (
                    <>
                        <Separator className="my-2 sm:my-3" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="hidden sm:inline">Son güncelleme: </span>
                                {new Date(suggestionState.lastUpdate).toLocaleTimeString('tr-TR')}
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                MCP destekli
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * Generate suggestions from MCP context
 */
async function generateSuggestionsFromContext(
    liveContext: {
        suggestions: string[];
        warnings: string[];
        legalReferences: WizardLegalReference[];
    },
    templateCategory: string,
    currentAnswers: Record<string, unknown>,
    currentStep: number
): Promise<LegalSuggestion[]> {
    const suggestions: LegalSuggestion[] = [];
    const timestamp = Date.now();

    // Convert warnings to high priority suggestions
    liveContext.warnings.forEach((warning, index) => {
        suggestions.push({
            id: `warning-${timestamp}-${index}`,
            type: 'warning',
            title: 'Önemli Uyarı',
            content: warning,
            priority: 'high',
            actionable: true,
            action: {
                label: 'İncele',
                type: 'research'
            },
            timestamp
        });
    });

    // Convert MCP suggestions to tips
    liveContext.suggestions.forEach((suggestion, index) => {
        suggestions.push({
            id: `tip-${timestamp}-${index}`,
            type: 'tip',
            title: 'Hukuki İpucu',
            content: suggestion,
            priority: 'medium',
            actionable: false,
            timestamp
        });
    });

    // Convert legal references to reference suggestions
    liveContext.legalReferences.forEach((reference, index) => {
        suggestions.push({
            id: `reference-${timestamp}-${index}`,
            type: 'reference',
            title: `${reference.court} Kararı`,
            content: reference.content,
            priority: reference.relevance > 0.8 ? 'high' : 'medium',
            actionable: true,
            action: {
                label: 'Detayları Gör',
                type: 'external'
            },
            source: reference,
            timestamp
        });
    });

    // Generate contextual suggestions based on answers
    const contextualSuggestions = generateContextualSuggestions(currentAnswers, templateCategory, currentStep);
    suggestions.push(...contextualSuggestions);

    return suggestions;
}

/**
 * Generate contextual suggestions based on current answers
 */
function generateContextualSuggestions(
    answers: Record<string, unknown>,
    category: string,
    step: number
): LegalSuggestion[] {
    const suggestions: LegalSuggestion[] = [];
    const timestamp = Date.now();

    // Amount-based suggestions
    Object.entries(answers).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
            if (key.includes('rent') || key.includes('kira')) {
                if (value > 50000) {
                    suggestions.push({
                        id: `amount-high-${key}`,
                        type: 'tip',
                        title: 'Yüksek Kira Bedeli',
                        content: 'Yüksek kira bedelleri için piyasa araştırması yapmanız ve artırım koşullarını net belirtmeniz önerilir.',
                        priority: 'medium',
                        actionable: true,
                        action: {
                            label: 'Piyasa Araştır',
                            type: 'research'
                        },
                        timestamp
                    });
                }
            }
        }
    });

    // Step-based suggestions
    if (step === 1) {
        suggestions.push({
            id: 'step-1-intro',
            type: 'tip',
            title: 'Sözleşme Hazırlığı',
            content: 'Sözleşme hazırlarken tarafların kimlik bilgilerinin doğru ve eksiksiz olduğundan emin olun.',
            priority: 'low',
            actionable: false,
            timestamp
        });
    }

    return suggestions;
}

/**
 * Get suggestion configuration based on type and priority
 */
function getSuggestionConfig(type: LegalSuggestion['type'], priority: LegalSuggestion['priority']) {
    const configs = {
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-red-600',
            borderColor: 'border-l-red-500',
            bgColor: 'bg-red-50/50',
            badgeColor: 'border-red-300 text-red-700',
            label: 'Uyarı'
        },
        tip: {
            icon: Lightbulb,
            iconColor: 'text-yellow-600',
            borderColor: 'border-l-yellow-500',
            bgColor: 'bg-yellow-50/50',
            badgeColor: 'border-yellow-300 text-yellow-700',
            label: 'İpucu'
        },
        reference: {
            icon: BookOpen,
            iconColor: 'text-blue-600',
            borderColor: 'border-l-blue-500',
            bgColor: 'bg-blue-50/50',
            badgeColor: 'border-blue-300 text-blue-700',
            label: 'Emsal'
        },
        precedent: {
            icon: Scale,
            iconColor: 'text-purple-600',
            borderColor: 'border-l-purple-500',
            bgColor: 'bg-purple-50/50',
            badgeColor: 'border-purple-300 text-purple-700',
            label: 'İçtihat'
        },
        clause: {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            borderColor: 'border-l-green-500',
            bgColor: 'bg-green-50/50',
            badgeColor: 'border-green-300 text-green-700',
            label: 'Öneri'
        }
    };

    const baseConfig = configs[type] || configs.tip;

    // High priority için daha vurgulu renkler
    if (priority === 'high') {
        return {
            ...baseConfig,
            borderColor: 'border-l-red-500',
            bgColor: 'bg-red-50/70'
        };
    }

    return baseConfig;
}

export default RealTimeLegalSuggestions;