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

    // Gelişmiş prompt: Başlıklar büyük harf ve zorunlu
    const prompt = `Aşağıdaki metni üç aşamalı olarak işle. Her aşamanın başına mutlaka ve BÜYÜK HARFLERLE, satır başında sırasıyla 'BELGE ÖZETİ', 'SİZİN İÇİN ANLAMI' ve '---' başlıklarını ekle. Hiçbir bölümü atlama, her başlık zorunlu olsun.

1. BELGE ÖZETİ başlığı altında, en kritik bilgileri (ör. son başvuru tarihi, duruşma günü, para miktarı, taraflar, önemli yükümlülükler) içeren, 2-3 paragraflık kısa bir özet yaz. Bu özetin içinde kritik bilgileri **kalın** yaparak vurgula. Açık, sade ve anlaşılır bir dil kullan.

2. SİZİN İÇİN ANLAMI başlığı altında, bu belgenin kullanıcıyı nasıl etkilediğini, kullanıcının neyle karşı karşıya olduğunu ve hangi önemli yükümlülükleri olduğunu kısa ve doğrudan bir dille özetle. Kişisel ve net bir açıklama yap.

3. Son olarak --- ayırıcıdan sonra, metnin tamamını sadeleştir. Sadeleştirilmiş metinde başlık veya açıklama ekleme, sadece sadeleştirilmiş metni ver.

İşte sadeleştirilecek metin:

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

    // Cevabı ayır: summary, meaning, simplifiedText (büyük/küçük harf toleranslı)
    const summaryMatch = fullText.match(/^(BELGE ÖZETİ|Belge Özeti)[\s\S]*?(?=^SİZİN İÇİN ANLAMI|^Sizin İçin Anlamı|^SİZİN İÇİN ANLAMI\n|^Sizin İçin Anlamı\n|^SİZİN İÇİN ANLAMI\r?\n|^Sizin İçin Anlamı\r?\n)/m);
    const meaningMatch = fullText.match(/^(SİZİN İÇİN ANLAMI|Sizin İçin Anlamı)[\s\S]*?(?=^---|^---\n|^---\r?\n)/m);
    const simplifiedRaw = fullText.split(/\n?-{3,}\n?/)[1];
    const summary = summaryMatch ? summaryMatch[0].replace(/^(BELGE ÖZETİ|Belge Özeti)\s*/i, '').trim() : '';
    const meaning = meaningMatch ? meaningMatch[0].replace(/^(SİZİN İÇİN ANLAMI|Sizin İçin Anlamı)\s*/i, '').trim() : '';
    const simplifiedText = simplifiedRaw ? simplifiedRaw.trim() : '';

    return new Response(JSON.stringify({ summary, meaning, simplifiedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});