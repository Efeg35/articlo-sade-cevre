import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Ad soyad state'i
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuthAction = async (action: 'signIn' | 'signUp', e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      let response;
      if (action === 'signIn') {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        response = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
      }
      
      const { data, error: authError } = response;

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Geçersiz e-posta veya şifre.");
        } else if (authError.message.includes("User already registered")) {
          setError("Bu e-posta adresi zaten kayıtlı.");
        } else {
          setError("Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.");
        }
        return;
      }

      if (action === 'signUp' && data.user) {
        setSuccessMessage("Hesabınız oluşturuldu! E-posta adresinize gönderilen doğrulama bağlantısına tıklayın.");
        setEmail("");
        setPassword("");
        // Profil tablosuna ekle
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          credits: 3
        });
      }

      if (data.session) {
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı, panele yönlendiriliyorsunuz.",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 md:pt-16 pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-sm relative">
        <a 
          href="/" 
          className="absolute top-0 left-0 -translate-y-16 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Sayfaya Dön
        </a>
        <Tabs defaultValue="signin" className="w-full">
          <div className="text-center mb-6">
            <FileText className="h-10 w-10 text-foreground mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-foreground">Artiklo</h1>
            <p className="text-muted-foreground">Hesabınıza erişin veya yeni hesap oluşturun.</p>
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
            <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
          </TabsList>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <TabsContent value="signin">
                <form onSubmit={(e) => handleAuthAction('signIn', e)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-posta</Label>
                    <Input id="signin-email" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Şifre</Label>
                    <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Giriş Yap
                  </Button>
                </form>
                <div className="text-xs text-muted-foreground mt-4 text-center">
                  Şifrenizi mi unuttunuz? <span className="underline cursor-pointer">Şifre sıfırlama yakında!</span>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={(e) => handleAuthAction('signUp', e)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-posta</Label>
                    <Input id="signup-email" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Şifre</Label>
                    <Input id="signup-password" type="password" placeholder="En az 6 karakter, harf ve rakam içermeli" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    <span className="text-xs text-muted-foreground">Şifreniz en az 6 karakter olmalı, harf ve rakam içermelidir.</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Ad Soyad</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-start gap-2">
                    <input type="checkbox" required className="mt-1" />
                    <span>
                      <b>
                        <Link to="/kullanici-sozlesmesi" target="_blank" className="underline hover:text-foreground">Kullanıcı Sözleşmesi</Link>
                      </b>
                      ve
                      <b>
                        <Link to="/kvkk-aydinlatma" target="_blank" className="underline hover:text-foreground">KVKK Aydınlatma Metni</Link>
                      </b>
                      'ni okudum, kabul ediyorum.
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hesap Oluştur
                  </Button>
                </form>
                <div className="mt-6 bg-muted/50 border rounded-lg p-4 text-xs text-muted-foreground">
                  <b>Avantajlar:</b>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Belgelerinizi güvenle ve gizlilikle sadeleştirin.</li>
                    <li>Hızlı, kolay ve ücretsiz kullanım.</li>
                    <li>Hesabınızla tüm sadeleştirme geçmişinizi görüntüleyin (çok yakında).</li>
                  </ul>
                  <div className="mt-3">
                    <b>Gizlilik:</b> E-posta adresiniz ve belgeleriniz asla 3. kişilerle paylaşılmaz. Tüm işlemler şifreli ve güvenlidir.
                  </div>
                </div>
              </TabsContent>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && !error && (
                 <Alert variant="default" className="mt-4 border-green-500 text-green-700">
                  <AlertTitle>Başarılı</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;