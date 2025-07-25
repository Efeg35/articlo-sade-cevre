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
};

// Örnek blog verisi
export const blogPosts: BlogPost[] = [
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
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <Clock className="h-4 w-4" />
          <span>{calculateReadTime(post.content)} dk okuma</span>
        </div>
        <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground leading-relaxed mb-4">
          {post.summary}
        </p>
        <Link to={`/blog/${post.id}`}>
          <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:bg-transparent">
            Devamını Oku
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Artiklo Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Hukuki konularda bilgilenin, haklarınızı öğrenin ve belgelerinizi daha iyi anlayın.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Makalelerde ara..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto">
          {filteredPosts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Aradığınız kriterlere uygun makale bulunamadı.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearch("")}
                >
                  Tüm Makaleleri Göster
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="grid gap-6">
            {filteredPosts.map(post => (
              <BlogPreviewCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {filteredPosts.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                Kendi Belgelerinizi Analiz Edin
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Blog yazılarımızdan ilham aldınız mı? Şimdi kendi belgelerinizi Artiklo ile analiz ederek net cevaplar alın.
              </p>
              <Link to="/auth">
                <Button size="lg" className="font-semibold">
                  Ücretsiz Analiz Başlat
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog; 