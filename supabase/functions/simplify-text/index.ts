// @ts-expect-error Deno ortamı, tip bulunamıyor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import mammoth from "https://esm.sh/mammoth@1.7.0";
// @ts-expect-error Deno ortamı, tip bulunamıyor
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// --- Sizin Tasarladığınız JSON Yapısına Uygun TypeScript Tipleri ---
interface ExtractedEntity { entity: string; value: string | number; }
interface ActionableStep { step: number; description: string; deadline?: string; actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY'; priority: 'high' | 'medium' | 'low'; }
interface RiskItem {
  riskType: string; // e.g., "Yüksek Depozito", "Haksız Şart", "Yasal Sınır Aşımı"
  description: string; // e.g., "Kontratın 3. maddesinde depozito bedeli 10 kira bedeli olarak belirlenmiştir..."
  severity: 'high' | 'medium' | 'low';
  article?: string; // e.g., "3. madde"
  legalReference?: string; // e.g., "6098 sayılı TBK m. 114"
  recommendation?: string; // e.g., "Bu maddeyi müzakere etmeyi kesinlikle tavsiye ederiz"
}
interface GeneratedDocumentParty { role: string; details: string; }
interface GeneratedDocument {
  documentTitle: string;
  addressee: string;
  caseReference: string;
  parties: GeneratedDocumentParty[];
  subject: string;
  explanations: string[];
  legalGrounds: string;
  conclusionAndRequest: string;
  attachments?: string[];
  signatureBlock: string;
}
interface AnalysisResponse {
  summary: string;
  simplifiedText: string;
  documentType: string;
  extractedEntities: ExtractedEntity[];
  actionableSteps: ActionableStep[];
  riskItems?: RiskItem[]; // Yeni risk analizi alanı
  generatedDocument: GeneratedDocument | null;
}

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const modelName = 'gemini-1.5-flash-latest';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sizin yazdığınız prompt'u oluşturan fonksiyon
const createMasterPrompt = (textToAnalyze: string): string => {
  const smartPrompt = `
  SENARYO: Sen, Türkiye Cumhuriyeti hukuk sisteminin tüm inceliklerine hakim, özellikle usul hukuku ve dilekçe yazım teknikleri konusunda uzmanlaşmış, kıdemli bir avukat ve hukukçu yapay zekasın. Amacın, hukuki terminolojiye yabancı olan vatandaşların haklarını korumalarına yardımcı olmak. Sana sunulan resmi belgeyi sadece analiz etmekle kalmayacak, aynı zamanda bu analize dayanarak atılması gereken adımları belirleyecek ve gerekirse profesyonel bir dilekçe taslağı hazırlayacaksın. Vatandaşın avukatı gibi düşünmeli, onun lehine olan tüm detayları yakalamalısın.

  GÖREV: Sana aşağıda "V-E-R-İ" başlığı altında sunulan hukuki metni derinlemesine analiz et ve aşağıdaki üç ana aşamayı tamamlayarak ÇIKTI olarak SADECE geçerli bir JSON nesnesi döndür:

  // --- AŞAMA 1: HUKUKİ ANALİZ VE RAPORLAMA ---

  1.  **Özet (summary):** Metnin en can alıcı noktalarını, hukuki sonuçlarını ve muhatap için ne anlama geldiğini içeren 1-2 paragraflık bir yönetici özeti oluştur. En kritik bilgiler (tarih, tutar, süre gibi) **kalın** olarak işaretlenmelidir.
  2.  **Sadeleştirilmiş Açıklama (simplifiedText):** Metindeki karmaşık hukuki ifadeleri, bir vatandaşın anlayacağı şekilde, "Bu belge size diyor ki..." veya "Basitçe anlatmak gerekirse..." gibi bir başlangıçla adım adım açıkla.
  3.  **Belge Türü (documentType):** Belgenin hukuki niteliğini net bir şekilde tanımla (Örnek: "İcra Takibi Ödeme Emri", "İhtiyati Haciz Kararı", "Cevap Dilekçesi", "Tanık Beyanı", "Trafik Cezası Tutanağı", "Asliye Hukuk Mahkemesi Dava Dilekçesi").
  4.  **Varlık Çıkarımı (extractedEntities):** Metindeki tüm kritik bilgileri, rollerini belirterek çıkar.
    **KESİN KURAL:** Tüm varlıkları, { "entity": "Varlık Türü", "value": "Varlık Değeri" } formatında nesneler olarak, **TEK BİR DÜZ DİZİ (FLAT ARRAY) İÇİNDE** döndür. Varlıkları kendi içinde kategorilere **AYIRMA**.
    * **Örnek Çıktı Formatı:** [ { "entity": "Kararı Veren Mahkeme", "value": "İzmir 30. Asliye Ceza Mahkemesi" }, { "entity": "Sanık", "value": "Adnan Kaymaz" } ]
    * **Kullanılacak Roller:** "Davacı", "Davalı", "Alacaklı", "Borçlu", "Müşteki", "Sanık", "Tanık", "Bilirkişi", "Vekil (Avukat)", "Kararı Veren Mahkeme", "Takibi Yapan İcra Dairesi", "Başvurulan Kurum", "Resmi Kurum", "Dosya Esas No", "Karar No", "İcra Takip No", "Talep Edilen Tutar", "Ceza Miktarı", "Tazminat Miktarı", "Faiz Oranı", "Tebliğ Tarihi", "Son İtiraz Tarihi", "Suç Tarihi", "İsnat Edilen Suç", "Adres", "T.C. Kimlik No", "Kanun/Madde".

  // --- AŞAMA 2: RİSK ANALİZİ ---

  5.  **Riskli Maddeler/Durumlar (riskItems):** Belgede kullanıcı aleyhine olabilecek veya yasal mevzuata aykırı olan maddeleri tespit et. Eğer riskli bir durum yoksa bu alanı boş dizi olarak bırak.
      * **Genel Risk Türleri:** Belge türüne bakmaksızın, aşağıdaki tüm kategorilerdeki riskleri tespit et:

        **A) Temel Riskler:**
        - Yasal Sınır Aşımı
        - Haksız Şart
        - Tek Taraflı Yetki
        - Aşırı Cezai Şart
        - Haksız Sorumluluk
        - Yasal Hak Kısıtlaması
        - Eksik Bilgilendirme
        - Haksız İndirim/Kesinti
        - Yasal Süre Aşımı
        - Dengesiz Fesih
        - Aşırı Taahhüt
        - Haksız Vazgeçme
        - Yasal Usul İhlali
        - Belirsiz Şart
        - Haksız Tazminat
        - Zamanaşımı / Hak Düşürücü Süre İhlali
        - İmza Sirküsü / Yetki İhlali
        - Kanunlara Aykırılık
        - Açık ve Anlaşılırlık Eksikliği
        - Referans Belge Uyuşmazlığı

        **B) Finansal Riskler:**
        - Aşırı Faiz
        - Gizli Maliyet
        - Haksız Komisyon
        - Erken Ödeme Cezası
        - Gecikme Faizi
        - Teminat Şartı
        - Kur Farkı Riski
        - Kefalet Riskleri
        - Temlik (Alacak Devri) Riskleri
        - Ödeme Planı Düzensizliği

        **C) İş Hukuku Riskleri:**
        - Ücretsiz Çalıştırma
        - İş Güvencesi İhlali
        - Sendika Hakkı Kısıtlaması
        - İş Sağlığı İhlali
        - Ücret Kesintisi
        - İş Tanımı Belirsizliği
        - Haksız Fesih Riskleri
        - Mobbing/Psikolojik Taciz Maddeleri
        - Sendikal Hakların Kısıtlanması (Detaylı)
        - İş Sağlığı ve Güvenliği Mevzuatı İhlalleri

        **D) Aile Hukuku Riskleri:**
        - Mal Rejimi İhlali
        - Velayet Hakkı Kısıtlaması
        - Nafaka Hakkı İhlali
        - Evlilik Öncesi Sözleşme
        - Boşanma Şartları
        - Miras Hakkı İhlali
        - Soybağı Riskleri
        - Evlat Edinme Riskleri

        **E) Ticaret Hukuku Riskleri:**
        - Rekabet Yasağı
        - Gizlilik Yükümlülüğü
        - Fikri Mülkiyet İhlali
        - Ticari Sır İhlali
        - Marka Hakkı İhlali
        - Patent Hakkı İhlali
        - Ortaklık Payı Riskleri
        - Şirket Birleşme/Devralma Riskleri
        - Marka Tescil İhlalleri (Detaylı)
        - Tüketici Hukuku İhlalleri

        **F) Sözleşme Hukuku Riskleri:**
        - Mücbir Sebep İhlali
        - Haksız Fesih
        - Sözleşme Değişikliği
        - Yanlış Bilgi
        - Eksik Bilgi
        - Yanıltıcı Reklam
        - Ayıplı Mal/Hizmet Sorumluluğu
        - Gizli Şartlar
        - Yetkili Mahkeme/Tahkim Belirsizliği
        - Sözleşmenin İnfaz Edilemezliği

        **G) Özel Durum Riskleri:**
        - Süre Kısıtlaması
        - Yer Kısıtlaması
        - Meslek Kısıtlaması
        - İlişki Kısıtlaması
        - İletişim Kısıtlaması
        - Sosyal Medya Kısıtlaması
        - Seyahat Kısıtlaması
        - İtibar Yönetimi Riskleri

        **H) Teknoloji ve Veri Riskleri:**
        - Veri Koruma İhlali
        - Kişisel Veri İşleme
        - Dijital Haklar
        - Yazılım Lisansı
        - Bulut Hizmeti
        - E-ticaret Riskleri
        - Açık Kaynak Lisans İhlali
        - Siber Güvenlik Sorumluluğu
        - Yapay Zeka Etiği ve Hukuku
        - Kripto Para ve Blokzincir Hukuku Riskleri

        **I) İdari Hukuk Riskleri:**
        - İdari Para Cezası Riskleri
        - Ruhsat/İzin Riskleri
        - İdari Süreç İhlalleri
        - Kamulaştırma Riskleri

        **J) Uluslararası Ticaret ve Sözleşme Riskleri:**
        - Yabancı Hukuk Uygulanabilirliği Riski
        - Çifte Vergilendirme Anlaşmaları Riskleri
        - Uluslararası Yaptırım ve Ambargo Riskleri

        **K) Fikri ve Sınai Haklar Riskleri (Detaylı):**
        - Faydalı Model / Endüstriyel Tasarım İhlali
        - Alan Adı Uyuşmazlıkları
        - Telif Hakkı Devri/Lisans Riskleri

        **L) Rekabet Hukuku Riskleri (Detaylı):**
        - Kartel ve Tekel Oluşumu İşaretleri
        - Hâkim Durumun Kötüye Kullanımı

        **M) Sermaye Piyasası Hukuku Riskleri:**
        - Halka Arz Belgeleri Riskleri
        - İçerden Öğrenenler Ticareti (Insider Trading) Belirtileri

        **N) Çevre Hukuku Riskleri:**
        - Çevre İzinleri ve Lisansları Eksikliği
        - Çevresel Sorumluluk Maddeleri

        **O) Sağlık Hukuku Riskleri (Daha Derin):**
        - Malpraktis (Hekim Hatası) Sigorta Poliçeleri Analizi
        - Tıbbi Cihaz ve İlaç Hukuku Riskleri

      * **Desteklenen Belge Türleri:**
        - İş Sözleşmesi, Kira Sözleşmesi, Evlilik Sözleşmesi, Boşanma Sözleşmesi, Uzlaşma Kağıdı, Ticari Sözleşme, Hizmet Sözleşmesi, Freelance Sözleşmesi, Kredi Sözleşmesi, Sigorta Sözleşmesi, Franchise Sözleşmesi, Ortaklık Sözleşmesi, Lisans Sözleşmesi, Gizlilik Sözleşmesi, E-ticaret Sözleşmesi, Yazılım Lisans Sözleşmesi, Bulut Hizmet Sözleşmesi, Reklam Sözleşmesi, Danışmanlık Sözleşmesi, Eğitim Sözleşmesi,
        - İpotek Sözleşmesi, Rehin Sözleşmesi, Faktoring Sözleşmesi, Leasing (Finansal Kiralama) Sözleşmesi, Çek/Senet Belgeleri, Bankacılık İşlemleri Belgeleri,
        - Kat Karşılığı İnşaat Sözleşmesi, Eser Sözleşmesi (İnşaat), Taşınmaz Satış Vaadi Sözleşmesi, Tapu Kayıt Örnekleri / Şerhler, İmar Durumu Belgeleri, Ortak Alan Yönetim Planları,
        - Vergi Tebligatları, İdari Para Cezası Kararları, Ruhsatlar/İzinler, Trafik İdari Para Cezası Tebligatları,
        - Dava Dilekçeleri, Cevap Dilekçeleri, İcra Takip Belgeleri, Tebligatlar (Genel), Vekaletnameler, Mahkeme Kararları/İlamlar,
        - Vasiyetnameler, Mirasçılık Belgesi (Veraset İlamı), Miras Taksim Sözleşmesi,
        - İthalat/İhracat Sözleşmeleri, Incoterms Belirlemeleri,
        - Aydınlatılmış Onam Formları, Hasta Hakları Beyanları

  // --- AŞAMA 3: EYLEM PLANI VE DİLEKÇE OLUŞTURMA ---

  6.  **Atılacak Adımlar (actionableSteps):** Belgenin türüne ve içeriğine göre kullanıcı için mantıklı ve stratejik bir eylem planı oluştur. Her adımda ne yapılması gerektiğini, neden önemli olduğunu ve varsa süre kısıtlamalarını belirt.
      * **ÖNCELİKLİ KURAL:** Eğer belgeye cevap verilmesi, itiraz edilmesi, beyanda bulunulması gibi yasal bir zorunluluk veya hak varsa, atılacak adımların en başına \`"actionType": "CREATE_DOCUMENT"\` ve \`"priority": "high"\` ekle. Diğer adımlar (avukata danışma, delil toplama vb.) daha düşük öncelikli olabilir.
      * **RİSK BAĞLAMLI EYLEM:** Eğer riskItems tespit edildiyse, actionableSteps'e bu risklere yönelik somut aksiyon önerileri de ekle. Her risk için:
        - Yüksek riskler için: "Bu maddeyi müzakere etmeyi veya değiştirmeyi kesinlikle tavsiye ederiz"
        - Orta riskler için: "Bu maddeyi gözden geçirmeyi ve gerekirse değiştirmeyi öneririz"
        - Düşük riskler için: "Bu maddeyi kontrol etmeyi öneririz"
      * **BELGE TÜRÜNE ÖZEL EYLEMLER:**
        - İş Sözleşmesi: İş hukuku uzmanına danışma, sendika desteği alma
        - Kira Sözleşmesi: Kiracı derneklerine danışma, yasal hakları öğrenme
        - Evlilik/Boşanma: Aile hukuku uzmanına danışma, noter onayı alma
        - Ticari Sözleşme: Ticaret hukuku uzmanına danışma, şirket avukatına gösterme
        - Uzlaşma Kağıdı: Avukata danışmadan imzalamama, süre kontrolü yapma
      * Örnek Adım: \`{"step": 1, "description": "7 gün içinde icra dairesine itiraz etmelisiniz. Bu süre hak düşürücüdür, kaçırırsanız borç kesinleşir.", "deadline": "Tebliğ tarihinden itibaren 7 gün", "actionType": "CREATE_DOCUMENT", "priority": "high"}\`

  7.  **Oluşturulan Belge Taslağı (generatedDocument):** Eğer \`actionType: 'CREATE_DOCUMENT'\` olarak belirlendiyse, aşağıdaki yapıya birebir uyarak, hukuki usule uygun, eksiksiz ve profesyonel bir dilekçe taslağı oluştur. Eğer belge oluşturmak gerekmiyorsa bu alanı \`null\` olarak bırak.

      * **Dilekçe Başlığı (documentTitle):** Belgenin amacını netleştiren büyük harfli başlık. (Örn: "İCRA TAKİBİNE İTİRAZ DİLEKÇESİ", "CEVAP DİLEKÇEMİZİN SUNULMASINDAN İBARETTİR").
      * **Muhatap Makam (addressee):** Dilekçenin sunulacağı resmi makamın tam ve doğru adı. (Örn: "İSTANBUL ANADOLU 15. İCRA DAİRESİ MÜDÜRLÜĞÜ'NE", "İZMİR 3. ASLİYE HUKUK MAHKEMESİ SAYIN HAKİMLİĞİ'NE").
      * **Dosya Numarası (caseReference):** "DOSYA NO:" veya "ESAS NO:" şeklinde, referans alınan dosya numarası.
      * **Taraflar (parties):** Dilekçeyi sunan ve karşı tarafın bilgilerini içeren bir dizi.
          * Örnek: \`{"role": "İTİRAZ EDEN (BORÇLU)", "details": "Adı Soyadı: [Kullanıcının Adı Soyadı Buraya Gelecek], T.C. Kimlik No: [Kullanıcının T.C. Kimlik No'su Buraya Gelecek], Adres: [Kullanıcının Adresi Buraya Gelecek]"}\`.
          * **ÖNEMLİ:** Kullanıcının doldurması gereken alanları \`[... Buraya Gelecek]\` şeklinde belirt.
      * **Konu (subject):** Dilekçenin amacının bir cümleyle özeti. (Örn: "Müdürlüğünüzün 2025/12345 E. sayılı dosyası ile hakkımda başlatılan ilamsız icra takibine, borca, faize ve tüm fer'ilerine itirazlarımın sunulmasından ibarettir.").
      * **Açıklamalar (explanations):**
          * Bu bölüm, dilekçenin kalbidir. Mantıksal paragraflar halinde bir dizi (array) olarak oluştur.
          * İlk paragrafta olayın gelişimini ve takibin/davanın ne olduğunu özetle.
          * Sonraki paragraflarda, kaynak belgedeki iddialara karşı TEK TEK ve net argümanlar sun. (Örn: "Alacaklı olduğunu iddia eden taraf ile aramda herhangi bir ticari veya hukuki ilişki bulunmamaktadır.", "Talep edilen borç miktarı fahiştir ve gerçeği yansıtmamaktadır.", "İmza bana ait değildir.").
          * Gerekliyse, kullanıcının eklemesi gereken delillere atıfta bulun. (Örn: "İddialarımı destekleyen banka dekontları dilekçemiz ekinde (EK-1) sunulmuştur.").
      * **Hukuki Nedenler (legalGrounds):** İlgili kanun maddelerini belirt. (Örn: "İİK m. 62, HMK, TBK ve ilgili tüm yasal mevzuat.").
      * **Sonuç ve İstem (conclusionAndRequest):** Resmi ve net bir dille mahkemeden/makamdan ne talep edildiğini madde madde yaz. (Örn: "Yukarıda açıklanan ve re'sen gözetilecek nedenlerle; 1- Hakkımda başlatılan haksız ve hukuki dayanaktan yoksun icra takibine itirazımın KABULÜNE, 2- Takibin DURDURULMASINA, 3- Yargılama giderleri ve vekalet ücretinin karşı tarafa YÜKLETİLMESİNE karar verilmesini saygılarımla arz ve talep ederim.").
      * **Ekler (attachments):** Dilekçeye eklenecek belgelerin listesi. (Örn: ["1- Kimlik Fotokopisi", "2- İlgili Banka Dekontları"]).
      * **İmza Bloğu (signatureBlock):** Tarih, ad-soyad ve imza için standart bir kapanış formatı oluştur. (Örn: "\\n[Tarih]\\n\\nİtiraz Eden (Borçlu)\\n[Ad Soyad]\\n[İmza]").

  KURALLAR:
  - Çıktı, baştan sona SADECE geçerli bir JSON nesnesi olmalıdır.
  - JSON dışında kesinlikle hiçbir metin, açıklama veya not ekleme.
  - Dilekçe dilini resmi, saygılı ve iddialı tut. Vatandaşın haklarını en güçlü şekilde savunduğundan emin ol.
  - Bilinmeyen veya belgede yer almayan bilgiler için spekülasyon yapma, bunun yerine kullanıcı tarafından doldurulması için \`[...]\` formatında yer tutucular kullan.

  V-E-R-İ:
  ---
  ${textToAnalyze}
  ---
  `;
  return smartPrompt;
};

// --- Ana Sunucu Fonksiyonu ---
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) throw new Error('Sunucu hatası: GEMINI_API_KEY yapılandırılmamış.');
    
    let textToAnalyze: string = "";
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        if (!files || files.length === 0) throw new Error('Formda "files" adında bir dosya bulunamadı.');
        const file = files[0];
        const fileName = file.name.toLowerCase();
        
        if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            textToAnalyze = result.value;
        } else if (fileName.endsWith('.txt')) {
            // TXT dosyaları için düz metin okuma
            const text = await file.text();
            textToAnalyze = text;
        } else if (fileName.endsWith('.pdf')) {
            // PDF dosyaları için OCR (PDF'ler resim olarak işlenir)
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64Image = base64Encode(uint8Array);
            
            // Gemini Vision API ile OCR
            const visionResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: "Bu PDF dosyasındaki tüm metni oku ve döndür. Sadece metni döndür, başka hiçbir şey ekleme." },
                    {
                      inline_data: {
                        mime_type: 'application/pdf',
                        data: base64Image
                      }
                    }
                  ]
                }]
              })
            });
            
            if (!visionResponse.ok) {
              throw new Error(`Gemini Vision API hatası: ${visionResponse.status} ${await visionResponse.text()}`);
            }
            
            const visionData = await visionResponse.json();
            textToAnalyze = visionData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.bmp') || fileName.endsWith('.webp')) {
            // Resim dosyaları için OCR
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            // Deno ortamında base64 encoding
            const base64Image = base64Encode(uint8Array);
            
            // Gemini Vision API ile OCR
            const visionResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: "Bu resimdeki tüm metni oku ve döndür. Sadece metni döndür, başka hiçbir şey ekleme." },
                    {
                      inline_data: {
                        mime_type: file.type,
                        data: base64Image
                      }
                    }
                  ]
                }]
              })
            });
            
            if (!visionResponse.ok) {
              throw new Error(`Gemini Vision API hatası: ${visionResponse.status} ${await visionResponse.text()}`);
            }
            
            const visionData = await visionResponse.json();
            textToAnalyze = visionData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
            throw new Error(`Desteklenmeyen dosya türü: ${file.name}. Desteklenen türler: .docx, .doc, .pdf, .txt, .jpg, .jpeg, .png, .gif, .bmp, .webp`);
        }
    } else { // JSON varsayımı
        const body = await req.json();
        textToAnalyze = body.text;
    }

    if (!textToAnalyze.trim()) throw new Error('Analiz edilecek metin bulunamadı.');

    const geminiPrompt = createMasterPrompt(textToAnalyze);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] }),
    });

    if (!response.ok) throw new Error(`Gemini API hatası: ${response.status} ${await response.text()}`);

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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});