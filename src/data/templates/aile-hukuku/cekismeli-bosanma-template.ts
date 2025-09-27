/**
 * 🎯 Çekişmeli Boşanma Dava Dilekçesi - Dinamik Template
 * 
 * LawDepot tarzı dinamik soru sistemi ile çekişmeli boşanma davası
 * Kullanıcı cevaplarına göre ilgili bölümler dinamik olarak gösterilir
 */

import type { DynamicTemplate } from '../../../types/wizard/WizardTypes';

export const CEKISMELI_BOSANMA_TEMPLATE: DynamicTemplate = {
    template_id: 'cekismeli-bosanma-dava-dilekcesi',
    template_name: 'Çekişmeli Boşanma Dava Dilekçesi',
    template_description: 'TMK kapsamında çekişmeli boşanma davası için tam kapsamlı dilekçe template\'i',
    category: 'Aile Hukuku',

    initial_questions: [
        'sehir_adi',
        'davaci_ad_soyad',
        'davaci_tc_kimlik',
        'davaci_adres',
        'davali_ad_soyad',
        'davali_adres',
        'evlilik_tarihi'
        // Diğer sorular conditional rules ile gösterilecek
    ],

    questions: [
        // MODÜL 1: Taraf Bilgileri
        {
            question_id: 'sehir_adi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Dava hangi şehirdeki Aile Mahkemesi\'ne açılacak?',
            question_type: 'text',
            display_order: 1,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 2,
                max_length: 50
            },
            placeholder: 'Örn: İstanbul, Ankara, İzmir'
        },
        {
            question_id: 'davaci_ad_soyad',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davacının Adı ve Soyadı nedir?',
            question_type: 'text',
            display_order: 2,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 3,
                max_length: 100
            }
        },
        {
            question_id: 'davaci_tc_kimlik',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davacının T.C. Kimlik Numarası nedir?',
            question_type: 'text',
            display_order: 3,
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
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davacının tam adresi nedir?',
            question_type: 'text',
            display_order: 4,
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
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davalının Adı ve Soyadı nedir?',
            question_type: 'text',
            display_order: 5,
            is_required: true,
            default_visible: true,
            conditional_rules: [],
            validation: {
                min_length: 3,
                max_length: 100
            }
        },
        {
            question_id: 'davali_adres',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davalının bilinen son tam adresi nedir?',
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

        // MODÜL 3: Evlilik ve Boşanma Nedenleri
        {
            question_id: 'evlilik_tarihi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Evlilik tarihinizi belirtiniz',
            question_type: 'date',
            display_order: 7,
            is_required: true,
            default_visible: true,
            conditional_rules: [
                {
                    rule_id: 'show-cocuk-check',
                    trigger_question_id: 'evlilik_tarihi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'cocuk_var_mi',
                    priority: 1,
                    description: 'Evlilik tarihi girilince çocuk varlığı sorulsun'
                },
                {
                    rule_id: 'show-bosanma-nedenleri',
                    trigger_question_id: 'evlilik_tarihi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'bosanma_nedenleri_secim',
                    priority: 2,
                    description: 'Evlilik tarihi girilince boşanma nedenleri sorulsun'
                }
            ]
        },
        {
            question_id: 'cocuk_var_mi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Evlilikten müşterek çocuğunuz var mı?',
            question_type: 'multiple_choice',
            display_order: 8,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, müşterek çocuğumuz var' },
                { value: 'hayir', label: 'Hayır, müşterek çocuğumuz yok' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-cocuk-detaylari-varsa',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'children_details',
                    priority: 1,
                    description: 'Çocuk varsa detayları sorulsun'
                },
                {
                    rule_id: 'show-velayet-talep-varsa',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'velayet_talep_ediyor',
                    priority: 2
                },
                {
                    rule_id: 'cocuk-yoksa-direkt-vakia-anlatimina-gec',
                    trigger_question_id: 'cocuk_var_mi',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'vakialarin_detayli_anlatimi',
                    priority: 3
                }
            ]
        },
        {
            question_id: 'bosanma_nedenleri_secim',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Boşanma davasını hangi temel nedene/nedenlere dayandırıyorsunuz? (Birden fazla seçilebilir)',
            question_type: 'multiple_choice',
            display_order: 9,
            is_required: true,
            default_visible: false,
            options: [
                {
                    value: 'siddetli_gecımsızlik',
                    label: 'Şiddetli Geçimsizlik / Evlilik Birliğinin Temelinden Sarsılması (TMK 166)',
                    description: 'En yaygın boşanma sebebi'
                },
                {
                    value: 'zina',
                    label: 'Zina (Aldatma) (TMK 161)',
                    description: 'Sadakat yükümlülüğünün ihlali'
                },
                {
                    value: 'onur_kirici_davranis',
                    label: 'Hayata Kast, Pek Kötü veya Onur Kırıcı Davranış (TMK 162)',
                    description: 'Fiziksel/psikolojik şiddet'
                },
                {
                    value: 'terk',
                    label: 'Terk (TMK 164)',
                    description: 'En az 6 ay ayrı yaşama'
                }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-vakıa-anlatimi',
                    trigger_question_id: 'bosanma_nedenleri_secim',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'vakialarin_detayli_anlatimi',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'vakialarin_detayli_anlatimi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Lütfen yukarıda seçtiğiniz nedenlere ilişkin olayları, davalının kusurlu davranışlarını, yaşadığınız sorunları somut örnekler ve mümkünse tarihler vererek detaylı bir şekilde anlatınız.',
            question_type: 'text',
            display_order: 10,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full',
                show_character_count: true
            },
            validation: {
                min_length: 50,
                max_length: 2000
            },
            help_text: 'Tarih, yer, tanık, belge gibi somut ayrıntıları belirtiniz. Detaylı anlatım davanızı güçlendirir.',
            conditional_rules: [
                {
                    rule_id: 'vakia-anlatimi-bitince-nafaka-bolumune-gec',
                    trigger_question_id: 'vakialarin_detayli_anlatimi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'kendisi_icin_tedbir_nafakasi_talep',
                    priority: 1
                }
            ]
        },

        // MODÜL 4: Çocuk Bilgileri (Koşullu) - Tekrarlanabilir Grup
        {
            question_id: 'children_details',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Müşterek Çocukların Bilgileri',
            question_type: 'repeatable_group',
            display_order: 11,
            is_required: true,
            default_visible: false,
            conditional_rules: [],
            repeatable_group: {
                group_id: 'children_info',
                group_title: 'Çocuk Bilgileri',
                min_instances: 1,
                max_instances: 10,
                add_button_text: 'Çocuk Ekle',
                remove_button_text: 'Çocuk Çıkar',
                group_questions: [
                    {
                        question_id: 'child_name',
                        template_id: 'cekismeli-bosanma-dava-dilekcesi',
                        question_text: '{{instance}}. Çocuğun Adı Soyadı',
                        question_type: 'text',
                        display_order: 1,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: [],
                        validation: {
                            min_length: 2,
                            max_length: 100
                        },
                        placeholder: 'Çocuğun tam adını giriniz'
                    },
                    {
                        question_id: 'child_birth_date',
                        template_id: 'cekismeli-bosanma-dava-dilekcesi',
                        question_text: '{{instance}}. Çocuğun Doğum Tarihi',
                        question_type: 'date',
                        display_order: 2,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: [],
                        placeholder: 'YYYY-MM-DD',
                        help_text: 'Çocuğun doğum tarihini seçiniz'
                    }
                ]
            },
            help_text: 'Her çocuk için gerekli bilgileri ekleyin'
        },
        {
            question_id: 'velayet_talep_ediyor',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Çocukların velayetini talep ediyor musunuz?',
            question_type: 'multiple_choice',
            display_order: 12,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, velayet talep ediyorum' },
                { value: 'hayir', label: 'Hayır, velayet talep etmiyorum' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-velayet-gerekce',
                    trigger_question_id: 'velayet_talep_ediyor',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'velayet_talep_gerekcesi',
                    priority: 1
                },
                {
                    rule_id: 'show-cocuk-tedbir-nafaka',
                    trigger_question_id: 'velayet_talep_ediyor',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'cocuk_tedbir_nafakasi_tutari',
                    priority: 2
                },
                {
                    rule_id: 'velayet-surenci-bitince-vakia-anlatimina-gec',
                    trigger_question_id: 'velayet_talep_ediyor',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'vakialarin_detayli_anlatimi',
                    priority: 3
                }
            ]
        },
        {
            question_id: 'velayet_talep_gerekcesi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Velayeti neden talep ediyorsunuz? (Çocuğun bakımıyla olan ilginiz, davalının durumunun velayete uygun olmaması gibi nedenlerle, çocuğun üstün yararını esas alarak açıklayınız.)',
            question_type: 'text',
            display_order: 13,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 30,
                max_length: 1000
            },
            conditional_rules: []
        },

        // MODÜL 4: Nafaka Talepleri
        {
            question_id: 'cocuk_tedbir_nafakasi_tutari',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Dava süresince her bir çocuk için aylık ne kadar tedbir nafakası talep ediyorsunuz?',
            question_type: 'currency',
            display_order: 14,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 50000
            },
            conditional_rules: [
                {
                    rule_id: 'show-cocuk-istirak-nafaka',
                    trigger_question_id: 'cocuk_tedbir_nafakasi_tutari',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'cocuk_istirak_nafakasi_tutari',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'cocuk_istirak_nafakasi_tutari',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Boşanma sonrası her bir çocuk için aylık ne kadar iştirak nafakası talep ediyorsunuz?',
            question_type: 'currency',
            display_order: 15,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 50000
            },
            conditional_rules: [
                {
                    rule_id: 'cocuk-bolumu-bitince-vakia-anlatimina-gec',
                    trigger_question_id: 'cocuk_istirak_nafakasi_tutari',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'vakialarin_detayli_anlatimi',
                    priority: 1
                }
            ]
        },

        // Kendi Nafaka Talepleri
        {
            question_id: 'kendisi_icin_tedbir_nafakasi_talep',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Dava süresince kendiniz için tedbir nafakası talep ediyor musunuz?',
            question_type: 'multiple_choice',
            display_order: 16,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, tedbir nafakası talep ediyorum' },
                { value: 'hayir', label: 'Hayır, tedbir nafakası talep etmiyorum' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-tedbir-nafaka-tutar',
                    trigger_question_id: 'kendisi_icin_tedbir_nafakasi_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'kendisi_icin_tedbir_nafakasi_tutari',
                    priority: 1
                },
                {
                    rule_id: 'tedbir-nafaka-bitince-yoksulluk-nafakaya-gec',
                    trigger_question_id: 'kendisi_icin_tedbir_nafakasi_talep',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_talep',
                    priority: 2
                }
            ]
        },
        {
            question_id: 'kendisi_icin_tedbir_nafakasi_tutari',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Tedbir nafakası tutarını belirtiniz',
            question_type: 'currency',
            display_order: 17,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 50000
            },
            conditional_rules: [
                {
                    rule_id: 'tedbir-nafaka-tutari-bitince-yoksulluk-nafakaya-gec',
                    trigger_question_id: 'kendisi_icin_tedbir_nafakasi_tutari',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_talep',
                    priority: 1
                }
            ]
        },

        {
            question_id: 'yoksulluk_nafakasi_talep',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Boşanma sonrası kendiniz için yoksulluk nafakası talep ediyor musunuz?',
            question_type: 'multiple_choice',
            display_order: 18,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, yoksulluk nafakası talep ediyorum' },
                { value: 'hayir', label: 'Hayır, yoksulluk nafakası talep etmiyorum' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-yoksulluk-nafaka-tutar',
                    trigger_question_id: 'yoksulluk_nafakasi_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_tutar',
                    priority: 1
                },
                {
                    rule_id: 'show-yoksulluk-gerekce',
                    trigger_question_id: 'yoksulluk_nafakasi_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'yoksulluk_nafakasi_gerekcesi',
                    priority: 2
                },
                {
                    rule_id: 'yoksulluk-nafaka-bitince-maddi-tazminata-gec',
                    trigger_question_id: 'yoksulluk_nafakasi_talep',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'maddi_tazminat_talep',
                    priority: 3
                }
            ]
        },
        {
            question_id: 'yoksulluk_nafakasi_tutar',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Yoksulluk nafakası tutarını belirtiniz',
            question_type: 'currency',
            display_order: 19,
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
            question_id: 'yoksulluk_nafakasi_gerekcesi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Yoksulluk nafakası talebinizi neye dayandırıyorsunuz? (Örn: Evlilik nedeniyle çalışma hayatından uzak kalmanız, gelirinizin olmaması, davalının gelir durumunun çok yüksek olması vb.)',
            question_type: 'text',
            display_order: 20,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 20,
                max_length: 500
            },
            conditional_rules: [
                {
                    rule_id: 'yoksulluk-nafaka-gerekcesi-bitince-maddi-tazminata-gec',
                    trigger_question_id: 'yoksulluk_nafakasi_gerekcesi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'maddi_tazminat_talep',
                    priority: 1
                }
            ]
        },

        // MODÜL 4: Tazminat Talepleri
        {
            question_id: 'maddi_tazminat_talep',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Maddi tazminat talep ediyor musunuz?',
            question_type: 'multiple_choice',
            display_order: 21,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, maddi tazminat talep ediyorum' },
                { value: 'hayir', label: 'Hayır, maddi tazminat talep etmiyorum' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-maddi-tazminat-tutar',
                    trigger_question_id: 'maddi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'maddi_tazminat_tutar',
                    priority: 1
                },
                {
                    rule_id: 'show-maddi-tazminat-gerekce',
                    trigger_question_id: 'maddi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'maddi_tazminat_gerekcesi',
                    priority: 2
                },
                {
                    rule_id: 'maddi-tazminat-bitince-manevi-tazminata-gec',
                    trigger_question_id: 'maddi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'manevi_tazminat_talep',
                    priority: 3
                }
            ]
        },
        {
            question_id: 'maddi_tazminat_tutar',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Maddi tazminat tutarını belirtiniz',
            question_type: 'currency',
            display_order: 22,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 1000000
            },
            conditional_rules: [
                {
                    rule_id: 'maddi-tazminat-tutari-bitince-manevi-tazminata-gec',
                    trigger_question_id: 'maddi_tazminat_tutar',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'manevi_tazminat_talep',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'maddi_tazminat_gerekcesi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Maddi tazminat talebinizin dayanağı nedir? (Örn: Boşanma nedeniyle mevcut veya beklenen hangi menfaatlerinizin zarar gördüğünü açıklayınız.)',
            question_type: 'text',
            display_order: 23,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 20,
                max_length: 500
            },
            conditional_rules: [
                {
                    rule_id: 'maddi-tazminat-gerekcesi-bitince-manevi-tazminata-gec',
                    trigger_question_id: 'maddi_tazminat_gerekcesi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'manevi_tazminat_talep',
                    priority: 1
                }
            ]
        },

        {
            question_id: 'manevi_tazminat_talep',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Manevi tazminat talep ediyor musunuz?',
            question_type: 'multiple_choice',
            display_order: 24,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'evet', label: 'Evet, manevi tazminat talep ediyorum' },
                { value: 'hayir', label: 'Hayır, manevi tazminat talep etmiyorum' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-manevi-tazminat-tutar',
                    trigger_question_id: 'manevi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'manevi_tazminat_tutar',
                    priority: 1
                },
                {
                    rule_id: 'show-manevi-tazminat-gerekce',
                    trigger_question_id: 'manevi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'evet',
                    action: 'SHOW_QUESTION',
                    target_id: 'manevi_tazminat_gerekcesi',
                    priority: 2
                },
                {
                    rule_id: 'manevi-tazminat-bitince-delillere-gec',
                    trigger_question_id: 'manevi_tazminat_talep',
                    operator: 'EQUALS',
                    trigger_value: 'hayir',
                    action: 'SHOW_QUESTION',
                    target_id: 'delil_listesi',
                    priority: 3
                }
            ]
        },
        {
            question_id: 'manevi_tazminat_tutar',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Manevi tazminat tutarını belirtiniz',
            question_type: 'currency',
            display_order: 25,
            is_required: true,
            default_visible: false,
            ui_config: {
                currency_symbol: '₺'
            },
            validation: {
                min_value: 0,
                max_value: 500000
            },
            conditional_rules: [
                {
                    rule_id: 'show-deliller',
                    trigger_question_id: 'manevi_tazminat_tutar',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'delil_listesi',
                    priority: 1
                }
            ]
        },
        {
            question_id: 'manevi_tazminat_gerekcesi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Manevi tazminat talebinizin dayanağı nedir? (Örn: Yaşadığınız üzüntü, elem ve kişilik haklarınıza yapılan saldırıları açıklayınız.)',
            question_type: 'text',
            display_order: 26,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            validation: {
                min_length: 20,
                max_length: 500
            },
            conditional_rules: [
                {
                    rule_id: 'manevi-tazminat-gerekcesi-bitince-delillere-gec',
                    trigger_question_id: 'manevi_tazminat_gerekcesi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'delil_listesi',
                    priority: 1
                }
            ]
        },

        // MODÜL 5: Deliller
        {
            question_id: 'delil_listesi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Davanızda hangi delillere dayanacaksınız? (İlgili olanları işaretleyiniz)',
            question_type: 'multiple_choice',
            display_order: 30,
            is_required: true,
            default_visible: false,
            options: [
                { value: 'tanik_beyanlari', label: 'Tanık Beyanları' },
                { value: 'banka_kayitlari', label: 'Banka Kayıtları ve Kredi Kartı Ekstreleri' },
                { value: 'sosyal_medya', label: 'Sosyal Medya İçerikleri (Mesaj, fotoğraf, paylaşım vb.)' },
                { value: 'telefon_kayitlari', label: 'Telefon Kayıtları (HTS Kayıtları)' },
                { value: 'otel_kayitlari', label: 'Otel Kayıtları' },
                { value: 'fotograflar', label: 'Fotoğraflar, Videolar' },
                { value: 'mesajlasmalar', label: 'Mesajlaşma (SMS, Whatsapp vb.) Ekran Görüntüleri' },
                { value: 'saglik_raporlari', label: 'Darp Raporu / Sağlık Raporları' }
            ],
            conditional_rules: [
                {
                    rule_id: 'show-tanik-listesi',
                    trigger_question_id: 'delil_listesi',
                    operator: 'CONTAINS',
                    trigger_value: 'tanik_beyanlari',
                    action: 'SHOW_QUESTION',
                    target_id: 'tanik_listesi_ve_konulari',
                    priority: 1,
                    description: 'Tanık seçildiyse tanık listesi sorulsun'
                },
                {
                    rule_id: 'show-dilekce-tarihi',
                    trigger_question_id: 'delil_listesi',
                    operator: 'IS_NOT_EMPTY',
                    trigger_value: '',
                    action: 'SHOW_QUESTION',
                    target_id: 'dilekce_tarihi',
                    priority: 2
                }
            ]
        },
        {
            question_id: 'tanik_listesi_ve_konulari',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Tanık dinletecekseniz, isimlerini ve hangi konuda tanıklık yapacaklarını kısaca belirtiniz',
            question_type: 'text',
            display_order: 28,
            is_required: true,
            default_visible: false,
            ui_config: {
                allow_multiline: true,
                width: 'full'
            },
            placeholder: 'Örn: Mehmet Yılmaz - Davalının şiddet uyguladığına tanık\nAyşe Demir - Zina vakasına tanık',
            validation: {
                min_length: 10,
                max_length: 500
            },
            conditional_rules: []
        },

        // MODÜL 6: Final
        {
            question_id: 'dilekce_tarihi',
            template_id: 'cekismeli-bosanma-dava-dilekcesi',
            question_text: 'Dilekçenin düzenlendiği tarih nedir?',
            question_type: 'date',
            display_order: 29,
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
            'TMK 161 - Zina',
            'TMK 162 - Hayata Kast, Pek Kötü veya Onur Kırıcı Davranış',
            'TMK 164 - Terk',
            'TMK 166 - Şiddetli Geçimsizlik',
            'TMK 182 - Velayet',
            'TMK 175 - Nafaka'
        ],
        complexity_level: 'ADVANCED',
        estimated_completion_time: 15
    },

    output_config: {
        default_format: 'PDF',
        supported_formats: ['PDF', 'DOCX', 'HTML'],
        template_file_path: 'templates/aile-hukuku/cekismeli-bosanma.hbs'
    }
};

/**
 * Final Belge Template'i - Handlebars formatında
 * Cevaplara göre dinamik bölümler oluşturulur
 */
export const CEKISMELI_BOSANMA_DOCUMENT_TEMPLATE = `{{{sehir_adi}}} NÖBETÇİ AİLE MAHKEMESİ HAKİMLİĞİ'NE

DAVACI : {{{davaci_ad_soyad}}} (T.C. Kimlik No: {{{davaci_tc_kimlik}}})
ADRES : {{{davaci_adres}}}

DAVALI : {{{davali_ad_soyad}}}
ADRES : {{{davali_adres}}}

KONU : Evlilik birliğinin temelinden sarsılması ve davalının kusurlu eylemleri nedeniyle boşanma, velayet, nafaka ve tazminat taleplerimizi içeren dava dilekçesidir.

AÇIKLAMALAR

Davalı taraf ile {{{evlilik_tarihi}}} tarihinde evlenmiş bulunmaktayız. {{#if cocuk_var_mi}}Tarafların bu evlilikten müşterek çocukları bulunmaktadır.{{else}}Tarafların bu evlilikten müşterek çocukları bulunmamaktadır.{{/if}}

Evlilik birliğimiz, davalı tarafın kusurlu eylem ve tutumları neticesinde temelinden sarsılmış ve ortak hayatın sürdürülmesi tarafımızdan beklenemeyecek derecede çekilmez hale gelmiştir. Şöyle ki;

{{#contains bosanma_nedenleri_secim "siddetli_gecımsızlik"}}
Davalı taraf, evlilik birliğinin kendisine yüklediği sadakat, ortak giderlere katılma ve manevi destek olma gibi temel sorumluluklarını yerine getirmemiş; tarafıma karşı ekonomik, psikolojik ve/veya fiziksel şiddet boyutuna varan davranışlar sergilemiştir. Bu durum, ortak hayatı benim için çekilmez kılmıştır.
{{/contains}}

{{#contains bosanma_nedenleri_secim "zina"}}
Davalı taraf, evlilik birliğimiz devam ederken sadakat yükümlülüğünü ağır bir şekilde ihlal ederek bir başka kişiyle cinsel birliktelik yaşamıştır. Zina olgusunu kanıtlayacak delillerimiz mevcuttur ve bu durum evlilik birliğini temelinden sarsmıştır.
{{/contains}}

{{#contains bosanma_nedenleri_secim "onur_kirici_davranis"}}
Davalı, şahsıma yönelik olarak üçüncü kişilerin de yanında küçük düşürücü, aşağılayıcı ve ağır hakaret içeren sözler sarf ederek onurumu ve saygınlığımı ağır şekilde zedelemiştir.
{{/contains}}

{{{vakialarin_detayli_anlatimi}}}

Yukarıda detaylıca anlattığım üzere, davalının ağır kusurlu eylemleri neticesinde bir araya gelerek evliliğimizi devam ettirmemiz hayatın olağan akışına aykırıdır. Bu nedenle işbu boşanma davasını açma zorunluluğu hasıl olmuştur.

TALEPLERİMİZE İLİŞKİN GEREKÇELERİMİZ

{{#if cocuk_var_mi}}
{{#eq velayet_talep_ediyor "evet"}}
Velayet Hakkında: Müşterek çocuklarımız olan {{{cocuk_bilgileri}}}'nın velayetinin tarafıma verilmesini talep ediyorum. Zira, {{{velayet_talep_gerekcesi}}}
{{/eq}}
{{/if}}

{{#or yoksulluk_nafakasi_talep kendisi_icin_tedbir_nafakasi_talep}}
Nafakalar Hakkında: {{{yoksulluk_nafakasi_gerekcesi}}} Bu nedenlerle, dava süresince şahsım için aylık {{{kendisi_icin_tedbir_nafakasi_tutari}}} TL{{#if cocuk_var_mi}} ve müşterek çocuklar için aylık {{{cocuk_tedbir_nafakasi_tutari}}} TL{{/if}} tedbir nafakasına; boşanma sonrası için ise şahsım adına aylık {{{yoksulluk_nafakasi_tutar}}} TL yoksulluk nafakası{{#if cocuk_var_mi}} ile çocuklar için aylık {{{cocuk_istirak_nafakasi_tutari}}} TL iştirak nafakası{{/if}}na hükmedilmelidir.
{{/or}}

{{#or maddi_tazminat_talep manevi_tazminat_talep}}
Tazminatlar Hakkında: 
{{#eq maddi_tazminat_talep "evet"}}{{{maddi_tazminat_gerekcesi}}} Bu sebeple {{{maddi_tazminat_tutar}}} TL maddi tazminat talep etmekteyim.{{/eq}}
{{#eq manevi_tazminat_talep "evet"}} Ayrıca, {{{manevi_tazminat_gerekcesi}}} Bu sebeple {{{manevi_tazminat_tutar}}} TL manevi tazminat talep etmekteyim.{{/eq}}
{{/or}}

HUKUKİ NEDENLER : TMK, HMK, ve ilgili sair mevzuat.
HUKUKİ DELİLLER : {{{delil_listesi}}}{{#if tanik_listesi_ve_konulari}}, Tanık Beyanları ({{{tanik_listesi_ve_konulari}}}){{/if}}, Bilirkişi İncelemesi, Yemin, İsticvap ve her türlü yasal delil.

SONUÇ VE İSTEM : Yukarıda açıklanan ve mahkemenizce re'sen gözetilecek nedenlerle, fazlaya ilişkin haklarımız saklı kalmak kaydıyla;

Davamızın KABULÜNE,
Tarafların davalının ağır kusuru nedeniyle BOŞANMALARINA,

{{#if cocuk_var_mi}}
{{#eq velayet_talep_ediyor "evet"}}
Müşterek çocuk/çocuklar {{{cocuk_bilgileri}}}'ın velayetinin davacı olarak TARAFIMA VERİLMESİNE,
{{/eq}}
{{/if}}

{{#eq kendisi_icin_tedbir_nafakasi_talep "evet"}}
Yargılama devam ederken tedbiren aylık {{{kendisi_icin_tedbir_nafakasi_tutari}}} TL TEDBİR NAFAKASININ davalıdan alınarak tarafıma verilmesine,
{{/eq}}

{{#if cocuk_var_mi}}
Yargılama devam ederken müşterek çocuklar için tedbiren aylık {{{cocuk_tedbir_nafakasi_tutari}}} TL TEDBİR NAFAKASININ davalıdan alınarak tarafıma verilmesine,
{{/if}}

{{#eq yoksulluk_nafakasi_talep "evet"}}
Boşanma sonrası için aylık {{{yoksulluk_nafakasi_tutar}}} TL YOKSULLUK NAFAKASININ davalıdan alınarak tarafıma verilmesine,
{{/eq}}

{{#if cocuk_var_mi}}
Boşanma sonrası müşterek çocuklar için aylık {{{cocuk_istirak_nafakasi_tutari}}} TL İŞTİRAK NAFAKASININ davalıdan alınarak tarafıma verilmesine,
{{/if}}

{{#eq maddi_tazminat_talep "evet"}}
Tarafım için {{{maddi_tazminat_tutar}}} TL MADDİ TAZMİNATIN dava tarihinden itibaren işleyecek yasal faiziyle birlikte davalıdan tahsiline,
{{/eq}}

{{#eq manevi_tazminat_talep "evet"}}
Tarafım için {{{manevi_tazminat_tutar}}} TL MANEVİ TAZMİNATIN dava tarihinden itibaren işleyecek yasal faiziyle birlikte davalıdan tahsiline,
{{/eq}}

Yargılama giderleri ile vekalet ücretinin davalı taraf üzerine bırakılmasına,

karar verilmesini saygılarımla arz ve talep ederim. 

{{{dilekce_tarihi}}}

Davacı
{{{davaci_ad_soyad}}}
(İmza)`;