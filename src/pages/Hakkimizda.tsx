import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Hakkimizda = () => (
  <div className="max-w-3xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Bir Fikirden Daha Fazlası: Artiklo'nun Hikayesi</h1>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground text-center">Her şey basit bir soruyla başladı: Hayatımızı doğrudan etkileyen belgeleri neden anlamak zorunda değilmişiz gibi davranıyoruz?</h2>
      <p className="text-muted-foreground text-center mb-6">Bir mahkeme tebligatı, bir kira kontratı, bir veraset ilamı... Bu belgelerle karşılaştığımızda hissettiğimiz o yabancılık ve çaresizlik hissini hepimiz biliriz. Anlamadığımız bir dil yüzünden haklarımızın kaybolabileceği veya yanlış bir adım atabileceğimiz korkusuyla yaşarız.<br/><br/>Biz, bu duruma bir son vermek için yola çıktık. Bilginin, sadece hukukçuların veya uzmanların elinde bir güç olduğu bir dünyayı kabul etmedik. Artiklo, bu inancın bir ürünüdür.</p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Misyonumuz: Bilgiyi Demokratikleştirmek</h2>
      <p className="text-muted-foreground">Artiklo'daki temel misyonumuz; en karmaşık hukuki, resmi ve bürokratik dili herkes için anında anlaşılır, erişilebilir ve eyleme geçirilebilir bilgiye dönüştürmektir. Teknolojiyi, vatandaş ile adalet arasındaki duvarları yıkmak için bir köprü olarak kullanıyoruz. Amacımız, tek bir tıkla belirsizliği ortadan kaldırmak ve her bireyi kendi hakları konusunda daha bilinçli ve daha güçlü kılmaktır.</p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Vizyonumuz: Herkes İçin Dijital Adalet</h2>
      <p className="text-muted-foreground">Türkiye'de ve dünyada hukuki okuryazarlığın bir lüks değil, bir standart haline geldiği bir gelecek hayal ediyoruz. Vizyonumuz, Artiklo'nun sadece bir "belge sadeleştirme" aracı olmasının ötesine geçerek, adalete erişimde fırsat eşitliği sağlayan bir sosyal inovasyon lideri olmasıdır. Hiç kimsenin, anlamadığı bir belge yüzünden geceleri uykusunun kaçmadığı bir dünya yaratmak, bizim en büyük hedefimizdir.</p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Bize Yol Gösteren Değerler</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li><b>Önce İnsan:</b> Teknolojiyi insanlar için geliştiriyoruz. Arayüzümüzün sadeliğinden metinlerimizin anlaşılırlığına kadar her detayda, odağımızda her zaman siz varsınız.</li>
        <li><b>Gizliliğin Kutsallığı:</b> Güven, her şeyden önce gelir. Verilerinizin sadece size ait olduğuna inanıyor ve bu ilkeyi sarsılmaz bir taahhütle koruyoruz.</li>
        <li><b>Erişilebilirlik:</b> Bilgi temel bir haktır. Bu hakka erişimin önünde finansal veya teknik hiçbir engel olmamalıdır.</li>
        <li><b>Cesaret ve İnovasyon:</b> Statükoya meydan okumaktan ve en zor sorunlara teknolojiyle çözüm aramaktan asla çekinmeyiz.</li>
      </ul>
    </section>
    <section className="mb-10 text-center">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Bu Yolculuğun Bir Parçası Olun</h2>
      <p className="text-muted-foreground mb-6">Artiklo, bir ekipten daha fazlasıdır; ortak bir amaca inanan bir topluluktur. Bu vizyonu paylaşıyorsanız, sizi de aramızda görmekten mutluluk duyarız.</p>
      <Button asChild size="lg" className="px-8 py-4 text-lg font-bold mb-4">
        <a href="/" aria-label="Artiklo'yu Şimdi Deneyin">Artiklo'yu Şimdi Deneyin</a>
      </Button>
      <div>
        <Link to="/nedenartiklo" className="underline text-primary hover:text-foreground text-base font-medium">Neden Bizi Seçmelisiniz?</Link>
      </div>
    </section>
  </div>
);

export default Hakkimizda; 