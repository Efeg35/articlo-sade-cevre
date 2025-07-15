// @ts-expect-error Deno ortamı, tip bulunamıyor
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error Deno ortamı, tip bulunamıyor
import mammoth from "https://esm.sh/mammoth@1.7.0";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import { decode } from "https://deno.land/x/djwt@v2.8/mod.ts";

// @ts-expect-error Deno ortamı, tip bulunamıyor
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
      // @ts-expect-error Deno ortamı, tip bulunamıyor
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-expect-error Deno ortamı, tip bulunamıyor
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- JWT'den kullanıcıyı çek ---
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header eksik.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const jwt = authHeader.replace('Bearer ', '');
    let userId: string | undefined;
    try {
      const payload = await decode(jwt);
      // Supabase JWT payload'ında 'sub' alanı user id'dir
      if (Array.isArray(payload)) {
        const payloadObj = payload[1] as Record<string, unknown>;
        userId = payloadObj.sub as string;
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: 'JWT çözümlenemedi.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Kullanıcı kimliği bulunamadı.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    // Profili çek
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profil bulunamadı.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (profile.credits < 1) {
      return new Response(JSON.stringify({ error: 'Yetersiz kredi. Yeni belge sadeleştirmek için krediniz yok.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const user = { id: userId };
    
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

    // ADIM 1: Özet ve Sadeleştirilmiş Metni Oluştur
    const simplificationPrompt = `Aşağıdaki karmaşık hukuki metni analiz et ve iki bölümde yanıt ver. Her bölümün başına BÜYÜK HARFLERLE '## BELGE ÖZETİ ##' ve '## ANLAŞILIR VERSİYON ##' başlıklarını ekle.
- 'BELGE ÖZETİ' bölümünde, metnin en kritik noktalarını (taraflar, tarihler, tutarlar, temel talep/konu) içeren kısa, 1-2 paragraflık bir yönetici özeti sun. Bu özetteki en önemli bilgileri (son başvuru tarihi, para miktarı, vb.) **kalın** (çift yıldız ile) olarak vurgula.
- 'ANLAŞILIR VERSİYON' bölümünde, belgenin tamamını ortalama bir vatandaşın anlayacağı şekilde, basit ve akıcı bir dille yeniden yaz.

METİN:
---
${textToSimplify}
---
`;

    const simplificationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: simplificationPrompt }] }] })
    });
    if (!simplificationResponse.ok) throw new Error(`Gemini sadeleştirme API hatası: ${simplificationResponse.status}`);
    
    const simplificationData = await simplificationResponse.json();
    const simplifiedContent = simplificationData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!simplifiedContent) throw new Error('Gemini sadeleştirme API yanıtı boş.');

    const summaryMatch = simplifiedContent.match(/## BELGE ÖZETİ ##([\s\S]*?)(?=## ANLAŞILIR VERSİYON ##|$)/);
    const simplifiedMatch = simplifiedContent.match(/## ANLAŞILIR VERSİYON ##([\s\S]*)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "Özet oluşturulamadı.";
    const simplifiedText = simplifiedMatch ? simplifiedMatch[1].trim() : "Sadeleştirilmiş metin oluşturulamadı.";

    // ADIM 2: Eylem Planı Oluştur
    const actionPlanPrompt = `Aşağıda bir hukuki durumun özeti ve açıklaması yer alıyor. Bu bilgilere dayanarak, kullanıcının atması gereken adımları "Şimdi Ne Yapmalıyım?" başlığı altında, kısa ve net maddeler halinde sırala. En az 2, en fazla 5 eylem önerisi sun. Önerilerin somut ve pratik olsun.

ÖZET:
${summary}

AÇIKLAMA:
${simplifiedText}
`;
    const actionPlanResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: actionPlanPrompt }] }] })
    });

    let actionPlan = "Eylem planı oluşturulamadı.";
    if (actionPlanResponse.ok) {
        const actionPlanData = await actionPlanResponse.json();
        actionPlan = actionPlanData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || actionPlan;
    }

    // ADIM 3: Kilit Varlıkları Çıkar
    const entitiesPrompt = `Aşağıdaki metinden kilit hukuki varlıkları (Entity) çıkar ve bir JSON dizisi olarak döndür. Sadece JSON çıktısı ver, başka bir açıklama ekleme. JSON formatı: [{"tip": "Varlık Türü", "değer": "Varlık Değeri", "rol": "Opsiyonel Rol"}].
Varlık Tipleri: Kişi, Kurum, Tarih, Tutar, Adres, Süre, Kanun/Madde, Kimlik No, Mahkeme.

METİN:
---
${textToSimplify}
---
`;
    const entitiesResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: entitiesPrompt }] }] })
    });
    
    let entities: unknown[] = [];
    if (entitiesResponse.ok) {
        const entitiesData = await entitiesResponse.json();
        const rawEntities = entitiesData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (rawEntities) {
            try {
                // Gemini'den gelebilecek markdown formatını temizle
                const jsonString = rawEntities.replace(/```json\n?/, '').replace(/```$/, '');
                entities = JSON.parse(jsonString);
            } catch (e) {
                console.error("JSON parse hatası:", e);
                entities = [];
            }
        }
    }
    
    // Kredi azaltma işlemini atomik ve güvenli yap
    const { error: creditError } = await supabaseAdmin.rpc('decrement_credit', { user_id_param: user.id });
    if (creditError) {
      console.error('Kredi azaltılamadı:', creditError.message);
    }

    return new Response(JSON.stringify({ summary, simplifiedText, actionPlan, entities }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});