import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hukuki Belgeleri Anında Anlayın
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Artiklo, karmaşık resmi yazıları ve sözleşmeleri saniyeler içinde sadeleştirir.<br />
              Ne yapmanız gerektiğini, haklarınızı ve risklerinizi kolayca öğrenin.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="px-8 py-6 text-lg"
            >
              Hemen Başlayın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
        {/* Avantajlar/Güven Bölümü */}
        <section ref={featuresRef} className="w-full py-20 bg-background border-t">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mx-auto text-left mb-8">
              <li className="flex flex-col items-center gap-3">
                <span className="text-3xl">⚡</span>
                <span>
                  <span className="font-semibold">Hızlı ve Kolay:</span> Belgenizi yükleyin, anında sadeleştirilmiş özet alın.
                </span>
              </li>
              <li className="flex flex-col items-center gap-3">
                <span className="text-3xl">🔒</span>
                <span>
                  <span className="font-semibold">Gizlilik ve Güvenlik:</span> Belgeleriniz asla kaydedilmez, bilgileriniz güvende.
                </span>
              </li>
              <li className="flex flex-col items-center gap-3">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
                <span>
                  <span className="font-semibold">Herkes İçin Anlaşılır:</span> Hukuk bilgisi gerektirmez, sade Türkçe açıklamalar.
                </span>
              </li>
            </ul>
            <div className="text-base text-muted-foreground text-center max-w-xl mx-auto">
              Belgelerinizi anlamak için avukata gitmeden önce Artiklo’yu deneyin!
            </div>
          </div>
        </section>
        {/* Kullanıcı Yorumları Bölümü */}
        <section className="w-full py-20 bg-background border-t">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Kullanıcı Yorumları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
                <span className="text-lg font-semibold mb-2">“Gerçekten hayat kurtarıcı!”</span>
                <span className="text-sm text-muted-foreground mb-2">Kira sözleşmemi 2 dakikada anladım.</span>
                <span className="text-xs text-muted-foreground">- Ayşe, İstanbul</span>
              </div>
              <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
                <span className="text-lg font-semibold mb-2">“Çok pratik ve güvenli.”</span>
                <span className="text-sm text-muted-foreground mb-2">Belgelerim asla kaydedilmedi, içim rahat.</span>
                <span className="text-xs text-muted-foreground">- Mehmet, Ankara</span>
              </div>
              <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
                <span className="text-lg font-semibold mb-2">“Herkese tavsiye ederim.”</span>
                <span className="text-sm text-muted-foreground mb-2">Resmi yazıları artık korkmadan okuyorum.</span>
                <span className="text-xs text-muted-foreground">- Zeynep, İzmir</span>
              </div>
            </div>
          </div>
        </section>
        {/* Gerçek Hayat Senaryoları */}
        <section className="w-full py-20 bg-background border-t">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Gerçek Hayat Senaryoları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">👴</span>
                <span className="font-semibold mb-1">Emekli Ahmet Bey</span>
                <span className="text-sm text-muted-foreground text-center">Veraset ilamındaki terimleri anlamadığı için endişeleniyordu. Artiklo ile haklarını ve sonraki adımları kolayca öğrendi.</span>
              </div>
              <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🎓</span>
                <span className="font-semibold mb-1">Öğrenci Ayşe</span>
                <span className="text-sm text-muted-foreground text-center">Kira kontratındaki teknik maddeleri Artiklo sayesinde sade Türkçe ile anladı, güvenle imzaladı.</span>
              </div>
              <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">💼</span>
                <span className="font-semibold mb-1">KOBİ Sahibi Murat</span>
                <span className="text-sm text-muted-foreground text-center">Vergi dairesinden gelen ödeme emrinin aciliyetini Artiklo ile kavradı, süreci zamanında yönetti.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
