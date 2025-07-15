import { Button } from "../components/ui/button";

const NedenArtiklo = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Neden Artiklo?</h1>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground text-center">Çünkü karmaşık belgeler, hayatınızı ertelemek için bir neden olmamalı.</h2>
      <p className="text-muted-foreground text-center mb-6">Resmi bir dil, anlaşılmaz terimler ve sayfalarca metin... Bir sözleşme, mahkeme kararı veya tebligatla karşılaştığınızda hissettiğiniz stresi ve belirsizliği anlıyoruz. Artiklo, tam olarak bu sorunu çözmek için doğdu. Biz, teknolojiyle bilgiyi birleştirerek gücü yeniden sizin elinize veriyoruz.</p>
    </section>
    <section className="mb-10">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex gap-4 items-start">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-lg font-semibold mb-1">Saniyeler İçinde Netlik: Çünkü Zamanınız Değerli</h3>
            <p className="text-muted-foreground">Sayfalarca metni dakikalarca okumak zorunda değilsiniz. Artiklo, en karmaşık hukuki ve bürokratik belgeleri bile saniyeler içinde analiz eder. Size sadece sadeleştirilmiş bir metin değil, aynı zamanda belgenin sizin için ne anlama geldiğini gösteren bir özet ve atmanız gereken adımları içeren bir yol haritası sunar.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="text-lg font-semibold mb-1">Verileriniz Kutsaldır: %100 Güvenlik ve Gizlilik Garantisi</h3>
            <p className="text-muted-foreground">Gizliliğiniz, bizim için bir özellik değil, bir yemindir. Artiklo'ya yüklediğiniz hiçbir belge veya kişisel veri sunucularımızda asla kalıcı olarak saklanmaz. İşlem tamamlandıktan sonra verileriniz silinir. Tüm veri transferleri uçtan uca şifrelenir ve kişisel bilgileriniz asla üçüncü kişilerle paylaşılmaz. Gönül rahatlığıyla kullanabilirsiniz.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-lg font-semibold mb-1">Sadece Sadeleştirmeyen, Anlam Katan Teknoloji</h3>
            <p className="text-muted-foreground">Gücümüzü, Google'ın en gelişmiş Gemini yapay zeka modellerinden alıyoruz. Teknolojimiz, metindeki kelimeleri değiştirmekle kalmaz; hukuki jargonu, önemli tarihleri, para birimlerini ve sorumlu tarafları tespit ederek belgenin ardındaki anlamı ve niyeti ortaya çıkarır. Bu, basit bir çeviriden çok daha fazlasıdır; bu, bir analiz ve içgörüdür.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Bizim Felsefemiz: Sadece Size Odaklanmak</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li><b>Biz Bir Veritabanı Değiliz, Sizin Kişisel "Tercümanınız":</b> Amacımız size binlerce kanun maddesi sunmak değil, elinizdeki tek bir belgenin sizin için ne ifade ettiğini anlatmaktır.</li>
        <li><b>Gizlilik Bir Seçenek Değil, Zorunluluktur:</b> "Verileri sil" düğmesine basmanıza gerek yok. Biz bunu sizin için otomatik olarak yapıyoruz. Çünkü doğru olan bu.</li>
        <li><b>Bilgiye Erişimin Önünde Engel Olmaz:</b> Misyonumuz bilgiyi demokratikleştirmek. Bu yüzden Artiklo'nun temel hizmetleri her zaman ücretsiz, reklamsız ve kullanıcı dostu olacaktır.</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Bir Yazılımdan Daha Fazlası: Dijital Adalet Vizyonu</h2>
      <p className="text-muted-foreground mb-2">Artiklo, yalnızca ticari bir girişim değildir. Biz, Türkiye'nin dijital dönüşümünde adalete erişimi kolaylaştıran bir sosyal inovasyon projesiyiz. Her vatandaşın, finansal durumu veya hukuki bilgisi ne olursa olsun, haklarını ve yükümlülüklerini anlayabilmesi gerektiğine inanıyoruz. Bu, bizim en büyük motivasyonumuzdur.</p>
    </section>
    <section className="mb-10 text-center">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Karmaşaya Son Vermeye Hazır Mısınız?</h2>
      <p className="text-muted-foreground mb-6">Belirsizliğin ve stresin yerini netliğin ve güvenin almasına izin verin. İlk belgenizi şimdi yükleyin ve Artiklo farkını saniyeler içinde kendiniz görün.</p>
      <Button asChild size="lg" className="px-8 py-4 text-lg font-bold">
        <a href="/" aria-label="Hemen Ücretsiz Deneyin">Hemen Ücretsiz Deneyin</a>
      </Button>
    </section>
  </div>
);

export default NedenArtiklo; 