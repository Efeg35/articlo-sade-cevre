/**
 * 🎯 LawDepot-Level Dynamic Wizard System Types
 * 
 * Bu dosya LawDepot'un gerçek gücünü sağlayan dinamik soru sistemi tip tanımlarını içerir.
 * Ana fark: Statik 21 adım yerine, cevaplara göre dinamik soru akışı.
 * 
 * Örnek: "Evcil hayvan var mı?" → "Evet" → "Depozito tutarı?" sorusu görünür
 */

export type QuestionType =
    | 'boolean'        // Evet/Hayır soruları
    | 'text'           // Serbest metin girişi
    | 'number'         // Sayısal değer
    | 'date'           // Tarih seçimi
    | 'multiple_choice' // Çoktan seçmeli
    | 'currency'       // Para birimi
    | 'percentage';    // Yüzde değeri

export type ConditionalOperator =
    | 'EQUALS'         // Eşittir
    | 'NOT_EQUALS'     // Eşit değildir
    | 'GREATER_THAN'   // Büyüktür
    | 'LESS_THAN'      // Küçüktür
    | 'CONTAINS'       // İçerir
    | 'NOT_CONTAINS'   // İçermez
    | 'IS_EMPTY'       // Boştur
    | 'IS_NOT_EMPTY';  // Boş değildir

export type ConditionalAction =
    | 'SHOW_QUESTION'     // Soruyu göster
    | 'HIDE_QUESTION'     // Soruyu gizle
    | 'REQUIRE_QUESTION'  // Soruyu zorunlu yap
    | 'OPTIONAL_QUESTION' // Soruyu isteğe bağlı yap
    | 'INCLUDE_CLAUSE'    // Maddeyi dahil et
    | 'EXCLUDE_CLAUSE'    // Maddeyi hariç tut
    | 'SET_VALUE'         // Değer ata
    | 'CALCULATE_VALUE';  // Değer hesapla

/**
 * Dinamik soru tanımı - LawDepot'un temel birimi
 */
export interface DynamicQuestion {
    question_id: string;
    template_id: string;
    question_text: string;
    question_type: QuestionType;
    display_order: number;
    is_required: boolean;
    default_visible: boolean; // Başlangıçta görünür mü?

    // Çoktan seçmeli sorular için seçenekler
    options?: {
        value: string;
        label: string;
        description?: string;
    }[];

    // Doğrulama kuralları
    validation?: {
        min_length?: number;
        max_length?: number;
        min_value?: number;
        max_value?: number;
        regex_pattern?: string;
        custom_message?: string;
    };

    // Bu sorunun tetiklediği koşullu kurallar
    conditional_rules: ConditionalRule[];

    // Yardım metni ve açıklamalar
    help_text?: string;
    placeholder?: string;
    tooltip?: string;

    // UI özelleştirmeleri
    ui_config?: {
        width?: 'full' | 'half' | 'third';
        show_character_count?: boolean;
        allow_multiline?: boolean;
        currency_symbol?: string;
    };
}

/**
 * Koşullu kural tanımı - LawDepot'un dinamik mantığı
 */
export interface ConditionalRule {
    rule_id: string;
    trigger_question_id: string;
    operator: ConditionalOperator;
    trigger_value: string | number | boolean | string[];
    action: ConditionalAction;
    target_id: string; // Hedef soru veya madde ID'si

    // Hesaplama kuralları için
    calculation_formula?: string;

    // Öncelik (düşük sayı = yüksek öncelik)
    priority: number;

    // Kural açıklaması (debugging için)
    description?: string;
}

/**
 * Dinamik şablon tanımı - LawDepot şablonu
 */
export interface DynamicTemplate {
    template_id: string;
    template_name: string;
    template_description: string;
    category: string;

    // Şablonun başlangıç soruları (her zaman görünür)
    initial_questions: string[];

    // Tüm sorular (dinamik olanlar dahil)
    questions: DynamicQuestion[];

    // Şablon meta verileri
    metadata: {
        version: string;
        created_date: string;
        updated_date: string;
        legal_references?: string[];
        complexity_level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
        estimated_completion_time: number; // dakika
    };

    // Çıktı yapılandırması
    output_config: {
        default_format: 'PDF' | 'DOCX' | 'HTML';
        supported_formats: string[];
        template_file_path?: string;
    };
}

/**
 * Kullanıcı cevapları - Her soru için verilen cevaplar
 */
export interface UserAnswer {
    question_id: string;
    template_id: string;
    user_id?: string;
    document_id?: string;

    // Cevap değeri (tip çeşitliliği için any, runtime'da doğrulanacak)
    value: string | number | boolean | Date | string[];

    // Cevap meta verileri
    answered_at: string;
    is_auto_calculated: boolean;
    calculation_source?: string;

    // Doğrulama durumu
    is_valid: boolean;
    validation_errors?: string[];
}

/**
 * Dinamik wizard durumu - Aktif session state
 */
export interface DynamicWizardState {
    template_id: string;
    document_id?: string;
    user_id?: string;

    // Mevcut adım bilgisi
    current_step: number;
    total_steps: number; // Dinamik olarak hesaplanır

    // Görünür sorular (dinamik)
    visible_questions: string[];
    completed_questions: string[];
    required_questions: string[];

    // Kullanıcı cevapları
    answers: Record<string, UserAnswer>;

    // Wizard durumu
    is_complete: boolean;
    completion_percentage: number;

    // Hata durumları
    validation_errors: Record<string, string[]>;

    // Session bilgisi
    started_at: string;
    last_updated_at: string;
}

/**
 * Dinamik wizard yapılandırması
 */
export interface DynamicWizardConfig {
    // Performans ayarları
    auto_save_interval: number; // ms
    validation_debounce: number; // ms

    // UI ayarları
    show_progress_bar: boolean;
    show_step_counter: boolean;
    allow_back_navigation: boolean;

    // Debugging
    debug_mode: boolean;
    log_rule_evaluations: boolean;
}

/**
 * Kural değerlendirme sonucu
 */
export interface RuleEvaluationResult {
    rule_id: string;
    triggered: boolean;
    action_taken: ConditionalAction;
    target_id: string;
    timestamp: string;
    debug_info?: {
        trigger_value: unknown;
        expected_value: unknown;
        operator: ConditionalOperator;
    };
}

/**
 * Wizard analitikleri - Performans takibi
 */
export interface WizardAnalytics {
    template_id: string;
    document_id: string;

    // Tamamlanma istatistikleri
    total_time_spent: number; // saniye
    questions_answered: number;
    questions_skipped: number;

    // Adım analizi
    step_times: Record<string, number>; // Her sorunun cevaplanma süresi
    back_navigation_count: number;
    validation_error_count: number;

    // Kural değerlendirme performansı
    rule_evaluations: RuleEvaluationResult[];

    // Kullanıcı davranışı
    abandoned_at_step?: string;
    completion_date?: string;
}

/**
 * Belge oluşturma bağlamı - Son aşama
 */
export interface DocumentGenerationContext {
    template_id: string;
    answers: Record<string, UserAnswer>;

    // İçerik oluşturma
    included_clauses: string[];
    variable_substitutions: Record<string, string>;

    // Format ayarları
    output_format: 'PDF' | 'DOCX' | 'HTML';
    styling_options: {
        font_family?: string;
        font_size?: number;
        line_spacing?: number;
        margin_size?: number;
    };

    // Meta veriler
    document_title: string;
    creation_date: string;
    author?: string;
    tags?: string[];
}

/**
 * API yanıt tipları
 */
export interface DynamicWizardApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
    timestamp: string;
}

// Utility Types
export type QuestionValue = string | number | boolean | Date | string[];
export type TemplateQuestions = Record<string, DynamicQuestion>;
export type UserAnswers = Record<string, UserAnswer>;
export type VisibilityMap = Record<string, boolean>;
export type ValidationMap = Record<string, string[]>;