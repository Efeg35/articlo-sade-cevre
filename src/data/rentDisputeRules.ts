/**
 * LawDepot "Akıllı Lego Seti" - Kira İtiraz Rule Set
 * Deterministik kural seti: Wizard answers -> Clause selection
 */

import { RuleSet, ConditionalRule, ClauseCondition, UsageContext } from '@/types/clause';

export const RENT_DISPUTE_RULE_SET: RuleSet = {
    document_type: "kira_itiraz_dilekce",
    rules: [
        // PRIORITY 1: Header - Her zaman dahil
        {
            rule_id: "INCLUDE_HEADER",
            description: "Dilekçe başlığı her zaman dahil edilir",
            condition: [
                { field: "document_type", operator: "==", value: "kira_itiraz" }
            ],
            then_clauses: ["HEADER_RENT_DISPUTE_TR_v1"],
            priority: 1
        },

        // PRIORITY 2: Taraf bilgileri - Her zaman dahil
        {
            rule_id: "INCLUDE_PARTY_INFO",
            description: "Davacı ve davalı bilgileri her zaman dahil",
            condition: [
                { field: "kiraci_ad_soyad", operator: "!=", value: "" }
            ],
            then_clauses: [
                "PLAINTIFF_INFO_TR_v1",
                "DEFENDANT_INFO_TR_v1"
            ],
            priority: 2
        },

        // PRIORITY 3: Mülk ve sözleşme bilgileri - Her zaman dahil
        {
            rule_id: "INCLUDE_BASIC_INFO",
            description: "Mülk ve sözleşme bilgileri temel gereksinimler",
            condition: [
                { field: "mulk_adres", operator: "!=", value: "" }
            ],
            then_clauses: [
                "PROPERTY_DETAILS_TR_v1",
                "CONTRACT_INFO_TR_v1",
                "RENT_INCREASE_DETAILS_TR_v1"
            ],
            priority: 3
        },

        // PRIORITY 4: Yüksek artırım itirazı (>25%)
        {
            rule_id: "HIGH_INCREASE_OBJECTION",
            description: "%25'ten fazla artırım için güçlü itiraz",
            condition: [
                { field: "artirim_orani", operator: ">", value: 25 }
            ],
            then_clauses: ["HIGH_INCREASE_OBJECTION_TR_v1"],
            else_clauses: [], // Başka bir rule handle edecek
            priority: 4
        },

        // PRIORITY 5: Orta seviye artırım itirazı (10-25%)
        {
            rule_id: "MODERATE_INCREASE_OBJECTION",
            description: "%10-25 arası artırım için orta seviye itiraz",
            condition: [
                { field: "artirim_orani", operator: ">", value: 10 },
                { field: "artirim_orani", operator: "<", value: 25 }
            ],
            then_clauses: ["MODERATE_INCREASE_OBJECTION_TR_v1"],
            priority: 5
        },

        // PRIORITY 6: Karşı öneri var mı?
        {
            rule_id: "INCLUDE_COUNTER_OFFER",
            description: "Karşı öneri varsa dahil et",
            condition: [
                { field: "karsi_oneri_var", operator: "==", value: true },
                { field: "onerilen_kira_bedeli", operator: "!=", value: "" }
            ],
            then_clauses: ["COUNTER_OFFER_TR_v1"],
            priority: 6
        },

        // PRIORITY 7A: Tam ret talebi
        {
            rule_id: "FULL_REJECTION_REQUEST",
            description: "Kira artırımının tamamen reddedilmesi talebi",
            condition: [
                { field: "itiraz_turu", operator: "==", value: "tam_ret" }
            ],
            then_clauses: ["REQUEST_INCREASE_REJECTION_TR_v1"],
            priority: 7
        },

        // PRIORITY 7B: Karşı öneri talebi
        {
            rule_id: "COUNTER_OFFER_REQUEST",
            description: "Karşı öneri ile talep",
            condition: [
                { field: "itiraz_turu", operator: "==", value: "karsi_oneri" }
            ],
            then_clauses: ["REQUEST_WITH_COUNTER_OFFER_TR_v1"],
            priority: 7
        },

        // PRIORITY 8: İmza bölümü - Her zaman dahil
        {
            rule_id: "INCLUDE_SIGNATURE",
            description: "İmza bölümü her zaman en son dahil edilir",
            condition: [
                { field: "kiraci_ad_soyad", operator: "!=", value: "" }
            ],
            then_clauses: ["SIGNATURE_SECTION_TR_v1"],
            priority: 8
        },

        // ADVANCED RULES: İlave koşullu clause'lar

        // Ekonomik durum zor ise ek itiraz
        {
            rule_id: "ECONOMIC_HARDSHIP",
            description: "Ekonomik zorluk durumunda ek itiraz clause'u",
            condition: [
                { field: "ekonomik_durum", operator: "==", value: "zor" },
                { field: "artirim_orani", operator: ">", value: 15 }
            ],
            then_clauses: ["ECONOMIC_HARDSHIP_OBJECTION_TR_v1"],
            priority: 9
        },

        // Mülkün durumu kötü ise ek itiraz  
        {
            rule_id: "PROPERTY_CONDITION",
            description: "Mülk durumu kötüyse ek itiraz",
            condition: [
                { field: "mulk_durumu", operator: "==", value: "kotu" }
            ],
            then_clauses: ["PROPERTY_CONDITION_OBJECTION_TR_v1"],
            priority: 10
        },

        // Bölgesel piyasa analizi var mı?
        {
            rule_id: "MARKET_ANALYSIS",
            description: "Piyasa analizi varsa dahil et",
            condition: [
                { field: "piyasa_analizi_var", operator: "==", value: true }
            ],
            then_clauses: ["MARKET_ANALYSIS_CLAUSE_TR_v1"],
            priority: 11
        },

        // Ev sahibinin gerekçesi geçersiz
        {
            rule_id: "INVALID_REASONING",
            description: "Ev sahibinin gerekçesi geçersiz ise itiraz",
            condition: [
                { field: "artirim_gerekce_gecerli", operator: "==", value: false }
            ],
            then_clauses: ["INVALID_REASONING_OBJECTION_TR_v1"],
            priority: 12
        },

        // Yasal süre aşımı kontrolü
        {
            rule_id: "LEGAL_DEADLINE_CHECK",
            description: "Yasal süre kontrolü",
            condition: [
                { field: "yasal_sure_asimi", operator: "==", value: true }
            ],
            then_clauses: ["LEGAL_DEADLINE_OBJECTION_TR_v1"],
            priority: 13
        },

        // Uzun süreli kiracı ise ek vurgu
        {
            rule_id: "LONG_TERM_TENANT",
            description: "Uzun süreli kiracı için ek clause",
            condition: [
                { field: "kira_suresi_yil", operator: ">", value: 3 }
            ],
            then_clauses: ["LONG_TERM_TENANT_CLAUSE_TR_v1"],
            priority: 14
        }
    ],
    metadata: {
        created_by: "legal_expert_1",
        created_at: "2024-01-15T10:00:00Z",
        version: "1.0.0"
    }
};

// Helper function: Rule set validation
export function validateRentDisputeAnswers(answers: Record<string, string | number | boolean>): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
} {
    const requiredFields = [
        'kiraci_ad_soyad',
        'kiraci_tc',
        'kiraci_adres',
        'ev_sahibi_ad_soyad',
        'ev_sahibi_adres',
        'mulk_adres',
        'mulk_il_ilce',
        'sozlesme_tarihi',
        'ilk_kira_bedeli',
        'mevcut_kira_bedeli',
        'artirim_talep_tarihi',
        'eski_kira_bedeli',
        'yeni_kira_talebi',
        'artirim_orani',
        'itiraz_turu'
    ];

    const missingFields: string[] = [];
    const warnings: string[] = [];

    // Required fields kontrolü
    requiredFields.forEach(field => {
        if (!answers[field] || answers[field] === '') {
            missingFields.push(field);
        }
    });

    // Business logic warnings
    if (answers.artirim_orani && Number(answers.artirim_orani) < 5) {
        warnings.push('Artırım oranı çok düşük - itiraz gerekli olmayabilir');
    }

    if (answers.artirim_orani && Number(answers.artirim_orani) > 50) {
        warnings.push('Artırım oranı çok yüksek - ek hukuki destek önerilir');
    }

    if (answers.itiraz_turu === 'karsi_oneri' && !answers.onerilen_kira_bedeli) {
        missingFields.push('onerilen_kira_bedeli');
    }

    return {
        isValid: missingFields.length === 0,
        missingFields,
        warnings
    };
}

// Rule set testing function
export async function testRentDisputeRules() {
    const { ruleEngine } = await import('@/services/ruleEngine');

    // Test case 1: Yüksek artırım (%30)
    const testAnswers1 = {
        document_type: "kira_itiraz",
        kiraci_ad_soyad: "Test Kiracı",
        mulk_adres: "Test Adres",
        artirim_orani: 30,
        itiraz_turu: "tam_ret",
        karsi_oneri_var: false
    };

    console.log("🧪 Test Case 1: Yüksek artırım (%30)");
    const result1 = await ruleEngine.processRules(testAnswers1, RENT_DISPUTE_RULE_SET);
    console.log("Selected clauses:", result1.selected_clauses);

    // Test case 2: Orta artırım + Karşı öneri (%20)
    const testAnswers2 = {
        document_type: "kira_itiraz",
        kiraci_ad_soyad: "Test Kiracı",
        mulk_adres: "Test Adres",
        artirim_orani: 20,
        itiraz_turu: "karsi_oneri",
        karsi_oneri_var: true,
        onerilen_kira_bedeli: "5000"
    };

    console.log("\n🧪 Test Case 2: Orta artırım + Karşı öneri (%20)");
    const result2 = await ruleEngine.processRules(testAnswers2, RENT_DISPUTE_RULE_SET);
    console.log("Selected clauses:", result2.selected_clauses);

    return { result1, result2 };
}

// Export default rule set
export default RENT_DISPUTE_RULE_SET;