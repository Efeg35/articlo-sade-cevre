import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { Logger } from "@/utils/logger";
import { validateAndSanitizeInput } from "@/lib/validation";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);

    const supabase = useSupabaseClient();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    Logger.log('ResetPassword', 'Component mounted');

    // Session validation
    useEffect(() => {
        const validateSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    Logger.error('ResetPassword', 'Session validation error', { error: error.message });
                    setError("Geçersiz veya süresi dolmuş bağlantı. Lütfen şifre sıfırlama işlemini tekrar başlatın.");
                    setIsValidSession(false);
                } else if (session) {
                    Logger.log('ResetPassword', 'Valid session found for password reset');
                    setIsValidSession(true);
                } else {
                    Logger.warn('ResetPassword', 'No session found for password reset');
                    setError("Geçersiz veya süresi dolmuş bağlantı. Lütfen şifre sıfırlama işlemini tekrar başlatın.");
                    setIsValidSession(false);
                }
            } catch (err) {
                Logger.error('ResetPassword', 'Unexpected session validation error', err);
                setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
                setIsValidSession(false);
            } finally {
                setSessionLoading(false);
            }
        };

        validateSession();
    }, [supabase.auth]);

    // 🔒 KONTROL NOKTASI: Session validation
    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-8 md:pt-12 px-4">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Bağlantı doğrulanıyor...</p>
                </div>
            </div>
        );
    }

    if (!isValidSession) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-8 md:pt-12 px-4">
                <div className="w-full max-w-md">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle>Geçersiz Bağlantı</CardTitle>
                            <CardDescription>
                                Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Şifre sıfırlama işlemini tekrar başlatmanız gerekiyor.
                                </p>
                                <Button onClick={() => navigate("/auth")} className="w-full">
                                    Giriş Sayfasına Dön
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const validatePassword = (pwd: string): { isValid: boolean; message: string } => {
        if (pwd.length < 8) {
            return { isValid: false, message: "Şifre en az 8 karakter olmalıdır." };
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            return { isValid: false, message: "Şifre en az bir küçük harf içermelidir." };
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            return { isValid: false, message: "Şifre en az bir büyük harf içermelidir." };
        }
        if (!/(?=.*\d)/.test(pwd)) {
            return { isValid: false, message: "Şifre en az bir rakam içermelidir." };
        }
        return { isValid: true, message: "" };
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        Logger.log('ResetPassword', 'Password reset form submitted');

        setError("");
        setSuccess("");

        // 🔒 Input validation
        const sanitizedPassword = validateAndSanitizeInput(password);
        const sanitizedConfirmPassword = validateAndSanitizeInput(confirmPassword);

        if (!sanitizedPassword || !sanitizedConfirmPassword) {
            Logger.warn('ResetPassword', 'Invalid input detected');
            setError("Geçersiz girdi tespit edildi.");
            return;
        }

        if (sanitizedPassword !== sanitizedConfirmPassword) {
            Logger.warn('ResetPassword', 'Password mismatch');
            setError("Şifreler eşleşmiyor.");
            return;
        }

        // Password strength validation
        const passwordValidation = validatePassword(sanitizedPassword);
        if (!passwordValidation.isValid) {
            Logger.warn('ResetPassword', 'Password validation failed');
            setError(passwordValidation.message);
            return;
        }

        setLoading(true);
        Logger.time('ResetPassword', 'Password update operation');

        try {
            const { error } = await supabase.auth.updateUser({
                password: sanitizedPassword
            });

            if (error) {
                Logger.error('ResetPassword', 'Password update failed', { error: error.message });

                if (error.message.includes("Password should be")) {
                    setError("Şifre güvenlik kriterlerini karşılamıyor. Lütfen daha güçlü bir şifre seçin.");
                } else if (error.message.includes("session")) {
                    setError("Oturum süresi dolmuş. Lütfen şifre sıfırlama işlemini tekrar başlatın.");
                } else {
                    setError("Şifre güncellenirken hata oluştu. Lütfen tekrar deneyin.");
                }
            } else {
                Logger.log('ResetPassword', 'Password updated successfully');
                setSuccess("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");

                toast({
                    title: "Başarılı!",
                    description: "Şifreniz başarıyla güncellendi.",
                });

                // 🔒 KONTROL NOKTASI: Successful password reset
                setTimeout(() => {
                    navigate("/auth", { replace: true });
                }, 2000);
            }
        } catch (err) {
            Logger.error('ResetPassword', 'Unexpected password reset error', err);
            setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            Logger.timeEnd('ResetPassword', 'Password update operation');
            setLoading(false);
        }
    };

    const passwordValidation = validatePassword(password);
    const isFormValid = passwordValidation.isValid && password === confirmPassword && password.length > 0;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center pt-8 md:pt-12 px-4">
            <div className="w-full max-w-md">
                {/* Security Notice */}
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">Güvenlik</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                        Yeni şifreniz güçlü olmalı ve sadece size ait olmalıdır.
                    </p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Yeni Şifre Belirleyin</CardTitle>
                        <CardDescription>
                            Hesabınız için güvenli bir şifre oluşturun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Yeni Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Güçlü bir şifre girin"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password strength indicator */}
                                {password && (
                                    <div className="text-xs space-y-1">
                                        <div className={`flex items-center gap-1 ${passwordValidation.isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordValidation.isValid ? (
                                                <CheckCircle className="h-3 w-3" />
                                            ) : (
                                                <div className="h-3 w-3 rounded-full border border-current" />
                                            )}
                                            <span>En az 8 karakter, büyük/küçük harf ve rakam</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Şifrenizi tekrar girin"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password match indicator */}
                                {confirmPassword && (
                                    <div className="text-xs">
                                        <div className={`flex items-center gap-1 ${password === confirmPassword ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {password === confirmPassword ? (
                                                <CheckCircle className="h-3 w-3" />
                                            ) : (
                                                <div className="h-3 w-3 rounded-full border border-current" />
                                            )}
                                            <span>Şifreler eşleşiyor</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !isFormValid}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? 'Şifre Güncelleniyor...' : 'Şifreyi Güncelle'}
                            </Button>
                        </form>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Hata</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="mt-4 bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Başarılı</AlertTitle>
                                <AlertDescription className="text-green-700">{success}</AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-6 text-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/auth")}
                                disabled={loading}
                                className="text-sm"
                            >
                                Giriş Sayfasına Dön
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;