import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    FileText,
    Upload,
    ArrowRight,
    CheckCircle,
    Shield,
    Users,
    Clock,
    Sparkles,
    X
} from "lucide-react";
import { Capacitor } from "@capacitor/core";

interface SimpleMobileOnboardingProps {
    open: boolean;
    onFinish: () => void;
}

const onboardingSteps = [
    {
        id: "what",
        title: "Artiklo Ne İşe Yarar?",
        description: "Elinize gelen hukuki belgeyi anlayamıyor musunuz? Artiklo, karmaşık resmi yazıları sade Türkçe'ye çevirir.",
        icon: <FileText className="h-12 w-12 text-primary" />,
        examples: [
            "Mahkeme tebligatı geldi, ne yapacağımı bilmiyorum",
            "Kira sözleşmesindeki maddeleri anlamıyorum",
            "İcra takibi başladı, haklarım neler?",
            "İş sözleşmesinde tuzak var mı?",
            "Banka kredisi sözleşmesi karmaşık geliyor",
            "Sigorta poliçesi ne anlama geliyor?",
            "Kat mülkiyeti yönetmeliği anlaşılmıyor",
            "Miras davaları belgelerini okuyamıyorum"
        ]
    },
    {
        id: "results",
        title: "Ne Tür Sonuçlar Alırsınız?",
        description: "Sadece çeviri değil, belgenin tüm sürecini size anlatıyoruz. Ne yapmanız gerektiğini adım adım öğrenin.",
        icon: <CheckCircle className="h-12 w-12 text-primary" />,
        processSteps: [
            {
                step: "1",
                title: "Belge Analizi",
                desc: "AI belgenizi okur ve ne tür bir belge olduğunu tespit eder",
                details: "Mahkeme tebligatı, sözleşme, ceza vs. belirlenir"
            },
            {
                step: "2",
                title: "Sade Türkçe Çeviri",
                desc: "Hukuki jargon temizlenir, size anlaşılır dille açıklanır",
                details: "Karmaşık maddeler basit cümlelerle açıklanır"
            },
            {
                step: "3",
                title: "Risk Değerlendirmesi",
                desc: "Belgenin size olan riskleri ve önemli noktalar belirlenir",
                details: "Para cezası, hapis, mal kaybı gibi riskler uyarılır"
            },
            {
                step: "4",
                title: "Yapılacaklar Listesi",
                desc: "Hangi tarihlerde ne yapmanız gerektiği sıralanır",
                details: "İtiraz süreleri, mahkeme tarihleri, gerekli belgeler"
            },
            {
                step: "5",
                title: "Belge Oluşturma",
                desc: "Gerekirse yanıt dilekçesi veya başvuru formu hazırlanır",
                details: "Avukat yazımı kalitesinde resmi belgeler"
            }
        ]
    },
    {
        id: "how",
        title: "Nasıl Kullanıyorsunuz?",
        description: "Çok basit: Belgenizi yükleyin, birkaç saniye bekleyin, anlaşılır açıklamayı okuyun.",
        icon: <ArrowRight className="h-12 w-12 text-primary" />,
        steps: [
            { number: "1", title: "Belgeyi yükleyin", desc: "Fotoğraf çekin veya dosya seçin" },
            { number: "2", title: "AI analiz etsin", desc: "10 saniye içinde işlem tamamlanır" },
            { number: "3", title: "Sonucu okuyun", desc: "Sade Türkçe açıklama alırsınız" }
        ]
    },
    {
        id: "stats",
        title: "Kimler Kullanıyor?",
        description: "Binlerce kişi Artiklo ile belgelerini anlıyor. Siz de aramıza katılın!",
        icon: <Users className="h-12 w-12 text-primary" />,
        statistics: [
            { number: "10.000+", label: "Mutlu Kullanıcı" },
            { number: "50.000+", label: "Analiz Edilen Belge" },
            { number: "%95", label: "Memnuniyet Oranı" },
            { number: "3 saniye", label: "Ortalama İşlem Süresi" }
        ]
    },
    {
        id: "motivation",
        title: "Hukuki Sorunlara Son!",
        description: "Artık karmaşık belgelerin korkutmasına gerek yok. Artiklo ile her şey çok basit.",
        icon: <Sparkles className="h-12 w-12 text-primary" />,
        benefits: [
            {
                title: "Avukat Masrafına Alternatif",
                desc: "Basit belgeler için önce Artiklo ile anlayın, sonra uzman desteği alın",
                saving: "₺2,000-5,000 tasarruf"
            },
            {
                title: "Zaman Kaybetmeyin",
                desc: "Randevu almak, bekleme odalarında oturmak yok",
                saving: "2-3 hafta zaman kazanç"
            },
            {
                title: "Stresten Kurtulun",
                desc: "Ne yapacağınızı bilmemek artık sorun değil",
                saving: "Huzur ve güven"
            },
            {
                title: "7/24 Hizmet",
                desc: "Gece gündüz istediğiniz zaman kullanabilirsiniz",
                saving: "Anında çözüm"
            }
        ]
    }
];

export default function SimpleMobileOnboarding({ open, onFinish }: SimpleMobileOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    // Keyboard navigation for accessibility
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                handleFinish();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, currentStep]);

    // Full screen mobile override
    useEffect(() => {
        if (!open) return;

        // Save original styles
        const originalBodyStyle = document.body.style.cssText;
        const originalHtmlStyle = document.documentElement.style.cssText;

        // Apply full screen styles
        document.body.style.cssText = `
            margin: 0 !important;
            padding: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow: hidden !important;
            height: 100vh !important;
            width: 100vw !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            background: hsl(var(--background)) !important;
        `;

        document.documentElement.style.cssText = `
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            height: 100vh !important;
            width: 100vw !important;
        `;

        // Add viewport meta if not exists
        const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
        let originalViewport = '';

        if (viewportMeta) {
            originalViewport = viewportMeta.content;
            viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.cssText = originalBodyStyle;
            document.documentElement.style.cssText = originalHtmlStyle;
            if (viewportMeta && originalViewport) {
                viewportMeta.content = originalViewport;
            }
        };
    }, [open]);

    // StatusBar ayarları - onboarding için özel dark mode
    useEffect(() => {
        if (!open || !Capacitor.isNativePlatform()) return;

        const setOnboardingStatusBar = async () => {
            try {
                const { StatusBar, Style } = await import('@capacitor/status-bar');
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#ffffff' });
                console.log('[SimpleMobileOnboarding] StatusBar set to dark for onboarding');
            } catch (error) {
                console.error('[SimpleMobileOnboarding] StatusBar error (normal):', error);
            }
        };

        setOnboardingStatusBar();
    }, [open]);

    if (!open) return null;

    const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
    const step = onboardingSteps[currentStep];

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        onFinish();
        setCurrentStep(0);
        // Redirect to auth
        navigate('/auth');
    };

    // Touch/Swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        // Don't prevent default to allow normal scrolling
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setIsDragging(false);

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Only trigger swipe if horizontal movement is greater than vertical and meets threshold
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
            if (deltaX > 0) {
                // Swipe left (next)
                handleNext();
            } else {
                // Swipe right (previous)
                handlePrevious();
            }
        }
    };

    return (
        <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-background z-50 flex flex-col"
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2 border-b bg-background"
                style={{
                    paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
                    minHeight: '60px'
                }}
            >
                <Badge variant="outline" className="text-xs">
                    {currentStep + 1} / {onboardingSteps.length}
                </Badge>
                <div className="flex-1"></div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFinish}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <Progress value={progress} className="h-1" />

            {/* Content */}
            <div
                className="flex-1 overflow-y-auto p-4 select-none transition-all duration-300 ease-in-out"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >

                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                        {step.icon}
                    </div>
                    <h2 className="text-xl font-bold mb-3">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm px-2">{step.description}</p>
                </div>

                {/* Dynamic Content */}
                <div className="space-y-4">

                    {/* What - Examples */}
                    {step.id === "what" && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-center mb-4 text-sm">Örnek Durumlar:</h3>
                            {step.examples?.map((example, index) => (
                                <Card key={index} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-primary">{index + 1}</span>
                                            </div>
                                            <p className="text-xs leading-relaxed">{example}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* How - Steps */}
                    {step.id === "how" && (
                        <div className="space-y-4">
                            {step.steps?.map((stepItem, index) => (
                                <Card key={index} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                                {stepItem.number}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1 text-sm">{stepItem.title}</h4>
                                                <p className="text-xs text-muted-foreground">{stepItem.desc}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Results - Process Steps */}
                    {step.id === "results" && (
                        <div className="space-y-3">
                            {step.processSteps?.map((processStep, index) => (
                                <Card key={index} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                                                {processStep.step}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1 text-xs">{processStep.title}</h4>
                                                <p className="text-xs text-muted-foreground mb-1">{processStep.desc}</p>
                                                <p className="text-xs text-primary/80 italic">{processStep.details}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Motivation - Benefits */}
                    {step.id === "motivation" && (
                        <div className="space-y-3">
                            {step.benefits?.map((benefit, index) => (
                                <Card key={index} className="hover:shadow-sm transition-shadow border-primary/20">
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-xs mb-1">{benefit.title}</h4>
                                                <p className="text-xs text-muted-foreground mb-2">{benefit.desc}</p>
                                                <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    {benefit.saving}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Stats - Statistics */}
                    {step.id === "stats" && (
                        <div className="grid grid-cols-2 gap-3">
                            {step.statistics?.map((stat, index) => (
                                <Card key={index} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-lg font-bold text-primary mb-1">{stat.number}</div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                </div>

                {/* Special message for last step */}
                {currentStep === onboardingSteps.length - 1 && (
                    <Card className="mt-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-4 text-center">
                            <Sparkles className="h-6 w-6 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-2 text-sm text-primary">Artık Hazırsınız!</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                3 ücretsiz belge hakkınızla Artiklo'yu denemeye başlayabilirsiniz.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
                                <Clock className="h-3 w-3" />
                                <span>Kayıt olmak 30 saniye sürüyor</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                🎯 Hemen Başlayın
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-3">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        size="sm"
                    >
                        Geri
                    </Button>

                    <div className="flex gap-1">
                        {onboardingSteps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                    ? 'bg-primary w-3'
                                    : index < currentStep
                                        ? 'bg-primary/60'
                                        : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>

                    {currentStep < onboardingSteps.length - 1 ? (
                        <Button onClick={handleNext} size="sm">
                            İleri
                        </Button>
                    ) : (
                        <Button onClick={handleFinish} className="font-semibold" size="sm">
                            Hadi Başlayalım!
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}