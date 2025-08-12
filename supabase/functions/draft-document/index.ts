// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Tiplerimizi tanımlıyoruz
interface Kisi { ad_soyad: string; tc_kimlik?: string; adres?: string; }
interface ItirazNedeni { tip: string; aciklama: string; }
interface KullaniciGirdileri {
  makam_adi: string;
  dosya_no?: string;
  esas_no?: string;
  karar_no?: string;
  suclama?: string;
  karar_tarihi?: string;
  mahkeme_adi?: string;
  itiraz_eden_kisi: Kisi;
  alacakli_kurum?: { unvan: string; adres?: string; };
  itiraz_nedenleri?: ItirazNedeni[];
  talep_sonucu: string;
  ekler?: string[];
}

// Analiz özetini daha iyi taslak için opsiyonel olarak alıyoruz
interface AnalysisLite {
  summary?: string;
  simplifiedText?: string;
  documentType?: string;
  criticalFacts?: Array<{ type: string; value: string }>;
  extractedEntities?: Array<{ entity: string; value: string | number }>;
  actionableSteps?: Array<{ description: string; actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY'; documentToCreate?: string }>;
  riskItems?: Array<{ riskType: string; description: string; severity: 'high' | 'medium' | 'low'; legalReference?: string; recommendation?: string }>;
  originalText?: string;
}

interface DraftRequest { belge_turu: string; kullanici_girdileri: KullaniciGirdileri; analysis?: AnalysisLite }

// @ts-expect-error Deno ortamı, tip bulunamıyor
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
// Belge karmaşıklığına göre model seçimi
const selectModel = (_analysis?: AnalysisLite): string => 'gemini-1.5-pro-latest';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id, x-prompt-variant',
};

// Ana Fonksiyon
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) throw new Error('Sunucu hatası: GEMINI_API_KEY yapılandırılmamış.');

    const body: DraftRequest = await req.json();
    if (!body.belge_turu || !body.kullanici_girdileri) throw new Error("İstek gövdesinde 'belge_turu' veya 'kullanici_girdileri' eksik.");

    const userInputJson = JSON.stringify(body, null, 2);

    // Güçlü taslak üretim promptu
    const analysisCtx = JSON.stringify(body.analysis || {}, null, 2);
    // Hukuki uygunluk guardrails (ör. HAGB tekrar suçu)
    const textCtx = (
      (body.analysis?.originalText || '') + ' ' +
      (body.analysis?.simplifiedText || '') + ' ' +
      (body.analysis?.summary || '')
    ).toLowerCase();
    const hasHAGB = /hükmün açıklanmasının geri bırakıl|\bhagb\b/.test(textCtx);
    const repeatSignal = /(tekrar|yeniden|mükerrer|aynı suçtan|tekerrür)/.test(textCtx);
    const disallowHAGB = hasHAGB && repeatSignal;
    const geminiPrompt = `
ROL: Türkiye Cumhuriyeti hukukunda 50+ yıllık tecrübeye sahip, dilekçe yazımı ve usul hukuku konusunda usta bir avukatsın.
AMAÇ: Kullanıcının doğrudan kullanabileceği, profesyonel ve ikna kabiliyeti yüksek bir hukuki dilekçe metni üret.

 KALİTE KURALLARI (ÇOK KRİTİK):
- Dil resmi, ölçülü, net ve etkili olacak; boş/şablon cümle yok.
- "AÇIKLAMALAR" bölümü en az 6–7 numaralı paragraf içermeli; her paragraf tek bir hukuki noktayı derinlemesine ele almalı (olay özeti, tebligat/süre, hukuki değerlendirme, deliller, karşı argümanlara cevap, sonuçlara etkisi vb.).
- Her paragrafta özgün metinden en az bir kısa alıntı (tırnak içinde, en çok 20 kelime) kullan; örn: "...". Alıntılar bağlamı desteklemeli.
 - Her açıklama paragrafı 60–120 kelime aralığında olmalı; gevezelik, tekrar, gereksiz giriş/çıkış cümleleri ve süsleme yok. Yoğunluk yüksek olmalı (somut veri + hukuki sonuç).
 - Toplam metin, profesyonel ama gereksiz uzun olmayan bir hacimde kalmalı; aynı düşünceyi ikinci kez söyleme.
- Somut veriler (tarih, dosya no, süre, tutar) metne gömülmeli; eksikse mantıksal ifade ile yaz (ör. "tebliğ tarihi itibarıyla yasal sürede…"). "[...]" kullanma; gerekli kişisel bilgiler kullanıcıca doldurulacağını ima eden doğal ifadeler kullan.
- İlgili mevzuat atıfları (İİK/HMK/TBK vb.) uygun yerlere yerleştirilmeli.
- Sonuç ve İstem maddeler halinde, açık ve talep odaklı yazılmalı.
- En alta YASAL UYARI ekle.
 - Spekülatif/abartılı ifadeler kullanma. Belge/metin içinde açık dayanak yoksa miktarlar için "yüksek", "fahiş" gibi nitelemeler yapma; bunun yerine nötr ve hukuki ifadeler kullan (örn. "miktarın yasal tarife çerçevesinde değerlendirilmesi talep olunur").
 - "Ekonomik durum" gibi şahsi hususlara ancak metinde/analizde açık dayanak varsa yer ver; yoksa bu yönde iddia oluşturma.
- "kanaatimizce / kanaatindeyiz" gibi muğlak ifadeleri kullanma; somut ve net yaz.
${disallowHAGB ? '- ÖNEMLİ: Analiz bağlamında daha önce HAGB verilmiş ve aynı/simli suçun tekrarı işaret ediliyor. HAGB talep ETME; metne yazma, alternatif uygun hukuki taleplere odaklan (ör. usul bozması, lehine değerlendirme).\n' : ''}

FORMAT (KESİN HÜKÜMLER – BAŞLIKLAR VE SIRALAMA AYNEN KULLANILACAK):
1) MAKAM ADI
2) DOSYA/ESAS/TAKİP NO
3) TARAFLAR
4) KONU
5) AÇIKLAMALAR
6) HUKUKİ SEBEPLER
7) SONUÇ VE İSTEM
8) EKLER
9) TARİH/İMZA BLOĞU

- Başlık adlarını VE sıralamayı AYNEN kullan; başlıklar tamamı BÜYÜK HARF olacak ve satır başı tek satır halinde yazılacak.
- "AÇIKLAMALAR" altında 1., 2., 3. şeklinde numaralandırılmış paragraflar bulunacak (en az 6 paragraf).
- "DOSYA/ESAS/TAKİP NO" altında eldeki tüm numaralar ayrı satırlarda verilecek (ESAS NO, DOSYA NO, KARAR NO vb.).
- ÇIKTI SADECE nihai dilekçe metni olacak (başlıklar + içerik). Önsöz, kapanış notu, uyarı metni veya herhangi bir yorum ekleme.
- Yer tutucu, boş parantez, üç nokta, şablon metin KULLANMA.

- NORMATİF HARİTA (KULLAN): Suçlama uyuşturucu kullanmak/benzeri ise TCK m.191; erteleme ise TCK m.51; HAGB ise CMK m.231; istinaf/temyiz usul hükümleri CMK m.272 vd. Yanlış madde atfetme.

BELGE TÜRÜ: ${body.belge_turu}
KULLANICI GİRDİLERİ:
${userInputJson}
ANALİZ ÖZETİ (varsa):
${analysisCtx}

ÇIKTI: YALNIZCA nihai dilekçe metnini düz metin olarak yaz (başlıklar aynen yukarıdaki isimlerle ve sıralamada).
`;

    const modelName = selectModel(body.analysis);
    const callModel = async (model: string, strict = false): Promise<string> => {
      const prompt = strict ? `${geminiPrompt}\n\nKATI KURALLAR: Yer tutucu/boş parantez/"[...]" KULLANMA. Her açıklama paragrafı (en az 6 adet) SOMUT OLAY + KISA ALINTI + HUKUKİ DEĞERLENDİRME + SONUÇ yapısında olsun.` : geminiPrompt;
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: strict ? 0.1 : 0.2,
            maxOutputTokens: 8192,
            response_mime_type: 'text/plain'
          }
        }),
      });
      if (!resp.ok) throw new Error(`Gemini API hatası: ${resp.status} ${await resp.text()}`);
      const json = await resp.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    };

    // Başta doğrudan PRO + katı kurallar ile üret
    let draftedDocument = await callModel('gemini-1.5-pro-latest', true);
    const hasPlaceholders = /\[[^\]]*\]|\.{3}/.test(draftedDocument);
    const explanationMatch = draftedDocument.match(/\n\s*\d+\./g);
    const explanationCount = explanationMatch ? explanationMatch.length : 0;
    const quoteCount = (draftedDocument.match(/"[^"]+"/g) || []).length;
    const tooShort = draftedDocument.split(/\n/).length < 25;
    if (!draftedDocument || hasPlaceholders || explanationCount < 5 || quoteCount < 1 || tooShort) {
      draftedDocument = await callModel('gemini-1.5-pro-latest', true);
      if (!draftedDocument) {
        throw new Error('Gemini API yanıtı boş veya geçersiz.');
      }
    }

    // Koruyucu temizlik: dayanağı olmadan "yüksek/fahiş" nitelemeleri yapmayalım
    const hardshipSupported = Boolean(body.analysis?.originalText && /(ekonomik durum|maddi durum|fahiş|yoksulluk|gelir durumu|asgar|muafiyet)/i.test(body.analysis.originalText));
    if (!hardshipSupported) {
      // Yargılama gideri veya tutar bağlamında aşırı nitelemeleri yumuşat
      draftedDocument = draftedDocument
        .replace(/(yargılama gider(ler)?i[^\n\.]*)(fahiş|yüksek)[^\n\.]*/gi, '$1 hukuka ve tarifelere uygun şekilde değerlendirilmelidir.')
        .replace(/(miktar(ı)?[^\n\.]*)(fahiş|yüksek)[^\n\.]*/gi, '$1 hukuka uygunluk bakımından değerlendirilmelidir.');
    }

    // Hukuken mümkün olmayan talebi metinden çıkar (HAGB tekrar suçta)
    if (disallowHAGB) {
      draftedDocument = draftedDocument
        .split('\n')
        .filter(line => !/(hagb|hükmün açıklanmasının geri bırakıl)/i.test(line))
        .join('\n');
    }

    // --- Yer tutucu çözümleme ve açıklamaları somutlaştırma ---
    const draftedBeforeCleanup = draftedDocument;
    const resolvePlaceholders = (text: string): string => {
      const ents = body.analysis?.extractedEntities || [];
      const facts = body.analysis?.criticalFacts || [];

      const lookup = (keys: string[]): string | null => {
        for (const k of keys) {
          const ent = ents.find(e => String(e.entity).toLowerCase().includes(k));
          if (ent && String(ent.value).trim()) return String(ent.value);
        }
        for (const k of keys) {
          const fact = facts.find(f => String(f.value).toLowerCase().includes(k));
          if (fact && String(fact.value).trim()) return String(fact.value);
        }
        return null;
      };

      const replacements: Record<string, string | null> = {
        'Tebliğ Tarihi': lookup(['tebliğ']),
        'Karar No': lookup(['karar no', 'karar']),
        'Esas No': lookup(['esas no', 'dosya']),
        'Dosya No': lookup(['dosya', 'takip']),
        'Mahkeme Adı': lookup(['mahkeme']),
        'Ad Soyad': lookup(['sanık', 'davalı', 'borçlu', 'itiraz eden', 'başvuran'])
      };

      for (const [key, val] of Object.entries(replacements)) {
        if (val) text = text.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
      }
      // Kalan genel [ ... ] yer tutucularını kaldır
      text = text.replace(/\[[^\]]+\]/g, '');
      // Arka arkaya kalan boşluk ve noktalama düzelt
      text = text.replace(/\s{2,}/g, ' ').replace(/\n{3,}/g, '\n\n');
      return text;
    };

    draftedDocument = resolvePlaceholders(draftedDocument);

    // Açıklamalar paragraf sayısı hâlâ düşükse, risk ve delillerden paragraf ekle
    const ensureExplanations = (text: string): string => {
      const lines = text.split('\n');
      const idx = lines.findIndex(l => /AÇIKLAMALAR/i.test(l));
      if (idx === -1) return text;
      let count = lines.slice(idx + 1).filter(l => /^\s*\d+\./.test(l)).length;
      const riskItems = body.analysis?.riskItems || [];
      const toAdd: string[] = [];
      for (const r of riskItems) {
        if (count >= 6) break;
        toAdd.push(`${++count}. ${r.description}${r.legalReference ? ` (Dayanak: ${r.legalReference})` : ''}`);
      }
      if (toAdd.length > 0) {
        // İlk numaralı paragrafın hemen altına ekle
        const insertPos = lines.findIndex((l, i) => i > idx && /^\s*\d+\./.test(l));
        if (insertPos !== -1) {
          lines.splice(insertPos + 1, 0, ...toAdd);
          return lines.join('\n');
        }
      }
      return text;
    };

    draftedDocument = ensureExplanations(draftedDocument);

    // "Kullanıcı doldursun" tarzı ifadeleri yasakla ve zayıf açıklamaları analizden üret
    const rawWeak = /(kullanıcı|doldur|detaylı açıklama|ekleyiniz|buraya gelecek|olayın özeti|istinaf gerekçeleri|deliller buraya)/i.test(draftedBeforeCleanup) || /\.\.\./.test(draftedBeforeCleanup);
    const looksWeak = rawWeak || /kullanıcı|doldur|detaylı açıklama|ekleyiniz|buraya gelecek|\.\.\./i.test(draftedDocument);

    const buildExplanationsFromAnalysis = (): string[] => {
      const items: string[] = [];
      const pickSentences = (text: string, keywords: string[], max = 2): string[] => {
        if (!text) return [];
        const sentences = text.split(/(?<=[\.!?])\s+/);
        const picked: string[] = [];
        for (const kw of keywords) {
          for (const s of sentences) {
            if (picked.length >= max) break;
            if (s.toLowerCase().includes(kw.toLowerCase()) && !picked.includes(s)) picked.push(s.trim());
          }
          if (picked.length >= max) break;
        }
        return picked;
      };
      const ent = (name: string): string | null => {
        return (body.analysis?.extractedEntities || []).find(e => String(e.entity).toLowerCase().includes(name))?.value as string || null;
      };
      const fact = (name: string): string | null => {
        return (body.analysis?.criticalFacts || []).find(f => String(f.value).toLowerCase().includes(name))?.value || null;
      };
      const mahkeme = ent('mahkeme') || body.kullanici_girdileri.mahkeme_adi || '[Mahkeme]';
      const esas = ent('esas') || body.kullanici_girdileri.esas_no || body.kullanici_girdileri.dosya_no || '[Esas]';
      const kararTarihi = fact('tarih') || body.kullanici_girdileri.karar_tarihi || '[Tarih]';
      const sanik = ent('sanık') || ent('davalı') || ent('itiraz eden') || ent('başvuran') || '[Ad Soyad]';

      // 1) Olay ve hüküm özeti (özgün metinden kısa alıntı ile)
      const quote1 = pickSentences(body.analysis?.originalText || body.analysis?.simplifiedText || '', ['mahkeme', 'karar', 'esas', 'tarih'], 1)[0];
      items.push(`${sanik} hakkında ${mahkeme} nezdinde ${esas} sayılı dosyada verilen ${kararTarihi} tarihli karar hukuka aykırıdır. ${quote1 ? `"${quote1}" cümlesi kararın çerçevesini göstermektedir.` : ''}`.trim());

      // 2) Risklerden hukuki somutlaştırma
      (body.analysis?.riskItems || []).slice(0, 4).forEach((r) => {
        const ref = r.legalReference ? ` (Dayanak: ${r.legalReference})` : '';
        items.push(`${r.description}${ref}`);
      });

      // 3) Tebliğ ve süre vurgusu
      const teblig = fact('tebliğ') || fact('deadline');
      if (teblig) items.push(`Kararın ${teblig} itibarıyla tebliğ edildiği dikkate alındığında, başvurumuz süresindedir ve esastan incelenmesi gerekir.`);

      // 4) Delillerin değerlendirilmemesi
      const quote2 = pickSentences(body.analysis?.originalText || '', ['tutanak', 'rapor', 'tahlil', 'tanık', 'kamera', 'polis', 'bilirkişi'], 1)[0];
      items.push(`Dosyadaki deliller bütünsel değerlendirilmemiş; lehe hususlar gerekçede irdelenmemiştir. ${quote2 ? `Örneğin: "${quote2}".` : ''} Bu eksiklik adil yargılanma hakkını zedeler ve bozma nedenidir.`);

      // 5) Sonuç etkisi
      items.push(`Belirtilen usul ve esas aykırılıkları, hükmün doğruluğunu etkileyecek niteliktedir; bu nedenle kararın kaldırılması/bozulması gerekir.`);

      while (items.length < 5) items.push('Yukarıdaki hususlar birlikte değerlendirildiğinde, kararın hukuka aykırı olduğu açıktır.');
      return items.slice(0, 7);
    };

    if (looksWeak) {
      const lines = draftedDocument.split('\n');
      const startIdx = lines.findIndex(l => /AÇIKLAMALAR/i.test(l));
      const endIdx = lines.findIndex((l, i) => i > startIdx && /HUKUK[İI] SEBEP|HUKUKI SEBEP/i.test(l));
      if (startIdx !== -1 && endIdx !== -1) {
        const newExpl = buildExplanationsFromAnalysis().map((p, i) => `${i + 1}. ${p}`);
        const head = lines.slice(0, startIdx + 1);
        const tail = lines.slice(endIdx);
        draftedDocument = [...head, '', ...newExpl, '', ...tail].join('\n');
      }
    }

    // Paragraf bazlı yer tutucu taraması: veri varsa kesin biz dolduralım, yoksa kısa uyarı bırak
    const hasAnyContext = Boolean(
      (body.analysis?.originalText && body.analysis.originalText.trim().length > 0) ||
      (body.analysis?.simplifiedText && body.analysis.simplifiedText.trim().length > 0) ||
      (body.analysis?.riskItems || []).length > 0 ||
      (body.analysis?.criticalFacts || []).length > 0 ||
      (body.analysis?.extractedEntities || []).length > 0
    );

    const replacePlaceholderParagraphs = (text: string): string => {
      const lines = text.split('\n');
      const startIdx = lines.findIndex(l => /AÇIKLAMALAR/i.test(l));
      const endIdx = lines.findIndex((l, i) => i > startIdx && /HUKUK[İI] SEBEP|HUKUKI SEBEP/i.test(l));
      if (startIdx === -1 || endIdx === -1) return text;
      const bodyLines = lines.slice(startIdx + 1, endIdx);
      const rebuilt = buildExplanationsFromAnalysis();
      let replIdx = 0;
      const placeholderRe = /(\[.*\]|buraya gelecek|detaylı açıklama|ekleyiniz|\.\.\.)/i;
      const newBody = bodyLines.map((l) => {
        if (/^\s*\d+\./.test(l) && placeholderRe.test(l)) {
          if (hasAnyContext && replIdx < rebuilt.length) {
            return `${l.match(/^\s*\d+\./)![0]} ${rebuilt[replIdx++]}`;
          }
          return `${l.match(/^\s*\d+\./)![0]} Dosyada bu başlığa özgü ayrıntı yer almadığından kullanıcı tarafından somut bilgi eklenmesi gereklidir.`;
        }
        return l;
      });
      return [...lines.slice(0, startIdx + 1), ...newBody, ...lines.slice(endIdx)].join('\n');
    };

    draftedDocument = replacePlaceholderParagraphs(draftedDocument);

    // Paragraf yoğunluğu/uzunluğu düzenleme: her numaralı paragraf en çok 120 kelime
    const limitParagraphWords = (text: string, maxWords = 120): string => {
      return text.replace(/^(\s*\d+\.\s*)([\s\S]*?)(?=\n\s*\d+\.|\n\s*HUKUK|\n\s*$)/gim, (_m, pfx, body) => {
        const words = body.trim().split(/\s+/);
        if (words.length <= maxWords) return `${pfx}${body}`;
        const trimmed = words.slice(0, maxWords).join(' ');
        return `${pfx}${trimmed}`;
      });
    };

    draftedDocument = limitParagraphWords(draftedDocument, 120);

    // --- Kesin şablona zorlayan deterministik düzenleyici ---
    const buildCanonicalDocument = (text: string): string => {
      // Yardımcılar
      const up = (s: string) => (s || '').toString().trim().toUpperCase();
      const lines: string[] = [];

      // 1) MAKAM ADI
      const makam = body.kullanici_girdileri.makam_adi || '';
      lines.push('MAKAM ADI');
      lines.push(up(makam));
      lines.push('');

      // 2) DOSYA/ESAS/TAKİP NO
      lines.push('DOSYA/ESAS/TAKİP NO');
      const esasNo = body.kullanici_girdileri.esas_no || '';
      const dosyaNo = body.kullanici_girdileri.dosya_no || '';
      const kararNo = body.kullanici_girdileri.karar_no || '';
      if (esasNo) lines.push(`ESAS NO: ${esasNo}`);
      if (dosyaNo) lines.push(`DOSYA NO: ${dosyaNo}`);
      if (kararNo) lines.push(`KARAR NO: ${kararNo}`);
      if (!esasNo && !dosyaNo && !kararNo) lines.push('—');
      lines.push('');

      // 3) TARAFLAR
      lines.push('TARAFLAR');
      const kisi = body.kullanici_girdileri.itiraz_eden_kisi;
      const alacakli = body.kullanici_girdileri.alacakli_kurum;
      const kisiSatir = [`İtiraz Eden: ${kisi.ad_soyad}`,
      kisi.tc_kimlik ? `TC: ${kisi.tc_kimlik}` : null,
      kisi.adres ? `Adres: ${kisi.adres}` : null].filter(Boolean).join(' | ');
      lines.push(kisiSatir);
      if (alacakli) {
        const alcSatir = [`Karşı Taraf: ${alacakli.unvan}`, alacakli.adres ? `Adres: ${alacakli.adres}` : null].filter(Boolean).join(' | ');
        lines.push(alcSatir);
      }
      lines.push('');

      // 4) KONU
      lines.push('KONU');
      const konuKisa = (() => {
        if (body.kullanici_girdileri.talep_sonucu) return body.kullanici_girdileri.talep_sonucu;
        const doc = body.belge_turu || 'DİLEKÇE';
        const sum = body.analysis?.summary || '';
        return sum ? `${doc} – ${sum}` : `${doc} sunulması hakkında`;
      })();
      lines.push(konuKisa.trim());
      lines.push('');

      // 5) AÇIKLAMALAR
      lines.push('AÇIKLAMALAR');
      // Var olan metinden açıklamaları ayıkla, değilse analizden üret
      const extractSection = (src: string, header: RegExp): string => {
        const m = src.match(new RegExp(`${header.source}[\r\n]+([\s\S]*?)(?=\n\s*[A-ZÇĞİÖŞÜ/ ]{3,}|$)`, 'i'));
        return m ? m[1].trim() : '';
      };
      const fromModelExpl = extractSection(text, /AÇIKLAMALAR/);
      if (fromModelExpl) {
        lines.push(fromModelExpl);
      } else {
        // Analizden en az 6 paragraf üret
        const rebuild = ((): string => {
          const paras: string[] = [];
          const pick = (t?: string, kws: string[] = [], max = 1): string[] => {
            if (!t) return [];
            const sents = t.split(/(?<=[\.!?])\s+/);
            const out: string[] = [];
            for (const kw of kws) {
              for (const s of sents) {
                if (out.length >= max) break;
                if (s.toLowerCase().includes(kw.toLowerCase())) out.push(s.trim());
              }
              if (out.length >= max) break;
            }
            return out;
          };
          const ent = (name: string): string | null => (body.analysis?.extractedEntities || []).find(e => String(e.entity).toLowerCase().includes(name))?.value as string || null;
          const fact = (name: string): string | null => (body.analysis?.criticalFacts || []).find(f => String(f.value).toLowerCase().includes(name))?.value || null;
          const mahkeme = ent('mahkeme') || body.kullanici_girdileri.mahkeme_adi || '[MAHKEME]';
          const esas = ent('esas') || body.kullanici_girdileri.esas_no || body.kullanici_girdileri.dosya_no || '[ESAS]';
          const kararTarihi = fact('tarih') || body.kullanici_girdileri.karar_tarihi || '[TARİH]';
          const sanik = ent('sanık') || ent('davalı') || ent('itiraz eden') || ent('başvuran') || (kisi?.ad_soyad || '[AD SOYAD]');
          const q1 = pick(body.analysis?.originalText || body.analysis?.simplifiedText, ['mahkeme', 'karar', 'esas', 'tarih'], 1)[0];
          paras.push(`${sanik} hakkında ${mahkeme} nezdinde ${esas} sayılı dosyada verilen ${kararTarihi} tarihli karar hukuka aykırıdır.${q1 ? ` "${q1}" ifadesi karar bağlamını göstermektedir.` : ''}`.trim());
          (body.analysis?.riskItems || []).slice(0, 4).forEach(r => paras.push(`${r.description}${r.legalReference ? ` (Dayanak: ${r.legalReference})` : ''}`));
          const teblig = fact('tebliğ') || fact('deadline');
          if (teblig) paras.push(`Kararın ${teblig} itibarıyla tebliğ edildiği dikkate alındığında, başvurumuz süresindedir ve esastan incelenmesi gerekir.`);
          const q2 = pick(body.analysis?.originalText, ['tutanak', 'rapor', 'tanık', 'kamera', 'bilirkişi'], 1)[0];
          paras.push(`Dosyadaki deliller bütünsel değerlendirilmemiş; lehe hususlar gerekçede irdelenmemiştir.${q2 ? ` Örneğin: "${q2}".` : ''} Bu eksiklik bozma nedenidir.`);
          paras.push('Belirtilen usul ve esas aykırılıkları hükmün doğruluğunu etkilemektedir.');
          while (paras.length < 6) paras.push('Yukarıdaki hususlar birlikte değerlendirildiğinde kararın kaldırılması/bozulması gerekir.');
          return paras.map((p, i) => `${i + 1}. ${p}`).join('\n');
        })();
        lines.push(rebuild);
      }
      lines.push('');

      // 6) HUKUKİ SEBEPLER
      lines.push('HUKUKİ SEBEPLER');
      const legalRefs = Array.from(new Set((body.analysis?.riskItems || []).map(r => r.legalReference).filter(Boolean))) as string[];
      if (legalRefs.length > 0) {
        lines.push(legalRefs.map(l => `- ${l}`).join('\n'));
      } else {
        lines.push('- İİK, HMK, TBK ve ilgili mevzuat hükümleri');
      }
      lines.push('');

      // 7) SONUÇ VE İSTEM
      lines.push('SONUÇ VE İSTEM');
      const istem = body.kullanici_girdileri.talep_sonucu || 'Yukarıda arz edilen nedenlerle talebimizin kabulünü saygıyla arz ve talep ederiz.';
      lines.push(`- ${istem}`);
      lines.push('');

      // 8) EKLER
      lines.push('EKLER');
      const ekler = body.kullanici_girdileri.ekler || [];
      if (ekler.length > 0) lines.push(ekler.map((e, i) => `${i + 1}) ${e}`).join('\n')); else lines.push('—');
      lines.push('');

      // 9) TARİH/İMZA BLOĞU
      lines.push('TARİH/İMZA BLOĞU');
      const today = new Date();
      const tarih = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      lines.push(`${tarih}`);
      lines.push(`${kisi?.ad_soyad || ''}`.trim());
      lines.push('İMZA');

      return lines.join('\n');
    };

    const canonical = buildCanonicalDocument(draftedDocument);

    // Sadece ve sadece temizlenmiş belge metnini döndürüyoruz
    return new Response(JSON.stringify({ draftedDocument: canonical }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});