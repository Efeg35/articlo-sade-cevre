import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Wand2, ArrowRight } from 'lucide-react';

const IntentSelectionPage: React.FC = () => {
    const navigate = useNavigate();

    const handleAnalysisChoice = () => {
        navigate('/dashboard');
    };

    const handleWizardChoice = () => {
        // Dinamik wizard sistemi hazır, demo sayfasına yönlendir
        navigate('/dynamic-wizard-demo');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                        Artiklo'ya Hoş Geldiniz
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hukuki ihtiyaçlarınız için hangi özelliği kullanmak istiyorsunuz?
                    </p>
                </div>

                {/* Two Main Options */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Belge Analizi Option */}
                    <Card className="group cursor-pointer border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]">
                        <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <FileText className="w-10 h-10 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-blue-700">
                                📊 Belge Analizi
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                                Mevcut belgelerinizi yükleyin, analiz edin ve sadeleştirin
                            </p>
                        </CardHeader>

                        <CardContent className="text-center">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Belge Yükleme & AI Analizi</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Sadeleştirme & Risk Analizi</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Eylem Planı & Öneriler</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleAnalysisChoice}
                                size="lg"
                                className="w-full group-hover:shadow-md transition-all"
                            >
                                Belge Analiz Et
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <p className="text-sm text-green-600 font-medium mt-3">
                                ✅ Ücretsiz • ⚡ Hızlı Sonuç
                            </p>
                        </CardContent>
                    </Card>

                    {/* Belge Sihirbazı Option */}
                    <Card className="group cursor-pointer border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden">

                        {/* Premium Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-yellow-400 text-yellow-900 font-bold">PRO</Badge>
                        </div>

                        <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Wand2 className="w-10 h-10 text-purple-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-purple-700">
                                🧙‍♂️ Belge Sihirbazı
                            </CardTitle>
                            <p className="text-muted-foreground mt-2">
                                Sıfırdan adım adım profesyonel hukuki belgeler oluşturun
                            </p>
                        </CardHeader>

                        <CardContent className="text-center">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                    <span>Template Seçin (İş, Kira, vb.)</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                    <span>Adım Adım Form Doldurun</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                    <span>Profesyonel Belgeyi İndirin</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleWizardChoice}
                                size="lg"
                                className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-md transition-all"
                            >
                                Sihirbazı Başlat
                                <Wand2 className="ml-2 h-4 w-4" />
                            </Button>

                            <p className="text-sm text-purple-600 font-medium mt-3">
                                🧙‍♂️ Beta Sürümü • 💎 Premium Özellik
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* Bottom Help Text */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">
                        Henüz karar veremediniz mi?
                    </p>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/')}
                    >
                        Tüm Özellikleri Keşfedin
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default IntentSelectionPage;