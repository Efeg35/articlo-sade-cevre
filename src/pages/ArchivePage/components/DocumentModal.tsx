import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document, Entity } from '../types';
import { FileText, Shield, AlertTriangle, ListChecks, BookMarked, Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';

interface DocumentModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
    onOpenDraftModal?: (draftedText: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, isOpen, onClose, onOpenDraftModal }) => {
    const { toast } = useToast();

    if (!document) return null;

    // Copy text to clipboard
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Kopyalandı!",
                description: "Metin panoya başarıyla kopyalandı.",
            });
        } catch (err) {
            toast({
                title: "Kopyalama Hatası",
                description: "Metin kopyalanırken bir hata oluştu.",
                variant: "destructive",
            });
        }
    };

    // Download document as DOCX
    const handleDownloadDocument = async (text: string) => {
        try {
            const paragraphs = text.split('\n').filter(line => line.trim() !== '');

            const doc = new DocxDocument({
                sections: [{
                    properties: {},
                    children: paragraphs.map(paragraph =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: paragraph,
                                    size: 24,
                                    font: 'Calibri',
                                }),
                            ],
                            spacing: {
                                after: 200,
                            },
                        })
                    ),
                }],
            });

            const blob = await Packer.toBlob(doc);

            const element = window.document.createElement("a");
            element.href = URL.createObjectURL(blob);
            element.download = "artiklo-belge.docx";
            window.document.body.appendChild(element);
            element.click();
            element.remove();

            URL.revokeObjectURL(element.href);

            toast({
                title: "Başarılı!",
                description: "Word belgesi indiriliyor.",
            });
        } catch (error) {
            console.error('Word document creation error', error);
            toast({
                title: "Hata",
                description: "Word belgesi oluşturulurken bir hata oluştu.",
                variant: "destructive"
            });
        }
    };

    // Parse structured data from action_plan if it exists
    const parseStructuredData = (actionPlan: string | null): {
        isStructured: boolean;
        actionableSteps: Array<{ description: string; actionType: string }>;
        extractedEntities: Array<{ entity: string; value: string | number }>;
        riskItems: Array<{ riskType: string; description: string; severity: string; legalReference?: string; recommendation?: string }>;
        legacyActionPlan: string;
    } => {
        if (!actionPlan) return {
            isStructured: false,
            actionableSteps: [],
            extractedEntities: [],
            riskItems: [],
            legacyActionPlan: ''
        };

        try {
            const parsed = JSON.parse(actionPlan);
            if (parsed.__structured === true) {
                return {
                    isStructured: true,
                    actionableSteps: parsed.actionable_steps || [],
                    extractedEntities: parsed.extracted_entities || [],
                    riskItems: parsed.risk_items || [],
                    legacyActionPlan: parsed.legacy_action_plan || ''
                };
            }
        } catch (error) {
            // Not JSON, treat as legacy
        }

        return {
            isStructured: false,
            actionableSteps: [],
            extractedEntities: [],
            riskItems: [],
            legacyActionPlan: actionPlan
        };
    };

    // Extract document type from content
    const getDocumentType = (doc: Document): string => {
        const content = (doc.summary || doc.simplified_text || doc.original_text || '').toLowerCase();
        if (content.includes('sözleşme') || content.includes('kontrat')) return 'Sözleşme';
        if (content.includes('mahkeme') || content.includes('dava') || content.includes('karar')) return 'Mahkeme Belgesi';
        if (content.includes('dilekçe') || content.includes('başvuru')) return 'Dilekçe';
        if (content.includes('kanun') || content.includes('yönetmelik')) return 'Yasal Belge';
        if (content.includes('fatura') || content.includes('makbuz')) return 'Mali Belge';
        return 'Genel Belge';
    };

    // Extract potential risks from action plan (for legacy documents)
    const extractRisksFromContent = (content: string): Array<{ title: string, description: string, severity: 'high' | 'medium' | 'low' }> => {
        if (!content) return [];

        const risks = [];
        const lowerContent = content.toLowerCase();

        // Risk indicators
        if (lowerContent.includes('dikkat') || lowerContent.includes('önemli') || lowerContent.includes('risk')) {
            risks.push({
                title: 'Önemli Husus',
                description: 'Bu belgede dikkat edilmesi gereken önemli maddeler bulunmaktadır.',
                severity: 'medium' as const
            });
        }

        if (lowerContent.includes('süre') || lowerContent.includes('tarih') || lowerContent.includes('zaman')) {
            risks.push({
                title: 'Süre/Zaman Kısıtı',
                description: 'Belge içerisinde zaman sınırları veya süre kısıtları bulunabilir.',
                severity: 'high' as const
            });
        }

        if (lowerContent.includes('para') || lowerContent.includes('ödeme') || lowerContent.includes('tutar')) {
            risks.push({
                title: 'Mali Yükümlülük',
                description: 'Bu belgede mali yükümlülükler yer alabilir.',
                severity: 'medium' as const
            });
        }

        return risks;
    };

    const documentType = getDocumentType(document);
    const structuredData = parseStructuredData(document.action_plan);
    const risks = structuredData.isStructured
        ? structuredData.riskItems
        : extractRisksFromContent(document.action_plan || document.summary || '');

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full flex flex-col h-[85vh] fixed top-[55%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Belge Detayları</DialogTitle>
                    {document.created_at && (
                        <DialogDescription>
                            Oluşturulma Tarihi: {new Date(document.created_at).toLocaleDateString("tr-TR", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* Document Type Badge */}
                <div className="flex justify-center mb-4">
                    <Badge variant="outline" className="text-sm px-3 py-2">
                        <FileText className="h-4 w-4 mr-2" />
                        BELGE TÜRÜ: {documentType.toUpperCase()}
                    </Badge>
                </div>

                <div className="overflow-y-auto flex-1 pr-6 -mr-6 space-y-6">
                    {/* Belge Özeti */}
                    {document.summary && (
                        <section>
                            <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                                <span className="text-xl">🧠</span> Belge Özeti
                            </h3>
                            <div
                                className="p-4 bg-muted/50 rounded-md text-base whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html: document.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                }}
                            />
                        </section>
                    )}

                    {/* Anlaşılır Versiyon */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                            <span className="text-xl">→</span> Anlaşılır Versiyon
                        </h3>
                        <div className="p-4 bg-muted/50 rounded-md text-base whitespace-pre-wrap">
                            {document.simplified_text}
                        </div>
                    </section>

                    {/* ✅ Oluşturulan Belge - Eğer varsa buton göster */}
                    {document.drafted_document && (
                        <section>
                            <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Oluşturulan Hukuki Belge
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                    AI Üretimi
                                </Badge>
                            </h3>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-700 mb-4">
                                        Bu belge için AI tarafından özel bir hukuki belge oluşturuldu.
                                    </p>
                                    <Button
                                        onClick={() => onOpenDraftModal?.(document.drafted_document!)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Oluşturulan Hukuki Belgeyi Görüntüle/Düzenle
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Risk Analizi */}
                    {risks.length > 0 && (
                        <section>
                            <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                                <Shield className="h-5 w-5 text-destructive" />
                                Risk Analizi
                            </h3>
                            <div className="space-y-3">
                                {risks.map((risk, index) => (
                                    <div key={index} className={`p-3 rounded-lg border-l-4 ${risk.severity === 'high' ? 'bg-destructive/10 border-destructive' :
                                        risk.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                                            'bg-orange-500/10 border-orange-500'
                                        }`}>
                                        <div className="flex items-start gap-2">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${risk.severity === 'high' ? 'bg-destructive' :
                                                risk.severity === 'medium' ? 'bg-yellow-500' :
                                                    'bg-orange-500'
                                                }`} />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm mb-1">{risk.title}</h4>
                                                <p className="text-sm leading-relaxed">{risk.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Ne Yapmalıyım */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                            <ListChecks className="h-5 w-5" />
                            Ne Yapmalıyım?
                        </h3>
                        <div className="space-y-3">
                            {structuredData.actionableSteps.length > 0 ? (
                                structuredData.actionableSteps.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <p className="text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                                    <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Bu belgede yapılandırılmış eylem planı bulunmamaktadır.</p>
                                    <p className="text-xs mt-1">Bu belge eski analiz sistemi ile işlenmiştir.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Belgedeki Kilit Bilgiler */}
                    <section>
                        <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                            <BookMarked className="h-5 w-5" />
                            Belgedeki Kilit Bilgiler
                        </h3>
                        {structuredData.extractedEntities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {structuredData.extractedEntities.map((entity, idx) => (
                                    <div key={idx} className="p-4 bg-muted/50 rounded-lg text-sm">
                                        <span className="font-semibold text-foreground block mb-1">{entity.entity}</span>
                                        <span className="text-base">{String(entity.value)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : document.entities && Array.isArray(document.entities) && document.entities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {document.entities.map((entity: Entity, idx: number) => (
                                    <div key={idx} className="p-4 bg-muted/50 rounded-lg text-sm">
                                        <span className="font-semibold text-foreground block mb-1">{entity.tip}</span>
                                        <span>{entity.değer}</span>
                                        {entity.rol && (
                                            <span className="text-xs text-muted-foreground ml-2">({entity.rol})</span>
                                        )}
                                        {entity.açıklama && (
                                            <p className="text-xs text-muted-foreground mt-1">{entity.açıklama}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                                <BookMarked className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Bu belgeden yapılandırılmış bilgiler çıkarılmamış.</p>
                                <p className="text-xs mt-1">Bu belge eski analiz sistemi ile işlenmiştir.</p>
                            </div>
                        )}
                    </section>

                    {/* Yasal Uyarı */}
                    <section className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-yellow-800">
                                <div className="font-semibold text-yellow-900 mb-2">
                                    ⚠️ ÖNEMLİ YASAL UYARI
                                </div>
                                <div className="space-y-1 text-yellow-700">
                                    <p>• Bu analiz <strong>yalnızca bilgilendirme amaçlıdır</strong> ve hiçbir şekilde hukuki danışmanlık niteliği taşımaz.</p>
                                    <p>• <strong>Yapay Zeka hata yapabilir:</strong> Bu içerik AI tarafından üretilmiştir ve yanlış bilgiler içerebilir.</p>
                                    <p>• <strong>Profesyonel Destek Gerekli:</strong> Herhangi bir yasal karar almadan önce mutlaka bir avukata danışın.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
};