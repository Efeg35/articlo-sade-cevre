/**
 * LawDepot "Akıllı Lego Seti" Modeli - Clause Database Types
 * Modüler hukuki metin parçacıkları için type definitions
 */

export interface LegalClause {
    // Primary identifier
    clause_id: string;                    // Benzersiz ID: "KIRA_ARTIRIM_SINIRI_TR_v1"

    // Metadata
    clause_name: string;                  // Human-readable: "Kira Artırım Sınır Maddesi"
    clause_category: ClauseCategory;      // Kategori: "KIRA", "FESIH", "ODEME"

    // Content
    clause_text: string;                  // Template with {PLACEHOLDER} variables
    clause_description?: string;          // Açıklama metni

    // Legal metadata
    jurisdiction: "TR";                   // Hukuk sistemi (TR sabit)
    legal_basis: string[];               // Yasal dayanaklar: ["TBK m.344", "6098 sayılı kanun"]
    legal_references?: string[];         // İlgili yasa maddeleri

    // Version control
    version: string;                     // "v1.0", "v1.2" etc.
    is_active: boolean;                  // Aktif sürüm kontrolü
    supersedes?: string;                 // Eski sürümün ID'si

    // Authorship
    created_by: string;                  // Oluşturan uzman
    reviewed_by?: string;                // Gözden geçiren uzman
    approved_by?: string;                // Onaylayan uzman

    // Timestamps
    created_at: string;
    updated_at: string;

    // Usage metadata
    usage_context: UsageContext[];       // Hangi belge türlerinde kullanılır
    required_variables: string[];        // Gerekli placeholder'lar
    optional_variables?: string[];       // Opsiyonel placeholder'lar

    // Conditions
    display_conditions?: ClauseCondition[]; // Ne zaman gösterilir
    dependency_clauses?: string[];       // Bağımlı olduğu clause'lar
}

export enum ClauseCategory {
    // Kira Hukuku
    KIRA_GENEL = "KIRA_GENEL",
    KIRA_ARTIRIM = "KIRA_ARTIRIM",
    KIRA_ITIRAZ = "KIRA_ITIRAZ",
    KIRA_FESIH = "KIRA_FESIH",

    // Ödeme
    ODEME_GENEL = "ODEME_GENEL",
    ODEME_TAKSIT = "ODEME_TAKSIT",
    ODEME_GECIKME = "ODEME_GECIKME",

    // Genel hukuki
    GENEL_SARTLAR = "GENEL_SARTLAR",
    IMZA_BEYAN = "IMZA_BEYAN",
    TARIH_ZAMAN = "TARIH_ZAMAN",

    // İş hukuku (gelecekte)
    IS_SOZLESME = "IS_SOZLESME",
    IS_FESIH = "IS_FESIH",
}

export enum UsageContext {
    KIRA_ITIRAZ_DILEKCE = "KIRA_ITIRAZ_DILEKCE",
    KIRA_SOZLESME = "KIRA_SOZLESME",
    IS_SOZLESME = "IS_SOZLESME",
    GENEL_DILEKCE = "GENEL_DILEKCE",
}

export interface ClauseCondition {
    field: string;                       // answers.artırım_yüzdesi
    operator: ">" | "<" | "==" | "!=" | "includes" | "excludes";
    value: string | number | boolean | string[] | number[];  // 25, "evet", ["option1", "option2"]
}

// Rule engine types
export interface RuleSet {
    document_type: string;
    rules: ConditionalRule[];
    metadata?: {
        created_by: string;
        created_at: string;
        version: string;
    };
}

export interface ConditionalRule {
    rule_id: string;
    description: string;
    condition: ClauseCondition[];        // Multiple conditions with AND logic
    then_clauses: string[];             // clause_id array to include
    else_clauses?: string[];            // clause_id array for else case
    priority: number;                   // Rule execution priority
}

// Database için Supabase types
export interface ClauseRow {
    id: string;
    clause_id: string;
    clause_name: string;
    clause_category: string;
    clause_text: string;
    clause_description: string | null;
    jurisdiction: string;
    legal_basis: string[];
    legal_references: string[] | null;
    version: string;
    is_active: boolean;
    supersedes: string | null;
    created_by: string;
    reviewed_by: string | null;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
    usage_context: string[];
    required_variables: string[];
    optional_variables: string[] | null;
    display_conditions: ClauseCondition[] | null;
    dependency_clauses: string[] | null;
}

export interface ClauseInsert {
    id?: string;
    clause_id: string;
    clause_name: string;
    clause_category: string;
    clause_text: string;
    clause_description?: string | null;
    jurisdiction: string;
    legal_basis: string[];
    legal_references?: string[] | null;
    version: string;
    is_active?: boolean;
    supersedes?: string | null;
    created_by: string;
    reviewed_by?: string | null;
    approved_by?: string | null;
    created_at?: string;
    updated_at?: string;
    usage_context: string[];
    required_variables: string[];
    optional_variables?: string[] | null;
    display_conditions?: ClauseCondition[] | null;
    dependency_clauses?: string[] | null;
}

export interface ClauseUpdate {
    clause_name?: string;
    clause_category?: string;
    clause_text?: string;
    clause_description?: string | null;
    legal_basis?: string[];
    legal_references?: string[] | null;
    version?: string;
    is_active?: boolean;
    supersedes?: string | null;
    reviewed_by?: string | null;
    approved_by?: string | null;
    updated_at?: string;
    usage_context?: string[];
    required_variables?: string[];
    optional_variables?: string[] | null;
    display_conditions?: ClauseCondition[] | null;
    dependency_clauses?: string[] | null;
}

// Helper types
export interface ClauseVariable {
    name: string;                        // {KIRACI_AD}
    description: string;                 // "Kiracının tam adı"
    type: "string" | "number" | "date" | "boolean";
    required: boolean;
    example?: string;                    // "Ahmet Yılmaz"
}

export interface ClauseTemplate {
    template_id: string;
    template_name: string;
    description: string;
    clauses: string[];                   // clause_id array
    rules: RuleSet;                      // Rule engine rules
    created_at: string;
    created_by: string;
}

// API Response types
export interface ClauseResponse {
    success: boolean;
    data: LegalClause[] | LegalClause | null;
    error?: string;
    count?: number;
}

export interface ClauseSearchParams {
    category?: ClauseCategory;
    usage_context?: UsageContext;
    active_only?: boolean;
    search_text?: string;
    legal_basis?: string[];
}