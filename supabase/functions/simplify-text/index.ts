import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Supabase projenizin ayarlarından (Environment Variables) alınır.
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req)=>{
  // CORS preflight (OPTIONS) isteğini yönetme
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // API anahtarının ayarlanıp ayarlanmadığını kontrol et
    if (!geminiApiKey) {
      throw new Error('Gemini API anahtarı ayarlanmamış.');
    }

    // İstek gövdesinden metni al
    const { text } = await req.json();
    if (!text) {
      throw new Error('Metin alanı zorunludur.');
    }

    // Yapay zeka için komutu (prompt) oluştur
    const prompt = `Aşağıdaki karmaşık hukuki veya resmi metni, Türkiye'de yaşayan ve hukuk terminolojisine hakim olmayan sıradan bir vatandaşın anlayabileceği şekilde, son derece basit, sade ve net bir dille yeniden yaz. Metni, sanki bilgili ve yardımsever bir arkadaş açıklıyormuş gibi samimi bir tonda kaleme al. Metnin ana fikrini, kimin ne yapması gerektiğini ve önemli tarih veya para miktarlarını koru. Gerekirse teknik terimleri 'yani' veya 'başka bir deyişle' gibi ifadelerle açıkla. Sonuna mutlaka 'Unutma, bu metin sadece bilgilendirme amaçlıdır ve yasal bir tavsiye değildir.' şeklinde bir uyarı ekle. İşte sadeleştirilecek metin:\n\n${text}`;

    // Gemini API'sine isteği gönder (DOĞRU MODEL ADI İLE)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    // API'den gelen yanıt başarılı değilse hata fırlat
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    // Yanıtı işle ve sadeleştirilmiş metni çıkar
    const data = await response.json();
    const simplifiedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!simplifiedText) {
      throw new Error('Gemini API yanıtı beklenen formatta değil.');
    }

    // Başarılı sonucu istemciye geri gönder
    return new Response(JSON.stringify({
      simplifiedText
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // Herhangi bir hata olursa yakala ve istemciye bildir
    console.error('simplify-text fonksiyonunda hata:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Metin sadeleştirilirken bir hata oluştu.'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});