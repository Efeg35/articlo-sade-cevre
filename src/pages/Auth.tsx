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
import { Loader2, ArrowLeft, FileText, Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Capacitor } from '@capacitor/core';
import { authFormSchema, rateLimiter, validateAndSanitizeInput } from "@/lib/validation";
import { Shield, AlertTriangle } from "lucide-react";
import { Logger } from "@/utils/logger";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const initialTab = location.pathname === "/signup" ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(initialTab);

  // 🔒 Password reset states
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check for session timeout
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('timeout') === 'true') {
      setError("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
    }
  }, [location]);

  // 🔒 KONTROL NOKTASI: Component mounted with logger
  useEffect(() => {
    Logger.log('Auth', 'Component mounted', {
      initialTab,
      hasTimeout: new URLSearchParams(location.search).get('timeout') === 'true'
    });
  }, []);

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

    // Not: Girdi güvenliği validation şemaları (Zod) ile zaten sağlanıyor.

    // Input validation and sanitization
    const sanitizedEmail = validateAndSanitizeInput(email);
    const sanitizedPassword = validateAndSanitizeInput(password);
    const sanitizedFullName = fullName ? validateAndSanitizeInput(fullName) : "";
    const sanitizedPhone = phone ? validateAndSanitizeInput(phone) : "";
    const sanitizedReferenceCode = referenceCode ? validateAndSanitizeInput(referenceCode) : "";

    try {
      // Validate form data
      const formData = {
        email: sanitizedEmail,
        password: sanitizedPassword,
        ...(action === 'signUp' && {
          confirmPassword,
          fullName: sanitizedFullName,
          phone: sanitizedPhone,
          birthDate: birthDate || undefined,
          referenceCode: sanitizedReferenceCode || undefined,
          marketingConsent,
          emailConsent,
          smsConsent
        })
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
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: sanitizedFullName,
              phone: sanitizedPhone,
              birth_date: birthDate,
              reference_code: sanitizedReferenceCode,
              marketing_consent: marketingConsent,
              email_consent: emailConsent,
              sms_consent: smsConsent
            },
          },
        });
      }

      const { data, error: authError } = response;

      if (authError) {
        Logger.error('Auth', 'Authentication failed', { error: authError.message });
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
        setConfirmPassword("");
        setFullName("");
        setPhone("");
        setBirthDate("");
        setReferenceCode("");
        setMarketingConsent(false);
        setEmailConsent(false);
        setSmsConsent(false);
      }

      if (data.session) {
        Logger.log('Auth', 'Session created successfully');
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı, panele yönlendiriliyorsunuz.",
        });
        navigate("/dashboard");
      } else {
        Logger.warn('Auth', 'No session created after auth');
      }
    } catch (err) {
      Logger.error('Auth', 'Unexpected authentication error', err);
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };


  // 🔒 Password reset handler
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    Logger.log('Auth', 'Password reset requested');

    setResetLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const sanitizedEmail = validateAndSanitizeInput(resetEmail);

      if (!sanitizedEmail || !sanitizedEmail.includes('@')) {
        setError("Lütfen geçerli bir e-posta adresi girin.");
        setResetLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        Logger.error('Auth', 'Password reset failed', { error: error.message });
        setError("Şifre sıfırlama e-postası gönderilemedi. Lütfen e-posta adresinizi kontrol edin.");
      } else {
        Logger.log('Auth', 'Password reset email sent successfully');
        setResetSuccess(true);
        setSuccessMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu ve spam klasörünü kontrol edin.");
      }
    } catch (err) {
      Logger.error('Auth', 'Unexpected password reset error', err);
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-8 md:pt-12 pt-[env(safe-area-inset-top)] px-4">

      {/* Logo ekranın en sol üstünde (Sadece web'de göster) */}
      {!Capacitor.isNativePlatform() && (
        <div className="fixed -top-4 left-4 z-50">
          <img
            src="/logo-transparent.png"
            alt="Artiklo Logo"
            className="h-16 w-16 md:h-20 md:w-20 object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-sm relative mt-8 md:mt-12">

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
                  Şifrenizi mi unuttunuz?{" "}
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="underline cursor-pointer hover:text-foreground transition-colors"
                  >
                    Şifremi Sıfırla
                  </button>
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
                    <Label htmlFor="signup-confirm-password">Şifre Tekrarı</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Şifrenizi tekrar girin"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={validationErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.confirmPassword}
                      </p>
                    )}
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
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Telefon Numarası</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="5xx xxx xx xx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className={validationErrors.phone ? "border-red-500" : ""}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.phone}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">SMS doğrulama ve acil durum iletişimi için gereklidir.</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-birthdate">Doğum Tarihi</Label>
                    <Input
                      id="signup-birthdate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className={validationErrors.birthDate ? "border-red-500" : ""}
                      max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                    />
                    {validationErrors.birthDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.birthDate}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">Yaş doğrulama için gereklidir (18+ yaş sınırı).</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-reference">Referans Kodu (İsteğe Bağlı)</Label>
                    <Input
                      id="signup-reference"
                      type="text"
                      placeholder="Referans kodunuz varsa giriniz"
                      value={referenceCode}
                      onChange={(e) => setReferenceCode(e.target.value)}
                      className={validationErrors.referenceCode ? "border-red-500" : ""}
                    />
                    {validationErrors.referenceCode && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.referenceCode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">İletişim Tercihleri</div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="marketing-consent"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="mt-1"
                        />
                        <label htmlFor="marketing-consent" className="text-xs text-gray-600">
                          Pazarlama ve promosyon bilgilerini almak istiyorum.
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="email-consent"
                          checked={emailConsent}
                          onChange={(e) => setEmailConsent(e.target.checked)}
                          className="mt-1"
                        />
                        <label htmlFor="email-consent" className="text-xs text-gray-600">
                          E-posta ile bildirim almak istiyorum.
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="sms-consent"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="mt-1"
                        />
                        <label htmlFor="sms-consent" className="text-xs text-gray-600">
                          SMS ile bildirim almak istiyorum.
                        </label>
                      </div>
                    </div>
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
                  <div className="text-xs text-muted-foreground mt-2">
                    <div>E-posta gelmediyse spam klasörünü kontrol edin.</div>
                  </div>
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

      {/* 🔒 Password Reset Modal */}
      {isResetMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Şifre Sıfırla
              </CardTitle>
              <CardDescription>
                {resetSuccess
                  ? "E-posta başarıyla gönderildi!"
                  : "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!resetSuccess ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">E-posta Adresi</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={resetLoading}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsResetMode(false);
                        setResetEmail("");
                        setError("");
                        setSuccessMessage("");
                      }}
                      disabled={resetLoading}
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={resetLoading || !resetEmail}
                      className="flex-1"
                    >
                      {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {resetLoading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Şifre sıfırlama bağlantısı <strong>{resetEmail}</strong> adresine gönderildi.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      E-posta gelmezse spam klasörünüzü kontrol edin.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsResetMode(false);
                      setResetSuccess(false);
                      setResetEmail("");
                      setSuccessMessage("");
                    }}
                    className="w-full"
                  >
                    Tamam
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && !resetSuccess && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Başarılı</AlertTitle>
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Auth;