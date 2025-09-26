import { WizardState, WizardTemplate, WizardAnswers } from '@/types/wizard';

export interface ProfessionalDocumentResult {
    success: boolean;
    content?: string;
    filename?: string;
    metadata?: DocumentMetadata;
    error?: string;
}

export interface DocumentMetadata {
    documentType: string;
    createdDate: string;
    caseNumber?: string;
    parties: {
        applicant?: string;
        defendant?: string;
    };
    legalBasis: string[];
    attachments: string[];
}

export class ProfessionalDocumentGenerator {
    /**
     * Generate professional legal document from wizard state
     */
    static generateDocument(
        template: WizardTemplate,
        state: WizardState
    ): ProfessionalDocumentResult {
        try {
            const content = this.generateProfessionalContent(template, state);
            const filename = this.generateProfessionalFilename(template, state);
            const metadata = this.generateDocumentMetadata(template, state);

            return {
                success: true,
                content,
                filename,
                metadata
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Belge oluşturulurken hata oluştu'
            };
        }
    }

    /**
     * Generate professional legal document content
     */
    private static generateProfessionalContent(
        template: WizardTemplate,
        state: WizardState
    ): string {
        const { answers } = state;

        if (template.id === 'kira-itiraz-v1') {
            return this.generateRentDisputePetition(answers);
        }

        if (template.id === 'simple-kira-sozlesmesi-v1') {
            return this.generateProfessionalRentalAgreement(answers);
        }

        return this.generateDefaultLegalDocument(template, answers);
    }

    /**
     * Generate comprehensive rent dispute petition (LawDepot quality)
     */
    private static generateRentDisputePetition(answers: WizardAnswers): string {
        const kiracı = answers.step1 || {};
        const mülk = answers.step2 || {};
        const evSahibi = answers.step3 || {};
        const mevcut = answers.step4 || {};
        const artırım = answers.step5 || {};
        const itiraz = answers.step6 || {};
        const talep = answers.step7 || {};

        const today = new Date();
        const documentDate = today.toLocaleDateString('tr-TR');
        const documentTime = today.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const caseNumber = this.generateCaseNumber();

        return `
                           KİRA ARTIRIMI İTİRAZ DİLEKÇESİ
                              (6098 Sayılı TBK md. 344-347)

BELGE NO: ${caseNumber}
TARİH: ${documentDate} ${documentTime}

═══════════════════════════════════════════════════════════════════

                                    TARAFLAR

BAŞVURUCU (KİRACI):

Ad Soyad        : ${kiracı.kiracı_ad || '[AD SOYAD]'}
T.C. Kimlik No  : ${kiracı.kiracı_tc || '[TC KIMLIK NO]'}
İkamet Adresi   : ${kiracı.kiracı_adres || '[İKAMET ADRESİ]'}
Telefon         : ${kiracı.kiracı_tel || '[TELEFON]'}
E-posta         : ${kiracı.kiracı_email || '[E-POSTA]'}

KARŞI TARAF (EV SAHİBİ/KİRALAYAN):

Ad Soyad        : ${evSahibi.ev_sahibi_ad || '[EV SAHİBİ ADI]'}
Adresi          : ${evSahibi.ev_sahibi_adres || '[EV SAHİBİ ADRESİ]'}
Telefon         : ${evSahibi.ev_sahibi_tel || '[TELEFON]'}

═══════════════════════════════════════════════════════════════════

                               KONU VE TALEP

KONU: Kira artırımına itiraz ve uygun artırım oranının belirlenmesi talebi

DAYANAK HÜKÜMLER:
- 6098 Sayılı Türk Borçlar Kanunu md. 344, 345, 346, 347
- 6570 Sayılı Kira Artış Oranları Hakkında Kanun
- Yargıtay İçtihatları (HGK 2019/6-617 E., 2020/1051 K.)

═══════════════════════════════════════════════════════════════════

                                 VAKIALAR

MADDE 1 - TAŞINMAZIN DURUMU

1.1. Konu taşınmaz: ${mülk.mülk_adres || '[TAŞINMAZ ADRESİ]'}
1.2. Taşınmaz türü: ${this.formatPropertyType(mülk.mülk_tip)}
${mülk.mülk_metrekare ? `1.3. Metrekare: ${mülk.mülk_metrekare} m²` : ''}
1.4. Taşınmazın genel durumu: ${this.assessPropertyCondition(mülk)}

MADDE 2 - KİRA SÖZLEŞMESİ BİLGİLERİ

2.1. Sözleşme Tarihi: ${this.formatDate(mevcut.sözleşme_tarihi)}
2.2. Sözleşme Süresi: ${this.formatContractDuration(mevcut.sözleşme_süresi)}
2.3. Mevcut Kira Bedeli: ${this.formatCurrency(mevcut.mevcut_kira)} TL/Ay
2.4. Sözleşme hükümleri çerçevesinde kira ödemelerim düzenli olarak yapılmıştır.

MADDE 3 - ARTIRIM TALEBİ VE İTİRAZ GEREKÇELERİ

3.1. Ev sahibi tarafından ${this.formatDate(artırım.bildirim_tarihi)} tarihinde kira artırım talebi bildirilmiştir.
3.2. Talep edilen yeni kira bedeli: ${this.formatCurrency(artırım.yeni_kira)} TL/Ay
3.3. Artırım oranı: %${this.calculateIncreaseRate(mevcut.mevcut_kira, artırım.yeni_kira)}
${artırım.artırım_gerekçesi ? `3.4. İleri sürülen gerekçe: "${artırım.artırım_gerekçesi}"` : ''}

3.5. İTİRAZ NEDENLERİMİZ:
${this.formatLegalObjections(itiraz.itiraz_nedenleri)}

3.6. DETAYLI AÇIKLAMA:
${itiraz.detaylı_gerekçe || '[DETAYLI AÇIKLAMA]'}

MADDE 4 - YASAL DAYANAK

4.1. TBK md. 344/1 gereğince, kira bedeli ancak Türkiye İstatistik Kurumu tarafından belirlenen tüketici fiyatları genel seviyesindeki on iki aylık ortalamalara göre değişim oranında artırılabilir.

4.2. 6570 Sayılı Kanun md. 2 uyarınca, konut ve rooming house kira artış oranı yıllık olarak belirlenmekte olup, bu oran aşılamaz.

4.3. Talep edilen artırım yasal sınırları aşmakta olup, TBK md. 346 gereği mahkemece uygun artırım oranının belirlenmesi gerekmektedir.

4.4. Yargıtay HGK kararları uyarınca, kira artırımında taşınmazın bulunduğu yerin özellikleri, piyasa değeri ve kiracının sosyo-ekonomik durumu dikkate alınmalıdır.

MADDE 5 - PİYASA ARAŞTIRMASI VE DEĞERLENDİRME

5.1. Bulunduğumuz bölgede benzer nitelikteki taşınmazların kira bedelleri araştırılmış olup, talep edilen bedelin piyasa değerlerinin üzerinde olduğu tespit edilmiştir.

5.2. Taşınmazın fiziki durumu, yaşı ve bölgesel özellikleri dikkate alındığında, istenen artırım oranı makul değildir.

5.3. Mevcut ekonomik koşullar ve gelir seviyem göz önüne alındığında, bu artırım sosyal adalete aykırıdır.

═══════════════════════════════════════════════════════════════════

                              HUKUKİ DEĞERLENDIRME

Türk Borçlar Kanunu md. 344 ve devamı hükümleri ile 6570 Sayılı Kanun çerçevesinde:

• Kira artışı yasal sınırları aşamamalıdır
• Artırım taşınmazın niteliği ve bölgesel özelliklerle orantılı olmalıdır  
• Kiracının ödeme gücü dikkate alınmalıdır
• Piyasa koşulları ve adaletli kira prensibi gözetilmelidir

Talep edilen artırım bu kriterleri karşılamamakta, yasal sınırları aşmaktadır.

═══════════════════════════════════════════════════════════════════

                                 SONUÇ VE TALEP

Yukarıda açıklanan vakıalar ve hukuki dayanaklarla;

${this.formatFinalRequest(talep.talep_türü, talep.önerilen_kira, mevcut.mevcut_kira, artırım.yeni_kira)}

Bu nedenlerle;

1. Ev sahibinin kira artırım talebine itirazımın kabulü,
${talep.önerilen_kira ? `2. Uygun kira bedelinin ${this.formatCurrency(talep.önerilen_kira)} TL/ay olarak belirlenmesi,` : '2. Uygun kira bedelinin mahkemece takdir edilmesi,'}
3. Artırımın hukuka uygun tarihten itibaren geçerli sayılması,
${talep.ek_talepler ? `4. ${talep.ek_talepler}` : '4. Adalete uygun karar verilmesi,'}

hususlarında karar verilmesini saygılarımla arz ederim.

═══════════════════════════════════════════════════════════════════

                               EKLER LİSTESİ

1. Mevcut kira sözleşmesi sureti
2. Kira ödeme makbuzları/dekontları  
3. Artırım bildirim yazısı (varsa)
4. Tapu senedi sureti (varsa)
5. Fotoğraflar ve belgeler (varsa)
6. Bölgesel kira araştırması (varsa)

═══════════════════════════════════════════════════════════════════

${documentDate}                                           ${kiracı.kiracı_ad || '[İMZA]'}

                                                          T.C. No: ${kiracı.kiracı_tc || '[TC NO]'}

───────────────────────────────────────────────────────────────────

Bu dilekçe T.C. yasalarına göre hazırlanmış olup, Artiklo Belge Sihirbazı 
ile ${documentDate} tarihinde oluşturulmuştur.

Yasal Uyarı: Bu belge taslak niteliğindedir. Kullanımdan önce hukuki 
danışmanlık alınması önerilir. Artiklo bu belgenin kullanımından doğan 
sonuçlardan sorumlu değildir.

Belge No: ${caseNumber} | Oluşturma: ${documentDate} ${documentTime}
    `.trim();
    }

    /**
     * Generate professional rental agreement (LawDepot quality)
     */
    private static generateProfessionalRentalAgreement(answers: WizardAnswers): string {
        const kiracı = answers.step1 || {};
        const evSahibi = answers.step2 || {};
        const evBilgi = answers.step3 || {};
        const sözleşme = answers.step4 || {};

        const today = new Date();
        const documentDate = today.toLocaleDateString('tr-TR');
        const documentTime = today.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const caseNumber = this.generateCaseNumber();

        // Calculate end date based on contract duration
        const startDate = sözleşme.baslangic_tarihi ? new Date(sözleşme.baslangic_tarihi as string) : new Date();
        const endDate = this.calculateContractEndDate(startDate, sözleşme.sozlesme_suresi as string);

        return `
                                    KİRA SÖZLEŞMESİ
                          (6098 Sayılı Türk Borçlar Kanunu md. 299-356)

SÖZLEŞME NO: ${caseNumber}
DÜZENLEME TARİHİ: ${documentDate} ${documentTime}

═══════════════════════════════════════════════════════════════════

                                    TARAFLAR

KIRALAYAN (EV SAHİBİ):

Ad Soyad        : ${evSahibi.ev_sahibi_ad || '[EV SAHİBİ ADI SOYADI]'}
T.C. Kimlik No  : ${evSahibi.ev_sahibi_tc || '[TC KİMLİK NO]'}
Telefon         : ${evSahibi.ev_sahibi_telefon || '[TELEFON]'}
Adres           : [KIRALAYAN ADRESİ]

KİRACI (KİRALANAN):

Ad Soyad        : ${kiracı.kiraci_ad || '[KİRACI ADI SOYADI]'}
T.C. Kimlik No  : ${kiracı.kiraci_tc || '[TC KİMLİK NO]'}
Telefon         : ${kiracı.kiraci_telefon || '[TELEFON]'}
${kiracı.kiraci_email ? `E-posta         : ${kiracı.kiraci_email}` : 'E-posta         : [E-POSTA]'}

═══════════════════════════════════════════════════════════════════

                          KIRALANAN TAŞINMAZIN ÖZELLİKLERİ

MADDE 1 - TAŞINMAZ BİLGİLERİ

1.1. Kiralanan Taşınmaz: ${evBilgi.ev_adresi || '[TAŞINMAZ ADRESİ]'}

1.2. Taşınmazın Niteliği: Konut olarak kullanılmak üzere kiralanmıştır.

1.3. Taşınmaz Durumu: Taşınmaz kira sözleşmesi imzalandığı tarihte kullanıma hazır ve
     oturmaya elverişli durumdadır.

1.4. Teslim Şekli: Taşınmaz mevcut hali ile teslim edilmiş olup, kiracı tarafından
     ayıpsız olarak kabul edilmiştir.

═══════════════════════════════════════════════════════════════════

                              SÖZLEŞME SÜRESİ VE KOŞULLARI

MADDE 2 - SÜRE VE GEÇERLİLİK

2.1. Sözleşme Başlangıcı: ${this.formatDate(sözleşme.baslangic_tarihi)}
2.2. Sözleşme Süresi: ${this.formatContractDuration(sözleşme.sozlesme_suresi)}
${endDate ? `2.3. Sözleşme Bitişi: ${endDate.toLocaleDateString('tr-TR')} (Bu tarih dahil)` : ''}

2.4. Bu sözleşme, yukarıda belirtilen süre boyunca geçerli olup, sürenin bitiminde
     tarafların anlaşması halinde yenilenebilir.

MADDE 3 - KİRA BEDELİ VE ÖDEME KOŞULLARI

3.1. Aylık Kira Bedeli: ${this.formatCurrency(evBilgi.kira_bedeli)} TL

3.2. Ödeme Zamanı: Kira bedeli her ayın başında, ayın ilk gününden itibaren
     en geç 5 (beş) gün içinde ödenecektir.

3.3. Ödeme Şekli: Kira bedeli nakit, havale/EFT veya çek ile ödenebilir.
     Ödeme makbuzunun düzenli olarak alınması esastır.

${evBilgi.depozito ? `3.4. Depozito: ${this.formatCurrency(evBilgi.depozito)} TL depozito alınmış olup,
     bu tutar sözleşme sona erdiğinde, taşınmazda herhangi bir hasar ve
     eksiklik bulunmaması halinde iade edilecektir.` : ''}

MADDE 4 - KİRA ARTIŞI

4.1. Kira Artış Oranı: ${this.formatRentIncreaseType(evBilgi.kira_artis_orani)}

4.2. Artış Zamanı: Kira artışı sözleşmenin yıldönümünde uygulanacak olup,
     yasal sınırlar çerçevesinde gerçekleştirilecektir.

4.3. Yasal Çerçeve: Kira artışı, 6570 sayılı Kanun ve TBK md. 344 hükümleri
     çerçevesinde yapılacaktır.

═══════════════════════════════════════════════════════════════════

                               TARAFLARIN YÜKÜMLÜLÜKLERİ

MADDE 5 - KİRACI'NIN YÜKÜMLÜLÜKLERİ

5.1. Kira bedelini zamanında ve eksiksiz ödemek,
5.2. Taşınmazı özenli bir şekilde kullanmak ve korumak,
5.3. Taşınmazda izinsiz tadilat yapmamak,
5.4. Taşınmazın kullanım amacını değiştirmemek,
5.5. Aidat, elektrik, su, doğalgaz, internet vb. faturalarını ödemek,
5.6. Komşuluk ilişkilerine uymak ve rahatsızlık vermemek.

MADDE 6 - KİRALAYAN'IN YÜKÜMLÜLÜKLERİ

6.1. Taşınmazı sözleşme gereği kullandırmak,
6.2. Taşınmazın önemli onarımlarını yapmak,
6.3. Vergi, sigorta ve yapı ruhsatı giderlerini karşılamak,
6.4. Taşınmazın hukuki durumunu güvence altında tutmak.

═══════════════════════════════════════════════════════════════════

                                  ÖZEL ŞARTLAR

MADDE 7 - EK HÜKÜMLER

${sözleşme.ozel_sartlar ?
                `7.1. Özel Koşullar: ${sözleşme.ozel_sartlar}` :
                '7.1. Bu sözleşmede belirtilmeyen hususlarda Türk Borçlar Kanunu hükümleri geçerlidir.'}

7.2. Sözleşme Feshi: Taraflardan birinin sözleşme hükümlerini ihlal etmesi
     halinde, diğer taraf 30 gün önceden ihbarda bulunarak sözleşmeyi feshedebilir.

7.3. Teslim: Sözleşme süresinin bitiminde veya feshi halinde taşınmaz,
     teslim alındığı halde kiralayana geri verilecektir.

═══════════════════════════════════════════════════════════════════

                              YASAL ÇERÇEVE VE REFERANSLAR

Bu sözleşme aşağıdaki yasal düzenlemeler çerçevesinde hazırlanmıştır:

• 6098 Sayılı Türk Borçlar Kanunu (md. 299-356)
• 6570 Sayılı Kira Artış Oranları Hakkında Kanun
• Türk Medeni Kanunu ilgili hükümleri
• Yargıtay İçtihatları

═══════════════════════════════════════════════════════════════════

                                 SONUÇ VE İMZALAR

Bu sözleşme ${new Date(startDate).toLocaleDateString('tr-TR')} tarihinde başlamak üzere,
yukarıda belirtilen şartlarla iki taraf arasında karşılıklı anlaşma ile imzalanmıştır.

Sözleşme 2 (iki) asıl nüsha halinde düzenlenmiş olup, taraflar birer nüshasını
almışlardır.


KİRALAYAN (EV SAHİBİ)                    KİRACI


_________________________                _________________________
${evSahibi.ev_sahibi_ad || '[EV SAHİBİ ADI]'}                    ${kiracı.kiraci_ad || '[KİRACI ADI]'}

T.C. No: ${evSahibi.ev_sahibi_tc || '[TC NO]'}              T.C. No: ${kiracı.kiraci_tc || '[TC NO]'}

Tarih: ${documentDate}                    Tarih: ${documentDate}


═══════════════════════════════════════════════════════════════════

                                  ÖNEMLİ UYARILAR

• Bu sözleşme taslak niteliğindedir ve hukuki danışmanlık alınması önerilir.
• Yerel düzenlemeler ve mevcut yasalar kontrol edilmelidir.
• Sözleşme şartları yerel koşullara göre uyarlanmalıdır.
• Noter onayı alınması hukuki güvence sağlayacaktır.

BELGE BİLGİLERİ:
───────────────────────────────────────────────────────────────────
Sözleşme No: ${caseNumber}
Oluşturma Tarihi: ${documentDate} ${documentTime}
Sistem: Artiklo Profesyonel Belge Sihirbazı v2.0

Bu belge Türkiye Cumhuriyeti yasalarına uygun olarak hazırlanmıştır.
Kullanımdan önce ilgili uzman görüşü alınması tavsiye edilir.

Copyright © ${new Date().getFullYear()} Artiklo - Tüm hakları saklıdır.
    `.trim();
    }

    /**
     * Generate default legal document for other templates
     */
    private static generateDefaultLegalDocument(
        template: WizardTemplate,
        answers: WizardAnswers
    ): string {
        const today = new Date();
        const documentDate = today.toLocaleDateString('tr-TR');
        const caseNumber = this.generateCaseNumber();

        return `
                              ${template.name.toUpperCase()}

BELGE NO: ${caseNumber}
TARİH: ${documentDate}

═══════════════════════════════════════════════════════════════════

Bu belge Artiklo Belge Sihirbazı ile oluşturulmuştur.

${Object.entries(answers).map(([stepId, stepAnswers]) => {
            const step = template.steps.find(s => s.id === stepId);
            if (!step) return '';

            return `
BÖLÜM: ${step.title}
${Object.entries(stepAnswers).map(([fieldId, value]) => {
                const field = step.fields.find(f => f.id === fieldId);
                return field ? `- ${field.label}: ${this.formatValue(value)}` : '';
            }).filter(Boolean).join('\n')}
  `.trim();
        }).filter(Boolean).join('\n\n')}

═══════════════════════════════════════════════════════════════════

${documentDate}                                                [İMZA]

───────────────────────────────────────────────────────────────────
Bu belge ${documentDate} tarihinde Artiklo Belge Sihirbazı ile oluşturulmuştur.
Belge No: ${caseNumber}
    `.trim();
    }

    /**
     * Helper methods for professional formatting
     */
    private static formatPropertyType(type: string | number | boolean | string[] | Date | undefined): string {
        const typeMap: Record<string, string> = {
            'daire': 'Daire',
            'müstakil': 'Müstakil Ev',
            'villa': 'Villa',
            'iş_yeri': 'İş Yeri',
            'mağaza': 'Mağaza',
            'büro': 'Büro',
            'depo': 'Depo',
            'diğer': 'Diğer'
        };
        return typeMap[String(type)] || String(type) || '[MÜLK TİPİ]';
    }

    private static formatContractDuration(duration: string | number | boolean | string[] | Date | undefined): string {
        const durationMap: Record<string, string> = {
            '1_yıl': '1 (Bir) Yıl',
            '2_yıl': '2 (İki) Yıl',
            '3_yıl': '3 (Üç) Yıl',
            'belirsiz': 'Belirsiz Süreli',
            'diğer': 'Diğer'
        };
        return durationMap[String(duration)] || String(duration) || '[SÜRE]';
    }

    private static formatCurrency(amount: string | number | boolean | string[] | Date | undefined): string {
        if (!amount) return '[TUTAR]';
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
        if (isNaN(num)) return '[TUTAR]';
        return new Intl.NumberFormat('tr-TR').format(num);
    }

    private static formatDate(dateValue: string | number | boolean | string[] | Date | undefined): string {
        if (!dateValue) return '[TARİH]';
        try {
            // Only create Date from valid types
            if (dateValue instanceof Date) {
                return dateValue.toLocaleDateString('tr-TR');
            }
            if (typeof dateValue === 'string' || typeof dateValue === 'number') {
                const date = new Date(dateValue);
                if (isNaN(date.getTime())) return String(dateValue);
                return date.toLocaleDateString('tr-TR');
            }
            return String(dateValue);
        } catch {
            return String(dateValue);
        }
    }

    private static calculateIncreaseRate(oldRent: string | number | boolean | string[] | Date | undefined, newRent: string | number | boolean | string[] | Date | undefined): string {
        const old = typeof oldRent === 'number' ? oldRent : parseFloat(String(oldRent || 0));
        const newer = typeof newRent === 'number' ? newRent : parseFloat(String(newRent || 0));

        if (old === 0 || isNaN(old) || isNaN(newer)) return '[ORAN]';

        const rate = ((newer - old) / old) * 100;
        return rate.toFixed(1);
    }

    private static formatLegalObjections(objections: string | number | boolean | string[] | Date | undefined): string {
        if (!Array.isArray(objections)) return '• Yasal sınırları aşan artırım';

        const objectionMap: Record<string, string> = {
            aşırı_artırım: '• Artırım oranının yasal sınırları (TÜFE + %25) aşması',
            piyasa_değeri: '• Talep edilen bedelin bölge piyasa değerlerinin üzerinde olması',
            mülk_durumu: '• Taşınmazın fiziki durumunun artırımı haklı göstermemesi',
            bölge_durumu: '• Bölgenin sosyo-ekonomik özelliklerinin dikkate alınmaması',
            ekonomik_durum: '• Kiracının mali durumunun göz ardı edilmesi',
            hukuki_eksiklik: '• Artırım bildiriminde usuli eksikliklerin bulunması',
            diğer: '• Diğer hukuki ve fiili nedenler'
        };

        return objections
            .map(obj => objectionMap[String(obj)] || `• ${obj}`)
            .join('\n');
    }

    private static formatFinalRequest(requestType: string | number | boolean | string[] | Date | undefined, suggestedRent: string | number | boolean | string[] | Date | undefined, currentRent: string | number | boolean | string[] | Date | undefined, requestedRent: string | number | boolean | string[] | Date | undefined): string {
        switch (String(requestType)) {
            case 'ret':
                return 'Ev sahibinin kira artırım talebinin tamamen reddedilmesi ve mevcut kira bedelinin devam etmesi';
            case 'azaltım':
                return suggestedRent
                    ? `Artırım talebinin makul bir orana indirilmesi ve aylık kira bedelinin ${this.formatCurrency(suggestedRent)} TL olarak belirlenmesi`
                    : 'Artırım talebinin makul bir orana indirilmesi';
            case 'erteleme':
                return 'Artırım talebinin daha uygun bir tarihe ertelenmesi';
            case 'tespit':
                return 'Adaletli ve uygun kira artırım oranının mahkemece tespit edilmesi';
            default:
                return 'Hukuk ve adalete uygun şekilde karar verilmesi';
        }
    }

    private static assessPropertyCondition(property: Record<string, string | number | boolean | string[] | Date | undefined>): string {
        // Bu gerçek uygulamada daha detaylı olacak
        return String(property?.mülk_durum_değerlendirmesi || 'Orta düzeyde, normal kullanım aşınması mevcut');
    }

    private static formatValue(value: string | number | boolean | string[] | Date | undefined): string {
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır';
        if (value instanceof Date) return value.toLocaleDateString('tr-TR');
        return String(value || '');
    }

    /**
     * Calculate contract end date based on duration
     */
    private static calculateContractEndDate(startDate: Date, duration: string): Date | null {
        const durationMap: Record<string, number> = {
            '1_yil': 12,
            '2_yil': 24,
            '3_yil': 36,
            'belirsiz': 0
        };

        const months = durationMap[duration] || 0;
        if (months === 0) return null;

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);
        endDate.setDate(endDate.getDate() - 1); // One day before the anniversary
        return endDate;
    }

    /**
     * Format rent increase type for Turkish contract
     */
    private static formatRentIncreaseType(increaseType: string | number | boolean | string[] | Date | undefined): string {
        const typeMap: Record<string, string> = {
            'tufe': 'TÜFE (Türkiye İstatistik Kurumu Tüketici Fiyatları Genel Seviyesi) oranında yıllık artış yapılacaktır.',
            'sabit_15': 'Yıllık %15 (on beş) sabit artış oranı uygulanacaktır.',
            'sabit_20': 'Yıllık %20 (yirmi) sabit artış oranı uygulanacaktır.',
            'sabit_25': 'Yıllık %25 (yirmi beş) sabit artış oranı uygulanacaktır.',
            'anlasmali': 'Tarafların karşılıklı anlaşması ile artış oranı belirlenecektir.'
        };
        return typeMap[String(increaseType)] || 'Yasal düzenlemeler çerçevesinde artış yapılacaktır.';
    }

    /**
     * Generate professional filename
     */
    private static generateProfessionalFilename(
        template: WizardTemplate,
        state: WizardState
    ): string {
        const date = new Date().toISOString().slice(0, 10);
        const caseNumber = this.generateCaseNumber();

        if (template.id === 'kira-itiraz-v1') {
            const applicant = state.answers.step1?.kiracı_ad || 'Kiracı';
            const cleanApplicant = String(applicant)
                .toLowerCase()
                .replace(/[çğıöşü]/g, (match) => {
                    const map: Record<string, string> = {
                        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
                    };
                    return map[match] || match;
                })
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '_');

            return `kira_itiraz_dilekçesi_${cleanApplicant}_${caseNumber}_${date}.txt`;
        }

        const templateName = template.name
            .toLowerCase()
            .replace(/[çğıöşü]/g, (match) => {
                const map: Record<string, string> = {
                    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
                };
                return map[match] || match;
            })
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');

        return `${templateName}_${caseNumber}_${date}.txt`;
    }

    /**
     * Generate document metadata
     */
    private static generateDocumentMetadata(
        template: WizardTemplate,
        state: WizardState
    ): DocumentMetadata {
        const today = new Date().toLocaleDateString('tr-TR');
        const caseNumber = this.generateCaseNumber();

        if (template.id === 'kira-itiraz-v1') {
            return {
                documentType: 'Kira Artırımı İtiraz Dilekçesi',
                createdDate: today,
                caseNumber,
                parties: {
                    applicant: String(state.answers.step1?.kiracı_ad || '[BAŞVURUCU]'),
                    defendant: String(state.answers.step3?.ev_sahibi_ad || '[KARŞI TARAF]')
                },
                legalBasis: [
                    '6098 Sayılı Türk Borçlar Kanunu md. 344-347',
                    '6570 Sayılı Kira Artış Oranları Hakkında Kanun',
                    'Yargıtay İçtihatları (HGK 2019/6-617 E., 2020/1051 K.)'
                ],
                attachments: [
                    'Mevcut kira sözleşmesi sureti',
                    'Kira ödeme makbuzları/dekontları',
                    'Artırım bildirim yazısı',
                    'Tapu senedi sureti',
                    'Bölgesel kira araştırması'
                ]
            };
        }

        if (template.id === 'simple-kira-sozlesmesi-v1') {
            return {
                documentType: 'Kira Sözleşmesi',
                createdDate: today,
                caseNumber,
                parties: {
                    applicant: String(state.answers.step1?.kiraci_ad || '[KİRACI]'),
                    defendant: String(state.answers.step2?.ev_sahibi_ad || '[EV SAHİBİ]')
                },
                legalBasis: [
                    '6098 Sayılı Türk Borçlar Kanunu md. 299-356',
                    '6570 Sayılı Kira Artış Oranları Hakkında Kanun',
                    'Türk Medeni Kanunu ilgili hükümleri',
                    'Yargıtay İçtihatları'
                ],
                attachments: [
                    'Kimlik fotokopileri',
                    'Tapu senedi sureti',
                    'Vergi levhası',
                    'Emlak vergisi makbuzu',
                    'Apartman yönetimi belgesi (varsa)'
                ]
            };
        }

        return {
            documentType: template.name,
            createdDate: today,
            caseNumber,
            parties: {},
            legalBasis: [],
            attachments: []
        };
    }

    /**
     * Generate unique case number
     */
    private static generateCaseNumber(): string {
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ARTIKLO-${year}-${random}`;
    }

    /**
     * Download document as text file
     */
    static downloadDocument(content: string, filename: string): void {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export default ProfessionalDocumentGenerator;