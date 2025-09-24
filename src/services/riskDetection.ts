import { Logger } from "@/utils/logger";

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskAssessment {
    level: RiskLevel;
    score: number; // 0-100 arası risk skoru
    triggers: string[]; // Riski tetikleyen kelimeler/cümleler
    warningMessage: string;
    requiresHumanReview: boolean;
}

export interface RiskKeywords {
    high: string[];
    medium: string[];
    contextual: string[]; // Bağlam gerektiren kelimeler
}

export class RiskDetectionService {

    private static readonly RISK_KEYWORDS: RiskKeywords = {
        high: [
            // Ceza hukuku
            'mahkeme', 'icra', 'ceza', 'tutuklama', 'gözaltı', 'suç', 'hapis',
            'kesin hüküm', 'beraat', 'mahkumiyet', 'dava', 'savcılık', 'polis',
            'karakol', 'ifade', 'sorgu', 'soruşturma', 'kovuşturma',

            // Kritik hukuki süreçler
            'haciz', 'icra takibi', 'ihtiyati tedbir', 'tedbir kararı',
            'vasi', 'kayyım', 'konkordato', 'iflas', 'aciz hali',
            'tereke', 'miras', 'vasiyet', 'velayet', 'nafaka',
            'boşanma', 'mal paylaşımı', 'tazminat davası',

            // Acil durumlar
            'acil', 'ivedi', 'süre dolumu', 'zamanaşımı', 'hak düşürücü süre',
            'temyiz', 'istinaf', 'yargıtay', 'danıştay', 'anayasa mahkemesi'
        ],

        medium: [
            // İş hukuku
            'iş sözleşmesi', 'fesih', 'kıdem tazminatı', 'ihbar tazminatı',
            'mobbing', 'işten çıkarma', 'sendika', 'grev', 'lokavt',

            // Kira/emlak
            'kira artışı', 'tahliye', 'kiracı', 'ev sahibi', 'depozito',
            'kira sözleşmesi', 'emlak', 'tapu', 'irtifak hakkı',

            // Ticaret hukuku
            'şirket', 'ortaklık', 'ticaret sicili', 'vergi', 'sgk',
            'sözleşme ihlali', 'ifa', 'temerrüt', 'garanti', 'ayıp',

            // Tüketici hakları
            'cayma hakkı', 'iade', 'değişim', 'garanti', 'servis',
            'tüketici hakları', 'rekabet kurumu'
        ],

        contextual: [
            // Bağlam gerektiren kelimeler
            'hak', 'yükümlülük', 'sorumluluk', 'sözleşme', 'anlaşma',
            'imza', 'onay', 'kabul', 'ret', 'iptal', 'fesih',
            'para', 'ödeme', 'borç', 'alacak', 'kredi', 'faiz'
        ]
    };

    private static readonly HIGH_RISK_PATTERNS = [
        /mahkeme.*dava/gi,
        /icra.*takip/gi,
        /ceza.*hapis/gi,
        /tutuklama.*gözaltı/gi,
        /haciz.*el koyma/gi,
        /süre.*dolum/gi,
        /acil.*ivedi/gi,
        /tazminat.*dava/gi
    ];

    private static readonly MEDIUM_RISK_PATTERNS = [
        /işten.*çıkarma/gi,
        /kira.*artış/gi,
        /sözleşme.*fesih/gi,
        /vergi.*borç/gi
    ];

    /**
     * Ana risk değerlendirme fonksiyonu
     */
    static assessRisk(text: string, documentType?: string): RiskAssessment {
        try {
            const normalizedText = text.toLowerCase().trim();
            let riskScore = 0;
            const triggers: string[] = [];

            // Yüksek risk kelimelerini kontrol et
            const highRiskMatches = this.findKeywordMatches(normalizedText, this.RISK_KEYWORDS.high);
            riskScore += highRiskMatches.length * 20;
            triggers.push(...highRiskMatches);

            // Orta risk kelimelerini kontrol et  
            const mediumRiskMatches = this.findKeywordMatches(normalizedText, this.RISK_KEYWORDS.medium);
            riskScore += mediumRiskMatches.length * 10;
            triggers.push(...mediumRiskMatches);

            // Pattern matching
            const highPatternMatches = this.findPatternMatches(normalizedText, this.HIGH_RISK_PATTERNS);
            riskScore += highPatternMatches.length * 25;
            triggers.push(...highPatternMatches);

            const mediumPatternMatches = this.findPatternMatches(normalizedText, this.MEDIUM_RISK_PATTERNS);
            riskScore += mediumPatternMatches.length * 15;
            triggers.push(...mediumPatternMatches);

            // Bağlamsal analiz
            const contextualScore = this.assessContextualRisk(normalizedText);
            riskScore += contextualScore;

            // Doküman tipi risk bonusu
            if (documentType) {
                riskScore += this.getDocumentTypeRiskBonus(documentType);
            }

            // Risk seviyesi belirleme
            const level = this.determineRiskLevel(riskScore);
            const warningMessage = this.generateWarningMessage(level, triggers);
            const requiresHumanReview = level === 'high' || riskScore > 70;

            const assessment: RiskAssessment = {
                level,
                score: Math.min(riskScore, 100),
                triggers: [...new Set(triggers)], // Benzersiz hale getir
                warningMessage,
                requiresHumanReview
            };

            // Log assessment
            Logger.log('RiskDetection', 'Risk assessment completed', {
                level,
                score: assessment.score,
                triggersCount: triggers.length,
                requiresReview: requiresHumanReview
            });

            return assessment;

        } catch (error) {
            Logger.error('RiskDetection', 'Risk assessment failed', error);

            // Güvenli fallback - her zaman orta risk döndür
            return {
                level: 'medium',
                score: 50,
                triggers: ['Risk değerlendirme hatası'],
                warningMessage: 'Risk değerlendirmesi yapılamadı. Güvenlik için uzman desteği almanızı öneriyoruz.',
                requiresHumanReview: true
            };
        }
    }

    /**
     * Kelime eşleşmelerini bul
     */
    private static findKeywordMatches(text: string, keywords: string[]): string[] {
        const matches: string[] = [];
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                matches.push(keyword);
            }
        }
        return matches;
    }

    /**
     * Pattern eşleşmelerini bul
     */
    private static findPatternMatches(text: string, patterns: RegExp[]): string[] {
        const matches: string[] = [];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                matches.push(match[0]);
            }
        }
        return matches;
    }

    /**
     * Bağlamsal risk değerlendirmesi
     */
    private static assessContextualRisk(text: string): number {
        let contextualScore = 0;

        // Cümle uzunluğu ve karmaşıklık
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length > 20) contextualScore += 5;

        // Hukuki terim yoğunluğu
        const legalTerms = this.RISK_KEYWORDS.contextual.filter(term =>
            text.includes(term.toLowerCase())
        ).length;
        contextualScore += Math.min(legalTerms * 2, 20);

        // Para miktarı referansları
        if (/\d+.*tl|lira|euro|dolar/gi.test(text)) {
            contextualScore += 10;
        }

        // Tarih ve süre referansları
        if (/\d+.*gün|ay|yıl|tarih/gi.test(text)) {
            contextualScore += 5;
        }

        return contextualScore;
    }

    /**
     * Doküman tipi risk bonusu
     */
    private static getDocumentTypeRiskBonus(documentType: string): number {
        const highRiskDocuments = ['mahkeme', 'icra', 'ceza', 'dava', 'tazminat'];
        const mediumRiskDocuments = ['kira', 'iş', 'sözleşme', 'fesih'];

        const docType = documentType.toLowerCase();

        if (highRiskDocuments.some(type => docType.includes(type))) {
            return 15;
        }

        if (mediumRiskDocuments.some(type => docType.includes(type))) {
            return 8;
        }

        return 0;
    }

    /**
     * Risk seviyesi belirleme
     */
    private static determineRiskLevel(score: number): RiskLevel {
        if (score >= 60) return 'high';
        if (score >= 30) return 'medium';
        return 'low';
    }

    /**
     * Risk seviyesine göre uyarı mesajı oluştur
     */
    private static generateWarningMessage(level: RiskLevel, triggers: string[]): string {
        const baseMessages = {
            high: 'Bu kritik bir hukuki konudur. Herhangi bir adım atmadan önce mutlaka bir avukata danışmanızı şiddetle tavsiye ederiz.',
            medium: 'Bu konuda profesyonel destek almanızı öneriyoruz. Hukuki süreçler karmaşık olabilir.',
            low: 'Bu bilgiler genel niteliktedir. Kişisel durumunuz için uzman görüşü almanız faydalı olacaktır.'
        };

        let message = baseMessages[level];

        // Özel trigger'lara göre ek uyarılar
        if (triggers.some(t => ['mahkeme', 'dava', 'icra'].includes(t.toLowerCase()))) {
            message += '\n\n🚨 Bu konu mahkeme süreci içeriyor. Hukuki temsil almanız kritik önem taşır.';
        }

        if (triggers.some(t => ['süre', 'zamanaşımı', 'hak düşürücü'].some(s => t.toLowerCase().includes(s)))) {
            message += '\n\n⏰ Süre sınırlaması olabilir. Gecikme hak kaybına yol açabilir.';
        }

        if (triggers.some(t => ['ceza', 'suç', 'hapis'].includes(t.toLowerCase()))) {
            message += '\n\n⚖️ Bu ceza hukuku konusudur. Derhal bir avukatla iletişime geçin.';
        }

        return message;
    }

    /**
     * Risk seviyesine göre UI tema renklerini al
     */
    static getRiskThemeColors(level: RiskLevel) {
        const themes = {
            high: {
                bg: 'bg-red-50',
                border: 'border-red-500',
                text: 'text-red-700',
                icon: 'text-red-500'
            },
            medium: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-500',
                text: 'text-yellow-700',
                icon: 'text-yellow-500'
            },
            low: {
                bg: 'bg-blue-50',
                border: 'border-blue-500',
                text: 'text-blue-700',
                icon: 'text-blue-500'
            }
        };

        return themes[level];
    }

    /**
     * Hızlı risk kontrolü (sadece kelime bazlı)
     */
    static quickRiskCheck(text: string): RiskLevel {
        const normalizedText = text.toLowerCase();

        // Yüksek risk kelimeler varsa
        const hasHighRisk = this.RISK_KEYWORDS.high.some(keyword =>
            normalizedText.includes(keyword.toLowerCase())
        );

        if (hasHighRisk) return 'high';

        // Orta risk kelimeler varsa
        const hasMediumRisk = this.RISK_KEYWORDS.medium.some(keyword =>
            normalizedText.includes(keyword.toLowerCase())
        );

        if (hasMediumRisk) return 'medium';

        return 'low';
    }
}