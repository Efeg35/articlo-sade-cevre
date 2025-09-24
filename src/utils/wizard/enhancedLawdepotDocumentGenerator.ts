/**
 * Enhanced LawDepot Document Generator
 * Enhanced Wizard (21-step) + LawDepot "Akıllı Lego Seti" Integration
 */

import { lawdepotGenerator, LawDepotGenerationRequest } from '@/services/lawdepotDocumentGenerator';
import { WizardAnswers } from '@/types/wizard';

/**
 * Enhanced Wizard answers'ı LawDepot formatına çevir
 */
export function mapEnhancedWizardToLawDepot(answers: WizardAnswers): LawDepotGenerationRequest['wizard_answers'] {
    // Helper function to safely get string value
    const getStringValue = (key: string): string => {
        const value = answers[key];
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null && 'value' in value) {
            return String(value.value);
        }
        return '';
    };

    // Helper function to safely get number value
    const getNumberValue = (key: string): number => {
        const value = answers[key];
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return Number(value) || 0;
        if (typeof value === 'object' && value !== null && 'value' in value) {
            return Number(value.value) || 0;
        }
        return 0;
    };

    // Helper function to safely get boolean value
    const getBooleanValue = (key: string, checkValue: string = 'evet'): boolean => {
        const value = answers[key];
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value === checkValue;
        if (typeof value === 'object' && value !== null && 'value' in value) {
            return String(value.value) === checkValue;
        }
        return false;
    };

    // Helper function to safely get array value
    const getArrayValue = (key: string): string[] => {
        const value = answers[key];
        if (Array.isArray(value)) return value.map(String);
        if (typeof value === 'object' && value !== null && 'value' in value) {
            const arrayValue = value.value;
            if (Array.isArray(arrayValue)) return arrayValue.map(String);
        }
        return [];
    };

    // Enhanced wizard 21-step field'larını LawDepot clause system'e map et
    const mappedAnswers: Record<string, string | number | boolean | string[]> = {
        // Document Type
        document_type: "kira_itiraz",

        // KIRACΙ BİLGİLERİ (Step 1-5)
        kiraci_ad_soyad: getStringValue('kiracı_ad'),
        kiraci_tc: getStringValue('kiracı_tc'),
        kiraci_adres: getStringValue('kiracı_adres'),
        kiraci_telefon: getStringValue('kiracı_tel'),
        kiraci_email: getStringValue('kiracı_email'),

        // Meslek ve gelir durumu
        meslek: getStringValue('meslek'),
        aylık_gelir: getNumberValue('aylık_gelir'),
        medeni_durum: getStringValue('medeni_durum'),

        // Vekil durumu
        vekil_var_mı: getBooleanValue('vekil_var_mı'),
        vekil_ad_soyad: getStringValue('vekil_ad'),

        // MÜLK DETAYLARI (Step 6-9)
        mulk_adres: getStringValue('mülk_adres'),
        mulk_il_ilce: `${getStringValue('mülk_il')}/${getStringValue('mülk_ilçe')}`,
        mulk_mahalle: getStringValue('mülk_mahalle'),
        mulk_tip: getStringValue('mülk_tip'),
        mulk_metrekare: `${getNumberValue('metrekare')} m²`,
        mulk_oda_sayisi: getStringValue('oda_sayısı'),
        mulk_kat: getStringValue('kat_bilgisi'),
        mulk_durumu: getStringValue('mülk_durumu'),

        // EV SAHİBİ BİLGİLERİ (Step 10-12)
        ev_sahibi_ad_soyad: getStringValue('ev_sahibi_ad'),
        ev_sahibi_tc: getStringValue('ev_sahibi_tc'),
        ev_sahibi_adres: getStringValue('ev_sahibi_adres'),
        ev_sahibi_telefon: getStringValue('ev_sahibi_tel'),

        // SÖZLEŞME BİLGİLERİ (Step 13-16)
        sozlesme_tarihi: getStringValue('sözleşme_tarihi'),
        kira_baslangic_tarihi: getStringValue('sözleşme_başlama'),
        sozlesme_suresi: getStringValue('sözleşme_süresi'),
        ilk_kira_bedeli: getNumberValue('ilk_kira'),
        mevcut_kira_bedeli: getNumberValue('mevcut_kira'),

        // Ödeme durumu
        odeme_duzenli_mi: getStringValue('ödeme_düzenli_mi'),
        makbuz_var_mi: getStringValue('makbuz_var_mı'),
        depozito_miktari: getNumberValue('depozito_tutarı'),

        // ARTIRIM DETAYLARI (Step 17-19)
        artirim_talep_tarihi: getStringValue('bildirim_tarihi'),
        yeni_kira_talebi: getNumberValue('yeni_kira'),
        eski_kira_bedeli: getNumberValue('mevcut_kira'),
        artirim_orani: calculateIncreasePercentage(getNumberValue('mevcut_kira'), getNumberValue('yeni_kira')),
        artirim_gerekce: getStringValue('ev_sahibi_gerekçesi'),

        // Piyasa karşılaştırması
        piyasa_analizi_var: getBooleanValue('piyasa_araştırması_yaptınız_mı'),
        ortalama_piyasa_kira: getNumberValue('ortalama_piyasa_kira'),

        // İTİRAZ STRATEJİSİ (Step 20-21)
        itiraz_nedenleri: getArrayValue('itiraz_nedenleri'),
        detayli_gerekce: getStringValue('detaylı_gerekçe'),
        itiraz_turu: mapTalepTuruToItirazTuru(getStringValue('talep_türü')),
        karsi_oneri_var: getStringValue('talep_türü') === 'makul_artırım' || getNumberValue('önerilen_kira') > 0,
        onerilen_kira_bedeli: getNumberValue('önerilen_kira'),
        uzlasmaya_acik_mi: getStringValue('uzlaşmaya_açık_mısınız'),

        // Ek bilgiler
        ev_sahibi_gerekce_turu: getArrayValue('gerekçe_türleri'),
        ekonomik_durum: mapEconomicStatus(getNumberValue('aylık_gelir'), getNumberValue('mevcut_kira')),
        kira_suresi_yil: calculateTenancyYears(getStringValue('sözleşme_başlama')),

        // Wizard metadata
        wizard_version: 'enhanced-21-step',
        generation_timestamp: new Date().toISOString()
    };

    // Condition-based mappings
    if (getStringValue('bildirim_şekli') !== 'resmi_tebligat') {
        mappedAnswers.yasal_sure_asimi = checkLegalDeadline(
            getStringValue('bildirim_tarihi'),
            getStringValue('yürürlük_tarihi')
        );
    }

    return mappedAnswers;
}

/**
 * Artırım oranını hesapla
 */
function calculateIncreasePercentage(currentRent: number, newRent: number): number {
    if (!currentRent || !newRent) return 0;
    return Math.round(((newRent - currentRent) / currentRent) * 100);
}

/**
 * Talep türünü itiraz türüne map et
 */
function mapTalepTuruToItirazTuru(talepTuru: string): string {
    switch (talepTuru) {
        case 'tamamen_ret':
            return 'tam_ret';
        case 'makul_artırım':
        case 'kademeli_artırım':
        case 'mahkeme_tespiti':
            return 'karsi_oneri';
        default:
            return 'tam_ret';
    }
}

/**
 * Ekonomik durumu değerlendir
 */
function mapEconomicStatus(monthlyIncome: number, currentRent: number): string {
    if (!monthlyIncome || !currentRent) return 'bilinmiyor';

    const rentToIncomeRatio = currentRent / monthlyIncome;

    if (rentToIncomeRatio > 0.4) return 'zor';
    if (rentToIncomeRatio > 0.3) return 'orta';
    return 'iyi';
}

/**
 * Kiracılık süresini yıl olarak hesapla
 */
function calculateTenancyYears(startDate: string): number {
    if (!startDate) return 0;

    try {
        const start = new Date(startDate);
        const now = new Date();
        const diffInMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        return Math.floor(diffInMonths / 12);
    } catch {
        return 0;
    }
}

/**
 * Yasal süre aşımını kontrol et
 */
function checkLegalDeadline(notificationDate: string, effectiveDate: string): boolean {
    try {
        const notification = new Date(notificationDate);
        const effective = new Date(effectiveDate);
        const daysDifference = Math.floor((effective.getTime() - notification.getTime()) / (1000 * 60 * 60 * 24));

        // TBK m.344: En az 30 gün önceden bildirim gerekli
        return daysDifference < 30;
    } catch {
        return false;
    }
}

/**
 * Enhanced Wizard'dan LawDepot Document generate et
 */
export async function generateEnhancedLawDepotDocument(wizardAnswers: WizardAnswers) {
    try {
        console.log('🧙‍♂️ Enhanced Wizard → LawDepot Document Generation başlıyor...');

        // 1. Wizard answers'ı LawDepot formatına çevir
        const lawdepotAnswers = mapEnhancedWizardToLawDepot(wizardAnswers);

        // 2. LawDepot generation request oluştur
        const generationRequest: LawDepotGenerationRequest = {
            document_type: 'kira_itiraz',
            wizard_answers: lawdepotAnswers,
            session_id: `enhanced-wizard-${Date.now()}`
        };

        // 3. LawDepot Generator ile belge oluştur
        console.log('📋 LawDepot Generator çalıştırılıyor...');
        const result = await lawdepotGenerator.generateDocument(generationRequest);

        if (result.success) {
            console.log('✅ Enhanced LawDepot Document başarıyla oluşturuldu!');
            console.log(`📊 Kalite Skoru: ${result.document.metadata.lawdepot_quality_score}/100`);
            console.log(`📄 Clause Sayısı: ${result.document.metadata.clause_count}`);
            console.log(`🔤 Kelime Sayısı: ${result.document.metadata.word_count}`);

            return {
                success: true,
                document: result.document,
                metadata: {
                    ...result.document.metadata,
                    wizard_type: 'enhanced-21-step',
                    generation_method: 'lawdepot-clause-based',
                    legal_references_count: result.document.metadata.legal_references.length
                },
                performance: result.performance_stats,
                validation: result.validation_results
            };
        } else {
            console.error('❌ LawDepot Document generation hatası:', result.error);
            return {
                success: false,
                error: result.error,
                fallback_available: true
            };
        }

    } catch (error) {
        console.error('❌ Enhanced LawDepot Generation kritik hata:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            fallback_available: true
        };
    }
}

/**
 * Enhanced wizard completion rate analizi
 */
export function analyzeEnhancedWizardCompletion(wizardAnswers: WizardAnswers): {
    completionRate: number;
    missingCriticalFields: string[];
    warnings: string[];
    recommendedActions: string[];
} {
    const criticalFields = [
        'kiracı_ad', 'kiracı_tc', 'kiracı_adres',
        'mülk_adres', 'mülk_il', 'mülk_ilçe',
        'ev_sahibi_ad', 'sözleşme_tarihi',
        'ilk_kira', 'mevcut_kira', 'yeni_kira',
        'bildirim_tarihi', 'talep_türü'
    ];

    const optionalButImportantFields = [
        'meslek', 'aylık_gelir', 'ev_sahibi_tel',
        'piyasa_araştırması_yaptınız_mı', 'detaylı_gerekçe'
    ];

    const missingCritical: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Helper function to check if field is empty
    const isFieldEmpty = (field: string): boolean => {
        const value = wizardAnswers[field];
        if (!value) return true;
        if (typeof value === 'string') return value === '';
        if (typeof value === 'object' && 'value' in value) {
            return !value.value || value.value === '';
        }
        return false;
    };

    // Critical fields kontrolü
    criticalFields.forEach(field => {
        if (isFieldEmpty(field)) {
            missingCritical.push(field);
        }
    });

    // Optional but important fields
    optionalButImportantFields.forEach(field => {
        if (isFieldEmpty(field)) {
            warnings.push(`${field} alanı doldurulmamış - belge kalitesini artırabilir`);
        }
    });

    // Helper to get number value
    const getNumValue = (field: string): number => {
        const value = wizardAnswers[field];
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return Number(value) || 0;
        if (typeof value === 'object' && value && 'value' in value) {
            return Number(value.value) || 0;
        }
        return 0;
    };

    // Helper to get string value
    const getStrValue = (field: string): string => {
        const value = wizardAnswers[field];
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value && 'value' in value) {
            return String(value.value);
        }
        return '';
    };

    // Business logic kontrolleri
    const currentRent = getNumValue('mevcut_kira');
    const newRent = getNumValue('yeni_kira');
    const increaseRate = calculateIncreasePercentage(currentRent, newRent);

    if (increaseRate > 50) {
        warnings.push('Artırım oranı çok yüksek - ek hukuki destek önerilir');
        recommendations.push('Avukat desteği alınması önerilir');
    }

    if (increaseRate < 10) {
        warnings.push('Artırım oranı düşük - itirazın gerekli olup olmadığını değerlendirin');
    }

    const piyasaArastirmasi = getStrValue('piyasa_araştırması_yaptınız_mı');
    if (!piyasaArastirmasi || piyasaArastirmasi === 'hayır') {
        recommendations.push('Bölgesel piyasa araştırması yapılması önerilir');
    }

    const completionRate = Math.round(
        ((criticalFields.length - missingCritical.length) / criticalFields.length) * 100
    );

    return {
        completionRate,
        missingCriticalFields: missingCritical,
        warnings,
        recommendedActions: recommendations
    };
}

/**
 * LawDepot quality preview (belge oluşturmadan önce kalite tahmini)
 */
export function predictLawDepotQuality(wizardAnswers: WizardAnswers): {
    predictedScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
} {
    let score = 85; // Base score
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Helper to get string value
    const getStrValue = (field: string): string => {
        const value = wizardAnswers[field];
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value && 'value' in value) {
            return String(value.value);
        }
        return '';
    };

    // Helper to get number value
    const getNumValue = (field: string): number => {
        const value = wizardAnswers[field];
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return Number(value) || 0;
        if (typeof value === 'object' && value && 'value' in value) {
            return Number(value.value) || 0;
        }
        return 0;
    };

    // Positive factors
    const detayliGerekce = getStrValue('detaylı_gerekçe');
    if (detayliGerekce && detayliGerekce.length > 200) {
        score += 5;
        strengths.push('Detaylı itiraz gerekçesi mevcut');
    }

    if (getStrValue('piyasa_araştırması_yaptınız_mı') === 'evet') {
        score += 5;
        strengths.push('Piyasa araştırması yapılmış');
    }

    if (getStrValue('makbuz_var_mı') === 'evet_hepsi') {
        score += 5;
        strengths.push('Tüm ödeme belgeleri mevcut');
    }

    if (getStrValue('vekil_var_mı') === 'evet') {
        score += 3;
        strengths.push('Hukuki destek alınıyor');
    }

    // Negative factors
    const increaseRate = calculateIncreasePercentage(
        getNumValue('mevcut_kira'),
        getNumValue('yeni_kira')
    );

    if (increaseRate > 100) {
        score -= 10;
        weaknesses.push('Çok yüksek artırım oranı - savunması zor');
    }

    if (!getStrValue('ev_sahibi_adres')) {
        score -= 5;
        weaknesses.push('Ev sahibi adres bilgisi eksik');
        suggestions.push('Ev sahibinin adres bilgisini temin edin');
    }

    if (getStrValue('ödeme_düzenli_mi') !== 'evet') {
        score -= 5;
        weaknesses.push('Düzensiz ödeme geçmişi');
        suggestions.push('Ödeme gecikmelerinin geçerli sebeplerini vurgulayın');
    }

    return {
        predictedScore: Math.max(0, Math.min(100, score)),
        strengths,
        weaknesses,
        suggestions
    };
}

/**
 * Development test function
 */
export async function testEnhancedLawDepotIntegration() {
    console.log('🧪 Enhanced LawDepot Integration Test');

    // Helper to create WizardStepAnswers format
    const createAnswer = (value: string | number | boolean | string[]) => ({ value, isValid: true });

    const testWizardAnswers: WizardAnswers = {
        // Step 1-2: Kiracı bilgileri
        kiracı_ad: createAnswer('Ahmet Mehmet YILMAZ'),
        kiracı_tc: createAnswer('12345678901'),
        kiracı_adres: createAnswer('Kadıköy Mahallesi Test Sokak No:15 D:3 Kadıköy/İstanbul'),
        kiracı_tel: createAnswer('0555 123 45 67'),
        kiracı_email: createAnswer('ahmet@test.com'),

        // Step 3: Meslek
        meslek: createAnswer('Mühendis'),
        aylık_gelir: createAnswer(15000),

        // Step 6-7: Mülk
        mülk_adres: createAnswer('Kadıköy Mahallesi Test Sokak No:15 D:3'),
        mülk_il: createAnswer('İstanbul'),
        mülk_ilçe: createAnswer('Kadıköy'),
        mülk_tip: createAnswer('daire'),
        oda_sayısı: createAnswer('2+1'),
        metrekare: createAnswer(85),

        // Step 10: Ev sahibi
        ev_sahibi_ad: createAnswer('Mehmet ÖZKAN'),

        // Step 13-14: Sözleşme
        sözleşme_tarihi: createAnswer('2023-01-15'),
        sözleşme_başlama: createAnswer('2023-02-01'),
        ilk_kira: createAnswer(3000),
        mevcut_kira: createAnswer(3500),

        // Step 17: Artırım
        yeni_kira: createAnswer(5000),
        bildirim_tarihi: createAnswer('2024-01-15'),

        // Step 20-21: İtiraz
        itiraz_nedenleri: createAnswer(['aşırı_artırım', 'piyasa_değeri']),
        detaylı_gerekçe: createAnswer('Test gerekçesi - artırım çok yüksek ve piyasa değerlerinin üzerinde'),
        talep_türü: createAnswer('makul_artırım'),
        önerilen_kira: createAnswer(4000)
    };

    const result = await generateEnhancedLawDepotDocument(testWizardAnswers);
    console.log('Test Result:', result);

    return result;
}