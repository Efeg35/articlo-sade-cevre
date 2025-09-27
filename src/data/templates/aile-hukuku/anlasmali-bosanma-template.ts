/**
 * 🎯 Anlaşmalı Boşanma Protokolü ve Dava Dilekçesi - Dinamik Template
 * 
 * TMK 166/3 kapsamında anlaşmalı boşanma için protokol ve dilekçe
 * Çekişmeli boşanmadan farklı olarak daha barışçıl ve basit süreç
 */

import type { DynamicTemplate } from '../../../types/wizard/WizardTypes';

export const ANLASMALI_BOSANMA_TEMPLATE: DynamicTemplate = {
    template_id: 'anlasmali-bosanma-protokol-dilekcesi',
    template_name: 'Anlaşmalı Boşanma Protokolü ve Dava Dilekçesi',
    template_description: 'TMK 166/3 kapsamında anlaşmalı boşanma için protokol ve dilekçe template\'i',
    category: 'Aile Hukuku',

    initial_questions: [
        'davaci_ad_soyad',
        'davaci_tc',
        'davaci_adres',
        'davali_ad_soyad',
        'davali_tc',
        'davali_adres',
        'dava_sehri',
        'evlilik_tarihi'
    ],

    questions: [
        // MODÜL 1: Başvuru Makamı ve Taraf Bilgileri
        {
            question_id: 'davaci_ad_soyad',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Davayı açan eşin (Davacı) adı ve soyadı nedir?',
            question_type: 'text',
            display_order: 1,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 3,
                max_length: 100
            },
            help_text: 'Anlaşmalı boşanmada genellikle eşlerden biri dilekçeyi sunar'
        },
        {
            question_id: 'davaci_tc',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Davacı eşin T.C. Kimlik Numarası nedir?',
            question_type: 'text',
            display_order: 2,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                regex_pattern: '^[0-9]{11}$',
                custom_message: 'T.C. Kimlik Numarası 11 haneli olmalıdır'
            },
            placeholder: '12345678901'
        },
        {
            question_id: 'davaci_adres',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Davacı eşin mevcut tam adresi nedir?',
            question_type: 'text',
            display_order: 3,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 10,
                max_length: 300
            }
        },
        {
            question_id: 'davali_ad_soyad',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Diğer eşin (Davalı) adı ve soyadı nedir?',
            question_type: 'text',
            display_order: 4,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 3,
                max_length: 100
            }
        },
        {
            question_id: 'davali_tc',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Davalı eşin T.C. Kimlik Numarası nedir?',
            question_type: 'text',
            display_order: 5,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                regex_pattern: '^[0-9]{11}$',
                custom_message: 'T.C. Kimlik Numarası 11 haneli olmalıdır'
            },
            placeholder: '12345678901'
        },
        {
            question_id: 'davali_adres',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Davalı eşin mevcut tam adresi nedir?',
            question_type: 'text',
            display_order: 6,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 10,
                max_length: 300
            }
        },
        {
            question_id: 'dava_sehri',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Dava dilekçesinin sunulacağı şehir hangisidir?',
            question_type: 'text',
            display_order: 7,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 2,
                max_length: 50
            },
            placeholder: 'Örn: İstanbul, Ankara, İzmir'
        },

        // MODÜL 2: Dava Konusu ve Açıklamalar
        {
            question_id: 'evlilik_tarihi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Evlilik tarihiniz nedir?',
            question_type: 'date',
            display_order: 8,
            is_required: true,
            default_visible: true,
            conditional_rules: [
                {
                    rule_id: 'show_next_question_if_marriage_is_valid',
                    trigger_question_id: 'evlilik_tarihi',
                    operator: 'DATE_IS_OLDER_THAN_YEARS',
                    trigger_value: 1,
                    action: 'SHOW_QUESTION',
                    target_id: 'cocuk_var_mi',
                    priority: 1,
                    description: 'Eğer evlilik 1 yıldan uzun sürmüşse, bir sonraki soru olan çocuk sorusunu göster.'
                },
                {
                    rule_id: 'show_warning_if_marriage_is_too_short',
                    trigger_question_id: 'evlilik_tarihi',
                    operator: 'DATE_IS_OLDER_THAN_YEARS',
                    trigger_value: 1,
                    negate: true,
                    action: 'SHOW_QUESTION',
                    target_id: 'anlasmali_bosanma_sure_uyarisi',
                    priority: 1,
                    description: 'Eğer evlilik 1 yıldan kısa sürmüşse uyarı göster.'
                }
            ],
            help_text: 'Gün/Ay/Yıl formatında giriniz'
        },

        // MODÜL 3: Yasal Uyarı (Evlilik Süresi Kontrolü)
        {
            question_id: 'anlasmali_bosanma_sure_uyarisi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Yasal Uyarı',
            question_type: 'info_panel',
            display_order: 8.5,
            is_required: false,
            default_visible: false,
            info_text: 'Anlaşmalı boşanma davası açabilmek için evliliğinizin en az 1 yıl sürmüş olması (TMK 166/3) gerekmektedir. Girdiğiniz tarihe göre bu şart sağlanmamaktadır. Lütfen tarihi kontrol ediniz veya çekişmeli boşanma dilekçesini kullanınız.',
            conditional_rules: [],
            ui_config: {
                panel_type: 'warning',
                icon: 'warning-triangle'
            }
        },

        // MODÜL 4: Müşterek Çocuklar ve Velayet
        {
            question_id: 'cocuk_var_mi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Tarafların ortak çocuğu var mı?',
            question_type: 'multiple_choice',
            display_order: 9,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, ortak çocuğumuz var' },
                { value: 'hayir', label: 'Hayır, ortak çocuğumuz yok' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-cocuk-bilgileri',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'children_details',
                    priority: 1
                },
                {
                    rule_id: 'show-velayet-alan-taraf',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'velayeti_alacak_taraf',
                    priority: 2
                },
                {
                    rule_id: 'cocuk-yoksa-mali-sonuclara-gec',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_talebi_var_mi',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'children_details',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Çocuk Bilgileri',
            question_type: 'repeatable_group',
            display_order: 10,
            is_required: true,
            default_visible: false,
            repeatable_group: {
                group_id: 'children_info',
                group_title: 'Müşterek Çocuklar',
                min_instances: 1,
                max_instances: 10,
                add_button_text: 'Çocuk Ekle',
                remove_button_text: 'Çocuk Çıkar',
                group_questions: [
                    {
                        question_id: 'child_name',
                        template_id: 'anlasmali-bosanma-protokol-dilekcesi',
                        question_text: 'Çocuğun adı ve soyadı',
                        question_type: 'text',
                        display_order: 1,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: [],
                        validation: {
                            min_length: 2,
                            max_length: 100
                        },
                        placeholder: 'Örn: Zeynep Yılmaz'
                    },
                    {
                        question_id: 'child_birth_date',
                        template_id: 'anlasmali-bosanma-protokol-dilekcesi',
                        question_text: 'Çocuğun doğum tarihi',
                        question_type: 'date',
                        display_order: 2,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: [],
                        placeholder: 'GG/AA/YYYY'
                    }
                ]
            },
            conditional_rules: []
        },
        {
            question_id: 'velayeti_alacak_taraf',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Çocukların velayeti hangi ebeveynde kalacaktır?',
            question_type: 'multiple_choice',
            display_order: 11,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'davaci', label: 'Davacı eşte (dilekçeyi sunan)' },
                { value: 'davali', label: 'Davalı eşte (diğer eş)' },
                { value: 'ortak', label: 'Ortak velayette kalacak' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-nafaka-miktari',
                    trigger_question_id: 'velayeti_alacak_taraf',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'nafaka_miktari',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'nafaka_miktari',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Velayeti almayacak olan ebeveyn, çocuklar için aylık ne kadar iştirak nafakası ödeyecektir?',
            question_type: 'currency',
            display_order: 12,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 100000
            },
            conditional_rules: [
                {
                    rule_id: 'show-nafaka-artis-orani',
                    trigger_question_id: 'nafaka_miktari',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'nafaka_artis_orani',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'nafaka_artis_orani',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Belirlenen iştirak nafakasının her yıl hangi oranda artırılmasını kararlaştırdınız?',
            question_type: 'multiple_choice',
            display_order: 13,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'tufe', label: 'TÜİK Tüketici Fiyat Endeksi (TÜFE) oranında' },
                { value: 'ufe', label: 'TÜİK Üretici Fiyat Endeksi (ÜFE) oranında' },
                { value: 'yiufe', label: 'TÜİK Yurt İçi Üretici Fiyat Endeksi (Yİ-ÜFE) oranında' },
                { value: 'sabit_oran', label: 'Sabit yüzde oranında (Örn: %10)' },
                { value: 'asgari_ucret', label: 'Asgari ücret artış oranında' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-kisisel-iliski',
                    trigger_question_id: 'nafaka_artis_orani',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'kisisel_iliski_detaylari',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'kisisel_iliski_detaylari',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Velayeti almayan ebeveynin çocuklarla kişisel ilişkisi nasıl olacak?',
            question_type: 'text',
            display_order: 14,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            placeholder: 'Standart metin: Her ayın 1. ve 3. hafta sonu Cumartesi sabah 09:00\'dan Pazar akşam 18:00\'a kadar, dini bayramların ikinci günü sabah 09:00\'dan akşam 18:00\'a kadar ve her yıl 1 Temmuz ile 31 Temmuz tarihleri arasında olmak üzere şahsi ilişki tesis edilecektir.',
            validation: {
                min_length: 20,
                max_length: 1000
            },
            conditional_rules: [
                {
                    rule_id: 'show-yoksulluk-nafakasi-talebi',
                    trigger_question_id: 'kisisel_iliski_detaylari',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_talebi_var_mi',
                    priority: 1
                }
            ]
        },

        // MODÜL 5: Mali Sonuçlar
        {
            question_id: 'yoksulluk_nafakasi_talebi_var_mi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Taraflardan biri, diğeri için yoksulluk nafakası talep ediyor mu?',
            question_type: 'multiple_choice',
            display_order: 15,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, yoksulluk nafakası ödenecek' },
                { value: 'hayir', label: 'Hayır, yoksulluk nafakası talebi yok' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-yoksulluk-nafaka-miktari',
                    trigger_question_id: 'yoksulluk_nafakasi_talebi_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_miktari',
                    priority: 1
                },
                {
                    rule_id: 'show-tazminat-talebi',
                    trigger_question_id: 'yoksulluk_nafakasi_talebi_var_mi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'tazminat_talebi_var_mi',
                    priority: 2
                }
            ],
            help_text: 'Anlaşmalı boşanmada genellikle yoksulluk nafakası talebi olmaz'
        },
        {
            question_id: 'yoksulluk_nafakasi_miktari',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Aylık ne kadar yoksulluk nafakası ödenecek?',
            question_type: 'currency',
            display_order: 16,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 50000
            },
            conditional_rules: []
        },
        {
            question_id: 'tazminat_talebi_var_mi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Taraflar birbirinden maddi veya manevi tazminat talep ediyor mu?',
            question_type: 'multiple_choice',
            display_order: 17,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'hayir', label: 'Hayır, tazminat talebi yok (Önerilen)' },
                { value: 'evet', label: 'Evet, tazminat talebi var' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-mal-paylasimi',
                    trigger_question_id: 'tazminat_talebi_var_mi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'mal_paylasimi_anlasmasi',
                    priority: 1
                }
            ],
            help_text: 'Anlaşmalı boşanmada genellikle tazminat talebi olmaz'
        },
        {
            question_id: 'mal_paylasimi_anlasmasi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Mal paylaşımı konusunda nasıl bir anlaşmaya vardınız?',
            question_type: 'text',
            display_order: 18,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            placeholder: 'Örnek: Taraflar evlilik birliği içinde edindikleri tüm malları kendi aralarında paylaşmış olup, birbirlerinden mal rejiminin tasfiyesine yönelik herhangi bir alacak veya katılma payı talepleri bulunmamaktadır.',
            validation: {
                min_length: 20,
                max_length: 1000
            },
            conditional_rules: [
                {
                    rule_id: 'show-masraf-anlasmasi',
                    trigger_question_id: 'mal_paylasimi_anlasmasi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'masraf_anlasmasi',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'masraf_anlasmasi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Dava masrafları ve avukatlık ücretleri konusunda anlaştınız mı?',
            question_type: 'multiple_choice',
            display_order: 19,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, kimse diğerinden talep etmeyecek' },
                { value: 'ozel_anlasma', label: 'Özel anlaşmamız var' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-dilekce-tarihi',
                    trigger_question_id: 'masraf_anlasmasi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'dilekce_tarihi',
                    priority: 1
                }
            ],
            help_text: 'Anlaşmalı boşanmada genellikle masraflar paylaşılır'
        },

        // MODÜL 7: Final
        {
            question_id: 'dilekce_tarihi',
            template_id: 'anlasmali-bosanma-protokol-dilekcesi',
            question_text: 'Dilekçenin düzenlendiği tarih nedir?',
            question_type: 'date',
            display_order: 20,
            is_required: true,
            default_visible: false,
            conditional_rules: []
        }
    ],

    metadata: {
        version: '1.0.0',
        created_date: '2025-09-26',
        updated_date: '2025-09-26',
        legal_references: [
            'TMK 166/3 - Anlaşmalı Boşanma',
            'TMK 182 - Velayet',
            'TMK 175 - Nafaka',
            'HMK - Hukuk Muhakemeleri Kanunu'
        ],
        complexity_level: 'INTERMEDIATE',
        estimated_completion_time: 12
    },

    output_config: {
        default_format: 'PDF',
        supported_formats: ['PDF', 'DOCX', 'HTML'],
        template_file_path: 'templates/aile-hukuku/anlasmali-bosanma.hbs'
    }
};

/**
 * Final Belge Template'i - Handlebars formatında
 * Anlaşmalı boşanma için protokol ve dilekçe
 */
export const ANLASMALI_BOSANMA_DOCUMENT_TEMPLATE = `{{{dava_sehri}}} NÖBETÇİ AİLE MAHKEMESİ'NE

DAVACI: {{{davaci_ad_soyad}}} (T.C. Kimlik No: {{{davaci_tc}}})
Adres: {{{davaci_adres}}}

DAVALI: {{{davali_ad_soyad}}} (T.C. Kimlik No: {{{davali_tc}}})
Adres: {{{davali_adres}}}

KONU: Evlilik birliğinin temelinden sarsılması nedeniyle, Türk Medeni Kanunu'nun 166/3. maddesi uyarınca anlaşmalı olarak boşanma kararı verilmesi ve ekte sunulan protokolün tasdiki talebinden ibarettir.

AÇIKLAMALAR:

Davalı ile {{{evlilik_tarihi}}} tarihinde evlendik. Bu evlilikten nüfus kayıtlarında da görüleceği üzere {{#eq cocuk_var_mi "evet"}}müşterek çocuklarımız bulunmaktadır{{else}}müşterek çocuklarımız bulunmamaktadır{{/eq}}.

Evliliğimizin devamı süresince aramızda zamanla şiddetli geçimsizlik baş göstermiş ve bu durum evlilik birliğinin temelinden sarsılmasına neden olmuştur. Mevcut durum itibarıyla evliliğimizi sürdürmemiz her iki taraf için de mümkün değildir.

Taraflar olarak bir araya gelerek medeni bir şekilde boşanma ve boşanmanın tüm fer'ileri (nafaka, velayet, tazminat, mal paylaşımı vb.) konusunda tam bir mutabakata varmış bulunmaktayız. Bu mutabakatımızı içeren ve her iki tarafça da serbest irademizle imzaladığımız "Anlaşmalı Boşanma Protokolü" dilekçemiz ekinde Sayın Mahkemenize sunulmuştur.

Boşanma talebimizi ve protokoldeki tüm şartları duruşmada da bizzat beyan edeceğimizi bildiririz.

---

ANLAŞMALI BOŞANMA PROTOKOLÜ

İşbu protokol, bir tarafta {{{davaci_ad_soyad}}} (bundan sonra "Taraf 1" olarak anılacaktır) ile diğer tarafta {{{davali_ad_soyad}}} (bundan sonra "Taraf 2" olarak anılacaktır) arasında, evlilik birliğinin anlaşmalı boşanma yoluyla sona erdirilmesinin hukuki ve mali sonuçlarını düzenlemek amacıyla, hür iradeleriyle ve hiçbir baskı altında kalmaksızın aşağıdaki şartlarda akdedilmiştir.

1. BOŞANMA HUSUSU
Her iki taraf da, aralarındaki evlilik birliğinin temelinden sarsılmış olduğunu ve fiilen bitmiş bulunduğunu kabul ederek, Türk Medeni Kanunu'nun 166/3. maddesi uyarınca boşanmayı karşılıklı olarak kabul ve beyan ederler.

2. MÜŞTEREK ÇOCUKLARIN DURUMU

{{#eq cocuk_var_mi "hayir"}}
Tarafların evlilik birliğinden müşterek çocukları bulunmamaktadır.
{{/eq}}

{{#eq cocuk_var_mi "evet"}}
Tarafların evlilik birliğinden doğan, {{#each children_details}}{{child_name}} ({{child_birth_date}}){{#unless @last}}, {{/unless}}{{/each}} isimli müşterek çocukları bulunmaktadır.

a) Velayet: Müşterek çocukların velayetinin {{#eq velayeti_alacak_taraf "davaci"}}davacı tarafta{{else if velayeti_alacak_taraf "davali"}}davalı tarafta{{else}}her iki tarafta ortak olarak{{/eq}} kalması hususunda taraflar anlaşmışlardır.

b) İştirak Nafakası: Velayeti kendisine bırakılmayan taraf, müşterek çocuklar için aylık {{{nafaka_miktari}}} TL iştirak nafakasını, her ayın en geç 5. gününe kadar velayeti alan tarafın bildireceği banka hesabına ödemeyi kabul ve taahhüt eder. İşbu nafaka miktarı, her yıl {{#eq nafaka_artis_orani "tufe"}}TÜİK Tüketici Fiyat Endeksi (TÜFE) oranında{{else if nafaka_artis_orani "ufe"}}TÜİK Üretici Fiyat Endeksi (ÜFE) oranında{{else if nafaka_artis_orani "yiufe"}}TÜİK Yurt İçi Üretici Fiyat Endeksi (Yİ-ÜFE) oranında{{else if nafaka_artis_orani "asgari_ucret"}}Asgari ücret artış oranında{{else}}belirlenen sabit oranda{{/eq}} artırılacaktır.

c) Kişisel İlişki Tesisi: Velayeti almayan taraf ile müşterek çocuklar arasında; {{{kisisel_iliski_detaylari}}} Taraflar, çocukların menfaatini gözeterek bu süreleri iyi niyet çerçevesinde değiştirebilirler.
{{/eq}}

3. BOŞANMANIN MALİ SONUÇLARI

a) Yoksulluk Nafakası:
{{#eq yoksulluk_nafakasi_talebi_var_mi "hayir"}}
Taraflar, boşanma nedeniyle yoksulluğa düşmeyeceklerini beyanla, birbirlerinden karşılıklı olarak yoksulluk nafakası talebinde bulunmadıklarını ve bu haklarından feragat ettiklerini kabul ve beyan ederler.
{{else}}
Taraflardan biri, diğer tarafa aylık {{{yoksulluk_nafakasi_miktari}}} TL yoksulluk nafakası ödeyecektir.
{{/eq}}

b) Maddi ve Manevi Tazminat:
{{#eq tazminat_talebi_var_mi "hayir"}}
Tarafların boşanma sebebiyle birbirlerinden herhangi bir maddi veya manevi tazminat talepleri yoktur. Taraflar bu konudaki tüm haklarından karşılıklı olarak feragat ettiklerini beyan ederler.
{{else}}
Taraflar arasında tazminat konusunda özel anlaşma bulunmaktadır.
{{/eq}}

c) Mal Rejiminin Tasfiyesi:
{{{mal_paylasimi_anlasmasi}}} Taraflar, ev eşyaları konusunda da anlaşmış olup, birbirlerinden bu konuda da bir talepleri bulunmamaktadır.

d) Yargılama Giderleri ve Vekalet Ücreti:
{{#eq masraf_anlasmasi "evet"}}
Taraflar, yargılama giderleri ve vekalet ücreti konusunda birbirlerinden herhangi bir talepte bulunmayacaklarını kabul ve beyan ederler.
{{else}}
Taraflar arasında masraf paylaşımı konusunda özel anlaşma bulunmaktadır.
{{/eq}}

SONUÇ: İşbu protokol, taraflarca okunmuş, içeriği ve sonuçları anlaşılarak {{{dilekce_tarihi}}} tarihinde iki nüsha olarak imza altına alınmış ve mahkemeye sunulmuştur.

Taraf 1 (Davacı)                    Taraf 2 (Davalı)
{{{davaci_ad_soyad}}}                {{{davali_ad_soyad}}}
(İmza)                               (İmza)

---

HUKUKİ NEDENLER: TMK m. 166/3, HMK ve ilgili sair mevzuat.

HUKUKİ DELİLLER: Nüfus Kayıt Örneği, Anlaşmalı Boşanma Protokolü, tanık beyanları ve her türlü yasal delil.

SONUÇ VE İSTEM: Yukarıda arz ve izah edilen nedenlerle ve re'sen gözetilecek hususlarla birlikte;

Davamızın KABULÜNE,

Tarafların, ekte sunulan protokol hükümleri çerçevesinde ve TMK m. 166/3 uyarınca ANLAŞMALI OLARAK BOŞANMALARINA,

Ekte sunulan {{{dilekce_tarihi}}} tarihli Anlaşmalı Boşanma Protokolü'nün aynen TASDİKİNE,

Yargılama giderlerinin taraflar üzerinde bırakılmasına karar verilmesini saygılarımızla arz ve talep ederiz.

{{{dilekce_tarihi}}}

EKLER:
- Anlaşmalı Boşanma Protokolü
- Nüfus Kayıt Örneği
- Kimlik Fotokopileri

Davacı                               Davalı
{{{davaci_ad_soyad}}}                {{{davali_ad_soyad}}}
(İmza)                               (İmza)`;