import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      const ocrPromises = files.map(async (file) => {
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
        const extractedText = visionData.responses?.[0]?.fullTextAnnotation?.text;
        await supabaseAdmin.storage.from('document-images').remove([filePath]);
        return extractedText || '';
      });
      const allExtractedTexts = await Promise.all(ocrPromises);
      textToSimplify = allExtractedTexts.filter(Boolean).join('\n\n--- YENİ SAYFA ---\n\n');
    } else {
      throw new Error('Desteklenmeyen içerik türü.');
    }

    if (!textToSimplify || textToSimplify.trim() === '') {
      throw new Error('Yüklenen dosyalarda sadeleştirilecek metin bulunamadı.');
    }

    // Üç başlık: BELGE ÖZETİ, ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON, ŞİMDİ NE YAPMALIYIM?
    const prompt = `Aşağıdaki metni üç aşamalı olarak işle. Her aşamanın başına ve sonuna mutlaka ve BÜYÜK HARFLERLE, satır başında ve tek başına sırasıyla '## BELGE ÖZETİ ##', '## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##', '## ŞİMDİ NE YAPMALIYIM? ##' başlıklarını ekle. Hiçbir bölümü atlama, her başlık ve bölüm ZORUNLU ve DOLU olmalı, asla boş bırakma! BELGE ÖZETİ kısmında kritik bilgileri **kalın** (çift yıldızla) vurgula. ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON kısmında hem sadeleştirilmiş metni hem de kullanıcının anlaması için özet ve açıklamaları birleştir. ŞİMDİ NE YAPMALIYIM? kısmında her adımı madde madde ve en az 2 öneriyle yaz. Her başlık ve bölüm arasında en az bir boş satır bırak. Aşağıda örnek çıktı formatı verilmiştir:

## BELGE ÖZETİ ##
Bu sözleşme ile **15.04.2025** tarihinden itibaren **1 yıl** süreyle **Karabağlar/İzmir'deki 2+1 daire** kiralanmıştır. **Yıllık kira bedeli 228.000 TL** ve **depozito 19.000 TL**'dir. Kiracı, tüm faturalar ve hasarlardan sorumludur.

## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##
Bu belgeye göre, Karabağlar/İzmir'deki daireyi 1 yıl boyunca kiralıyorsunuz. Yıllık kira 228.000 TL, depozito 19.000 TL. Faturalar ve hasarlar size ait. Tahliye için 1 ay önceden bildirim şart. Sözleşmeyi dikkatlice okuyun ve yükümlülüklerinizi yerine getirin.

## ŞİMDİ NE YAPMALIYIM? ##
1. Sözleşmeyi dikkatlice okuyun ve anlamadığınız noktaları not alın.
2. Kira ve depozito ödemelerini zamanında yapın.
3. Dairenin teslimi ve tahliye şartlarına uyun.

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

    // Cevabı ayır: summary, simplifiedText, actionPlan (## ... ## başlıklarına göre)
    const summaryMatch = fullText.match(/## BELGE ÖZETİ ##([\s\S]*?)(?=## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##)/);
    const simplifiedMatch = fullText.match(/## ANLAŞILMASI KOLAYLAŞTIRILMIŞ VERSİYON ##([\s\S]*?)(?=## ŞİMDİ NE YAPMALIYIM\? ##)/);
    const actionPlanMatch = fullText.match(/## ŞİMDİ NE YAPMALIYIM\? ##([\s\S]*)$/);
    let summary = summaryMatch ? summaryMatch[1].trim() : '';
    let simplifiedText = simplifiedMatch ? simplifiedMatch[1].trim() : '';
    let actionPlan = actionPlanMatch ? actionPlanMatch[1].trim() : '';

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

    return new Response(JSON.stringify({ summary, simplifiedText, actionPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});