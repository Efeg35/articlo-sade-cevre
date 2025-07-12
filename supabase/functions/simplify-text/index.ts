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
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await req.json();
      textToSimplify = body.text;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      // BİRDEN ÇOK DOSYAYI DOĞRU ŞEKİLDE AL
      const files = formData.getAll('files') as File[];
      
      if (!files || files.length === 0) {
        throw new Error('Dosya yüklenemedi.');
      }

      const allExtractedTexts: string[] = [];

      // HER BİR DOSYA İÇİN DÖNGÜ OLUŞTUR
      for (const file of files) {
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
        if (extractedText) {
          allExtractedTexts.push(extractedText);
        }

        await supabaseAdmin.storage.from('document-images').remove([filePath]);
      }
      
      // Tüm metinleri birleştir
      textToSimplify = allExtractedTexts.join('\n\n--- YENİ SAYFA ---\n\n');

    } else {
      throw new Error('Desteklenmeyen içerik türü.');
    }

    if (!textToSimplify || textToSimplify.trim() === '') {
      throw new Error('Yüklenen dosyalarda sadeleştirilecek metin bulunamadı.');
    }

    // Gemini API'si ile metni sadeleştir
    const prompt = `Aşağıdaki karmaşık hukuki veya resmi metni, Türkiye'de yaşayan ve hukuk terminolojisine hakim olmayan sıradan bir vatandaşın anlayabileceği şekilde, son derece basit, sade ve net bir dille yeniden yaz... İşte sadeleştirilecek metin:\n\n${textToSimplify}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) throw new Error(`Gemini API hatası: ${geminiResponse.status}`);
    const geminiData = await geminiResponse.json();
    const simplifiedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!simplifiedText) throw new Error('Gemini API yanıtı beklenen formatta değil.');

    return new Response(JSON.stringify({ simplifiedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});