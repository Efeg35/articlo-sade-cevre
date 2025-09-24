import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  Shield,
  Sparkles,
  Scale,
  Users,
  CheckCircle2,
  Clock,
  LucideIcon,
  ChevronDown,
  Lock,
  PenTool,
  Gavel,
  Wand2,
  Zap,
  Target,
  Star
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn, addIntersectionObserver } from "@/lib/utils";
import SEO from "@/components/SEO";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      return addIntersectionObserver(cardRef.current, (entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      });
    }
  }, [delay]);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative overflow-hidden group hover:shadow-lg transition-all duration-500 border-2 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <CardContent className="p-6">
        <div className="absolute -right-6 -top-6 w-12 h-12 bg-primary/10 rounded-full group-hover:scale-[2.5] transition-transform duration-500" />
        <Icon className="h-8 w-8 mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user;

  const [scrollProgress, setScrollProgress] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = () => {
    navigate("/fiyatlandirma");
  };

  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pt-20 md:pt-16">
      <SEO
        title="Artiklo - Hukuki Belge Analizi ve Belge Sihirbazı Platformu"
        description="Hukuki belgeleri 2 saniyede analiz edin, sadeleştirin ve gerekli belge önerilerini alın. AI destekli hukuk platformu ile adım adım belge hazırlama rehberliği. %99.8 doğruluk, ücretsiz deneme."
        keywords="hukuki belge analizi, belge sihirbazı, belge hazırlama, adım adım rehberlik, kira sözleşmesi, mahkeme kararı, tebligat, artiklo, belge yazma, hukuki metin"
        type="website"
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02]" />
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Hukuki Belgeleri{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="relative bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Anında
                    </span>
                  </span>{' '}
                  Anlayın
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Artiklo, karmaşık hukuki belgeleri saniyeler içinde sadeleştirir.
                  Yakında çıkacak <span className="font-semibold text-primary">Belge Sihirbazı</span> ile
                  adım adım rehberlikle profesyonel belgelerinizi hazırlayın.
                  Ne yapmanız gerektiğini, haklarınızı ve risklerinizi kolayca öğrenin.
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <Button
                  size="lg"
                  variant="hero"
                  onClick={handleNavigate}
                  className="group w-full sm:w-auto"
                >
                  Hemen Başlayın
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleScrollToFeatures}
                  className="group w-full sm:w-auto"
                >
                  Nasıl Çalışır?
                  <ChevronDown className="group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section ref={featuresRef} className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-8 mt-0">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-0 mb-2">
                Kişisel Hukuk Tercümanınız
              </h2>
              <p className="mt-2 text-lg text-muted-foreground mb-0">
                Karmaşık hukuki dili sadeleştirip belgenin asıl niyetini ve size olan etkisini ortaya çıkarır; ardından metni hangi dilde olursa olsun analiz eder ve size özel, anlaşılır bir Türkçe özet ve eylem planı sunar.
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={Clock}
                title="Hızlı Analiz"
                description="Belgenizi yükleyin, saniyeler içinde sadeleştirilmiş özet alın."
                delay={0}
              />
              <FeatureCard
                icon={Wand2}
                title="🔮 Belge Sihirbazı"
                description="Yakında! Adım adım rehberlikle profesyonel belgeler oluşturun."
                delay={100}
              />
              <FeatureCard
                icon={Shield}
                title="Gizlilik ve Güvenlik"
                description="Belgeleriniz asla kaydedilmez, bilgileriniz %100 güvende."
                delay={200}
              />
              <FeatureCard
                icon={Sparkles}
                title="Yapay Zeka Teknolojisi"
                description="En gelişmiş AI teknolojisiyle doğru ve anlaşılır sonuçlar."
                delay={300}
              />
              <FeatureCard
                icon={Scale}
                title="Yasal Uyumluluk"
                description="KVKK ve diğer yasal düzenlemelere tam uyumluluk."
                delay={400}
              />
              <FeatureCard
                icon={Users}
                title="Herkes İçin Anlaşılır"
                description="Hukuk bilgisi gerektirmez, sade Türkçe açıklamalar."
                delay={500}
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Doğruluk Garantisi"
                description="İnsan kontrolünden geçmiş, güvenilir sadeleştirme."
                delay={600}
              />
              <FeatureCard
                icon={Gavel}
                title="Hukuki Rehberlik"
                description="Adım adım ne yapacağınızı, haklarınızı ve risklerinizi öğrenin."
                delay={700}
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Kullanıcı Deneyimleri
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Binlerce kullanıcımız Artiklo ile hukuki belgelerini kolayca anladı.
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <p className="text-foreground">"Kira sözleşmemi 2 dakikada anladım. Gerçekten hayat kurtarıcı bir uygulama!"</p>
                    <div className="mt-4">
                      <p className="font-semibold">Ayşe K.</p>
                      <p className="text-sm text-muted-foreground">İstanbul</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <p className="text-foreground">"Adım adım rehberlik ile kira artış itiraz belgemi kolayca hazırladım. Çok pratik!"</p>
                    <div className="mt-4">
                      <p className="font-semibold">Mehmet A.</p>
                      <p className="text-sm text-muted-foreground">Ankara</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <p className="text-foreground">"Herkese tavsiye ederim. Hukuki belgeleri anlamak artık çok kolay."</p>
                    <div className="mt-4">
                      <p className="font-semibold">Zeynep B.</p>
                      <p className="text-sm text-muted-foreground">İzmir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Rakamlarla Artiklo
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Türkiye'nin en güvenilir hukuki belge sadeleştirme platformu
              </p>
            </div>
            <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-background">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
                  <div className="text-muted-foreground text-sm md:text-base">Analiz Edilen Belge</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">15K+</div>
                  <div className="text-muted-foreground text-sm md:text-base">Belge Önerisi</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                  <div className="text-muted-foreground text-sm md:text-base">Mutlu Kullanıcı</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">%99.8</div>
                  <div className="text-muted-foreground text-sm md:text-base">Doğruluk Oranı</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Belge Sihirbazı Tanıtım Section */}
        <section className="py-24 sm:py-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Wand2 className="h-4 w-4" />
                <span>Yakında Geliyor</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                🔮 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Belge Sihirbazı</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Hukuki belgelerinizi adım adım hazırlama deneyimi artık daha kolay ve güvenli!
                Artiklo Belge Sihirbazı ile karmaşık prosedürler sihirli bir deneyime dönüşüyor.
              </p>
            </div>

            {/* Wizard Özellikleri */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Adım Adım Rehberlik</h3>
                  <p className="text-muted-foreground">
                    Size özel sorularla, hangi belgeye ihtiyacınız olduğunu belirleyip,
                    adım adım hazırlama sürecinde rehberlik ederiz.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Anında Öneriler</h3>
                  <p className="text-muted-foreground">
                    Girdiğiniz bilgilere göre otomatik öneriler alın ve
                    belgelerinizi hukuki standartlara uygun şekilde hazırlayın.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Premium Deneyim</h3>
                  <p className="text-muted-foreground">
                    Gelişmiş yapay zeka teknolojisi ile profesyonel kalitede belgeler,
                    kullanıcı dostu arayüz ile kolay erişim.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Beta Kayıt CTA */}
            <div className="text-center">
              <Card className="max-w-2xl mx-auto border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-8">
                  <Wand2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">
                    Belge Sihirbazı Beta'ya Katılın!
                  </h3>
                  <p className="text-purple-700 mb-6">
                    İlk erişim hakkı kazanın ve özel beta kullanıcısı olarak
                    yeni özelliği ilk deneyimleyenler arasında yer alın.
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8"
                    onClick={() => navigate("/wizard-beta")}
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Beta Listesine Katıl
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Yakında Gelenler Section */}
        <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                🔮 Belge Sihirbazı Geliyor
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Adım adım rehberlik ile belgelerinizi profesyonel şekilde kendiniz hazırlayın
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-blue-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wand2 className="h-6 w-6 text-blue-600" />
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      WIZARD
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">İş Belgeleri</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    İş sözleşmesi, fesih belgesi gibi belgeleri adım adım hazırlayın
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Şirket ve çalışan bilgileri</div>
                    <div>• Maaş ve haklar</div>
                    <div>• Gizlilik ve rekabet koşulları</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wand2 className="h-6 w-6 text-purple-600" />
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                      WIZARD
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kira Belgeleri</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kira artış itirazı, sözleşme feshi gibi belgeleri kolayca oluşturun
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Kiracı ve ev sahibi bilgileri</div>
                    <div>• Mülk detayları</div>
                    <div>• İtiraz gerekçeleri</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wand2 className="h-6 w-6 text-green-600" />
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      WIZARD
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Hukuki Belgeler</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Şikayet, tazminat talebi gibi belgeleri rehberlikle yazın
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Taraf bilgileri</div>
                    <div>• Olay açıklaması</div>
                    <div>• Talep ve gerekçeler</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="max-w-md mx-auto bg-white rounded-lg border-2 border-blue-200 p-6">
                <h3 className="text-lg font-semibold mb-2">Haber Almak İster misiniz?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Yeni belge hazırlama özelliği çıktığında size haber verelim
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm" className="px-4">
                    Kayıt Ol
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-base">
                <Shield className="h-5 w-5 md:h-6 md:w-6" />
                <span>KVKK Uyumlu</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-base">
                <Lock className="h-5 w-5 md:h-6 md:w-6" />
                <span>256-bit SSL Güvenlik</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-base">
                <Clock className="h-5 w-5 md:h-6 md:w-6" />
                <span>7/24 Destek</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-base">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
                <span>10.000+ Kullanıcı</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Hukuki Belgeleri Anlamak Artık Çok Kolay
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
                Artiklo ile karmaşık hukuki metinleri anında sadeleştirin. Ücretsiz deneyin!
              </p>
              <div className="mt-10 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleNavigate}
                  className="group w-full sm:w-auto"
                >
                  Hemen Başlayın
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
