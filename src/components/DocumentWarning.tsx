import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Phone, ExternalLink } from "lucide-react";
import { RiskDetectionService, RiskLevel, RiskAssessment } from "@/services/riskDetection";
import { DisclaimerService } from "@/services/disclaimer";

interface DocumentWarningProps {
    documentType?: string;
    content?: string;
    riskLevel?: RiskLevel;
    riskAssessment?: RiskAssessment;
    variant?: 'inline' | 'modal' | 'print';
    className?: string;
}

export const DocumentWarning: React.FC<DocumentWarningProps> = ({
    documentType = "belge",
    content = "",
    riskLevel,
    riskAssessment,
    variant = 'inline',
    className = ""
}) => {
    // Risk değerlendirmesi
    const assessment = riskAssessment || (content ? RiskDetectionService.assessRisk(content, documentType) : null);
    const finalRiskLevel = riskLevel || assessment?.level || 'medium';

    // Risk renklerini al
    const riskColors = RiskDetectionService.getRiskThemeColors(finalRiskLevel);

    // Variant'a göre stil
    const getVariantStyles = () => {
        switch (variant) {
            case 'modal':
                return "max-w-2xl mx-auto";
            case 'print':
                return "border-2 border-red-500 bg-red-50 p-4 mb-4 print:block";
            default:
                return "mb-6";
        }
    };

    // Ana uyarı mesajı
    const warningMessage = assessment?.warningMessage ||
        DisclaimerService.getRiskWarningMessage(finalRiskLevel);

    return (
        <div className={`${getVariantStyles()} ${className}`}>
            {/* Ana Uyarı */}
            <Alert className={`${riskColors.bg} ${riskColors.border} border-l-4 mb-4`}>
                <AlertTriangle className={`h-5 w-5 ${riskColors.icon}`} />
                <AlertTitle className={`${riskColors.text} text-lg font-bold`}>
                    ⚠️ ÖNEMLİ HUKUKİ UYARI ⚠️
                </AlertTitle>
                <AlertDescription className={`${riskColors.text} mt-2`}>
                    <div className="space-y-2">
                        <p className="font-medium">
                            Bu belge <strong>Artiklo yapay zeka platformu</strong> tarafından oluşturulmuştur ve <strong>bilgi amaçlıdır</strong>.
                            Hukuki tavsiye niteliği taşımaz ve avukat görüşü yerine geçmez.
                        </p>

                        {finalRiskLevel === 'high' && (
                            <p className="text-red-700 font-bold bg-red-100 p-2 rounded">
                                🚨 Bu belge YÜKSEK RİSK içermektedir. Kullanmadan önce mutlaka bir avukata danışınız.
                            </p>
                        )}
                    </div>
                </AlertDescription>
            </Alert>

            {/* Detaylı Bilgilendirme */}
            <Card className="border-2 border-gray-300">
                <CardContent className="p-4 space-y-4">
                    {/* Yapmanız Gerekenler */}
                    <div>
                        <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                            ✅ YAPMANIZ GEREKENLER:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                            <li>Bu belgeyi kullanmadan önce mutlaka bir avukata danışın</li>
                            <li>Belgenin hukuki geçerliliğini doğrulattırın</li>
                            <li>Size özel durumunuza uygun olup olmadığını kontrol ettirin</li>
                            <li>Gerekli yasal süreçleri bir uzman ile planlayın</li>
                            {finalRiskLevel === 'high' && (
                                <li className="font-bold">Herhangi bir adım atmadan önce hukuki danışmanlık alın</li>
                            )}
                        </ul>
                    </div>

                    {/* Dikkat Edilmesi Gerekenler */}
                    <div>
                        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            ❌ DİKKAT EDİN:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                            <li>Bu belgeyi olduğu gibi mahkemeye vermeyiniz</li>
                            <li>Hukuki süreçleri bu belgeye dayanarak başlatmayınız</li>
                            <li>AI halüsinasyonu olabileceğini unutmayınız</li>
                            <li>Belge içeriği eksik veya yanlış bilgi içerebilir</li>
                            {assessment?.triggers && assessment.triggers.length > 0 && (
                                <li className="font-bold">
                                    Risk faktörleri tespit edildi: {assessment.triggers.slice(0, 3).join(", ")}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Risk Seviyesi Uyarısı */}
                    {finalRiskLevel !== 'low' && (
                        <div className={`p-3 rounded ${riskColors.bg} ${riskColors.border} border`}>
                            <h3 className={`font-bold ${riskColors.text} mb-1`}>
                                {finalRiskLevel === 'high' ? '🔴 YÜKSEK RİSK' : '🟡 ORTA RİSK'}
                            </h3>
                            <p className={`text-sm ${riskColors.text}`}>
                                {warningMessage}
                            </p>
                        </div>
                    )}

                    {/* Profesyonel Destek */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            📞 PROFESYONEL DESTEK:
                        </h3>
                        <div className="text-sm text-blue-700 space-y-1">
                            <div className="flex justify-between">
                                <span>Türkiye Barolar Birliği:</span>
                                <span className="font-mono font-bold">0312 425 71 00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Adalet Bakanlığı Hukuk İşleri:</span>
                                <span className="font-mono font-bold">0312 419 60 00</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-blue-200">
                                <a
                                    href="https://barobirlik.org.tr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Online avukat bulma hizmeti
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* AI Bilgisi */}
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                        <div className="flex items-start gap-2">
                            <Shield className="h-4 w-4 text-gray-600 mt-0.5" />
                            <div className="text-xs text-gray-600">
                                <p className="font-medium mb-1">Yapay Zeka Hakkında:</p>
                                <p>
                                    Bu belge, Artiklo'nun yapay zeka teknolojisi kullanılarak oluşturulmuştur.
                                    AI sistemleri hata yapabilir, eksik bilgi verebilir veya güncel olmayan
                                    mevzuatı referans alabilir. Belgenin doğruluğu ve güncelliği garanti edilmez.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sorumluluk Reddi */}
                    <div className="text-center p-3 bg-red-50 border-2 border-red-200 rounded">
                        <p className="text-sm text-red-800 font-bold">
                            ⚖️ Artiklo Ltd. Şti. herhangi bir hukuki sorumluluk kabul etmez.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Print için ek uyarı */}
            {variant === 'print' && (
                <div className="print:block hidden border-t-4 border-red-500 pt-2 mt-4">
                    <p className="text-center font-bold text-red-700">
                        Bu belge bilgilendirme amaçlıdır. Kullanmadan önce mutlaka avukata danışınız.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DocumentWarning;