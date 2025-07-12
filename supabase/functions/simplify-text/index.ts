import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// API Anahtarları
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
      throw new Error('Gemini API anahtarı ayarlanmamış.');
    }

    // Supabase Admin Client'ı oluştur (Storage için gerekli)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    let textToSimplify: string | undefined;
    const contentType = req.headers.get('content-type');

    // GELEN İSTEĞİN TÜRÜNÜ KONTROL ET
    if (contentType?.includes('application/json')) {
      const body = await req.json();
      textToSimplify = body.text;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) throw new Error('Dosya yüklenmedi.');

      // 1. Dosyayı Supabase Storage'a yükle
      const filePath = `public/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('document-images')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Yüklenen dosyanın public URL'ini al
      const { data: urlData } = supabaseAdmin.storage
        .from('document-images')
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // 3. Google Vision API ile OCR işlemi yap
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
      textToSimplify = visionData.responses?.[0]?.fullTextAnnotation?.text;

      // İsteğe bağlı: Geçici dosyayı sil
      await supabaseAdmin.storage.from('document-images').remove([filePath]);
    } else {
      throw new Error('Desteklenmeyen içerik türü.');
    }

    if (!textToSimplify) {
      throw new Error('Sadeleştirilecek metin bulunamadı.');
    }

    // 4. Gemini API'si ile metni sadeleştir
    const prompt = `Aşağıdaki karmaşık hukuki veya resmi metni, Türkiye'de yaşayan ve hukuk terminolojisine hakim olmayan sıradan bir vatandaşın anlayabileceği şekilde, son derece basit, sade ve net bir dille yeniden yaz. Metni, sanki bilgili ve yardımsever bir arkadaş açıklıyormuş gibi samimi bir tonda kaleme al. Metnin ana fikrini, kimin ne yapması gerektiğini ve önemli tarih veya para miktarlarını koru. Gerekirse teknik terimleri 'yani' veya 'başka bir deyişle' gibi ifadelerle açıkla. Sonuna mutlaka 'Unutma, bu metin sadece bilgilendirme amaçlıdır ve yasal bir tavsiye değildir.' şeklinde bir uyarı ekle. İşte sadeleştirilecek metin:\n\n${textToSimplify}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json();
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Gemini API hatası: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const simplifiedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!simplifiedText) {
      throw new Error('Gemini API yanıtı beklenen formatta değil.');
    }

    return new Response(JSON.stringify({ simplifiedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('simplify-text fonksiyonunda hata:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});