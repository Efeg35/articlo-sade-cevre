// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Tiplerimizi tanımlıyoruz
interface Kisi { ad_soyad: string; tc_kimlik?: string; adres?: string; }
interface ItirazNedeni { tip: string; aciklama: string; }
interface KullaniciGirdileri { makam_adi: string; dosya_no?: string; itiraz_eden_kisi: Kisi; alacakli_kurum?: { unvan: string; adres?: string; }; itiraz_nedenleri?: ItirazNedeni[]; talep_sonucu: string; ekler?: string[]; }
interface DraftRequest { belge_turu: string; kullanici_girdileri: KullaniciGirdileri; }

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const modelName = 'gemini-1.5-flash-latest';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    // Sizin "Master Prompt"unuz
    const geminiPrompt = `
### ROL ATAMASI (ROLE ASSIGNMENT)
Sen, Türkiye hukuk sistemine hakim, dilekçe ve hukuki yazışma formatları konusunda uzman, deneyimli bir yardımcı hukuk personeli (paralegal) rolünü üstleniyorsun. Görevin, sağlanan yapılandırılmış verileri kullanarak, dilbilgisi ve formatlama açısından kusursuz, resmi ve profesyonel hukuki belgeler hazırlamaktır.
### GÖREV TANIMI (TASK DEFINITION)
Aşağıda 'KULLANICI GİRDİLERİ' bölümünde JSON formatında verilen bilgileri kullanarak, belirtilen \`belge_turu\`'ne uygun bir hukuki dilekçe metni oluştur.
### UYULMASI GEREKEN KURALLAR VE FORMAT
1.  **Dil ve Ton:**
    * Dil, kesinlikle resmi, saygılı ve objektif olmalıdır.
    * Argo, kısaltma, duygusal veya abartılı ifadelerden kaçın.
    * Gereksiz olmadığı sürece, anlaşılması zor eski hukuki terimler yerine modern ve net bir Türkçe kullan.
2.  **Yapısal Format (Çok Önemli):**
    * Oluşturulacak metin, standart bir Türk dilekçe formatına birebir uymalıdır. Sıralama şu şekilde olmalıdır:
        * **MAKAM ADI:** Belgenin sunulacağı makam büyük harflerle yazılmalıdır (Örn: "İSTANBUL ANADOLU 3. İCRA HUKUK MAHKEMESİ'NE").
        * **TARAFLAR:** Davacı/İtiraz Eden, Vekili, Davalı/Alacaklı gibi tarafların bilgileri net bir şekilde belirtilmelidir.
        * **KONU:** "KONU: ...'dan ibarettir." formatında, talebi bir cümleyle özetlemelidir.
        * **AÇIKLAMALAR:** Kullanıcının verdiği serbest metin ve seçtiği seçenekler, mantıksal bir akış içinde, numaralandırılmış paragraflar halinde sunulmalıdır. Her paragraf net ve tek bir konuya odaklanmalıdır.
        * **HUKUKİ SEBEPLER:** "HUKUKİ SEBEPLER: İİK, HMK ve ilgili sair mevzuat." gibi standart bir ifade kullanılmalıdır.
        * **SONUÇ VE İSTEM:** "SONUÇ VE İSTEM: Yukarıda arz ve izah edilen nedenlerle, ... taleplerimin kabulüne karar verilmesini saygılarımla arz ve talep ederim." gibi resmi bir dille, kullanıcının talepleri net maddeler halinde sıralanmalıdır.
        * **TARİH ve İMZA BLOĞU:** Sağ alt köşeye "İtiraz Eden / Davacı" ve "Ad Soyad / İmza" için bir blok bırakılmalıdır.
        * **EKLER (EKler):** Kullanıcı ek belge belirttiyse, "EKLER:" başlığı altında listelenmelidir.
3.  **YASAL UYARI (ZORUNLU):**
    * Oluşturulan her belgenin en altına, metnin geri kalanından net bir şekilde ayrılacak biçimde, aşağıdaki yasal uyarıyı **mutlaka** ekle:
        > \`***\`
        > \`Yasal Uyarı: Bu belge, Artiklo yazılımı tarafından kullanıcı tarafından sağlanan bilgilere göre oluşturulmuş bir taslaktır. Hukuki bir tavsiye niteliği taşımaz. Bu belgeyi kullanmadan önce mutlaka bir avukata danışmanız önerilir.\`
### KULLANICI GİRDİLERİ (USER INPUTS)
${userInputJson}
### BEKLENEN ÇIKTI (EXPECTED OUTPUT)
(SADECE ve SADECE oluşturulan belgenin ham metni...)
    `;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] }),
    });

    if (!response.ok) throw new Error(`Gemini API hatası: ${response.status} ${await response.text()}`);

    const data = await response.json();
    const draftedDocument = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!draftedDocument) {
      throw new Error('Gemini API yanıtı boş veya geçersiz.');
    }

    // Sadece ve sadece temizlenmiş belge metnini döndürüyoruz
    return new Response(JSON.stringify({ draftedDocument }), {
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