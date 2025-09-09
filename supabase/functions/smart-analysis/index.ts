// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Declare Deno global for TypeScript
declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

// TypeScript interfaces for structured response
interface ExtractedEntity {
  entity: string; // e.g., "File Number", "Plaintiff Name", "Amount"
  value: string | number;
}

interface ActionableStep {
  description: string; // e.g., "You can object to this decision within 7 days."
  actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
  documentToCreate?: string; // If actionType is CREATE_DOCUMENT. e.g., 'EXECUTION_OBJECTION_PETITION'
}

// Gerekli TypeScript tiplerini tanımlıyoruz
interface AnalysisResponse {
  simplifiedText: string;
  documentType: string;
  extractedEntities: ExtractedEntity[];
  actionableSteps: ActionableStep[];
}

// Rate limiting sınıfı
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 20, timeWindowMs = 60000) { // 20 requests per minute
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Eski istekleri temizle
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

// Global rate limiter
const rateLimiter = new RateLimiter(20, 60000); // 20 requests per minute

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting kontrolü
    if (!rateLimiter.canMakeRequest()) {
      const waitTime = rateLimiter.getWaitTime();
      throw new Error(`Çok fazla istek. ${Math.ceil(waitTime / 1000)} saniye sonra tekrar deneyin.`);
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    // Model seçimi: Freemium vs Pro (şu an sadece freemium aktif)
    const isProActive = false; // TODO: Pro abonelik açıldığında user subscription kontrolü yapılacak
    const modelName = isProActive ? 'gemini-1.5-pro-latest' : 'gemini-1.5-flash-latest';
    if (!geminiApiKey) throw new Error('Sunucu hatası: GEMINI_API_KEY yapılandırılmamış.');

    const body = await req.json();
    const textToAnalyze = body.text;
    if (!textToAnalyze) throw new Error('İstek gövdesinde analiz edilecek "text" alanı bulunamadı.');

    const smartPrompt = `
    SENARYO: Sen, Türkiye hukuk sistemine hakim, uzman bir avukat asistanı yapay zekasın. Görevin, sana verilen hukuki metinleri analiz edip yapılandırılmış bir JSON formatında detaylı bir rapor sunmaktır.
    GÖREV: Sana aşağıda V-E-R-İ başlığı altında sunulan metni analiz et ve aşağıdaki adımları tamamla:
    1. Metni, hukuki terminolojiden arındırarak herkesin anlayabileceği sade bir Türkçeye çevir ve bunu \`simplifiedText\` alanına yaz.
    2. Metnin yasal türünü belirle (Ör: "İcra Emri", "Kira Sözleşmesi", "İhtarname", "Bilinmiyor" vb.) ve bunu \`documentType\` alanına yaz.
    3. Metnin içindeki kritik bilgileri (tarafların adları, tarihler, dosya numaraları, para tutarları vb.) "varlık" (entity) olarak çıkar. Her varlığı bir \`entity\` (türü) ve \`value\` (değeri) olarak \`extractedEntities\` dizisine ekle.
    4. Belgenin türüne göre, kullanıcının atabileceği 1-2 adet mantıklı ve eyleme geçirilebilir adım öner. Her adımı \`description\`, \`actionType\` ve (gerekirse) \`documentToCreate\` alanlarını içeren bir nesne olarak \`actionableSteps\` dizisine ekle. Eğer adım bir belge oluşturmayı gerektiriyorsa \`actionType\` olarak 'CREATE_DOCUMENT' kullan.
    KURALLAR:
    - Cevabın SADECE ve SADECE yukarıda tarif edilen yapıya uygun, geçerli bir JSON nesnesi olmalıdır.
    - JSON dışında hiçbir metin, açıklama veya markdown formatı (\`json\` bloğu dahil) kullanma. Sadece ham JSON döndür.
    V-E-R-İ:
    ---
    ${textToAnalyze}
    ---
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: smartPrompt }] }] }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API hatası: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error('Gemini API yanıtı boş veya geçersiz.');
    }

    // --- HATA AYIKLAMA (DEBUGGING) BLOĞU ---
    try {
      // JSON'u parse etmeyi normal şekilde deniyoruz
      const startIndex = rawContent.indexOf('{');
      const endIndex = rawContent.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) throw new Error("No JSON object found.");
      const jsonString = rawContent.substring(startIndex, endIndex + 1);
      const parsedResponse: AnalysisResponse = JSON.parse(jsonString);

      // Başarılı olursa, normal yanıtı dönüyoruz
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (e) {
      // HATA OLURSA, BU SEFER HATA VERMEK YERİNE, SORUNLU METNİN KENDİSİNİ DÖNÜYORUZ
      console.error("HATA AYIKLAMA: JSON parse edilemedi. Ham metin aşağıda döndürülüyor.");
      return new Response(JSON.stringify({
        debug_message: "JSON parse edilemedi. Yapay zekadan gelen ham metin aşağıdadır. Lütfen bu metnin tamamını kopyalayıp gönderin.",
        problematic_raw_content: rawContent,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Hata yerine 200 OK dönüyoruz ki yanıtı görebilelim
      });
    }

  } catch (error) {
    console.error('Error in smart-analysis function:', error);
    return new Response(JSON.stringify({
      error: 'Analiz sırasında hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});