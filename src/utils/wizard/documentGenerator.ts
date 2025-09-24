import { WizardState, WizardTemplate, WizardAnswers } from '@/types/wizard';

export interface DocumentGeneratorResult {
    success: boolean;
    content?: string;
    filename?: string;
    error?: string;
}

export class DocumentGenerator {
    /**
     * Generate document content from wizard state
     */
    static generateDocument(
        template: WizardTemplate,
        state: WizardState
    ): DocumentGeneratorResult {
        try {
            const content = this.generateContent(template, state);
            const filename = this.generateFilename(template, state);

            return {
                success: true,
                content,
                filename
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Generate document content based on template
     */
    private static generateContent(
        template: WizardTemplate,
        state: WizardState
    ): string {
        const { answers } = state;

        // Kira İtiraz Template için özel content generation
        if (template.id === 'kira-itiraz-v1') {
            return this.generateKiraItirazContent(answers);
        }

        // Default content generation
        return this.generateDefaultContent(template, answers);
    }

    /**
     * Generate Kira İtiraz dilekçesi content
     */
    private static generateKiraItirazContent(answers: WizardAnswers): string {
        const kiracı = answers.step1 || {};
        const mülk = answers.step2 || {};
        const evSahibi = answers.step3 || {};
        const mevcut = answers.step4 || {};
        const artırım = answers.step5 || {};
        const itiraz = answers.step6 || {};
        const talep = answers.step7 || {};

        const bugün = new Date().toLocaleDateString('tr-TR');

        return `
KIRA ARTIRIMINA İTİRAZ DİLEKÇESİ

${bugün}

Sayın Hâkim,

Ben, ${kiracı.kiracı_ad || '[AD SOYAD]'} (T.C. Kimlik No: ${kiracı.kiracı_tc || '[TC NO]'}), 
ikamet adresim: ${kiracı.kiracı_adres || '[ADRES]'}, telefon: ${kiracı.kiracı_tel || '[TELEFON]'}

DAVALI: ${evSahibi.ev_sahibi_ad || '[EV SAHİBİ ADI]'}
${evSahibi.ev_sahibi_adres ? `Adres: ${evSahibi.ev_sahibi_adres}` : ''}
${evSahibi.ev_sahibi_tel ? `Telefon: ${evSahibi.ev_sahibi_tel}` : ''}

KONU: Kira artırımına itiraz

AÇIKLAMALAR:

1. MÜLK BİLGİLERİ:
   - Kiraladığım mülk adresi: ${mülk.mülk_adres || '[MÜLK ADRESİ]'}
   - Mülk tipi: ${this.formatValue(mülk.mülk_tip)}
   ${mülk.mülk_metrekare ? `- Metrekare: ${mülk.mülk_metrekare} m²` : ''}

2. MEVCUT KIRA DURUMU:
   - Mevcut kira bedeli: ${mevcut.mevcut_kira || '[MEVCUT KİRA]'} TL
   - Sözleşme tarihi: ${this.formatDate(mevcut.sözleşme_tarihi)}
   - Sözleşme süresi: ${this.formatValue(mevcut.sözleşme_süresi)}

3. KIRA ARTIRIM TALEP BİLGİLERİ:
   - İstenen yeni kira: ${artırım.yeni_kira || '[YENİ KİRA]'} TL
   - Artırım oranı: %${this.calculateIncreaseRate(this.toNumber(mevcut.mevcut_kira), this.toNumber(artırım.yeni_kira))}
   - Artırım bildirim tarihi: ${this.formatDate(artırım.bildirim_tarihi)}
   ${artırım.artırım_gerekçesi ? `- Belirtilen gerekçe: ${artırım.artırım_gerekçesi}` : ''}

4. İTİRAZ GEREKÇELERİM:
   ${this.formatCheckboxValues(this.toStringArray(itiraz.itiraz_nedenleri))}
   
   Detaylı açıklamam:
   ${itiraz.detaylı_gerekçe || '[DETAYLI GEREKÇE]'}

5. TALEBİM:
   ${this.formatTalep(this.toString(talep.talep_türü))}
   ${talep.önerilen_kira ? `Önerdiğim uygun kira tutarı: ${talep.önerilen_kira} TL` : ''}
   ${talep.ek_talepler ? `Ek taleplerim: ${talep.ek_talepler}` : ''}

SONUÇ:

Yukarıda belirtilen gerekçelerle, ev sahibi tarafından talep edilen kira artırımına itirazım bulunmakta olup;

${this.formatSonuç(this.toString(talep.talep_türü), this.toNumber(talep.önerilen_kira))}

Bu dilekçem ile birlikte;
- Mevcut kira sözleşmesi fotokopisi
- Kira ödemelerini gösterir belgeler
- Artırım bildirim yazısı (varsa)
eklenmekte olup, gereğinin yapılmasını saygılarımla arz ederim.

${bugün}

                                                    ${kiracı.kiracı_ad || '[İMZA]'}

---
BU BELGE ARTIKLO BELGE SİHİRBAZI İLE OLUŞTURULMUŞTUR
Bu dilekçe taslak niteliğindedir. Hukuki danışmanlık alınması önerilir.
    `.trim();
    }

    /**
     * Generate default content for other templates
     */
    private static generateDefaultContent(
        template: WizardTemplate,
        answers: WizardAnswers
    ): string {
        return `
${template.name.toUpperCase()}

Bu belge Artiklo Wizard ile oluşturulmuştur.

${Object.entries(answers).map(([stepId, stepAnswers]) => {
            const step = template.steps.find(s => s.id === stepId);
            if (!step) return '';

            return `
${step.title}:
${Object.entries(stepAnswers).map(([fieldId, value]) => {
                const field = step.fields.find(f => f.id === fieldId);
                return field ? `- ${field.label}: ${this.formatValue(value)}` : '';
            }).filter(Boolean).join('\n')}
  `.trim();
        }).filter(Boolean).join('\n\n')}

---
Bu belge ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.
Artiklo Belge Sihirbazı ile hazırlanmıştır.
    `.trim();
    }

    /**
     * Generate filename based on template and content
     */
    private static generateFilename(
        template: WizardTemplate,
        state: WizardState
    ): string {
        const date = new Date().toISOString().slice(0, 10);
        const templateName = template.name.toLowerCase()
            .replace(/[çğıöşü]/g, (match) => {
                const map: Record<string, string> = {
                    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
                };
                return map[match] || match;
            })
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        return `${templateName}_${date}.txt`;
    }

    /**
     * Helper methods for formatting and type conversion
     */
    private static toString(value: string | number | boolean | string[] | Date | undefined): string {
        if (!value) return '';
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır';
        if (value instanceof Date) return value.toLocaleDateString('tr-TR');
        return String(value);
    }

    private static toNumber(value: string | number | boolean | string[] | Date | undefined): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    }

    private static toStringArray(value: string | number | boolean | string[] | Date | undefined): string[] {
        if (Array.isArray(value)) return value.filter(v => typeof v === 'string');
        if (typeof value === 'string') return [value];
        return [];
    }

    private static formatValue(value: string | number | boolean | string[] | Date | undefined): string {
        return this.toString(value);
    }

    private static formatDate(dateValue: string | number | boolean | string[] | Date | undefined): string {
        if (!dateValue) return '[TARİH]';
        if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString('tr-TR');
        }
        if (typeof dateValue === 'string') {
            const date = new Date(dateValue);
            return isNaN(date.getTime()) ? String(dateValue) : date.toLocaleDateString('tr-TR');
        }
        return String(dateValue);
    }

    private static formatCheckboxValues(values: string[]): string {
        if (!values || !Array.isArray(values)) return '';

        const labelMap: Record<string, string> = {
            aşırı_artırım: '• Artırım oranı çok yüksek',
            piyasa_değeri: '• Piyasa değerinin üzerinde',
            mülk_durumu: '• Mülkün fiziki durumu kötü',
            bölge_durumu: '• Bölge koşulları uygun değil',
            ekonomik_durum: '• Ekonomik durumum el vermiyor',
            hukuki_eksiklik: '• Hukuki prosedür eksik',
            diğer: '• Diğer nedenler'
        };

        return values.map(value => labelMap[value] || `• ${value}`).join('\n   ');
    }

    private static formatTalep(talepTürü: string): string {
        const talepMap: Record<string, string> = {
            ret: 'Kira artırımının tamamen reddedilmesini',
            azaltım: 'Kira artırımının makul bir orana indirilmesini',
            erteleme: 'Kira artırımının ertelenmesini',
            tespit: 'Uygun kira artırım oranının mahkemece tespit edilmesini'
        };

        return talepMap[talepTürü] || 'Uygun görülecek şekilde karar verilmesini';
    }

    private static formatSonuç(talepTürü: string, önerilenKira?: number): string {
        switch (talepTürü) {
            case 'ret':
                return 'Artırım talebinin reddedilmesini ve mevcut kira bedelinin devam etmesini,';
            case 'azaltım':
                return önerilenKira
                    ? `Artırımın ${önerilenKira} TL olarak belirlenmesini,`
                    : 'Artırımın makul bir orana indirilmesini,';
            case 'erteleme':
                return 'Artırımın daha uygun bir tarihe ertelenmesini,';
            case 'tespit':
                return 'Uygun artırım oranının mahkemece tespit edilmesini,';
            default:
                return 'Uygun görülecek şekilde karar verilmesini,';
        }
    }

    private static calculateIncreaseRate(oldRent: number, newRent: number): string {
        if (!oldRent || !newRent) return '[ORAN]';
        const rate = ((newRent - oldRent) / oldRent) * 100;
        return rate.toFixed(1);
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

export default DocumentGenerator;