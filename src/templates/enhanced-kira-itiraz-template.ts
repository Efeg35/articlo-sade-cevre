
import { z } from 'zod';
import { WizardTemplate, WIZARD_CATEGORIES } from '@/types/wizard';
import {
    createWizardTemplate,
    createWizardStep,
    createWizardField,
    wizardSchemas
} from '@/utils/wizard/templateUtils';

// BÖLÜM 1: KIRACΙ BİLGİLERİ (5 ADIM)

// Step 1: Kiracı Temel Bilgileri
const step1Fields = [
    createWizardField('kiracı_ad', 'text', 'Adınız Soyadınız', {
        required: true,
        placeholder: 'Örn: Ahmet Mehmet YILMAZ',
        helpText: 'Resmi belgelerdeki tam adınızı yazın'
    }),
    createWizardField('kiracı_tc', 'text', 'T.C. Kimlik Numarası', {
        required: true,
        placeholder: '12345678901',
        helpText: '11 haneli T.C. kimlik numaranız'
    }),
    createWizardField('doğum_tarihi', 'date', 'Doğum Tarihiniz', {
        required: true,
        helpText: 'Kimlik belgenizde yazılan doğum tarihiniz'
    }),
    createWizardField('doğum_yeri', 'text', 'Doğum Yeriniz', {
        required: false,
        placeholder: 'Örn: İstanbul',
        helpText: 'Doğduğunuz il'
    }),
];

const step1Validation = z.object({
    kiracı_ad: wizardSchemas.requiredText,
    kiracı_tc: z.string().regex(/^\d{11}$/, 'T.C. Kimlik numarası 11 haneli olmalıdır'),
    doğum_tarihi: wizardSchemas.requiredDate,
    doğum_yeri: wizardSchemas.optionalText,
});

// Step 2: Kiracı İletişim Bilgileri
const step2Fields = [
    createWizardField('kiracı_adres', 'textarea', 'İkamet Adresiniz', {
        required: true,
        placeholder: 'Mahalle, Sokak No, Apartman Adı, Kat, Daire No, İlçe/İl',
        helpText: 'Size ulaşılabilecek tam adresiniz'
    }),
    createWizardField('kiracı_tel', 'tel', 'Cep Telefonu', {
        required: true,
        placeholder: '0555 123 45 67',
        helpText: 'Sürekli ulaşılabilir cep telefonu numaranız'
    }),
    createWizardField('kiracı_email', 'email', 'E-posta Adresiniz', {
        required: true,
        placeholder: 'ornek@email.com',
        helpText: 'Aktif e-posta adresiniz'
    }),
    createWizardField('kiracı_sabit_tel', 'tel', 'Sabit Telefon (İsteğe Bağlı)', {
        required: false,
        placeholder: '0212 123 45 67',
        helpText: 'Varsa sabit telefon numaranız'
    }),
];

const step2Validation = z.object({
    kiracı_adres: wizardSchemas.requiredText,
    kiracı_tel: wizardSchemas.phone,
    kiracı_email: z.string().email('Geçerli e-posta adresi girin'),
    kiracı_sabit_tel: wizardSchemas.phone.optional().or(z.literal('')),
});

// Step 3: Kiracı Meslek ve Gelir Bilgileri
const step3Fields = [
    createWizardField('meslek', 'text', 'Mesleğiniz', {
        required: true,
        placeholder: 'Örn: Mühendis, Öğretmen, Serbest Meslek',
        helpText: 'Yaptığınız işin tanımı'
    }),
    createWizardField('çalıştığı_yer', 'text', 'Çalıştığınız Yer/Kurum', {
        required: false,
        placeholder: 'Kurum/Şirket adı',
        helpText: 'Varsa çalıştığınız kurum'
    }),
    createWizardField('aylık_gelir', 'number', 'Ortalama Aylık Geliriniz (TL)', {
        required: true,
        placeholder: '15000',
        helpText: 'Net aylık geliriniz (kira ödeme gücünüz için)'
    }),
    createWizardField('sosyal_güvence', 'select', 'Sosyal Güvenceniz', {
        required: true,
        options: [
            { value: 'sgk', label: 'SGK' },
            { value: 'bağkur', label: 'Bağ-Kur' },
            { value: 'emekli_sandığı', label: 'Emekli Sandığı' },
            { value: 'özel_sigorta', label: 'Özel Sigorta' },
            { value: 'yok', label: 'Sosyal güvence yok' },
        ],
        helpText: 'Sahip olduğunuz sosyal güvence türü'
    }),
];

const step3Validation = z.object({
    meslek: wizardSchemas.requiredText,
    çalıştığı_yer: wizardSchemas.optionalText,
    aylık_gelir: wizardSchemas.currency,
    sosyal_güvence: wizardSchemas.requiredSelect,
});

// Step 4: Kiracı Aile Durumu
const step4Fields = [
    createWizardField('medeni_durum', 'select', 'Medeni Durumunuz', {
        required: true,
        options: [
            { value: 'bekar', label: 'Bekar' },
            { value: 'evli', label: 'Evli' },
            { value: 'boşanmış', label: 'Boşanmış' },
            { value: 'dul', label: 'Dul' },
        ],
        helpText: 'Mevcut medeni durumunuz'
    }),
    createWizardField('çocuk_sayısı', 'number', 'Çocuk Sayısı', {
        required: true,
        placeholder: '0',
        helpText: 'Bakmakla yükümlü olduğunuz çocuk sayısı'
    }),
    createWizardField('ev_halkı_sayısı', 'number', 'Evde Yaşayan Kişi Sayısı', {
        required: true,
        placeholder: '2',
        helpText: 'Siz dahil evde yaşayan toplam kişi sayısı'
    }),
    createWizardField('eş_çalışıyor_mu', 'select', 'Eşiniz Çalışıyor mu?', {
        required: false,
        options: [
            { value: 'evet', label: 'Evet, çalışıyor' },
            { value: 'hayır', label: 'Hayır, çalışmıyor' },
            { value: 'geçmiyor', label: 'Bu soru beni ilgilendirmiyor' },
        ],
        helpText: 'Evli iseniz eşinizin çalışma durumu'
    }),
];

const step4Validation = z.object({
    medeni_durum: wizardSchemas.requiredSelect,
    çocuk_sayısı: z.number().min(0).max(20),
    ev_halkı_sayısı: z.number().min(1).max(50),
    eş_çalışıyor_mu: wizardSchemas.optionalText,
});

// Step 5: Vekil/Temsilci Bilgileri
const step5Fields = [
    createWizardField('vekil_var_mı', 'radio', 'Bu İşlemde Vekil Kullanacak mısınız?', {
        required: true,
        options: [
            { value: 'hayır', label: 'Hayır, kendim takip edeceğim' },
            { value: 'evet', label: 'Evet, vekil/avukat tutacağım' },
        ],
        helpText: 'Hukuki süreci nasıl yürütmek istiyorsunuz?'
    }),
    createWizardField('vekil_ad', 'text', 'Vekil/Avukat Adı Soyadı', {
        required: false,
        placeholder: 'Av. Mehmet ÖZKAN',
        helpText: 'Vekil tutacaksanız adı soyadı'
    }),
    createWizardField('vekil_baro', 'text', 'Baro Sicil Numarası', {
        required: false,
        placeholder: 'İstanbul Barosu - 12345',
        helpText: 'Vekilinizin baro bilgileri'
    }),
    createWizardField('vekil_iletişim', 'text', 'Vekil İletişim Bilgileri', {
        required: false,
        placeholder: 'Telefon ve e-posta',
        helpText: 'Vekilinizin iletişim bilgileri'
    }),
];

const step5Validation = z.object({
    vekil_var_mı: wizardSchemas.requiredSelect,
    vekil_ad: wizardSchemas.optionalText,
    vekil_baro: wizardSchemas.optionalText,
    vekil_iletişim: wizardSchemas.optionalText,
});

// BÖLÜM 2: MÜLK DETAYLARI (4 ADIM)

// Step 6: Mülk Konum ve Adres Bilgileri
const step6Fields = [
    createWizardField('mülk_adres', 'textarea', 'Kiralanan Mülkün Tam Adresi', {
        required: true,
        placeholder: 'İl, İlçe, Mahalle, Cadde/Sokak, Bina No, Kat, Daire',
        helpText: 'Kira sözleşmesinde yazılan tam adres'
    }),
    createWizardField('mülk_il', 'text', 'İl', {
        required: true,
        placeholder: 'İstanbul',
        helpText: 'Mülkün bulunduğu il'
    }),
    createWizardField('mülk_ilçe', 'text', 'İlçe', {
        required: true,
        placeholder: 'Kadıköy',
        helpText: 'Mülkün bulunduğu ilçe'
    }),
    createWizardField('mülk_mahalle', 'text', 'Mahalle/Semt', {
        required: true,
        placeholder: 'Fenerbahçe Mahallesi',
        helpText: 'Mülkün bulunduğu mahalle'
    }),
];

const step6Validation = z.object({
    mülk_adres: wizardSchemas.requiredText,
    mülk_il: wizardSchemas.requiredText,
    mülk_ilçe: wizardSchemas.requiredText,
    mülk_mahalle: wizardSchemas.requiredText,
});

// Step 7: Mülk Fiziksel Özellikleri
const step7Fields = [
    createWizardField('mülk_tip', 'select', 'Mülk Tipi', {
        required: true,
        options: [
            { value: 'daire', label: 'Daire' },
            { value: 'müstakil_ev', label: 'Müstakil Ev' },
            { value: 'villa', label: 'Villa' },
            { value: 'dublex', label: 'Dublex' },
            { value: 'çatı_katı', label: 'Çatı Katı' },
            { value: 'bodrum_kat', label: 'Bodrum Kat' },
            { value: 'stüdyo', label: 'Stüdyo' },
            { value: 'loft', label: 'Loft' },
        ],
        helpText: 'Kiraladığınız mülkün türü'
    }),
    createWizardField('oda_sayısı', 'select', 'Oda Sayısı', {
        required: true,
        options: [
            { value: '1+0', label: '1+0 (Stüdyo)' },
            { value: '1+1', label: '1+1' },
            { value: '2+1', label: '2+1' },
            { value: '3+1', label: '3+1' },
            { value: '4+1', label: '4+1' },
            { value: '5+1', label: '5+1' },
            { value: '6+üstü', label: '6+1 ve üstü' },
        ],
        helpText: 'Daire plan tipi'
    }),
    createWizardField('metrekare', 'number', 'Net Metrekare (m²)', {
        required: true,
        placeholder: '100',
        helpText: 'Mülkün net iç metresi'
    }),
    createWizardField('balkon_var_mı', 'radio', 'Balkon/Teras Var mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, balkon/teras var' },
            { value: 'hayır', label: 'Hayır, balkon/teras yok' },
        ],
        helpText: 'Mülkte balkon veya teras bulunuyor mu?'
    }),
];

const step7Validation = z.object({
    mülk_tip: wizardSchemas.requiredSelect,
    oda_sayısı: wizardSchemas.requiredSelect,
    metrekare: z.number().positive().min(10).max(1000),
    balkon_var_mı: wizardSchemas.requiredSelect,
});

// Step 8: Bina ve Çevre Bilgileri  
const step8Fields = [
    createWizardField('bina_yaşı', 'select', 'Binanın Yaşı', {
        required: true,
        options: [
            { value: '0-5', label: '0-5 yaş (Yeni)' },
            { value: '6-10', label: '6-10 yaş' },
            { value: '11-20', label: '11-20 yaş' },
            { value: '21-30', label: '21-30 yaş' },
            { value: '30+', label: '30+ yaş (Eski)' },
        ],
        helpText: 'Binanın yaklaşık yaşı'
    }),
    createWizardField('kat_bilgisi', 'text', 'Hangi Kattasınız?', {
        required: true,
        placeholder: '3. kat / 5 katlı binada',
        helpText: 'Dairenin bulunduğu kat ve bina toplam kat'
    }),
    createWizardField('asansör_var_mı', 'radio', 'Asansör Var mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, asansör var' },
            { value: 'hayır', label: 'Hayır, asansör yok' },
        ],
        helpText: 'Binada asansör bulunuyor mu?'
    }),
    createWizardField('otopark_var_mı', 'radio', 'Otopark/Garaj Var mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, otopark/garaj var' },
            { value: 'hayır', label: 'Hayır, otopark/garaj yok' },
        ],
        helpText: 'Araç park etme imkanı var mı?'
    }),
];

const step8Validation = z.object({
    bina_yaşı: wizardSchemas.requiredSelect,
    kat_bilgisi: wizardSchemas.requiredText,
    asansör_var_mı: wizardSchemas.requiredSelect,
    otopark_var_mı: wizardSchemas.requiredSelect,
});

// Step 9: Mülk Durumu ve Özellikler
const step9Fields = [
    createWizardField('mülk_durumu', 'select', 'Mülkün Genel Durumu', {
        required: true,
        options: [
            { value: 'yeni', label: 'Sıfır/Yeni' },
            { value: 'iyi', label: 'İyi Durumda' },
            { value: 'orta', label: 'Orta Durumda' },
            { value: 'kötü', label: 'Kötü Durumda' },
            { value: 'tadilat_gerekli', label: 'Tadilat Gerekiyor' },
        ],
        helpText: 'Mülkün fiziksel durumunu değerlendirin'
    }),
    createWizardField('eşyalı_mı', 'radio', 'Eşyalı mı Boş mu?', {
        required: true,
        options: [
            { value: 'eşyalı', label: 'Eşyalı kiralandı' },
            { value: 'boş', label: 'Boş kiralandı' },
            { value: 'yarı_eşyalı', label: 'Yarı eşyalı' },
        ],
        helpText: 'Mülk nasıl kiralandı?'
    }),
    createWizardField('klima_var_mı', 'radio', 'Klima Var mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, klima var' },
            { value: 'hayır', label: 'Hayır, klima yok' },
        ],
        helpText: 'Mülkte klima bulunuyor mu?'
    }),
    createWizardField('ısıtma_sistemi', 'select', 'Isıtma Sistemi', {
        required: true,
        options: [
            { value: 'merkezi', label: 'Merkezi Isıtma' },
            { value: 'kombi', label: 'Kombi' },
            { value: 'soba', label: 'Soba' },
            { value: 'klima', label: 'Klima' },
            { value: 'yok', label: 'Isıtma yok' },
        ],
        helpText: 'Nasıl ısıtılıyor?'
    }),
];

const step9Validation = z.object({
    mülk_durumu: wizardSchemas.requiredSelect,
    eşyalı_mı: wizardSchemas.requiredSelect,
    klima_var_mı: wizardSchemas.requiredSelect,
    ısıtma_sistemi: wizardSchemas.requiredSelect,
});

// BÖLÜM 3: EV SAHİBİ BİLGİLERİ (3 ADIM)

// Step 10: Ev Sahibi Kimlik Bilgileri
const step10Fields = [
    createWizardField('ev_sahibi_ad', 'text', 'Ev Sahibinin Adı Soyadı', {
        required: true,
        placeholder: 'Örn: Mehmet ÖZKAN',
        helpText: 'Kira sözleşmesindeki tam adı'
    }),
    createWizardField('ev_sahibi_tc', 'text', 'Ev Sahibi T.C. Kimlik No', {
        required: false,
        placeholder: '12345678901',
        helpText: 'Biliniyorsa T.C. kimlik numarası'
    }),
    createWizardField('sahiplik_durumu', 'select', 'Mülk Sahiplik Durumu', {
        required: true,
        options: [
            { value: 'tek_malik', label: 'Tek malik' },
            { value: 'müşterek_malik', label: 'Müşterek malik (ortaklık var)' },
            { value: 'vekil', label: 'Vekil aracılığıyla' },
            { value: 'miras', label: 'Miras durumu belirsiz' },
            { value: 'bilinmiyor', label: 'Bilinmiyor' },
        ],
        helpText: 'Mülkün sahiplik durumu nasıl?'
    }),
];

const step10Validation = z.object({
    ev_sahibi_ad: wizardSchemas.requiredText,
    ev_sahibi_tc: z.string().optional().refine((val) => !val || /^\d{11}$/.test(val), 'T.C. Kimlik numarası 11 haneli olmalıdır'),
    sahiplik_durumu: wizardSchemas.requiredSelect,
});

// Step 11: Ev Sahibi İletişim Bilgileri
const step11Fields = [
    createWizardField('ev_sahibi_adres', 'textarea', 'Ev Sahibinin Adresi', {
        required: false,
        placeholder: 'Biliniyorsa ev sahibinin açık adresi',
        helpText: 'Tebligat için gerekli olabilir'
    }),
    createWizardField('ev_sahibi_tel', 'tel', 'Ev Sahibinin Telefonu', {
        required: false,
        placeholder: '0555 987 65 43',
        helpText: 'Biliniyorsa iletişim telefonu'
    }),
    createWizardField('ev_sahibi_email', 'email', 'Ev Sahibinin E-postası', {
        required: false,
        placeholder: 'ornek@email.com',
        helpText: 'Biliniyorsa e-posta adresi'
    }),
    createWizardField('emlakçı_var_mı', 'radio', 'Emlakçı Aracılığıyla mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, emlakçı var' },
            { value: 'hayır', label: 'Hayır, doğrudan ev sahibi' },
        ],
        helpText: 'İletişim emlakçı üzerinden mi?'
    }),
];

const step11Validation = z.object({
    ev_sahibi_adres: wizardSchemas.optionalText,
    ev_sahibi_tel: wizardSchemas.phone.optional().or(z.literal('')),
    ev_sahibi_email: z.string().email('Geçerli e-posta adresi girin').optional().or(z.literal('')),
    emlakçı_var_mı: wizardSchemas.requiredSelect,
});

// Step 12: Emlakçı Bilgileri (İsteğe Bağlı)
const step12Fields = [
    createWizardField('emlakçı_firma', 'text', 'Emlak Ofisi Adı', {
        required: false,
        placeholder: 'ABC Emlak',
        helpText: 'Aracı emlak ofisinin adı'
    }),
    createWizardField('emlakçı_sorumlu', 'text', 'Sorumlu Emlakçı', {
        required: false,
        placeholder: 'Ahmet BEY',
        helpText: 'Sizinle ilgilenen emlakçının adı'
    }),
    createWizardField('emlakçı_tel', 'tel', 'Emlakçı Telefonu', {
        required: false,
        placeholder: '0555 111 22 33',
        helpText: 'Emlakçı iletişim telefonu'
    }),
    createWizardField('emlakçı_adres', 'textarea', 'Emlak Ofisi Adresi', {
        required: false,
        placeholder: 'Ofis adresi',
        helpText: 'Emlak ofisinin adresi'
    }),
];

const step12Validation = z.object({
    emlakçı_firma: wizardSchemas.optionalText,
    emlakçı_sorumlu: wizardSchemas.optionalText,
    emlakçı_tel: wizardSchemas.phone.optional().or(z.literal('')),
    emlakçı_adres: wizardSchemas.optionalText,
});

// BÖLÜM 4: SÖZLEŞME ANALİZİ (4 ADIM)

// Step 13: Kira Sözleşmesi Temel Bilgileri
const step13Fields = [
    createWizardField('sözleşme_tarihi', 'date', 'Kira Sözleşmesi Tarihi', {
        required: true,
        helpText: 'Kira sözleşmenizin imzalandığı tarih'
    }),
    createWizardField('sözleşme_başlama', 'date', 'Kiranın Başlangıç Tarihi', {
        required: true,
        helpText: 'Kira ödemesine başladığınız tarih'
    }),
    createWizardField('sözleşme_süresi', 'select', 'Sözleşme Süresi', {
        required: true,
        options: [
            { value: '1_yıl', label: '1 Yıl' },
            { value: '2_yıl', label: '2 Yıl' },
            { value: '3_yıl', label: '3 Yıl' },
            { value: '4_yıl', label: '4 Yıl' },
            { value: '5_yıl', label: '5 Yıl' },
            { value: 'belirsiz', label: 'Belirsiz Süreli' },
            { value: 'diğer', label: 'Diğer' },
        ],
        helpText: 'Sözleşmede belirtilen süre'
    }),
    createWizardField('sözleşme_bitiş', 'date', 'Sözleşmenin Bitiş Tarihi', {
        required: false,
        helpText: 'Varsa sözleşmede yazılan bitiş tarihi'
    }),
];

const step13Validation = z.object({
    sözleşme_tarihi: wizardSchemas.requiredDate,
    sözleşme_başlama: wizardSchemas.requiredDate,
    sözleşme_süresi: wizardSchemas.requiredSelect,
    sözleşme_bitiş: z.string().optional(),
});

// Step 14: Mevcut Kira Durumu
const step14Fields = [
    createWizardField('ilk_kira', 'number', 'İlk Kira Bedeli (TL)', {
        required: true,
        placeholder: '4000',
        helpText: 'Sözleşmeyi imzalarken belirlenen kira tutarı'
    }),
    createWizardField('mevcut_kira', 'number', 'Şu Anki Kira Bedeli (TL)', {
        required: true,
        placeholder: '5000',
        helpText: 'Şu anda ödediğiniz aylık kira tutarı'
    }),
    createWizardField('son_artırım_tarihi', 'date', 'Son Kira Artışı Tarihi', {
        required: false,
        helpText: 'En son ne zaman kira artışı yapıldı?'
    }),
    createWizardField('kaç_kez_artış_oldu', 'number', 'Kaç Kez Kira Artışı Oldu?', {
        required: true,
        placeholder: '1',
        helpText: 'Sözleşme başından itibaren kaç kez artış yapıldı?'
    }),
];

const step14Validation = z.object({
    ilk_kira: wizardSchemas.currency,
    mevcut_kira: wizardSchemas.currency,
    son_artırım_tarihi: z.string().optional(),
    kaç_kez_artış_oldu: z.number().min(0).max(20),
});

// Step 15: Ödeme Geçmişi ve Durumu
const step15Fields = [
    createWizardField('ödeme_düzenli_mi', 'radio', 'Kira Ödemeleriniz Düzenli miydi?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, hep zamanında ödedim' },
            { value: 'çoğunlukla', label: 'Çoğunlukla zamanında ödedim' },
            { value: 'bazen_gecikti', label: 'Bazen gecikme oldu' },
            { value: 'sık_gecikti', label: 'Sık sık gecikme oldu' },
        ],
        helpText: 'Kira ödeme geçmişinizi değerlendirin'
    }),
    createWizardField('gecikme_nedeni', 'textarea', 'Gecikme Varsa Nedeni', {
        required: false,
        placeholder: 'Gecikme nedenlerini açıklayın',
        helpText: 'Ödeme gecikmeleri varsa nedenini belirtin'
    }),
    createWizardField('ödeme_şekli', 'select', 'Kira Ödeme Şekliniz', {
        required: true,
        options: [
            { value: 'nakit', label: 'Nakit' },
            { value: 'banka_havalesi', label: 'Banka Havalesi/EFT' },
            { value: 'çek', label: 'Çek' },
            { value: 'senet', label: 'Senet' },
            { value: 'kart', label: 'Kredi Kartı' },
        ],
        helpText: 'Genellikle nasıl ödeme yaparsınız?'
    }),
    createWizardField('makbuz_var_mı', 'radio', 'Kira Makbuzlarınız Var mı?', {
        required: true,
        options: [
            { value: 'evet_hepsi', label: 'Evet, hepsini sakladım' },
            { value: 'evet_çoğu', label: 'Evet, çoğunu sakladım' },
            { value: 'birkaç_tane', label: 'Sadece birkaç tane var' },
            { value: 'hiç_yok', label: 'Hiç makbuz yok' },
        ],
        helpText: 'Ödeme belgelerinizin durumu'
    }),
];

const step15Validation = z.object({
    ödeme_düzenli_mi: wizardSchemas.requiredSelect,
    gecikme_nedeni: wizardSchemas.optionalText,
    ödeme_şekli: wizardSchemas.requiredSelect,
    makbuz_var_mı: wizardSchemas.requiredSelect,
});

// Step 16: Sözleşme Maddeleri ve Özel Durumlar
const step16Fields = [
    createWizardField('artırım_maddesi_var_mı', 'radio', 'Sözleşmede Kira Artışı Maddesi Var mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, artırım maddesi var' },
            { value: 'hayır', label: 'Hayır, artırım maddesi yok' },
            { value: 'emin_değilim', label: 'Emin değilim' },
        ],
        helpText: 'Sözleşmede kira artışı ile ilgili madde var mı?'
    }),
    createWizardField('artırım_maddesi_detay', 'textarea', 'Artırım Maddesi İçeriği', {
        required: false,
        placeholder: 'Varsa artırım maddesinin tam metnini yazın',
        helpText: 'Sözleşmede kira artışı ile ilgili yazılanlar'
    }),
    createWizardField('depozito_alındı_mı', 'radio', 'Depozito/Teminat Alındı mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, depozito/teminat aldı' },
            { value: 'hayır', label: 'Hayır, depozito/teminat yok' },
        ],
        helpText: 'Ev sahibi sizden teminat aldı mı?'
    }),
    createWizardField('depozito_tutarı', 'number', 'Depozito/Teminat Tutarı (TL)', {
        required: false,
        placeholder: '5000',
        helpText: 'Ödediğiniz depozito/teminat miktarı'
    }),
];

const step16Validation = z.object({
    artırım_maddesi_var_mı: wizardSchemas.requiredSelect,
    artırım_maddesi_detay: wizardSchemas.optionalText,
    depozito_alındı_mı: wizardSchemas.requiredSelect,
    depozito_tutarı: wizardSchemas.currency.optional(),
});

// BÖLÜM 5: ARTIRIM DETAYLARI (3 ADIM)

// Step 17: Artırım Talebi Detayları
const step17Fields = [
    createWizardField('yeni_kira', 'number', 'İstenen Yeni Kira Bedeli (TL)', {
        required: true,
        placeholder: '7500',
        helpText: 'Ev sahibinin talep ettiği yeni kira tutarı'
    }),
    createWizardField('bildirim_tarihi', 'date', 'Artırım Bildirim Tarihi', {
        required: true,
        helpText: 'Ev sahibinin size artırım talebini bildirdiği tarih'
    }),
    createWizardField('bildirim_şekli', 'select', 'Artırım Nasıl Bildirildi?', {
        required: true,
        options: [
            { value: 'sözlü', label: 'Sözlü olarak söyledi' },
            { value: 'whatsapp', label: 'WhatsApp mesajı' },
            { value: 'sms', label: 'SMS' },
            { value: 'telefon', label: 'Telefon görüşmesi' },
            { value: 'yazılı', label: 'Yazılı bildirim' },
            { value: 'resmi_tebligat', label: 'Resmi tebligat' },
            { value: 'emlakçı', label: 'Emlakçı aracılığıyla' },
        ],
        helpText: 'Size nasıl haber verildi?'
    }),
    createWizardField('yürürlük_tarihi', 'date', 'Artırımın Yürürlük Tarihi', {
        required: true,
        helpText: 'Ev sahibinin artırımın ne zaman başlayacağını söylediği tarih'
    }),
];

const step17Validation = z.object({
    yeni_kira: wizardSchemas.currency,
    bildirim_tarihi: wizardSchemas.requiredDate,
    bildirim_şekli: wizardSchemas.requiredSelect,
    yürürlük_tarihi: wizardSchemas.requiredDate,
});

// Step 18: Artırım Gerekçeleri
const step18Fields = [
    createWizardField('ev_sahibi_gerekçesi', 'textarea', 'Ev Sahibinin Belirttiği Gerekçe', {
        required: false,
        placeholder: 'Ev sahibinin artırım için sunduğu gerekçeleri yazın',
        helpText: 'Ev sahibi artırım için hangi sebepleri gösterdi?'
    }),
    createWizardField('gerekçe_türleri', 'checkbox', 'Hangi Gerekçeleri İleri Sürdü?', {
        required: false,
        options: [
            { value: 'enflasyon', label: 'Enflasyon/hayat pahalılığı' },
            { value: 'piyasa_değeri', label: 'Piyasa değerlerinin artması' },
            { value: 'tadilat', label: 'Yaptığı tadilat/yatırım' },
            { value: 'vergi_artışı', label: 'Vergi/aidat artışları' },
            { value: 'bakım_masrafı', label: 'Bakım/onarım masrafları' },
            { value: 'komşu_kiralar', label: 'Komşu dairelerin kira bedelleri' },
            { value: 'gerekçe_yok', label: 'Hiçbir gerekçe göstermedi' },
        ],
        helpText: 'Hangi sebepleri dile getirdi? (Birden fazla seçebilirsiniz)'
    }),
];

const step18Validation = z.object({
    ev_sahibi_gerekçesi: wizardSchemas.optionalText,
    gerekçe_türleri: z.array(z.string()).optional(),
});

// Step 19: Piyasa Karşılaştırması
const step19Fields = [
    createWizardField('piyasa_araştırması_yaptınız_mı', 'radio', 'Bölgede Piyasa Araştırması Yaptınız mı?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, araştırma yaptım' },
            { value: 'kısmen', label: 'Kısmen araştırma yaptım' },
            { value: 'hayır', label: 'Hayır, araştırma yapmadım' },
        ],
        helpText: 'Çevredeki benzer evlerin kira durumunu araştırdınız mı?'
    }),
    createWizardField('ortalama_piyasa_kira', 'number', 'Bölgedeki Ortalama Kira (TL)', {
        required: false,
        placeholder: '6500',
        helpText: 'Araştırdıysanız, benzer evlerin ortalama kira bedeli'
    }),
    createWizardField('piyasa_karşılaştırması', 'textarea', 'Piyasa Araştırma Notlarınız', {
        required: false,
        placeholder: 'Hangi kaynaklardan araştırma yaptınız, ne öğrendiniz?',
        helpText: 'Sahibinden.com, hurriyetemlak.com vb. sitelerden araştırma notları'
    }),
    createWizardField('komşu_kiraları', 'textarea', 'Komşu/Yakın Evlerin Kira Durumu', {
        required: false,
        placeholder: 'Bildiğiniz komşu evlerin kira bedelleri',
        helpText: 'Varsa komşulardan öğrendiğiniz kira bilgileri'
    }),
];

const step19Validation = z.object({
    piyasa_araştırması_yaptınız_mı: wizardSchemas.requiredSelect,
    ortalama_piyasa_kira: wizardSchemas.currency.optional(),
    piyasa_karşılaştırması: wizardSchemas.optionalText,
    komşu_kiraları: wizardSchemas.optionalText,
});

// BÖLÜM 6: İTİRAZ STRATEJİSİ (2 ADIM)

// Step 20: İtiraz Nedenleri ve Dayanaklarınız
const step20Fields = [
    createWizardField('itiraz_nedenleri', 'checkbox', 'İtiraz Nedenleriniz', {
        required: true,
        options: [
            { value: 'aşırı_artırım', label: 'Artırım oranı çok yüksek (Yasal sınırları aşıyor)' },
            { value: 'piyasa_değeri', label: 'Talep edilen bedel piyasa değerinin üzerinde' },
            { value: 'mülk_durumu', label: 'Mülkün fiziki durumu artırımı haklı göstermiyor' },
            { value: 'gelir_durumu', label: 'Ekonomik/mali durumum el vermiyor' },
            { value: 'usul_hatası', label: 'Artırım bildiriminde usul hatası var' },
            { value: 'süre_hatası', label: 'Artırım süresi/zamanlaması hatalı' },
            { value: 'sözleşme_ihlali', label: 'Ev sahibi sözleşme hükümlerini ihlal etti' },
            { value: 'bakım_eksikliği', label: 'Gerekli bakım/onarım yapılmadı' },
            { value: 'hizmet_eksikliği', label: 'Vaat edilen hizmetler verilmedi' },
        ],
        helpText: 'Hangi sebeplerle itiraz ediyorsunuz? (Birden fazla seçebilirsiniz)'
    }),
    createWizardField('detaylı_gerekçe', 'textarea', 'Ayrıntılı İtiraz Gerekçeniz', {
        required: true,
        placeholder: 'İtirazınızın ayrıntılı gerekçesini, yaşadığınız sorunları, durumunuzu açık bir şekilde yazınız...',
        helpText: 'Durumunuzu mümkün olduğunca detaylı açıklayın (En az 100 karakter)'
    }),
];

const step20Validation = z.object({
    itiraz_nedenleri: wizardSchemas.multiSelect,
    detaylı_gerekçe: z.string().min(100, 'En az 100 karakter girmelisiniz').max(2000, 'En fazla 2000 karakter girebilirsiniz'),
});

// Step 21: Talep ve Çözüm Öneriniz
const step21Fields = [
    createWizardField('talep_türü', 'radio', 'Ana Talebiniz Nedir?', {
        required: true,
        options: [
            { value: 'tamamen_ret', label: 'Artırımın tamamen reddedilmesi (Mevcut kira devam etsin)' },
            { value: 'makul_artırım', label: 'Makul bir oranda artırım yapılması' },
            { value: 'kademeli_artırım', label: 'Artırımın kademeli olarak uygulanması' },
            { value: 'erteleme', label: 'Artırımın belirli bir süre ertelenmesi' },
            { value: 'mahkeme_tespiti', label: 'Uygun artırım oranının mahkemece belirlenmesi' },
        ],
        helpText: 'En önemli talebiniz nedir?'
    }),
    createWizardField('önerilen_kira', 'number', 'Önerdiğiniz Uygun Kira Tutarı (TL)', {
        required: false,
        placeholder: '6000',
        helpText: 'Kabul edebileceğiniz maksimum kira tutarı (İsteğe bağlı)'
    }),
    createWizardField('ek_talepler', 'textarea', 'Diğer Talepleriniz', {
        required: false,
        placeholder: 'Mahkemeden istediğiniz diğer hususlar, özel durumlar...',
        helpText: 'Varsa diğer taleplerinizi belirtin'
    }),
    createWizardField('uzlaşmaya_açık_mısınız', 'radio', 'Ev Sahibiyle Uzlaşmaya Açık mısınız?', {
        required: true,
        options: [
            { value: 'evet', label: 'Evet, makul bir teklifle uzlaşabilirim' },
            { value: 'kısmen', label: 'Koşullar uygun olursa uzlaşabilirim' },
            { value: 'hayır', label: 'Hayır, hukuki yolları sonuna kadar kullanacağım' },
        ],
        helpText: 'Mahkeme öncesi çözüm konusunda ne düşünüyorsunuz?'
    }),
];

const step21Validation = z.object({
    talep_türü: wizardSchemas.requiredSelect,
    önerilen_kira: wizardSchemas.currency.optional(),
    ek_talepler: wizardSchemas.optionalText,
    uzlaşmaya_açık_mısınız: wizardSchemas.requiredSelect,
});

// CREATE ENHANCED TEMPLATE
export const enhancedKiraItirazTemplate: WizardTemplate = createWizardTemplate(
    'enhanced-kira-itiraz-v1',
    'Kira Artırımı İtiraz Dilekçesi (Gelişmiş)',
    WIZARD_CATEGORIES.RENTAL,
    [
        // BÖLÜM 1: KIRACΙ BİLGİLERİ (5 ADIM)
        createWizardStep('step1', 'Kiracı Temel Bilgileri', step1Fields, step1Validation, {
            description: 'Kimlik ve kişisel bilgileriniz'
        }),
        createWizardStep('step2', 'İletişim Bilgileri', step2Fields, step2Validation, {
            description: 'Size ulaşım için gerekli bilgiler'
        }),
        createWizardStep('step3', 'Meslek ve Gelir Durumu', step3Fields, step3Validation, {
            description: 'Çalışma hayatı ve ekonomik durumunuz'
        }),
        createWizardStep('step4', 'Aile Durumu', step4Fields, step4Validation, {
            description: 'Medeni durum ve aile bilgileri'
        }),
        createWizardStep('step5', 'Vekil/Temsilci', step5Fields, step5Validation, {
            description: 'Hukuki süreç yönetimi'
        }),

        // BÖLÜM 2: MÜLK DETAYLARI (4 ADIM)
        createWizardStep('step6', 'Mülk Konumu', step6Fields, step6Validation, {
            description: 'Kiralanan mülkün adres bilgileri'
        }),
        createWizardStep('step7', 'Mülk Özellikleri', step7Fields, step7Validation, {
            description: 'Fiziksel özellikler ve plan tipi'
        }),
        createWizardStep('step8', 'Bina Bilgileri', step8Fields, step8Validation, {
            description: 'Bina yaşı, kat, asansör vb.'
        }),
        createWizardStep('step9', 'Mülk Durumu', step9Fields, step9Validation, {
            description: 'Genel durum ve donatılar'
        }),

        // BÖLÜM 3: EV SAHİBİ BİLGİLERİ (3 ADIM)
        createWizardStep('step10', 'Ev Sahibi Kimlik', step10Fields, step10Validation, {
            description: 'Mülk sahibinin kimlik bilgileri'
        }),
        createWizardStep('step11', 'Ev Sahibi İletişim', step11Fields, step11Validation, {
            description: 'İletişim ve tebligat bilgileri'
        }),
        createWizardStep('step12', 'Emlakçı Bilgileri', step12Fields, step12Validation, {
            description: 'Varsa aracı emlakçı bilgileri'
        }),

        // BÖLÜM 4: SÖZLEŞME ANALİZİ (4 ADIM)
        createWizardStep('step13', 'Sözleşme Temel Bilgileri', step13Fields, step13Validation, {
            description: 'Sözleşme tarihleri ve süresi'
        }),
        createWizardStep('step14', 'Kira Bedeli Geçmişi', step14Fields, step14Validation, {
            description: 'İlk kira ve artış geçmişi'
        }),
        createWizardStep('step15', 'Ödeme Geçmişi', step15Fields, step15Validation, {
            description: 'Ödeme düzeni ve makbuz durumu'
        }),
        createWizardStep('step16', 'Sözleşme Maddeleri', step16Fields, step16Validation, {
            description: 'Özel hükümler ve teminatlar'
        }),

        // BÖLÜM 5: ARTIRIM DETAYLARI (3 ADIM)
        createWizardStep('step17', 'Artırım Talebi', step17Fields, step17Validation, {
            description: 'Talep edilen artırım detayları'
        }),
        createWizardStep('step18', 'Artırım Gerekçeleri', step18Fields, step18Validation, {
            description: 'Ev sahibinin ileri sürdüğü sebepler'
        }),
        createWizardStep('step19', 'Piyasa Karşılaştırması', step19Fields, step19Validation, {
            description: 'Bölgesel kira değerlendirmesi'
        }),

        // BÖLÜM 6: İTİRAZ STRATEJİSİ (2 ADIM)
        createWizardStep('step20', 'İtiraz Nedenleri', step20Fields, step20Validation, {
            description: 'Hukuki ve fiili itiraz gerekçeleriniz'
        }),
        createWizardStep('step21', 'Talep ve Çözüm', step21Fields, step21Validation, {
            description: 'Son talepleriniz ve uzlaşma yaklaşımı'
        }),
    ],
    {
        description: 'Kira artırımına itiraz için kapsamlı ve detaylı dilekçe hazırlayın. LawDepot kalitesinde profesyonel hukuki belge. 21 adımlık detaylı wizard ile güçlü hukuki dayanak.',
        estimatedTime: '~25 dakika',
        difficulty: 'zor',
        tags: ['kira', 'itiraz', 'artırım', 'dilekçe', 'mahkeme', 'detaylı', 'profesyonel', '21-adım'],
        premium: true, // Enhanced version - premium feature
        legalReferences: [
            'TBK m.299',
            'TBK m.344',
            'TBK m.353',
            'TBK m.354',
            'TBK m.349',
            'TBK m.315',
            'TBK m.316',
            'İİK m.4',
            'HMK m.118',
            'TBK m.295'
        ], // 📚 FAZ 1: Kapsamlı hukuki referanslar (Enhanced version için daha fazla)
    }
);

// Template registry with both versions
export const allKiraItirazTemplates = [
    enhancedKiraItirazTemplate,
];

export default enhancedKiraItirazTemplate;