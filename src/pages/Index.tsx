import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight, Shield, Clock, Users } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-primary">Artiklo</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate("/dashboard")} variant="hero">
                  Dashboard'a Git
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleLogin}>
                    Giriş Yap
                  </Button>
                  <Button variant="hero" onClick={handleGetStarted}>
                    Ücretsiz Başla
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Karmaşık Hukuki Belgeleri{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Saniyeler İçinde Anlayın
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Artiklo, resmi yazıları sizin için tercüme eder, ne yapmanız gerektiğini net bir dille anlatır.
            Avukata gitmeden önce belgelerinizi anlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="hero" 
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg"
            >
              Ücretsiz Başla
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleLogin}
                className="px-8 py-4 text-lg"
              >
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Metni Yapıştır</h3>
                <p className="text-muted-foreground">
                  Karmaşık hukuki belgenizi kopyalayıp sol tarafa yapıştırın.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Sadeleştir'e Tıkla</h3>
                <p className="text-muted-foreground">
                  Tek tıkla yapay zeka teknolojisi metninizi analiz eder.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Anında Anla</h3>
                <p className="text-muted-foreground">
                  Sade Türkçe ile yazılmış, anlaşılır açıklamayı okuyun.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Neden Artiklo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Hızlı ve Kolay</h3>
              <p className="text-sm text-muted-foreground">
                Karmaşık belgeler saniyeler içinde sadeleştirilir.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Güvenli ve Özel</h3>
              <p className="text-sm text-muted-foreground">
                Belgeleriniz güvenle saklanır, sadece siz erişebilirsiniz.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Herkes İçin</h3>
              <p className="text-sm text-muted-foreground">
                Hukuk bilgisi gerektirmez, herkes kolayca kullanabilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Hukuki Belgelerinizi Anlamaya Başlayın
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ücretsiz hesap oluşturun ve ilk belgenizi hemen sadeleştirin.
          </p>
          <Button 
            size="lg" 
            variant="hero" 
            onClick={handleGetStarted}
            className="px-12 py-4 text-lg"
          >
            Şimdi Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-primary">Artiklo</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                <strong>ÖNEMLİ UYARI:</strong> Artiklo tarafından sunulan bilgiler hukuki danışmanlık yerine geçmez. 
                Yasal bir işlem yapmadan önce mutlaka yetkin bir avukata danışmanız gerekmektedir.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
