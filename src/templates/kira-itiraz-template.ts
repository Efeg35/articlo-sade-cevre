import { z } from 'zod';
import { WizardTemplate, WIZARD_CATEGORIES } from '@/types/wizard';
import {
    createWizardTemplate,
    createWizardStep,
    createWizardField,
    wizardSchemas
} from '@/utils/wizard/templateUtils';

// Step 1: Kiracı Bilgileri
const step1Fields = [
    createWizardField('kiracı_ad', 'text', 'Adınız Soyadınız', {
        required: true,
        placeholder: 'Örn: Ahmet Yılmaz',
        helpText: 'Dilekçede görünecek tam adınız'
    }),
    createWizardField('kiracı_tc', 'text', 'T.C. Kimlik Numarası', {
        required: true,
        placeholder: '12345678901',
        helpText: '11 haneli T.C. kimlik numaranız'
    }),
    createWizardField('kiracı_adres', 'textarea', 'İletişim Adresiniz', {
        required: true,
        placeholder: 'Mahalle, Sokak, Apartman, Kat, Daire bilgileri ile birlikte',
        helpText: 'Size ulaşılabilecek adres'
    }),
    createWizardField('kiracı_tel', 'tel', 'Telefon Numaranız', {
        required: true,
        placeholder: '0555 123 45 67',
        helpText: 'İletişim için kullanılacak'
    }),
];

const step1Validation = z.object({
    kiracı_ad: wizardSchemas.requiredText,
    kiracı_tc: z.string().regex(/^\d{11}$/, 'T.C. Kimlik numarası 11 haneli olmalıdır'),
    kiracı_adres: wizardSchemas.requiredText,
    kiracı_tel: wizardSchemas.phone,
});

// Step 2: Mülk Bilgileri
const step2Fields = [
    createWizardField('mülk_adres', 'textarea', 'Kiralanan Mülkün Adresi', {
        required: true,
        placeholder: 'İl, İlçe, Mahalle, Sokak, Apartman, Kat, Daire bilgileri',
        helpText: 'Kira sözleşmesinde yazılan adres'
    }),
    createWizardField('mülk_tip', 'select', 'Mülk Tipi', {
        required: true,
        options: [
            { value: 'daire', label: 'Daire' },
            { value: 'müstakil', label: 'Müstakil Ev' },
            { value: 'villa', label: 'Villa' },
            { value: 'iş_yeri', label: 'İş Yeri' },
            { value: 'mağaza', label: 'Mağaza' },
            { value: 'büro', label: 'Büro' },
            { value: 'depo', label: 'Depo' },
            { value: 'diğer', label: 'Diğer' },
        ],
        helpText: 'Kiraladığınız mülkün türü'
    }),
    createWizardField('mülk_metrekare', 'number', 'Metrekare (m²)', {
        required: false,
        placeholder: '100',
        helpText: 'Biliniyorsa mülkün metrekaresi'
    }),
];

const step2Validation = z.object({
    mülk_adres: wizardSchemas.requiredText,
    mülk_tip: wizardSchemas.requiredSelect,
    mülk_metrekare: z.number().positive().optional(),
});

// Step 3: Ev Sahibi Bilgileri
const step3Fields = [
    createWizardField('ev_sahibi_ad', 'text', 'Ev Sahibinin Adı Soyadı', {
        required: true,
        placeholder: 'Örn: Mehmet Özkan',
        helpText: 'Kira sözleşmesindeki adı'
    }),
    createWizardField('ev_sahibi_adres', 'textarea', 'Ev Sahibinin Adresi', {
        required: false,
        placeholder: 'Biliniyorsa ev sahibinin adresi',
        helpText: 'İhtiyaç durumunda kullanılabilir'
    }),
    createWizardField('ev_sahibi_tel', 'tel', 'Ev Sahibinin Telefonu', {
        required: false,
        placeholder: '0555 987 65 43',
        helpText: 'Biliniyorsa iletişim bilgisi'
    }),
];

const step3Validation = z.object({
    ev_sahibi_ad: wizardSchemas.requiredText,
    ev_sahibi_adres: wizardSchemas.optionalText,
    ev_sahibi_tel: wizardSchemas.phone.optional().or(z.literal('')),
});

// Step 4: Mevcut Kira Durumu
const step4Fields = [
    createWizardField('mevcut_kira', 'number', 'Mevcut Kira Bedeli (TL)', {
        required: true,
        placeholder: '5000',
        helpText: 'Şu anda ödediğiniz aylık kira tutarı'
    }),
    createWizardField('sözleşme_tarihi', 'date', 'Kira Sözleşmesi Tarihi', {
        required: true,
        helpText: 'Kira sözleşmenizin imzalandığı tarih'
    }),
    createWizardField('sözleşme_süresi', 'select', 'Sözleşme Süresi', {
        required: true,
        options: [
            { value: '1_yıl', label: '1 Yıl' },
            { value: '2_yıl', label: '2 Yıl' },
            { value: '3_yıl', label: '3 Yıl' },
            { value: 'belirsiz', label: 'Belirsiz Süreli' },
            { value: 'diğer', label: 'Diğer' },
        ],
        helpText: 'Kira sözleşmenizde belirtilen süre'
    }),
];

const step4Validation = z.object({
    mevcut_kira: wizardSchemas.currency,
    sözleşme_tarihi: wizardSchemas.requiredDate,
    sözleşme_süresi: wizardSchemas.requiredSelect,
});

// Step 5: Artırım Detayları
const step5Fields = [
    createWizardField('yeni_kira', 'number', 'İstenen Yeni Kira (TL)', {
        required: true,
        placeholder: '7500',
        helpText: 'Ev sahibinin istediği yeni kira tutarı'
    }),
    createWizardField('artırım_oranı', 'number', 'Artırım Oranı (%)', {
        required: false,
        placeholder: '50',
        helpText: 'Otomatik hesaplanacak, kontrol amaçlı'
    }),
    createWizardField('bildirim_tarihi', 'date', 'Artırım Bildirim Tarihi', {
        required: true,
        helpText: 'Ev sahibinin size artırımı bildirdiği tarih'
    }),
    createWizardField('artırım_gerekçesi', 'textarea', 'Ev Sahibinin Belirttiği Gerekçe', {
        required: false,
        placeholder: 'Ev sahibinin artırım için belirttiği sebep varsa',
        helpText: 'Varsa, ev sahibinin sunduğu gerekçe'
    }),
];

const step5Validation = z.object({
    yeni_kira: wizardSchemas.currency,
    artırım_oranı: z.number().optional(),
    bildirim_tarihi: wizardSchemas.requiredDate,
    artırım_gerekçesi: wizardSchemas.optionalText,
});

// Step 6: İtiraz Gerekçeniz
const step6Fields = [
    createWizardField('itiraz_nedenleri', 'checkbox', 'İtiraz Nedenleriniz', {
        required: true,
        options: [
            { value: 'aşırı_artırım', label: 'Artırım oranı çok yüksek' },
            { value: 'piyasa_değeri', label: 'Piyasa değerinin üzerinde' },
            { value: 'mülk_durumu', label: 'Mülkün fiziki durumu kötü' },
            { value: 'bölge_durumu', label: 'Bölge koşulları uygun değil' },
            { value: 'ekonomik_durum', label: 'Ekonomik durumum el vermiyor' },
            { value: 'hukuki_eksiklik', label: 'Hukuki prosedür eksik' },
            { value: 'diğer', label: 'Diğer nedenler' },
        ],
        helpText: 'Artırıma itiraz etmenizin sebepleri'
    }),
    createWizardField('detaylı_gerekçe', 'textarea', 'Detaylı Açıklamanız', {
        required: true,
        placeholder: 'İtirazınızın ayrıntılı gerekçesini yazınız...',
        helpText: 'Durumunuzu açık bir şekilde belirtiniz'
    }),
];

const step6Validation = z.object({
    itiraz_nedenleri: wizardSchemas.multiSelect,
    detaylı_gerekçe: wizardSchemas.requiredText,
});

// Step 7: Talep ve Sonuç
const step7Fields = [
    createWizardField('talep_türü', 'radio', 'Talebiniz Nedir?', {
        required: true,
        options: [
            { value: 'ret', label: 'Artırımın tamamen reddedilmesi' },
            { value: 'azaltım', label: 'Artırımın azaltılması' },
            { value: 'erteleme', label: 'Artırımın ertelenmesi' },
            { value: 'tespit', label: 'Mahkemece uygun artırım oranının tespiti' },
        ],
        helpText: 'Ne talep etmek istiyorsunuz?'
    }),
    createWizardField('önerilen_kira', 'number', 'Önerdiğiniz Kira Tutarı (TL)', {
        required: false,
        placeholder: '6000',
        helpText: 'Uygun gördüğünüz kira tutarı (isteğe bağlı)'
    }),
    createWizardField('ek_talepler', 'textarea', 'Ek Talepleriniz', {
        required: false,
        placeholder: 'Varsa diğer talepleriniz...',
        helpText: 'Mahkemeden istediğiniz diğer hususlar'
    }),
];

const step7Validation = z.object({
    talep_türü: wizardSchemas.requiredSelect,
    önerilen_kira: wizardSchemas.currency.optional(),
    ek_talepler: wizardSchemas.optionalText,
});

// Create the template
export const kiraItirazTemplate: WizardTemplate = createWizardTemplate(
    'kira-itiraz-v1',
    'Kira Artırımı İtiraz Dilekçesi',
    WIZARD_CATEGORIES.RENTAL,
    [
        createWizardStep('step1', 'Kiracı Bilgileri', step1Fields, step1Validation, {
            description: 'Size ait temel bilgileri giriniz'
        }),
        createWizardStep('step2', 'Mülk Bilgileri', step2Fields, step2Validation, {
            description: 'Kiraladığınız mülkün detayları'
        }),
        createWizardStep('step3', 'Ev Sahibi Bilgileri', step3Fields, step3Validation, {
            description: 'Mülk sahibinin bilgileri'
        }),
        createWizardStep('step4', 'Mevcut Kira Durumu', step4Fields, step4Validation, {
            description: 'Şu anki kira sözleşmesi detayları'
        }),
        createWizardStep('step5', 'Artırım Detayları', step5Fields, step5Validation, {
            description: 'Yapılan kira artırımının bilgileri'
        }),
        createWizardStep('step6', 'İtiraz Gerekçeniz', step6Fields, step6Validation, {
            description: 'Neden itiraz etmek istiyorsunuz?'
        }),
        createWizardStep('step7', 'Talep ve Sonuç', step7Fields, step7Validation, {
            description: 'Mahkemeden ne talep ediyorsunuz?'
        }),
    ],
    {
        description: 'Kira artırımına itiraz etmek için gerekli dilekçeyi adım adım hazırlayın',
        estimatedTime: '~8 dakika',
        difficulty: 'orta',
        tags: ['kira', 'itiraz', 'artırım', 'dilekçe', 'mahkeme'],
        premium: false, // Beta için ücretsiz
        legalReferences: [
            'TBK m.299',
            'TBK m.344',
            'TBK m.353',
            'TBK m.354',
            'TBK m.349'
        ], // 📚 FAZ 1: Hukuki referanslar
    }
);

import { enhancedKiraItirazTemplate } from './enhanced-kira-itiraz-template';

// Template registry for easy access
export const availableTemplates = [
    kiraItirazTemplate,
    enhancedKiraItirazTemplate,
    // Diğer template'ler buraya eklenecek
];

export default kiraItirazTemplate;