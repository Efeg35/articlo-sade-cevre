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
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { Loader2, ArrowLeft, FileText, Eye, EyeOff, Mail, CheckCircle, Chrome, Apple } from "lucide-react";
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
  const hapticFeedback = useHapticFeedback();
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
  }, [initialTab, location.search]);

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

  // Social Login handlers
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        Logger.error('Auth', 'Google login failed', { error: error.message });
        if (error.message.includes('provider is not enabled')) {
          setError("Google ile giriş henüz aktif değil. Lütfen normal giriş yapın.");
        } else {
          setError("Google ile giriş yapılırken bir hata oluştu.");
        }
      }
    } catch (err) {
      Logger.error('Auth', 'Google login error', err);
      setError("Google ile giriş yapılırken beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        Logger.error('Auth', 'Apple login failed', { error: error.message });
        if (error.message.includes('provider is not enabled')) {
          setError("Apple ile giriş henüz aktif değil. Lütfen normal giriş yapın.");
        } else {
          setError("Apple ile giriş yapılırken bir hata oluştu.");
        }
      }
    } catch (err) {
      Logger.error('Auth', 'Apple login error', err);
      setError("Apple ile giriş yapılırken beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Google Logo Component
  const GoogleLogo = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  // Apple Logo Component
  const AppleLogo = () => (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-8 md:pt-12 pt-[env(safe-area-inset-top)] px-4">
      {/* Minimal Grid Pattern Background - Landing page ile uyumlu */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02]" />
      </div>

      {/* Logo - Landing page stili */}
      {!Capacitor.isNativePlatform() && (
        <div className="fixed top-4 left-4 z-50">
          <img
            src="/logo-transparent.png"
            alt="Artiklo Logo"
            className="h-16 w-16 md:h-20 md:w-20 object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-sm relative mt-8 md:mt-12">
        {/* Back Button - Temiz tasarım */}
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
          {/* Header - Landing page ile uyumlu */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artiklo</h1>
            <p className="text-muted-foreground text-sm md:text-base">Hesabınıza erişin veya yeni hesap oluşturun.</p>
          </div>

          {/* Security Notice - Minimal */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Güvenlik</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Verileriniz SSL ile şifrelenir ve güvenli sunucularda saklanır.
            </p>
          </div>

          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
            <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
          </TabsList>

          {/* Main Card - Landing page ile uyumlu */}
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    onClick={() => hapticFeedback.medium()}
                  >
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

                {/* Social Login Options */}
                <div className="mt-6 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">veya</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 h-10 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700"
                      title="Supabase'de Google OAuth henüz aktif değil"
                    >
                      <GoogleLogo />
                      <span className="text-sm font-medium">Google</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 h-10 bg-black hover:bg-gray-800 text-white border border-gray-300"
                      title="Supabase'de Apple OAuth henüz aktif değil"
                    >
                      <AppleLogo />
                      <span className="text-sm font-medium">Apple</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={(e) => handleAuthAction('signUp', e)} className="space-y-4">
                  {/* 📧 Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">E-posta Adresiniz</Label>
                    <div className="relative group">
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 group-hover:bg-white/90 ${validationErrors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                          }`}
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* 🔒 Password Inputs */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Şifre</Label>
                      <div className="relative group">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Güçlü şifre oluşturun"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 group-hover:bg-white/90 pr-10 ${validationErrors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {validationErrors.password && (
                        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors.password}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">En az 8 karakter, büyük/küçük harf ve rakam</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">Şifre Tekrarı</Label>
                      <div className="relative group">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Şifrenizi tekrar girin"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 group-hover:bg-white/90 pr-10 ${validationErrors.confirmPassword ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 👤 Personal Info */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname" className="text-sm font-medium text-gray-700">Ad Soyad</Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="Adınız Soyadınız"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 hover:bg-white/90 ${validationErrors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                          }`}
                      />
                      {validationErrors.fullName && (
                        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">Telefon</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="5xx xxx xx xx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 hover:bg-white/90 ${validationErrors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                          }`}
                      />
                      {validationErrors.phone && (
                        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 📅 Birth Date & Reference */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-birthdate" className="text-sm font-medium text-gray-700">Doğum Tarihi</Label>
                      <Input
                        id="signup-birthdate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 hover:bg-white/90 ${validationErrors.birthDate ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                          }`}
                        max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                      />
                      {validationErrors.birthDate && (
                        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
                          <AlertTriangle className="h-3 w-3" />
                          {validationErrors.birthDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-reference" className="text-sm font-medium text-gray-700">Referans Kodu <span className="text-gray-400">(İsteğe Bağlı)</span></Label>
                      <Input
                        id="signup-reference"
                        type="text"
                        placeholder="Referans kodunuz varsa"
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        className={`h-11 bg-white/70 border-2 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 hover:bg-white/90 ${validationErrors.referenceCode ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-blue-500"
                          }`}
                      />
                    </div>
                  </div>

                  {/* 📩 Preferences - Compact */}
                  <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100/50 space-y-3">
                    <h4 className="text-sm font-medium text-gray-800">İletişim Tercihleri</h4>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">Pazarlama bilgileri</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailConsent}
                          onChange={(e) => setEmailConsent(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">E-posta bildirimleri</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">SMS bildirimleri</span>
                      </label>
                    </div>
                  </div>

                  {/* ⚖️ Terms */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50/70 rounded-lg border border-gray-200/50">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      <Link to="/kullanici-sozlesmesi" target="_blank" className="font-medium text-blue-600 hover:text-blue-700 underline">
                        Kullanıcı Sözleşmesi
                      </Link>{" "}
                      ve{" "}
                      <Link to="/kvkk-aydinlatma" target="_blank" className="font-medium text-blue-600 hover:text-blue-700 underline">
                        KVKK Aydınlatma Metni
                      </Link>
                      'ni okudum ve kabul ediyorum.
                    </span>
                  </div>

                  {/* 🚀 Signup Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2"
                    disabled={loading}
                    onClick={() => hapticFeedback.medium()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Hesap oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Hemen Başla
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    E-posta gelmediyse spam klasörünü kontrol edin.
                  </p>
                </form>

                {/* ✨ Benefits - Compact */}
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-200/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-800">Avantajlarınız</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Belgelerinizi güvenle sadeleştirin</li>
                    <li>• Hızlı, kolay ve ücretsiz kullanım</li>
                    <li>• Tüm işlemlerinizi takip edin</li>
                  </ul>
                </div>
              </TabsContent>
              {/* 🚨 Error Display - Enhanced */}
              {error && (
                <Alert variant="destructive" className="mt-6 bg-red-50/80 backdrop-blur-sm border-red-200/50 animate-fade-in">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 font-medium">Bir sorun oluştu</AlertTitle>
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* ✅ Success Message - Enhanced */}
              {successMessage && (
                <Alert className="mt-6 bg-green-50/80 backdrop-blur-sm border-green-200/50 animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 font-medium">Başarılı!</AlertTitle>
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
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