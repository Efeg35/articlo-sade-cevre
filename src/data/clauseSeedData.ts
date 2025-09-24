/**
 * LawDepot "Akıllı Lego Seti" - Seed Data
 * Kira İtiraz Dilekçesi için temel clause library
 */

import { LegalClause, ClauseCategory, UsageContext } from '@/types/clause';

export const RENT_DISPUTE_CLAUSES: Omit<LegalClause, 'created_at' | 'updated_at'>[] = [
    // BAŞLIK VE GENEL BİLGİLER
    {
        clause_id: "HEADER_RENT_DISPUTE_TR_v1",
        clause_name: "Kira İtiraz Dilekçesi Başlığı",
        clause_category: ClauseCategory.KIRA_ITIRAZ,
        clause_text: `T.C.
{MAHKEME_ADI} 
{DOSYA_NO}

KIRA ARTIRIMI İTİRAZI

Sayın Hakimim,`,
        clause_description: "Kira itiraz dilekçesi başlığı ve mahkeme bilgileri",
        jurisdiction: "TR",
        legal_basis: ["6098 sayılı Türk Borçlar Kanunu", "TBK m. 344"],
        legal_references: ["TBK m. 344", "HMK m. 119"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["MAHKEME_ADI", "DOSYA_NO"],
        optional_variables: [],
    },

    // TARAF BİLGİLERİ
    {
        clause_id: "PLAINTIFF_INFO_TR_v1",
        clause_name: "Davacı (Kiracı) Bilgileri",
        clause_category: ClauseCategory.KIRA_GENEL,
        clause_text: `DAVACI:
Ad Soyad: {KIRACI_AD_SOYAD}
T.C. Kimlik No: {KIRACI_TC}
Adres: {KIRACI_ADRES}
Telefon: {KIRACI_TELEFON}
E-posta: {KIRACI_EMAIL}`,
        clause_description: "Kiracı (davacı) temel bilgileri",
        jurisdiction: "TR",
        legal_basis: ["HMK m. 119"],
        legal_references: ["HMK m. 119", "HMK m. 120"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["KIRACI_AD_SOYAD", "KIRACI_TC", "KIRACI_ADRES"],
        optional_variables: ["KIRACI_TELEFON", "KIRACI_EMAIL"],
    },

    {
        clause_id: "DEFENDANT_INFO_TR_v1",
        clause_name: "Davalı (Ev Sahibi) Bilgileri",
        clause_category: ClauseCategory.KIRA_GENEL,
        clause_text: `DAVALI:
Ad Soyad: {EV_SAHIBI_AD_SOYAD}
T.C. Kimlik No: {EV_SAHIBI_TC}
Adres: {EV_SAHIBI_ADRES}
Telefon: {EV_SAHIBI_TELEFON}`,
        clause_description: "Ev sahibi (davalı) temel bilgileri",
        jurisdiction: "TR",
        legal_basis: ["HMK m. 119"],
        legal_references: ["HMK m. 119", "HMK m. 120"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["EV_SAHIBI_AD_SOYAD", "EV_SAHIBI_ADRES"],
        optional_variables: ["EV_SAHIBI_TC", "EV_SAHIBI_TELEFON"],
    },

    // MÜLK BİLGİLERİ
    {
        clause_id: "PROPERTY_DETAILS_TR_v1",
        clause_name: "Kiralanan Mülk Detayları",
        clause_category: ClauseCategory.KIRA_GENEL,
        clause_text: `UYUŞMAZLIK KONUSU TAŞINMAZ:
Adres: {MULK_ADRES}
İl/İlçe: {MULK_IL_ILCE}
Mahalle/Semt: {MULK_MAHALLE}
Daire No: {MULK_DAIRE_NO}
Brüt/Net m²: {MULK_METREKARE}
Kat: {MULK_KAT}
Oda Sayısı: {MULK_ODA_SAYISI}`,
        clause_description: "Kiralanan taşınmazın detaylı bilgileri",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 299", "TBK m. 344"],
        legal_references: ["TBK m. 299", "TBK m. 344"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["MULK_ADRES", "MULK_IL_ILCE"],
        optional_variables: ["MULK_MAHALLE", "MULK_DAIRE_NO", "MULK_METREKARE", "MULK_KAT", "MULK_ODA_SAYISI"],
    },

    // SÖZLEŞME BİLGİLERİ
    {
        clause_id: "CONTRACT_INFO_TR_v1",
        clause_name: "Kira Sözleşmesi Bilgileri",
        clause_category: ClauseCategory.KIRA_GENEL,
        clause_text: `KIRA SÖZLEŞMESİ BİLGİLERİ:
Sözleşme Tarihi: {SOZLESME_TARIHI}
Başlangıç Tarihi: {KIRA_BASLANGIC_TARIHI}
İlk Kira Bedeli: {ILK_KIRA_BEDELI} TL
Mevcut Kira Bedeli: {MEVCUT_KIRA_BEDELI} TL
Depozito: {DEPOZITO_MIKTARI} TL
Süre: {SOZLESME_SURESI}`,
        clause_description: "Kira sözleşmesine ait temel bilgiler",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 299", "TBK m. 344"],
        legal_references: ["TBK m. 299", "TBK m. 344", "TBK m. 347"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["SOZLESME_TARIHI", "ILK_KIRA_BEDELI", "MEVCUT_KIRA_BEDELI"],
        optional_variables: ["KIRA_BASLANGIC_TARIHI", "DEPOZITO_MIKTARI", "SOZLESME_SURESI"],
    },

    // ARTIRIM DETAYLARI
    {
        clause_id: "RENT_INCREASE_DETAILS_TR_v1",
        clause_name: "Kira Artırımı Detayları",
        clause_category: ClauseCategory.KIRA_ARTIRIM,
        clause_text: `KIRA ARTIRIMI BİLGİLERİ:
Artırım Talebi Tarihi: {ARTIRIM_TALEP_TARIHI}
Eski Kira Bedeli: {ESKI_KIRA_BEDELI} TL
Talep Edilen Yeni Kira: {YENI_KIRA_TALEBI} TL
Artırım Oranı: %{ARTIRIM_ORANI}
Artırım Gerekçesi: {ARTIRIM_GEREKCE}`,
        clause_description: "Ev sahibinin kira artırım talebine ait detaylar",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344"],
        legal_references: ["TBK m. 344", "TBK m. 347"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["ARTIRIM_TALEP_TARIHI", "ESKI_KIRA_BEDELI", "YENI_KIRA_TALEBI", "ARTIRIM_ORANI"],
        optional_variables: ["ARTIRIM_GEREKCE"],
    },

    // HUKUKİ DAYANAK - YÜKSEK ARTIRIM
    {
        clause_id: "HIGH_INCREASE_OBJECTION_TR_v1",
        clause_name: "Yüksek Artırım İtirazı",
        clause_category: ClauseCategory.KIRA_ITIRAZ,
        clause_text: `HUKUKSAL DAYANAK VE İTİRAZ GEREKÇESİ:

1. Türk Borçlar Kanunu'nun 344. maddesi uyarınca, "Kira bedeli, taşınmazın bulunduğu yerdeki benzer taşınmazların kira bedellerine göre belirlenir."

2. Davalının talep ettiği %{ARTIRIM_ORANI} oranındaki artırım, hem yasal sınırları aşmaktadır hem de bölgedeki benzer taşınmazların kira bedelleriyle uyumlu değildir.

3. {YENI_KIRA_TALEBI} TL'lik yeni kira bedeli, taşınmazın mevcut durumu, konumu ve bölgedeki piyasa koşulları dikkate alındığında fahiş nitelikte olup, ölçülülük ilkesine aykırıdır.`,
        clause_description: "Yüksek kira artırımına karşı hukuki itiraz",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344"],
        legal_references: ["TBK m. 344", "TBK m. 2", "TMK m. 2"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["ARTIRIM_ORANI", "YENI_KIRA_TALEBI"],
        optional_variables: [],
        display_conditions: [
            {
                field: "artirim_orani",
                operator: ">",
                value: 25
            }
        ]
    },

    // HUKUKİ DAYANAK - ORTA ARTIRIM  
    {
        clause_id: "MODERATE_INCREASE_OBJECTION_TR_v1",
        clause_name: "Orta Seviye Artırım İtirazı",
        clause_category: ClauseCategory.KIRA_ITIRAZ,
        clause_text: `HUKUKSAL DAYANAK VE İTİRAZ GEREKÇESİ:

1. 6098 sayılı Türk Borçlar Kanunu'nun 344. maddesi uyarınca kira bedeli artırımı, objektif kriterlere dayanmalıdır.

2. %{ARTIRIM_ORANI} oranındaki artırım talebi, bölgedeki benzer nitelikteki taşınmazların kira bedelleri ve mevcut ekonomik koşullar göz önüne alındığında makul seviyenin üstündedir.

3. Taşınmazın mevcut durumu, yapılan iyileştirmeler ve piyasa koşulları değerlendirildiğinde, adil kira bedeli {ONERILEN_KIRA_BEDELI} TL'yi geçmemelidir.`,
        clause_description: "Orta seviye kira artırımına karşı hukuki itiraz",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344"],
        legal_references: ["TBK m. 344", "TBK m. 2"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["ARTIRIM_ORANI"],
        optional_variables: ["ONERILEN_KIRA_BEDELI"],
        display_conditions: [
            {
                field: "artirim_orani",
                operator: ">",
                value: 10
            },
            {
                field: "artirim_orani",
                operator: "<",
                value: 25
            }
        ]
    },

    // KARŞI ÖNERI
    {
        clause_id: "COUNTER_OFFER_TR_v1",
        clause_name: "Karşı Kira Önerisi",
        clause_category: ClauseCategory.KIRA_ARTIRIM,
        clause_text: `KARŞI ÖNERİ:

Yukarıda belirtilen gerekçeler doğrultusunda, taşınmazın adil kira bedeli olarak aylık {ONERILEN_KIRA_BEDELI} TL önerilmektedir. Bu bedel:

- Bölgedeki benzer taşınmazların kira bedelleriyle uyumludur
- Taşınmazın mevcut durumu ve özelliklerini yansıtır  
- Ekonomik koşullar ve enflasyon oranı dikkate alınarak belirlenmiştir
- Hakkaniyet ve ölçülülük ilkelerine uygundur`,
        clause_description: "Kiracının karşı kira bedeli önerisi",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344"],
        legal_references: ["TBK m. 344"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["ONERILEN_KIRA_BEDELI"],
        optional_variables: [],
        display_conditions: [
            {
                field: "karsi_oneri_var",
                operator: "==",
                value: true
            }
        ]
    },

    // TALEP - ARTIRIM REDDİ
    {
        clause_id: "REQUEST_INCREASE_REJECTION_TR_v1",
        clause_name: "Artırım Reddi Talebi",
        clause_category: ClauseCategory.KIRA_ITIRAZ,
        clause_text: `TALEP:

Yukarıda açıklanan gerekçeler doğrultusunda;

1. Davalının kira artırım talebinin REDDİNE,
2. Kira bedelinin mevcut {MEVCUT_KIRA_BEDELI} TL olarak devamına,
3. Yargılama giderleri ve vekalet ücretinin davalıdan tahsiline,

Karar verilmesini saygılarımızla arz ederiz.`,
        clause_description: "Kira artırımının tamamen reddedilmesi talebi",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344", "HMK m. 119"],
        legal_references: ["TBK m. 344", "HMK m. 119", "HMK m. 326"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["MEVCUT_KIRA_BEDELI"],
        optional_variables: [],
        display_conditions: [
            {
                field: "itiraz_turu",
                operator: "==",
                value: "tam_ret"
            }
        ]
    },

    // TALEP - KARŞI ÖNERİ İLE
    {
        clause_id: "REQUEST_WITH_COUNTER_OFFER_TR_v1",
        clause_name: "Karşı Öneri ile Talep",
        clause_category: ClauseCategory.KIRA_ITIRAZ,
        clause_text: `TALEP:

Yukarıda açıklanan gerekçeler doğrultusunda;

1. Davalının fahiş kira artırım talebinin REDDİNE,
2. Taşınmazın adil kira bedelinin aylık {ONERILEN_KIRA_BEDELI} TL olarak TESPİTİNE,
3. Bu bedelin {ARTIRIM_TALEP_TARIHI} tarihinden itibaren geçerli olmasına,
4. Yargılama giderleri ve vekalet ücretinin davalıdan tahsiline,

Karar verilmesini saygılarımızla arz ederiz.`,
        clause_description: "Kira artırımına karşı öneri ile talep",
        jurisdiction: "TR",
        legal_basis: ["TBK m. 344", "HMK m. 119"],
        legal_references: ["TBK m. 344", "HMK m. 119", "HMK m. 326"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE],
        required_variables: ["ONERILEN_KIRA_BEDELI", "ARTIRIM_TALEP_TARIHI"],
        optional_variables: [],
        display_conditions: [
            {
                field: "itiraz_turu",
                operator: "==",
                value: "karsi_oneri"
            }
        ]
    },

    // İMZA BÖLÜMÜ
    {
        clause_id: "SIGNATURE_SECTION_TR_v1",
        clause_name: "İmza ve Tarih Bölümü",
        clause_category: ClauseCategory.IMZA_BEYAN,
        clause_text: `

Tarih: {DILEKCE_TARIHI}


                                    {KIRACI_AD_SOYAD}
                                        (Davacı)

Ekler:
1. Kira sözleşmesi sureti
2. Kira artırım bildirimi
3. Bölge araştırması (varsa)
4. Diğer belgeler`,
        clause_description: "Dilekçe imza ve ek belgeler bölümü",
        jurisdiction: "TR",
        legal_basis: ["HMK m. 119", "HMK m. 120"],
        legal_references: ["HMK m. 119", "HMK m. 120"],
        version: "v1.0",
        is_active: true,
        created_by: "legal_expert_1",
        usage_context: [UsageContext.KIRA_ITIRAZ_DILEKCE, UsageContext.GENEL_DILEKCE],
        required_variables: ["DILEKCE_TARIHI", "KIRACI_AD_SOYAD"],
        optional_variables: [],
    }
];

// Export edilecek seed function
export async function seedRentDisputeClauses() {
    try {
        const { clauseDB } = await import('@/services/clauseDatabase');
        const result = await clauseDB.importClauses(RENT_DISPUTE_CLAUSES);

        if (result.success) {
            console.log(`✅ Successfully seeded ${result.count} clauses`);
            return result;
        } else {
            console.error('❌ Error seeding clauses:', result.error);
            return result;
        }
    } catch (error) {
        console.error('❌ Error importing clauseDB:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Import error'
        };
    }
}