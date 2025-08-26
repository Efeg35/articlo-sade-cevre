import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
    Sparkles
} from "lucide-react";

interface SimpleOnboardingTourProps {
    open: boolean;
    onFinish: () => void;
}

const onboardingSteps = [
    {
        id: "what",
        title: "Artiklo Ne İşe Yarar?",
        description: "Elinize gelen hukuki belgeyi anlayamıyor musunuz? Artiklo, karmaşık resmi yazıları sade Türkçe'ye çevirir.",
        icon: <FileText className="h-8 w-8 text-primary" />,
        examples: [
            "Mahkeme tebligatı geldi, ne yapacağımı bilmiyorum",
            "Kira sözleşmesindeki maddeleri anlamıyorum",
            "İcra takibi başladı, haklarım neler?",
            "İş sözleşmesinde tuzak var mı?",
            "Banka kredisi sözleşmesi karmaşık geliyor",
            "Sigorta poliçesi ne anlama geliyor?",
            "Kat mülkiyeti yönetmeliği anlaşılmıyor",
            "Miras davaları belgelerini okuyamıyorum",
            "İdari para cezası tebligatı aldım",
            "Boşanma davası evrakları çok karışık"
        ]
    },
    {
        id: "results",
        title: "Ne Tür Sonuçlar Alırsınız?",
        description: "Sadece çeviri değil, belgenin tüm sürecini size anlatıyoruz. Ne yapmanız gerektiğini adım adım öğrenin.",
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
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
        icon: <ArrowRight className="h-8 w-8 text-primary" />,
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
        icon: <Users className="h-8 w-8 text-primary" />,
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
        icon: <Sparkles className="h-8 w-8 text-primary" />,
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

export default function SimpleOnboardingTour({ open, onFinish }: SimpleOnboardingTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

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

    // Touch/Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setIsDragging(false);

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe left (next)
                handleNext();
            } else {
                // Swipe right (previous)
                handlePrevious();
            }
        }
    };

    // Mouse drag handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setIsDragging(false);

        const endX = e.clientX;
        const endY = e.clientY;
        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Drag left (next)
                handleNext();
            } else {
                // Drag right (previous)
                handlePrevious();
            }
        }
    };

    // Keyboard navigation
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

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <Badge variant="outline">
                            {currentStep + 1} / {onboardingSteps.length}
                        </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                </DialogHeader>

                {/* Content */}
                <div
                    className="py-6 select-none cursor-grab active:cursor-grabbing transition-all duration-300 ease-in-out"
                    ref={containerRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            {step.icon}
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">{step.description}</p>
                    </div>

                    {/* Dynamic Content */}
                    <div className="space-y-6">

                        {/* What - Examples */}
                        {step.id === "what" && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-center mb-4">Örnek Durumlar:</h3>
                                {step.examples?.map((example, index) => (
                                    <Card key={index} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                                                </div>
                                                <p className="text-sm">{example}</p>
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
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                                    {stepItem.number}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-1">{stepItem.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{stepItem.desc}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Results - Process Steps */}
                        {step.id === "results" && (
                            <div className="space-y-4">
                                {step.processSteps?.map((processStep, index) => (
                                    <Card key={index} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                                    {processStep.step}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold mb-1 text-sm">{processStep.title}</h4>
                                                    <p className="text-xs text-muted-foreground mb-2">{processStep.desc}</p>
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
                            <div className="space-y-4">
                                {step.benefits?.map((benefit, index) => (
                                    <Card key={index} className="hover:shadow-sm transition-shadow border-primary/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
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
                            <div className="grid grid-cols-2 gap-4">
                                {step.statistics?.map((stat, index) => (
                                    <Card key={index} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-2xl font-bold text-primary mb-2">{stat.number}</div>
                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Special message for last step */}
                    {currentStep === onboardingSteps.length - 1 && (
                        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="p-6 text-center">
                                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold mb-2 text-primary">Artık Hazırsınız!</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    3 ücretsiz belge hakkınızla Artiklo'yu denemeye başlayabilirsiniz.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Clock className="h-4 w-4" />
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
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            Geri
                        </Button>

                        <div className="flex gap-1">
                            {onboardingSteps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                        ? 'bg-primary w-4'
                                        : index < currentStep
                                            ? 'bg-primary/60'
                                            : 'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>

                        {currentStep < onboardingSteps.length - 1 ? (
                            <Button onClick={handleNext}>
                                İleri
                            </Button>
                        ) : (
                            <Button onClick={handleFinish} className="font-semibold">
                                Hadi Başlayalım!
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}