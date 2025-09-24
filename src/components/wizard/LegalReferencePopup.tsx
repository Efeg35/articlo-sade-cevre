/**
 * 📚 Hukuki Referans Pop-up Component
 * 
 * FAZ 1: İlgili Kanun Maddesi Referansı (Şeffaflık Anı)
 * Belgedeki önemli maddelerin yanında tıklanabilir referanslar
 */

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BookOpen,
    Scale,
    ExternalLink,
    Info,
    Gavel,
    Sparkles,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { wizardMcpIntegration, type WizardLegalReference } from '@/services/wizardMcpIntegration';

interface LegalReferencePopupProps {
    /** Madde referansı (örn: "TBK m.299", "İŞK m.17") */
    reference: string;
    /** Pop-up trigger metni */
    children?: React.ReactNode;
    /** Arama terimi (reference'tan türetilecek) */
    searchTerm?: string;
    /** Özel className */
    className?: string;
}

interface LegalReferenceDetails {
    lawText: string;
    courtDecisions: WizardLegalReference[];
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        warning: string;
    };
    practicalTips: string[];
    loading: boolean;
}

export const LegalReferencePopup: React.FC<LegalReferencePopupProps> = ({
    reference,
    children,
    searchTerm,
    className
}) => {
    const [details, setDetails] = useState<LegalReferenceDetails>({
        lawText: '',
        courtDecisions: [],
        riskAssessment: { level: 'low', warning: '' },
        practicalTips: [],
        loading: false
    });
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Pop-up açıldığında hukuki detayları yükle
     */
    const loadLegalDetails = async () => {
        if (details.loading || details.lawText) return; // Zaten yüklendiyse tekrar yükleme

        setDetails(prev => ({ ...prev, loading: true }));

        try {
            console.log('📚 Loading legal details for reference:', reference);

            // Reference'tan arama terimi türet
            const derivedSearchTerm = searchTerm || deriveLegalSearchTerm(reference);

            // Mock template oluştur (gerçek MCP çağrısı için)
            const mockTemplate = {
                template_id: 'legal-reference',
                template_name: `Legal Reference - ${reference}`,
                template_description: 'Legal reference lookup',
                category: 'Konut Hukuku', // Reference'tan türetilebilir
                initial_questions: ['legal-ref'],
                questions: [],
                metadata: {
                    version: '1.0.0',
                    complexity_level: 'BASIC' as const,
                    estimated_completion_time: 1,
                    legal_references: [reference],
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString()
                },
                output_config: {
                    default_format: 'PDF' as const,
                    supported_formats: ['PDF' as const]
                }
            };

            // MCP'den hukuki context çek
            const enrichedData = await wizardMcpIntegration.enrichTemplateWithLegalContext(
                mockTemplate,
                { search_term: derivedSearchTerm }
            );

            // Kanun metni - Mevzuat-MCP'den gelen verileri kullan
            const lawReference = enrichedData.legalContext?.lawReferences.find(
                law => law.legalReference?.includes(reference.split(' ')[0]) // TBK, İŞK vs.
            );

            // Mahkeme kararları - Yargi-MCP'den gelen verileri kullan
            const courtDecisions = enrichedData.legalContext?.relevantDecisions || [];

            // Risk değerlendirmesi
            const riskLevel = courtDecisions.length > 3 ? 'medium' : 'low';
            const riskWarning = riskLevel === 'medium'
                ? 'Bu madde için çok sayıda mahkeme kararı bulunmaktadır. Dikkatli olunması önerilir.'
                : 'Bu madde genel olarak net hükümler içermektedir.';

            // Pratik öneriler
            const practicalTips = generatePracticalTips(reference, courtDecisions);

            setDetails({
                lawText: lawReference?.content || generateFallbackLawText(reference),
                courtDecisions: courtDecisions.slice(0, 5), // En fazla 5 karar göster
                riskAssessment: { level: riskLevel, warning: riskWarning },
                practicalTips,
                loading: false
            });

        } catch (error) {
            console.error('❌ Failed to load legal details:', error);

            // Fallback data
            setDetails({
                lawText: generateFallbackLawText(reference),
                courtDecisions: [],
                riskAssessment: {
                    level: 'medium',
                    warning: 'Hukuki detaylar yüklenemedi. Uzman görüşü alınması önerilir.'
                },
                practicalTips: [`${reference} hakkında detaylı bilgi için hukuki danışmanlık alınız.`],
                loading: false
            });
        }
    };

    // Pop-up açılınca veri yükle
    useEffect(() => {
        if (isOpen) {
            loadLegalDetails();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs p-1 h-auto font-medium underline-offset-2 hover:underline",
                            className
                        )}
                    >
                        <Info className="h-3 w-3" />
                        {reference}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-blue-600" />
                        Hukuki Referans: {reference}
                    </DialogTitle>
                    <DialogDescription>
                        Bu madde hakkında detaylı bilgi ve mahkeme içtihatları
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Kanun Metni */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-green-600" />
                                Kanun Metni
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {details.loading ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                    Kanun metni yükleniyor...
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-sm leading-relaxed">{details.lawText}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Risk Değerlendirmesi */}
                    <Card className={cn(
                        "border-l-4",
                        details.riskAssessment.level === 'high' && "border-l-red-500 bg-red-50/50",
                        details.riskAssessment.level === 'medium' && "border-l-yellow-500 bg-yellow-50/50",
                        details.riskAssessment.level === 'low' && "border-l-green-500 bg-green-50/50"
                    )}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                {details.riskAssessment.level === 'high' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                                {details.riskAssessment.level === 'medium' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                                {details.riskAssessment.level === 'low' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                Risk Değerlendirmesi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{details.riskAssessment.warning}</p>
                        </CardContent>
                    </Card>

                    {/* Mahkeme Kararları */}
                    {details.courtDecisions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Gavel className="h-5 w-5 text-purple-600" />
                                    İlgili Mahkeme Kararları
                                    <Badge variant="secondary">{details.courtDecisions.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {details.courtDecisions.map((decision, index) => (
                                    <div key={decision.id} className="border-l-2 border-purple-200 pl-4 py-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                {decision.source.toUpperCase()}
                                            </Badge>
                                            {decision.court && (
                                                <span className="text-xs text-muted-foreground">{decision.court}</span>
                                            )}
                                            {decision.date && (
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(decision.date).getFullYear()}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-medium text-sm mb-1">{decision.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {decision.content}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Pratik Öneriler */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="h-5 w-5 text-orange-600" />
                                Pratik Öneriler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {details.practicalTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Bu bilgiler genel niteliktedir. Spesifik durumunuz için hukuki danışmanlık alınız.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                        Kapat
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

/**
 * Reference'tan arama terimi türet
 */
function deriveLegalSearchTerm(reference: string): string {
    const referenceMap: Record<string, string> = {
        'TBK': 'Türk Borçlar Kanunu',
        'İŞK': 'İş Kanunu',
        'TMK': 'Türk Medeni Kanunu',
        'TTK': 'Türk Ticaret Kanunu',
        'TKHK': 'Tüketicinin Korunması Hakkında Kanun',
        'KVKK': 'Kişisel Verilerin Korunması Kanunu'
    };

    const lawCode = reference.split(' ')[0];
    return referenceMap[lawCode] || reference;
}

/**
 * Fallback kanun metni oluştur
 */
function generateFallbackLawText(reference: string): string {
    const fallbackTexts: Record<string, string> = {
        'TBK m.299': 'Kira sözleşmesi, kiraya verenin bir şeyin kullanılmasını kiracıya bırakmayı, kiracının da bunun karşılığında kira bedeli ödemeyi üstlendiği sözleşmedir.',
        'İŞK m.17': 'İş sözleşmesi, bir tarafın (işçi) bağımlı olarak iş görmeyi, diğer tarafın (işveren) da ücret ödemeyi üstlendiği sözleşmedir.',
        'TMK': 'Türk Medeni Kanunu ile ilgili hükümler',
        'TKHK': 'Tüketicinin Korunması Hakkında Kanun hükümleri'
    };

    return fallbackTexts[reference] || `${reference} ile ilgili hukuki düzenleme. Detaylı bilgi için ilgili kanun metnine başvurunuz.`;
}

/**
 * Pratik öneriler oluştur
 */
function generatePracticalTips(reference: string, decisions: WizardLegalReference[]): string[] {
    const baseTips = [
        'Sözleşme metnini dikkatli okuyun ve tüm maddeleri anlayın',
        'Belirsiz ifadeler varsa bunları netleştirin',
        'Gerekirse hukuki danışmanlık alın'
    ];

    // Reference'a özel öneriler
    if (reference.includes('TBK')) {
        baseTips.unshift('Kira artırımı konusunda yasal sınırları öğrenin');
    }

    if (reference.includes('İŞK')) {
        baseTips.unshift('İş sözleşmesi fesih prosedürlerini bilin');
    }

    // Mahkeme kararlarına göre ek öneriler
    if (decisions.length > 3) {
        baseTips.push('Bu konuda çok sayıda mahkeme kararı var, emsal kararları inceleyin');
    }

    return baseTips;
}

export default LegalReferencePopup;