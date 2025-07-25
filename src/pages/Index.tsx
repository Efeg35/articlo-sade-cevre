import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  Lock
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn, addIntersectionObserver } from "@/lib/utils";

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
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pt-20 md:pt-16 pt-[env(safe-area-inset-top)]">
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
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
                  Artiklo, karmaşık resmi yazıları ve sözleşmeleri saniyeler içinde sadeleştirir.
                  Ne yapmanız gerektiğini, haklarınızı ve risklerinizi kolayca öğrenin.
                </p>
              </div>
              <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <Button 
                  size="lg" 
                  variant="hero" 
                  onClick={handleNavigate}
                  className="group"
                >
                  Hemen Başlayın
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={handleScrollToFeatures}
                  className="group"
                >
                  Nasıl Çalışır?
                  <ChevronDown className="group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full p-1">
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-scroll-down" />
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Clock}
                title="Hızlı ve Kolay"
                description="Belgenizi yükleyin, saniyeler içinde sadeleştirilmiş özet alın."
                delay={0}
              />
              <FeatureCard
                icon={Shield}
                title="Gizlilik ve Güvenlik"
                description="Belgeleriniz asla kaydedilmez, bilgileriniz %100 güvende."
                delay={100}
              />
              <FeatureCard
                icon={Sparkles}
                title="Yapay Zeka Teknolojisi"
                description="En gelişmiş AI teknolojisiyle doğru ve anlaşılır sonuçlar."
                delay={200}
              />
              <FeatureCard
                icon={Scale}
                title="Yasal Uyumluluk"
                description="KVKK ve diğer yasal düzenlemelere tam uyumluluk."
                delay={300}
              />
              <FeatureCard
                icon={Users}
                title="Herkes İçin Anlaşılır"
                description="Hukuk bilgisi gerektirmez, sade Türkçe açıklamalar."
                delay={400}
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Doğruluk Garantisi"
                description="İnsan kontrolünden geçmiş, güvenilir sadeleştirme."
                delay={500}
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="text-foreground">"Çok pratik ve güvenli. Belgelerim asla kaydedilmedi, içim rahat."</p>
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

        {/* Use Cases */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Gerçek Hayat Senaryoları
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Artiklo'nun farklı kullanım alanlarından örnekler.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-muted/30 hover:bg-muted/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <span className="text-4xl transform transition-transform group-hover:scale-110">👴</span>
                    <h3 className="text-xl font-semibold">Emekli Ahmet Bey</h3>
                    <p className="text-muted-foreground">
                      Veraset ilamındaki terimleri anlamadığı için endişeleniyordu. Artiklo ile haklarını ve sonraki adımları kolayca öğrendi.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 hover:bg-muted/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <span className="text-4xl transform transition-transform group-hover:scale-110">🎓</span>
                    <h3 className="text-xl font-semibold">Öğrenci Ayşe</h3>
                    <p className="text-muted-foreground">
                      Kira kontratındaki teknik maddeleri Artiklo sayesinde sade Türkçe ile anladı, güvenle imzaladı.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 hover:bg-muted/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <span className="text-4xl transform transition-transform group-hover:scale-110">💼</span>
                    <h3 className="text-xl font-semibold">KOBİ Sahibi Murat</h3>
                    <p className="text-muted-foreground">
                      Vergi dairesinden gelen ödeme emrinin aciliyetini Artiklo ile kavradı, süreci zamanında yönetti.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Rakamlarla Artiklo
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Türkiye'nin en güvenilir hukuki belge sadeleştirme platformu
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-muted-foreground">Sadeleştirilen Belge</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-muted-foreground">Mutlu Kullanıcı</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">%99.9</div>
                  <div className="text-muted-foreground">Doğruluk Oranı</div>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">3 sn</div>
                  <div className="text-muted-foreground">Ortalama İşlem Süresi</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Shield className="h-6 w-6" />
                <span>KVKK Uyumlu</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-6 w-6" />
                <span>256-bit SSL Güvenlik</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-6 w-6" />
                <span>7/24 Destek</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-6 w-6" />
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
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleNavigate}
                  className="group"
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
