import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, FileText, Eye, EyeOff } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Capacitor } from '@capacitor/core';
import { authFormSchema, rateLimiter, validateAndSanitizeInput } from "@/lib/validation";
import { Shield, AlertTriangle } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const initialTab = location.pathname === "/signup" ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check for session timeout
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('timeout') === 'true') {
      setError("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
    }
  }, [location]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate, supabase.auth]);

  const handleAuthAction = async (action: 'signIn' | 'signUp', e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setValidationErrors({});

    // Rate limiting check
    const userIdentifier = email || 'anonymous';
    if (!rateLimiter.isAllowed(userIdentifier)) {
      setError("Çok fazla deneme yaptınız. Lütfen 15 dakika bekleyin.");
      setLoading(false);
      return;
    }

    // Input validation and sanitization
    const sanitizedEmail = validateAndSanitizeInput(email);
    const sanitizedPassword = validateAndSanitizeInput(password);
    const sanitizedFullName = fullName ? validateAndSanitizeInput(fullName) : "";

    try {
      // Validate form data
      const formData = {
        email: sanitizedEmail,
        password: sanitizedPassword,
        ...(action === 'signUp' && { fullName: sanitizedFullName })
      };

      const validationResult = authFormSchema.safeParse(formData);

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      let response;
      if (action === 'signIn') {
        response = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: sanitizedPassword
        });
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        response = await supabase.auth.signUp({
          email: sanitizedEmail,
          password: sanitizedPassword,
          options: { emailRedirectTo: redirectUrl },
        });
      }

      const { data, error: authError } = response;

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes("Invalid login credentials")) {
          setError("Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol edin.");
        } else if (authError.message.includes("User already registered")) {
          setError("Bu e-posta adresi zaten kayıtlı.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("E-posta adresiniz henüz onaylanmamış. Lütfen e-posta kutunuzu kontrol edin.");
        } else if (authError.message.includes("Too many requests")) {
          setError("Çok fazla deneme yaptınız. Lütfen bir süre bekleyin.");
        } else {
          setError(`Giriş hatası: ${authError.message}`);
        }
        return;
      }

      if (action === 'signUp' && data.user) {
        toast({
          title: "Başarılı!",
          description: "Hesabınız başarıyla oluşturuldu! Lütfen e-posta adresinize gelen aktivasyon bağlantısına tıklayın.",
        });
        setEmail("");
        setPassword("");
        try {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            credits: 3,
            has_completed_onboarding: false
          });
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      if (data.session) {
        console.log('Session created successfully:', data.session);
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı, panele yönlendiriliyorsunuz.",
        });
        navigate("/dashboard");
      } else {
        console.log('No session created, data:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 md:pt-16 pt-[env(safe-area-inset-top)] px-4">
      <div className="w-full max-w-sm relative">

        {/* --- KOŞULLU GERİ BUTONU MANTIĞI --- */}
        {/* Bu buton sadece native mobil platform DEĞİLSE (yani web ise) görünecek */}
        {!Capacitor.isNativePlatform() && (
          <a
            href="/"
            className="absolute top-0 left-0 -translate-y-16 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sm:hidden">Geri</span>
          </a>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="text-center mb-6">
            <FileText className="h-8 w-8 md:h-10 md:w-10 text-foreground mx-auto mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artiklo</h1>
            <p className="text-muted-foreground text-sm md:text-base">Hesabınıza erişin veya yeni hesap oluşturun.</p>
          </div>

          {/* Security Notice */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Güvenlik</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Verileriniz SSL ile şifrelenir ve güvenli sunucularda saklanır.
            </p>
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
            <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
          </TabsList>
          <Card className="mt-4">
            <CardContent className="pt-4 md:pt-6">
              <TabsContent value="signin">
                <form onSubmit={(e) => handleAuthAction('signIn', e)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-posta</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={validationErrors.email ? "border-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={validationErrors.password ? "border-red-500 pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.password}
                      </p>
                    )}
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
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={validationErrors.email ? "border-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="En az 8 karakter, büyük/küçük harf ve rakam içermeli"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={validationErrors.password ? "border-red-500 pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.password}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">Şifreniz en az 8 karakter olmalı, büyük/küçük harf ve rakam içermelidir.</span>
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
                      className={validationErrors.fullName ? "border-red-500" : ""}
                    />
                    {validationErrors.fullName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.fullName}
                      </p>
                    )}
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
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;