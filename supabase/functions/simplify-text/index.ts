import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import mammoth from "https://esm.sh/mammoth@1.7.0";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      throw new Error('Sunucu hatası: API anahtarı yapılandırması eksik.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    let textToSimplify: string | undefined;
    let modelName = 'gemini-1.5-flash-latest';
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await req.json();
      textToSimplify = body.text;
      if (body.model === 'pro') {
        modelName = 'gemini-1.5-pro-latest';
      }
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const modelParam = formData.get('model');
      if (modelParam === 'pro') {
        modelName = 'gemini-1.5-pro-latest';
      }
      const files = formData.getAll('files') as File[];
      if (!files || files.length === 0) {
        throw new Error('Dosya yüklenemedi.');
      }
      const fileProcessingPromises = files.map(async (file) => {
        let extractedText = '';
        if (file.type.startsWith('image/')) {
          // Görüntü dosyaları için önce storage'a yükle, sonra OCR
          const filePath = `public/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabaseAdmin.storage
            .from('document-images')
            .upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabaseAdmin.storage
            .from('document-images')
            .getPublicUrl(filePath);
          const publicUrl = urlData.publicUrl;
          const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requests: [{
                image: { source: { imageUri: publicUrl } },
                features: [{ type: 'TEXT_DETECTION' }]
              }]
            })
          });
          if (!visionResponse.ok) throw new Error('Google Vision API hatası.');
          const visionData = await visionResponse.json();
          extractedText = visionData.responses?.[0]?.fullTextAnnotation?.text || '';
          // Görsel dosyayı storage'dan sil
          await supabaseAdmin.storage.from('document-images').remove([filePath]);
        } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          // PDF dosyası için doğrudan Gemini'ye base64 gönder
          try {
            const fileArrayBuffer = await file.arrayBuffer();
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileArrayBuffer)));
            const geminiFileResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: "Bu PDF dosyasındaki tüm metni çıkar ve döndür. Sadece metin içeriğini ver, başka açıklama ekleme." },
                    {
                      inline_data: {
                        mime_type: "application/pdf",
                        data: base64Data
                      }
                    }
                  ]
                }]
              })
            });
            if (geminiFileResponse.ok) {
              const geminiFileData = await geminiFileResponse.json();
              extractedText = geminiFileData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } else {
              throw new Error('PDF işleme hatası');
            }
          } catch (error) {
            console.error('PDF işleme hatası:', error);
            extractedText = `PDF dosyası işlenemedi: ${file.name}`;
          }
        } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
          // TXT dosyası için direkt metin oku
          extractedText = await file.text();
        } else if (
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.name.toLowerCase().endsWith('.doc') || 
          file.name.toLowerCase().endsWith('.docx')
        ) {
          // DOC/DOCX dosyasından metin çıkarmak için Mammoth.js kullan
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value; // The raw text
            if (result.messages && result.messages.length > 0) {
              result.messages.forEach(msg => console.warn("Mammoth message:", msg));
            }
          } catch (error) {
            console.error('Mammoth.js DOCX ayrıştırma hatası:', error);
            extractedText = `Word dosyası metni çıkarılamadı: ${file.name}`;
          }
        } else {
          extractedText = `Desteklenmeyen dosya türü: ${file.name}`;
        }
        return extractedText;
      });
      const allExtractedTexts = await Promise.all(fileProcessingPromises);
      textToSimplify = allExtractedTexts.filter(Boolean).join('\n\n--- YENİ SAYFA ---\n\n');
    } else {
      throw new Error('Desteklenmeyen içerik türü.');
    }

    if (!textToSimplify || textToSimplify.trim() === '') {
      throw new Error('Yüklenen dosyalarda sadeleştirilecek metin bulunamadı.');
    }

    // Yeni prompt: 3 başlık + entity extraction (GENİŞLETİLMİŞ)
    const prompt = `Aşağıdaki metni üç aşamalı olarak işle. Her aşamanın başına ve sonuna mutlaka ve BÜYÜK HARFLERLE, satır başında ve tek başına sırasıyla '## BELGE ÖZETİ ##', '## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##', '## ŞİMDİ NE YAPMALIYIM? ##' başlıklarını ekle. Hiçbir bölümü atlama, her başlık ve bölüm ZORUNLU ve DOLU olmalı, asla boş bırakma! BELGE ÖZETİ kısmında kritik bilgileri **kalın** (çift yıldızla) vurgula. ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON kısmında hem sadeleştirilmiş metni hem de kullanıcının anlaması için özet ve açıklamaları birleştir. ŞİMDİ NE YAPMALIYIM? kısmında her adımı madde madde ve en az 2 öneriyle yaz.

Ayrıca, sadeleştirilmiş metindeki önemli varlıkları aşağıdaki gibi bir JSON dizisi olarak çıkar. Lütfen sadece geçerli JSON döndür, açıklama ekleme. Varlık tipleri ve örnekleri:
- Kişi adları (ör: kiracı, kiralayan, kefil, vekil)
- Kimlik bilgileri (ör: T.C. kimlik no, vergi no)
- Tarihler (ör: sözleşme başlangıç ve bitiş tarihi, tahliye tarihi, artış tarihi)
- Tutarlar (ör: kira bedeli, depozito, cezai şart)
- Adresler (ör: kiralanan yerin adresi)
- Sözleşme süresi (ör: 1 yıl, 12 ay)
- Taşınmaz bilgileri (ör: tapu, ada/parsel, bağımsız bölüm)
- İletişim bilgileri (ör: telefon, e-posta)
- Ödeme bilgileri (ör: ödeme şekli, banka hesabı, ödeme günü)
- Zam oranı ve artış şartları (ör: %25, TÜFE, artış tarihi)
- Fesih ve tahliye şartları (ör: erken fesih, tahliye tarihi, cezai şart)
- Ek sözleşme maddeleri (ör: özel hükümler, ek protokol)
- Yetkili mahkeme ve icra dairesi
- Diğer önemli bilgiler

Çıktı örneği:
[
  { "tip": "Kişi", "değer": "Ahmet Yılmaz", "rol": "Kiracı" },
  { "tip": "Kişi", "değer": "Mehmet Demir", "rol": "Kiralayan" },
  { "tip": "Kimlik", "değer": "12345678901", "açıklama": "Kiracı T.C. Kimlik No" },
  { "tip": "Tarih", "değer": "01.01.2024", "açıklama": "Başlangıç tarihi" },
  { "tip": "Tutar", "değer": "15.000 TL", "açıklama": "Aylık kira bedeli" },
  { "tip": "Adres", "değer": "İstanbul, Kadıköy, ...", "açıklama": "Kiralık daire adresi" },
  { "tip": "Süre", "değer": "12 ay", "açıklama": "Sözleşme süresi" },
  { "tip": "Taşınmaz", "değer": "Ada: 123, Parsel: 456", "açıklama": "Tapu bilgisi" },
  { "tip": "İletişim", "değer": "0555 555 55 55", "açıklama": "Kiracı telefon" },
  { "tip": "Ödeme", "değer": "Her ayın 5'i", "açıklama": "Ödeme günü" },
  { "tip": "Zam", "değer": "%25", "açıklama": "Yıllık zam oranı" },
  { "tip": "Fesih", "değer": "Erken fesih halinde 2 aylık bedel", "açıklama": "Cezai şart" },
  { "tip": "Ek Madde", "değer": "Evcil hayvan yasaktır", "açıklama": "Özel hüküm" },
  { "tip": "Mahkeme", "değer": "Kadıköy Sulh Hukuk Mahkemesi", "açıklama": "Yetkili mahkeme" }
]

Format:
## BELGE ÖZETİ ##
...

## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##
...

## ŞİMDİ NE YAPMALIYIM? ##
...

[JSON]

Şimdi aşağıdaki metni bu formatta işle:

${textToSimplify}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) throw new Error(`Gemini API hatası: ${geminiResponse.status}`);
    const geminiData = await geminiResponse.json();
    const fullText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!fullText) throw new Error('Gemini API yanıtı beklenen formatta değil.');

    // Cevabı ayır: summary, simplifiedText, actionPlan (## ... ## başlıklarına göre) + entities JSON
    const summaryMatch = fullText.match(/## BELGE ÖZETİ ##([\s\S]*?)(?=## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##)/);
    const simplifiedMatch = fullText.match(/## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##([\s\S]*?)(?=## ŞİMDİ NE YAPMALIYIM\? ##)/);
    const actionPlanMatch = fullText.match(/## ŞİMDİ NE YAPMALIYIM\? ##([\s\S]*?)(?=\n\[|\n\s*\[|$)/);
    const entitiesMatch = fullText.match(/\n\s*(\[.*\])\s*$/s);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    const simplifiedText = simplifiedMatch ? simplifiedMatch[1].trim() : '';
    let actionPlan = actionPlanMatch ? actionPlanMatch[1].trim() : '';
    let entities: unknown[] = [];
    if (entitiesMatch) {
      try {
        entities = JSON.parse(entitiesMatch[1].replace(/'/g, '"'));
      } catch (e) {
        entities = [];
      }
    }

    if (!actionPlan) {
      const planPrompt = `Aşağıda bir hukuki belgenin özeti ve sadeleştirilmiş açıklaması yer alıyor. Kullanıcının atması gereken adımları madde madde, net ve uygulanabilir biçimde sırala. En az 2 ve en fazla 5 madde yaz. Her madde kısa ve eylem odaklı olsun.\n\nÖZET:\n${summary}\n\nAÇIKLAMA:\n${simplifiedText}\n\nMADDE MADDE EYLEM PLANI:`;
      const planResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: planPrompt }] }] })
      });
      if (planResp.ok) {
        const planData = await planResp.json();
        actionPlan = planData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      }
    }

    return new Response(JSON.stringify({ summary, simplifiedText, actionPlan, entities }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});