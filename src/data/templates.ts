import { DocumentTemplate, TemplateCategory } from '@/types/templates';

export const documentTemplates: DocumentTemplate[] = [
    {
        id: 'icra-itiraz-1',
        title: 'İcra İtiraz Dilekçesi',
        description: 'İcra takibine karşı itiraz dilekçesi hazırlayın',
        category: 'icra',
        icon: '⚖️',
        estimatedTime: '10-15 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['icra', 'itiraz', 'takip'],
        legalNote: 'Bu dilekçe genel format içindir. Hukuki danışmanlık almayı unutmayın.',
        fields: [
            {
                id: 'icra_mudurlugu',
                label: 'İcra Müdürlüğü',
                type: 'text',
                placeholder: 'Örn: İstanbul 1. İcra Müdürlüğü',
                required: true,
                validation: { minLength: 5, maxLength: 100 }
            },
            {
                id: 'dosya_no',
                label: 'İcra Dosya Numarası',
                type: 'text',
                placeholder: 'Örn: 2024/1234',
                required: true,
                validation: { pattern: '\\d{4}/\\d+' }
            },
            {
                id: 'alacakli_adi',
                label: 'Alacaklı Adı/Unvanı',
                type: 'text',
                placeholder: 'Alacaklının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'borçlu_adi',
                label: 'Borçlu Adı/Unvanı (Sizin Adınız)',
                type: 'text',
                placeholder: 'Tam adınız ve soyadınız',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'takip_tutari',
                label: 'Takip Tutarı (TL)',
                type: 'number',
                placeholder: 'Örn: 50000',
                required: true
            },
            {
                id: 'itiraz_sebebi',
                label: 'İtiraz Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Borç tamamen ödendi',
                    'Borç kısmen ödendi',
                    'Borç miktarı yanlış',
                    'Hukuki dayanak yoktur',
                    'Zamanaşımına uğramıştır',
                    'Diğer'
                ]
            },
            {
                id: 'itiraz_aciklamasi',
                label: 'İtiraz Açıklaması',
                type: 'textarea',
                placeholder: 'İtirazınızın detaylı açıklamasını yazın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `SAYIN {{icra_mudurlugu}}

Dosya No: {{dosya_no}}
Alacaklı: {{alacakli_adi}}
Borçlu: {{borçlu_adi}}
Takip Tutarı: {{takip_tutari}} TL

İCRA İTİRAZ DİLEKÇESİ

Yukarıda dosya numarası belirtilen icra takibine karşı süresinde itirazımı beyan ederim.

İTİRAZ SEBEBİ: {{itiraz_sebebi}}

AÇIKLAMA:
{{itiraz_aciklamasi}}

Bu itirazımın kabulü ile icra takibinin durdurulmasını ve gerekli işlemlerin yapılmasını saygılarımla arz ederim.

{{tarih}}

{{borçlu_adi}}
İmza`
    },

    {
        id: 'kira-fesih-1',
        title: 'Kira Sözleşmesi Fesih Bildirimi',
        description: 'Kira sözleşmesini feshetmek için kiracıya bildirim',
        category: 'kira',
        icon: '🏠',
        estimatedTime: '5-8 dakika',
        complexity: 'Kolay',
        popular: true,
        tags: ['kira', 'fesih', 'bildirim', 'kiracı'],
        legalNote: 'Yasal süreler ve prosedürler için hukuki danışmanlık alın.',
        fields: [
            {
                id: 'kiraci_adi',
                label: 'Kiracının Adı Soyadı',
                type: 'text',
                placeholder: 'Kiracının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'kiraci_adresi',
                label: 'Kiracının Adresi',
                type: 'textarea',
                placeholder: 'Kiracının tam adresi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'tasinmaz_adresi',
                label: 'Kiralanan Taşınmazın Adresi',
                type: 'textarea',
                placeholder: 'Kiralanan evin/iş yerinin tam adresi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'sozlesme_tarihi',
                label: 'Kira Sözleşmesi Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'fesih_sebebi',
                label: 'Fesih Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Kira bedelinin ödenmemesi',
                    'Sözleşme süresinin dolması',
                    'Kiracının sözleşme hükümlerini ihlali',
                    'Taşınmazın yeniden yapılandırılması',
                    'Malik tarafından kullanılması',
                    'Diğer'
                ]
            },
            {
                id: 'fesih_detayi',
                label: 'Fesih Detayı',
                type: 'textarea',
                placeholder: 'Fesih sebebinin detaylı açıklaması...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'tahliye_suresi',
                label: 'Tahliye İçin Verilen Süre (Gün)',
                type: 'number',
                placeholder: 'Örn: 30',
                required: true
            }
        ],
        template: `SAYIN {{kiraci_adi}}
{{kiraci_adresi}}

KONU: Kira Sözleşmesi Fesih Bildirimi

{{tarih}} tarihli bu bildirimle, {{sozlesme_tarihi}} tarihinde imzalanan ve aşağıda adresi belirtilen taşınmaza ilişkin kira sözleşmesinin feshini bildirir, taşınmazın tahliyesini talep ederim.

Kiralanan Taşınmaz Adresi:
{{tasinmaz_adresi}}

Fesih Sebebi: {{fesih_sebebi}}

Açıklama:
{{fesih_detayi}}

Bu bildirimim tarihinden itibaren {{tahliye_suresi}} gün içerisinde taşınmazı boşaltmanızı, aksi takdirde hakkımda tanınan kanuni yollara başvuracağımı bildirir, gereğini saygılarımla arz ederim.

{{tarih}}

[Kiraya Veren Adı Soyadı]
İmza`
    },

    {
        id: 'is-fesih-1',
        title: 'İş Sözleşmesi Fesih Bildirimi',
        description: 'İşçiye veya işverene fesih bildirimi',
        category: 'is_hukuku',
        icon: '💼',
        estimatedTime: '8-12 dakita',
        complexity: 'Orta',
        tags: ['iş hukuku', 'fesih', 'bildirim'],
        legalNote: 'İş hukuku karmaşık bir alandır. Mutlaka uzman görüşü alın.',
        fields: [
            {
                id: 'alici_adi',
                label: 'Bildirim Alacak Kişi/Kurum',
                type: 'text',
                placeholder: 'İşçi adı veya şirket unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'alici_adresi',
                label: 'Alıcının Adresi',
                type: 'textarea',
                placeholder: 'Tam adres bilgisi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'pozisyon',
                label: 'Pozisyon/Görev',
                type: 'text',
                placeholder: 'Örn: Yazılım Geliştirici',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'ise_baslama_tarihi',
                label: 'İşe Başlama Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'fesih_turu',
                label: 'Fesih Türü',
                type: 'select',
                required: true,
                options: [
                    'Bildirimli fesih (işveren tarafından)',
                    'Bildirimli fesih (işçi tarafından)',
                    'Haklı nedenle fesih',
                    'Karşılıklı anlaşma ile fesih'
                ]
            },
            {
                id: 'fesih_sebebi',
                label: 'Fesih Sebebi',
                type: 'textarea',
                placeholder: 'Fesih sebebinin detaylı açıklaması...',
                required: true,
                validation: { minLength: 20, maxLength: 1000 }
            },
            {
                id: 'ihbar_suresi',
                label: 'İhbar Süresi (Gün)',
                type: 'number',
                placeholder: 'Örn: 30',
                required: false
            }
        ],
        template: `SAYIN {{alici_adi}}
{{alici_adresi}}

KONU: İş Sözleşmesi Fesih Bildirimi

{{ise_baslama_tarihi}} tarihinde başlayan "{{pozisyon}}" pozisyonundaki iş sözleşmenizin/sözleşmemizin feshini bildiririm.

Fesih Türü: {{fesih_turu}}

Fesih Sebebi ve Açıklama:
{{fesih_sebebi}}

{{#ihbar_suresi}}
İhbar süresi: {{ihbar_suresi}} gün
Son çalışma günü: [Hesaplanacak tarih]
{{/ihbar_suresi}}

Bu bildirimim uyarınca gerekli yasal işlemlerin yapılmasını ve hakların korunmasını saygılarımla arz ederim.

{{tarih}}

[Bildirimi Yapan]
İmza`
    },

    {
        id: 'haciz-itiraz-1',
        title: 'Haciz İtiraz Dilekçesi',
        description: 'Maaş, hesap veya mal haczi işlemine karşı itiraz dilekçesi',
        category: 'icra',
        icon: '🛡️',
        estimatedTime: '12-18 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['haciz', 'itiraz', 'icra', 'maaş', 'hesap'],
        legalNote: 'Haciz itirazları 7 günlük kesin süreye tabidir. Acilen hukuki yardım alın.',
        fields: [
            {
                id: 'icra_dairesi',
                label: 'İcra Dairesi',
                type: 'text',
                placeholder: 'Örn: Ankara 2. İcra Müdürlüğü',
                required: true,
                validation: { minLength: 5, maxLength: 100 }
            },
            {
                id: 'haciz_dosya_no',
                label: 'Haciz Dosya Numarası',
                type: 'text',
                placeholder: 'Örn: 2024/5678',
                required: true,
                validation: { pattern: '\\d{4}/\\d+' }
            },
            {
                id: 'haciz_turu',
                label: 'Haciz Türü',
                type: 'select',
                required: true,
                options: [
                    'Maaş haczi',
                    'Banka hesap haczi',
                    'Taşınır mal haczi',
                    'Taşınmaz haczi',
                    'Araç haczi'
                ]
            },
            {
                id: 'hacizli_mal_detay',
                label: 'Hacizli Mal/Hesap Detayı',
                type: 'textarea',
                placeholder: 'Hacze konu mal, hesap veya maaş detayları...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'itiraz_gerekce',
                label: 'İtiraz Gerekçesi',
                type: 'select',
                required: true,
                options: [
                    'Haczi kaldıran yasal sebep var',
                    'Haczedilen mal/miktar fazla',
                    'Geçimlik miktar aşıldı',
                    'Üçüncü kişiye ait mal hacizde',
                    'Usul hatası var',
                    'Diğer'
                ]
            },
            {
                id: 'itiraz_detay',
                label: 'İtiraz Detaylı Açıklama',
                type: 'textarea',
                placeholder: 'İtirazınızın hukuki ve fiili gerekçelerini detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `SAYIN {{icra_dairesi}}

Dosya No: {{haciz_dosya_no}}
Konu: HACİZ İTİRAZ DİLEKÇESİ

Yukarıda numarası yazılı dosyada yapılan {{haciz_turu}} işlemine karşı İİK'nun 89. maddesi uyarınca itirazımı beyan ederim.

HACİZE KONU DETAY:
{{hacizli_mal_detay}}

İTİRAZ GEREKÇESİ: {{itiraz_gerekce}}

DETAYLI AÇIKLAMA:
{{itiraz_detay}}

HUKUKİ DAYANAK:
İcra ve İflas Kanunu'nun 82/1, 83, 89 ve ilgili maddeleri uyarınca;

TALEBİM:
1- Haciz işleminin kaldırılması,
2- İtirazımın kabulü ile gerekli işlemlerin yapılması,
3- Kanuni vekalet ücretinin karşı taraftan tahsili.

Bilgi ve gereğini saygılarımla arz ederim.

{{tarih}}

[Tam Adınız Soyadınız]
[T.C. Kimlik No]
[Adres]
[Telefon]
İmza

EKLER:
1- Vekalet belgesi
2- İlgili belgeler`
    },

    {
        id: 'tuketici-sikayet-1',
        title: 'Tüketici Şikayeti Dilekçesi',
        description: 'Tüketici Hakem Heyeti\'ne şikayet başvurusu',
        category: 'borçlar_hukuku',
        icon: '🛍️',
        estimatedTime: '10-15 dakika',
        complexity: 'Kolay',
        popular: true,
        tags: ['tüketici', 'şikayet', 'hakem heyeti', 'ayıplı mal'],
        legalNote: 'Tüketici hakem heyeti başvuruları için öngörülen süreler vardır.',
        fields: [
            {
                id: 'tuketici_adi',
                label: 'Tüketici Adı Soyadı',
                type: 'text',
                placeholder: 'Tam adınız ve soyadınız',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'tuketici_tc',
                label: 'T.C. Kimlik Numarası',
                type: 'text',
                placeholder: '11 haneli TC kimlik numaranız',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'tuketici_adres',
                label: 'Tüketici Adresi',
                type: 'textarea',
                placeholder: 'Tam adres bilginiz',
                required: true,
                validation: { minLength: 20, maxLength: 300 }
            },
            {
                id: 'satici_unvan',
                label: 'Satıcı/Sağlayıcı Unvanı',
                type: 'text',
                placeholder: 'Şirket unvanı veya tacir adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'satici_adres',
                label: 'Satıcı Adresi',
                type: 'textarea',
                placeholder: 'Satıcının tam adresi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'mal_hizmet',
                label: 'Mal/Hizmet Türü',
                type: 'select',
                required: true,
                options: [
                    'Elektronik eşya',
                    'Giyim eşyası',
                    'Mobilya',
                    'Araç',
                    'Hizmet sağlama',
                    'Diğer'
                ]
            },
            {
                id: 'mal_detay',
                label: 'Mal/Hizmet Detayı',
                type: 'textarea',
                placeholder: 'Satın alınan mal veya hizmetin detaylı açıklaması...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'satis_tarihi',
                label: 'Satış/Sözleşme Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'satis_tutari',
                label: 'Satış Tutarı (TL)',
                type: 'number',
                placeholder: 'Ödenen miktar',
                required: true
            },
            {
                id: 'sikayet_konusu',
                label: 'Şikayet Konusu',
                type: 'select',
                required: true,
                options: [
                    'Ayıplı mal teslimi',
                    'Hizmet eksikliği',
                    'Gecikme',
                    'Garanti kapsamında değerlendirmeme',
                    'İade/değişim reddedilmesi',
                    'Haksız ücret talebi',
                    'Diğer'
                ]
            },
            {
                id: 'sikayet_detay',
                label: 'Şikayet Detayı',
                type: 'textarea',
                placeholder: 'Yaşadığınız sorunu detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'talep',
                label: 'Talebiniz',
                type: 'select',
                required: true,
                options: [
                    'Bedel iadesi',
                    'Mal değişimi',
                    'Ücretsiz onarım',
                    'Eksik hizmetin tamamlanması',
                    'Tazminat',
                    'Diğer'
                ]
            }
        ],
        template: `TÜKETİCİ HAKEM HEYETİ BAŞKANLIĞI'NA

TÜKETİCİ BİLGİLERİ:
Adı Soyadı: {{tuketici_adi}}
T.C. Kimlik No: {{tuketici_tc}}
Adresi: {{tuketici_adres}}

SATICI/SAĞLAYICI BİLGİLERİ:
Unvanı: {{satici_unvan}}
Adresi: {{satici_adres}}

UYUŞMAZLIK KONUSU MAL/HİZMET:
Türü: {{mal_hizmet}}
Detayı: {{mal_detay}}
Satış Tarihi: {{satis_tarihi}}
Satış Tutarı: {{satis_tutari}} TL

ŞİKAYET KONUSU: {{sikayet_konusu}}

ŞİKAYET DETAYI:
{{sikayet_detay}}

TALEBİM: {{talep}}

HUKUKİ DAYANAK:
6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mevzuat hükümleri uyarınca yukarıda belirtilen uyuşmazlığın çözülmesini talep ederim.

Bilgi ve gereğini saygılarımla arz ederim.

{{tarih}}

{{tuketici_adi}}
İmza

EKLER:
1- Satış faturası/fiş
2- Garanti belgesi
3- Fotoğraf/belgeler
4- İlgili yazışmalar`
    },

    {
        id: 'bosanma-dava-1',
        title: 'Boşanma Davası Dilekçesi',
        description: 'Anlaşmalı veya çekişmeli boşanma davası dilekçesi',
        category: 'aile_hukuku',
        icon: '👨‍👩‍👧‍👦',
        estimatedTime: '20-30 dakika',
        complexity: 'Zor',
        popular: false,
        tags: ['boşanma', 'aile hukuku', 'dava'],
        legalNote: 'Boşanma davaları karmaşık hukuki süreçlerdir. Mutlaka avukat desteği alın.',
        fields: [
            {
                id: 'mahkeme_adi',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İstanbul 3. Aile Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_adi',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Dava açan eşin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davaci_tc',
                label: 'Davacı T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'davalı_adi',
                label: 'Davalı Adı Soyadı',
                type: 'text',
                placeholder: 'Diğer eşin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davalı_tc',
                label: 'Davalı T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'evlilik_tarihi',
                label: 'Evlilik Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'evlilik_yeri',
                label: 'Evlilik Yeri',
                type: 'text',
                placeholder: 'Evlenilen şehir/ilçe',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'bosanma_turu',
                label: 'Boşanma Türü',
                type: 'select',
                required: true,
                options: [
                    'Anlaşmalı boşanma',
                    'Çekişmeli boşanma - Geçimsizlik',
                    'Çekişmeli boşanma - Zina',
                    'Çekişmeli boşanma - Hayata kast',
                    'Çekişmeli boşanma - Diğer'
                ]
            },
            {
                id: 'cocuk_durumu',
                label: 'Çocuk Durumu',
                type: 'select',
                required: true,
                options: [
                    'Çocuk yok',
                    '1 çocuk var',
                    '2 çocuk var',
                    '3 ve üzeri çocuk var'
                ]
            },
            {
                id: 'bosanma_gerekce',
                label: 'Boşanma Gerekçesi',
                type: 'textarea',
                placeholder: 'Boşanma sebeplerini detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'mal_rejimi',
                label: 'Mal Rejimi',
                type: 'select',
                required: true,
                options: [
                    'Edinilmiş mallara katılma',
                    'Mal ayrılığı',
                    'Mal birliği',
                    'Bilinmiyor'
                ]
            }
        ],
        template: `{{mahkeme_adi}}

DAVA DİLEKÇESİ

DAVACI:
Adı Soyadı: {{davaci_adi}}
T.C. Kimlik No: {{davaci_tc}}

DAVALI:
Adı Soyadı: {{davalı_adi}}
T.C. Kimlik No: {{davalı_tc}}

DAVA KONUSU: {{bosanma_turu}}

OLAYLAR:
1- Taraflar {{evlilik_tarihi}} tarihinde {{evlilik_yeri}}'nde evlenmişlerdir.

2- Evlilikten {{cocuk_durumu}}.

3- Tarafların mal rejimi: {{mal_rejimi}}

4- Boşanma Gerekçesi:
{{bosanma_gerekce}}

HUKUKİ DAYANAK:
4721 sayılı Türk Medeni Kanunu'nun 166, 184 ve ilgili maddeleri.

TALEPLERİM:
1- Tarafların boşanmalarına,
2- Çocuk varsa velayetin belirlenmesi,
3- İştirak nafakasının takdiri,
4- Mal paylaşımının yapılması,
5- Yargılama giderlerinin davalıdan tahsili,
6- Vekalet ücretinin davalıdan tahsili.

Bilgi ve gereğini saygılarımla arz ederim.

{{tarih}}

{{davaci_adi}}
İmza

EKLER:
1- Evlilik cüzdanı sureti
2- Nüfus kayıt sureti
3- İkametgah belgesi
4- Vekalet belgesi
5- İlgili belgeler`
    },

    {
        id: 'alacak-dava-1',
        title: 'Alacak Davası Dilekçesi',
        description: 'Para alacağı için dava dilekçesi',
        category: 'borçlar_hukuku',
        icon: '💰',
        estimatedTime: '15-25 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['alacak', 'dava', 'borç', 'tahsilat'],
        legalNote: 'Zamanaşımı süreleri ve delil toplama konularında hukuki destek alın.',
        fields: [
            {
                id: 'mahkeme',
                label: 'Mahkeme',
                type: 'text',
                placeholder: 'Örn: Ankara 1. Sulh Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_alacakli',
                label: 'Davacı (Alacaklı) Adı',
                type: 'text',
                placeholder: 'Alacaklının tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'davali_borclu',
                label: 'Davalı (Borçlu) Adı',
                type: 'text',
                placeholder: 'Borçlunun tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'alacak_miktari',
                label: 'Alacak Miktarı (TL)',
                type: 'number',
                placeholder: 'Örn: 25000',
                required: true
            },
            {
                id: 'borc_tarihi',
                label: 'Borç Doğum Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'borc_sebebi',
                label: 'Borç Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Sözleşme gereği ödeme',
                    'Mal teslimi bedeli',
                    'Hizmet bedeli',
                    'Kira borcu',
                    'Ödünç para',
                    'Kefalet borcu',
                    'Diğer'
                ]
            },
            {
                id: 'borc_detay',
                label: 'Borç Detayı',
                type: 'textarea',
                placeholder: 'Borcun nasıl doğduğunu detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'odeme_vadesi',
                label: 'Ödeme Vadesi',
                type: 'date',
                required: false
            },
            {
                id: 'ihtar_yapildi',
                label: 'İhtarda Bulunuldu mu?',
                type: 'select',
                required: true,
                options: [
                    'Evet, noter ihtarı yapıldı',
                    'Evet, taahhütlü mektup gönderildi',
                    'Hayır, ihtar yapılmadı'
                ]
            },
            {
                id: 'faiz_talep',
                label: 'Faiz Talebi',
                type: 'select',
                required: true,
                options: [
                    'Kanuni faiz talep ediyorum',
                    'Gecikme faizi talep ediyorum',
                    'Faiz talep etmiyorum'
                ]
            }
        ],
        template: `{{mahkeme}}

DAVA DİLEKÇESİ

DAVACI (ALACAKLI):
{{davaci_alacakli}}

DAVALI (BORÇLU):
{{davali_borclu}}

DAVA KONUSU: {{alacak_miktari}} TL Alacak Davası

OLAYLAR:
1- {{borc_tarihi}} tarihinde davalı lehine {{borc_sebebi}} sebebiyle {{alacak_miktari}} TL alacak hakkı doğmuştur.

2- Borcun Detayı:
{{borc_detay}}

{{#odeme_vadesi}}
3- Ödeme vadesi: {{odeme_vadesi}}
{{/odeme_vadesi}}

4- İhtar Durumu: {{ihtar_yapildi}}

5- Davalı borcunu hiç ödememiş/eksik ödemiştir.

HUKUKİ DAYANAK:
6098 sayılı Türk Borçlar Kanunu'nun 112, 117 ve ilgili maddeleri,
4721 sayılı Türk Medeni Kanunu'nun ilgili hükümleri.

TALEPLERİM:
1- Davalıdan {{alacak_miktari}} TL asıl alacağın tahsili,
{{#faiz_talep}}
2- {{faiz_talep}} ile birlikte tahsili,
{{/faiz_talep}}
3- Yargılama giderlerinin davalıdan tahsili,
4- Vekalet ücretinin davalıdan tahsili.

Yukarıda açıklanan sebeplerle alacağımın davalıdan tahsilini talep ederim.

{{tarih}}

{{davaci_alacakli}}
İmza

EKLER:
1- Sözleşme/fatura/makbuz
2- İhtar belgesi
3- Vekalet belgesi
4- İlgili belgeler`
    },

    {
        id: 'senetli-odeme-emri-1',
        title: 'Senetli Ödeme Emri Talebi',
        description: 'Senet, çek veya poliçe için ödeme emri talebi',
        category: 'icra',
        icon: '📄',
        estimatedTime: '8-12 dakika',
        complexity: 'Kolay',
        popular: true,
        tags: ['senet', 'ödeme emri', 'icra', 'çek', 'poliçe'],
        legalNote: 'Senetli icra takipleri hızlı süreçlerdir. Senet geçerliliği önemlidir.',
        fields: [
            {
                id: 'icra_mudurlugu_senet',
                label: 'İcra Müdürlüğü',
                type: 'text',
                placeholder: 'Örn: Bursa 3. İcra Müdürlüğü',
                required: true,
                validation: { minLength: 5, maxLength: 100 }
            },
            {
                id: 'alacakli_senet',
                label: 'Alacaklı Adı/Unvanı',
                type: 'text',
                placeholder: 'Alacaklının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'borclu_senet',
                label: 'Borçlu Adı/Unvanı',
                type: 'text',
                placeholder: 'Borçlunun tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'senet_turu',
                label: 'Senet Türü',
                type: 'select',
                required: true,
                options: [
                    'Emre yazılı senet',
                    'Çek',
                    'Poliçe',
                    'Bono'
                ]
            },
            {
                id: 'senet_tutari',
                label: 'Senet Tutarı (TL)',
                type: 'number',
                placeholder: 'Senet üzerindeki miktar',
                required: true
            },
            {
                id: 'senet_tarihi',
                label: 'Senet Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'vade_tarihi',
                label: 'Vade Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'senet_no',
                label: 'Senet/Çek Numarası',
                type: 'text',
                placeholder: 'Varsa senet üzerindeki numara',
                required: false
            },
            {
                id: 'protesto_durumu',
                label: 'Protesto Durumu',
                type: 'select',
                required: true,
                options: [
                    'Protesto çekildi',
                    'Protesto çekilmedi',
                    'Protestoya gerek yok'
                ]
            },
            {
                id: 'faiz_orani',
                label: 'Faiz Oranı (%)',
                type: 'number',
                placeholder: 'Varsa senet üzerindeki faiz oranı',
                required: false
            }
        ],
        template: `{{icra_mudurlugu_senet}}

SENETLÍ ÖDEME EMRİ TALEBİ

ALACAKLI:
{{alacakli_senet}}

BORÇLU:
{{borclu_senet}}

SENET BİLGİLERİ:
Senet Türü: {{senet_turu}}
Senet Tutarı: {{senet_tutari}} TL
Senet Tarihi: {{senet_tarihi}}
Vade Tarihi: {{vade_tarihi}}
{{#senet_no}}
Senet Numarası: {{senet_no}}
{{/senet_no}}

Protesto Durumu: {{protesto_durumu}}

{{#faiz_orani}}
Faiz Oranı: %{{faiz_orani}}
{{/faiz_orani}}

İcra ve İflas Kanunu'nun 168. maddesi uyarınca yukarıda bilgileri verilen senet nedeniyle borçlu aleyhine senetli icra takibi başlatılmasını ve ödeme emri çıkarılmasını talep ederim.

TALEP EDİLEN TOPLAM MİKTAR:
- Asıl alacak: {{senet_tutari}} TL
{{#faiz_orani}}
- Faiz: [Hesaplanacak]
{{/faiz_orani}}
- İcra masrafları: [Tarife uyarınca]

Senedin aslı takip talebimle birlikte sunulmuştur.

Bilgi ve gereğini saygılarımla arz ederim.

{{tarih}}

{{alacakli_senet}}
İmza

EKLER:
1- Senet aslı
2- Protesto belgesi (varsa)
3- Vekalet belgesi
4- Masraf avansı`
    },

    {
        id: 'is-kazasi-bildirim-1',
        title: 'İş Kazası Bildirim Formu',
        description: 'İş kazası yaşandığında SGK ve işverene bildirim',
        category: 'is_hukuku',
        icon: '⚠️',
        estimatedTime: '15-20 dakika',
        complexity: 'Orta',
        tags: ['iş kazası', 'SGK', 'bildirim', 'iş güvenliği'],
        legalNote: 'İş kazaları 3 iş günü içinde bildirilmelidir. Acil tıbbi müdahale önceliklidir.',
        fields: [
            {
                id: 'isci_adi',
                label: 'İşçi Adı Soyadı',
                type: 'text',
                placeholder: 'Kazaya uğrayan işçinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'isci_tc_kaza',
                label: 'İşçi T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'isci_sgk_no',
                label: 'SGK Sicil Numarası',
                type: 'text',
                placeholder: 'SGK sicil numarası',
                required: true
            },
            {
                id: 'isveren_unvan',
                label: 'İşveren Unvanı',
                type: 'text',
                placeholder: 'Şirket unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'isyeri_adresi',
                label: 'İş Yeri Adresi',
                type: 'textarea',
                placeholder: 'İş yerinin tam adresi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'kaza_tarihi',
                label: 'Kaza Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'kaza_saati',
                label: 'Kaza Saati',
                type: 'text',
                placeholder: 'Örn: 14:30',
                required: true,
                validation: { pattern: '\\d{2}:\\d{2}' }
            },
            {
                id: 'kaza_yeri',
                label: 'Kaza Yeri',
                type: 'text',
                placeholder: 'Kazanın meydana geldiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'kaza_sekli',
                label: 'Kaza Şekli',
                type: 'select',
                required: true,
                options: [
                    'Düşme',
                    'Çarpma/çarpışma',
                    'Kesik/yaralanma',
                    'Yanık',
                    'Ezilme',
                    'Elektrik çarpması',
                    'Kimyasal madde teması',
                    'Diğer'
                ]
            },
            {
                id: 'kaza_aciklama',
                label: 'Kaza Açıklaması',
                type: 'textarea',
                placeholder: 'Kazanın nasıl gerçekleştiğini detaylı açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'yaralanma_turu',
                label: 'Yaralanma Türü',
                type: 'select',
                required: true,
                options: [
                    'Hafif yaralanma',
                    'Ağır yaralanma',
                    'Ölüm',
                    'Geçici iş göremezlik',
                    'Sürekli iş göremezlik'
                ]
            },
            {
                id: 'hastane_adi',
                label: 'Tedavi Görülen Hastane',
                type: 'text',
                placeholder: 'Hastane/sağlık kuruluşu adı',
                required: false
            },
            {
                id: 'sahit_adi',
                label: 'Şahit Adı (varsa)',
                type: 'text',
                placeholder: 'Kazaya şahit olan kişi',
                required: false
            }
        ],
        template: `SOSYAL GÜVENLİK KURUMU'NA
İŞ KAZASI BİLDİRİM FORMU

İŞÇİ BİLGİLERİ:
Adı Soyadı: {{isci_adi}}
T.C. Kimlik No: {{isci_tc_kaza}}
SGK Sicil No: {{isci_sgk_no}}

İŞVEREN BİLGİLERİ:
Unvanı: {{isveren_unvan}}
İş Yeri Adresi: {{isyeri_adresi}}

KAZA BİLGİLERİ:
Kaza Tarihi: {{kaza_tarihi}}
Kaza Saati: {{kaza_saati}}
Kaza Yeri: {{kaza_yeri}}
Kaza Şekli: {{kaza_sekli}}

KAZA AÇIKLAMASI:
{{kaza_aciklama}}

YARALANMA DURUMU:
Yaralanma Türü: {{yaralanma_turu}}
{{#hastane_adi}}
Tedavi Görülen Hastane: {{hastane_adi}}
{{/hastane_adi}}

{{#sahit_adi}}
Şahit: {{sahit_adi}}
{{/sahit_adi}}

YASAL DAYANAK:
5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'nun 13. maddesi ve İş Kazaları ve Meslek Hastalıkları Yönetmeliği uyarınca bildirimde bulunulmuştur.

Bu kaza 4857 sayılı İş Kanunu'nun 77. maddesi uyarınca en geç 3 iş günü içerisinde bildirilmiştir.

Bilgi ve gereğini saygılarımla arz ederim.

{{tarih}}

[İşveren/İşveren Vekili]
İmza ve Kaşe

EKLER:
1- Sağlık raporu
2- Olay yeri fotoğrafları
3- Şahit beyanları
4- İlgili belgeler

NOT: Bu bildirim aynı zamanda işverenin iş sağlığı ve güvenliği yükümlülüğü kapsamında tutulması gereken kayıtlar arasındadır.`
    },

    {
        id: 'ticari-sozlesme-fesih-1',
        title: 'Ticari Sözleşme Fesih Bildirimi',
        description: 'Ticari sözleşmelerin feshi için profesyonel bildirim',
        category: 'ticaret_hukuku',
        icon: '🏢',
        estimatedTime: '12-18 dakika',
        complexity: 'Orta',
        tags: ['ticari sözleşme', 'fesih', 'bildirim', 'ticaret'],
        legalNote: 'Ticari sözleşmelerde fesih koşulları ve süreleri önemlidir. Hukuki danışmanlık alın.',
        fields: [
            {
                id: 'alici_firma',
                label: 'Alıcı Firma Unvanı',
                type: 'text',
                placeholder: 'Bildirimi alacak firma unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'alici_adres_ticari',
                label: 'Alıcı Firma Adresi',
                type: 'textarea',
                placeholder: 'Tam ticari adres',
                required: true,
                validation: { minLength: 10, maxLength: 400 }
            },
            {
                id: 'gonderen_firma',
                label: 'Gönderen Firma Unvanı',
                type: 'text',
                placeholder: 'Bildirimi gönderen firma unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'sozlesme_turu',
                label: 'Sözleşme Türü',
                type: 'select',
                required: true,
                options: [
                    'Distribütörlük sözleşmesi',
                    'Bayi sözleşmesi',
                    'Tedarik sözleşmesi',
                    'Hizmet sözleşmesi',
                    'Franchising sözleşmesi',
                    'Ortaklık sözleşmesi',
                    'Diğer'
                ]
            },
            {
                id: 'sozlesme_tarihi_ticari',
                label: 'Sözleşme Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'sozlesme_no',
                label: 'Sözleşme Numarası',
                type: 'text',
                placeholder: 'Varsa sözleşme numarası',
                required: false
            },
            {
                id: 'fesih_turu_ticari',
                label: 'Fesih Türü',
                type: 'select',
                required: true,
                options: [
                    'Süre sonunda fesih',
                    'Haklı sebeplerle fesih',
                    'İhbarlı fesih',
                    'Karşılıklı anlaşma ile fesih',
                    'Sözleşme ihlali sebebiyle fesih'
                ]
            },
            {
                id: 'fesih_gerekce_ticari',
                label: 'Fesih Gerekçesi',
                type: 'textarea',
                placeholder: 'Fesih sebeplerini detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1500 }
            },
            {
                id: 'ihbar_suresi_ticari',
                label: 'İhbar Süresi (Gün)',
                type: 'number',
                placeholder: 'Örn: 90',
                required: false
            },
            {
                id: 'yururluk_bitim',
                label: 'Sözleşme Yürürlük Bitiş Tarihi',
                type: 'date',
                required: false
            },
            {
                id: 'tazminat_talep',
                label: 'Tazminat Talebi',
                type: 'select',
                required: true,
                options: [
                    'Tazminat talep edilmemektedir',
                    'Sözleşme gereği tazminat talep edilmektedir',
                    'Zarar nedeniyle tazminat talep edilmektedir'
                ]
            }
        ],
        template: `{{alici_firma}}
{{alici_adres_ticari}}

KONU: TİCARİ SÖZLEŞME FESİH BİLDİRİMİ

Sayın Yetkililer,

{{sozlesme_tarihi_ticari}} tarihinde imzalanan {{sozlesme_turu}}
{{#sozlesme_no}}
(Sözleşme No: {{sozlesme_no}})
{{/sozlesme_no}}
sözleşmesinin feshini bildiririz.

FESİH TÜRÜ: {{fesih_turu_ticari}}

FESİH GEREKÇESİ:
{{fesih_gerekce_ticari}}

{{#ihbar_suresi_ticari}}
İHBAR SÜRESİ:
Bu bildirimim tarihinden itibaren {{ihbar_suresi_ticari}} gün sonra sözleşme sona erecektir.
{{/ihbar_suresi_ticari}}

{{#yururluk_bitim}}
SONA ERİŞ TARİHİ: {{yururluk_bitim}}
{{/yururluk_bitim}}

TAZMİNAT DURUMU: {{tazminat_talep}}

SÖZLEŞME SONU YÜKÜMLÜLÜKLERİ:
1- Tüm ticari faaliyetlerin durdurulması,
2- Ticari belge ve materyallerin iadesi,
3- Finansal hesaplaşmaların yapılması,
4- Gizlilik yükümlülüklerinin devamı,
5- Rekabet yasağı hükümlerinin uygulanması.

HUKUKİ DAYANAK:
6102 sayılı Türk Ticaret Kanunu, 6098 sayılı Türk Borçlar Kanunu ve sözleşme hükümleri uyarınca işbu fesih bildiriminde bulunulmuştur.

Bu bildirimle birlikte taraflar arasındaki ticari ilişki yukarıda belirtilen süre sonunda sona erecektir.

Sözleşmeden doğan karşılıklı yükümlülüklerin ifa edilmesini ve gerekli hesaplaşmaların yapılmasını talep ederiz.

Ticari ilişkilerimiz boyunca göstermiş olduğunuz anlayış için teşekkür eder, saygılarımızı sunarız.

{{tarih}}

{{gonderen_firma}}
[Yetkili İmza ve Kaşe]

EKLER:
1- Sözleşme sureti
2- İlgili belgeler
3- Hesap dökümü (varsa)

DAĞITIM:
- Muhasebe Departmanı
- Hukuk Departmanı
- İlgili Birimler`
    },

    {
        id: 'maddi-tazminat-1',
        title: 'Maddi Tazminat Davası Dilekçesi',
        description: 'Maddi zarar nedeniyle tazminat davası açma',
        category: 'mahkeme',
        icon: '💸',
        estimatedTime: '20-30 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['tazminat', 'maddi zarar', 'dava'],
        legalNote: 'Tazminat davalarında delil toplama ve zarar hesaplaması kritiktir.',
        fields: [
            {
                id: 'mahkeme_maddi',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Ankara 2. Asliye Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_maddi',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Zarar gören kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_maddi',
                label: 'Davalı Adı/Unvanı',
                type: 'text',
                placeholder: 'Sorumlu kişi/kurum adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'olay_tarihi',
                label: 'Olay Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'olay_yeri',
                label: 'Olay Yeri',
                type: 'text',
                placeholder: 'Olayın gerçekleştiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'zarar_turu',
                label: 'Zarar Türü',
                type: 'select',
                required: true,
                options: [
                    'Araç hasarı',
                    'Mal hasarı',
                    'İş gücü kaybı',
                    'Gelir kaybı',
                    'Tedavi masrafları',
                    'Diğer maddi zarar'
                ]
            },
            {
                id: 'zarar_miktari',
                label: 'Zarar Miktarı (TL)',
                type: 'number',
                placeholder: 'Toplam maddi zarar',
                required: true
            },
            {
                id: 'olay_aciklama',
                label: 'Olay Açıklaması',
                type: 'textarea',
                placeholder: 'Olayın detaylı açıklaması ve zararın nasıl oluştuğu...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'sorumluluk_orani',
                label: 'Davalının Sorumluluk Oranı',
                type: 'select',
                required: true,
                options: [
                    '%100 sorumlu',
                    '%75 sorumlu',
                    '%50 sorumlu',
                    '%25 sorumlu',
                    'Oranı mahkeme belirleyecek'
                ]
            }
        ],
        template: `{{mahkeme_maddi}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_maddi}}

DAVALI:
{{davali_maddi}}

DAVA KONUSU: {{zarar_miktari}} TL Maddi Tazminat Davası

OLAYLAR:
1- {{olay_tarihi}} tarihinde {{olay_yeri}}'nde meydana gelen olay sonucunda davacı maddi zarara uğramıştır.

2- Zarar Türü: {{zarar_turu}}
   Zarar Miktarı: {{zarar_miktari}} TL

3- Olay Açıklaması:
{{olay_aciklama}}

4- Davalının kusurunun bulunduğu ve zarardan sorumlu olduğu açıktır.

5- Sorumluluk Oranı: {{sorumluluk_orani}}

HUKUKİ DAYANAK:
6098 sayılı Türk Borçlar Kanunu'nun 49, 50, 51 ve devamı maddeleri,
4721 sayılı Türk Medeni Kanunu'nun 2. maddesi.

TALEPLERİM:
1- Davalıdan {{zarar_miktari}} TL maddi tazminatın tahsili,
2- Dava tarihinden itibaren yasal faizinin tahsili,
3- Yargılama giderlerinin davalıdan tahsili,
4- Vekalet ücretinin davalıdan tahsili.

Yukarıda belirtilen sebeplerle maddi tazminatın davalıdan tahsilini talep ederim.

{{tarih}}

{{davaci_maddi}}
İmza

EKLER:
1- Zarar tespit tutanağı
2- Fatura/makbuz/rapor
3- Fotoğraflar
4- Şahit beyanları
5- Bilirkişi raporu (varsa)
6- Vekalet belgesi`
    },

    {
        id: 'manevi-tazminat-1',
        title: 'Manevi Tazminat Davası Dilekçesi',
        description: 'Manevi zarar nedeniyle tazminat davası',
        category: 'mahkeme',
        icon: '💔',
        estimatedTime: '20-30 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['manevi tazminat', 'zarar', 'dava'],
        legalNote: 'Manevi tazminat miktarının belirlenmesinde mahkeme takdiri önemlidir.',
        fields: [
            {
                id: 'mahkeme_manevi',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İstanbul 5. Asliye Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_manevi',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Mağdur kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_manevi',
                label: 'Davalı Adı/Unvanı',
                type: 'text',
                placeholder: 'Sorumlu kişi/kurum adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'manevi_zarar_turu',
                label: 'Manevi Zarar Türü',
                type: 'select',
                required: true,
                options: [
                    'Hakaret/küfür',
                    'Kişilik haklarına saldırı',
                    'Özel hayatın gizliliğinin ihlali',
                    'Aile bireyi ölümü',
                    'Bedensel zarar',
                    'Mobbing/zorbalık',
                    'Diğer'
                ]
            },
            {
                id: 'talep_edilen_miktar',
                label: 'Talep Edilen Miktar (TL)',
                type: 'number',
                placeholder: 'Manevi tazminat miktarı',
                required: true
            },
            {
                id: 'manevi_olay_tarihi',
                label: 'Olay Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'manevi_olay_detay',
                label: 'Olay Detayı',
                type: 'textarea',
                placeholder: 'Manevi zarara neden olan olayın detaylı açıklaması...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'manevi_etki',
                label: 'Manevi Etkiler',
                type: 'textarea',
                placeholder: 'Olayın sizde yarattığı manevi etkiler, psikolojik sonuçlar...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{mahkeme_manevi}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_manevi}}

DAVALI:
{{davali_manevi}}

DAVA KONUSU: {{talep_edilen_miktar}} TL Manevi Tazminat Davası

OLAYLAR:
1- {{manevi_olay_tarihi}} tarihinde davalının davacıya yönelik gerçekleştirdiği eylemler sonucunda davacı manevi zarara uğramıştır.

2- Manevi Zarar Türü: {{manevi_zarar_turu}}

3- Olay Detayı:
{{manevi_olay_detay}}

4- Manevi Etkiler:
{{manevi_etki}}

5- Davalının eylemi sonucunda davacının şahsiyeti zedelenmiş, manevi acı yaşamış ve toplumsal itibarı sarsılmıştır.

HUKUKİ DAYANAK:
6098 sayılı Türk Borçlar Kanunu'nun 56, 58 maddeleri,
4721 sayılı Türk Medeni Kanunu'nun 24, 25 maddeleri,
Kişilik haklarının korunması ile ilgili mevzuat.

TALEPLERİM:
1- Davalıdan {{talep_edilen_miktar}} TL manevi tazminatın tahsili,
2- Dava tarihinden itibaren yasal faizinin tahsili,
3- Davalının davacıdan özür dilemesi,
4- Yargılama giderlerinin davalıdan tahsili,
5- Vekalet ücretinin davalıdan tahsili.

Yukarıda belirtilen nedenlerle manevi tazminatın davalıdan tahsilini talep ederim.

{{tarih}}

{{davaci_manevi}}
İmza

EKLER:
1- Olay tutanağı (varsa)
2- Şahit beyanları
3- Fotoğraf/video/ses kayıtları
4- Psikolojik rapor (varsa)
5- İlgili belgeler
6- Vekalet belgesi`
    },

    {
        id: 'tahliye-dava-1',
        title: 'Tahliye Davası Dilekçesi',
        description: 'Kiracının taşınmazı boşaltması için dava',
        category: 'mahkeme',
        icon: '🏠',
        estimatedTime: '15-25 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['tahliye', 'kira', 'dava'],
        legalNote: 'Tahliye davalarında usul kuralları ve süreler önemlidir.',
        fields: [
            {
                id: 'mahkeme_tahliye',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Ankara 3. Sulh Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_tahliye',
                label: 'Davacı (Mülk Sahibi) Adı',
                type: 'text',
                placeholder: 'Kiralayan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_tahliye',
                label: 'Davalı (Kiracı) Adı',
                type: 'text',
                placeholder: 'Kiracının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'tasinmaz_adres',
                label: 'Taşınmaz Adresi',
                type: 'textarea',
                placeholder: 'Kiralanan taşınmazın tam adresi',
                required: true,
                validation: { minLength: 20, maxLength: 400 }
            },
            {
                id: 'kira_sozlesme_tarihi',
                label: 'Kira Sözleşmesi Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'tahliye_sebebi',
                label: 'Tahliye Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Kira bedeli ödenmemesi',
                    'Sözleşme süresi bitimi',
                    'Malik kullanımı',
                    'Esaslı tamir gereği',
                    'Sözleşme ihlali',
                    'Diğer'
                ]
            },
            {
                id: 'fesih_ihbar_tarihi',
                label: 'Fesih İhbar Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'tahliye_detay',
                label: 'Tahliye Gerekçesi Detayı',
                type: 'textarea',
                placeholder: 'Tahliye sebeplerinin detaylı açıklaması...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            },
            {
                id: 'birikken_kira',
                label: 'Biriken Kira Borcu (TL)',
                type: 'number',
                placeholder: 'Varsa ödenmemiş kira miktarı',
                required: false
            }
        ],
        template: `{{mahkeme_tahliye}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_tahliye}}

DAVALI:
{{davali_tahliye}}

DAVA KONUSU: Tahliye Davası

OLAYLAR:
1- Davacı ile davalı arasında {{kira_sozlesme_tarihi}} tarihinde aşağıdaki taşınmaz için kira sözleşmesi imzalanmıştır.

2- Kiralanan Taşınmaz Adresi:
{{tasinmaz_adres}}

3- Tahliye Sebebi: {{tahliye_sebebi}}

4- {{fesih_ihbar_tarihi}} tarihinde davalıya usulüne uygun fesih bildirimi yapılmıştır.

5- Detaylı Gerekçe:
{{tahliye_detay}}

{{#birikken_kira}}
6- Davalının {{birikken_kira}} TL kira borcu bulunmaktadır.
{{/birikken_kira}}

7- Davalı ihbar süresine rağmen taşınmazı tahliye etmemiştir.

HUKUKİ DAYANAK:
6098 sayılı Türk Borçlar Kanunu'nun 328, 344, 350 maddeleri,
6570 sayılı Kira Kanunu,
İlgili İçtihadı Birleştirme Kararları.

TALEPLERİM:
1- Davalının yukarıda adresi belirtilen taşınmazı tahliye etmesine,
{{#birikken_kira}}
2- {{birikken_kira}} TL kira borcunun faiziyle birlikte tahsiline,
{{/birikken_kira}}
3- Yargılama giderlerinin davalıdan tahsiline,
4- Vekalet ücretinin davalıdan tahsiline.

Yukarıda belirtilen sebeplerle tahliyeye karar verilmesini talep ederim.

{{tarih}}

{{davaci_tahliye}}
İmza

EKLER:
1- Kira sözleşmesi sureti
2- Tapu sureti
3- Fesih bildirimi
4- Tebliğ belgesi
5- İkametgah belgesi
6- Vekalet belgesi`
    },

    {
        id: 'isci-alacak-dava-1',
        title: 'İşçi Alacakları Davası',
        description: 'Ödenmemiş işçi alacakları için dava dilekçesi',
        category: 'mahkeme',
        icon: '💼',
        estimatedTime: '25-35 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['işçi alacağı', 'iş hukuku', 'dava'],
        legalNote: 'İş hukukunda zamanaşımı süreleri ve hesaplamalar kritiktir.',
        fields: [
            {
                id: 'mahkeme_isci',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İstanbul 7. İş Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_isci',
                label: 'Davacı (İşçi) Adı',
                type: 'text',
                placeholder: 'İşçinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_isveren',
                label: 'Davalı (İşveren) Unvanı',
                type: 'text',
                placeholder: 'İşveren şirket unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'ise_giris_tarihi',
                label: 'İşe Giriş Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'isten_cikis_tarihi',
                label: 'İşten Çıkış Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'pozisyon_isci',
                label: 'Pozisyon/Görev',
                type: 'text',
                placeholder: 'İşçinin görev tanımı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'son_maas',
                label: 'Son Maaş (TL)',
                type: 'number',
                placeholder: 'En son aldığı aylık brüt maaş',
                required: true
            },
            {
                id: 'alacak_turleri',
                label: 'Talep Edilen Alacak Türleri',
                type: 'textarea',
                placeholder: 'Kıdem tazminatı, ihbar tazminatı, fazla mesai, yıllık izin, vs...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'toplam_alacak',
                label: 'Toplam Alacak Tutarı (TL)',
                type: 'number',
                placeholder: 'Tüm alacakların toplamı',
                required: true
            },
            {
                id: 'fesih_sebebi_isci',
                label: 'Fesih Sebebi',
                type: 'select',
                required: true,
                options: [
                    'İşveren tarafından haksız fesih',
                    'İşçi tarafından haklı nedenle fesih',
                    'İşveren tarafından bildirimli fesih',
                    'Karşılıklı anlaşma ile fesih',
                    'Diğer'
                ]
            }
        ],
        template: `{{mahkeme_isci}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_isci}}

DAVALI:
{{davali_isveren}}

DAVA KONUSU: {{toplam_alacak}} TL İşçi Alacakları Davası

OLAYLAR:
1- Davacı {{ise_giris_tarihi}} tarihinde davalı işyerinde {{pozisyon_isci}} pozisyonunda çalışmaya başlamıştır.

2- İş ilişkisi {{isten_cikis_tarihi}} tarihinde sona ermiştir.

3- Çalışma Süresi: [Hesaplanacak] yıl [ay] gün

4- Son Maaş: {{son_maas}} TL

5- Fesih Sebebi: {{fesih_sebebi_isci}}

6- Talep Edilen Alacaklar:
{{alacak_turleri}}

7- Davalı işveren yukarıda belirtilen alacakları ödememiştir.

HUKUKİ DAYANAK:
4857 sayılı İş Kanunu,
4857 sayılı İş Kanunu'nun 32, 40, 41, 46 maddeleri,
İş Hukuku yargıtay içtihatları.

TALEPLERİM:
1- Kıdem tazminatının yasal faiziyle birlikte tahsili,
2- İhbar tazminatının yasal faiziyle birlikte tahsili,
3- Fazla mesai ücretlerinin yasal faiziyle birlikte tahsili,
4- Yıllık izin ücretinin yasal faiziyle birlikte tahsili,
5- Diğer işçi alacaklarının yasal faiziyle birlikte tahsili,
6- İşe iade davası açma hakkının saklı tutulması,
7- Yargılama giderlerinin davalıdan tahsili,
8- Vekalet ücretinin davalıdan tahsili.

TOPLAM TALEP: {{toplam_alacak}} TL + Yasal Faiz

Yukarıda belirtilen işçi alacaklarının davalıdan tahsilini talep ederim.

{{tarih}}

{{davaci_isci}}
İmza

EKLER:
1- İş sözleşmesi
2- Bordro örnekleri
3- SGK hizmet belgesi
4- Mesai kayıtları
5- Fesih belgesi
6- İş Kanunu fotokopisi
7- Vekalet belgesi`
    },

    {
        id: 'haksiz-fiil-tazminat-1',
        title: 'Haksız Fiil Tazminat Davası',
        description: 'Haksız fiil nedeniyle tazminat davası',
        category: 'mahkeme',
        icon: '⚖️',
        estimatedTime: '20-30 dakika',
        complexity: 'Zor',
        tags: ['haksız fiil', 'tazminat', 'zarar'],
        legalNote: 'Haksız fiil davalarında kusur ve nedensellik bağının ispatı önemlidir.',
        fields: [
            {
                id: 'mahkeme_haksiz',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Bursa 4. Asliye Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_haksiz',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Zarar gören kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_haksiz',
                label: 'Davalı Adı/Unvanı',
                type: 'text',
                placeholder: 'Haksız fiili işleyen kişi/kurum',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'haksiz_fiil_turu',
                label: 'Haksız Fiil Türü',
                type: 'select',
                required: true,
                options: [
                    'Trafik kazası',
                    'İş kazası',
                    'Malpraktis (tıbbi hata)',
                    'Ürün sorumluluğu',
                    'Yapı sorumluluğu',
                    'Hayvan sorumluluğu',
                    'Diğer'
                ]
            },
            {
                id: 'haksiz_fiil_tarihi',
                label: 'Haksız Fiil Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'haksiz_fiil_yeri',
                label: 'Haksız Fiil Yeri',
                type: 'text',
                placeholder: 'Olayın gerçekleştiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'haksiz_fiil_aciklama',
                label: 'Haksız Fiil Açıklaması',
                type: 'textarea',
                placeholder: 'Haksız fiilin nasıl gerçekleştiğini detaylı açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'zarar_cesitleri',
                label: 'Zarar Çeşitleri',
                type: 'textarea',
                placeholder: 'Maddi zarar, manevi zarar, gelir kaybı vs...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'tazminat_miktari_haksiz',
                label: 'Talep Edilen Tazminat (TL)',
                type: 'number',
                placeholder: 'Toplam tazminat miktarı',
                required: true
            }
        ],
        template: `{{mahkeme_haksiz}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_haksiz}}

DAVALI:
{{davali_haksiz}}

DAVA KONUSU: {{tazminat_miktari_haksiz}} TL Haksız Fiil Tazminat Davası

OLAYLAR:
1- {{haksiz_fiil_tarihi}} tarihinde {{haksiz_fiil_yeri}}'nde davalının haksız fiili sonucunda davacı zarara uğramıştır.

2- Haksız Fiil Türü: {{haksiz_fiil_turu}}

3- Olayın Gelişimi:
{{haksiz_fiil_aciklama}}

4- Oluşan Zararlar:
{{zarar_cesitleri}}

5- Davalının kusurunun bulunduğu ve zarardan sorumlu olduğu açıktır.

6- Davacının uğradığı toplam zarar {{tazminat_miktari_haksiz}} TL'dir.

HUKUKİ DAYANAK:
6098 sayılı Türk Borçlar Kanunu'nun 49, 50, 51, 52, 53, 54, 55, 56 maddeleri,
4721 sayılı Türk Medeni Kanunu'nun 2. maddesi,
İlgili özel kanun hükümleri.

TALEPLERİM:
1- Davalıdan {{tazminat_miktari_haksiz}} TL tazminatın tahsili,
2- Dava tarihinden itibaren yasal faizinin tahsili,
3- Gelecekte doğacak zararların tespiti,
4- Yargılama giderlerinin davalıdan tahsili,
5- Vekalet ücretinin davalıdan tahsili.

Yukarıda belirtilen sebeplerle haksız fiil tazminatının davalıdan tahsilini talep ederim.

{{tarih}}

{{davaci_haksiz}}
İmza

EKLER:
1- Olay yeri inceleme tutanağı
2- Sağlık raporu/tedavi belgeleri
3- Fatura/makbuz/belgeler
4- Şahit beyanları
5- Bilirkişi raporu (varsa)
6- Fotoğraf/video belgeleri
7- Vekalet belgesi`
    },

    {
        id: 'tapu-tescil-dava-1',
        title: 'Tapu Tescil Davası Dilekçesi',
        description: 'Mülkiyetin tapuya tescili için dava',
        category: 'mahkeme',
        icon: '📋',
        estimatedTime: '25-35 dakika',
        complexity: 'Zor',
        tags: ['tapu', 'tescil', 'mülkiyet'],
        legalNote: 'Tapu davaları karmaşık hukuki süreçlerdir. Uzman avukat desteği şarttır.',
        fields: [
            {
                id: 'mahkeme_tapu',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Ankara 6. Asliye Hukuk Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_tapu',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Mülkiyet hakkı sahibinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_tapu',
                label: 'Davalı Adı/Unvanı',
                type: 'text',
                placeholder: 'Tapuda kayıtlı malik veya Hazine',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'tasinmaz_nitelik',
                label: 'Taşınmaz Niteliği',
                type: 'select',
                required: true,
                options: [
                    'Arsa',
                    'Ev',
                    'Dükkan',
                    'Tarla',
                    'Bağ/Bahçe',
                    'İş yeri',
                    'Diğer'
                ]
            },
            {
                id: 'tasinmaz_adres_tapu',
                label: 'Taşınmaz Adresi',
                type: 'textarea',
                placeholder: 'Taşınmazın tam adresi ve tanımı',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'il_ilce',
                label: 'İl/İlçe',
                type: 'text',
                placeholder: 'Örn: Ankara/Çankaya',
                required: true,
                validation: { minLength: 5, maxLength: 50 }
            },
            {
                id: 'ada_parsel',
                label: 'Ada/Parsel Numarası',
                type: 'text',
                placeholder: 'Örn: 125 ada 8 parsel',
                required: true
            },
            {
                id: 'mulkiyet_sebebi',
                label: 'Mülkiyet Edinme Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Satın alma (satış sözleşmesi)',
                    'Miras',
                    'Hibe',
                    'Kamulaştırma bedeli ile satın alma',
                    'İşgal (zamanaşımı)',
                    'İnşaat karşılığı devir',
                    'Diğer'
                ]
            },
            {
                id: 'edinme_tarihi',
                label: 'Mülkiyeti Edinme Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'tescil_engeli',
                label: 'Tescil Engeli',
                type: 'textarea',
                placeholder: 'Tescile engel olan durum (eski malik, kayıt sorunu vs)...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{mahkeme_tapu}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_tapu}}

DAVALI:
{{davali_tapu}}

DAVA KONUSU: Tapu Tescil Davası

OLAYLAR:
1- Davacı aşağıda belirtilen taşınmazın malikidir.

2- Taşınmaz Bilgileri:
   Nitelik: {{tasinmaz_nitelik}}
   Adres: {{tasinmaz_adres_tapu}}
   İl/İlçe: {{il_ilce}}
   Ada/Parsel: {{ada_parsel}}

3- Mülkiyet Edinme Sebebi: {{mulkiyet_sebebi}}
   Edinme Tarihi: {{edinme_tarihi}}

4- Tescil Engeli:
{{tescil_engeli}}

5- Davacı yasal şartları sağlamasına rağmen mülkiyeti tapuya tescil edilmemiştir.

6- Davacının mülkiyet hakkının tesciline karar verilmesi gerekmektedir.

HUKUKİ DAYANAK:
4721 sayılı Türk Medeni Kanunu'nun 1006, 1007, 1012 maddeleri,
2644 sayılı Tapu Kanunu,
İlgili İçtihadı Birleştirme Kararları.

TALEPLERİM:
1- Yukarıda belirtilen taşınmazda davacı adına mülkiyet hakkının tescili,
2- Tescil işleminin Tapu Müdürlüğü'nce yapılması,
3- Yargılama giderlerinin davalıdan tahsili,
4- Vekalet ücretinin davalıdan tahsili.

Yukarıda belirtilen sebeplerle mülkiyet hakkının tescilini talep ederim.

{{tarih}}

{{davaci_tapu}}
İmza

EKLER:
1- Satış sözleşmesi/miras belgesi
2- Tapu kayıt örneği
3- İmar durumu belgesi
4- Belediye kayıtları
5- Şahit beyanları
6- Bilirkişi raporu (varsa)
7- Vekalet belgesi`
    },

    {
        id: 'suc-duyuru-1',
        title: 'Suç Duyurusu Dilekçesi',
        description: 'Cumhuriyet Savcılığına suç duyurusu',
        category: 'ceza_hukuku',
        icon: '🔒',
        estimatedTime: '15-20 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['suç duyurusu', 'savcılık', 'ceza'],
        legalNote: 'Suç duyurularında delil toplama ve zamanaşımı önemlidir.',
        fields: [
            {
                id: 'cumhuriyet_savciligi',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: Ankara Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'duyurucu_adi',
                label: 'Duyurucu Adı Soyadı',
                type: 'text',
                placeholder: 'Suç duyurusunda bulunan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'duyurucu_tc',
                label: 'Duyurucu T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sanık_adi',
                label: 'Sanık Adı Soyadı',
                type: 'text',
                placeholder: 'Suçu işlediği düşünülen kişinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'suc_turu',
                label: 'Suç Türü',
                type: 'select',
                required: true,
                options: [
                    'Dolandırıcılık',
                    'Hırsızlık',
                    'Gasp',
                    'Tehdit',
                    'Hakaret',
                    'Yaralama',
                    'Mala zarar verme',
                    'Dokunulmazlığın ihlali',
                    'Diğer'
                ]
            },
            {
                id: 'suc_tarihi',
                label: 'Suç Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'suc_yeri',
                label: 'Suç Yeri',
                type: 'text',
                placeholder: 'Suçun işlendiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'suc_aciklama',
                label: 'Suç Açıklaması',
                type: 'textarea',
                placeholder: 'Suçun nasıl işlendiğini detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'zarar_miktari_suc',
                label: 'Zarar Miktarı (TL)',
                type: 'number',
                placeholder: 'Varsa maddi zarar miktarı',
                required: false
            },
            {
                id: 'sahitlar',
                label: 'Şahitler',
                type: 'textarea',
                placeholder: 'Şahit isim/adres bilgileri (varsa)...',
                required: false
            }
        ],
        template: `{{cumhuriyet_savciligi}}

SUÇ DUYURUSU

DUYURUCU:
Adı Soyadı: {{duyurucu_adi}}
T.C. Kimlik No: {{duyurucu_tc}}

SANIK:
{{sanık_adi}}

SUÇ KONUSU: {{suc_turu}}

OLAYLAR:
1- {{suc_tarihi}} tarihinde {{suc_yeri}}'nde yukarıda kimliği belirtilen sanık tarafından suç işlenmiştir.

2- Suçun Detayı:
{{suc_aciklama}}

{{#zarar_miktari_suc}}
3- Oluşan maddi zarar: {{zarar_miktari_suc}} TL
{{/zarar_miktari_suc}}

{{#sahitlar}}
4- Şahitler:
{{sahitlar}}
{{/sahitlar}}

5- Yukarıda açıklanan eylemler Türk Ceza Kanunu'nun ilgili maddeleri kapsamında suç teşkil etmektedir.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun ilgili maddeleri,
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

TALEBİM:
Sanık hakkında gerekli soruşturmanın başlatılması ve kanuni işlemlerin yapılmasını talep ederim.

Duyurumun kabulü ve gereğinin yapılmasını saygılarımla arz ederim.

{{tarih}}

{{duyurucu_adi}}
İmza

EKLER:
1- Kimlik fotokopisi
2- Delil belgeler/fotoğraflar
3- Şahit beyanları
4- İlgili belgeler`
    },

    {
        id: 'idari-dava-1',
        title: 'İdari Dava Dilekçesi',
        description: 'İdari işlemlere karşı iptal davası',
        category: 'idare_hukuku',
        icon: '🏛️',
        estimatedTime: '20-30 dakika',
        complexity: 'Zor',
        tags: ['idari dava', 'iptal', 'kamu yönetimi'],
        legalNote: 'İdari dava süreleri kesin sürelerdir. 60 günlük süreye dikkat edin.',
        fields: [
            {
                id: 'idare_mahkemesi',
                label: 'İdare Mahkemesi',
                type: 'text',
                placeholder: 'Örn: Ankara 1. İdare Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_idari',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Dava açan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_idare',
                label: 'Davalı İdare',
                type: 'text',
                placeholder: 'Örn: Ankara Büyükşehir Belediyesi',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'idari_islem_konusu',
                label: 'İdari İşlem Konusu',
                type: 'select',
                required: true,
                options: [
                    'İmar planı değişikliği',
                    'Yapı ruhsatı reddi',
                    'İşyeri kapatma',
                    'Memur disiplin cezası',
                    'Vergi/harç tarhiyatı',
                    'Kamulaştırma kararı',
                    'Çevre izni reddi',
                    'Diğer'
                ]
            },
            {
                id: 'islem_tarihi',
                label: 'İşlem Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'islem_sayisi',
                label: 'İşlem Sayı/Numarası',
                type: 'text',
                placeholder: 'İdari işlemin sayı numarası',
                required: true
            },
            {
                id: 'iptal_gerekce',
                label: 'İptal Gerekçesi',
                type: 'select',
                required: true,
                options: [
                    'Hukuka aykırılık',
                    'Yetki aşımı',
                    'Usul hatası',
                    'Sebep yokluğu',
                    'Ölçülülük ilkesine aykırılık',
                    'Eşitlik ilkesine aykırılık',
                    'Diğer'
                ]
            },
            {
                id: 'idari_islem_detay',
                label: 'İşlem Detayı ve İtiraz Nedenleri',
                type: 'textarea',
                placeholder: 'İdari işlemin detayı ve neden hukuka aykırı olduğunu açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{idare_mahkemesi}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_idari}}

DAVALI İDARE:
{{davali_idare}}

DAVA KONUSU: İdari İşlemin İptali Davası

OLAYLAR:
1- Davalı idare tarafından {{islem_tarihi}} tarih ve {{islem_sayisi}} sayılı yazı ile aşağıdaki idari işlem tesis edilmiştir.

2- İdari İşlem Konusu: {{idari_islem_konusu}}

3- İşlem Detayı ve İtiraz Nedenleri:
{{idari_islem_detay}}

4- İptal Gerekçesi: {{iptal_gerekce}}

5- Bu idari işlem hukuka aykırı olup davacının hakkını ihlal etmektedir.

6- İdari işlemin iptali için yasal süre içerisinde dava açılmıştır.

HUKUKİ DAYANAK:
2577 sayılı İdari Yargılama Usulü Kanunu'nun 2, 10, 11 maddeleri,
Anayasa'nın 125. maddesi,
İlgili özel kanun hükümleri.

TALEPLERİM:
1- Yukarıda tarih ve sayısı belirtilen idari işlemin iptali,
2- Yürütmenin durdurulması kararı verilmesi,
3- Yargılama giderlerinin davalı idareden tahsili,
4- Vekalet ücretinin davalı idareden tahsili.

Yukarıda belirtilen sebeplerle idari işlemin iptalini talep ederim.

{{tarih}}

{{davaci_idari}}
İmza

EKLER:
1- İdari işlem sureti
2- Tebliğ belgesi
3- İlgili belgeler
4- Vekalet belgesi`
    },

    {
        id: 'nafaka-dava-1',
        title: 'Nafaka Davası Dilekçesi',
        description: 'Eş veya çocuk nafakası davası',
        category: 'aile_hukuku',
        icon: '👨‍👩‍👧‍👦',
        estimatedTime: '25-35 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['nafaka', 'aile hukuku', 'çocuk'],
        legalNote: 'Nafaka miktarı gelir durumu ve ihtiyaçlara göre belirlenir.',
        fields: [
            {
                id: 'mahkeme_nafaka',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İstanbul 4. Aile Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_nafaka',
                label: 'Davacı Adı Soyadı',
                type: 'text',
                placeholder: 'Nafaka talep eden kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_nafaka',
                label: 'Davalı Adı Soyadı',
                type: 'text',
                placeholder: 'Nafaka yükümlüsünün tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'nafaka_turu',
                label: 'Nafaka Türü',
                type: 'select',
                required: true,
                options: [
                    'Çocuk nafakası',
                    'Eş nafakası (yoksulluk)',
                    'Eş nafakası (tedbir)',
                    'Yaşlılık nafakası',
                    'Boşanma sonrası nafaka'
                ]
            },
            {
                id: 'cocuk_sayisi',
                label: 'Çocuk Sayısı',
                type: 'number',
                placeholder: 'Varsa çocuk sayısı',
                required: false
            },
            {
                id: 'talep_miktar',
                label: 'Talep Edilen Nafaka (TL)',
                type: 'number',
                placeholder: 'Aylık nafaka miktarı',
                required: true
            },
            {
                id: 'davali_gelir',
                label: 'Davalının Geliri (TL)',
                type: 'number',
                placeholder: 'Aylık gelir miktarı',
                required: true
            },
            {
                id: 'nafaka_gerekce',
                label: 'Nafaka Gerekçesi',
                type: 'textarea',
                placeholder: 'Nafaka talebinin gerekçelerini detaylı açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `{{mahkeme_nafaka}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_nafaka}}

DAVALI:
{{davali_nafaka}}

DAVA KONUSU: {{talep_miktar}} TL {{nafaka_turu}} Davası

OLAYLAR:
1- Taraflar arasındaki ilişki sebebiyle nafaka yükümlülüğü doğmuştur.

2- Nafaka Türü: {{nafaka_turu}}

{{#cocuk_sayisi}}
3- Çocuk Sayısı: {{cocuk_sayisi}}
{{/cocuk_sayisi}}

4- Davalının Gelir Durumu: {{davali_gelir}} TL/ay

5- Talep Gerekçesi:
{{nafaka_gerekce}}

6- Davalının gelir durumu ve davacının ihtiyaçları dikkate alındığında {{talep_miktar}} TL aylık nafaka gerekmektedir.

HUKUKİ DAYANAK:
4721 sayılı Türk Medeni Kanunu'nun 328, 364, 175, 176 maddeleri,
6100 sayılı Hukuk Muhakemeleri Kanunu'nun ilgili hükümleri.

TALEPLERİM:
1- Davalıdan {{talep_miktar}} TL aylık nafakanın tahsiline,
2- Geçmişe yönelik nafakanın tahsiline,
3- Enflasyon oranında artış kararı verilmesine,
4- Yargılama giderlerinin davalıdan tahsiline,
5- Vekalet ücretinin davalıdan tahsiline.

Yukarıda belirtilen sebeplerle nafakanın tahsilini talep ederim.

{{tarih}}

{{davaci_nafaka}}
İmza

EKLER:
1- Gelir belgeleri
2- Gider belgeleri
3- Çocuk belgesi (varsa)
4- Evlilik cüzdanı
5- Vekalet belgesi`
    },

    {
        id: 'velayet-dava-1',
        title: 'Velayet Davası Dilekçesi',
        description: 'Çocuğun velayetinin belirlenmesi için dava',
        category: 'aile_hukuku',
        icon: '👶',
        estimatedTime: '30-40 dakika',
        complexity: 'Zor',
        tags: ['velayet', 'çocuk', 'aile hukuku'],
        legalNote: 'Velayet davalarında çocuğun yüksek yararı esas alınır.',
        fields: [
            {
                id: 'mahkeme_velayet',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Ankara 2. Aile Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_velayet',
                label: 'Davacı Eş Adı',
                type: 'text',
                placeholder: 'Velayet talep eden eşin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_velayet',
                label: 'Davalı Eş Adı',
                type: 'text',
                placeholder: 'Diğer eşin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'cocuk_adi',
                label: 'Çocuğun Adı Soyadı',
                type: 'text',
                placeholder: 'Velayet konusu çocuğun tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'cocuk_yas',
                label: 'Çocuğun Yaşı',
                type: 'number',
                placeholder: 'Çocuğun yaşı',
                required: true
            },
            {
                id: 'velayet_sebebi',
                label: 'Velayet Talep Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Boşanma durumunda velayet',
                    'Çocuğun yüksek yararı',
                    'Diğer eşin uygunsuz davranışları',
                    'Daha iyi yaşam koşulları sağlama',
                    'Çocuğun istekleri',
                    'Diğer'
                ]
            },
            {
                id: 'velayet_gerekce',
                label: 'Velayet Gerekçesi',
                type: 'textarea',
                placeholder: 'Velayet talebinizin detaylı gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'bakim_kosullari',
                label: 'Bakım Koşulları',
                type: 'textarea',
                placeholder: 'Çocuğa sağlayacağınız bakım koşullarını açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{mahkeme_velayet}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_velayet}}

DAVALI:
{{davali_velayet}}

DAVA KONUSU: Velayet Davası

OLAYLAR:
1- Taraflar evli olup ortak çocukları vardır.

2- Çocuk Bilgileri:
   Adı Soyadı: {{cocuk_adi}}
   Yaşı: {{cocuk_yas}}

3- Velayet Talep Sebebi: {{velayet_sebebi}}

4- Detaylı Gerekçe:
{{velayet_gerekce}}

5- Davacının Çocuğa Sağlayacağı Koşullar:
{{bakim_kosullari}}

6- Çocuğun yüksek yararı gözetildiğinde velayetin davacıda kalması gerekmektedir.

HUKUKİ DAYANAK:
4721 sayılı Türk Medeni Kanunu'nun 335, 336, 337, 182 maddeleri,
Çocuk Hakları Sözleşmesi,
Anayasa'nın 41. maddesi.

TALEPLERİM:
1- {{cocuk_adi}} isimli çocuğun velayetinin davacıya verilmesi,
2- Kişisel ilişki kurma düzeninin belirlenmesi,
3- Çocuğun ikametgahının davacı yanında belirlenmesi,
4- Yargılama giderlerinin davalıdan tahsili,
5- Vekalet ücretinin davalıdan tahsili.

Çocuğun yüksek yararı gözetilerek velayetin davacıya verilmesini talep ederim.

{{tarih}}

{{davaci_velayet}}
İmza

EKLER:
1- Nüfus kayıt örneği
2- Gelir belgesi
3- İkametgah belgesi
4- Sağlık raporu
5- Referans mektupları
6- Sosyal inceleme raporu (varsa)
7- Vekalet belgesi`
    },

    {
        id: 'miras-dava-1',
        title: 'Miras Davası Dilekçesi',
        description: 'Miras hakkının tespiti ve paylaşımı davası',
        category: 'aile_hukuku',
        icon: '📜',
        estimatedTime: '30-45 dakika',
        complexity: 'Zor',
        tags: ['miras', 'tereke', 'paylaşım'],
        legalNote: 'Miras davalarında zamanaşımı süreleri ve mirasçılık sıfatı önemlidir.',
        fields: [
            {
                id: 'mahkeme_miras',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İzmir 3. Aile Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_miras',
                label: 'Davacı (Mirasçı) Adı',
                type: 'text',
                placeholder: 'Mirasçının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'davali_miras',
                label: 'Davalı (Diğer Mirasçı) Adı',
                type: 'text',
                placeholder: 'Diğer mirasçının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'muvaris_adi',
                label: 'Müteveffa (Muvarris) Adı',
                type: 'text',
                placeholder: 'Ölen kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'olum_tarihi',
                label: 'Ölüm Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'yakinlik_derecesi',
                label: 'Müteveffaya Yakınlık',
                type: 'select',
                required: true,
                options: [
                    'Eş',
                    'Çocuk',
                    'Anne/Baba',
                    'Kardeş',
                    'Amca/Dayı/Hala/Teyze',
                    'Torun',
                    'Diğer'
                ]
            },
            {
                id: 'miras_konusu',
                label: 'Miras Konusu',
                type: 'select',
                required: true,
                options: [
                    'Taşınmaz (ev/arsa)',
                    'Nakit para/hesaplar',
                    'Araç',
                    'İş yeri',
                    'Hisse senetleri',
                    'Tüm tereke',
                    'Diğer'
                ]
            },
            {
                id: 'tereke_degeri',
                label: 'Tereke Değeri (TL)',
                type: 'number',
                placeholder: 'Tahmini tereke değeri',
                required: true
            },
            {
                id: 'miras_payi',
                label: 'Talep Edilen Miras Payı',
                type: 'select',
                required: true,
                options: [
                    '1/2',
                    '1/3',
                    '1/4',
                    '1/6',
                    '1/8',
                    'Tamamı',
                    'Saklı pay',
                    'Diğer'
                ]
            },
            {
                id: 'dava_gerekce',
                label: 'Dava Gerekçesi',
                type: 'textarea',
                placeholder: 'Miras hakkınızın dayanağını ve davacının taleplerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{mahkeme_miras}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_miras}}

DAVALI:
{{davali_miras}}

DAVA KONUSU: Miras Tespiti ve Paylaşım Davası

OLAYLAR:
1- {{muvaris_adi}} isimli muvarris {{olum_tarihi}} tarihinde vefat etmiştir.

2- Davacının muvarrise yakınlık derecesi: {{yakinlik_derecesi}}

3- Miras Konusu: {{miras_konusu}}
   Tereke Değeri: {{tereke_degeri}} TL

4- Davacının yasal miras payı: {{miras_payi}}

5- Dava Gerekçesi:
{{dava_gerekce}}

6- Davacı yasal mirasçı sıfatıyla haklarını talep etmektedir.

7- Tereke henüz paylaşılmamış veya davacının hakkı verilmemiştir.

HUKUKİ DAYANAK:
4721 sayılı Türk Medeni Kanunu'nun 495 ve devamı maddeleri (Miras Hukuku),
6100 sayılı Hukuk Muhakemeleri Kanunu'nun ilgili hükümleri.

TALEPLERİM:
1- Davacının {{miras_payi}} oranında miras hakkının tespiti,
2- Terekenin davacının payı oranında teslimi,
3- Davacı lehine tescil işlemlerinin yapılması,
4- Geçmişe yönelik miras gelirlerinin tahsili,
5- Yargılama giderlerinin davalıdan tahsili,
6- Vekalet ücretinin davalıdan tahsili.

Miras hakkımın tespiti ve payımın tahsilini talep ederim.

{{tarih}}

{{davaci_miras}}
İmza

EKLER:
1- Ölüm belgesi
2- Nüfus kayıt örneği
3- Veraset-i intikal belgesi
4- Tereke değer tespit raporu
5- Tapu sureti (varsa)
6- Banka hesap durumu
7- Vekalet belgesi`
    },

    {
        id: 'sirket-ortak-dava-1',
        title: 'Şirket Ortaklık Davası',
        description: 'Şirket ortakları arasındaki uyuşmazlık davası',
        category: 'ticaret_hukuku',
        icon: '🏢',
        estimatedTime: '35-45 dakika',
        complexity: 'Zor',
        tags: ['şirket', 'ortaklık', 'ticaret'],
        legalNote: 'Şirket davaları karmaşık hukuki süreçlerdir. Uzman desteği alın.',
        fields: [
            {
                id: 'mahkeme_sirket',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: İstanbul 2. Ticaret Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_ortak',
                label: 'Davacı Ortak Adı',
                type: 'text',
                placeholder: 'Dava açan ortağın tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'davali_ortak',
                label: 'Davalı Ortak/Şirket',
                type: 'text',
                placeholder: 'Davalı ortağın veya şirketin unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'sirket_unvan',
                label: 'Şirket Unvanı',
                type: 'text',
                placeholder: 'Uyuşmazlık konusu şirketin unvanı',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'sirket_turu',
                label: 'Şirket Türü',
                type: 'select',
                required: true,
                options: [
                    'Limited Şirket',
                    'Anonim Şirket',
                    'Kolektif Şirket',
                    'Komandit Şirket',
                    'Kooperatif'
                ]
            },
            {
                id: 'ortak_payi',
                label: 'Davacının Ortaklık Payı (%)',
                type: 'number',
                placeholder: 'Yüzde olarak pay oranı',
                required: true
            },
            {
                id: 'uyusmazlik_konusu',
                label: 'Uyuşmazlık Konusu',
                type: 'select',
                required: true,
                options: [
                    'Kar payı dağıtımı',
                    'Şirket yönetimi',
                    'Ortaktan çıkarma',
                    'Şirket feshi',
                    'Haksız rekabet',
                    'Sermaye artırımı',
                    'Bilanço onayı',
                    'Diğer'
                ]
            },
            {
                id: 'talep_miktari',
                label: 'Talep Miktarı (TL)',
                type: 'number',
                placeholder: 'Para talepli ise miktar',
                required: false
            },
            {
                id: 'uyusmazlik_detay',
                label: 'Uyuşmazlık Detayı',
                type: 'textarea',
                placeholder: 'Ortaklar arasındaki uyuşmazlığı detaylı açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{mahkeme_sirket}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_ortak}}

DAVALI:
{{davali_ortak}}

DAVA KONUSU: Şirket Ortaklık Uyuşmazlığı Davası

OLAYLAR:
1- Taraflar {{sirket_unvan}} ({{sirket_turu}}) ortaklarıdır.

2- Davacının ortaklık payı: %{{ortak_payi}}

3- Uyuşmazlık Konusu: {{uyusmazlik_konusu}}

{{#talep_miktari}}
4- Talep Miktarı: {{talep_miktari}} TL
{{/talep_miktari}}

5- Uyuşmazlık Detayı:
{{uyusmazlik_detay}}

6- Davalının davranışları şirket ana sözleşmesi ve Türk Ticaret Kanunu'na aykırıdır.

7- Davacının ortaklık haklar�� ihlal edilmektedir.

HUKUKİ DAYANAK:
6102 sayılı Türk Ticaret Kanunu'nun ilgili maddeleri,
Şirket ana sözleşmesi hükümleri,
6100 sayılı Hukuk Muhakemeleri Kanunu.

TALEPLERİM:
1- Şirket kayıtlarının incelenmesine,
2- Bilirkişi incelemesi yapılmasına,
{{#talep_miktari}}
3- {{talep_miktari}} TL tutarındaki alacağın tahsiline,
{{/talep_miktari}}
4- Ortaklık haklarının korunmasına,
5- Şirket yönetiminin düzenlenmesine,
6- Yargılama giderlerinin davalıdan tahsiline,
7- Vekalet ücretinin davalıdan tahsiline.

Ortaklık haklarımın korunmasını ve uyuşmazlığın çözümünü talep ederim.

{{tarih}}

{{davaci_ortak}}
İmza

EKLER:
1- Şirket ana sözleşmesi
2- Ticaret sicili gazetesi
3- Ortaklık belgesi
4- Bilançolar/mali tablolar
5- Yazışmalar
6- İlgili belgeler
7- Vekalet belgesi`
    },

    {
        id: 'ihtiyati-haciz-1',
        title: 'İhtiyati Haciz Talebi',
        description: 'Alacağın güvence altına alınması için ihtiyati haciz',
        category: 'icra',
        icon: '🔒',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['ihtiyati haciz', 'güvence', 'alacak'],
        legalNote: 'İhtiyati haciz kararları aciliyet arz eder. Teminat yatırmanız gerekebilir.',
        fields: [
            {
                id: 'icra_mudurlugu_iht',
                label: 'İcra Müdürlüğü',
                type: 'text',
                placeholder: 'Örn: Ankara 5. İcra Müdürlüğü',
                required: true,
                validation: { minLength: 5, maxLength: 100 }
            },
            {
                id: 'alacakli_iht',
                label: 'Alacaklı Adı/Unvanı',
                type: 'text',
                placeholder: 'Talep eden kişi/kurum adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'borclu_iht',
                label: 'Borçlu Adı/Unvanı',
                type: 'text',
                placeholder: 'Hacze konu mal sahibinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'alacak_miktari_iht',
                label: 'Alacak Miktarı (TL)',
                type: 'number',
                placeholder: 'Güvence altına alınacak miktar',
                required: true
            },
            {
                id: 'alacak_sebebi_iht',
                label: 'Alacak Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Sözleşme alacağı',
                    'Kira alacağı',
                    'Ticari alacak',
                    'Hizmet bedeli',
                    'Tazminat alacağı',
                    'Senet alacağı',
                    'Diğer'
                ]
            },
            {
                id: 'haciz_konusu',
                label: 'Haciz Konusu',
                type: 'select',
                required: true,
                options: [
                    'Banka hesabı',
                    'Taşınmaz',
                    'Araç',
                    'Maaş/ücret',
                    'Ticari işletme',
                    'Hisse senedi',
                    'Diğer'
                ]
            },
            {
                id: 'aciliyet_sebebi',
                label: 'Aciliyet Sebebi',
                type: 'textarea',
                placeholder: 'İhtiyati haciz için aciliyet sebeplerini açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'teminat_miktari',
                label: 'Teminat Miktarı (TL)',
                type: 'number',
                placeholder: 'Yatırılacak teminat miktarı',
                required: false
            }
        ],
        template: `{{icra_mudurlugu_iht}}

İHTİYATİ HACİZ TALEBİ

ALACAKLI:
{{alacakli_iht}}

BORÇLU:
{{borclu_iht}}

ALACAK MİKTARI: {{alacak_miktari_iht}} TL
ALACAK SEBEBİ: {{alacak_sebebi_iht}}

İcra ve İflas Kanunu'nun 257. maddesi uyarınca aşağıda belirtilen sebeplerle ihtiyati haciz kararı verilmesini talep ederim.

HACİZ KONUSU: {{haciz_konusu}}

ACİLİYET SEBEPLERİ:
{{aciliyet_sebebi}}

TALEP EDİLEN TEDBİR:
Borçlunun yukarıda belirtilen malvarlığı unsurlarına ihtiyati haciz konulması.

{{#teminat_miktari}}
TEMİNAT TUTARI: {{teminat_miktari}} TL
{{/teminat_miktari}}

HUKUKİ DAYANAK:
İcra ve İflas Kanunu'nun 257, 258, 259 maddeleri,
6100 sayılı Hukuk Muhakemeleri Kanunu'nun 389 ve devamı maddeleri.

GEREKÇE:
1- Alacağın mevcudiyeti ve miktarı belgelidir,
2- Borçlunun malvarlığını kaçırma riski vardır,
3- Alacağın tahsili tehlikeye düşmüştür,
4- Gecikmede sakınca bulunmaktadır.

TALEBİM:
İhtiyati haciz kararı verilmesi ve derhal icrasına karar verilmesini talep ederim.

{{tarih}}

{{alacakli_iht}}
İmza

EKLER:
1- Alacağı gösteren belgeler
2- Teminat makbuzu (varsa)
3- Vekalet belgesi
4- İlgili belgeler

NOT: Bu talep acil olup derhal sonuçlandırılmasını arz ederim.`
    },

    {
        id: 'konkordato-talep-1',
        title: 'Konkordato Talebi',
        description: 'Borçlunun konkordato başvurusu',
        category: 'icra',
        icon: '📋',
        estimatedTime: '40-50 dakita',
        complexity: 'Zor',
        tags: ['konkordato', 'borç yapılandırma', 'iflas'],
        legalNote: 'Konkordato karmaşık bir süreçtir. Mutlaka uzman hukuki danışmanlık alın.',
        fields: [
            {
                id: 'ticaret_mahkemesi',
                label: 'Ticaret Mahkemesi',
                type: 'text',
                placeholder: 'Örn: İstanbul 3. Ticaret Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'borclu_unvan',
                label: 'Borçlu Şirket Unvanı',
                type: 'text',
                placeholder: 'Konkordato talep eden şirketin unvanı',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'sirket_turu_konk',
                label: 'Şirket Türü',
                type: 'select',
                required: true,
                options: [
                    'Anonim Şirket',
                    'Limited Şirket',
                    'Kolektif Şirket',
                    'Komandit Şirket',
                    'Şahıs İşletmesi'
                ]
            },
            {
                id: 'toplam_borc',
                label: 'Toplam Borç Miktarı (TL)',
                type: 'number',
                placeholder: 'Tüm borçların toplamı',
                required: true
            },
            {
                id: 'alacakli_sayisi',
                label: 'Alacaklı Sayısı',
                type: 'number',
                placeholder: 'Toplam alacaklı sayısı',
                required: true
            },
            {
                id: 'konkordato_turu',
                label: 'Konkordato Türü',
                type: 'select',
                required: true,
                options: [
                    'Adi konkordato',
                    'İflas içi konkordato',
                    'Özel konkordato'
                ]
            },
            {
                id: 'odeme_plani',
                label: 'Önerilen Ödeme Planı',
                type: 'textarea',
                placeholder: 'Alacaklılara önerilen ödeme planını açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            },
            {
                id: 'mali_durum',
                label: 'Mali Durum Açıklaması',
                type: 'textarea',
                placeholder: 'Şirketin mali durumunu ve konkordato gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{ticaret_mahkemesi}}

KONKORDATO TALEBİ

BAŞVURUCU BORÇLU:
{{borclu_unvan}} ({{sirket_turu_konk}})

İcra ve İflas Kanunu'nun 285 ve devamı maddeleri uyarınca konkordato mühletinin verilmesini talep ederim.

MALİ DURUM:
Toplam Borç: {{toplam_borc}} TL
Alacaklı Sayısı: {{alacakli_sayisi}} kişi/kurum
Konkordato Türü: {{konkordato_turu}}

MALİ DURUM AÇIKLAMASI:
{{mali_durum}}

ÖNERİLEN ÖDEME PLANI:
{{odeme_plani}}

KONKORDATO GEREKÇELERİ:
1- Şirketimiz geçici mali güçlükler yaşamaktadır,
2- Faaliyetlerimiz devam etmekte olup gelir elde etme kapasitemiz mevcuttur,
3- Konkordato ile hem alacaklıların hem şirketin menfaati korunacaktır,
4- İflas halinde alacaklılar daha az alacak elde edeceklerdir,
5- İş yerinin korunması sosyal açıdan da yararlıdır.

HUKUKİ DAYANAK:
İcra ve İflas Kanunu'nun 285, 286, 287, 288 maddeleri,
6102 sayılı Türk Ticaret Kanunu'nun ilgili hükümleri.

TALEPLERİM:
1- Geçici mühletin verilmesi,
2- Kayyım tayini,
3- Konkordato projesinin hazırlanması,
4- Alacaklılar toplantısının yapılması,
5- Konkordatonun tasdiki.

Konkordato mühletinin tanınmasını ve gerekli işlemlerin yapılmasını saygılarımla talep ederim.

{{tarih}}

{{borclu_unvan}}
[Yetkili İmza ve Kaşe]

EKLER:
1- Son 3 yıllık bilançolar
2- Alacaklılar listesi
3- Borçlar listesi
4- Konkordato projesi taslağı
5- Mali durum raporu
6- Ticaret sicil sureti
7- İmza sirküleri
8- Vekalet belgesi

NOT: Bu talep acil olup gecikmede sakınca bulunmaktadır.`
    },

    {
        id: 'patent-ihlal-dava-1',
        title: 'Patent İhlali Davası',
        description: 'Patent hakkının ihlali nedeniyle dava',
        category: 'ticaret_hukuku',
        icon: '💡',
        estimatedTime: '35-45 dakika',
        complexity: 'Zor',
        tags: ['patent', 'fikri mülkiyet', 'ihlal'],
        legalNote: 'Patent davaları teknik uzmanlık gerektirir. Uzman hukukçu desteği alın.',
        fields: [
            {
                id: 'mahkeme_patent',
                label: 'Mahkeme Adı',
                type: 'text',
                placeholder: 'Örn: Ankara 1. Fikri ve Sınai Haklar Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_patent',
                label: 'Davacı (Patent Sahibi)',
                type: 'text',
                placeholder: 'Patent sahibinin adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'davali_patent',
                label: 'Davalı (İhlal Eden)',
                type: 'text',
                placeholder: 'Patent ihlali yapan kişi/kurum',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'patent_no',
                label: 'Patent Numarası',
                type: 'text',
                placeholder: 'Türkiye Patent Enstitüsü patent numarası',
                required: true
            },
            {
                id: 'patent_adi',
                label: 'Patent Adı',
                type: 'text',
                placeholder: 'Patentin resmi adı',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'patent_tarih',
                label: 'Patent Tescil Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'ihlal_turu',
                label: 'İhlal Türü',
                type: 'select',
                required: true,
                options: [
                    'Patentli ürünün üretimi',
                    'Patentli ürünün satışı',
                    'Patentli yöntemin kullanımı',
                    'Taklit ürün imalatı',
                    'İthalat/ihracat',
                    'Ticari amaçla kullanım',
                    'Diğer'
                ]
            },
            {
                id: 'zarar_miktari_patent',
                label: 'Tahmini Zarar Miktarı (TL)',
                type: 'number',
                placeholder: 'İhlal nedeniyle oluşan zarar',
                required: true
            },
            {
                id: 'ihlal_aciklama',
                label: 'İhlal Açıklaması',
                type: 'textarea',
                placeholder: 'Patent ihlalinin nasıl gerçekleştiğini teknik olarak açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{mahkeme_patent}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_patent}}

DAVALI:
{{davali_patent}}

DAVA KONUSU: {{zarar_miktari_patent}} TL Patent İhlali Tazminat Davası

OLAYLAR:
1- Davacı {{patent_tarih}} tarihinde tescil edilen "{{patent_adi}}" (Patent No: {{patent_no}}) patent sahibidir.

2- İhlal Türü: {{ihlal_turu}}

3- İhlal Açıklaması:
{{ihlal_aciklama}}

4- Davalının eylemleri davacının patent haklarını ihlal etmektedir.

5- Bu ihlal nedeniyle davacı {{zarar_miktari_patent}} TL zarar görmüştür.

PATENT BİLGİLERİ:
Patent Adı: {{patent_adi}}
Patent No: {{patent_no}}
Tescil Tarihi: {{patent_tarih}}
Patent Sahibi: {{davaci_patent}}

HUKUKİ DAYANAK:
6769 sayılı Sınai Mülkiyet Kanunu'nun 85, 149, 150, 151 maddeleri,
Patent hakkının korunmasına ilişkin uluslararası sözleşmeler.

TALEPLERİM:
1- Patent ihlalinin tespiti,
2- İhlal eylemlerinin durdurulması,
3- {{zarar_miktari_patent}} TL tazminatın tahsili,
4- İhlalde kullanılan ürünlerin imhası,
5- Haksız kazancın geri verilmesi,
6- Özür ilanı verilmesi,
7- Yargılama giderlerinin davalıdan tahsili,
8- Vekalet ücretinin davalıdan tahsili.

Patent haklarımın korunması ve tazminatın tahsilini talep ederim.

{{tarih}}

{{davaci_patent}}
İmza

EKLER:
1- Patent belgesi
2- Patent tescil gazetesi
3- İhlal delilleri/fotoğraflar
4- Bilirkişi raporu (varsa)
5- Zarar tespit belgeleri
6- Vekalet belgesi`
    },

    {
        id: 'is-guvenligi-sikayet-1',
        title: 'İş Güvenliği İhlali Şikayeti',
        description: 'İş sağlığı ve güvenliği ihlallerine karşı şikayet',
        category: 'is_hukuku',
        icon: '⚠️',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        tags: ['iş güvenliği', 'şikayet', 'SGK'],
        legalNote: 'İş güvenliği ihlalleri ciddi sonuçlar doğurabilir. Acilen başvuruda bulunun.',
        fields: [
            {
                id: 'bagimli_kurum',
                label: 'Başvuru Yapılacak Kurum',
                type: 'select',
                required: true,
                options: [
                    'İş Müfettişliği',
                    'Çalışma ve Sosyal Güvenlik Bakanlığı',
                    'İl Müdürlüğü',
                    'Belediye',
                    'Valilik'
                ]
            },
            {
                id: 'sikayetci_adi',
                label: 'Şikayetçi Adı Soyadı',
                type: 'text',
                placeholder: 'Şikayet eden işçinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'sikayetci_tc_guvenlik',
                label: 'Şikayetçi T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'isveren_unvan_guvenlik',
                label: 'İşveren Unvanı',
                type: 'text',
                placeholder: 'Şikayet edilen işyerinin unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'isyeri_adresi_guvenlik',
                label: 'İş Yeri Adresi',
                type: 'textarea',
                placeholder: 'İş yerinin tam adresi',
                required: true,
                validation: { minLength: 10, maxLength: 300 }
            },
            {
                id: 'calisan_sayisi',
                label: 'İş Yerindeki Çalışan Sayısı',
                type: 'number',
                placeholder: 'Toplam işçi sayısı',
                required: true
            },
            {
                id: 'ihlal_turu',
                label: 'İhlal Türü',
                type: 'select',
                required: true,
                options: [
                    'Kişisel koruyucu donanım eksikliği',
                    'Güvenlik eğitimi verilmemesi',
                    'Tehlikeli işlerde önlem alınmaması',
                    'İş güvenliği uzmanı yokluğu',
                    'İşyeri hekimi yokluğu',
                    'Makine güvenlik eksiklikleri',
                    'Yangın güvenlik eksiklikleri',
                    'İşyeri hijyen şartları',
                    'Diğer'
                ]
            },
            {
                id: 'ihlal_detay',
                label: 'İhlal Detayı',
                type: 'textarea',
                placeholder: 'İş güvenliği ihlallerini detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'tehlike_durumu',
                label: 'Tehlike Durumu',
                type: 'select',
                required: true,
                options: [
                    'Acil tehlike var',
                    'Ciddi risk var',
                    'Orta düzey risk',
                    'Düşük risk',
                    'Potansiyel tehlike'
                ]
            },
            {
                id: 'onceki_sikayet',
                label: 'Daha Önce Şikayet Edildi mi?',
                type: 'select',
                required: true,
                options: [
                    'Hayır, ilk şikayet',
                    'Evet, işverene yapıldı',
                    'Evet, resmi kurumlara yapıldı',
                    'Evet, ancak sonuç alınamadı'
                ]
            }
        ],
        template: `{{bagimli_kurum}}

İŞ SAĞLIĞI VE GÜVENLİĞİ İHLALİ ŞİKAYETİ

ŞİKAYETÇİ BİLGİLERİ:
Adı Soyadı: {{sikayetci_adi}}
T.C. Kimlik No: {{sikayetci_tc_guvenlik}}

İŞVEREN BİLGİLERİ:
Unvanı: {{isveren_unvan_guvenlik}}
İş Yeri Adresi: {{isyeri_adresi_guvenlik}}
Çalışan Sayısı: {{calisan_sayisi}} kişi

İHLAL KONUSU: {{ihlal_turu}}
TEHLİKE DURUMU: {{tehlike_durumu}}

DETAYLI ŞİKAYET:
{{ihlal_detay}}

ÖNCEKİ ŞİKAYET DURUMU: {{onceki_sikayet}}

YASAL DAYANAK:
6331 sayılı İş Sağlığı ve Güvenliği Kanunu,
İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği,
Kişisel Koruyucu Donanım Yönetmeliği,
İlgili teknik mevzuat.

TALEBİM:
1- İş yerinde acil denetim yapılması,
2- İş sağlığı ve güvenliği ihlallerinin tespit edilmesi,
3- Gerekli idari yaptırımların uygulanması,
4- İşverene düzeltme süresi verilmesi,
5- İşçi sağlığının korunması için önlem alınması,
6- Durumun takip edilmesi.

İş güvenliği ihlallerinin acilen denetlenmesini ve gerekli önlemlerin alınmasını talep ederim.

{{tarih}}

{{sikayetci_adi}}
İmza

EKLER:
1- Fotoğraf belgeleri
2- Video kayıtları (varsa)
3- Şahit beyanları
4- Tıbbi raporlar (varsa)
5- İlgili belgeler

NOT: Bu şikayet acil olup işçi sağlığı açısından gecikmede sakınca bulunmaktadır.

İletişim Bilgileri:
[Telefon]
[E-posta]
[Adres]`
    },

    {
        id: 'elektronik-haberlesme-sikayet-1',
        title: 'Elektronik Haberleşme Hizmet Şikayeti',
        description: 'Telefon, internet, TV hizmet sağlayıcılarına şikayet',
        category: 'idare_hukuku',
        icon: '📱',
        estimatedTime: '15-20 dakika',
        complexity: 'Kolay',
        tags: ['elektronik haberleşme', 'BTK', 'internet', 'telefon'],
        legalNote: 'Elektronik haberleşme şikayetleri BTK yetkisindedir.',
        fields: [
            {
                id: 'sikayetci_adi_elek',
                label: 'Şikayetçi Adı Soyadı',
                type: 'text',
                placeholder: 'Tam adınız ve soyadınız',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'sikayetci_tc_elek',
                label: 'T.C. Kimlik Numarası',
                type: 'text',
                placeholder: '11 haneli TC kimlik numaranız',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sikayetci_adres_elek',
                label: 'Şikayetçi Adresi',
                type: 'textarea',
                placeholder: 'Tam adres bilginiz',
                required: true,
                validation: { minLength: 20, maxLength: 300 }
            },
            {
                id: 'operator_adi',
                label: 'Operatör/Firma Adı',
                type: 'select',
                required: true,
                options: [
                    'Türk Telekom',
                    'Vodafone',
                    'Turkcell',
                    'TTNET',
                    'Superonline',
                    'Millenicom',
                    'Turknet',
                    'D-Smart',
                    'Digiturk',
                    'Tivibu',
                    'Diğer'
                ]
            },
            {
                id: 'hizmet_turu_elek',
                label: 'Hizmet Türü',
                type: 'select',
                required: true,
                options: [
                    'Sabit telefon',
                    'Mobil telefon',
                    'İnternet (ADSL/Fiber)',
                    'Kablosuz internet',
                    'Uydu TV',
                    'Kablolu TV',
                    'IPTV',
                    'Paket hizmet',
                    'Diğer'
                ]
            },
            {
                id: 'abone_no',
                label: 'Abone Numarası',
                type: 'text',
                placeholder: 'Hizmet abone numaranız',
                required: true
            },
            {
                id: 'sikayet_konusu_elek',
                label: 'Şikayet Konusu',
                type: 'select',
                required: true,
                options: [
                    'Hizmet kesintisi',
                    'Hizmet kalitesi düşüklüğü',
                    'Fatura hatası',
                    'Haksız ücretlendirme',
                    'Sözleşme ihlali',
                    'Müşteri hizmetleri sorunu',
                    'Teknik arıza',
                    'Hız problemi',
                    'Abonelik iptali engeli',
                    'Diğer'
                ]
            },
            {
                id: 'sikayet_detay_elek',
                label: 'Şikayet Detayı',
                type: 'textarea',
                placeholder: 'Yaşadığınız sorunu detaylı olarak açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1500 }
            },
            {
                id: 'baslangic_tarihi',
                label: 'Sorun Başlangıç Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'operator_basvuru',
                label: 'Operatöre Başvuru Yapıldı mı?',
                type: 'select',
                required: true,
                options: [
                    'Evet, çözüm bulunamadı',
                    'Evet, kısmen çözüldü',
                    'Hayır, başvuru yapılmadı',
                    'Başvuru reddedildi'
                ]
            }
        ],
        template: `BILGI TEKNOLOJİLERİ VE İLETİŞİM KURUMU
        
ELEKTRONİK HABERLEŞME HİZMET ŞİKAYETİ

ŞİKAYETÇİ BİLGİLERİ:
Adı Soyadı: {{sikayetci_adi_elek}}
T.C. Kimlik No: {{sikayetci_tc_elek}}
Adresi: {{sikayetci_adres_elek}}

HİZMET SAĞLAYICI BİLGİLERİ:
Operatör/Firma: {{operator_adi}}
Hizmet Türü: {{hizmet_turu_elek}}
Abone Numarası: {{abone_no}}

ŞİKAYET KONUSU: {{sikayet_konusu_elek}}

SORUN BAŞLANGIÇ TARİHİ: {{baslangic_tarihi}}

DETAYLI ŞİKAYET:
{{sikayet_detay_elek}}

OPERATÖRE BAŞVURU DURUMU: {{operator_basvuru}}

YASAL DAYANAK:
5809 sayılı Elektronik Haberleşme Kanunu,
Elektronik Haberleşme Sektöründe Tüketici Hakları Yönetmeliği,
6502 sayılı Tüketicinin Korunması Hakkında Kanun.

TALEBİM:
1- Şikayetimin incelenmesi,
2- Hizmet sağlayıcının uyarılması,
3- Sorunun çözülmesi için gerekli tedbirlerin alınması,
4- Haksız ücretlendirme varsa iadesinin sağlanması,
5- Bu tür sorunların tekrarlanmaması için önlem alınması.

Yukarıda belirtilen elektronik haberleşme hizmet sorunlarının çözülmesini talep ederim.

{{tarih}}

{{sikayetci_adi_elek}}
İmza

İLETİŞİM BİLGİLERİ:
[Telefon Numarası]
[E-posta Adresi]

EKLER:
1- Fatura örnekleri
2- Yazışma kayıtları
3- Ekran görüntüleri (varsa)
4- İlgili belgeler`
    },

    {
        id: 'vergi-itiraz-2',
        title: 'Vergi İtiraz Dilekçesi',
        description: 'Vergi dairesine karşı vergi itiraz başvurusu',
        category: 'idare_hukuku',
        icon: '💼',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['vergi', 'itiraz', 'vergi dairesi', 'mali'],
        legalNote: 'Vergi itirazları 30 günlük kesin süreye tabidir. Süre kaçırılmamalıdır.',
        fields: [
            {
                id: 'vergi_dairesi',
                label: 'Vergi Dairesi',
                type: 'text',
                placeholder: 'Örn: Ankara Vergi Dairesi Müdürlüğü',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'mukellef_adi',
                label: 'Mükellef Adı/Unvanı',
                type: 'text',
                placeholder: 'Vergi mükellefi adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'vergi_no',
                label: 'Vergi Kimlik/Sicil Numarası',
                type: 'text',
                placeholder: 'VKN veya T.C. Kimlik No',
                required: true,
                validation: { minLength: 10, maxLength: 11 }
            },
            {
                id: 'tarhiyat_turu',
                label: 'Tarhiyat Türü',
                type: 'select',
                required: true,
                options: [
                    'Gelir Vergisi',
                    'Kurumlar Vergisi',
                    'KDV (Katma Değer Vergisi)',
                    'ÖTV (Özel Tüketim Vergisi)',
                    'MTV (Motorlu Taşıtlar Vergisi)',
                    'Emlak Vergisi',
                    'Veraset ve İntikal Vergisi',
                    'Damga Vergisi',
                    'Diğer'
                ]
            },
            {
                id: 'tarhiyat_tutari',
                label: 'Tarhiyat Tutarı (TL)',
                type: 'number',
                placeholder: 'İtiraz konusu vergi miktarı',
                required: true
            },
            {
                id: 'tarhiyat_tarihi',
                label: 'Tarhiyat Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'teblig_tarihi',
                label: 'Tebliğ Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'itiraz_gerekce_vergi',
                label: 'İtiraz Gerekçesi',
                type: 'select',
                required: true,
                options: [
                    'Matrah yanlış hesaplanmış',
                    'Vergi oranı hatalı uygulanmış',
                    'Yasal dayanak yoktur',
                    'Zamanaşımına uğramıştır',
                    'Muafiyet/istisna hakkı vardır',
                    'Belge ve kayıt düzeni yeterlidir',
                    'Çifte vergileme söz konusudur',
                    'Diğer'
                ]
            },
            {
                id: 'itiraz_aciklama_vergi',
                label: 'İtiraz Açıklaması',
                type: 'textarea',
                placeholder: 'İtirazınızın detaylı gerekçelerini ve hukuki dayanaklarını açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'vergi_donemi',
                label: 'Vergi Dönemi',
                type: 'text',
                placeholder: 'Örn: 2024/01, 2024 yılı',
                required: true
            }
        ],
        template: `{{vergi_dairesi}}

VERGİ İTİRAZ DİLEKÇESİ

MÜKELLEF BİLGİLERİ:
Adı/Unvanı: {{mukellef_adi}}
Vergi Kimlik/Sicil No: {{vergi_no}}

TARHİYAT BİLGİLERİ:
Vergi Türü: {{tarhiyat_turu}}
Vergi Dönemi: {{vergi_donemi}}
Tarhiyat Tutarı: {{tarhiyat_tutari}} TL
Tarhiyat Tarihi: {{tarhiyat_tarihi}}
Tebliğ Tarihi: {{teblig_tarihi}}

213 sayılı Vergi Usul Kanunu'nun 114. maddesi uyarınca yukarıda belirtilen tarhiyata karşı itirazımı beyan ederim.

İTİRAZ GEREKÇESİ: {{itiraz_gerekce_vergi}}

DETAYLI AÇIKLAMA:
{{itiraz_aciklama_vergi}}

HUKUKİ DAYANAK:
213 sayılı Vergi Usul Kanunu'nun 114, 115, 116 maddeleri,
193 sayılı Gelir Vergisi Kanunu (ilgili maddeler),
3065 sayılı Katma Değer Vergisi Kanunu (ilgili maddeler),
İlgili vergi kanunları ve tebliğler.

TALEBİM:
1- Tarhiyatın tamamen iptali,
2- Alternatif olarak tarhiyat tutarının indirilmesi,
3- Gecikme faizi ve gecikme zammının iptali,
4- İtirazımın kabulü ile gerekli işlemlerin yapılması.

Vergi tarhiyatının hukuka aykırı olduğu yukarıda izah edilmiş olup, itirazımın kabulü ile tarhiyatın iptalini saygılarımla talep ederim.

{{tarih}}

{{mukellef_adi}}
[İmza ve Kaşe]

EKLER:
1- Tarhiyat ihbarnamesi sureti
2- Tebliğ belgesi
3- Mukellef kayıtları
4- Mali müşavir raporu (varsa)
5- İlgili belgeler
6- Vekalet belgesi (varsa)

NOT: Bu itiraz VUK'un 114. maddesi uyarınca tebliğ tarihinden itibaren 30 gün içerisinde yapılmıştır.`
    },

    {
        id: 'emeklilik-ikramiye-1',
        title: 'Emeklilik İkramiyesi Talebi',
        description: 'SGK\'dan emeklilik ikramiyesi talep başvurusu',
        category: 'is_hukuku',
        icon: '👴',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['emeklilik', 'ikramiye', 'SGK', 'sosyal güvenlik'],
        legalNote: 'Emeklilik ikramiyesi belli şartları sağlayanlar için hak teşkil eder.',
        fields: [
            {
                id: 'emekli_adi',
                label: 'Emekli Adı Soyadı',
                type: 'text',
                placeholder: 'Emeklinin tam adı ve soyadı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'emekli_tc',
                label: 'T.C. Kimlik Numarası',
                type: 'text',
                placeholder: '11 haneli T.C. kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sgk_sicil_no',
                label: 'SGK Sicil Numarası',
                type: 'text',
                placeholder: 'SGK sicil numarası',
                required: true
            },
            {
                id: 'emeklilik_tarihi',
                label: 'Emeklilik Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'emeklilik_turu_ikramiye',
                label: 'Emeklilik Türü',
                type: 'select',
                required: true,
                options: [
                    'Yaşlılık aylığı',
                    'Malullük aylığı',
                    'Dul aylığı',
                    'Yetim aylığı',
                    'Vazife malullüğü aylığı'
                ]
            },
            {
                id: 'calisma_suresi',
                label: 'Toplam Çalışma Süresi',
                type: 'text',
                placeholder: 'Örn: 25 yıl 8 ay 15 gün',
                required: true
            },
            {
                id: 'son_isyeri',
                label: 'Son Çalışılan İş Yeri',
                type: 'text',
                placeholder: 'Son işverenin unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'aylik_miktar',
                label: 'Aylık Miktarı (TL)',
                type: 'number',
                placeholder: 'Emeklilik aylığı miktarı',
                required: true
            },
            {
                id: 'ikramiye_turu',
                label: 'Talep Edilen İkramiye Türü',
                type: 'select',
                required: true,
                options: [
                    'Emeklilik ikramiyesi (2 aylık)',
                    'Bayram ikramiyesi',
                    'İlave emeklilik ikramiyesi',
                    'Ek ikramiye',
                    'Diğer'
                ]
            },
            {
                id: 'talep_gerekce',
                label: 'Talep Gerekçesi',
                type: 'textarea',
                placeholder: 'İkramiye talebinizin gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `SOSYAL GÜVENLİK KURUMU
{{tarih}}

EMEKLİLİK İKRAMİYESİ TALEBİ

EMEKLİ BİLGİLERİ:
Adı Soyadı: {{emekli_adi}}
T.C. Kimlik No: {{emekli_tc}}
SGK Sicil No: {{sgk_sicil_no}}

EMEKLİLİK BİLGİLERİ:
Emeklilik Tarihi: {{emeklilik_tarihi}}
Emeklilik Türü: {{emeklilik_turu_ikramiye}}
Toplam Çalışma Süresi: {{calisma_suresi}}
Son İş Yeri: {{son_isyeri}}
Aylık Miktarı: {{aylik_miktar}} TL

TALEP: {{ikramiye_turu}}

GEREKÇE:
{{talep_gerekce}}

YASAL DAYANAK:
5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'nun ilgili maddeleri,
Emekli İkramiyeleri Yönetmeliği,
İlgili SGK genelgeleri ve talimatları.

AÇIKLAMA:
Yukarıda belirtilen bilgiler doğrultusunda emeklilik ikramiyemi talep ediyorum. Kanuni şartları sağladığım ve gerekli belgeleri sunduğum için ikramiyenin ödenmesini saygılarımla arz ederim.

TALEBİM:
1- Emeklilik ikramiyemin hesaplanması,
2- Yasal süresi içerisinde ödenmesi,
3- Varsa eksik belgelerin bildirilmesi,
4- Gerekli işlemlerin yapılması.

{{tarih}}

{{emekli_adi}}
İmza

İLETİŞİM BİLGİLERİ:
[Adres]
[Telefon]
[E-posta]

EKLER:
1- T.C. Kimlik kartı fotokopisi
2- Emeklilik belgesi
3- Son maaş bordrosu
4- Banka hesap bilgileri
5- İkametgah belgesi
6- İlgili belgeler

NOT: Bu başvuru 5510 sayılı Kanun'un ilgili hükümleri uyarınca yapılmıştır.`
    },

    {
        id: 'gumruk-vergi-itiraz-1',
        title: 'Gümrük Vergisi İtirazı',
        description: 'Gümrük idaresine karşı vergi ve ceza itirazı',
        category: 'idare_hukuku',
        icon: '🚛',
        estimatedTime: '25-35 dakika',
        complexity: 'Zor',
        popular: true,
        tags: ['gümrük', 'vergi', 'ithalat', 'ihracat', 'ticaret'],
        legalNote: 'Gümrük itirazları 15 günlük kesin süreye tabidir. Acil olarak başvurulmalıdır.',
        fields: [
            {
                id: 'gumruk_mudurlugu',
                label: 'Gümrük Müdürlüğü',
                type: 'text',
                placeholder: 'Örn: İstanbul Havalimanı Gümrük Müdürlüğü',
                required: true,
                validation: { minLength: 10, maxLength: 150 }
            },
            {
                id: 'yukumlu_adi',
                label: 'Yükümlü Adı/Unvanı',
                type: 'text',
                placeholder: 'İthalatçı/İhracatçı firma unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'gumruk_musiri_no',
                label: 'Gümrük Müşiri/GTIP Numarası',
                type: 'text',
                placeholder: 'Gümrük tarife istatistik pozisyon numarası',
                required: true
            },
            {
                id: 'beyanname_no',
                label: 'Gümrük Beyannamesi Numarası',
                type: 'text',
                placeholder: 'İthalat/İhracat beyanname numarası',
                required: true
            },
            {
                id: 'islem_tarihi',
                label: 'İşlem Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'itiraz_konusu',
                label: 'İtiraz Konusu',
                type: 'select',
                required: true,
                options: [
                    'Gümrük vergisi tarhiyatı',
                    'KDV tarhiyatı',
                    'ÖTV tarhiyatı',
                    'Anti-damping vergisi',
                    'Gümrük cezası',
                    'Vergi cezası',
                    'Değer tespiti',
                    'Tarife pozisyonu',
                    'Menşe tespiti',
                    'Diğer'
                ]
            },
            {
                id: 'tarhiyat_tutari_gumruk',
                label: 'Tarhiyat/Ceza Tutarı (TL)',
                type: 'number',
                placeholder: 'İtiraz konusu miktar',
                required: true
            },
            {
                id: 'mal_cinsi',
                label: 'Mal Cinsi/Tanımı',
                type: 'textarea',
                placeholder: 'İthal/İhraç edilen malın detaylı tanımı...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'menşe_ulke',
                label: 'Menşe Ülke',
                type: 'text',
                placeholder: 'Malın menşe ülkesi',
                required: true
            },
            {
                id: 'gumruk_itiraz_gerekce',
                label: 'İtiraz Gerekçesi',
                type: 'textarea',
                placeholder: 'İtirazınızın detaylı hukuki ve teknik gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{gumruk_mudurlugu}}

GÜMRÜK VERGİSİ/CEZA İTİRAZ DİLEKÇESİ

YÜKÜMLÜ BİLGİLERİ:
Adı/Unvanı: {{yukumlu_adi}}

İŞLEM BİLGİLERİ:
Beyanname No: {{beyanname_no}}
İşlem Tarihi: {{islem_tarihi}}
GTIP Numarası: {{gumruk_musiri_no}}

MAL BİLGİLERİ:
Mal Cinsi: {{mal_cinsi}}
Menşe Ülke: {{menşe_ulke}}

İTİRAZ KONUSU: {{itiraz_konusu}}
İTİRAZ TUTARI: {{tarhiyat_tutari_gumruk}} TL

4458 sayılı Gümrük Kanunu'nun 6. maddesi uyarınca yukarıda belirtilen işleme karşı itirazımı beyan ederim.

İTİRAZ GEREKÇESİ:
{{gumruk_itiraz_gerekce}}

HUKUKİ DAYANAK:
4458 sayılı Gümrük Kanunu'nun 6, 7, 8 maddeleri,
213 sayılı Vergi Usul Kanunu'nun ilgili hükümleri,
Gümrük Yönetmelikleri,
Uluslararası ticaret anlaşmaları ve DTÖ kuralları.

GÜMRÜK MEVZUATI AÇISINDAN DEĞERLENDİRME:
1- Yapılan tarife sınıflandırması hatalıdır,
2- Değer tespiti mevzuata aykırıdır,
3- Uygulanan vergi oranı yanlıştır,
4- Menşe kuralları doğru uygulanmamıştır,
5- Ceza oranı kanuna aykırı şekilde hesaplanmıştır.

TALEBİM:
1- İtiraz konusu işlemin iptali,
2- Alternatif olarak yeniden değerlendirme yapılması,
3- Haksız alınan vergi ve cezaların iadesi,
4- Faiz tahakkukunun durdurulması,
5- İtirazımın kabulü ile gerekli düzeltmelerin yapılması.

Bu itirazımın kabulü ile işlemin iptalini ve haksız yere alınan vergi/cezaların iadesini saygılarımla talep ederim.

{{tarih}}

{{yukumlu_adi}}
[Yetkili İmza ve Kaşe]

EKLER:
1- Gümrük beyannamesi sureti
2- Ticari fatura
3- Paket listesi
4- Menşe şahadetnamesi
5- Taşıma belgesi
6- Sigorta belgesi
7- Katalog/teknik dökümanlar
8- İlgili mevzuat metinleri
9- Emsal kararlar (varsa)
10- Vekalet belgesi (varsa)

ACELE KAYDI:
Bu itiraz 4458 sayılı Gümrük Kanunu'nun 6. maddesi uyarınca 15 günlük kesin süre içerisinde yapılmıştır.`
    }
];

// Template kategorileri için metadata
export const templateCategories = {
    mahkeme: { label: 'Mahkeme', icon: '⚖️', color: 'bg-blue-500' },
    icra: { label: 'İcra', icon: '📋', color: 'bg-red-500' },
    is_hukuku: { label: 'İş Hukuku', icon: '💼', color: 'bg-green-500' },
    kira: { label: 'Kira', icon: '🏠', color: 'bg-yellow-500' },
    aile_hukuku: { label: 'Aile Hukuku', icon: '👨‍👩‍👧‍👦', color: 'bg-pink-500' },
    borçlar_hukuku: { label: 'Borçlar Hukuku', icon: '💰', color: 'bg-orange-500' },
    ceza_hukuku: { label: 'Ceza Hukuku', icon: '🔒', color: 'bg-gray-500' },
    idare_hukuku: { label: 'İdare Hukuku', icon: '🏛️', color: 'bg-indigo-500' },
    ticaret_hukuku: { label: 'Ticaret Hukuku', icon: '🏢', color: 'bg-purple-500' }
} as const;

export const additionalTemplates: DocumentTemplate[] = [
    {
        id: 'calisma-izni-talep-1',
        title: 'Çalışma İzni Talep Dilekçesi',
        description: 'Yabancılar için çalışma izni başvuru dilekçesi',
        category: 'idare_hukuku',
        icon: '🛂',
        estimatedTime: '25-35 dakika',
        complexity: 'Orta',
        tags: ['çalışma izni', 'yabancılar', 'iş gücü'],
        legalNote: 'Çalışma izni başvuruları resmi prosedürlere tabidir.',
        fields: [
            {
                id: 'yabanci_adi',
                label: 'Yabancı Adı Soyadı',
                type: 'text',
                placeholder: 'Başvuran yabancının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'pasaport_no',
                label: 'Pasaport Numarası',
                type: 'text',
                placeholder: 'Pasaport numarası',
                required: true
            },
            {
                id: 'uyruk',
                label: 'Uyruğu',
                type: 'text',
                placeholder: 'Örn: Alman, İngiliz, Amerikan',
                required: true
            },
            {
                id: 'dogum_tarihi_yabanci',
                label: 'Doğum Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'isveren_unvan_calisma',
                label: 'İşveren Unvanı',
                type: 'text',
                placeholder: 'Çalışılacak şirketin unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'is_tanimi',
                label: 'İş Tanımı/Pozisyon',
                type: 'text',
                placeholder: 'Yapılacak işin detaylı tanımı',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'calisma_suresi',
                label: 'Çalışma Süresi',
                type: 'select',
                required: true,
                options: [
                    '6 ay',
                    '1 yıl',
                    '2 yıl',
                    '3 yıl',
                    'Belirtilmemiş'
                ]
            },
            {
                id: 'egitim_durumu',
                label: 'Eğitim Durumu',
                type: 'select',
                required: true,
                options: [
                    'İlkokul',
                    'Ortaokul',
                    'Lise',
                    'Ön lisans',
                    'Lisans',
                    'Yüksek lisans',
                    'Doktora'
                ]
            },
            {
                id: 'tecrube_yil',
                label: 'Mesleki Tecrübe (Yıl)',
                type: 'number',
                placeholder: 'Kaç yıl tecrübesi var',
                required: true
            },
            {
                id: 'talep_gerekce_calisma',
                label: 'Çalışma İzni Gerekçesi',
                type: 'textarea',
                placeholder: 'Çalışma izni talebinin detaylı gerekçesi...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `ÇALIŞMA VE SOSYAL GÜVENLİK BAKANLIĞI
{{tarih}}

ÇALIŞMA İZNİ TALEP DİLEKÇESİ

YABANCI İŞÇİ BİLGİLERİ:
Adı Soyadı: {{yabanci_adi}}
Pasaport No: {{pasaport_no}}
Uyruğu: {{uyruk}}
Doğum Tarihi: {{dogum_tarihi_yabanci}}

İŞVEREN BİLGİLERİ:
Unvan: {{isveren_unvan_calisma}}

ÇALIŞMA BİLGİLERİ:
İş Tanımı: {{is_tanimi}}
Çalışma Süresi: {{calisma_suresi}}
Eğitim Durumu: {{egitim_durumu}}
Mesleki Tecrübe: {{tecrube_yil}} yıl

6735 sayılı Uluslararası İşgücü Kanunu uyarınca çalışma izni verilmesini talep ederim.

GEREKÇE:
{{talep_gerekce_calisma}}

YASAL DAYANAK:
6735 sayılı Uluslararası İşgücü Kanunu,
Uluslararası İşgücü Yönetmeliği,
İlgili genelge ve talimatlar.

TALEBİM:
Yukarıda belirtilen yabancı işçiye çalışma izni verilmesini saygılarımla talep ederim.

{{tarih}}

{{isveren_unvan_calisma}}
[Yetkili İmza ve Kaşe]

EKLER:
1- Pasaport sureti
2- Diploma tasdiki
3- Sağlık raporu
4- Sabıka kaydı
5- İş sözleşmesi taslağı
6- Şirket faaliyet belgesi`
    },

    {
        id: 'oturma-izni-uzatma-1',
        title: 'Oturma İzni Uzatma Dilekçesi',
        description: 'Yabancılar için oturma izni uzatma başvurusu',
        category: 'idare_hukuku',
        icon: '📄',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        tags: ['oturma izni', 'yabancılar', 'uzatma'],
        legalNote: 'Oturma izni süreleri ve başvuru koşulları önemlidir.',
        fields: [
            {
                id: 'yabanci_adi_oturma',
                label: 'Yabancı Adı Soyadı',
                type: 'text',
                placeholder: 'Başvuran yabancının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'pasaport_no_oturma',
                label: 'Pasaport Numarası',
                type: 'text',
                placeholder: 'Geçerli pasaport numarası',
                required: true
            },
            {
                id: 'uyruk_oturma',
                label: 'Uyruğu',
                type: 'text',
                placeholder: 'Vatandaşlık ülkesi',
                required: true
            },
            {
                id: 'mevcut_izin_no',
                label: 'Mevcut Oturma İzni Numarası',
                type: 'text',
                placeholder: 'Geçerli oturma izni numarası',
                required: true
            },
            {
                id: 'izin_bitis_tarihi',
                label: 'Mevcut İzin Bitiş Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'oturma_izin_turu',
                label: 'Oturma İzni Türü',
                type: 'select',
                required: true,
                options: [
                    'Kısa dönem oturma izni',
                    'Aile oturma izni',
                    'Öğrenci oturma izni',
                    'İnsani nedenlerle oturma izni',
                    'Uzun dönem oturma izni'
                ]
            },
            {
                id: 'turkiye_adres',
                label: 'Türkiye\'deki Adresi',
                type: 'textarea',
                placeholder: 'Türkiye\'de ikamet ettiği tam adres',
                required: true,
                validation: { minLength: 20, maxLength: 400 }
            },
            {
                id: 'uzatma_sebebi',
                label: 'Uzatma Sebebi',
                type: 'select',
                required: true,
                options: [
                    'Çalışma devam ediyor',
                    'Eğitim devam ediyor',
                    'Aile birleşimi',
                    'Yatırım faaliyeti',
                    'Sağlık nedenleri',
                    'İnsani nedenler',
                    'Diğer'
                ]
            },
            {
                id: 'uzatma_gerekce',
                label: 'Uzatma Gerekçesi',
                type: 'textarea',
                placeholder: 'Oturma izni uzatma talebinin detaylı gerekçesi...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `İÇİŞLERİ BAKANLIĞI
GÖÇMEN HAREKETLARI GENEL MÜDÜRLÜĞÜ
{{tarih}}

OTURMA İZNİ UZATMA DİLEKÇESİ

BAŞVURUCU BİLGİLERİ:
Adı Soyadı: {{yabanci_adi_oturma}}
Pasaport No: {{pasaport_no_oturma}}
Uyruğu: {{uyruk_oturma}}
Türkiye Adresi: {{turkiye_adres}}

MEVCUT İZİN BİLGİLERİ:
Oturma İzni No: {{mevcut_izin_no}}
İzin Türü: {{oturma_izin_turu}}
Bitiş Tarihi: {{izin_bitis_tarihi}}

6458 sayılı Yabancılar ve Uluslararası Koruma Kanunu uyarınca oturma iznimin uzatılmasını talep ederim.

UZATMA SEBEBİ: {{uzatma_sebebi}}

DETAYLI GEREKÇE:
{{uzatma_gerekce}}

YASAL DAYANAK:
6458 sayılı Yabancılar ve Uluslararası Koruma Kanunu,
Oturma İzinleri Yönetmeliği,
İlgili genelge ve tebliğler.

TALEBİM:
Oturma iznimin aynı şartlarla uzatılmasını saygılarımla talep ederim.

{{tarih}}

{{yabanci_adi_oturma}}
İmza

EKLER:
1- Pasaport sureti
2- Mevcut oturma izni
3- İkamet belgesi
4- Gelir belgesi
5- Sağlık sigortası
6- İlgili belgeler`
    },

    {
        id: 'sahtecilik-suc-duyuru-1',
        title: 'Sahtecilik Suçu Duyurusu',
        description: 'Sahte belge ve doküman düzenleme suçu duyurusu',
        category: 'ceza_hukuku',
        icon: '📋',
        estimatedTime: '25-35 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['sahtecilik', 'suç duyurusu', 'belge'],
        legalNote: 'Sahtecilik suçları ağır cezai yaptırımları olan suçlardır.',
        fields: [
            {
                id: 'cumhuriyet_savciligi_sahte',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: Ankara Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'duyurucu_adi_sahte',
                label: 'Duyurucu Adı Soyadı',
                type: 'text',
                placeholder: 'Suç duyurusunda bulunan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'duyurucu_tc_sahte',
                label: 'Duyurucu T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sanik_adi_sahte',
                label: 'Sanık Adı Soyadı',
                type: 'text',
                placeholder: 'Sahtecilik yaptığı düşünülen kişinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'sahte_belge_turu',
                label: 'Sahte Belge Türü',
                type: 'select',
                required: true,
                options: [
                    'Resmi belge (kimlik, pasaport)',
                    'Diploma/Sertifika',
                    'İş belgesi/referans',
                    'Mali belge (fatura, makbuz)',
                    'Sağlık raporu',
                    'Mahkeme kararı',
                    'Noter belgesi',
                    'Banka belgesi',
                    'Diğer'
                ]
            },
            {
                id: 'sahtecilik_tarihi',
                label: 'Sahtecilik Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'sahtecilik_yeri',
                label: 'Sahtecilik Yeri',
                type: 'text',
                placeholder: 'Sahte belgenin kullanıldığı/düzenlendiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'sahtecilik_amaci',
                label: 'Sahtecilik Amacı',
                type: 'select',
                required: true,
                options: [
                    'Mali menfaat elde etme',
                    'İş/pozisyon edinme',
                    'Yasal prosedürü atlama',
                    'Hukuki avantaj sağlama',
                    'Kimlik gizleme',
                    'Diğer'
                ]
            },
            {
                id: 'sahtecilik_detay',
                label: 'Sahtecilik Detayı',
                type: 'textarea',
                placeholder: 'Sahtecilik eyleminin nasıl gerçekleştiğini detaylı açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'zarar_miktari_sahte',
                label: 'Oluşan Zarar (TL)',
                type: 'number',
                placeholder: 'Varsa maddi zarar miktarı',
                required: false
            }
        ],
        template: `{{cumhuriyet_savciligi_sahte}}

SUÇ DUYURUSU

DUYURUCU:
Adı Soyadı: {{duyurucu_adi_sahte}}
T.C. Kimlik No: {{duyurucu_tc_sahte}}

SANIK:
{{sanik_adi_sahte}}

SUÇ KONUSU: Sahtecilik (TCK 204-212. maddeler)

OLAYLAR:
1- {{sahtecilik_tarihi}} tarihinde {{sahtecilik_yeri}}'nde yukarıda kimliği belirtilen sanık tarafından sahtecilik suçu işlenmiştir.

2- Sahte Belge Türü: {{sahte_belge_turu}}

3- Sahtecilik Amacı: {{sahtecilik_amaci}}

4- Olay Detayı:
{{sahtecilik_detay}}

{{#zarar_miktari_sahte}}
5- Oluşan maddi zarar: {{zarar_miktari_sahte}} TL
{{/zarar_miktari_sahte}}

6- Sanığın bu eylemi 5237 sayılı Türk Ceza Kanunu'nun sahtecilik suçlarını düzenleyen maddelerine aykırıdır.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun 204, 205, 206, 207, 208, 209, 210, 211, 212 maddeleri,
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

SUÇUN HUKUKİ NİTELİĞİ:
Sanığın eyleminin TCK'nun;
- 204. maddesi (Resmi belgede sahtecilik) veya
- 205. maddesi (Özel belgede sahtecilik) veya
- 206. maddesi (Sahte belgeyi kullanma) kapsamında değerlendirilmesi gerekmektedir.

TALEBİM:
Sanık hakkında sahtecilik suçundan gerekli soruşturmanın başlatılması ve kanuni işlemlerin yapılmasını talep ederim.

{{tarih}}

{{duyurucu_adi_sahte}}
İmza

EKLER:
1- Sahte belge sureti
2- Orijinal belge (varsa)
3- Şahit beyanları
4- Delil belgeler
5- İlgili yazışmalar`
    },

    {
        id: 'zimmete-para-gecirme-duyuru-1',
        title: 'Zimmete Para Geçirme Suç Duyurusu',
        description: 'Kamu görevlisinin zimmet suçu duyurusu',
        category: 'ceza_hukuku',
        icon: '💰',
        estimatedTime: '30-40 dakika',
        complexity: 'Zor',
        tags: ['zimmet', 'kamu görevlisi', 'suç duyurusu'],
        legalNote: 'Zimmet suçu kamu görevlileri için ağır cezalar gerektiren suçlardır.',
        fields: [
            {
                id: 'cumhuriyet_savciligi_zimmet',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: İstanbul Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'duyurucu_adi_zimmet',
                label: 'Duyurucu Adı Soyadı',
                type: 'text',
                placeholder: 'Suç duyurusunda bulunan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'duyurucu_sifati',
                label: 'Duyurucu Sıfatı',
                type: 'text',
                placeholder: 'Örn: Muhasebe Müdürü, Vatandaş, vs.',
                required: true
            },
            {
                id: 'sanik_adi_zimmet',
                label: 'Sanık Adı Soyadı',
                type: 'text',
                placeholder: 'Zimmet suçunu işlediği düşünülen kamu görevlisinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'sanik_gorevi',
                label: 'Sanığın Görevi',
                type: 'text',
                placeholder: 'Sanığın kamu kurumdaki görevi',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'kurum_adi',
                label: 'Kurum Adı',
                type: 'text',
                placeholder: 'Sanığın çalıştığı kamu kurumu',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'zimmet_miktari',
                label: 'Zimmete Geçirilen Miktar (TL)',
                type: 'number',
                placeholder: 'Zimmete geçirilen para miktarı',
                required: true
            },
            {
                id: 'zimmet_tarihi',
                label: 'Zimmet Tarihi/Dönemi',
                type: 'text',
                placeholder: 'Örn: 2024 Ocak - Mart arası',
                required: true
            },
            {
                id: 'zimmet_yontemi',
                label: 'Zimmet Yöntemi',
                type: 'select',
                required: true,
                options: [
                    'Nakit parayı alıkoyma',
                    'Sahte belge düzenleme',
                    'Yetkiyi kötüye kullanma',
                    'Hesap manipülasyonu',
                    'Sahte fatura/makbuz',
                    'Maaş bordrosu manipülasyonu',
                    'Diğer'
                ]
            },
            {
                id: 'zimmet_detay',
                label: 'Zimmet Detayı',
                type: 'textarea',
                placeholder: 'Zimmet suçunun nasıl işlendiğini detaylı açıklayın...',
                required: true,
                validation: { minLength: 150, maxLength: 2500 }
            },
            {
                id: 'tespit_sekli',
                label: 'Suçun Tespit Şekli',
                type: 'textarea',
                placeholder: 'Suçun nasıl fark edildiği ve tespit edildiği...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{cumhuriyet_savciligi_zimmet}}

SUÇ DUYURUSU

DUYURUCU:
Adı Soyadı: {{duyurucu_adi_zimmet}}
Sıfatı: {{duyurucu_sifati}}

SANIK:
Adı Soyadı: {{sanik_adi_zimmet}}
Görevi: {{sanik_gorevi}}
Kurumu: {{kurum_adi}}

SUÇ KONUSU: Zimmet (TCK 247. madde)

OLAYLAR:
1- {{zimmet_tarihi}} tarihinde/döneminde yukarıda kimliği belirtilen kamu görevlisinin zimmet suçu işlediği tespit edilmiştir.

2- Zimmete Geçirilen Miktar: {{zimmet_miktari}} TL

3- Zimmet Yöntemi: {{zimmet_yontemi}}

4- Zimmet Detayı:
{{zimmet_detay}}

5- Suçun Tespit Şekli:
{{tespit_sekli}}

6- Sanık, kamu görevlisi sıfatıyla görevinin verdiği yetkiyi kötüye kullanarak devlet malını zimmete geçirmiştir.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun 247. maddesi (Zimmet),
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

SUÇUN HUKUKİ ANALİZİ:
TCK'nun 247. maddesine göre zimmet suçunun unsurları:
1- Fail kamu görevlisi olmalı (MEVCUT)
2- Malın zilyetliğine görevinin verdiği yetki ile sahip olmalı (MEVCUT)
3- Malı kendisinin veya başkasının zimmetine geçirmeli (MEVCUT)
4- Haksız menfaat sağlama kastı bulunmalı (MEVCUT)

CİDDİYET DURUMU:
- Zimmet miktarı: {{zimmet_miktari}} TL
- Kamu kaynaklarının kötüye kullanımı söz konusudur
- Kamu güvenine ciddi zarar verilmiştir
- Deliller kaybolmadan acil müdahale gerekmektedir

TALEBİM:
1- Sanık hakkında zimmet suçundan soruşturma başlatılması,
2- Sanığın ifadesinin alınması,
3- Mali kayıtların incelenmesi,
4- Bilirkişi incelemesi yapılması,
5- Gerekli güvenlik tedbirlerinin alınması,
6- Kanuni işlemlerin yapılması.

{{tarih}}

{{duyurucu_adi_zimmet}}
İmza

EKLER:
1- Mali kayıt ve belgeler
2- Hesap dökümü
3- Şahit beyanları
4- Kurumsal belgeler
5- Fotoğraf/döküman
6- İlgili yazışmalar`
    },

    {
        id: 'cinsel-taciz-duyuru-1',
        title: 'Cinsel Taciz Suç Duyurusu',
        description: 'Cinsel taciz suçu için savcılığa başvuru',
        category: 'ceza_hukuku',
        icon: '⚠️',
        estimatedTime: '25-35 dakika',
        complexity: 'Orta',
        popular: true,
        tags: ['cinsel taciz', 'suç duyurusu', 'kişi güvenliği'],
        legalNote: 'Cinsel taciz davaları hassas konulardır. Uzman hukuki destek alın.',
        fields: [
            {
                id: 'cumhuriyet_savciligi_taciz',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: Ankara Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'magdur_adi',
                label: 'Mağdur Adı Soyadı',
                type: 'text',
                placeholder: 'Mağdurun tam adı (veya "Kimliği gizli tutulacak")',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'magdur_tc_taciz',
                label: 'Mağdur T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sanik_adi_taciz',
                label: 'Sanık Adı Soyadı',
                type: 'text',
                placeholder: 'Tacizi yapan kişinin adı (biliniyorsa)',
                required: false,
                validation: { minLength: 0, maxLength: 100 }
            },
            {
                id: 'sanik_iliskisi',
                label: 'Sanığın Mağdurla İlişkisi',
                type: 'select',
                required: true,
                options: [
                    'İş arkadaşı',
                    'Amir/Üst',
                    'Öğretmen/Eğitmen',
                    'Tanımadığı kişi',
                    'Komşu',
                    'Aile çevresi',
                    'İnternet/sosyal medya',
                    'Diğer'
                ]
            },
            {
                id: 'taciz_tarihi',
                label: 'Taciz Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'taciz_yeri',
                label: 'Taciz Yeri',
                type: 'text',
                placeholder: 'Tacizin gerçekleştiği yer',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'taciz_turu',
                label: 'Taciz Türü',
                type: 'select',
                required: true,
                options: [
                    'Sözlü taciz',
                    'Fiziksel temas',
                    'Yazılı/elektronik taciz',
                    'Görsel taciz',
                    'İş yerinde taciz',
                    'Takip etme',
                    'Tehdit içeren taciz',
                    'Diğer'
                ]
            },
            {
                id: 'taciz_detay',
                label: 'Taciz Detayı',
                type: 'textarea',
                placeholder: 'Yaşanan tacizi detaylı ancak mümkün olduğunca objektif şekilde açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            },
            {
                id: 'sahit_varmi',
                label: 'Şahit Var mı?',
                type: 'select',
                required: true,
                options: [
                    'Evet, şahit var',
                    'Hayır, şahit yok',
                    'Emin değilim'
                ]
            },
            {
                id: 'delil_durumu',
                label: 'Delil Durumu',
                type: 'select',
                required: true,
                options: [
                    'Yazılı mesajlar var',
                    'Ses/video kaydı var',
                    'Fotoğraf var',
                    'E-mail/dijital delil',
                    'Sadece tanık beyanı',
                    'Belge/rapor var',
                    'Delil yok'
                ]
            }
        ],
        template: `{{cumhuriyet_savciligi_taciz}}

SUÇ DUYURUSU

MAĞDUR:
Adı Soyadı: {{magdur_adi}}
T.C. Kimlik No: {{magdur_tc_taciz}}

SANIK:
{{#sanik_adi_taciz}}
Adı Soyadı: {{sanik_adi_taciz}}
{{/sanik_adi_taciz}}
{{^sanik_adi_taciz}}
Kimliği tespit edilememiş kişi
{{/sanik_adi_taciz}}
Mağdurla İlişkisi: {{sanik_iliskisi}}

SUÇ KONUSU: Cinsel Taciz (TCK 105. madde)

OLAYLAR:
1- {{taciz_tarihi}} tarihinde {{taciz_yeri}}'nde mağdura karşı cinsel taciz suçu işlenmiştir.

2- Taciz Türü: {{taciz_turu}}

3- Olay Detayı:
{{taciz_detay}}

4- Şahit Durumu: {{sahit_varmi}}

5- Delil Durumu: {{delil_durumu}}

6- Bu eylem mağdurun cinsel dokunulmazlığını ihlal etmiş ve kişilik haklarına saldırı teşkil etmiştir.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun 105. maddesi (Cinsel Taciz),
6284 sayılı Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun,
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

SUÇUN HUKUKİ NİTELİĞİ:
TCK'nun 105. maddesine göre cinsel taciz suçu:
"Bir kimseyi cinsel amaçlı olarak taciz eden kişi, şikayeti üzerine, üç aydan iki yıla kadar hapis cezası ile cezalandırılır."

KORUMA TALEBİ:
Mağdurun güvenliği için gerekli tedbirlerin alınmasını talep ederim.

TALEBİM:
1- Sanık hakkında cinsel taciz suçundan soruşturma başlatılması,
2- Mağdur güvenliğinin sağlanması,
3- Gerekli koruma tedbirlerinin alınması,
4- Delillerin toplanması,
5- Şahitlerin dinlenmesi,
6- Kanuni işlemlerin yapılması.

Mağdurun onuru ve haysiyetinin korunması için gereken hassasiyetin gösterilmesini de saygılarımla arz ederim.

{{tarih}}

{{magdur_adi}}
İmza

NOT: Bu suç şikayete bağlı olup TCK'nun 105. maddesi kapsamındadır.

EKLER:
1- Kimlik belgesi sureti
2- Mesaj/e-mail çıktıları (varsa)
3- Ses/video kayıtları (varsa)
4- Fotoğraflar (varsa)
5- Tıbbi rapor (varsa)
6- Şahit beyanlariI`
    },

    {
        id: 'sosyal-medya-hakaret-duyuru-1',
        title: 'Sosyal Medya Hakaret Suç Duyurusu',
        description: 'Sosyal medyada hakaret suçu duyurusu',
        category: 'ceza_hukuku',
        icon: '📱',
        estimatedTime: '20-30 dakika',
        complexity: 'Kolay',
        popular: true,
        tags: ['sosyal medya', 'hakaret', 'siber suç'],
        legalNote: 'Sosyal medya suçlarında delil toplama ve tespit önemlidir.',
        fields: [
            {
                id: 'cumhuriyet_savciligi_sosyal',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: İstanbul Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'magdur_adi_sosyal',
                label: 'Mağdur Adı Soyadı',
                type: 'text',
                placeholder: 'Hakarete uğrayan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'magdur_tc_sosyal',
                label: 'Mağdur T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'sanik_kullanici_adi',
                label: 'Sanığın Kullanıcı Adı/Profil',
                type: 'text',
                placeholder: 'Hakaret eden kişinin sosyal medya kullanıcı adı',
                required: true
            },
            {
                id: 'platform_adi',
                label: 'Sosyal Medya Platformu',
                type: 'select',
                required: true,
                options: [
                    'Instagram',
                    'Twitter (X)',
                    'Facebook',
                    'TikTok',
                    'YouTube',
                    'LinkedIn',
                    'WhatsApp',
                    'Telegram',
                    'Diğer'
                ]
            },
            {
                id: 'hakaret_tarihi',
                label: 'Hakaret Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'hakaret_turu_sosyal',
                label: 'Hakaret Türü',
                type: 'select',
                required: true,
                options: [
                    'Yazılı yorum/mesaj',
                    'Fotoğraf/video paylaşımı',
                    'Story/durum paylaşımı',
                    'Canlı yayında hakaret',
                    'Özel mesaj',
                    'Grup içinde hakaret',
                    'Sahte profil oluşturma',
                    'Diğer'
                ]
            },
            {
                id: 'hakaret_icerik',
                label: 'Hakaret İçeriği',
                type: 'textarea',
                placeholder: 'Hakaret içeren metni veya açıklamasını yazın...',
                required: true,
                validation: { minLength: 10, maxLength: 1500 }
            },
            {
                id: 'ekran_goruntusu',
                label: 'Ekran Görüntüsü Alındı mı?',
                type: 'select',
                required: true,
                options: [
                    'Evet, ekran görüntüsü alındı',
                    'Evet, video kaydı alındı',
                    'Hayır, sonradan silindi',
                    'Kısmen kaydedildi'
                ]
            },
            {
                id: 'etki_aciklama',
                label: 'Hakaretın Etkisi',
                type: 'textarea',
                placeholder: 'Hakaretin sizde yarattığı etkileri açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{cumhuriyet_savciligi_sosyal}}

SUÇ DUYURUSU

MAĞDUR:
Adı Soyadı: {{magdur_adi_sosyal}}
T.C. Kimlik No: {{magdur_tc_sosyal}}

SANIK:
Kullanıcı Adı/Profil: {{sanik_kullanici_adi}}
Platform: {{platform_adi}}

SUÇ KONUSU: Hakaret (TCK 125. madde)

OLAYLAR:
1- {{hakaret_tarihi}} tarihinde {{platform_adi}} sosyal medya platformunda mağdura karşı hakaret suçu işlenmiştir.

2- Hakaret Türü: {{hakaret_turu_sosyal}}

3- Hakaret İçeriği:
{{hakaret_icerik}}

4- Delil Durumu: {{ekran_goruntusu}}

5- Hakaretın Mağdur Üzerindeki Etkisi:
{{etki_aciklama}}

6- Bu eylemler mağdurun şeref ve haysiyetini rencide etmiş, kişilik haklarına saldırı teşkil etmiştir.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun 125. maddesi (Hakaret),
5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun,
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

DİJİTAL DELİL TEALEBİ:
Platform şirketinden ilgili hesap ve içerik bilgilerinin temini için gerekli işlemlerin yapılmasını talep ederim.

TALEBİM:
1- Sanık hakkında hakaret suçundan soruşturma başlatılması,
2- Sosyal medya platformundan bilgi talep edilmesi,
3- Dijital delillerin toplanması,
4- IP adresi tespiti yapılması,
5- Sanığın kimliğinin tespit edilmesi,
6- Hakaret içeriğinin kald��rılması,
7- Kanuni işlemlerin yapılması.

Sosyal medyada işlenen bu suçun gerekli ciddiyetle soruşturulmasını saygılarımla talep ederim.

{{tarih}}

{{magdur_adi_sosyal}}
İmza

EKLER:
1- Ekran görüntüleri
2- Video kayıtları (varsa)
3- URL/Link bilgileri
4- Profil bilgileri
5- Tarih/saat damgası belgesi
6- Şahit beyanları (varsa)`
    },

    {
        id: 'saglik-hata-duyuru-1',
        title: 'Sağlık Hizmet Hatası Suç Duyurusu',
        description: 'Sağlık personeli hatasına karşı suç duyurusu',
        category: 'ceza_hukuku',
        icon: '🏥',
        estimatedTime: '35-45 dakika',
        complexity: 'Zor',
        tags: ['sağlık hatası', 'malpraktis', 'suç duyurusu'],
        legalNote: 'Sağlık hataları karmaşık hukuki süreçlerdir. Uzman hekimle görüşün.',
        fields: [
            {
                id: 'cumhuriyet_savciligi_saglik',
                label: 'Cumhuriyet Savcılığı',
                type: 'text',
                placeholder: 'Örn: Ankara Cumhuriyet Başsavcılığı',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'hasta_adi',
                label: 'Hasta Adı Soyadı',
                type: 'text',
                placeholder: 'Zarar gören hastanın tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'hasta_tc_saglik',
                label: 'Hasta T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'doktor_adi',
                label: 'Doktor/Sağlık Personeli Adı',
                type: 'text',
                placeholder: 'Hata yapan sağlık personelinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'hastane_adi',
                label: 'Hastane/Sağlık Kuruluşu',
                type: 'text',
                placeholder: 'Tedavinin yapıldığı sağlık kuruluşu',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'tedavi_tarihi',
                label: 'Tedavi Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'saglik_hata_turu',
                label: 'Sağlık Hatası Türü',
                type: 'select',
                required: true,
                options: [
                    'Yanlış teşhis',
                    'Yanlış tedavi/ilaç',
                    'Ameliyat hatası',
                    'Tıbbi cihaz hatası',
                    'İhmal/gecikme',
                    'Bilgilendirilmiş onam eksikliği',
                    'Enfeksiyon bulaştırma',
                    'Anestezi hatası',
                    'Diğer'
                ]
            },
            {
                id: 'hasta_sikayeti',
                label: 'Hasta Şikayeti/Rahatsızlığı',
                type: 'textarea',
                placeholder: 'Hastanın başvuru sebebi ve şikayetleri...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'yapilan_tedavi',
                label: 'Yapılan Tedavi/Müdahale',
                type: 'textarea',
                placeholder: 'Doktor tarafından yapılan tedavi ve müdahaleleri açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1500 }
            },
            {
                id: 'olusan_zarar',
                label: 'Oluşan Zarar/Komplikasyon',
                type: 'textarea',
                placeholder: 'Hastada oluşan zarar, komplikasyon veya kötüleşme...',
                required: true,
                validation: { minLength: 50, maxLength: 1500 }
            },
            {
                id: 'uzman_gorusu',
                label: 'Başka Uzman Görüşü Alındı mı?',
                type: 'select',
                required: true,
                options: [
                    'Evet, başka doktor görüşü alındı',
                    'Evet, hastane değiştirildi',
                    'Hayır, henüz alınmadı',
                    'Evet, rapor hazırlandı'
                ]
            },
            {
                id: 'tibbi_rapor',
                label: 'Tıbbi Rapor Durumu',
                type: 'select',
                required: true,
                options: [
                    'Hastane raporu mevcut',
                    'Bağımsız doktor raporu var',
                    'Adli tıp raporu var',
                    'Henüz rapor yok',
                    'Rapor hazırlanıyor'
                ]
            }
        ],
        template: `{{cumhuriyet_savciligi_saglik}}

SUÇ DUYURUSU

MAĞDUR HASTA:
Adı Soyadı: {{hasta_adi}}
T.C. Kimlik No: {{hasta_tc_saglik}}

SANIK:
Dr. {{doktor_adi}}
Hastane: {{hastane_adi}}

SUÇ KONUSU: Taksirle Yaralama/Ölüme Sebebiyet Verme (TCK 89/85. maddeler)

OLAYLAR:
1- {{tedavi_tarihi}} tarihinde {{hastane_adi}}'nde Dr. {{doktor_adi}} tarafından hastaya uygulanan tedavide hata yapılmıştır.

2- Hasta Şikayeti:
{{hasta_sikayeti}}

3- Yapılan Tedavi:
{{yapilan_tedavi}}

4- Sağlık Hatası Türü: {{saglik_hata_turu}}

5- Oluşan Zarar:
{{olusan_zarar}}

6- Uzman Görüşü: {{uzman_gorusu}}

7- Tıbbi Rapor Durumu: {{tibbi_rapor}}

8- Doktor, mesleki özen yükümlülüğünü yerine getirmemiş ve standart tıp kurallarına aykırı davranarak hastada zarar oluşturmuştur.

HUKUKİ DAYANAK:
5237 sayılı Türk Ceza Kanunu'nun 89. maddesi (Taksirle yaralama),
5237 sayılı Türk Ceza Kanunu'nun 85. maddesi (Taksirle ölüme sebebiyet),
1219 sayılı Tababet ve Şuabatı Sanatlarının Tarzı İcrasına Dair Kanun,
5271 sayılı Ceza Muhakemesi Kanunu'nun 158 ve devamı maddeleri.

TIBBİ STANDART DEĞERLENDİRMESİ:
1- Hasta muayenesi eksik/hatalı yapılmış,
2- Teşhis süreci kurallara aykırı işletilmiş,
3- Tedavi protokolü yanlış uygulanmış,
4- Hasta bilgilendirilmesi eksik bırakılmış,
5- Tıbbi özen yükümlülüğü ihlal edilmiş.

TALEBİM:
1- Sanık doktor hakkında taksirle yaralama suçundan soruşturma başlatılması,
2- Adli Tıp Kurumu'ndan bilirkişi raporu alınması,
3- Hastane kayıtlarının incelenmesi,
4- Hasta dosyasının tam olarak temin edilmesi,
5- Tıp uzmanlarından görüş alınması,
6- Hastanın tedavi sürecinin detaylı incelenmesi,
7- Kanuni işlemlerin yapılması.

Sağlık hizmetlerinde yaşanan bu hatanın gerekli ciddiyetle soruşturulmasını saygılarımla talep ederim.

{{tarih}}

{{hasta_adi}}
İmza

EKLER:
1- Hasta dosyası
2- Taburcu raporu
3- Tetkik sonuçları
4- Reçete/ilaç listesi
5- Hastane faturaları
6- Fotoğraf belgeleri (varsa)
7- Uzman doktor raporu (varsa)
8- İlgili tıbbi belgeler`
    },

    {
        id: 'kamu-ihale-itiraz-1',
        title: 'Kamu İhale İtiraz Dilekçesi',
        description: 'Kamu ihale süreçlerine karşı itiraz başvurusu',
        category: 'idare_hukuku',
        icon: '📊',
        estimatedTime: '30-40 dakika',
        complexity: 'Zor',
        tags: ['kamu ihale', 'itiraz', 'KİK'],
        legalNote: 'Kamu ihale itirazları kesin sürelere tabidir. Acilen başvurulmalıdır.',
        fields: [
            {
                id: 'kamu_ihale_kurumu',
                label: 'Kamu İhale Kurumu/İdaresi',
                type: 'text',
                placeholder: 'İhaleyi yapan kurum adı',
                required: true,
                validation: { minLength: 5, maxLength: 200 }
            },
            {
                id: 'itirazci_firma',
                label: 'İtirazçı Firma Unvanı',
                type: 'text',
                placeholder: 'İtiraz eden firmanın unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'ihale_konusu',
                label: 'İhale Konusu',
                type: 'textarea',
                placeholder: 'İhalenin konusu ve kapsamı...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'ihale_no',
                label: 'İhale Numarası',
                type: 'text',
                placeholder: 'İhale dosya/kayıt numarası',
                required: true
            },
            {
                id: 'ihale_tarihi',
                label: 'İhale Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'ihale_usulu',
                label: 'İhale Usulü',
                type: 'select',
                required: true,
                options: [
                    'Açık ihale usulü',
                    'Belli istekliler arası ihale',
                    'Pazarlık usulü',
                    'Doğrudan temin',
                    'Tasarım yarışması',
                    'Çerçeve anlaşma'
                ]
            },
            {
                id: 'itiraz_konusu_ihale',
                label: 'İtiraz Konusu',
                type: 'select',
                required: true,
                options: [
                    'İhale şartnamesi hukuka aykırı',
                    'Tekliflerin değerlendirilmesi',
                    'İhale kararı hatalı',
                    'Yeterlilik kriterları hatalı',
                    'Fiyat değerlendirmesi yanlış',
                    'Usul hatası var',
                    'Eşit davranma ilkesi ihlali',
                    'Diğer'
                ]
            },
            {
                id: 'ihaleden_men_durumu',
                label: 'İhaleden Men Durumu',
                type: 'select',
                required: true,
                options: [
                    'İtirazçı ihaleye katıldı',
                    'İtirazçı ihaleye katılamadı',
                    'İtirazçı ihalede men edildi',
                    'İtirazçı şartları sağlayamadı'
                ]
            },
            {
                id: 'itiraz_gerekce_ihale',
                label: 'İtiraz Gerekçesi',
                type: 'textarea',
                placeholder: 'İtirazınızın detaylı hukuki gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 150, maxLength: 2500 }
            },
            {
                id: 'istenen_islem',
                label: 'İstenen İşlem',
                type: 'select',
                required: true,
                options: [
                    'İhalenin iptali',
                    'İhalenin yeniden yapılması',
                    'Değerlendirmenin yenilenmesi',
                    'Şartnamenin düzeltilmesi',
                    'İhale kararının değiştirilmesi'
                ]
            }
        ],
        template: `KAMU İHALE KURUMU
{{tarih}}

İTİRAZ DİLEKÇESİ

İTİRAZCI:
{{itirazci_firma}}

İDARE:
{{kamu_ihale_kurumu}}

İHALE BİLGİLERİ:
İhale Konusu: {{ihale_konusu}}
İhale No: {{ihale_no}}
İhale Tarihi: {{ihale_tarihi}}
İhale Usulü: {{ihale_usulu}}

4734 sayılı Kamu İhale Kanunu'nun 54. maddesi uyarınca aşağıda belirtilen gerekçelerle itirazımı beyan ederim.

İTİRAZ KONUSU: {{itiraz_konusu_ihale}}

İTİRAZCI DURUMU: {{ihaleden_men_durumu}}

İTİRAZ GEREKÇESİ:
{{itiraz_gerekce_ihale}}

HUKUKİ DAYANAK:
4734 sayılı Kamu İhale Kanunu'nun 54, 55, 56 maddeleri,
Kamu İhale Sözleşmeleri Kanunu,
Kamu İhale Genel Şartnamesi,
İlgili yönetmelik ve tebliğler.

KAMU İHALE İLKELERİ AÇISINDAN DEĞERLENDİRME:
1- Saydamlık ilkesi ihlal edilmiştir,
2- Rekabet ortamı zedelenmiştir,
3- Eşit davranma ilkesi çiğnenmiştir,
4- Güvenilirlik ve tarafsızlık sağlanmamıştır,
5- Etkinlik ve verimlilik gözetilmemiştir.

TALEBİM: {{istenen_islem}}

Bu itirazımın 4734 sayılı KİK'nun 54. maddesi uyarınca incelenmesini ve kabulü ile {{istenen_islem}} kararı verilmesini saygılarımla talep ederim.

{{tarih}}

{{itirazci_firma}}
[Yetkili İmza ve Kaşe]

EKLER:
1- İhale şartnamesi
2- Teklif dosyası
3- İhale tutanağı
4- Değerlendirme raporu
5- İhale kararı
6- İlgili yazışmalar
7- Hukuki dayanaklar
8- Emsal kararlar (varsa)

ACELE KAYDI:
Bu itiraz 4734 sayılı Kanun'un 54. maddesi uyarınca kesin süre içerisinde yapılmıştır.`
    },

    {
        id: 'imar-plani-itiraz-1',
        title: 'İmar Planı İtiraz Dilekçesi',
        description: 'İmar planı değişikliğine karşı itiraz başvurusu',
        category: 'idare_hukuku',
        icon: '🏘️',
        estimatedTime: '30-40 dakika',
        complexity: 'Zor',
        tags: ['imar planı', 'itiraz', 'belediye'],
        legalNote: 'İmar planı itirazları 30 günlük kesin süreye tabidir.',
        fields: [
            {
                id: 'imar_plani_itiraz_belediye',
                label: 'Belediye/Büyükşehir Belediyesi',
                type: 'text',
                placeholder: 'Örn: Ankara Büyükşehir Belediyesi',
                required: true,
                validation: { minLength: 10, maxLength: 150 }
            },
            {
                id: 'itirazci_adi_imar',
                label: 'İtirazçı Adı/Unvanı',
                type: 'text',
                placeholder: 'İtiraz eden kişi/kurum adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'plan_onay_tarihi',
                label: 'Plan Onay Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'plan_turu',
                label: 'Plan Türü',
                type: 'select',
                required: true,
                options: [
                    'Nazım imar planı',
                    'Uygulama imar planı',
                    'Revizyon planı',
                    'İlave imar planı',
                    'Koruma amaçlı imar planı'
                ]
            },
            {
                id: 'etkilenen_parseller',
                label: 'Etkilenen Parsel/Bölge',
                type: 'textarea',
                placeholder: 'İmar planından etkilenen alanın tarifi...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'itiraz_gerekce_imar',
                label: 'İtiraz Gerekçesi',
                type: 'textarea',
                placeholder: 'İmar planına itirazınızın detaylı gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{imar_plani_itiraz_belediye}}

İMAR PLANI İTİRAZ DİLEKÇESİ

İTİRAZCI:
{{itirazci_adi_imar}}

İmar Planı Onay Tarihi: {{plan_onay_tarihi}}
Plan Türü: {{plan_turu}}

Etkilenen Alan: {{etkilenen_parseller}}

3194 sayılı İmar Kanunu uyarınca yukarıda belirtilen imar planına itirazımı beyan ederim.

İTİRAZ GEREKÇESİ:
{{itiraz_gerekce_imar}}

HUKUKİ DAYANAK:
3194 sayılı İmar Kanunu, Planlama mevzuatı.

TALEBİM:
İmar planının iptali veya değiştirilmesini talep ederim.

{{tarih}}

{{itirazci_adi_imar}}
İmza`
    },

    {
        id: 'vergi-dava-1',
        title: 'Vergi Davası Dilekçesi',
        description: 'Vergi mahkemesinde vergi davası açma',
        category: 'idare_hukuku',
        icon: '💼',
        estimatedTime: '30-40 dakika',
        complexity: 'Zor',
        tags: ['vergi davası', 'vergi mahkemesi', 'mali'],
        legalNote: 'Vergi davaları teknik uzmanlık gerektirir.',
        fields: [
            {
                id: 'vergi_mahkemesi',
                label: 'Vergi Mahkemesi',
                type: 'text',
                placeholder: 'Örn: Ankara 1. Vergi Mahkemesi',
                required: true,
                validation: { minLength: 10, maxLength: 100 }
            },
            {
                id: 'davaci_vergi',
                label: 'Davacı Adı/Unvanı',
                type: 'text',
                placeholder: 'Vergi mükellefi adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'davali_vergi_dairesi',
                label: 'Davalı Vergi Dairesi',
                type: 'text',
                placeholder: 'Vergi dairesi adı',
                required: true,
                validation: { minLength: 5, maxLength: 100 }
            },
            {
                id: 'vergi_turu_dava',
                label: 'Vergi Türü',
                type: 'select',
                required: true,
                options: [
                    'Gelir Vergisi',
                    'Kurumlar Vergisi',
                    'KDV',
                    'ÖTV',
                    'MTV',
                    'Emlak Vergisi',
                    'Damga Vergisi',
                    'Diğer'
                ]
            },
            {
                id: 'dava_konusu_miktar',
                label: 'Dava Konusu Miktar (TL)',
                type: 'number',
                placeholder: 'Dava konusu vergi miktarı',
                required: true
            },
            {
                id: 'vergi_dava_gerekce',
                label: 'Dava Gerekçesi',
                type: 'textarea',
                placeholder: 'Vergi davasının detaylı gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `{{vergi_mahkemesi}}

DAVA DİLEKÇESİ

DAVACI:
{{davaci_vergi}}

DAVALI:
{{davali_vergi_dairesi}}

DAVA KONUSU: {{dava_konusu_miktar}} TL {{vergi_turu_dava}} Davası

213 sayılı Vergi Usul Kanunu ve ilgili mevzuat uyarınca açılan bu davada;

DAVA GEREKÇESİ:
{{vergi_dava_gerekce}}

HUKUKİ DAYANAK:
213 sayılı Vergi Usul Kanunu, İlgili vergi kanunları.

TALEBİM:
Vergi tarhiyatının iptali ve gerekli işlemlerin yapılmasını talep ederim.

{{tarih}}

{{davaci_vergi}}
İmza`
    },

    {
        id: 'miras-paylaşım-1',
        title: 'Miras Paylaşım Anlaşması',
        description: 'Mirasçılar arası paylaşım anlaşması',
        category: 'aile_hukuku',
        icon: '📋',
        estimatedTime: '25-35 dakika',
        complexity: 'Orta',
        tags: ['miras', 'paylaşım', 'anlaşma'],
        legalNote: 'Miras paylaşımında noter onayı gereklidir.',
        fields: [
            {
                id: 'muvaris_adi_anlaşma',
                label: 'Müteveffa Adı',
                type: 'text',
                placeholder: 'Ölen kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'mirasci1_adi',
                label: '1. Mirasçı Adı',
                type: 'text',
                placeholder: 'Birinci mirasçının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'mirasci2_adi',
                label: '2. Mirasçı Adı',
                type: 'text',
                placeholder: 'İkinci mirasçının tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'tereke_detay',
                label: 'Tereke Detayı',
                type: 'textarea',
                placeholder: 'Paylaşılacak mal varlığının detaylı listesi...',
                required: true,
                validation: { minLength: 100, maxLength: 1000 }
            },
            {
                id: 'paylaşım_detay',
                label: 'Paylaşım Detayı',
                type: 'textarea',
                placeholder: 'Malların nasıl paylaşılacağını açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `MİRAS PAYLAŞIM ANLAŞMASI

Aşağıda kimlik bilgileri yazılı mirasçılar, {{muvaris_adi_anlaşma}} isimli müteveffanın terekesini aşağıda belirtilen şekilde paylaşmayı kararlaştırmışlardır.

MİRASÇILAR:
1- {{mirasci1_adi}}
2- {{mirasci2_adi}}

TEREKE:
{{tereke_detay}}

PAYLAŞIM:
{{paylaşım_detay}}

Bu anlaşma ile taraflar hiçbir hak iddia etmeyeceklerini beyan ederler.

{{tarih}}

{{mirasci1_adi}}          {{mirasci2_adi}}
İmza                      İmza`
    },

    {
        id: 'kefalet-sozlesme-1',
        title: 'Kefalet Sözleşmesi',
        description: 'Borç için kefalet sözleşmesi düzenleme',
        category: 'borçlar_hukuku',
        icon: '🤝',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        tags: ['kefalet', 'borç', 'garanti'],
        legalNote: 'Kefalet sözleşmeleri yazılı olmalı ve kefilin sorumluluğu açık belirtilmelidir.',
        fields: [
            {
                id: 'kefil_adi',
                label: 'Kefil Adı Soyadı',
                type: 'text',
                placeholder: 'Kefil olan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'borclu_adi_kefalet',
                label: 'Borçlu Adı Soyadı',
                type: 'text',
                placeholder: 'Asıl borçlunun tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'alacakli_adi_kefalet',
                label: 'Alacaklı Adı/Unvanı',
                type: 'text',
                placeholder: 'Alacaklının tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'kefalet_miktari',
                label: 'Kefalet Miktarı (TL)',
                type: 'number',
                placeholder: 'Kefil olunan miktar',
                required: true
            },
            {
                id: 'kefalet_turu',
                label: 'Kefalet Türü',
                type: 'select',
                required: true,
                options: [
                    'Adi kefalet',
                    'Müteselsil kefalet',
                    'Sınırlı kefalet',
                    'Sınırsız kefalet'
                ]
            },
            {
                id: 'kefalet_sebebi',
                label: 'Kefalet Sebebi',
                type: 'textarea',
                placeholder: 'Kefalete konu borcun detayları...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `KEFALET SÖZLEŞMESİ

KEFİL:
{{kefil_adi}}

BORÇLU:
{{borclu_adi_kefalet}}

ALACAKLI:
{{alacakli_adi_kefalet}}

Yukarıda kimliği yazılı kefil, {{borclu_adi_kefalet}} isimli borçlunun {{alacakli_adi_kefalet}}'ya olan borcuna {{kefalet_turu}} şeklinde kefil olmayı kabul eder.

KEFALET MİKTARI: {{kefalet_miktari}} TL

KEFALET SEBEBİ:
{{kefalet_sebebi}}

KEFALET ŞARTLARI:
1- Bu kefalet {{kefalet_turu}}'dir
2- Kefil, asıl borçlu ile birlikte sorumludur
3- Kefalet miktarı {{kefalet_miktari}} TL ile sınırlıdır

6098 sayılı TBK'nun kefalet hükümlerince düzenlenen bu sözleşme taraflarca kabul edilmiştir.

{{tarih}}

{{kefil_adi}}              {{alacakli_adi_kefalet}}
Kefil İmza                 Alacaklı İmza`
    },

    {
        id: 'sgk-baglama-1',
        title: 'SGK Bağlama Bildirimi',
        description: 'Sosyal güvenlik kurumuna işçi bağlama bildirimi',
        category: 'is_hukuku',
        icon: '👷',
        estimatedTime: '15-25 dakika',
        complexity: 'Kolay',
        tags: ['SGK', 'işçi', 'bağlama'],
        legalNote: 'İşe giriş bildirimi yasal süreler içinde yapılmalıdır.',
        fields: [
            {
                id: 'isveren_unvan_sgk',
                label: 'İşveren Unvanı',
                type: 'text',
                placeholder: 'Şirket/işveren unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'isci_adi_sgk',
                label: 'İşçi Adı Soyadı',
                type: 'text',
                placeholder: 'İşe alınan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'isci_tc_sgk',
                label: 'İşçi T.C. Kimlik No',
                type: 'text',
                placeholder: '11 haneli kimlik numarası',
                required: true,
                validation: { pattern: '\\d{11}' }
            },
            {
                id: 'ise_giris_tarihi_sgk',
                label: 'İşe Giriş Tarihi',
                type: 'date',
                required: true
            },
            {
                id: 'pozisyon_sgk',
                label: 'Pozisyon/Görev',
                type: 'text',
                placeholder: 'İşçinin görev tanımı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'maas_sgk',
                label: 'Aylık Maaş (TL)',
                type: 'number',
                placeholder: 'Brüt aylık maaş',
                required: true
            },
            {
                id: 'calisma_sekli',
                label: 'Çalışma Şekli',
                type: 'select',
                required: true,
                options: [
                    'Tam zamanlı',
                    'Yarı zamanlı',
                    'Geçici',
                    'Dönemsel',
                    'Proje bazlı'
                ]
            }
        ],
        template: `SOSYAL GÜVENLİK KURUMU
{{tarih}}

İŞÇİ BAĞLAMA BİLDİRİMİ

İŞVEREN BİLGİLERİ:
Unvan: {{isveren_unvan_sgk}}

İŞÇİ BİLGİLERİ:
Adı Soyadı: {{isci_adi_sgk}}
T.C. Kimlik No: {{isci_tc_sgk}}
İşe Giriş Tarihi: {{ise_giris_tarihi_sgk}}
Pozisyon: {{pozisyon_sgk}}
Aylık Maaş: {{maas_sgk}} TL
Çalışma Şekli: {{calisma_sekli}}

5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu uyarınca yukarıda kimliği belirtilen işçinin işe alındığını bildiririm.

İşçinin sigortalılığının başlatılmasını talep ederim.

{{tarih}}

{{isveren_unvan_sgk}}
[Yetkili İmza ve Kaşe]`
    },

    {
        id: 'noter-satis-1',
        title: 'Noter Huzurunda Satış Sözleşmesi',
        description: 'Taşınır mal için noter huzurunda satış sözleşmesi',
        category: 'borçlar_hukuku',
        icon: '📝',
        estimatedTime: '20-30 dakita',
        complexity: 'Orta',
        tags: ['satış', 'noter', 'sözleşme'],
        legalNote: 'Yüksek değerli satışlarda noter onayı güvenlik sağlar.',
        fields: [
            {
                id: 'satici_adi_noter',
                label: 'Satıcı Adı Soyadı',
                type: 'text',
                placeholder: 'Satan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'alici_adi_noter',
                label: 'Alıcı Adı Soyadı',
                type: 'text',
                placeholder: 'Alan kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'mal_tanimi',
                label: 'Mal Tanımı',
                type: 'textarea',
                placeholder: 'Satılacak malın detaylı tanımı...',
                required: true,
                validation: { minLength: 20, maxLength: 500 }
            },
            {
                id: 'satis_fiyati',
                label: 'Satış Fiyatı (TL)',
                type: 'number',
                placeholder: 'Anlaşılan satış fiyatı',
                required: true
            },
            {
                id: 'odeme_sekli',
                label: 'Ödeme Şekli',
                type: 'select',
                required: true,
                options: [
                    'Peşin ödeme',
                    'Taksitli ödeme',
                    'Banka kredisi',
                    'Çek ile ödeme',
                    'Karma ödeme'
                ]
            },
            {
                id: 'teslim_tarihi',
                label: 'Teslim Tarihi',
                type: 'date',
                required: true
            }
        ],
        template: `SATIŞ SÖZLEŞMESİ

SATICI:
{{satici_adi_noter}}

ALICI:
{{alici_adi_noter}}

Yukarıda kimliği yazılı taraflar arasında aşağıdaki mal için satış sözleşmesi düzenlenmiştir.

SATIŞ KONUSU:
{{mal_tanimi}}

SATIŞ FİYATI: {{satis_fiyati}} TL

ÖDEME ŞEKLİ: {{odeme_sekli}}

TESLİM TARİHİ: {{teslim_tarihi}}

SÖZLEŞME ŞARTLARI:
1- Mal ayıpsız ve sözleşmeye uygun teslim edilecektir
2- Mülkiyet bedelin tamamının ödenmesi ile geçer
3- Hasar riski teslim ile alıcıya geçer

6098 sayılı TBK hükümlerine göre düzenlenen bu sözleşme taraflar tarafından kabul edilmiştir.

{{tarih}}

{{satici_adi_noter}}        {{alici_adi_noter}}
Satıcı İmza                 Alıcı İmza

NOTER ONAYI:
[Noter onay alanı]`
    },

    {
        id: 'itfa-talep-1',
        title: 'Borç İtfa Talebi',
        description: 'Borçlara karşı itfa planı teklifi',
        category: 'borçlar_hukuku',
        icon: '💳',
        estimatedTime: '15-25 dakika',
        complexity: 'Orta',
        tags: ['borç', 'itfa', 'ödeme planı'],
        legalNote: 'İtfa planları alacaklının kabulüne bağlıdır.',
        fields: [
            {
                id: 'borclu_adi_itfa',
                label: 'Borçlu Adı/Unvanı',
                type: 'text',
                placeholder: 'Borçlunun tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'alacakli_adi_itfa',
                label: 'Alacaklı Adı/Unvanı',
                type: 'text',
                placeholder: 'Alacaklının tam adı/unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'toplam_borc_itfa',
                label: 'Toplam Borç Miktarı (TL)',
                type: 'number',
                placeholder: 'Ödenecek toplam borç',
                required: true
            },
            {
                id: 'teklif_miktar',
                label: 'Teklif Edilen Miktar (TL)',
                type: 'number',
                placeholder: 'İtfa için önerilen miktar',
                required: true
            },
            {
                id: 'odeme_plani_itfa',
                label: 'Ödeme Planı',
                type: 'textarea',
                placeholder: 'Ödeme planını detaylı açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            },
            {
                id: 'itfa_gerekce',
                label: 'İtfa Gerekçesi',
                type: 'textarea',
                placeholder: 'İtfa talebinin gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            }
        ],
        template: `BORÇ İTFA TALEBİ

BORÇLU:
{{borclu_adi_itfa}}

ALACAKLI:
{{alacakli_adi_itfa}}

{{tarih}} tarihi itibariyle;

TOPLAM BORÇ: {{toplam_borc_itfa}} TL
TEKLİF EDİLEN MIKTAR: {{teklif_miktar}} TL

ÖDEME PLANI:
{{odeme_plani_itfa}}

İTFA GEREKÇESİ:
{{itfa_gerekce}}

6098 sayılı TBK'nun 114 ve devamı maddeleri uyarınca borçların itfası için bu teklifi sunuyorum.

Bu teklifin kabulü halinde kalan borçtan feragat edileceğini ve ibra belgesi düzenleneceğini arz ederim.

{{tarih}}

{{borclu_adi_itfa}}
İmza

ALACAKLI CEVABI:
( ) Kabul ediyorum
( ) Kabul etmiyorum

{{alacakli_adi_itfa}}
İmza`
    },

    {
        id: 'enerji-sikayet-1',
        title: 'Enerji Şirketi Şikayet Dilekçesi',
        description: 'Elektrik/doğalgaz şirketine şikayet başvurusu',
        category: 'idare_hukuku',
        icon: '⚡',
        estimatedTime: '15-20 dakika',
        complexity: 'Kolay',
        tags: ['enerji', 'elektrik', 'doğalgaz', 'şikayet'],
        legalNote: 'Enerji şikayetleri için önce şirkete başvuru yapılmalıdır.',
        fields: [
            {
                id: 'enerji_sirketi',
                label: 'Enerji Şirketi',
                type: 'select',
                required: true,
                options: [
                    'TEDAŞ',
                    'BEDAŞ',
                    'AYEDAŞ',
                    'İGDAŞ',
                    'BOTAŞ',
                    'Diğer'
                ]
            },
            {
                id: 'abone_adi_enerji',
                label: 'Abone Adı Soyadı',
                type: 'text',
                placeholder: 'Abonenin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'abone_no_enerji',
                label: 'Abone Numarası',
                type: 'text',
                placeholder: 'Enerji abone numarası',
                required: true
            },
            {
                id: 'hizmet_adresi',
                label: 'Hizmet Adresi',
                type: 'textarea',
                placeholder: 'Hizmet verilen tam adres',
                required: true,
                validation: { minLength: 20, maxLength: 300 }
            },
            {
                id: 'sikayet_konusu_enerji',
                label: 'Şikayet Konusu',
                type: 'select',
                required: true,
                options: [
                    'Fatura hatası',
                    'Hizmet kesintisi',
                    'Sayaç sorunu',
                    'Bağlantı problemi',
                    'Müşteri hizmetleri',
                    'Kalite sorunu',
                    'Diğer'
                ]
            },
            {
                id: 'sikayet_detay_enerji',
                label: 'Şikayet Detayı',
                type: 'textarea',
                placeholder: 'Yaşadığınız sorunu detaylı açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1500 }
            }
        ],
        template: `{{enerji_sirketi}} ŞİRKETİ

ENERJİ HİZMET ŞİKAYETİ

ABONE BİLGİLERİ:
Adı Soyadı: {{abone_adi_enerji}}
Abone No: {{abone_no_enerji}}
Hizmet Adresi: {{hizmet_adresi}}

ŞİKAYET KONUSU: {{sikayet_konusu_enerji}}

ŞİKAYET DETAYI:
{{sikayet_detay_enerji}}

4628 sayılı Elektrik Piyasası Kanunu ve 4646 sayılı Doğalgaz Piyasası Kanunu uyarınca şikayetimin incelenmesini talep ederim.

TALEBİM:
Sorunun çözülmesi ve hizmet kalitesinin artırılmasını talep ederim.

{{tarih}}

{{abone_adi_enerji}}
İmza`
    },

    {
        id: 'telif-ihlal-duyuru-1',
        title: 'Telif Hakkı İhlali Duyurusu',
        description: 'Telif hakkı ihlali nedeniyle hukuki uyarı',
        category: 'ticaret_hukuku',
        icon: '©️',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        tags: ['telif', 'copyright', 'fikri mülkiyet'],
        legalNote: 'Telif hakları uluslararası korumaları olan haklardır.',
        fields: [
            {
                id: 'hak_sahibi_adi',
                label: 'Hak Sahibi Adı/Unvanı',
                type: 'text',
                placeholder: 'Telif hakkı sahibinin adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'ihlal_eden_adi',
                label: 'İhlal Eden Kişi/Kurum',
                type: 'text',
                placeholder: 'İhlali yapan kişi/kurum adı',
                required: true,
                validation: { minLength: 2, maxLength: 150 }
            },
            {
                id: 'eser_adi',
                label: 'Eser Adı',
                type: 'text',
                placeholder: 'Telif hakları ihlal edilen eserin adı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'eser_turu_telif',
                label: 'Eser Türü',
                type: 'select',
                required: true,
                options: [
                    'Yazılı eser (kitap, makale)',
                    'Müzik eseri',
                    'Görsel eser (fotoğraf, resim)',
                    'Video/film',
                    'Yazılım',
                    'Tasarım eseri',
                    'Diğer'
                ]
            },
            {
                id: 'ihlal_sekli',
                label: 'İhlal Şekli',
                type: 'textarea',
                placeholder: 'Telif hakkı ihlalinin nasıl gerçekleştiğini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            },
            {
                id: 'tazminat_talep_telif',
                label: 'Tazminat Talebi (TL)',
                type: 'number',
                placeholder: 'Talep edilen tazminat miktarı',
                required: false
            }
        ],
        template: `TELİF HAKKI İHLALİ UYARISI

HAK SAHİBİ:
{{hak_sahibi_adi}}

İHLAL EDEN:
{{ihlal_eden_adi}}

5846 sayılı Fikir ve Sanat Eserleri Kanunu uyarınca;

İHLAL KONUSU ESER:
Eser Adı: {{eser_adi}}
Eser Türü: {{eser_turu_telif}}

İHLAL DETAYI:
{{ihlal_sekli}}

Bu uyarımızla birlikte;
1- İhlali derhal durdurmanızı,
2- İhlal içeren materyalleri kaldırmanızı,
3- Telif haklarımıza saygı göstermenizi,
4- Yasal yollarımızı saklı tuttuğumuzu

{{#tazminat_talep_telif}}
5- {{tazminat_talep_telif}} TL tazminat talep ettiğimizi
{{/tazminat_talep_telif}}

bildiririz.

Bu uyarıdan sonra devam eden ihlal durumunda hukuki ve cezai yollarımızı kullanacağımızı arz ederiz.

{{tarih}}

{{hak_sahibi_adi}}
İmza`
    },

    {
        id: 'dis-ticaret-sikayet-1',
        title: 'Dış Ticaret Şikayeti',
        description: 'İhracat/ithalat işlemlerinde yaşanan sorunlar için şikayet',
        category: 'ticaret_hukuku',
        icon: '🌍',
        estimatedTime: '25-35 dakika',
        complexity: 'Zor',
        tags: ['dış ticaret', 'ihracat', 'ithalat'],
        legalNote: 'Dış ticaret işlemleri uluslararası kurallara tabidir.',
        fields: [
            {
                id: 'sikayetci_firma_dis',
                label: 'Şikayetçi Firma Unvanı',
                type: 'text',
                placeholder: 'Şikayet eden firmanın unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'sikayet_edilen_firma',
                label: 'Şikayet Edilen Firma',
                type: 'text',
                placeholder: 'Sorun yaşanan firmanın unvanı',
                required: true,
                validation: { minLength: 2, maxLength: 200 }
            },
            {
                id: 'islem_turu_dis',
                label: 'İşlem Türü',
                type: 'select',
                required: true,
                options: [
                    'İhracat',
                    'İthalat',
                    'Transit ticaret',
                    'Gümrük işlemi',
                    'Kambiyo işlemi',
                    'Lojistik hizmet'
                ]
            },
            {
                id: 'ulke_dis',
                label: 'İlgili Ülke',
                type: 'text',
                placeholder: 'Ticaretin yapıldığı ülke',
                required: true
            },
            {
                id: 'sikayet_konusu_dis',
                label: 'Şikayet Konusu',
                type: 'select',
                required: true,
                options: [
                    'Ödeme yapılmadı',
                    'Mal teslim edilmedi',
                    'Kalite sorunu',
                    'Gümrük problemi',
                    'Nakliye sorunu',
                    'Belge eksikliği',
                    'Sözleşme ihlali',
                    'Diğer'
                ]
            },
            {
                id: 'islem_tutari_dis',
                label: 'İşlem Tutarı (USD)',
                type: 'number',
                placeholder: 'Ticaret tutarı USD cinsinden',
                required: true
            },
            {
                id: 'sikayet_detay_dis',
                label: 'Şikayet Detayı',
                type: 'textarea',
                placeholder: 'Yaşanan sorunu detaylı açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 2000 }
            }
        ],
        template: `DIŞ TİCARET ŞİKAYETİ

ŞİKAYETÇİ FİRMA:
{{sikayetci_firma_dis}}

ŞİKAYET EDİLEN FİRMA:
{{sikayet_edilen_firma}}

TİCARET BİLGİLERİ:
İşlem Türü: {{islem_turu_dis}}
İlgili Ülke: {{ulke_dis}}
İşlem Tutarı: {{islem_tutari_dis}} USD

ŞİKAYET KONUSU: {{sikayet_konusu_dis}}

ŞİKAYET DETAYI:
{{sikayet_detay_dis}}

Bu dış ticaret işleminde yaşanan sorunların çözülmesi için;

1- Uluslararası Ticaret Odası kuralları,
2- INCOTERMS kuralları,
3- İlgili ülke mevzuatı,
4- Uluslararası sözleşmeler

çerçevesinde gerekli işlemlerin yapılmasını talep ederim.

TALEBİM:
Sorunun çözülmesi ve hakkımın korunması için gerekli işlemlerin yapılması.

{{tarih}}

{{sikayetci_firma_dis}}
[Yetkili İmza ve Kaşe]`
    },

    {
        id: 'ceza-infaz-dilekce-1',
        title: 'Ceza İnfaz Dilekçesi',
        description: 'Ceza infaz kurumuna başvuru dilekçesi',
        category: 'ceza_hukuku',
        icon: '🏛️',
        estimatedTime: '20-30 dakika',
        complexity: 'Orta',
        tags: ['ceza infaz', 'cezaevi', 'dilekçe'],
        legalNote: 'Ceza infaz hakları yasalarla korumalı haklardır.',
        fields: [
            {
                id: 'ceza_infaz_kurumu',
                label: 'Ceza İnfaz Kurumu',
                type: 'text',
                placeholder: 'Örn: Ankara E Tipi Kapalı Ceza İnfaz Kurumu',
                required: true,
                validation: { minLength: 10, maxLength: 150 }
            },
            {
                id: 'hukumlu_adi',
                label: 'Hükümlü/Tutuklu Adı',
                type: 'text',
                placeholder: 'Başvuran kişinin tam adı',
                required: true,
                validation: { minLength: 2, maxLength: 100 }
            },
            {
                id: 'dosya_no_ceza',
                label: 'Dosya/Sicil Numarası',
                type: 'text',
                placeholder: 'İnfaz dosya numarası',
                required: true
            },
            {
                id: 'basvuru_konusu',
                label: 'Başvuru Konusu',
                type: 'select',
                required: true,
                options: [
                    'Sağlık sorunu',
                    'Ziyaret talebi',
                    'Çalışma talebi',
                    'Eğitim talebi',
                    'Nakil talebi',
                    'Şikayet',
                    'Diğer'
                ]
            },
            {
                id: 'basvuru_gerekce_ceza',
                label: 'Başvuru Gerekçesi',
                type: 'textarea',
                placeholder: 'Başvurunuzun detaylı gerekçelerini açıklayın...',
                required: true,
                validation: { minLength: 100, maxLength: 1500 }
            },
            {
                id: 'istenen_islem_ceza',
                label: 'İstenen İşlem',
                type: 'textarea',
                placeholder: 'Ne yapılmasını istediğinizi açıklayın...',
                required: true,
                validation: { minLength: 50, maxLength: 1000 }
            }
        ],
        template: `{{ceza_infaz_kurumu}}

DİLEKÇE

BAŞVURAN:
{{hukumlu_adi}}
Dosya No: {{dosya_no_ceza}}

BAŞVURU KONUSU: {{basvuru_konusu}}

5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun uyarınca;

BAŞVURU GEREKÇESİ:
{{basvuru_gerekce_ceza}}

İSTENEN İŞLEM:
{{istenen_islem_ceza}}

HUKUKİ DAYANAK:
5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun,
Ceza İnfaz Kurumları Yönetmeliği.

Yukarıda belirtilen konudaki talebimin değerlendirilmesini saygılarımla arz ederim.

{{tarih}}

{{hukumlu_adi}}
İmza`
    }
];

// Ana şablon listesini güncelle
export const allDocumentTemplates = [...documentTemplates, ...additionalTemplates];