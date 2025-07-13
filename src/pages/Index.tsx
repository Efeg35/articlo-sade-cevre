import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-7 w-7 text-foreground mr-2" />
              <h1 className="text-2xl font-bold text-foreground">Artiklo</h1>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Panele Git
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>
                    Giriş Yap
                  </Button>
                  <Button onClick={handleNavigate}>
                    Ücretsiz Başla
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Karmaşık Hukuki Dili Anlaşılır Hale Getirin
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Artiklo, resmi belgeleri, sözleşmeleri ve yazıları sizin için sadeleştirir. 
              Ne anlama geldiğini ve sonraki adımlarınızı net bir şekilde öğrenin.
            </p>
            <Button 
              size="lg" 
              onClick={handleNavigate}
              className="px-8 py-6 text-lg"
            >
              Hemen Başlayın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-sm font-semibold text-muted-foreground">Artiklo</span>
            </div>
            <p className="text-xs text-muted-foreground text-center sm:text-right max-w-md">
              <strong>Yasal Uyarı:</strong> Bu platform tarafından sunulan bilgiler hukuki danışmanlık değildir. 
              Yasal bir işlem yapmadan önce yetkin bir avukata danışınız.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
