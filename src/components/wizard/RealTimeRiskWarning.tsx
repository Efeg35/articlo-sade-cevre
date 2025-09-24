/**
 * ⚠️ Gerçek Zamanlı Risk Uyarısı Component
 * 
 * FAZ 2: Dinamik Risk Uyarısı (Gerçek Zamanlı Koruma)
 * Kullanıcı veri girişi yaparken anlık risk analizi ve uyarılar
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertTriangle,
    Shield,
    Info,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { wizardMcpIntegration, type WizardLegalReference } from '@/services/wizardMcpIntegration';
import { RiskDetectionService, type RiskLevel } from '@/services/riskDetection';

interface RealTimeRiskWarningProps {
    /** Kullanıcının girdiği değer */
    inputValue: unknown;
    /** Input field'ın tipi/adı */
    fieldName: string;
    /** Template kategorisi (risk değerlendirmesi için) */
    templateCategory?: string;
    /** Tüm form answers (context için) */
    allAnswers?: Record<string, unknown>;
    /** Özel className */
    className?: string;
}

interface RiskAnalysis {
    level: RiskLevel;
    warnings: string[];
    suggestions: string[];
    legalConcerns: string[];
    precedents: WizardLegalReference[];
    loading: boolean;
}

export const RealTimeRiskWarning: React.FC<RealTimeRiskWarningProps> = ({
    inputValue,
    fieldName,
    templateCategory = 'general',
    allAnswers = {},
    className
}) => {
    const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis>({
        level: 'low',
        warnings: [],
        suggestions: [],
        legalConcerns: [],
        precedents: [],
        loading: false
    });

    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    /**
     * Gerçek zamanlı risk analizi yap
     */
    const performRiskAnalysis = useCallback(async (value: unknown) => {
        if (!value) {
            setRiskAnalysis({
                level: 'low',
                warnings: [],
                suggestions: [],
                legalConcerns: [],
                precedents: [],
                loading: false
            });
            return;
        }

        setRiskAnalysis(prev => ({ ...prev, loading: true }));

        try {
            console.log('⚠️ Performing real-time risk analysis for:', { fieldName, value });

            // 1. Temel risk değerlendirmesi
            const basicRisk = await analyzeBasicRisk(value, fieldName, templateCategory);

            // 2. Hukuki precedent kontrolü (MCP)
            const legalAnalysis = await analyzeLegalPrecedents(value, fieldName, allAnswers);

            // 3. Bağlamsal risk analizi
            const contextualRisks = analyzeContextualRisks(value, fieldName, allAnswers);

            // 4. Sonuçları birleştir
            const finalRiskLevel = Math.max(
                getRiskLevelNumber(basicRisk.level),
                getRiskLevelNumber(legalAnalysis.level),
                getRiskLevelNumber(contextualRisks.level)
            );

            setRiskAnalysis({
                level: getRiskLevelFromNumber(finalRiskLevel),
                warnings: [
                    ...basicRisk.warnings,
                    ...legalAnalysis.warnings,
                    ...contextualRisks.warnings
                ],
                suggestions: [
                    ...basicRisk.suggestions,
                    ...legalAnalysis.suggestions,
                    ...contextualRisks.suggestions
                ],
                legalConcerns: [
                    ...basicRisk.legalConcerns,
                    ...legalAnalysis.legalConcerns
                ],
                precedents: legalAnalysis.precedents,
                loading: false
            });

        } catch (error) {
            console.error('❌ Risk analysis failed:', error);
            setRiskAnalysis({
                level: 'medium',
                warnings: ['Risk analizi yapılamadı'],
                suggestions: ['Güvenlik için uzman görüşü alınız'],
                legalConcerns: [],
                precedents: [],
                loading: false
            });
        }
    }, [fieldName, templateCategory, allAnswers]);

    /**
     * Debounced risk analysis
     */
    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            performRiskAnalysis(inputValue);
        }, 800); // 800ms delay

        setDebounceTimer(timer);

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [inputValue, fieldName, templateCategory]); // Fixed dependencies

    // Risk yoksa hiçbir şey render etme
    if (riskAnalysis.level === 'low' && riskAnalysis.warnings.length === 0 && !riskAnalysis.loading) {
        return null;
    }

    const riskConfig = getRiskConfig(riskAnalysis.level);

    return (
        <div className={cn("mt-3 space-y-3", className)}>
            {/* Ana Risk Uyarısı */}
            <Alert className={cn("border-l-4", riskConfig.borderColor, riskConfig.bgColor)}>
                <div className="flex items-start gap-2">
                    <riskConfig.icon className={cn("h-5 w-5 mt-0.5", riskConfig.iconColor)} />

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Risk Uyarısı</span>
                            <Badge
                                variant={riskAnalysis.level === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                            >
                                {riskAnalysis.level.toUpperCase()}
                            </Badge>
                        </div>

                        {riskAnalysis.loading && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                                Risk analizi yapılıyor...
                            </div>
                        )}

                        {/* Uyarılar */}
                        {riskAnalysis.warnings.length > 0 && (
                            <div className="space-y-1">
                                {riskAnalysis.warnings.slice(0, 2).map((warning, index) => (
                                    <AlertDescription key={index} className="text-xs">
                                        • {warning}
                                    </AlertDescription>
                                ))}
                            </div>
                        )}

                        {/* Öneriler */}
                        {riskAnalysis.suggestions.length > 0 && (
                            <div className="space-y-1">
                                {riskAnalysis.suggestions.slice(0, 2).map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-1 text-xs text-muted-foreground">
                                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Alert>

            {/* Hukuki Endişeler */}
            {riskAnalysis.legalConcerns.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-3 pb-3">
                        <div className="flex items-start gap-2">
                            <Scale className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-yellow-800">Hukuki Dikkat Noktaları:</p>
                                {riskAnalysis.legalConcerns.slice(0, 2).map((concern, index) => (
                                    <p key={index} className="text-xs text-yellow-700">• {concern}</p>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* İlgili Mahkeme Kararları */}
            {riskAnalysis.precedents.length > 0 && (
                <Card className="border-purple-200 bg-purple-50/50">
                    <CardContent className="pt-3 pb-3">
                        <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-purple-600 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-purple-800">İlgili İçtihatlar:</p>
                                {riskAnalysis.precedents.slice(0, 2).map((precedent, index) => (
                                    <div key={index} className="text-xs">
                                        <p className="font-medium text-purple-700">{precedent.court}</p>
                                        <p className="text-purple-600 line-clamp-2">{precedent.title}</p>
                                    </div>
                                ))}
                                {riskAnalysis.precedents.length > 2 && (
                                    <p className="text-xs text-purple-600">
                                        +{riskAnalysis.precedents.length - 2} daha fazla karar...
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

/**
 * Temel risk değerlendirmesi
 */
async function analyzeBasicRisk(
    value: unknown,
    fieldName: string,
    templateCategory: string
): Promise<Omit<RiskAnalysis, 'loading' | 'precedents'>> {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const legalConcerns: string[] = [];
    let level: RiskLevel = 'low';

    // Sayısal değerler için kontroller
    if (typeof value === 'number') {
        // Kira ile ilgili kontroller
        if (fieldName.includes('rent') || fieldName.includes('kira')) {
            if (value > 50000) {
                level = 'high';
                warnings.push('Yüksek kira bedeli risk oluşturabilir');
                suggestions.push('Piyasa değerini araştırın');
                legalConcerns.push('TBK m.344 uyarınca depozito sınırlarını kontrol edin');
            } else if (value > 20000) {
                level = 'medium';
                warnings.push('Orta-yüksek kira bedeli dikkat gerektiriyor');
            }
        }

        // Depozito kontrolleri
        if (fieldName.includes('deposit') || fieldName.includes('depozito')) {
            const monthlyRent = extractMonthlyRentFromContext(fieldName, value);
            if (monthlyRent && value > monthlyRent * 3) {
                level = 'high';
                warnings.push('Depozito tutarı 3 aylık kiradan fazla olamaz (TBK m.344)');
                legalConcerns.push('Fazla depozito alan madde geçersiz sayılabilir');
            }
        }

        // Faiz oranları
        if (fieldName.includes('interest') || fieldName.includes('faiz')) {
            if (value > 30) {
                level = 'high';
                warnings.push('Yüksek faiz oranı "fahiş faiz" sayılabilir');
                legalConcerns.push('Fahiş faiz hükümleri TCK m.241 kapsamında suç teşkil eder');
            }
        }
    }

    // Metin değerler için kontroller
    if (typeof value === 'string') {
        const riskAssessment = RiskDetectionService.assessRisk(value, templateCategory);
        if (riskAssessment.level === 'high') {
            level = 'high';
            warnings.push(...riskAssessment.triggers.map(t => `Risk kelime tespit edildi: "${t}"`));
            suggestions.push('Bu konuda uzman görüşü alınız');
        }
    }

    return { level, warnings, suggestions, legalConcerns };
}

/**
 * Hukuki precedent analizi (MCP ile)
 */
async function analyzeLegalPrecedents(
    value: unknown,
    fieldName: string,
    allAnswers: Record<string, unknown>
): Promise<Pick<RiskAnalysis, 'level' | 'warnings' | 'suggestions' | 'legalConcerns' | 'precedents'>> {
    try {
        // MCP'den ilgili kararları çek
        const searchTerm = `${fieldName} ${value}`.substring(0, 50);
        const liveContext = await wizardMcpIntegration.getLiveContextForStep(
            'risk-analysis',
            1,
            { [fieldName]: value, ...allAnswers }
        );

        const precedents = liveContext.legalReferences;
        const warnings = liveContext.warnings;
        const suggestions = liveContext.suggestions;

        // Risk level'ı precedent sayısına göre belirle
        const level: RiskLevel = precedents.length > 3 ? 'medium' : 'low';

        const legalConcerns = precedents
            .filter(p => p.source === 'yargitay')
            .slice(0, 2)
            .map(p => `${p.court}: ${p.title.substring(0, 80)}...`);

        return {
            level,
            warnings,
            suggestions,
            legalConcerns,
            precedents
        };

    } catch (error) {
        console.warn('⚠️ Legal precedent analysis failed:', error);
        return {
            level: 'low',
            warnings: [],
            suggestions: [],
            legalConcerns: [],
            precedents: []
        };
    }
}

/**
 * Bağlamsal risk analizi
 */
function analyzeContextualRisks(
    value: unknown,
    fieldName: string,
    allAnswers: Record<string, unknown>
): Pick<RiskAnalysis, 'level' | 'warnings' | 'suggestions'> {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let level: RiskLevel = 'low';

    // Tarih kontrolleri
    if (fieldName.includes('date') || fieldName.includes('tarih')) {
        const dateValue = new Date(value as string);
        const now = new Date();

        if (dateValue < now) {
            level = 'medium';
            warnings.push('Geçmiş tarih girildi, kontrol edin');
        }

        const daysDiff = Math.abs((dateValue.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (daysDiff < 7) {
            warnings.push('Kısa süreli anlaşma, dikkatli olun');
        }
    }

    // Süre kontrolleri
    if (fieldName.includes('duration') || fieldName.includes('sure')) {
        const durationValue = parseInt(value as string);
        if (durationValue > 60) { // 60 ay = 5 yıl
            level = 'medium';
            warnings.push('Uzun süreli anlaşma, şartları gözden geçirin');
            suggestions.push('Ara dönemlerde revizyon hakkı ekleyin');
        }
    }

    return { level, warnings, suggestions };
}

/**
 * Utility functions
 */
function getRiskLevelNumber(level: RiskLevel): number {
    switch (level) {
        case 'low': return 1;
        case 'medium': return 2;
        case 'high': return 3;
        default: return 1;
    }
}

function getRiskLevelFromNumber(num: number): RiskLevel {
    if (num >= 3) return 'high';
    if (num >= 2) return 'medium';
    return 'low';
}

function getRiskConfig(level: RiskLevel) {
    switch (level) {
        case 'high':
            return {
                icon: AlertTriangle,
                iconColor: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-l-red-500'
            };
        case 'medium':
            return {
                icon: AlertCircle,
                iconColor: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-l-yellow-500'
            };
        default:
            return {
                icon: Shield,
                iconColor: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500'
            };
    }
}

function extractMonthlyRentFromContext(fieldName: string, currentValue: unknown): number | null {
    // Bu fonksiyon context'ten aylık kira bilgisini çıkarmaya çalışır
    // Şimdilik basit bir implementasyon
    return null;
}

export default RealTimeRiskWarning;