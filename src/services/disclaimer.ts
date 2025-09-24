import { Logger } from "@/utils/logger";

export interface DisclaimerMetrics {
    documentType: string;
    disclaimerShown: boolean;
    userAccepted: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    timestamp: Date;
    userId: string;
}

export interface DisclaimerConfig {
    title: string;
    description: string;
    checkboxes: {
        id: string;
        label: string;
        required: boolean;
    }[];
    riskLevel: 'low' | 'medium' | 'high';
}

export class DisclaimerService {
    private static readonly STORAGE_KEY = 'artiklo_disclaimer_history';

    /**
     * Ana disclaimer modalı için konfigurasyon
     */
    static getDocumentDisclaimerConfig(documentType: string, riskLevel: 'low' | 'medium' | 'high'): DisclaimerConfig {
        return {
            title: "🛡️ Hukuki Sorumluluk Reddi",
            description: "Bu belgeyi indirmek için lütfen aşağıdakileri onaylayın:",
            checkboxes: [
                {
                    id: "ai_generated",
                    label: "Bu belgenin AI tarafından oluşturulduğunu ve hukuki tavsiye olmadığını anlıyorum",
                    required: true
                },
                {
                    id: "lawyer_consultation",
                    label: "Kullanmadan önce mutlaka bir avukata danışacağım",
                    required: true
                },
                {
                    id: "no_liability",
                    label: "Artiklo'nun herhangi bir hukuki sorumluluğu olmadığını kabul ediyorum",
                    required: true
                },
                ...(riskLevel === 'high' ? [{
                    id: "high_risk_acknowledged",
                    label: "Bu konunun yüksek hukuki risk taşıdığını anlıyorum ve profesyonel destek alacağım",
                    required: true
                }] : [])
            ],
            riskLevel
        };
    }

    /**
     * Belge içine eklenecek watermark metni
     */
    static getDocumentWatermark(): string {
        return "Bu belge Artiklo AI tarafından oluşturulmuştur - Hukuki tavsiye değildir";
    }

    /**
     * Belge başında gösterilecek uyarı metni
     */
    static getDocumentHeaderWarning(): string {
        return `⚠️ ÖNEMLİ HUKUKİ UYARI ⚠️

Bu belge Artiklo yapay zeka platformu tarafından oluşturulmuştur ve bilgi 
amaçlıdır. Hukuki tavsiye niteliği taşımaz ve avukat görüşü yerine geçmez.

✅ YAPMANIZ GEREKENLER:
• Bu belgeyi kullanmadan önce mutlaka bir avukata danışın
• Belgenin hukuki geçerliliğini doğrulattırın  
• Size özel durumunuza uygun olup olmadığını kontrol ettirin
• Gerekli yasal süreçleri bir uzman ile planlayın

❌ DİKKAT EDİN:
• Bu belgeyi olduğu gibi mahkemeye vermeyiniz
• Hukuki süreçleri bu belgeye dayanarak başlatmayınız
• AI halüsinasyonu olabileceğini unutmayınız

📞 PROFESYONEL DESTEK:
Türkiye Barolar Birliği: 0312 425 71 00
Adalet Bakanlığı Hukuk İşleri: 0312 419 60 00

Artiklo Ltd. Şti. herhangi bir hukuki sorumluluk kabul etmez.`;
    }

    /**
     * Belge sonunda gösterilecek uyarı metni
     */
    static getDocumentFooterWarning(): string {
        return "Bu belge bilgilendirme amaçlıdır. Kullanmadan önce mutlaka avukata danışınız.";
    }

    /**
     * AI yanıtlarına eklenecek hatırlatma metni
     */
    static getAIResponseDisclaimer(): string {
        return `---
⚠️ Hatırlatma: Bu bilgiler genel niteliktedir ve sizin özel durumunuz için 
hukuki tavsiye değildir. Bir avukatla görüşmenizi öneriyoruz.`;
    }

    /**
     * Risk seviyesine göre uyarı mesajı
     */
    static getRiskWarningMessage(riskLevel: 'low' | 'medium' | 'high'): string {
        switch (riskLevel) {
            case 'high':
                return 'Bu kritik bir hukuki konudur. Herhangi bir adım atmadan önce mutlaka bir avukata danışmanızı şiddetle tavsiye ederiz.';
            case 'medium':
                return 'Bu konuda profesyonel destek almanızı öneriyoruz. Hukuki süreçler karmaşık olabilir.';
            default:
                return 'Bu bilgiler genel niteliktedir. Kişisel durumunuz için uzman görüşü almanız faydalı olacaktır.';
        }
    }

    /**
     * Chat interface başında gösterilecek uyarı
     */
    static getChatInitialWarning(): string {
        return `Bu bir hukuki danışmanlık değildir.

AI asistanım size genel bilgiler verir ve belge önerileri hazırlar. 
Herhangi bir hukuki karar vermeden önce mutlaka bir avukata danışın.`;
    }

    /**
     * Disclaimer kabul edilmesini kaydet
     */
    static trackDisclaimerAcceptance(userId: string, documentType: string, riskLevel: 'low' | 'medium' | 'high'): void {
        try {
            const metrics: DisclaimerMetrics = {
                documentType,
                disclaimerShown: true,
                userAccepted: true,
                riskLevel,
                timestamp: new Date(),
                userId
            };

            // Local storage'a kaydet
            const existing = this.getDisclaimerHistory();
            existing.push(metrics);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));

            // Log for analytics
            Logger.log('Disclaimer', 'User accepted disclaimer', metrics);

        } catch (error) {
            Logger.error('Disclaimer', 'Failed to track disclaimer acceptance', error);
        }
    }

    /**
     * Disclaimer geçmişini getir
     */
    static getDisclaimerHistory(): DisclaimerMetrics[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            Logger.error('Disclaimer', 'Failed to get disclaimer history', error);
            return [];
        }
    }

    /**
     * Belgeye watermark ekle
     */
    static addDocumentWatermark(content: string): string {
        const watermark = this.getDocumentWatermark();
        const headerWarning = this.getDocumentHeaderWarning();
        const footerWarning = this.getDocumentFooterWarning();

        return `${headerWarning}

---

${content}

---

${footerWarning}

${watermark}`;
    }

    /**
     * Disclaimer gösterilip gösterilmeyeceğini kontrol et
     */
    static shouldShowDisclaimer(userId: string, documentType: string): boolean {
        // Her belge için disclaimer göster (güvenlik için)
        return true;
    }

    /**
     * Kullanıcının disclaimer kabul geçmişi var mı kontrol et
     */
    static hasUserAcceptedBefore(userId: string, documentType: string): boolean {
        const history = this.getDisclaimerHistory();
        return history.some(h => h.userId === userId && h.documentType === documentType && h.userAccepted);
    }
}