import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Wand2, Mail, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WizardBetaPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [interests, setInterests] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const interestOptions = [
        { id: 'contracts', label: 'İş Sözleşmeleri', description: '12 adımda profesyonel iş sözleşmesi' },
        { id: 'rental', label: 'Kira Belgeleri', description: '8 adımda kira itiraz dilekçesi' },
        { id: 'legal', label: 'Hukuki Dilekçeler', description: '15 adımda mahkeme dilekçesi' },
        { id: 'consumer', label: 'Tüketici Hakları', description: '6 adımda şikayet dilekçesi' },
        { id: 'employment', label: 'İş Hukuku', description: 'Fesih bildirimi, iş kazası vb.' },
        { id: 'family', label: 'Aile Hukuku', description: 'Velayet, nafaka, boşanma' }
    ];

    const handleInterestChange = (interestId: string, checked: boolean) => {
        if (checked) {
            setInterests([...interests, interestId]);
        } else {
            setInterests(interests.filter(id => id !== interestId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Supabase'e beta signup kaydı atacağız
            // Şimdilik simüle edelim
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsSubmitted(true);
            toast({
                title: "🎉 Başarılı!",
                description: "Beta listesine kaydoldunuz. Size haber vereceğiz!"
            });
        } catch (error) {
            toast({
                title: "❌ Hata",
                description: "Bir hata oluştu. Lütfen tekrar deneyin.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <Card className="border-2 border-green-200 bg-white shadow-lg">
                        <CardContent className="text-center p-8">
                            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-green-800 mb-4">
                                Kaydınız Alındı! 🎉
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Belge Sihirbazı hazır olduğunda size e-posta ile haber vereceğiz.
                                <br />
                                <strong>Tahmini çıkış tarihi:</strong> 2025 Q1
                            </p>
                            <div className="space-y-3">
                                <Button onClick={() => navigate('/dashboard')} className="w-full">
                                    Dashboard'a Dön
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/intent-selection')}
                                    className="w-full"
                                >
                                    Ana Menüye Dön
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/intent-selection')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri Dön
                    </Button>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Wand2 className="h-8 w-8 text-purple-600" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                Belge Sihirbazı
                            </h1>
                            <Badge className="bg-yellow-400 text-yellow-900">BETA</Badge>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Adım adım belge oluşturma sistemi yakında sizlerle!
                        </p>
                    </div>
                </div>

                {/* Beta Signup Form */}
                <Card className="border-2 border-purple-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-center">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Beta Listesine Katılın
                        </CardTitle>
                        <CardDescription className="text-center">
                            İlk çıktığında haber almak ve öncelikli erişim kazanmak için e-postanızı bırakın
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta Adresiniz *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-purple-200"
                                    required
                                />
                            </div>

                            {/* Interest Selection */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium">
                                    Hangi belge türleri ilginizi çekiyor? (İsteğe bağlı)
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {interestOptions.map((option) => (
                                        <div key={option.id} className="border rounded-lg p-3 hover:bg-purple-50 transition-colors">
                                            <div className="flex items-start space-x-2">
                                                <Checkbox
                                                    id={option.id}
                                                    checked={interests.includes(option.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleInterestChange(option.id, checked as boolean)
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                                                        {option.label}
                                                    </label>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                disabled={isLoading}
                                size="lg"
                            >
                                {isLoading ? (
                                    "Kaydediliyor..."
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Beta Listesine Katıl
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Beta çıkış tarihi: <strong>2025 Q1</strong> • Öncelikli erişim alacaksınız
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview Section */}
                <Card className="mt-8 border-dashed border-2 border-purple-300 bg-white/50">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            🔮 Gelecekte Neler Olacak?
                        </h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>20+ profesyonel belge template'i</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Adım adım rehberli süreç</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Hukuki risk uyarı sistemi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Multi-format export (PDF, DOCX)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Mobil-optimized native experience</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default WizardBetaPage;