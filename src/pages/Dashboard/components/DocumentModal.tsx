import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from "@capacitor/core";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Logger } from "@/utils/logger";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { DocumentWarning } from "@/components/DocumentWarning";
import { RiskDetectionService, RiskAssessment } from "@/services/riskDetection";
import { DisclaimerService } from "@/services/disclaimer";

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    draftedText: string;
    onDraftedTextChange: (text: string) => void;
    editMode: boolean;
    onToggleEditMode: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
    isOpen,
    onClose,
    draftedText,
    onDraftedTextChange,
    editMode,
    onToggleEditMode
}) => {
    const { toast } = useToast();
    const supabase = useSupabaseClient();
    const session = useSession();
    const user = session?.user || null;
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Hukuki koruma state'leri
    const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
    const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
    const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);

    // ✅ Auto-save belge düzenlenirken
    useEffect(() => {
        if (!user || !draftedText || draftedText === '') return;

        // Önceki timeout'u temizle
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // 2 saniye sonra otomatik kaydet
        autoSaveTimeoutRef.current = setTimeout(async () => {
            try {
                Logger.log('DocumentModal', 'Auto-saving drafted document');

                // En son document'i bul
                const { data: latestDoc, error: fetchError } = await supabase
                    .from('documents')
                    .select('id')
                    .eq('user_id', user.id)
                    .not('drafted_document', 'is', null)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (latestDoc) {
                    const { error } = await supabase
                        .from('documents')
                        .update({
                            drafted_document: draftedText,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', latestDoc.id);

                    if (error) {
                        Logger.error('DocumentModal', 'Auto-save error', error);
                    } else {
                        Logger.log('DocumentModal', 'Document auto-saved successfully');
                    }
                }
            } catch (error) {
                Logger.error('DocumentModal', 'Auto-save exception', error);
            }
        }, 2000);

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [draftedText, user, supabase]);

    // Risk değerlendirmesi yap
    useEffect(() => {
        if (draftedText && draftedText.trim()) {
            const assessment = RiskDetectionService.assessRisk(draftedText, "belge");
            setRiskAssessment(assessment);

            Logger.log('DocumentModal', 'Risk assessment completed', {
                level: assessment.level,
                score: assessment.score,
                triggersCount: assessment.triggers.length
            });
        }
    }, [draftedText]);

    const handleCopyDraft = async () => {
        try {
            await navigator.clipboard.writeText(draftedText);
            toast({
                title: "Kopyalandı!",
                description: "Belge metni panoya başarıyla kopyalandı.",
            });
        } catch (err) {
            toast({
                title: "Kopyalama Hatası",
                description: "Metin kopyalanırken bir hata oluştu.",
                variant: "destructive",
            });
        }
    };

    // Disclaimer modal açma fonksiyonu
    const handleRequestDownload = () => {
        if (!user || !draftedText.trim()) {
            toast({
                title: "Hata",
                description: "İndirilecek belge bulunamadı.",
                variant: "destructive"
            });
            return;
        }

        // İndirme işlemini pending olarak ayarla
        setPendingDownloadAction(() => performActualDownload);
        setShowDisclaimerModal(true);
    };

    // Gerçek indirme işlemi (disclaimer onaylandıktan sonra)
    const performActualDownload = async () => {
        try {
            // Belgeye watermark ve uyarıları ekle
            const documentWithWarnings = DisclaimerService.addDocumentWatermark(draftedText);

            const paragraphs = documentWithWarnings.split('\n').filter(line => line.trim() !== '');

            const doc = new Document({
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

            const element = document.createElement("a");
            element.href = URL.createObjectURL(blob);
            element.download = "artiklo-belge.docx";
            document.body.appendChild(element);
            element.click();
            element.remove();

            URL.revokeObjectURL(element.href);

            toast({
                title: "Başarılı!",
                description: "Word belgesi indiriliyor.",
            });
        } catch (error) {
            Logger.error('DocumentModal', 'Document download error', error);
            toast({
                title: "Hata",
                description: "Word belgesi oluşturulurken bir hata oluştu.",
                variant: "destructive"
            });
        }
    };

    // Disclaimer onaylandıktan sonra
    const handleDisclaimerAccept = () => {
        setShowDisclaimerModal(false);

        // Pending action varsa çalıştır
        if (pendingDownloadAction) {
            pendingDownloadAction();
            setPendingDownloadAction(null);
        }
    };

    // Disclaimer iptal edildiğinde
    const handleDisclaimerCancel = () => {
        setShowDisclaimerModal(false);
        setPendingDownloadAction(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={`${Capacitor.isNativePlatform()
                    ? "mobile-dashboard-modal w-[98vw] h-[95vh] max-w-none max-h-none"
                    : "max-w-5xl w-[95vw] h-[90vh] md:h-[90vh]"
                    } flex flex-col p-2 md:p-4 fixed top-[55%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-semibold">Belge Taslağınız Hazır</DialogTitle>
                    <DialogDescription>
                        Aşağıdaki metni inceleyebilir, düzenleyebilir, kopyalayabilir veya indirebilirsiniz.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Hukuki Uyarı */}
                    {draftedText && riskAssessment && (
                        <DocumentWarning
                            documentType="belge"
                            content={draftedText}
                            riskAssessment={riskAssessment}
                            variant="modal"
                            className="mb-4"
                        />
                    )}
                </div>

                <div className={`flex-1 ${Capacitor.isNativePlatform() ? 'p-2 md:p-3' : 'p-3 md:p-6'} bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col`}>
                    {draftedText === '' ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Size özel belgeniz oluşturuluyor...</span>
                            </div>
                        </div>
                    ) : editMode ? (
                        <div className="flex-1 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                            <div className={`bg-gray-50 border-b border-gray-200 ${Capacitor.isNativePlatform() ? 'px-2 py-1' : 'px-4 py-2'} flex items-center justify-between`}>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                    <span className="font-medium">Düzenleme Modu</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>Times New Roman</span>
                                </div>
                            </div>
                            <Textarea
                                value={draftedText}
                                onChange={(e) => onDraftedTextChange(e.target.value)}
                                className={`flex-1 resize-none border-0 focus:ring-0 focus:outline-none ${Capacitor.isNativePlatform() ? 'p-2' : 'p-3 md:p-6'} bg-white`}
                                style={{
                                    minHeight: Capacitor.isNativePlatform() ? 'calc(70vh - 60px)' : 'calc(60vh - 40px)',
                                    fontFamily: 'Times New Roman, serif',
                                    fontSize: Capacitor.isNativePlatform() ? '14px' : 'clamp(10pt, 2.5vw, 12pt)',
                                    lineHeight: '1.5',
                                    color: '#1f2937'
                                }}
                                placeholder="Belge içeriğinizi buraya yazın..."
                            />
                        </div>
                    ) : (
                        <div
                            className={`flex-1 overflow-y-auto ${Capacitor.isNativePlatform() ? 'p-2' : 'p-3 md:p-6'} bg-white leading-relaxed text-gray-800 whitespace-pre-wrap border border-gray-200 rounded-md`}
                            style={{
                                maxHeight: Capacitor.isNativePlatform() ? 'calc(70vh - 60px)' : 'calc(60vh - 40px)',
                                fontFamily: 'Times New Roman, serif',
                                fontSize: Capacitor.isNativePlatform() ? '14px' : 'clamp(10pt, 2.5vw, 12pt)',
                                lineHeight: '1.5',
                                color: '#1f2937'
                            }}
                        >
                            {draftedText}
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 space-y-4">
                    <DialogFooter className={`flex flex-col justify-between pt-2 border-t gap-2 ${Capacitor.isNativePlatform() ? 'space-y-2' : 'sm:flex-row items-start sm:items-center pt-4 gap-3'}`}>
                        <div className="w-full">
                            {editMode ? (
                                <Button onClick={onToggleEditMode} size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                                    ✓ Görünümü Kaydet
                                </Button>
                            ) : (
                                <Button onClick={onToggleEditMode} size="sm" variant="outline" className="w-full">
                                    ✏️ Düzenle
                                </Button>
                            )}
                        </div>
                        <div className={`flex gap-2 w-full ${Capacitor.isNativePlatform() ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                            <Button variant="outline" size="sm" onClick={handleCopyDraft} className="w-full">
                                📋 Panoya Kopyala
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleRequestDownload} className="w-full">
                                📥 İndir (.docx)
                            </Button>
                            <Button onClick={onClose} size="sm" className="w-full">
                                Kapat
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>

            {/* Disclaimer Modal */}
            {user && (
                <DisclaimerModal
                    isOpen={showDisclaimerModal}
                    onClose={handleDisclaimerCancel}
                    onAccept={handleDisclaimerAccept}
                    documentType="belge"
                    documentContent={draftedText}
                    userId={user.id}
                    riskLevel={riskAssessment?.level}
                />
            )}
        </Dialog>
    );
};