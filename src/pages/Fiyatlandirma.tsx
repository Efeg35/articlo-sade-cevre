import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Capacitor } from "@capacitor/core";

interface AddonPackage {
  credits: string;
  price: string;
  basePrice: number;
  addonPrice: number;
}

interface PricingCardProps {
  title: string;
  description: string;
  basePrice: number;
  price: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  onButtonClick: () => void;
  hasDropdown?: boolean;
  dropdownOptions?: AddonPackage[];
  defaultDropdownValue?: string;
  hasYearlyToggle?: boolean;
  yearlyDiscount?: number;
}

const PricingCard = ({
  title,
  description,
  basePrice,
  price,
  features,
  buttonText,
  popular,
  onButtonClick,
  hasDropdown,
  dropdownOptions,
  defaultDropdownValue,
  hasYearlyToggle,
  yearlyDiscount = 20
}: PricingCardProps) => {
  const [selectedAddon, setSelectedAddon] = useState(defaultDropdownValue || "");
  const [isYearly, setIsYearly] = useState(false);

  // Calculate total price based on selected addon
  const selectedOption = dropdownOptions?.find(option => option.credits === selectedAddon);
  const monthlyTotal = selectedOption ? selectedOption.basePrice + selectedOption.addonPrice : basePrice;

  // Calculate yearly price with discount
  const yearlyTotal = monthlyTotal * 12 * (1 - yearlyDiscount / 100);
  const yearlySavings = (monthlyTotal * 12) - yearlyTotal;

  const displayPrice = hasYearlyToggle ?
    (isYearly ? `₺${Math.round(yearlyTotal / 12)}` : `₺${monthlyTotal}`) :
    (hasDropdown && selectedOption ? `₺${monthlyTotal}` : price);

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
          <span className="text-4xl font-bold">{displayPrice}</span>
          {price !== "Ücretsiz" && price !== "Teklif Al" && (
            <span className="text-muted-foreground">
              {hasYearlyToggle ? (isYearly ? "/ay" : "/ay") : "/ay"}
            </span>
          )}
          {hasDropdown && selectedOption && selectedOption.addonPrice > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              ₺{basePrice}/ay + ₺{selectedOption.addonPrice} ek paket
            </div>
          )}
        </div>

        {/* Yearly Toggle */}
        {hasYearlyToggle && (
          <div className="mb-4 bg-secondary/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={`yearly-${title}`} className="text-sm font-medium cursor-pointer">
                Yıllık
              </Label>
              <div className="flex items-center gap-2">
                {isYearly && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    ₺{Math.round(yearlySavings).toLocaleString('tr-TR')} tasarruf
                  </Badge>
                )}
                <Switch
                  id={`yearly-${title}`}
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
              </div>
            </div>
            {isYearly && (
              <div className="text-xs text-muted-foreground">
                Yıllık ödeme: ₺{Math.round(yearlyTotal).toLocaleString('tr-TR')}
              </div>
            )}
          </div>
        )}

        {/* Dropdown menu for addon packages */}
        {hasDropdown && dropdownOptions && (
          <div className="mb-4">
            <Select value={selectedAddon} onValueChange={setSelectedAddon}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ek belge paketi seçin" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.map((option, index) => (
                  <SelectItem key={index} value={option.credits}>
                    {option.credits} - {option.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">{feature}</span>
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

  const handleUpgradeBasic = () => {
    navigate("/auth");
  };

  const handleUpgradePro = () => {
    navigate("/auth");
  };

  const handleUpgradeCommercial = () => {
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'mobile-scroll-fix ios-scroll-container overflow-auto' : ''}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            İhtiyaçlarınıza en uygun abonelik planını seçerek hemen kullanmaya başlayın.
          </p>

          <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold">
            🎉 Yıllık Ödemede %20 İndirim!
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <PricingCard
            title="Ücretsiz"
            description="Temel özellikleri keşfetmek için harika bir seçenek."
            basePrice={0}
            price="Ücretsiz"
            features={[
              "Ayda 1 analiz",
              "Belge özeti ve sadeleştirme",
              "Standart AI modeli",
              "Risk önizlemesi (kısıtlı)",
              "Filigranlı PDF çıktısı",
              "Son 3 dosya geçmişi",
              "E-posta desteği"
            ]}
            buttonText="Hemen Başla"
            onButtonClick={handleStartFree}
          />

          <PricingCard
            title="BAŞLANGIÇ"
            description="Düzenli ama hafif kullanım için ideal."
            basePrice={199}
            price="₺199"
            features={[
              "Ayda 10 analiz",
              "Tam risk listesi + detaylı eylem planı",
              "Gelişmiş AI modeli",
              "Filigransız PDF/Word çıktısı",
              "3 aylık analiz geçmişi",
              "E-posta desteği",
              "❌ Belge oluşturma (üst paketlerde)"
            ]}
            buttonText="BASIC'e Geç"
            onButtonClick={handleUpgradeBasic}
            hasYearlyToggle={true}
            yearlyDiscount={20}
          />

          <PricingCard
            title="PRO"
            description="Profesyoneller ve sık kullanım için ideal."
            basePrice={299}
            price="₺299"
            features={[
              "Ayda 50 analiz + 5 belge oluşturma",
              "Sınırsız belge sadeleştirme",
              "Gelişmiş PRO AI modeli",
              "Kişiye özel belge oluşturma (5/ay)",
              "Sınırsız analiz geçmişi",
              "Klasörleme + terim sözlüğü",
              "Bildirim/hatırlatmalar",
              "Öncelikli destek"
            ]}
            buttonText="PRO'ya Geç"
            popular={true}
            onButtonClick={handleUpgradePro}
            hasDropdown={true}
            dropdownOptions={[
              { credits: "5 belge/ay (dahil)", price: "₺299/ay", basePrice: 299, addonPrice: 0 },
              { credits: "+5 ek belge (10 toplam)", price: "+ ₺499", basePrice: 299, addonPrice: 499 },
              { credits: "+10 ek belge (15 toplam)", price: "+ ₺899", basePrice: 299, addonPrice: 899 },
              { credits: "+25 ek belge (30 toplam)", price: "+ ₺1.799", basePrice: 299, addonPrice: 1799 },
              { credits: "+50 ek belge (55 toplam)", price: "+ ₺3.199", basePrice: 299, addonPrice: 3199 }
            ]}
            defaultDropdownValue="5 belge/ay (dahil)"
            hasYearlyToggle={true}
            yearlyDiscount={20}
          />

          <PricingCard
            title="KURUMSAL"
            description="Küçük çaplı ekip ve şirketler (Avukatlar, Kobiler) için özel çözümler."
            basePrice={899}
            price="₺899"
            features={[
              "5 kullanıcı + 25 belge oluşturma/ay",
              "PRO'daki her şey",
              "Ekip yönetimi + rol/izin sistemi",
              "Paylaşımlı workspace",
              "Sektör önerileri + risk skoru",
              "Toplu analiz (10 eşzamanlı)",
              "Avukat modülleri: müvekkil portalı",
              "Öncelikli destek"
            ]}
            buttonText="Ekiple Başla"
            onButtonClick={handleUpgradeCommercial}
            hasDropdown={true}
            dropdownOptions={[
              { credits: "25 belge/ay (dahil)", price: "₺899/ay", basePrice: 899, addonPrice: 0 },
              { credits: "+5 ek belge (30 toplam)", price: "+ ₺449", basePrice: 899, addonPrice: 449 },
              { credits: "+10 ek belge (35 toplam)", price: "+ ₺799", basePrice: 899, addonPrice: 799 },
              { credits: "+25 ek belge (50 toplam)", price: "+ ₺1.499", basePrice: 899, addonPrice: 1499 },
              { credits: "+50 ek belge (75 toplam)", price: "+ ₺2.799", basePrice: 899, addonPrice: 2799 }
            ]}
            defaultDropdownValue="25 belge/ay (dahil)"
            hasYearlyToggle={true}
            yearlyDiscount={20}
          />
        </div>

        {/* Plan Comparison Table */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Plan Karşılaştırması</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="text-left p-4 font-semibold">Özellikler</th>
                  <th className="text-center p-4 font-semibold">Ücretsiz</th>
                  <th className="text-center p-4 font-semibold">BAŞLANGIÇ</th>
                  <th className="text-center p-4 font-semibold bg-primary/10">PRO</th>
                  <th className="text-center p-4 font-semibold">KURUMSAL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium">Aylık Analiz</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">10</td>
                  <td className="text-center p-4 bg-primary/5">50</td>
                  <td className="text-center p-4">50</td>
                </tr>
                <tr className="border-t bg-secondary/5">
                  <td className="p-4 font-medium">Belge Oluşturma</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-primary/5">5/ay</td>
                  <td className="text-center p-4">25/ay</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">AI Model</td>
                  <td className="text-center p-4">Standart</td>
                  <td className="text-center p-4">Gelişmiş</td>
                  <td className="text-center p-4 bg-primary/5">PRO</td>
                  <td className="text-center p-4">PRO</td>
                </tr>
                <tr className="border-t bg-secondary/5">
                  <td className="p-4 font-medium">PDF Çıktı</td>
                  <td className="text-center p-4">Filigranlı</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4 bg-primary/5">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Geçmiş</td>
                  <td className="text-center p-4">3 dosya</td>
                  <td className="text-center p-4">3 ay</td>
                  <td className="text-center p-4 bg-primary/5">Sınırsız</td>
                  <td className="text-center p-4">Sınırsız</td>
                </tr>
                <tr className="border-t bg-secondary/5">
                  <td className="p-4 font-medium">Kullanıcı Sayısı</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4 bg-primary/5">1</td>
                  <td className="text-center p-4">5</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Ekip Yönetimi</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-primary/5">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-t bg-secondary/5">
                  <td className="p-4 font-medium">Avukat Modülleri</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-primary/5">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Destek</td>
                  <td className="text-center p-4">E-posta</td>
                  <td className="text-center p-4">E-posta</td>
                  <td className="text-center p-4 bg-primary/5">Öncelikli</td>
                  <td className="text-center p-4">Öncelikli</td>
                </tr>
              </tbody>
            </table>
          </div>
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
                Ücretsiz planımız, Artiklo'nun temel gücünü deneyimlemeniz için harikadır. Bu plan kapsamında her ay 1 adet belge analizi hakkınız bulunur. Analiz sonucunda belge özeti, sadeleştirme ve kısıtlı risk önizlemesi alırsınız. PDF çıktınız filigran içerir ve son 3 dosya geçmişinizi görebilirsiniz. Aylık limitinize ulaştığınızda, bir sonraki ayın yenilenme tarihini bekleyebilir veya dilediğiniz zaman BAŞLANGIÇ, PRO veya TİCARİ planlardan birine geçebilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Aboneliğimi istediğim zaman iptal edebilir miyim? Süreç nasıl işliyor?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Elbette. Şeffaflık bizim için esastır. Tüm ücretli planlarımızda hiçbir uzun vadeli taahhüt yoktur. Hesabınızın ayarlar bölümünden aboneliğinizi dilediğiniz an tek tıkla iptal edebilirsiniz. İptal ettiğinizde, ödemesini yaptığınız dönemin sonuna kadar tüm özelliklerini kullanmaya devam edersiniz. Dönem sonunda hesabınız otomatik olarak Ücretsiz plana döner ve sizden başka bir ücret tahsil edilmez.
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
                Belge oluşturma özelliği nasıl çalışıyor? Hangi planlar dahil?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Belge oluşturma özelliği, PRO planında ayda 5 adet, KURUMSAL planında 25 adet dahildir. Bu özellik ile icra itirazı, dava dilekçesi gibi hukuki belgeleri AI ile otomatik oluşturabilirsiniz. BAŞLANGIÇ planında bu özellik bulunmaz, sadece analiz yapabilirsiniz. Ek belge ihtiyacınız için plan içi paketler mevcuttur: PRO'da +5 belge ₺499, +10 belge ₺899; KURUMSAL'da +5 belge ₺449, +10 belge ₺799.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                KURUMSAL plan hangi türde kullanıcılar için idealdir?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                KURUMSAL plan (₺899/ay), 5 kullanıcılık küçük ekipler için idealdir: avukat büroları, şirket hukuk departmanları, hukuki danışmanlık firmaları. 25 belge oluşturma, paylaşımlı workspace, ekip yönetimi ve avukat modülleri (müvekkil portalı, dava analizi) içerir. Daha büyük organizasyonlar için özel çözümler ileride sunulacaktır.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Fiyatlandirma; 