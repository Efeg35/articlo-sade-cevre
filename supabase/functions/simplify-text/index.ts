// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import mammoth from "https://esm.sh/mammoth@1.7.0";

// --- Gerekli TypeScript Tipleri (summary eklendi) ---
interface ExtractedEntity {
  entity: string;
  value: string | number;
}
interface ActionableStep {
  description: string;
  actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
  documentToCreate?: string;
}
interface AnalysisResponse {
  summary: string; // YENİ EKLENDİ
  simplifiedText: string;
  documentType: string;
  extractedEntities: ExtractedEntity[];
  actionableSteps: ActionableStep[];
}

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const modelName = 'gemini-1.5-flash-latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Ana Fonksiyon ---
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      throw new Error('Sunucu hatası: GEMINI_API_KEY yapılandırılmamış.');
    }

    let textToAnalyze: string | undefined;
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await req.json();
      textToAnalyze = body.text;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files = formData.getAll('files') as File[];
      if (!files || files.length === 0) {
        throw new Error('Formda "files" adında bir dosya bulunamadı.');
      }
      const file = files[0];

      if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.doc') ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        textToAnalyze = result.value;
      } else {
        throw new Error(`Desteklenmeyen dosya türü: ${file.type}. Şimdilik sadece .docx desteklenmektedir.`);
      }
    } else {
      throw new Error(`Desteklenmeyen içerik türü: ${contentType}`);
    }

    if (!textToAnalyze || textToAnalyze.trim() === '') {
      throw new Error('Analiz edilecek metin bulunamadı.');
    }
    
    // --- Gemini Prompt'u (Özet istemi eklendi ve Eylem Planı Geliştirildi) ---
    const smartPrompt = `
    SENARYO: Sen, Türkiye hukuk sistemine hakim, uzman bir avukat asistanı yapay zekasın. Görevin, sana verilen hukuki metinleri analiz edip yapılandırılmış bir JSON formatında detaylı bir rapor sunmaktır.

    GÖREV: Sana aşağıda V-E-R-İ başlığı altında sunulan metni analiz et ve aşağıdaki adımları tamamla:
    1.  Metnin en kritik noktalarını (taraflar, tarihler, tutarlar, temel talep) içeren, 1-2 paragraflık bir yönetici özeti oluştur ve bunu \`summary\` alanına yaz. Bu özetteki en önemli bilgileri (son başvuru tarihi, para miktarı vb.) **kalın** (çift yıldız ile) olarak vurgula.
    2.  Metni, hukuki terminolojiden arındırarak herkesin anlayabileceği sade bir Türkçeye çevir ve bunu \`simplifiedText\` alanına yaz.
    3.  Metnin yasal türünü belirle (Ör: "İcra Emri", "Kira Sözleşmesi", "İhtarname", "Bilinmiyor" vb.) ve bunu \`documentType\` alanına yaz.
    4.  Metnin içindeki kritik bilgileri (tarafların adları, tarihler, dosya numaraları, para tutarları vb.) "varlık" (entity) olarak çıkar. Her varlığı bir \`entity\` (türü) ve \`value\` (değeri) olarak \`extractedEntities\` dizisine ekle.
    5.  Belgenin türüne göre, kullanıcının atabileceği 1-2 adet mantıklı ve eyleme geçirilebilir adım öner. Her adımı \`description\`, \`actionType\` ve (gerekirse) \`documentToCreate\` alanlarını içeren bir nesne olarak \`actionableSteps\` dizisine ekle. 
        
        // --- YENİ EKLENEN KURAL BURADA ---
        **ÖNEMLİ KURAL:** Eğer metin bir karara itiraz etme (istinaf, temyiz, karar düzeltme), bir talebe cevap verme, bir sözleşme hazırlama veya resmi bir bildirimde bulunma gibi bir sonraki yasal adımı açıkça içeriyorsa, bu adımı gerçekleştirecek bir belge oluşturmayı ("İstinaf Dilekçesi Oluştur", "Cevap Dilekçesi Hazırla" gibi bir açıklamayla) \`actionType: 'CREATE_DOCUMENT'\` olarak **mutlaka önceliklendir.** Sadece bilgilendirici adımlar sunmak yeterli değildir.
        // --- YENİ KURAL SONU ---

    KURALLAR:
    - Cevabın SADECE ve SADECE yukarıda tarif edilen yapıya uygun, geçerli bir JSON nesnesi olmalıdır.
    - JSON dışında hiçbir metin, açıklama veya markdown formatı (\`json\` bloğu dahil) kullanma. Sadece ham JSON döndür.

    V-E-R-İ:
    ---
    ${textToAnalyze}
    ---
    `;

    // --- Gemini API Çağrısı ve Güvenilir JSON İşleme ---
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
    if (!rawContent) throw new Error('Gemini API yanıtı boş veya geçersiz.');

    const startIndex = rawContent.indexOf('{');
    const endIndex = rawContent.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) throw new Error('AI yanıtında JSON bulunamadı.');
    
    const jsonString = rawContent.substring(startIndex, endIndex + 1);
    const parsedResponse: AnalysisResponse = JSON.parse(jsonString);

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Fonksiyon Hatası:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});