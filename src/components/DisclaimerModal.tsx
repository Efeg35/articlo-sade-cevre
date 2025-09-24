import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, FileText, Download } from "lucide-react";
import { DisclaimerService, DisclaimerConfig } from "@/services/disclaimer";
import { RiskDetectionService, RiskLevel, RiskAssessment } from "@/services/riskDetection";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { Logger } from "@/utils/logger";

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    documentType: string;
    documentContent?: string;
    userId: string;
    riskLevel?: RiskLevel;
}

interface CheckboxState {
    [key: string]: boolean;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
    isOpen,
    onClose,
    onAccept,
    documentType,
    documentContent = "",
    userId,
    riskLevel: propRiskLevel
}) => {
    const [checkboxes, setCheckboxes] = useState<CheckboxState>({});
    const [config, setConfig] = useState<DisclaimerConfig | null>(null);
    const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
    const hapticFeedback = useHapticFeedback();

    // Risk değerlendirmesi yap ve config'i ayarla
    useEffect(() => {
        if (isOpen && documentContent) {
            const assessment = RiskDetectionService.assessRisk(documentContent, documentType);
            const finalRiskLevel = propRiskLevel || assessment.level;

            setRiskAssessment(assessment);

            const disclaimerConfig = DisclaimerService.getDocumentDisclaimerConfig(
                documentType,
                finalRiskLevel
            );

            setConfig(disclaimerConfig);

            // Checkbox'ları sıfırla
            const initialCheckboxes: CheckboxState = {};
            disclaimerConfig.checkboxes.forEach(checkbox => {
                initialCheckboxes[checkbox.id] = false;
            });
            setCheckboxes(initialCheckboxes);

            // Analytics tracking
            Logger.log('DisclaimerModal', 'Modal opened', {
                documentType,
                riskLevel: finalRiskLevel,
                riskScore: assessment.score,
                triggersCount: assessment.triggers.length
            });
        }
    }, [isOpen, documentContent, documentType, propRiskLevel]);

    // Checkbox değişimlerini handle et
    const handleCheckboxChange = (checkboxId: string, checked: boolean) => {
        setCheckboxes(prev => ({
            ...prev,
            [checkboxId]: checked
        }));

        // Haptic feedback
        if (checked) {
            hapticFeedback.light();
        }
    };

    // Tüm gerekli checkbox'ların işaretli olup olmadığını kontrol et
    const allRequiredChecked = config?.checkboxes.every(checkbox =>
        !checkbox.required || checkboxes[checkbox.id]
    ) ?? false;

    // Kabul et fonksiyonu
    const handleAccept = async () => {
        if (!allRequiredChecked || !config) {
            await hapticFeedback.error();
            return;
        }

        // Disclaimer kabulünü kaydet
        DisclaimerService.trackDisclaimerAcceptance(
            userId,
            documentType,
            config.riskLevel
        );

        // Success haptic feedback
        await hapticFeedback.success();

        // Analytics
        Logger.log('DisclaimerModal', 'Disclaimer accepted', {
            documentType,
            riskLevel: config.riskLevel,
            userId,
            allCheckboxes: checkboxes
        });

        onAccept();
    };

    // İptal et fonksiyonu  
    const handleCancel = async () => {
        await hapticFeedback.light();

        Logger.log('DisclaimerModal', 'Disclaimer cancelled', {
            documentType,
            userId,
            completedCheckboxes: Object.keys(checkboxes).filter(key => checkboxes[key]).length
        });

        onClose();
    };

    if (!config) {
        return null;
    }

    const riskColors = RiskDetectionService.getRiskThemeColors(config.riskLevel);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription>
                        Bu belgeyi indirmeden önce aşağıdaki hukuki uyarıları dikkatlice okuyun ve onaylayın.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Risk Seviye Uyarısı */}
                    <Alert className={`${riskColors.bg} ${riskColors.border} border-l-4`}>
                        <AlertTriangle className={`h-4 w-4 ${riskColors.icon}`} />
                        <AlertTitle className={riskColors.text}>
                            {config.riskLevel === 'high' && 'Yüksek Risk'}
                            {config.riskLevel === 'medium' && 'Orta Risk'}
                            {config.riskLevel === 'low' && 'Düşük Risk'}
                        </AlertTitle>
                        <AlertDescription className={riskColors.text}>
                            {riskAssessment?.warningMessage ||
                                DisclaimerService.getRiskWarningMessage(config.riskLevel)}
                        </AlertDescription>
                    </Alert>

                    {/* Risk Triggers (Yüksek risk için) */}
                    {config.riskLevel === 'high' && riskAssessment?.triggers?.length > 0 && (
                        <Alert variant="destructive">
                            <FileText className="h-4 w-4" />
                            <AlertTitle>Tespit Edilen Risk Faktörleri</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2">
                                    <p className="text-sm mb-2">Bu belgede şu risk faktörleri tespit edildi:</p>
                                    <ul className="text-xs list-disc list-inside space-y-1">
                                        {riskAssessment.triggers.slice(0, 5).map((trigger: string, index: number) => (
                                            <li key={index}>{trigger}</li>
                                        ))}
                                    </ul>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Ana Uyarı Mesajı */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2 font-medium">
                            {config.description}
                        </p>
                        <p className="text-xs text-gray-600">
                            Bu onayları vermekle birlikte, belgenin hukuki geçerliliği ve size uygunluğu konusunda
                            tüm sorumluluğu üstlenmiş olursunuz.
                        </p>
                    </div>

                    {/* Checkbox'lar */}
                    <div className="space-y-3">
                        {config.checkboxes.map((checkbox) => (
                            <div key={checkbox.id} className="flex items-start space-x-3">
                                <Checkbox
                                    id={checkbox.id}
                                    checked={checkboxes[checkbox.id] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(checkbox.id, checked as boolean)
                                    }
                                    className="mt-1"
                                />
                                <label
                                    htmlFor={checkbox.id}
                                    className="text-sm cursor-pointer leading-relaxed"
                                >
                                    {checkbox.label}
                                    {checkbox.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Profesyonel Destek Hatırlatması */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-blue-800 font-medium mb-1">
                                    Profesyonel Destek Önerisi
                                </p>
                                <p className="text-blue-700 text-xs">
                                    Türkiye Barolar Birliği: <span className="font-mono">0312 425 71 00</span>
                                    <br />
                                    Adalet Bakanlığı: <span className="font-mono">0312 419 60 00</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full sm:w-auto"
                    >
                        İptal Et
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={!allRequiredChecked}
                        className={`w-full sm:w-auto ${config.riskLevel === 'high'
                            ? 'bg-red-600 hover:bg-red-700'
                            : config.riskLevel === 'medium'
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {allRequiredChecked
                            ? 'Onaylıyor ve İndiriyorum'
                            : `${config.checkboxes.filter(c => c.required).length - Object.values(checkboxes).filter(Boolean).length} onay eksik`
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DisclaimerModal;