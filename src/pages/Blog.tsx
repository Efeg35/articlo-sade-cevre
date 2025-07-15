import React, { useState } from "react";
import BlogPreviewCard from "../components/BlogPreviewCard";

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

const Blog = () => {
  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">Artiklo Blog</h1>
      <div className="mb-6 sm:mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Makalelerde ara..."
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-background text-foreground shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-4 sm:space-y-6">
        {filteredPosts.length === 0 && (
          <div className="text-center text-muted-foreground">Aradığınız kriterlere uygun makale bulunamadı.</div>
        )}
        {filteredPosts.map(post => (
          <BlogPreviewCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog; 