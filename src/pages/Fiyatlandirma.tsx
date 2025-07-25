import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Lock, Infinity, Shield, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
          <div className="flex flex-col items-center">
            <Shield className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">KVKK Uyumlu</span>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">256-bit SSL Güvenlik</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">7/24 Destek</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">10.000+ Kullanıcı</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            title="Başlangıç"
            description="Temel özelliklerle başlamak için harika bir seçenek."
            price="Ücretsiz"
            features={[
              "Ayda 5 belge sadeleştirme",
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
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ücretsiz plan sınırları nelerdir?</h3>
              <p className="text-muted-foreground">
                Ücretsiz planda ayda 5 belge sadeleştirme hakkınız vardır. Bu belgeleri istediğiniz zaman kullanabilirsiniz.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">PRO planı ne zaman faturalandırılır?</h3>
              <p className="text-muted-foreground">
                PRO plan aylık olarak faturalandırılır. İstediğiniz zaman iptal edebilirsiniz.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Belgelerim güvende mi?</h3>
              <p className="text-muted-foreground">
                Evet, tüm belgeler 256-bit SSL şifreleme ile korunur ve KVKK standartlarına uygun olarak işlenir.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Kurumsal plan neleri içerir?</h3>
              <p className="text-muted-foreground">
                Kurumsal plan, ekip yönetimi, özel entegrasyonlar ve API erişimi gibi gelişmiş özellikler sunar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fiyatlandirma; 