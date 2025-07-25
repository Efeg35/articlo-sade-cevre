import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  onButtonClick: () => void;
}

const PricingCard = ({ title, description, price, features, buttonText, popular, onButtonClick }: PricingCardProps) => {
  return (
    <Card className={cn(
      "relative flex flex-col",
      popular && "border-primary shadow-lg scale-105"
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
          En Popüler
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Ücretsiz" && <span className="text-muted-foreground">/ay</span>}
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Fiyatlandirma = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/auth");
  };

  const handleUpgradePro = () => {
    navigate("/auth");
  };

  const handleContactEnterprise = () => {
    window.location.href = "mailto:info@artiklo.com";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            İhtiyaçlarınıza en uygun abonelik planını seçerek hemen kullanmaya başlayın.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            title="Başlangıç"
            description="Temel özelliklerle başlamak için harika bir seçenek."
            price="Ücretsiz"
            features={[
              "Ayda 3 belge sadeleştirme",
              "Standart AI modeli",
              "E-posta desteği"
            ]}
            buttonText="Hemen Başla"
            onButtonClick={handleStartFree}
          />
          
          <PricingCard
            title="PRO"
            description="Profesyoneller ve sık kullanım için ideal."
            price="₺199"
            features={[
              "Sınırsız belge sadeleştirme",
              "Gelişmiş PRO AI modeli",
              "Dosya yükleme (PDF, Word)",
              "Belge arşivi",
              "Öncelikli destek"
            ]}
            buttonText="PRO'ya Geç"
            popular={true}
            onButtonClick={handleUpgradePro}
          />
          
          <PricingCard
            title="Kurumsal"
            description="Ekip ve şirketler için özel çözümler."
            price="Teklif Alın"
            features={[
              "PRO'daki her şey",
              "Ekip yönetimi",
              "Özel entegrasyonlar",
              "API erişimi"
            ]}
            buttonText="Bize Ulaşın"
            onButtonClick={handleContactEnterprise}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sık Sorulan Sorular
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Ücretsiz planın limitleri tam olarak nedir ve limitim dolunca ne olur?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Ücretsiz planımız, Artiklo'nun temel gücünü deneyimlemeniz için harikadır. Bu plan kapsamında her ay 3 adet belge sadeleştirme hakkınız bulunur. Bu hak, her ayın aynı gününde otomatik olarak yenilenir. Aylık 3 belge limitinize ulaştığınızda, belgeleriniz arşivinizde güvende kalır ancak yeni bir belge analizi yapamazsınız. Analize devam etmek için bir sonraki ayın yenilenme tarihini bekleyebilir veya dilediğiniz zaman tek tıkla PRO plana geçerek sınırsız analize başlayabilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                PRO aboneliğimi istediğim zaman iptal edebilir miyim? Süreç nasıl işliyor?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Elbette. Şeffaflık bizim için esastır. PRO aboneliğinizde hiçbir uzun vadeli taahhüt yoktur. Hesabınızın ayarlar bölümünden aboneliğinizi dilediğiniz an tek tıkla iptal edebilirsiniz. İptal ettiğinizde, ödemesini yaptığınız dönemin sonuna kadar tüm PRO özelliklerini kullanmaya devam edersiniz. Dönem sonunda hesabınız otomatik olarak Ücretsiz plana döner ve sizden başka bir ücret tahsil edilmez.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Belgelerimin ve kişisel verilerimin güvenliğinden nasıl emin olabilirim?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <div className="space-y-3">
                  <p className="font-semibold text-foreground">Artiklo'da gizlilik bir özellik değil, bir yemindir.</p>
                  <ul className="space-y-2 ml-4">
                    <li>• Yüklediğiniz hiçbir belge veya içeriği sunucularımızda kalıcı olarak saklamayız. Analiz işlemi tamamlandıktan sonra belgeleriniz sistemden silinir, sadece sizin hesabınızdaki arşivde size özel olarak tutulur.</li>
                    <li>• Tüm veri akışı, bankacılık sistemlerinde kullanılan 256-bit SSL şifrelemesiyle korunur.</li>
                    <li>• Biz dahil hiç kimse belgelerinizi göremez. Tüm süreçler KVKK standartlarıyla tam uyumludur.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Bir "belge sadeleştirme hakkı" ne anlama geliyor? Sayfa sayısı önemli mi?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Bir "belge sadeleştirme hakkı", tek bir yükleme ve analiz işlemini ifade eder. Yüklediğiniz belgenin 5 sayfa ya da 50 sayfa olması fark etmez; her biri tek bir hak olarak sayılır. Adil kullanım politikamız dahilinde, belgelerinizin uzunluğu konusunda endişelenmenize gerek yoktur.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Yıllık ödemelerde indirim yapıyor musunuz?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Evet! PRO planımızı aylık yerine yıllık olarak satın alarak çok daha avantajlı bir fiyata sahip olabilirsiniz. Yıllık ödeme seçeneğiyle sadece 10 ay öder, tam 12 ay boyunca sınırsız kullanım hakkı kazanırsınız. Bu, size yaklaşık %17'lik bir indirim, yani 2 ay ücretsiz kullanım sağlar!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                PRO ve Kurumsal (Teklif Alın) planı arasındaki temel farklar nelerdir?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                PRO plan, bireysel avukatlar, hukuk öğrencileri, küçük işletme sahipleri ve yoğun belge analizi ihtiyacı olan tüm profesyoneller için idealdir. Kurumsal plan ise, birden fazla çalışanı olan hukuk büroları, şirketlerin hukuk departmanları veya teknolojimizi kendi sistemlerine entegre etmek isteyen kuruluşlar için tasarlanmıştır. Ekip yönetimi, merkezi faturalandırma, özel entegrasyonlar (API) ve öncelikli destek gibi özellikler sunar. İhtiyaçlarınızı görüşmek için "Bize Ulaşın" butonuna tıklamanız yeterlidir.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Fiyatlandirma; 