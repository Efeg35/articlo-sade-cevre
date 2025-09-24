/**
 * 🎯 LawDepot-Style Dynamic Templates
 * 
 * Bu dosya gerçek LawDepot mantığında çalışan dinamik template örneklerini içerir.
 * Ana özellik: Kullanıcı cevaplarına göre dinamik soru akışı.
 * 
 * Örnek: "Evcil hayvan var mı?" → "Evet" → "Depozito ne kadar?" sorusu görünür
 */

import type {
    DynamicTemplate,
    DynamicQuestion,
    ConditionalRule
} from '../types/wizard/dynamicWizard';

/**
 * Kira Sözleşmesi Template - LawDepot tarzında dinamik sorular
 */
export const KIRA_SOZLESMESI_DYNAMIC_TEMPLATE: DynamicTemplate = {
    template_id: 'kira-sozlesmesi-dynamic',
    template_name: 'Kira Sözleşmesi (Dinamik)',
    template_description: 'LawDepot tarzında dinamik soru akışıyla kira sözleşmesi oluşturun. Sadece size uygun sorular gösterilir.',
    category: 'Konut ve Emlak',

    // Her zaman görünen başlangıç soruları
    initial_questions: [
        'property-type',
        'lease-type',
        'landlord-info',
        'tenant-info'
    ],

    questions: [
        // 1. TEMEL BİLGİLER (Her zaman görünür)
        {
            question_id: 'property-type',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Kiralanacak taşınmazın türü nedir?',
            question_type: 'multiple_choice',
            display_order: 1,
            is_required: true,
            default_visible: true,
            options: [
                { value: 'konut', label: 'Konut (Daire/Ev)', description: 'Oturma amaçlı kullanım' },
                { value: 'isyeri', label: 'İşyeri', description: 'Ticari faaliyet amaçlı' },
                { value: 'depo', label: 'Depo/Antrepo', description: 'Depolama amaçlı' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-commercial-questions',
                    trigger_question_id: 'property-type',
                    operator: 'EQUALS',
                    trigger_value: 'isyeri',
                    action: 'SHOW_QUESTION',
                    target_id: 'business-type',
                    priority: 1,
                    description: 'İşyeri seçilirse ticari sorular göster'
                },
                {
                    rule_id: 'show-residential-questions',
                    trigger_question_id: 'property-type',
                    operator: 'EQUALS',
                    trigger_value: 'konut',
                    action: 'SHOW_QUESTION',
                    target_id: 'furnished-status',
                    priority: 1,
                    description: 'Konut seçilirse konut sorularını göster'
                }
            ],
            help_text: 'Bu bilgi sözleşmenin hangi yasal düzenlemelere tabi olacağını belirler.'
        },

        {
            question_id: 'lease-type',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Kira süresi nasıl belirlensin?',
            question_type: 'multiple_choice',
            display_order: 2,
            is_required: true,
            default_visible: true,
            options: [
                { value: 'definite', label: 'Belirli Süreli', description: 'Başlangıç ve bitiş tarihi belirtilir' },
                { value: 'indefinite', label: 'Belirsiz Süreli', description: 'Süre belirtilmez, devam eder' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-lease-duration',
                    trigger_question_id: 'lease-type',
                    operator: 'EQUALS',
                    trigger_value: 'definite',
                    action: 'SHOW_QUESTION',
                    target_id: 'lease-duration',
                    priority: 1,
                    description: 'Belirli süreli seçilirse süre sorularını göster'
                }
            ]
        },

        {
            question_id: 'landlord-info',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Kiralayan (Ev Sahibi) Adı Soyadı',
            question_type: 'text',
            display_order: 3,
            is_required: true,
            default_visible: true,
            validation: {
                min_length: 3,
                max_length: 100
            },
            placeholder: 'örn: Ahmet Yılmaz',
            conditional_rules: []
        },

        {
            question_id: 'tenant-info',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Kiracı Adı Soyadı',
            question_type: 'text',
            display_order: 4,
            is_required: true,
            default_visible: true,
            validation: {
                min_length: 3,
                max_length: 100
            },
            placeholder: 'örn: Mehmet Demir',
            conditional_rules: [
                {
                    rule_id: 'show-multiple-tenant-question',
                    trigger_question_id: 'tenant-info',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'multiple-tenants',
                    priority: 10,
                    description: 'Kiracı bilgisi girildikten sonra çok kiracı sorusunu göster'
                }
            ]
        },

        // 2. KOŞULLU SORULAR - DİNAMİK OLARAK GÖRÜNÜRler

        // İşyeri için özel sorular
        {
            question_id: 'business-type',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'İşyeri türü nedir?',
            question_type: 'multiple_choice',
            display_order: 5,
            is_required: true,
            default_visible: false, // Dinamik olarak gösterilir
            options: [
                { value: 'office', label: 'Ofis' },
                { value: 'shop', label: 'Mağaza/Dükkan' },
                { value: 'restaurant', label: 'Restoran/Kafe' },
                { value: 'warehouse', label: 'Depo/Antrepo' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-food-permit-question',
                    trigger_question_id: 'business-type',
                    operator: 'EQUALS',
                    trigger_value: 'restaurant',
                    action: 'SHOW_QUESTION',
                    target_id: 'food-permit',
                    priority: 1,
                    description: 'Restoran seçilirse gıda izni sorusunu göster'
                }
            ]
        },

        {
            question_id: 'food-permit',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Gıda işletme ruhsatı mevcut mu?',
            question_type: 'boolean',
            display_order: 6,
            is_required: true,
            default_visible: false,
            conditional_rules: []
        },

        // Konut için özel sorular
        {
            question_id: 'furnished-status',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Konut eşyalı mı?',
            question_type: 'multiple_choice',
            display_order: 7,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'empty', label: 'Boş', description: 'Eşya yok' },
                { value: 'semi-furnished', label: 'Yarı Eşyalı', description: 'Temel eşyalar var' },
                { value: 'fully-furnished', label: 'Tam Eşyalı', description: 'Tüm eşyalar mevcut' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-furniture-list',
                    trigger_question_id: 'furnished-status',
                    operator: 'NOT_EQUALS',
                    trigger_value: 'empty',
                    action: 'SHOW_QUESTION',
                    target_id: 'furniture-inventory',
                    priority: 1,
                    description: 'Eşyalı seçilirse envanter sorusunu göster'
                }
            ]
        },

        {
            question_id: 'furniture-inventory',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Eşya envanteri detayları',
            question_type: 'text',
            display_order: 8,
            is_required: false,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                show_character_count: true
            },
            validation: {
                max_length: 1000
            },
            placeholder: 'Teslim edilen eşyaları listeleyin: Buzdolabı, çamaşır makinesi, vs.',
            conditional_rules: []
        },

        // Kira süresi soruları
        {
            question_id: 'lease-duration',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Kira süresi kaç yıl?',
            question_type: 'number',
            display_order: 9,
            is_required: true,
            default_visible: false,
            validation: {
                min_value: 1,
                max_value: 10
            },
            conditional_rules: [
                {
                    rule_id: 'show-renewal-option',
                    trigger_question_id: 'lease-duration',
                    operator: 'GREATER_THAN',
                    trigger_value: 1,
                    action: 'SHOW_QUESTION',
                    target_id: 'auto-renewal',
                    priority: 1,
                    description: '1 yıldan fazla süre için yenileme seçeneği göster'
                }
            ]
        },

        {
            question_id: 'auto-renewal',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Otomatik yenileme maddesi eklensin mi?',
            question_type: 'boolean',
            display_order: 10,
            is_required: false,
            default_visible: false,
            help_text: 'Sözleşme süresi dolduğunda otomatik olarak yenilensin mi?',
            conditional_rules: []
        },

        // Çok kiracı sorusu
        {
            question_id: 'multiple-tenants',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Birden fazla kiracı var mı?',
            question_type: 'boolean',
            display_order: 11,
            is_required: false,
            default_visible: false,
            conditional_rules: [
                {
                    rule_id: 'show-additional-tenants',
                    trigger_question_id: 'multiple-tenants',
                    operator: 'EQUALS',
                    trigger_value: true,
                    action: 'SHOW_QUESTION',
                    target_id: 'additional-tenant-names',
                    priority: 1,
                    description: 'Çok kiracı varsa isim listesi iste'
                }
            ]
        },

        {
            question_id: 'additional-tenant-names',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Diğer kiracıların isimleri',
            question_type: 'text',
            display_order: 12,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true
            },
            placeholder: 'Her satıra bir isim yazın:\nAyşe Demir\nFatma Yılmaz',
            conditional_rules: []
        },

        // FİNANSAL SORULAR (Her zaman soruluyor ama bağımlılıkları var)
        {
            question_id: 'monthly-rent',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Aylık kira bedeli',
            question_type: 'currency',
            display_order: 13,
            is_required: true,
            default_visible: true,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 1000,
                max_value: 100000
            },
            conditional_rules: [
                {
                    rule_id: 'show-deposit-question',
                    trigger_question_id: 'monthly-rent',
                    operator: 'GREATER_THAN',
                    trigger_value: 0,
                    action: 'SHOW_QUESTION',
                    target_id: 'security-deposit',
                    priority: 1,
                    description: 'Kira girilince depozito sorusunu göster'
                }
            ]
        },

        {
            question_id: 'security-deposit',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Güvence bedeli (depozito)',
            question_type: 'currency',
            display_order: 14,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            help_text: 'Genellikle 1-3 aylık kira bedeli kadar olur',
            conditional_rules: [
                {
                    rule_id: 'show-pet-question',
                    trigger_question_id: 'security-deposit',
                    operator: 'GREATER_THAN',
                    trigger_value: 0,
                    action: 'SHOW_QUESTION',
                    target_id: 'pets-allowed',
                    priority: 5,
                    description: 'Depozito sorulduktan sonra evcil hayvan sorusunu göster'
                }
            ]
        },

        // EVCIL HAYVAN - LawDepot'un klasik örneği
        {
            question_id: 'pets-allowed',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Evcil hayvan beslemesine izin veriliyor mu?',
            question_type: 'boolean',
            display_order: 15,
            is_required: false,
            default_visible: false,
            conditional_rules: [
                {
                    rule_id: 'show-pet-deposit',
                    trigger_question_id: 'pets-allowed',
                    operator: 'EQUALS',
                    trigger_value: true,
                    action: 'SHOW_QUESTION',
                    target_id: 'pet-deposit',
                    priority: 1,
                    description: 'Evcil hayvan izni varsa ek depozito sorusunu göster'
                },
                {
                    rule_id: 'show-pet-rules',
                    trigger_question_id: 'pets-allowed',
                    operator: 'EQUALS',
                    trigger_value: true,
                    action: 'SHOW_QUESTION',
                    target_id: 'pet-rules',
                    priority: 2,
                    description: 'Evcil hayvan izni varsa kuralları sor'
                }
            ]
        },

        {
            question_id: 'pet-deposit',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Evcil hayvan için ek depozito tutarı',
            question_type: 'currency',
            display_order: 16,
            is_required: false,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            help_text: 'Evcil hayvan kaynaklı hasarlar için ek güvence',
            conditional_rules: []
        },

        {
            question_id: 'pet-rules',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Evcil hayvan kuralları',
            question_type: 'text',
            display_order: 17,
            is_required: false,
            default_visible: false,
            ui_config: {
                allow_multiline: true
            },
            placeholder: 'örn: Köpek boyutu 30kg\'ı aşamaz, kedi sayısı en fazla 2 adet',
            conditional_rules: []
        },

        // ÖZEL KOŞULLAR
        {
            question_id: 'special-conditions',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Özel şartlar ve koşullar var mı?',
            question_type: 'boolean',
            display_order: 18,
            is_required: false,
            default_visible: true,
            conditional_rules: [
                {
                    rule_id: 'show-special-conditions-text',
                    trigger_question_id: 'special-conditions',
                    operator: 'EQUALS',
                    trigger_value: true,
                    action: 'SHOW_QUESTION',
                    target_id: 'special-conditions-text',
                    priority: 1,
                    description: 'Özel şartlar varsa detayları iste'
                }
            ]
        },

        {
            question_id: 'special-conditions-text',
            template_id: 'kira-sozlesmesi-dynamic',
            question_text: 'Özel şartlar ve koşullar',
            question_type: 'text',
            display_order: 19,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                show_character_count: true
            },
            validation: {
                max_length: 2000
            },
            placeholder: 'Sözleşmeye eklemek istediğiniz özel maddeleri yazın...',
            conditional_rules: []
        }
    ],

    metadata: {
        version: '2.0.0',
        created_date: '2025-09-18',
        updated_date: '2025-09-18',
        legal_references: [
            'Türk Borçlar Kanunu Madde 299-356',
            '6098 Sayılı TBK Kira Hükümleri'
        ],
        complexity_level: 'INTERMEDIATE',
        estimated_completion_time: 15 // dakika
    },

    output_config: {
        default_format: 'PDF',
        supported_formats: ['PDF', 'DOCX', 'HTML'],
        template_file_path: 'templates/kira-sozlesmesi-dynamic.docx'
    }
};

/**
 * İş Sözleşmesi - Daha karmaşık conditional logic örneği
 */
export const IS_SOZLESMESI_DYNAMIC_TEMPLATE: DynamicTemplate = {
    template_id: 'is-sozlesmesi-dynamic',
    template_name: 'İş Sözleşmesi (Dinamik)',
    template_description: 'İş türüne ve pozisyona göre dinamik sorular içeren iş sözleşmesi',
    category: 'İş ve Çalışma Hukuku',

    initial_questions: [
        'contract-type',
        'employee-name',
        'employer-name',
        'job-title'
    ],

    questions: [
        {
            question_id: 'contract-type',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'İş sözleşmesi türü nedir?',
            question_type: 'multiple_choice',
            display_order: 1,
            is_required: true,
            default_visible: true,
            options: [
                { value: 'definite', label: 'Belirli Süreli', description: 'Belirli bir proje veya süre için' },
                { value: 'indefinite', label: 'Belirsiz Süreli', description: 'Sürekli işe alım' },
                { value: 'part-time', label: 'Yarı Zamanlı', description: 'Haftada 40 saatten az çalışma' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-contract-duration',
                    trigger_question_id: 'contract-type',
                    operator: 'EQUALS',
                    trigger_value: 'definite',
                    action: 'SHOW_QUESTION',
                    target_id: 'contract-duration',
                    priority: 1,
                    description: 'Belirli süreli için süre sorusunu göster'
                },
                {
                    rule_id: 'show-part-time-hours',
                    trigger_question_id: 'contract-type',
                    operator: 'EQUALS',
                    trigger_value: 'part-time',
                    action: 'SHOW_QUESTION',
                    target_id: 'weekly-hours',
                    priority: 1,
                    description: 'Yarı zamanlı için saat sorusunu göster'
                }
            ]
        },

        {
            question_id: 'employee-name',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'Çalışan Adı Soyadı',
            question_type: 'text',
            display_order: 2,
            is_required: true,
            default_visible: true,
            validation: { min_length: 3, max_length: 100 },
            conditional_rules: []
        },

        {
            question_id: 'employer-name',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'İşveren/Şirket Adı',
            question_type: 'text',
            display_order: 3,
            is_required: true,
            default_visible: true,
            validation: { min_length: 2, max_length: 200 },
            conditional_rules: []
        },

        {
            question_id: 'job-title',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'İş Unvanı/Pozisyon',
            question_type: 'text',
            display_order: 4,
            is_required: true,
            default_visible: true,
            placeholder: 'örn: Yazılım Geliştirici, Satış Uzmanı',
            conditional_rules: [
                {
                    rule_id: 'show-management-questions',
                    trigger_question_id: 'job-title',
                    operator: 'CONTAINS',
                    trigger_value: 'müdür',
                    action: 'SHOW_QUESTION',
                    target_id: 'management-level',
                    priority: 5,
                    description: 'Yönetici pozisyonu için yönetim seviyesi sorusunu göster'
                }
            ]
        },

        // Conditional questions
        {
            question_id: 'contract-duration',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'Sözleşme süresi (ay cinsinden)',
            question_type: 'number',
            display_order: 5,
            is_required: true,
            default_visible: false,
            validation: { min_value: 1, max_value: 60 },
            conditional_rules: []
        },

        {
            question_id: 'weekly-hours',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'Haftalık çalışma saati',
            question_type: 'number',
            display_order: 6,
            is_required: true,
            default_visible: false,
            validation: { min_value: 10, max_value: 39 },
            conditional_rules: []
        },

        {
            question_id: 'management-level',
            template_id: 'is-sozlesmesi-dynamic',
            question_text: 'Yönetim seviyesi',
            question_type: 'multiple_choice',
            display_order: 7,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'team-lead', label: 'Takım Lideri' },
                { value: 'department-manager', label: 'Departman Müdürü' },
                { value: 'general-manager', label: 'Genel Müdür' }
            ],
            conditional_rules: []
        }
    ],

    metadata: {
        version: '1.0.0',
        created_date: '2025-09-18',
        updated_date: '2025-09-18',
        legal_references: ['İş Kanunu No: 4857'],
        complexity_level: 'ADVANCED',
        estimated_completion_time: 20
    },

    output_config: {
        default_format: 'PDF',
        supported_formats: ['PDF', 'DOCX', 'HTML']
    }
};

/**
 * Tüm dinamik template'leri export et
 */
export const DYNAMIC_TEMPLATES = [
    KIRA_SOZLESMESI_DYNAMIC_TEMPLATE,
    IS_SOZLESMESI_DYNAMIC_TEMPLATE
];

/**
 * Template ID'ye göre template bul
 */
export const getDynamicTemplate = (templateId: string): DynamicTemplate | undefined => {
    return DYNAMIC_TEMPLATES.find(template => template.template_id === templateId);
};

/**
 * Template validation utility
 */
export const validateDynamicTemplate = (template: DynamicTemplate): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    // Basic checks
    if (!template.questions.length) {
        errors.push('Template must have at least one question');
    }

    if (!template.initial_questions.length) {
        errors.push('Template must have at least one initial question');
    }

    // Check if initial questions exist in questions array
    for (const initialQ of template.initial_questions) {
        if (!template.questions.find(q => q.question_id === initialQ)) {
            errors.push(`Initial question '${initialQ}' not found in questions array`);
        }
    }

    // Check rule targets
    for (const question of template.questions) {
        for (const rule of question.conditional_rules) {
            const targetExists = template.questions.some(q => q.question_id === rule.target_id);
            if (!targetExists) {
                errors.push(`Rule target '${rule.target_id}' not found in questions`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};