import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Blog makalesi tipi
export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string; // ISO tarih
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  faq?: Array<{ question: string; answer: string }>;
  coverImage?: string;
  tags?: string[];
};

// Örnek blog verisi
export const blogPosts: BlogPost[] = [
  {
    id: "icra-takibine-itiraz-dilekcesi",
    title: "İcra Takibine İtiraz Dilekçesi: Nedir, Nasıl Yazılır? | 2025 Adım Adım Rehber",
    summary: "Ödeme emri aldıktan sonra 7 gün içinde itiraz etmeniz gerekir. Bu rehberle süreci anlayın, Artiklo ile belgenizi sadeleştirin ve size özel itiraz dilekçenizi hazırlayın.",
    seoTitle: "İcra Takibine İtiraz Dilekçesi: Nedir, Nasıl Yazılır? | 2025 Adım Adım Rehber",
    metaDescription: "İcra takibine itiraz dilekçesi nedir, nasıl hazırlanır? 7 gün içinde adım adım rehberimizi okuyun, hemen harekete geçin.",
    canonical: "https://artiklo.legal/blog/icra-takibine-itiraz-dilekcesi",
    faq: [
      { question: "İcra takibine itiraz süresi kaç gündür?", answer: "Ödeme emrinin tebliği tarihinden itibaren 7 gün içinde icra dairesine itiraz dilekçenizi vermelisiniz (İcra ve İflas Kanunu m.62). Bu süre kesin ve uzatılamaz." },
      { question: "E-devlet'ten icra itirazı yapılabilir mi?", answer: "İcra dairesinin dijital alt yapısına ve dosya türüne göre değişir. Çoğu durumda fiziki teslim tercih edilir. Kesin bilgi için ilgili icra dairesini arayın." },
      { question: "İcra itiraz dilekçesi hangi bilgileri içermeli?", answer: "İcra dairesi adı, dosya numarası, taraf bilgileri, itiraz gerekçeleri ve hukuki dayanaklar. Artiklo ile otomatik olarak eksiksiz dilekçe oluşturabilirsiniz." },
      { question: "İcra inkar tazminatı ne zaman ödenir?", answer: "Haksız ve kötü niyetli itirazlarda %20'ye varan tazminat ödenebilir. Haklı ve delile dayalı itirazlarda bu risk yoktur." },
      { question: "İcra takibine itiraz dilekçesi ücreti ne kadar?", answer: "2025 yılı için harç ücreti güncel tarife üzerinden hesaplanır. Dilekçe hazırlama maliyeti Artiklo ile sıfıra iner." }
    ],
    tags: ["İcra Takibi", "İtiraz Dilekçesi", "Hukuk Rehberi", "İcra Hukuku", "Ödeme Emri"],
    coverImage: "/icra-kapak.png",
    content: `<p>Elinize bir ödeme emri ulaştı ve acilen bir <strong>icra takibine itiraz dilekçesi</strong> hazırlamanız gerekiyor. Hukuki konulara yabancıysanız, bu durum sizi strese sokabilir. Çünkü elinizdeki resmi belgenin dili karmaşık ve daha da önemlisi, itiraz etmek için <strong>sadece 7 gününüz</strong> var. Bu kısa sürede yapacağınız bir hata, haklarınızı kaybetmenize neden olabilir; ayrıca ciddi para kaybı yaşanabilir.</p>

<p>Neyse ki bu süreçle tek başınıza başa çıkmak zorunda değilsiniz. Bu rehber, <strong>icra takibine itiraz dilekçesi</strong> yazarken tüm endişelerinizi gidermek için hazırlandı. Amacımız, konuyu sizin için basitleştirmek ve bu 7 günü lehinize çevirmenize yardım etmektir.</p>

<h2>Ödeme Emri Aldınız: Şimdi Ne Olacak?</h2>
<p>Öncelikle, elinizdeki belgenin ne anlama geldiğini basitçe anlayalım. Ödeme emri, birinin sizden borcunu almak için başlattığı yasal bir işlemdir. Bu belge size ulaştığı andan itibaren, itiraz etmek için <strong>sadece 7 gününüz</strong> olduğunu unutmayın.</p>

<p><strong>Not:</strong> Eğer bu durumu ilk kez <a href="/blog/enforcement-file-edvlet">E-Devlet'te icra takibi bildirimi</a> olarak gördüyseniz, panik yapmadan önce bu rehberi okuyun ve doğru adımları öğrenin.</p>

<img src="/icra-7-süre.png" alt="7 günlük icra itiraz süresi takvimi" className="my-6 w-full max-w-md mx-auto rounded-lg shadow-sm" />

<h3>Süreyi kaçırırsanız ne olur?</h3>
<ul>
<li><strong>Takip kesinleşir:</strong> Borcu kabul etmiş sayılırsınız ve alacaklı kişi <a href="/blog/maas-haczi-nedir-nasil-uygulanir">maaş haczi</a> gibi yasal işlemlere başlayabilir.</li>
<li><strong>İtiraz hakkı büyük ölçüde kaybolur:</strong> Bu aşamadan sonra borca itiraz etmeniz neredeyse imkansız hale gelir.</li>
<li>Bu nedenle, belgeyi alır almaz harekete geçmek zorundasınız.</li>
</ul>

<h2>Adım Adım: Hatasız Bir İcra Takibine İtiraz Dilekçesi Hazırlamak</h2>
<p>Genel şablonlarla ilerlemek risklidir; her dosya farklıdır. Size özel ve hatasız bir dilekçe oluşturmanın modern ve güvenli bir yolu var.</p>

<h3>1. Adım: Önce Anlayın, Sonra Harekete Geçin (Artiklo ile Dakikalar İçinde)</h3>
<ul>
<li><strong>Belgenizi yükleyin:</strong> Size gelen ödeme emrinin fotoğrafını çekin veya PDF halini Artiklo platformuna yükleyin. <a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Belge yükleme süreci nasıl çalışır?</a></li>
<li><strong>Yapay zeka sadeleştirsin:</strong> Yüklediğiniz belge, yapay zeka tarafından anında taranır; karmaşık resmi dil sade Türkçeye çevrilir. Tüm kritik detaylar (tarih, icra dairesi, dosya no, taraflar) netleşir. <em>(Artiklo, <a href="/blog/veraset-ilami-nasil-okunur">veraset ilamı</a> ve <a href="/blog/kira-kontrati-7-kritik-madde-2025">kira kontratları</a> gibi diğer hukuki belgeler için de aynı hizmeti verir)</em></li>
<li><strong>Yol haritası alın:</strong> Sistem, borca hangi yasal nedenlerle itiraz edebileceğinizi basit seçenekler halinde sunar.</li>
<li><strong>Size özel dilekçe oluşturulsun:</strong> İnternetteki riskli şablonları unutun. Artiklo, durumunuza özel, hukuken geçerli ve eksiksiz bir icra takibine itiraz dilekçesi taslağını saniyeler içinde oluşturur.</li>
</ul>

<h3>2. Adım: Hazırlanan Dilekçeyi Kontrol Edin ve Kullanın</h3>
<p>Artiklo'nun hazırladığı <strong>icra takibine itiraz dilekçesi</strong>; icra dairesi, dosya numarası, taraf bilgileri, talep ve hukuki dayanakları doğru ve bütünlüklü biçimde içerir. Size düşen:</p>
<ul>
<li>Metindeki bilgileri kontrol etmek,</li>
<li>Gerekirse kişisel eklemeleri yapmak,</li>
<li>İmzalamak ve teslim etmek.</li>
</ul>

<h2>%20 İcra İnkar Tazminatı Korkusu Gerçek mi?</h2>
<p>Birçok kişi, haksız çıkarsa ödemek zorunda kalacağı %20'lik tazminattan çekinir. Ancak bu tazminat, kötü niyetli itirazları engellemek için vardır. Eğer itirazınız makul ve delille destekliyse, bu tazminattan çekinmenize gerek yoktur.</p>

<h3>Kısa notlar:</h3>
<ul>
<li><strong>Kötü niyet kriteri:</strong> Dayanaksız ve sürüncemede bırakma amaçlı itirazlar risklidir.</li>
<li><strong>Delil durumu:</strong> Sözleşme, ödeme dekontu, yazışmalar gibi deliller pozisyonunuzu güçlendirir.</li>
<li><strong>Hakkaniyet:</strong> Dürüst ve gerçek bir uyuşmazlık varsa tazminat gündeme gelmeyebilir.</li>
</ul>

<p><strong>Önemli:</strong> %20 icra inkar tazminatının hangi koşullarda uygulandığını, nasıl önlenebileceğini ve tüm detaylarını <a href="/blog/icra-inkar-tazminati-nedir">İcra İnkar Tazminatı Nedir?</a> rehberimizden öğrenebilirsiniz.</p>

<h2>Dilekçeyi Teslim Etme: Süreci Tamamlamak</h2>
<ul>
<li>Dilekçeyi en az iki kopya yazdırın.</li>
<li>Kimliğinizle birlikte ilgili icra dairesine gidin ve memura teslim edin.</li>
<li>Mutlaka tarih ve kaşe içeren bir "alındı belgesi" alın. Bu belge, yasal sürede itiraz ettiğinizin kanıtıdır.</li>
<li>Süreç, <a href="https://www.mevzuat.gov.tr/MevzuatMetin/1.3.2004.pdf" target="_blank" rel="noopener">İcra ve İflas Kanunu'nun 62. maddesi</a> çerçevesinde yürütülür.</li>
</ul>

<h2>Sık Sorulan Sorular (FAQ)</h2>

<h3>Ödeme emri geldikten sonra kaç gün içinde itiraz edebilirim?</h3>
<p>Tebligatı aldığınız günden itibaren 7 gün içinde itiraz etmelisiniz.</p>

<h3>E-Devlet üzerinden icra itirazı yapılır mı?</h3>
<p>Dosyanın türüne ve icra dairesinin uygulamasına göre değişebilir; çoğu durumda fiziki teslim tercih edilir. Dairenizle teyit edin.</p>

<h3>%20 icra inkar tazminatı ne zaman uygulanır?</h3>
<p>Kötü niyetli veya dayanaksız itirazlarda ve alacaklının haksız çıkarıldığının anlaşılması halinde gündeme gelir.</p>

<h3>Hangi icra dairesine başvurmalıyım?</h3>
<p>Ödeme emrinde yazan ilgili icra dairesine.</p>

<h3>İnternetten bulunan dilekçe örneğini kullanmak riskli mi?</h3>
<p>Evet. Her dosya özeldir; hatalı bilgi veya eksik hukuki dayanak aleyhinize sonuç doğurabilir. Dosyanıza özel dilekçe hazırlayın.</p>

<h2>Sonuç: Endişeyi Güvene Dönüştürün</h2>
<p>Bir <strong>icra takibine itiraz dilekçesi</strong> hazırlamak, doğru araçlarla korkutucu olmak zorunda değildir. Artık 7 günlük sürenin stresi ve hukuki dilin karmaşıklığı karşısında çaresiz değilsiniz. Artiklo gibi modern bir çözüm sayesinde, süreci hızla anlayabilir ve haklarınızı etkili biçimde koruyabilirsiniz.</p>

<p><strong>İlgili Rehberlerimiz:</strong> İcra süreci hakkında daha fazla bilgi için <a href="/blog/maas-haczi-nedir-nasil-uygulanir">maaş haczi</a> ve <a href="/blog/icra-inkar-tazminati-nedir">icra inkar tazminatı</a> rehberlerimizi de inceleyebilirsiniz. Ayrıca, <a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">belge analiz sürecimiz</a> hakkında detaylı bilgiye sahip olun.</p>

<p>Kısacası, bilgi ve doğru araçlar bu süreçteki en büyük gücünüzdür. İlk adımı şimdi atın: <a href="https://artiklo.com" target="_blank" rel="noopener">Artiklo'yu ücretsiz deneyin</a>.</p>`,
    publishedAt: "2025-08-26",
  },
  {
    id: "veraset-ilami-nasil-okunur",
    title: "Veraset İlamı Nedir ve Nasıl Okunur? (Adım Adım Anlama Rehberi)",
    summary: "Veraset ilamı (mirasçılık belgesi) karmaşık görünebilir, ancak bu rehber size belgeyi adım adım anlamanız için yardımcı olacak. Hukuki terimlerin anlamından, sonraki adımlara kadar her şey bu yazıda.",
    seoTitle: "Veraset İlamı Nedir? Nasıl Okunur? | Mirasçılık Belgesi Rehberi 2025",
    metaDescription: "Veraset ilamı (mirasçılık belgesi) nasıl okunur? Hukuki terimler, pay hesaplamaları ve sonraki adımlar. Adım adım rehber.",
    canonical: "https://artiklo.legal/blog/veraset-ilami-nasil-okunur",
    faq: [
      { question: "Veraset ilamı nedir?", answer: "Vefat eden kişinin (muris) yasal mirasçılarının kimler olduğunu ve her birinin mirastan ne kadar pay alacağını gösteren resmi belgedir. Bu belge olmadan miras işlemleri yapılamaz." },
      { question: "8/24 hisse ne demek?", answer: "8/24 hisse, mirasın 24 birimlik bütününden 8 biriminin size ait olduğu, yani mirasın 1/3'ünü aldığınız anlamına gelir." },
      { question: "İzale-i şuyu nedir?", answer: "Mirasçılar arasında paylaşılamayan malın (örneğin ev) mahkeme yoluyla satılarak parasının mirasçılar arasında paylaştırılması davasıdır." },
      { question: "Veraset vergisi ne zaman ödenir?", answer: "Veraset ilamını aldıktan sonra 4 ay içinde vergi dairesine giderek Veraset ve İntikal Vergisi Beyannamesi vermeniz gerekir." },
      { question: "Miras payımı nasıl hesaplarım?", answer: "Belgede yazan hisse oranınızı (örn: 8/24) basitleştirerek bulabilirsiniz. 8/24 = 1/3 demektir. Artiklo ile otomatik hesaplama yapılabilir." }
    ],
    tags: ["Veraset İlamı", "Miras Hukuku", "Mirasçılık Belgesi", "Miras Payı", "Tereke"],
    coverImage: "/veraset-ilami.jpg",
    content: `<p>Sevdiklerinizi kaybettikten sonraki zorlu süreçte elinize Noter veya Mahkeme'den <strong>"Veraset İlamı"</strong> ya da yeni adıyla <strong>"Mirasçılık Belgesi"</strong> başlıklı bir evrak ulaştıysa, ne anlama geldiğini merak etmeniz çok doğal.</p>

<p>İlk bakışta karmaşık ve eski kelimelerle dolu bu belge, aslında mirasçı olarak haklarınızı gösteren resmi bir yol haritasıdır. Çoğu zaman kafa karıştırıcı olsa da, içeriğini anladığınızda tüm süreç sizin için daha net hale gelecektir.</p>

<p>Bu rehber, o haritayı sizin için adım adım okuyacak ve anlaşılır hale getirecek.</p>

<h2>Veraset İlamı (Mirasçılık Belgesi) Tam Olarak Nedir?</h2>
<p>Kısaca bu belge, vefat eden bir kişinin (hukuki adıyla <strong>'muris'</strong>) geride bıraktığı yasal mirasçılarının kimler olduğunu ve bu mirasçıların her birinin mirastan ne kadar pay (<strong>'hisse'</strong>) alacağını kanıtlayan resmi bir kimlik kartı gibidir.</p>

<p>Bu belge olmadan, vefat eden yakınınızın bankadaki parası, evi, arabası veya diğer mal varlıkları üzerinde hiçbir yasal işlem yapamazsınız. Tapuda ev devri, bankadan para çekme veya araba satışı gibi tüm işlemler için bu belgenin ibraz edilmesi zorunludur. Kısacası, bu belge sizin mirastaki haklarınızın resmi anahtarıdır.</p>

<h2>Belgedeki Yaygın Hukuki Terimler İçin Sade Bir Sözlük</h2>
<p>Belgeyi okumanızı kolaylaştıracak en temel kelimelerin anlamları şunlardır:</p>

<h3>Temel Miras Terimleri:</h3>
<ul>
  <li><strong>Muris:</strong> Vefat eden ve mirası kalan kişi</li>
  <li><strong>Mirasçı (Varis):</strong> Murisin mirası üzerinde yasal hak sahibi olan kişi veya kişiler</li>
  <li><strong>Tereke:</strong> Murisin geride bıraktığı her şey (varlıklar VE borçlar dahil)</li>
  <li><strong>Hisse (Pay):</strong> Her mirasçının terekeden alacağı pay (1/4, 8/24 gibi)</li>
  <li><strong>İzale-i Şuyu:</strong> Paylaşılamayan malın mahkeme yoluyla satılması davası</li>
</ul>

<h2>Pay Oranları (Örn: 8/24) Nasıl Anlaşılır?</h2>
<p>Belgede genellikle <strong>"8/24 payın Ayşe Yılmaz'a ait olduğu..."</strong> gibi ifadeler görürsünüz ve bu kesirler kafa karıştırabilir. Mantığı aslında basittir:</p>

<h3>Pratik Hesaplama:</h3>
<ul>
  <li><strong>Payda (alt sayı):</strong> Mirasın toplam birim sayısı (24)</li>
  <li><strong>Pay (üst sayı):</strong> Sizin aldığınız birim sayısı (8)</li>
  <li><strong>Sonuç:</strong> 8/24 = 1/3 (mirasın üçte biri)</li>
</ul>

<p>Yani, payınız 8/24 ise, bu 24 birimlik mirasın 8 biriminin, yani <strong>üçte birinin (1/3)</strong> size ait olduğu anlamına gelir. Diğer mirasçıların payları da toplandığında bütünün tamamını (24/24) oluşturmalıdır.</p>

<h2>Veraset İlamını Aldıktan Sonra Atılacak Adımlar</h2>

<h3>1. Adım: Belgeyi Doğru Anlamak ve Yorumlamak</h3>
<p>Her şeyden önce, elinizdeki belgedeki tüm tarafları, pay oranlarını ve özel durumları net bir şekilde anladığınızdan emin olun. Belgenin bir fotoğrafını çekip <a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Artiklo'ya yükleyerek</a>, kimin "muris", kimin "mirasçı" olduğunu ve size düşen payın ne anlama geldiğini saniyeler içinde, sade bir Türkçe ile görebilirsiniz.</p>

<h3>2. Adım: Veraset ve İntikal Vergisini Beyan Etmek</h3>
<p>Mirasçılık belgesini aldıktan sonra <strong>4 ay içinde</strong> ilgili vergi dairesine giderek <strong>"Veraset ve İntikal Vergisi Beyannamesi"</strong> vermeniz gerekir. Bu, miras kalan malların devlete bildirilmesi işlemidir.</p>

<h4>Vergi Beyan Süreci:</h4>
<ul>
  <li>Veraset ilamınızı alın</li>
  <li>Tereke değerini belirleyin</li>
  <li>4 ay içinde vergi dairesine başvurun</li>
  <li>Beyanname verin ve vergi ödeyin</li>
</ul>

<h3>3. Adım: Mirasın İntikal İşlemlerini Başlatmak</h3>
<p>Vergi dairesinden alacağınız <strong>"ilişiği yoktur"</strong> yazısı ve veraset ilamı ile birlikte, vefat eden kişinin üzerine kayıtlı olan mülkleri kendi adınıza geçirebilirsiniz.</p>

<h4>Yapılacak İşlemler:</h4>
<ul>
  <li><strong>Tapu işlemleri:</strong> Ev, arsa gibi gayrimenkullerin devri</li>
  <li><strong>Banka işlemleri:</strong> Hesaplardaki paranın payınız oranında çekilmesi</li>
  <li><strong>Araç devri:</strong> Motorlu taşıtların adınıza geçirilmesi</li>
  <li><strong>Hisse senedi devri:</strong> Finansal varlıkların transferi</li>
</ul>

<h3>4. Adım: Anlaşmazlık Durumunda Hukuki Destek</h3>
<p>Eğer mirasçılar arasında mal paylaşımı konusunda bir anlaşmazlık varsa (örneğin biri evi satmak isterken diğeri istemiyorsa), bu noktada bir <strong>"izale-i şuyu"</strong> davası gündeme gelebilir.</p>

<h4>İzale-i Şuyu Davası Ne Zaman Açılır:</h4>
<ul>
  <li>Mirasçılar arasında anlaşmazlık varsa</li>
  <li>Mülk fiziken bölünemiyorsa (ev, arsa gibi)</li>
  <li>Satış konusunda fikir birliği yoksa</li>
</ul>

<h2>Artiklo, Miras Belgenizi Nasıl "Tercüme" Eder?</h2>
<p>Artiklo'ya veraset ilamınızı yüklediğinizde, yapay zeka saniyeler içinde:</p>

<h3>Otomatik Analiz Özellikleri:</h3>
<ul>
  <li>Belgedeki "muris" ve tüm "mirasçıları" isim isim listeler</li>
  <li>Her mirasçıya düşen hisse oranını (8/24 gibi) tespit eder ve "Mirasın üçte biri" gibi anlaşılır bir ifadeye çevirir</li>
  <li>"İzale-i şuyu" gibi karmaşık hukuki terimleri sizin için sade bir dille açıklar</li>
  <li>Size, bir sonraki adımda ne yapmanız gerektiğine dair basit bir eylem planı sunar</li>
</ul>

<h2>Yaygın Karışıklıklar ve Çözümleri</h2>

<h3>1. "Neden Payım Bu Kadar Küçük?"</h3>
<p>Yasal miras oranları, Türk Medeni Kanunu'na göre belirlenir. Çocuklar, eş ve anne-baba arasında belirli oranlar vardır. Bu normal bir durumdur.</p>

<h3>2. "Borçlar da Miras mı?"</h3>
<p>Evet, miras sadece varlıklardan değil, borçlardan da oluşur. Ancak mirasçı borçlara karşı payı oranında sorumludur.</p>

<h3>3. "Mirasımı Nasıl Reddederim?"</h3>
<p>3 ay içinde mahkemeye başvurarak mirastan feragat edebilirsiniz. Bu durumda varlık alamazsınız ama borçtan da sorumlu olmazsınız.</p>

<h2>Pratik İpuçları ve Öneriler</h2>

<h3>Miras Sürecinde Dikkat Edilecekler:</h3>
<ul>
  <li><strong>Belgeleri saklayın:</strong> Tüm miras belgelerini güvenli yerde saklayın</li>
  <li><strong>Sürelere uyun:</strong> Vergi beyanı için 4 aylık süreyi kaçırmayın</li>
  <li><strong>Uzlaşmaya çalışın:</strong> Mirasçılar arasında anlaşmaya çalışın</li>
  <li><strong>Uzman desteği alın:</strong> Karmaşık durumlarda avukat desteği alın</li>
</ul>

<h2>Sonuç: Anlamak, Haklarınızı Korumanın İlk Adımıdır</h2>
<p>Miras süreci, duygusal olarak zorlayıcı bir dönemde atılması gereken hukuki adımlarla dolu olabilir. Bu sürecin ilk ve en önemli adımı, haklarınızın ne olduğunu gösteren mirasçılık belgesini doğru anlamaktır.</p>

<p>Belgeyi anladığınızda, süreci daha sakin ve bilinçli yönetebilir, haklarınızı koruyabilir ve olası anlaşmazlıkları en aza indirebilirsiniz.</p>

<p><strong>Hemen başlayın:</strong> Veraset ilamınızı <a href="https://artiklo.com/" rel="noopener" target="_blank">Artiklo'ya yükleyin</a> ve sade Türkçe analizini alın.</p>

<h2>İlgili Rehberler</h2>
<p>Miras süreci hakkında daha fazla bilgi için şu rehberlerimizi de inceleyebilirsiniz:</p>

<ul>
  <li><a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Belge Yükleme ve Analiz Süreci</a></li>
  <li><a href="/blog/kira-kontrati-7-kritik-madde-2025">Kira kontratı analizi</a> için benzer sistem</li>
</ul>

<h2>Önemli Yasal Uyarı</h2>
<p>Artiklo ve bu blog yazısı, karmaşık hukuki metinleri anlamanız için tasarlanmış güçlü bir yardımcıdır. Ancak, içeriğimiz hiçbir şekilde hukuki tavsiye niteliği taşımaz.</p>

<p>Miras intikal işlemleri, vergi beyannamesi veya miras paylaşım davası gibi yasal bir eylemde bulunmadan önce mutlaka alanında uzman bir avukata danışmanız kritik önem taşımaktadır. Artiklo'yu en iyi yol arkadaşınız, avukatınızı ise en güvenilir rehberiniz olarak görün.</p>`,
    publishedAt: "2024-01-20",
  },
  {
    id: "kira-kontrati-7-kritik-madde-2025",
    title: "Kira Kontratı İmzalamadan Önce Hayat Kurtaran 7 Kritik Madde (2025 Güncel)",
    summary: "Hayallerinizdeki evi buldunuz ve önünüze kira kontratı kondu. Peki o karmaşık belgedeki kritik maddeleri biliyor musunuz? İşte size hayat kurtaran 7 madde.",
    content: `O an geldi. Hayallerinizdeki evi buldunuz, ev sahibiyle anlaştınız ve önünüze birkaç sayfalık, bolca küçük yazı ve resmi terim içeren o kağıt yığını kondu: Kira Kontratı.

Heyecanla bir an önce imzayı atıp evin keyfini çıkarmak isteseniz de, bu belgedeki "müteselsil kefil", "fevkalade fesih" veya "tahliye taahhüdü" gibi ifadeler kafanızı karıştırabilir. Atacağınız bir imza, ileride size aylar süren bir baş ağrısı ve beklenmedik masraflar olarak geri dönebilir.

Peki, ne yapmalı?

Korkmayın. Bu rehber, bir kira kontratında avukat gibi dikkat etmeniz gereken en önemli 7 maddeyi sizin için "vatandaş diline" çeviriyor. Unutmayın, bilgi güçtür ve bu yazıyı okuduktan sonra o masaya çok daha güvende oturacaksınız.

1. Kiralananın Cinsi ve Adresi: "Acaba Doğru Yerde miyim?"
Nedir? Kontratın en başında yer alan ve kiraladığınız mülkün açık adresini (mahalle, sokak, numara, daire) ve "mesken" (konut) olarak mı yoksa "iş yeri" olarak mı kiralandığını belirten bölümdür.

Neden Önemli? Yanlış yazılmış bir adres, ileride abonelik (elektrik, su) işlemlerinde veya resmi bir tebligat durumunda ciddi sorunlar yaratabilir. Konut olarak kiraladığınız bir yeri, kontratta belirtmeden iş yeri olarak kullanamazsınız.

Dikkat! Adresin, kapı numaranıza kadar doğru yazıldığından emin olun. Apartman ve daire numarasını iki kez kontrol edin.

2. Kira Bedeli ve Ödeme Şekli: Paranın Nereye ve Ne Zaman Gideceği
Nedir? Aylık kira bedelinin rakamla ve yazıyla ne kadar olduğu, artış oranının (genellikle TÜFE oranına göre belirlenir) ve kiranın her ay hangi tarihte, hangi banka hesabına yatırılacağını belirten maddedir.

Neden Önemli? "Kira elden verilir" gibi ifadelere kanmayın. Yasal olarak 500 TL üzerindeki kiraların banka aracılığıyla ödenmesi zorunludur. Dekont, sizin kiranızı ödediğinize dair en güçlü kanıttır.

Dikkat! Ev sahibinin IBAN numarasının ve ad-soyad bilgisinin doğru yazıldığından emin olun. Ödemeyi yaparken açıklama kısmına mutlaka "2025 Temmuz Ayı Kira Bedeli" gibi bir not düşün.

3. Depozito: Güvence Bedelinin Akıbeti
Nedir? Kiracının eve veya demirbaşlara verebileceği zararlara karşılık ev sahibine verdiği güvence bedelidir. Kanunen en fazla 3 aylık kira bedeli kadar olabilir.

Neden Önemli? En büyük anlaşmazlıklar depozito iadesinde çıkar. Hangi şartlarda kesinti yapılacağı (boya badana, demirbaş hasarı vb.) ve hangi şartlarda tam olarak iade edileceği net olmalıdır.

Dikkat! Kontrata "Depozito, eve verilen bir zarar olmaması durumunda, ev tahliye edildikten sonra ... gün içinde iade edilir" gibi net bir ifade ekletin. Eve girerken mevcut kusurların (çizik parke, bozuk musluk vb.) fotoğraflarını çekip tarih damgasıyla ev sahibine e-posta atın. Bu, çıkarken "bunu sen yaptın" suçlamasını engeller.

4. Tahliye Taahhüdü: En Kritik İmza!
Nedir? Bu, kiracının belirli bir tarihte evi kayıtsız şartsız boşaltacağına dair verdiği yazılı bir sözdür. Genellikle kira kontratıyla birlikte, ayrı bir kağıt olarak veya kontratın içine gizlenmiş bir madde olarak imzalatılmak istenir.

Neden Önemli? Eğer tarih kısımları boş bırakılmış bir tahliye taahhüdü imzalarsanız, ev sahibi bu tarihleri daha sonra doldurarak sizi yasal olarak çok kısa sürede evden çıkarabilir. Bu, kiracı için en riskli maddedir.

Dikkat! Kira kontratını imzaladığınız gün, aynı tarihli bir tahliye taahhüdü imzalamak yasal olarak genellikle geçersizdir. Mümkünse imzalamaktan kaçının. İmzalama zorunluluğu hissediyorsanız, mutlaka bir hukukçuya danışın veya bu belgenin ne anlama geldiğini tam olarak anladığınızdan emin olun.

5. Müteselsil Kefil: "Arkadaşımın Borcu Benim Borcumdur" Demek
Nedir? Kefil, kiracının kirayı ödememesi durumunda borcu üstlenen kişidir. "Müteselsil kefil" ise, ev sahibinin direkt olarak kefile gidip borcun tamamını talep edebilmesi anlamına gelir.

Neden Önemli? Birine kefil oluyorsanız, onun tüm kira borcundan sorumlu olursunuz. Eğer kontratınızda bir kefil varsa, bu durum ev sahibine ekstra bir güvence verir.

Dikkat! Kefillik sözleşmesinde, kefilin sorumlu olacağı azami miktar ve kefalet süresi yazılı olmak zorundadır. Bu bilgiler olmadan atılan bir kefillik imzası geçersizdir.

6. Demirbaşların Durumu: "O Televizyon Zaten Bozuktu"
Nedir? Evde size teslim edilen eşyaların (kombi, klima, ankastre fırın, dolaplar vb.) listesi ve mevcut durumlarıdır.

Neden Önemli? Evden çıkarken "kombi bozulmuş, bedelini depozitodan kesiyorum" gibi bir sürprizle karşılaşmamak için, hangi demirbaşın çalışır ve sağlam teslim edildiği en başta kayıt altına alınmalıdır.

Dikkat! Kontratın ekine, çalışan ve çalışmayan tüm demirbaşların listelendiği bir "Demirbaş Listesi" ekletin. Her birinin yanına "sağlam/çalışıyor" veya "bozuk/çizik" gibi notlar düşün ve bu listeyi de karşılıklı olarak imzalayın.

7. Özel Şartlar: Şeytan Ayrıntıda Gizlidir
Nedir? Kontratın sonundaki, genel kuralların dışında ev sahibi ve kiracının anlaştığı özel maddelerdir. "Eve evcil hayvan getirilemez", "Duvarlara çivi çakılamaz", "Daire başkasına devredilemez" gibi maddeler burada yer alır.

Neden Önemli? Hayat tarzınıza uymayan bir özel şartı kabul etmek, tüm kira sürenizi kabusa çevirebilir.

Dikkat! Bu bölümü kelime kelime okuyun. Anlamadığınız veya kabul etmediğiniz hiçbir maddeyi onaylamayın. Üzerini çizerek ve yanına paraf atarak maddeyi geçersiz kılabilirsiniz.

Tüm Bu Maddelerle Uğraşmak Zor Geliyorsa: Artiklo Yanınızda
Bu rehber harika bir başlangıç, ama elinizdeki 5 sayfalık, karmaşık dilli bir kontrat sizi hala endişelendiriyor olabilir.

İşte tam bu noktada Artiklo devreye giriyor.

Ev sahibinizin size uzattığı kira kontratının fotoğrafını çekin veya PDF'ini Artiklo'ya yükleyin. Saniyeler içinde:

Artiklo, "tahliye taahhüdü" maddesinin sizin için ne anlama geldiğini,

"Depozito iade şartları"nın lehinize olup olmadığını,

Gözden kaçırmış olabileceğiniz riskli "özel şartları",

Ve tüm karmaşık ifadeleri herkesin anlayacağı basit bir dille size özetler.

"Bu belge, boş tarihli bir tahliye taahhüdü içeriyor, bu risklidir" gibi uyarılarla sizi uyarır ve atmanız gereken adımları önerir.

Sonuç: Bilgiyle Gelen Güç
Kira kontratı, bir ev kiralama sürecinin en önemli adımıdır. Bu belge bir düşman değil, doğru anlaşıldığında hem sizi hem de ev sahibini koruyan bir yol haritasıdır. Yukarıdaki maddelere dikkat ederek ve anlamadığınız hiçbir şeye imza atmayarak bu süreci güvenle yönetebilirsiniz.

Unutmayın, artık hukuki dilin karmaşıklığı karşısında yalnız değilsiniz.

Daha bilinçli ve güvende bir başlangıç yapmak için ilk kontratınızı Artiklo ile analiz etmeyi deneyin.

Önemli Yasal Uyarı
Artiklo ve bu blog yazısı, karmaşık hukuki metinleri anlamanız ve haklarınız konusunda bir ön farkındalık kazanmanız için tasarlanmış güçlü bir yardımcıdır. Amacımız, bilgiye erişiminizi kolaylaştırmak ve belgeleri sizin için "tercüme" etmektir.

Ancak, içeriğimiz ve platformumuz hiçbir şekilde hukuki tavsiye niteliği taşımaz. Her yasal durumun kendine özgü koşulları, detayları ve izlenmesi gereken farklı yolları vardır. Bir metni anlamak başka bir şey, o metne dayanarak yasal bir eylemde bulunmak başka bir şeydir.

Bu nedenle, kira kontratı, ihtarname, tebligat gibi belgelere dayanarak;

Bir sözleşmeyi feshetmeden,

Yasal bir cevap vermeden,

Veya herhangi bir hukuki eylemde bulunmadan önce

mutlaka alanında uzman bir avukata danışmanız kritik önem taşımaktadır.

Artiklo'yu en iyi yol arkadaşınız, avukatınızı ise en güvenilir rehberiniz olarak görün.`,
    publishedAt: "2025-01-15",
  },
  {
    id: "rental-clauses",
    title: "Kira Sözleşmesi İmzalamadan Önce Bilmeniz Gereken 5 Kritik Madde",
    summary: "Yeni bir eve taşınırken, sözleşmenizdeki kritik maddeleri biliyor musunuz? Detayları bu yazıda bulabilirsiniz.",
    seoTitle: "Kira Sözleşmesi: İmzalamadan Önce Bilmeniz Gereken 5 Kritik Madde",
    metaDescription: "Kira sözleşmesi imzalamadan önce bilmeniz gereken 5 kritik maddeyi öğrenin. Haklarınızı koruyun, sorun yaşamayın.",
    canonical: "https://artiklo.legal/blog/rental-clauses",
    faq: [
      { question: "Kira sözleşmesinde hangi maddelere dikkat etmeliyim?", answer: "Kira bedeli artış oranı, depozito iade koşulları, tahliye şartları, aidat sorumluluğu ve sözleşme süresi en kritik maddelerdir." },
      { question: "Kira artış oranı nasıl belirlenir?", answer: "Kira artış oranı genellikle TÜFE (Tüketici Fiyat Endeksi) oranına göre belirlenir ve sözleşmede açıkça belirtilmelidir." },
      { question: "Depozito ne zaman iade edilir?", answer: "Depozito, kira sözleşmesi sona erdiğinde ve eve hasar verilmemişse, genellikle 30 gün içinde iade edilir." }
    ],
    tags: ["Kira Sözleşmesi", "Ev Kiralama", "Hukuk Rehberi", "Kiracı Hakları"],
    coverImage: "/kira-sozlesme.jpg",
    content: `<p>Hayalinizdeki evi buldunuz ve artık kira sözleşmesi imzalama vakti geldi. Ancak bu heyecan verici anın ardında gizlenen önemli hukuki detaylar var. <strong>Kira sözleşmesi</strong> imzalamadan önce bilmeniz gereken kritik maddeleri gözden kaçırmak, ileride büyük sorunlara yol açabilir.</p>

<p>Bu rehber, kira sözleşmenizdeki en önemli 5 maddeyi detaylı şekilde açıklayarak sizi muhtemel risklerden koruyacak.</p>

<h2>1. Kira Bedeli ve Artış Koşulları: Paranızın Güvenliği</h2>
<p><strong>Kira bedeli</strong> ve artış oranları, sözleşmenizin en kritik kısmıdır. Türk hukukunda kira artışları TÜFE (Tüketici Fiyat Endeksi) ile sınırlıdır.</p>

<h3>Dikkat Edilmesi Gerekenler:</h3>
<ul>
  <li>Kira bedelinin rakam ve yazı ile açık belirtilmesi</li>
  <li>Artış oranının TÜFE'ye bağlı olması gerektiği</li>
  <li>Ödeme tarihinin net belirlenmesi</li>
  <li>Gecikme faizi oranının makul olması</li>
</ul>

<p><strong>Önemli:</strong> <a href="/blog/kira-kontrati-7-kritik-madde-2025">Kira kontratında dikkat edilecek diğer kritik maddeleri</a> de mutlaka inceleyin.</p>

<h2>2. Depozito ve İade Koşulları</h2>
<p>Depozito, ev sahibinin güvencesi olsa da, kiracı için de önemli bir finansal yüktür. Yasal olarak depozito en fazla 3 aylık kira bedeli kadar olabilir.</p>

<h3>Depozito İade Koşulları:</h3>
<ul>
  <li>Eve zarar verilmemesi durumunda tam iade</li>
  <li>Normal kullanım aşınması için kesinti yapılamayacağı</li>
  <li>İade süresinin net belirtilmesi (genellikle 30 gün)</li>
  <li>Kesinti yapılacak durumların önceden belirlenmesi</li>
</ul>

<h2>3. Tahliye Şartları ve Süreci</h2>
<p>Tahliye koşulları hem kiracı hem de ev sahibi açısından kritiktir. Bu madde, hangi durumlarda sözleşmenin feshedilebileceğini belirler.</p>

<h3>Yasal Tahliye Sebepleri:</h3>
<ul>
  <li>Kira ödememezlik (yasal süreler dahilinde)</li>
  <li>Eve zarar verme</li>
  <li>Sözleşme şartlarını ihlal etme</li>
  <li>Ev sahibinin yasal ihtiyacı (kendisi için kullanım)</li>
</ul>

<h2>4. Aidat ve Ek Masrafların Dağılımı</h2>
<p>Aidat, elektrik, su, doğalgaz gibi giderlerin kim tarafından ödeneceği açıkça belirtilmelidir.</p>

<h3>Genel Kural:</h3>
<ul>
  <li><strong>Kiracı:</strong> Elektrik, su, doğalgaz, internet</li>
  <li><strong>Ev Sahibi:</strong> Emlak vergisi, bina sigortası</li>
  <li><strong>Aidat:</strong> Sözleşmede kararlaştırılan tarafa göre</li>
</ul>

<h2>5. Sözleşme Süresi ve Yenileme Koşulları</h2>
<p>Kira sözleşmesinin süresi ve yenileme koşulları, her iki tarafın da hak ve yükümlülüklerini belirler.</p>

<h3>Süre Çeşitleri:</h3>
<ul>
  <li><strong>Belirli süreli:</strong> 1 yıl gibi kesin süre</li>
  <li><strong>Belirsiz süreli:</strong> Süre belirtilmeyen</li>
  <li><strong>Otomatik yenileme:</strong> Şartlar devam ettiği sürece</li>
</ul>

<h2>Artiklo ile Sözleşme Analizi</h2>
<p>Kira sözleşmenizin tüm maddelerini tek tek incelemek zaman alabilir. <a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Artiklo'nun belge analiz özelliği</a> ile sözleşmenizi yükleyerek:</p>

<ul>
  <li>Riskli maddeleri tespit edebilir</li>
  <li>Eksik kısımları görebilir</li>
  <li>Haklarınızı öğrenebilir</li>
  <li>Yapmanız gerekenleri listeleyebilirsiniz</li>
</ul>

<h2>Sonuç: Bilinçli Kiracılık</h2>
<p>Kira sözleşmesi imzalamak, sadece bir imza atmak değildir. Bu belge, yaşamınızın önemli bir bölümünü etkileyecek hukuki bir anlaşmadır. Yukarıdaki 5 kritik maddeyi dikkatle inceleyerek, geleceğinizi güvence altına alabilirsiniz.</p>

<p><strong>Unutmayın:</strong> Her sözleşme farklıdır ve özel durumlar için mutlaka uzman görüşü alın.</p>`,
    publishedAt: "2024-07-15",
  },
  {
    id: "maas-haczi-nedir-nasil-uygulanir",
    title: "Maaş Haczi Nedir, Nasıl Uygulanır? (Haklar ve Sınırlar)",
    summary: "Maaş haczi ne zaman uygulanır, oranı nedir, hangi gelirler haczedilebilir? Vatandaş diliyle özet.",
    seoTitle: "Maaş Haczi Nedir? Oran, İstisnalar ve Nasıl Kaldırılır? [2025]",
    metaDescription: "Maaş haczi nedir, oranı kaçtır, hangi gelirler haczedilir? 2025 güncel rehberle istisnalar ve kaldırma yollarını öğrenin.",
    canonical: "https://artiklo.legal/blog/maas-haczi-nedir-nasil-uygulanir",
    faq: [
      { question: "Maaş haczi oranı kaçtır?", answer: "Genel kural maaşın 1/4’üne kadar kesintidir; nafaka alacakları önceliklidir (İİK m.83)." },
      { question: "Maaş haczi nasıl kaldırılır?", answer: "Borç ödendiğinde, itiraz/şikâyet kabul edildiğinde veya muvafakatla kaldırılabilir; dosya durumunuza göre işlem yapın." }
    ],
    coverImage: "/lawyer.jpg",
    tags: ["İcra", "Maaş Haczi"],
    content: `
<p><strong>Maaş haczi nedir?</strong> Maaş haczi, kesinleşmiş veya icra takibi aşamasına gelen alacakların tahsili için çalışanın maaşının bir kısmının yasal olarak kesilmesidir. Bu uygulama, borçlunun geçimini tamamen ortadan kaldırmayacak şekilde sınırlara tabidir.</p>

<p><strong>Not:</strong> Eğer icra takibine itiraz etmeyi düşünüyorsanız, <a href="/blog/icra-takibine-itiraz-dilekcesi">icra takibine itiraz dilekçesi rehberimizi</a> mutlaka okuyun. 7 günlük süre çok kritiktir!</p>

<img src="/lawyer.jpg" alt="Maaş haczi nedir ve oranı kaçtır?" width="1200" height="628" loading="lazy" />

<h2>Maaş Haczi Oranı (2025)</h2>
<p>Genel kural, net maaşın <strong>%25’ine</strong> kadar kesinti uygulanabilmesidir. <em>Nafaka alacakları</em> öncelikli olup, bazı durumlarda daha yüksek bir oran söz konusu olabilir. Birden fazla haciz talebi varsa, kanuni öncelik sırasına göre sıraya alınır.</p>

<h2>Haczedilemeyen Gelirler</h2>
<ul>
  <li><strong>Asgari geçim için zorunlu kısım</strong> korunur.</li>
  <li>Bazı sosyal yardım ve tazminatlar kural olarak <strong>haczedilemez</strong>.</li>
  <li>Nafaka alacakları lehine istisna ve öncelikler bulunabilir.</li>
  </ul>

<p>Dayanak için bkz. <a href="https://www.mevzuat.gov.tr/MevzuatMetin/1.3.2004.pdf" rel="noopener" target="_blank">İcra ve İflas Kanunu</a> (ör. m.83 ve ilgili hükümler).</p>

<h2>Maaş Haczi Nasıl Başlatılır?</h2>
<ol>
  <li>Alacaklı icra takibini başlatır; borçluya tebligat yapılır.</li>
  <li>Takip kesinleştiğinde veya gerekli şartlar oluştuğunda, icra dairesi <strong>işverene yazı</strong> gönderir.</li>
  <li>İşveren, yazı doğrultusunda bordrodan kesinti yapar ve ilgili icra dosyasına aktarır.</li>
  </ol>

<h2>Maaş Haczi Nasıl Kaldırılır?</h2>
<ul>
  <li><strong>Borç ödendiğinde</strong> dosya kapanır ve haciz kalkar.</li>
  <li><strong>İtiraz/şikâyet kabulünde</strong> veya <strong>mahkeme kararıyla</strong> kaldırılabilir.</li>
  <li><strong>Alacaklının muvafakati</strong> ile durdurulabilir veya azaltılabilir.</li>
  </ul>

<h2>İç Bağlantılar</h2>
<ul>
  <li><a href="/blog/icra-takibine-itiraz-dilekcesi">İcra Takibine İtiraz Dilekçesi</a>: Takibi durdurma/yavaşlatma ihtimalleri.</li>
  <li><a href="/blog/icra-inkar-tazminati-nedir">İcra İnkar Tazminatı</a>: Kötü niyet/likit alacak koşulları.</li>
  <li><a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Belge Yükleme ve Analiz</a>: Dosyanızı 3 adımda analiz edin.</li>
  </ul>

<h2>SSS</h2>
<p><strong>Maaş haczi oranı yüzde kaçtır?</strong> Genel kural %25’tir; nafaka alacakları önceliklidir.</p>
<p><strong>Asgari ücretliye maaş haczi olur mu?</strong> Geçim için zorunlu kısım korunur; kesinti oranı buna göre hesaplanır.</p>
<p><strong>Birden fazla haciz varsa ne olur?</strong> Öncelik sırasına göre sıraya alınır; işveren yazılara göre işlem yapar.</p>

<p>Dosyanız için en doğru yolu görmek isterseniz, belgenizi <a href="https://artiklo.com/" rel="noopener" target="_blank">Artiklo</a>’ya yükleyerek dakikalar içinde analiz alabilirsiniz.</p>
`,
    publishedAt: "2025-08-26",
  },
  {
    id: "icra-inkar-tazminati-nedir",
    title: "%20 İcra İnkar Tazminatı Nedir? Ne Zaman Uygulanır?",
    summary: "Kötü niyetli, dayanaksız itirazlarda gündeme gelen %20 tazminatın koşulları ve pratik notlar.",
    seoTitle: "İcra İnkar Tazminatı Nedir? %20 Tazminat Koşulları [2025]",
    metaDescription: "İcra inkar tazminatı nedir, %20 tazminat hangi koşullarda uygulanır? Güncel ve anlaşılır rehber.",
    canonical: "https://artiklo.legal/blog/icra-inkar-tazminati-nedir",
    faq: [
      { question: "%20 icra inkar tazminatı nedir?", answer: "Borcu haksız yere inkâr eden borçlunun, yargılama sonunda haksız çıktığının anlaşılması halinde aleyhine hükmedilebilen tazminattır; genelde itirazın iptali sürecinde gündeme gelir." },
      { question: "Hangi şartlarda uygulanır?", answer: "İtiraz açıkça dayanaksızsa, alacak likit ve belirliyse ve borçlu yargılamada haksız çıkarsa uygulanabilir." }
    ],
    coverImage: "/onboarding-3.png",
    tags: ["İcra", "Tazminat"],
    content: `
<p><strong>İcra inkar tazminatı nedir?</strong> Borcunu haksız yere inkâr eden borçlunun, yargılama sonunda haksız çıktığının anlaşılması halinde aleyhine hükmedilebilen tazminattır. Uygulamada oran çoğu kez <strong>%20</strong> olarak karşımıza çıkar; somut olaya göre değerlendirilir.</p>

<img src="/onboarding-3.png" alt="İcra inkar tazminatı nedir ve %20 koşulları" width="1200" height="628" loading="lazy" />

<h2>Hangi Hallerde Uygulanır?</h2>
<ul>
  <li><strong>Dayanaksız itiraz</strong>: Borçlunun itirazı açıkça haksız ve sürüncemede bırakma amaçlıysa,</li>
  <li><strong>Likit alacak</strong>: Alacağın miktarı belirli veya belirlenebilir ise,</li>
  <li><strong>Yargılama sonucu</strong>: Borçlunun haksız çıktığı yargı kararıyla sabitse.</li>
  </ul>

<p>Detaylar için mevzuat: <a href="https://www.mevzuat.gov.tr/MevzuatMetin/1.3.2004.pdf" rel="noopener" target="_blank">İcra ve İflas Kanunu</a> ve ilgili hükümler.</p>

<h2>Nasıl Önlenir?</h2>
<ul>
  <li><strong>Gerçek uyuşmazlık</strong> ve <strong>delil</strong> varsa risk düşer.</li>
  <li>İtiraz gerekçelerini açık ve somut yazın.</li>
  <li>Gerekiyorsa uzman desteği alın.</li>
  </ul>

<h2>İç Bağlantılar</h2>
<ul>
  <li><a href="/blog/icra-takibine-itiraz-dilekcesi">İcra Takibine İtiraz Dilekçesi</a></li>
  <li><a href="/blog/maas-haczi-nedir-nasil-uygulanir">Maaş Haczi Nedir?</a></li>
  <li><a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Belge Yükleme ve Analiz</a></li>
  </ul>

<h2>SSS</h2>
<p><strong>%20 icra inkar tazminatı her durumda mı uygulanır?</strong> Hayır, koşullara tabidir; mahkeme somut olaya göre karar verir.</p>
<p><strong>İtirazım haklıysa tazminat öder miyim?</strong> Haklı ve delilli itirazlarda tazminat riski düşüktür.</p>

<p>Dosyanızın durumunu hızlı görmek için belgenizi <a href="https://artiklo.com/" rel="noopener" target="_blank">Artiklo</a>’ya yükleyin.</p>
`,
    publishedAt: "2025-08-26",
  },
  {
    id: "belge-yukleme-ve-analiz-nasil-calisir",
    title: "Belge Yükleme ve Analiz Nasıl Çalışır? (Artiklo Rehberi)",
    summary: "Belgenizi yükleyin, analiz edin ve size özel taslak oluşturun: 3 adımda Artiklo deneyimi.",
    seoTitle: "Belge Yükleme ve Analiz: Artiklo 3 Adım Rehberi",
    metaDescription: "Belge yükleme, analiz ve taslak oluşturma süreçleri: 3 adımda Artiklo nasıl çalışır?",
    canonical: "https://artiklo.legal/blog/belge-yukleme-ve-analiz-nasil-calisir",
    coverImage: "/onboarding-2.png",
    tags: ["Artiklo", "Rehber"],
    content: `
<h2>3 Adımda Süreç</h2>
<ol>
  <li><strong>Belge Yükle:</strong> Fotoğraf veya PDF'i güvenli şekilde yükleyin.</li>
  <li><strong>Analiz Et:</strong> Sistem resmi dili sadeleştirir; kritik alanları öne çıkarır.</li>
  <li><strong>Taslak Oluştur:</strong> Duruma özel dilekçe veya yanıt taslakları üretin.</li>
  </ol>

<p><strong>Örnek Kullanım Senaryoları:</strong></p>
<ul>
  <li><a href="/blog/icra-takibine-itiraz-dilekcesi">İcra takibine itiraz dilekçesi</a> hazırlama</li>
  <li><a href="/blog/veraset-ilami-nasil-okunur">Veraset ilamı</a> analizi ve anlama</li>
  <li><a href="/blog/kira-kontrati-7-kritik-madde-2025">Kira kontratı</a> inceleme ve risk analizi</li>
  <li>Diğer hukuki belge analizleri</li>
</ul>

<p>Hemen <a href="https://artiklo.com/" rel="noopener" target="_blank">ücretsiz deneyin</a>.</p>
`,
    publishedAt: "2025-08-26",
  },
  {
    id: "enforcement-file-edvlet",
    title: "E-Devlet İcra Takibi Bildirimi: Panik Yapmadan Atılacak 7 Adım",
    summary: "E-devlet hesabınızda 'icra takibi' bildirimi gördünüz mü? Panik yapmayın! Bu rehber size 7 gün içinde yapmanız gerekenleri adım adım anlatıyor.",
    seoTitle: "E-Devlet İcra Takibi Bildirimi: 7 Günde Yapılacaklar | 2025 Rehberi",
    metaDescription: "E-devlet'te icra takibi bildirimi gördünüz mü? 7 gün içinde yapmanız gerekenler, itiraz süreci ve haklarınız. Adım adım rehber.",
    canonical: "https://artiklo.legal/blog/enforcement-file-edvlet",
    faq: [
      { question: "E-devlet'te icra takibi bildirimi ne anlama gelir?", answer: "Birileri sizden alacağı olduğunu iddia ederek icra dairesine başvurmuş ve size ödeme emri gönderilmiş demektir. 7 gün içinde itiraz etme hakkınız var." },
      { question: "İcra takibi bildirimini gördükten sonra ne kadar sürem var?", answer: "Ödeme emrinin tebliği tarihinden itibaren 7 gün içinde icra dairesine itiraz etme hakkınız bulunur. Bu süre kesindir ve uzatılamaz." },
      { question: "E-devlet'teki bildirimi görmezden gelsem ne olur?", answer: "7 günlük süreyi kaçırırsanız takip kesinleşir ve maaş haczi, mal haczi gibi zorla tahsilat işlemleri başlatılabilir." },
      { question: "İcra takibine nasıl itiraz edebilirim?", answer: "İlgili icra dairesine giderek yazılı itiraz dilekçesi vermeniz gerekir. Artiklo ile otomatik dilekçe oluşturabilirsiniz." }
    ],
    tags: ["E-Devlet", "İcra Takibi", "Ödeme Emri", "İcra Hukuku", "Dijital Tebligat"],
    coverImage: "/e-devlet-icra.jpg",
    content: `<p>E-devlet hesabınızı kontrol ettiğinizde <strong>"İcra Takibi"</strong> başlıklı bir bildirim görmek, ilk anda oldukça korkutucu olabilir. Ancak panik yapmadan önce bu bildirimin ne anlama geldiğini ve yapmanız gerekenleri öğrenmek çok önemli.</p>

<p>Bu rehber, E-devlet'teki icra takibi bildirimi ile karşılaştığınızda atmanız gereken adımları detayıyla açıklayacak.</p>

<h2>E-Devlet İcra Takibi Bildirimi Nedir?</h2>
<p>E-devlet'te gördüğünüz <strong>icra takibi bildirimi</strong>, birinin sizden alacağı olduğunu iddia ederek icra dairesine başvurduğunu ve size bir ödeme emri gönderildiğini gösterir.</p>

<h3>Bildirimin İçerdiği Bilgiler:</h3>
<ul>
  <li><strong>Alacaklı bilgisi:</strong> Sizden parayı talep eden kişi/kurum</li>
  <li><strong>Alacak miktarı:</strong> İddia edilen borç tutarı</li>
  <li><strong>İcra dairesi:</strong> Hangi icra dairesinden geldiği</li>
  <li><strong>Dosya numarası:</strong> Takip için verilen numara</li>
  <li><strong>Tebliğ tarihi:</strong> Size ulaştığı tarih (çok önemli!)</li>
</ul>

<h2>Adım 1: Sakin Kalın ve Bilgileri Kaydedin</h2>
<p>İlk şok geçtikten sonra, bildirimdeki tüm bilgileri not alın. Özellikle şu detaylar kritiktir:</p>

<ul>
  <li>İcra dairesinin adı ve iletişim bilgileri</li>
  <li>Dosya numarası</li>
  <li>Alacaklının kim olduğu</li>
  <li>İddia edilen borç miktarı</li>
  <li><strong>En önemli:</strong> Tebliğ tarihi</li>
</ul>

<p><strong>Kritik Uyarı:</strong> Tebliğ tarihinden itibaren sadece <strong>7 gününüz</strong> var!</p>

<h2>Adım 2: Borcun Gerçekliğini Değerlendirin</h2>
<p>Bu aşamada kendinize şu soruları sormanız gerekir:</p>

<h3>Kontrol Edilecek Durumlar:</h3>
<ul>
  <li><strong>Borcu tanıyor musunuz?</strong> Gerçekten böyle bir borcunuz var mı?</li>
  <li><strong>Miktar doğru mu?</strong> Varsa borcunuz, iddia edilen tutar doğru mu?</li>
  <li><strong>Ödenmiş mi?</strong> Bu borcu daha önce ödediniz mi?</li>
  <li><strong>Zamanaşımı?</strong> Borç çok eski mi, zamanaşımına uğramış olabilir mi?</li>
</ul>

<h3>Delil Toplayın:</h3>
<ul>
  <li>Ödeme makbuzları</li>
  <li>Banka ekstreleri</li>
  <li>İlgili sözleşmeler</li>
  <li>Yazışma kayıtları</li>
</ul>

<h2>Adım 3: 7 Günlük Süreyi Kaçırmayın</h2>
<p>E-devlet'teki tebliğ tarihinden itibaren <strong>7 gün içinde</strong> ilgili icra dairesine gidip itiraz etmeniz gerekir.</p>

<h3>Süre Kaçırılırsa Ne Olur:</h3>
<ul>
  <li>İcra takibi kesinleşir</li>
  <li><a href="/blog/maas-haczi-nedir-nasil-uygulanir">Maaş haczi</a> uygulanabilir</li>
  <li>Mal haczi yapılabilir</li>
  <li>Banka hesapları bloke edilebilir</li>
  <li>İtiraz hakkınız büyük ölçüde sona erer</li>
</ul>

<h2>Adım 4: İcra Dairesine Gitmeye Hazırlanın</h2>
<p>İcra dairesine gitmeden önce hazırlamanız gerekenler:</p>

<h3>Gerekli Belgeler:</h3>
<ul>
  <li>Kimlik kartı (asıl)</li>
  <li>E-devlet'teki bildirimin çıktısı</li>
  <li>Varsa ilgili deliller</li>
  <li>İtiraz dilekçesi (önceden hazırlayın)</li>
</ul>

<h2>Adım 5: İtiraz Dilekçesi Hazırlayın</h2>
<p>İcra takibine itiraz için yazılı dilekçe vermeniz şarttır. <a href="/blog/icra-takibine-itiraz-dilekcesi">İcra takibine itiraz dilekçesi nasıl hazırlanır</a> rehberimizden detayları öğrenebilirsiniz.</p>

<h3>Dilekçede Bulunması Gerekenler:</h3>
<ul>
  <li>İcra dairesinin adı</li>
  <li>Dosya numarası</li>
  <li>Taraf bilgileri</li>
  <li>İtiraz gerekçeleriniz</li>
  <li>Hukuki dayanaklar</li>
</ul>

<h2>Adım 6: Artiklo ile Hızlı Analiz</h2>
<p>Zaman kısa olduğu için hızlı hareket etmeniz gerekir. <a href="/blog/belge-yukleme-ve-analiz-nasil-calisir">Artiklo'nun belge analiz sistemi</a> ile:</p>

<ul>
  <li>Ödeme emrinizi yükleyin</li>
  <li>Durumunuzu analiz edin</li>
  <li>Size özel itiraz dilekçesi oluşturun</li>
  <li>Yapmanız gerekenleri öğrenin</li>
</ul>

<h2>Adım 7: İtirazınızı Teslim Edin</h2>
<p>Hazırladığınız itiraz dilekçesini 7 gün içinde icra dairesine teslim etmelisiniz.</p>

<h3>Teslim Sırasında Dikkat Edilecekler:</h3>
<ul>
  <li>En az 2 kopya hazırlayın</li>
  <li>Bir kopyayı size iade etmelerini isteyin</li>
  <li>Tarih ve kaşe içeren alındı belgesi alın</li>
  <li>Teslim tarihini kaydetmeyi unutmayın</li>
</ul>

<h2>İtiraz Sonrası Süreç</h2>
<p>İtirazınızı verdikten sonra ne olacak:</p>

<ol>
  <li><strong>Takip durur:</strong> İcra işlemleri geçici olarak durdurulur</li>
  <li><strong>Alacaklıya bildirilir:</strong> İtirazınız karşı tarafa tebliğ edilir</li>
  <li><strong>İtirazın iptali davası:</strong> Alacaklı, itirazınızın iptal edilmesi için dava açabilir</li>
  <li><strong>Mahkeme süreci:</strong> Hakim, itirazınızın haklı olup olmadığını değerlendirir</li>
</ol>

<h2>İnkar Tazminatı Riski</h2>
<p>Haksız ve kötü niyetli itirazlarda <a href="/blog/icra-inkar-tazminati-nedir">%20 icra inkar tazminatı</a> riski vardır. Ancak haklı gerekçeleriniz varsa bu riskten korkmayın.</p>

<h2>E-Devlet Dijital Tebligat Avantajları</h2>
<p>E-devlet üzerinden tebligat almanın faydaları:</p>

<ul>
  <li><strong>Hızlı ulaşım:</strong> Anında haberdar olursunuz</li>
  <li><strong>Kayıt altında:</strong> Tebliğ tarihi kesin olarak belirlenir</li>
  <li><strong>7/24 erişim:</strong> İstediğiniz zaman kontrol edebilirsiniz</li>
  <li><strong>Belge güvenliği:</strong> Kaybetme riski yoktur</li>
</ul>

<h2>Yaygın Hatalar ve Tuzaklar</h2>

<h3>Yapılmaması Gerekenler:</h3>
<ul>
  <li><strong>Görmezden gelmek:</strong> Umduğunuz gibi kendiliğinden çözülmez</li>
  <li><strong>Süreyi kaçırmak:</strong> 7 gün kesin süre, uzatılmaz</li>
  <li><strong>Sadece telefon etmek:</strong> Yazılı itiraz şart</li>
  <li><strong>Genel itiraz yazmak:</strong> Spesifik gerekçeler sunmak gerekir</li>
</ul>

<h2>Sonuç: Bilinçli Hareket Edin</h2>
<p>E-devlet'te icra takibi bildirimi görmek korkutucu olabilir, ancak doğru adımlarla başa çıkılabilir bir durumdur. En önemli nokta <strong>7 günlük süreyi kaçırmamak</strong> ve yazılı itirazınızı zamanında teslim etmektir.</p>

<p><strong>Unutmayın:</strong> Bu rehber size genel bilgi verir, ancak özel durumunuz için mutlaka uzman desteği alın.</p>

<p>Hemen <a href="https://artiklo.com/" rel="noopener" target="_blank">Artiklo ile belgenizi analiz edin</a> ve durumunuza özel çözüm alın.</p>`,
    publishedAt: "2024-07-10",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
};

const BlogPreviewCard = ({ post }: { post: BlogPost }) => {
  return (
    <Link to={`/blog/${post.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        {post.coverImage && (
          <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              <ArrowRight className="h-3 w-3 text-primary" />
            </div>
          </div>
        )}
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <span className="text-muted-foreground/60">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{calculateReadTime(post.content)} dk okuma</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge variant="outline" className="rounded-full text-xs">
                  +{post.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-3 flex-grow">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {post.summary}
          </p>

          <div className="mt-auto pt-2">
            <div className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all duration-300">
              Devamını Oku
              <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const Blog = () => {
  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.summary.toLowerCase().includes(search.toLowerCase()) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/30 to-background pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
              Artiklo Blog
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Hukuk ve Belgeler Üzerine{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Güncel Rehberler
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Resmi belgeleri anlamanız ve doğru adımları atmanız için uzmanlarımızdan pratik anlatımlar.
            </p>
          </div>

          {/* Advanced Search Section */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-2 shadow-lg">
                <div className="flex items-center gap-3">
                  <Search className="text-muted-foreground h-5 w-5 ml-4" />
                  <Input
                    type="text"
                    placeholder="Hangi konuda rehber arıyorsunuz?"
                    className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 flex-1"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearch("")}
                      className="mr-2 h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <span className="sr-only">Temizle</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {search && (
              <div className="mt-4 text-center">
                <span className="text-sm text-muted-foreground">
                  "{search}" için {filteredPosts.length} makale bulundu
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-24">
            <div className="mx-auto max-w-md">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sonuç Bulunamadı</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Aradığınız "{search}" terimiyle ilgili makale bulunamadı. Farklı terimler deneyebilir veya tüm makaleleri görüntüleyebilirsiniz.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSearch("")}
                className="font-semibold"
              >
                Tüm Makaleleri Göster
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredPost && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-px bg-gradient-to-r from-primary/60 to-transparent flex-1"></div>
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-wider px-4">
                    Öne Çıkan Makale
                  </h2>
                  <div className="h-px bg-gradient-to-l from-primary/60 to-transparent flex-1"></div>
                </div>

                <Link to={`/blog/${featuredPost.id}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                      {featuredPost.coverImage && (
                        <div className="relative overflow-hidden aspect-[4/3] md:aspect-[5/4]">
                          <img
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(featuredPost.publishedAt)}</span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{calculateReadTime(featuredPost.content)} dk okuma</span>
                        </div>

                        {featuredPost.tags && featuredPost.tags.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {featuredPost.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                          {featuredPost.summary}
                        </p>
                        <div className="inline-flex items-center font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                          Detaylı İncele
                          <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </section>
            )}

            {/* Other Articles Grid */}
            {otherPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-px bg-gradient-to-r from-primary/60 to-transparent flex-1"></div>
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-wider px-4">
                    Diğer Makaleler
                  </h2>
                  <div className="h-px bg-gradient-to-l from-primary/60 to-transparent flex-1"></div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {otherPosts.map(post => (
                    <BlogPreviewCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="mt-24">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl"></div>
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 text-center shadow-xl">
              <div className="mx-auto max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                  Artiklo'yu Deneyin
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Kendi Belgelerinizi Analiz Edin
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Blog yazılarımızdan ilham aldınız mı? Artık kendi belgelerinizi Artiklo ile analiz ederek
                  kişiselleştirilmiş rehber ve çözümler alabilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth" className="inline-flex">
                    <Button size="lg" className="font-semibold group">
                      Ücretsiz Analiz Başlat
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/nasil-calisir" className="inline-flex">
                    <Button variant="outline" size="lg" className="font-semibold">
                      Nasıl Çalışır?
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog; 