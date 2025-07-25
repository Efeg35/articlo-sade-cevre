import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, MessageSquareText, CheckCircle2, Shield, Eye, MapPin } from "lucide-react";

const NasilCalisir = () => {
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate("/auth");
  };

  const steps = [
    {
      number: 1,
      title: "Belgenizi Güvenle Yükleyin",
      description: "Anlamak istediğiniz belgenin fotoğrafını çekin, PDF/Word dosyasını seçin veya metni doğrudan yapıştırın. Hangi formatta olursa olsun, tüm yüklemeler bankacılık seviyesinde 256-bit SSL şifrelemesiyle korunur.",
      icon: FileText
    },
    {
      number: 2,
      title: "Derinlemesine Yapay Zeka Analizi",
      description: "Siz beklerken, gelişmiş AI motorumuz metninizi satır satır tarar. Bu aşamada sadece kelimeleri değil, cümleler arasındaki hukuki anlamları, ilişkileri ve olası sonuçları da çözümler.",
      icon: Sparkles
    },
    {
      number: 3,
      title: "Anlaşılır Sonuç: Sade Türkçe Açıklama",
      description: "Analizin ilk çıktısı, karmaşık ve teknik dille yazılmış belgenizin herkesin anlayacağı, net ve akıcı bir Türkçeye çevrilmiş halidir. Artık metne yabancı kalmayacaksınız.",
      icon: MessageSquareText
    },
    {
      number: 4,
      title: "Vakit Kazandıran \"Yönetici Özeti\"",
      description: "Belgenin tamamını okumanıza gerek kalmadan, en kritik bilgileri, ana talepleri ve önemli sonuçları içeren bir özet sunulur. En can alıcı noktalar, gözünüzden kaçmaması için sizin için vurgulanır.",
      icon: CheckCircle2
    },
    {
      number: 5,
      title: "Kişisel Etki Analizi: \"Bu Sizin İçin Ne Anlama Geliyor?\"",
      description: "Artiklo, bir adım daha ileri giderek belgenin sizi kişisel olarak nasıl etkilediğini açıklar: Size ne gibi haklar tanıdığını ve ne tür yükümlülükler getirdiğini net bir şekilde ortaya koyar.",
      icon: Eye
    },
    {
      number: 6,
      title: "Yol Haritanız: Somut Eylem Planı",
      description: "Belirsizliğe son veriyoruz. \"Peki, şimdi ne yapmalıyım?\" sorusuna, atmanız gereken adımları öncelik sırasına göre listeleyen, size özel ve net bir planla cevap veriyoruz.",
      icon: MapPin
    },
    {
      number: 7,
      title: "Otomatik Etiketleme: Kilit Bilgiler Elinizin Altında",
      description: "Metindeki tüm önemli isimler, şirketler, tarihler, para tutarları ve kanun maddeleri otomatik olarak tespit edilir ve tek tıkla erişebileceğiniz, düzenli bir listede size sunulur.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nasıl Çalışır?
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Artiklo'nun gücünü 7 adımda keşfedin: Yükleyin, arkanıza yaslanın ve belgenizin sırlarını çözmesini izleyin.
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Tüm Bu Gücü Kendiniz Deneyimleyin
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Artiklo'nun karmaşık bir belgeyi nasıl saniyeler içinde net bir yol haritasına dönüştürdüğünü görün.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartAnalysis}
              className="px-6 py-3 font-semibold"
            >
              İlk Belgenizi Ücretsiz Analiz Edin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NasilCalisir; 