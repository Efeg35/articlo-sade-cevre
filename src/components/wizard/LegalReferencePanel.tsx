/**
 * 🏛️ Legal Reference Panel Component
 * 
 * Wizard sırasında ilgili hukuki referansları ve uyarıları gösterir.
 * Yargi-MCP server ile entegre çalışır.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Scale,
    AlertTriangle,
    Lightbulb,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Shield
} from 'lucide-react';

import {
    legalReferenceService,
    LegalReferenceUtils,
    type LegalReference,
    type LegalValidationResult
} from '../../services/legalReferenceService';

import type {
    DynamicTemplate,
    UserAnswer
} from '../../types/wizard/dynamicWizard';

interface LegalReferencePanelProps {
    template: DynamicTemplate;
    answers: Record<string, UserAnswer>;
    className?: string;
    compact?: boolean;
}

export const LegalReferencePanel: React.FC<LegalReferencePanelProps> = ({
    template,
    answers,
    className = '',
    compact = false
}) => {
    const [references, setReferences] = useState<LegalReference[]>([]);
    const [validation, setValidation] = useState<LegalValidationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(!compact);
    const [error, setError] = useState<string | null>(null);

    // Hukuki referansları yükle
    useEffect(() => {
        const loadLegalReferences = async () => {
            try {
                setLoading(true);
                setError(null);

                const [templateReferences, validationResult] = await Promise.all([
                    legalReferenceService.getLegalReferencesForTemplate(template),
                    legalReferenceService.validateLegalCompliance(template, answers)
                ]);

                setReferences(templateReferences);
                setValidation(validationResult);
            } catch (err) {
                console.error('Legal references loading failed:', err);
                setError('Hukuki referanslar yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        loadLegalReferences();
    }, [template, answers]);

    const getConfidenceColor = (score: number): string => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConfidenceLabel = (score: number): string => {
        if (score >= 80) return 'Yüksek Güven';
        if (score >= 60) return 'Orta Güven';
        return 'Düşük Güven';
    };

    if (loading) {
        return (
            <Card className={`${className} border-blue-200`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Hukuki referanslar yükleniyor...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert className={className}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const hasContent = references.length > 0 || (validation && (validation.warnings.length > 0 || validation.suggestions.length > 0));

    if (!hasContent) {
        return null;
    }

    return (
        <Card className={`${className} border-blue-200 bg-blue-50/50`}>
            <Collapsible open={expanded} onOpenChange={setExpanded}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Scale className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">Hukuki Referanslar</CardTitle>
                                {validation && (
                                    <Badge
                                        variant="outline"
                                        className={`${getConfidenceColor(validation.confidence_score)} border-current`}
                                    >
                                        {getConfidenceLabel(validation.confidence_score)} ({validation.confidence_score}%)
                                    </Badge>
                                )}
                            </div>
                            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">

                        {/* Uyarılar */}
                        {validation && validation.warnings.length > 0 && (
                            <Alert className="border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <AlertDescription>
                                    <div className="font-medium mb-2 text-orange-800">Hukuki Uyarılar:</div>
                                    <ul className="space-y-1 text-sm text-orange-700">
                                        {validation.warnings.map((warning, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{warning}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Öneriler */}
                        {validation && validation.suggestions.length > 0 && (
                            <Alert className="border-blue-200 bg-blue-50">
                                <Lightbulb className="h-4 w-4 text-blue-600" />
                                <AlertDescription>
                                    <div className="font-medium mb-2 text-blue-800">Hukuki Öneriler:</div>
                                    <ul className="space-y-1 text-sm text-blue-700">
                                        {validation.suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-2">💡</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Hukuki Referanslar */}
                        {references.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-4 w-4 text-gray-600" />
                                    <h4 className="font-medium text-gray-800">İlgili Mevzuat</h4>
                                </div>

                                <div className="grid gap-2">
                                    {references
                                        .sort((a, b) => b.relevance_score - a.relevance_score)
                                        .slice(0, compact ? 3 : 6)
                                        .map((ref, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {ref.code}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${ref.relevance_score >= 85 ? 'text-green-600 border-green-300' :
                                                                    ref.relevance_score >= 70 ? 'text-yellow-600 border-yellow-300' :
                                                                        'text-gray-600 border-gray-300'
                                                                }`}
                                                        >
                                                            {ref.relevance_score}% İlgili
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm font-medium mt-1 text-gray-800">{ref.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{ref.description}</p>
                                                </div>

                                                {ref.url && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => window.open(ref.url, '_blank')}
                                                        className="ml-2"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {references.length > (compact ? 3 : 6) && (
                                    <p className="text-xs text-gray-500 text-center">
                                        +{references.length - (compact ? 3 : 6)} diğer referans
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Disclaimer */}
                        <Alert className="border-gray-200 bg-gray-50">
                            <Shield className="h-4 w-4 text-gray-600" />
                            <AlertDescription className="text-xs text-gray-600">
                                <strong>Önemli Uyarı:</strong> Bu hukuki referanslar bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.
                                Kesin hukuki bilgi için mutlaka bir avukata danışınız.
                            </AlertDescription>
                        </Alert>

                        {/* Güven Skoru Detayı */}
                        {validation && (
                            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                                Hukuki analiz güven skoru:
                                <span className={`ml-1 font-medium ${getConfidenceColor(validation.confidence_score)}`}>
                                    {validation.confidence_score}%
                                </span>
                                {validation.confidence_score < 80 && (
                                    <span className="ml-1 text-gray-400">
                                        (Manuel hukuki inceleme önerilir)
                                    </span>
                                )}
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

// Compact version for sidebar/summary use
export const LegalReferenceSummary: React.FC<{
    template: DynamicTemplate;
    answers: Record<string, UserAnswer>;
    className?: string;
}> = ({ template, answers, className }) => {
    return (
        <LegalReferencePanel
            template={template}
            answers={answers}
            className={className}
            compact={true}
        />
    );
};

export default LegalReferencePanel;