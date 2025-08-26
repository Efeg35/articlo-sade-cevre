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
      { question: "İtiraz süresi kaç gündür?", answer: "Tebligat tarihinden itibaren 7 gün içinde itiraz etmelisiniz (İİK m.62)." },
      { question: "E-devlet’ten itiraz yapılır mı?", answer: "Uygulamaya göre değişir; çoğunlukla fiziki teslim esastır, dairenizle teyit edin." }
    ],
    tags: ["İcra", "Dilekçe", "Rehber"],
    content: `<p>Elinize bir ödeme emri ulaştı ve acilen bir <strong>icra takibine itiraz dilekçesi</strong> hazırlamanız gerekiyor. Hukuki konulara yabancıysanız, bu durum sizi strese sokabilir. Çünkü elinizdeki resmi belgenin dili karmaşık ve daha da önemlisi, itiraz etmek için <strong>sadece 7 gününüz</strong> var. Bu kısa sürede yapacağınız bir hata, haklarınızı kaybetmenize neden olabilir; ayrıca ciddi para kaybı yaşanabilir.</p>

<p>Neyse ki bu süreçle tek başınıza başa çıkmak zorunda değilsiniz. Bu rehber, <strong>icra takibine itiraz dilekçesi</strong> yazarken tüm endişelerinizi gidermek için hazırlandı. Amacımız, konuyu sizin için basitleştirmek ve bu 7 günü lehinize çevirmenize yardım etmektir.</p>

<h2>Ödeme Emri Aldınız: Şimdi Ne Olacak?</h2>
<p>Öncelikle, elinizdeki belgenin ne anlama geldiğini basitçe anlayalım. Ödeme emri, birinin sizden borcunu almak için başlattığı yasal bir işlemdir. Bu belge size ulaştığı andan itibaren, itiraz etmek için <strong>sadece 7 gününüz</strong> olduğunu unutmayın.</p>

<img src="/icra-7-süre.png" alt="7 günlük icra itiraz süresi takvimi" className="my-6 w-full max-w-md mx-auto rounded-lg shadow-sm" />

<h3>Süreyi kaçırırsanız ne olur?</h3>
<ul>
<li><strong>Takip kesinleşir:</strong> Borcu kabul etmiş sayılırsınız ve alacaklı kişi maaş haczi gibi yasal işlemlere başlayabilir.</li>
<li><strong>İtiraz hakkı büyük ölçüde kaybolur:</strong> Bu aşamadan sonra borca itiraz etmeniz neredeyse imkansız hale gelir.</li>
<li>Bu nedenle, belgeyi alır almaz harekete geçmek zorundasınız.</li>
</ul>

<h2>Adım Adım: Hatasız Bir İcra Takibine İtiraz Dilekçesi Hazırlamak</h2>
<p>Genel şablonlarla ilerlemek risklidir; her dosya farklıdır. Size özel ve hatasız bir dilekçe oluşturmanın modern ve güvenli bir yolu var.</p>

<h3>1. Adım: Önce Anlayın, Sonra Harekete Geçin (Artiklo ile Dakikalar İçinde)</h3>
<ul>
<li><strong>Belgenizi yükleyin:</strong> Size gelen ödeme emrinin fotoğrafını çekin veya PDF halini Artiklo platformuna yükleyin.</li>
<li><strong>Yapay zeka sadeleştirsin:</strong> Yüklediğiniz belge, yapay zeka tarafından anında taranır; karmaşık resmi dil sade Türkçeye çevrilir. Tüm kritik detaylar (tarih, icra dairesi, dosya no, taraflar) netleşir.</li>
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

<p>Detaylı bilgi için şu yazımıza göz atın: <a href="/blog/icra-inkar-tazminati-nedir">İcra İnkar Tazminatı Nedir?</a></p>

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

<p>Kısacası, bilgi ve doğru araçlar bu süreçteki en büyük gücünüzdür. İlk adımı şimdi atın: <a href="https://artiklo.com" target="_blank" rel="noopener">Artiklo'yu ücretsiz deneyin</a>.</p>`,
    publishedAt: "2025-08-26",
  },
  {
    id: "veraset-ilami-nasil-okunur",
    title: "Veraset İlamı Nedir ve Nasıl Okunur? (Adım Adım Anlama Rehberi)",
    summary: "Veraset ilamı (mirasçılık belgesi) karmaşık görünebilir, ancak bu rehber size belgeyi adım adım anlamanız için yardımcı olacak. Hukuki terimlerin anlamından, sonraki adımlara kadar her şey bu yazıda.",
    content: `Yakınınızı kaybettikten sonraki zorlu süreçte elinize Noter veya Mahkeme'den "Veraset İlamı" ya da yeni adıyla "Mirasçılık Belgesi" başlıklı bir evrak ulaştıysa, ne anlama geldiğini merak etmeniz çok doğal.

İlk bakışta karmaşık ve eski kelimelerle dolu bu belge, aslında mirasçı olarak haklarınızı gösteren resmi bir yol haritasıdır. Çoğu zaman kafa karıştırıcı olsa da, içeriğini anladığınızda tüm süreç sizin için daha net hale gelecektir.

Bu rehber, o haritayı sizin için adım adım okuyacak ve anlaşılır hale getirecek.

Veraset İlamı (Mirasçılık Belgesi) Tam Olarak Nedir?
Kısaca bu belge, vefat eden bir kişinin (hukuki adıyla 'muris') geride bıraktığı yasal mirasçılarının kimler olduğunu ve bu mirasçıların her birinin mirastan ne kadar pay ('hisse') alacağını kanıtlayan resmi bir kimlik kartı gibidir.

Bu belge olmadan, vefat eden yakınınızın bankadaki parası, evi, arabası veya diğer mal varlıkları üzerinde hiçbir yasal işlem yapamazsınız. Tapuda ev devri, bankadan para çekme veya araba satışı gibi tüm işlemler için bu belgenin ibraz edilmesi zorunludur. Kısacası, bu belge sizin mirastaki haklarınızın resmi anahtarıdır.

Belgedeki Yaygın Hukuki Terimler İçin Sade Bir Sözlük
Belgeyi okumanızı kolaylaştıracak en temel kelimelerin anlamları şunlardır:

Muris: Vefat eden ve mirası kalan kişi.

Mirasçı (Varis): Murisin mirası üzerinde yasal hak sahibi olan kişi veya kişiler.

Tereke: Murisin geride bıraktığı her şey: Ev, araba, bankadaki para gibi tüm varlıkları VE varsa tüm borçları. Miras, sadece mal varlıklarından değil, borçlardan da oluşabilen bir bütündür.

Hisse (Pay): Her mirasçının bu bütünden alacağı pay. Genellikle 1/4 veya 8/24 gibi kesirli sayılarla gösterilir.

İzale-i Şuyu: Mirasçılar arasında paylaşılamayan (örneğin tek bir ev gibi) bir malın, mahkeme yoluyla satılarak parasının mirasçılar arasında paylaştırılması. Kısaca "ortaklığın sonlandırılması" davası demektir.

Pay Oranları (Örn: 8/24) Nasıl Anlaşılır?
Belgede genellikle "8/24 payın Ayşe Yılmaz'a ait olduğu..." gibi ifadeler görürsünüz ve bu kesirler kafa karıştırabilir. Mantığı aslında basittir:

Mirasın tamamı (tereke), kesrin altındaki sayı (payda) olarak kabul edilir. Örneğimizde miras 24 birimdir. Kesrin üstündeki sayı (pay) ise sizin o bütünden aldığınız payı gösterir.

Yani, payınız 8/24 ise, bu 24 birimlik mirasın 8 biriminin, yani üçte birinin (1/3) size ait olduğu anlamına gelir. Diğer mirasçıların payları da toplandığında bütünün tamamını (24/24) oluşturmalıdır.

Veraset İlamını Aldıktan Sonra Atılacak Adımlar
Belgeyi Doğru Anlamak ve Yorumlamak (İlk Adım): Her şeyden önce, elinizdeki belgedeki tüm tarafları, pay oranlarını ve özel durumları net bir şekilde anladığınızdan emin olun. Belgenin bir fotoğrafını çekip Artiklo'ya yükleyerek, kimin "muris", kimin "mirasçı" olduğunu ve size düşen payın ne anlama geldiğini saniyeler içinde, sade bir Türkçe ile görebilirsiniz.

Veraset ve İntikal Vergisini Beyan Etmek: Mirasçılık belgesini aldıktan sonra 4 ay içinde ilgili vergi dairesine giderek "Veraset ve İntikal Vergisi Beyannamesi" vermeniz gerekir. Bu, miras kalan malların devlete bildirilmesi işlemidir.

Mirasın İntikal İşlemlerini Başlatmak (Tapu, Banka vb.): Vergi dairesinden alacağınız "ilişiği yoktur" yazısı ve veraset ilamı ile birlikte, vefat eden kişinin üzerine kayıtlı olan ev, arsa gibi mülkleri tapu dairesinde kendi adınıza işletebilir, banka hesaplarındaki parayı payınız oranında çekebilirsiniz.

Anlaşmazlık Durumunda Hukuki Destek Almak: Eğer mirasçılar arasında mal paylaşımı konusunda bir anlaşmazlık varsa (örneğin biri evi satmak isterken diğeri istemiyorsa), bu noktada bir "izale-i şuyu" davası gündeme gelebilir. Bu tür karmaşık ve çekişmeli durumlarda mutlaka bir avukattan profesyonel destek almalısınız.

Artiklo, Miras Belgenizi Nasıl "Tercüme" Eder?
Artiklo'ya veraset ilamınızı yüklediğinizde, yapay zeka saniyeler içinde:

Belgedeki "muris" ve tüm "mirasçıları" isim isim listeler.

Her bir mirasçıya düşen hisse oranını (8/24 gibi) tespit eder ve "Mirasın üçte biri" gibi anlaşılır bir ifadeye çevirir.

"İzale-i şuyu" gibi karmaşık hukuki terimleri sizin için sade bir dille açıklar.

Size, bir sonraki adımda ne yapmanız gerektiğine dair basit bir eylem planı sunar.

Sonuç: Anlamak, Haklarınızı Korumanın İlk Adımıdır
Miras süreci, duygusal olarak zorlayıcı bir dönemde atılması gereken hukuki adımlarla dolu olabilir. Bu sürecin ilk ve en önemli adımı, haklarınızın ne olduğunu gösteren mirasçılık belgesini doğru anlamaktır. Belgeyi anladığınızda, süreci daha sakin ve bilinçli yönetebilir, haklarınızı koruyabilir ve olası anlaşmazlıkları en aza indirebilirsiniz.

Önemli Yasal Uyarı
Artiklo ve bu blog yazısı, karmaşık hukuki metinleri anlamanız için tasarlanmış güçlü bir yardımcıdır. Ancak, içeriğimiz hiçbir şekilde hukuki tavsiye niteliği taşımaz. Miras intikal işlemleri, vergi beyannamesi veya miras paylaşım davası gibi yasal bir eylemde bulunmadan önce mutlaka alanında uzman bir avukata danışmanız kritik önem taşımaktadır. Artiklo'yu en iyi yol arkadaşınız, avukatınızı ise en güvenilir rehberiniz olarak görün.`,
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
    content: `Kira sözleşmeleri, hem kiracı hem de ev sahibi için bağlayıcıdır. Bu yazıda, imzalamadan önce dikkat etmeniz gereken 5 önemli maddeyi açıklıyoruz...\n\n1. Kira Bedeli ve Artış Şartları...\n2. Depozito Koşulları...\n3. Tahliye Şartları...\n4. Aidat ve Ek Masraflar...\n5. Sözleşmenin Süresi ve Yenilenmesi...\n\nHer maddeyi detaylıca inceleyerek, haklarınızı ve yükümlülüklerinizi öğrenin.`,
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
  <li><strong>Belge Yükle:</strong> Fotoğraf veya PDF’i güvenli şekilde yükleyin.</li>
  <li><strong>Analiz Et:</strong> Sistem resmi dili sadeleştirir; kritik alanları öne çıkarır.</li>
  <li><strong>Taslak Oluştur:</strong> Duruma özel dilekçe veya yanıt taslakları üretin.</li>
  </ol>
<p>Hemen <a href="https://artiklo.com/" rel="noopener" target="_blank">ücretsiz deneyin</a>.</p>
`,
    publishedAt: "2025-08-26",
  },
  {
    id: "enforcement-file-edvlet",
    title: "E-Devlet'te 'İcra Takibi' Bildirimi Ne Anlama Geliyor?",
    summary: "E-devlet hesabınızda bir 'icra takibi' bildirimi görmek endişe verici olabilir. Panik yapmadan önce atmanız gereken adımları öğrenin.",
    content: `E-devlet'te karşınıza çıkan 'icra takibi' bildirimi, bir alacaklının hakkını yasal yollardan talep ettiğini gösterir. Bu yazıda, bildirimi gördüğünüzde neler yapmanız gerektiğini adım adım anlatıyoruz...\n\n1. Bildirimin Kaynağını Kontrol Edin...\n2. Borcun Gerçekliğini Sorgulayın...\n3. Yasal Süreçleri ve Haklarınızı Öğrenin...\n4. Gerekirse Uzman Desteği Alın...\n\nUnutmayın, zamanında ve doğru adım atmak çok önemli!`,
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
    <Card className="group overflow-hidden border-muted/40">
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{calculateReadTime(post.content)} dk</span>
        </div>
        <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
            ))}
          </div>
        )}
        <p className="text-muted-foreground leading-relaxed mb-4">
          {post.summary}
        </p>
        <Link to={`/blog/${post.id}`} className="inline-flex items-center font-semibold text-primary">
          Devamını Oku
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

const Blog = () => {
  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      <section className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-3 text-muted-foreground">
            <span>Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Hukuk ve Belgeler Üzerine Güncel Rehberler</h1>
          <p className="mt-3 text-muted-foreground">Resmi belgeleri anlamanız ve doğru adımları atmanız için pratik anlatımlar.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Makalelerde ara..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="hidden sm:block" />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length === 0 ? (
            <Card className="sm:col-span-2 lg:col-span-3 text-center py-12">
              <CardContent>
                <p className="text-muted-foreground text-lg">Aradığınız kriterlere uygun makale bulunamadı.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>Tüm Makaleleri Göster</Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <BlogPreviewCard key={post.id} post={post} />
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-muted/40 border rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Kendi Belgelerinizi Analiz Edin</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Blog yazılarımızdan ilham aldınız mı? Belgelerinizi Artiklo ile analiz ederek net cevaplar alın.</p>
            <Link to="/auth" className="inline-flex">
              <Button size="lg" className="font-semibold">
                Ücretsiz Analiz Başlat
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 