import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Mail,
    Send,
    CheckCircle,
    AlertCircle,
    Sparkles,
    FileText,
    Users,
    TrendingUp
} from "lucide-react";

interface NewsletterProps {
    variant?: 'default' | 'compact' | 'footer' | 'inline';
    showBenefits?: boolean;
    className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
    variant = 'default',
    showBenefits = true,
    className = ""
}) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast({
                title: "Geçersiz E-posta",
                description: "Lütfen geçerli bir e-posta adresi girin.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Here you would normally make an API call to your newsletter service
            // const response = await fetch('/api/newsletter', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email })
            // });

            toast({
                title: "Başarıyla Abone Oldunuz! 🎉",
                description: "Hukuki gelişmeler ve yeni içeriklerimiz e-posta ile size ulaşacak.",
            });

            setIsSubscribed(true);
            setEmail('');
        } catch (error) {
            toast({
                title: "Bir Hata Oluştu",
                description: "Abonelik işlemi tamamlanamadı. Lütfen tekrar deneyiniz.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: FileText,
            title: "Hukuki Güncellemeler",
            description: "Yeni kanunlar ve mevzuat değişiklikleri"
        },
        {
            icon: TrendingUp,
            title: "Platform Yenilikleri",
            description: "Yeni özellikler ve geliştirmeler"
        },
        {
            icon: Users,
            title: "Özel İçerikler",
            description: "Sadece abonelere özel rehberler"
        },
        {
            icon: Sparkles,
            title: "Erken Erişim",
            description: "Yeni özellikleri ilk siz deneyimleyin"
        }
    ];

    // Footer variant - compact design
    if (variant === 'footer') {
        return (
            <div className={`max-w-2xl mx-auto text-center ${className}`}>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Hukuki Gelişmeleri Kaçırmayın
                </h3>
                <p className="text-slate-400 mb-6">
                    Yeni özellikler, hukuki gelişmeler ve faydalı içeriklerimizi e-posta ile alın.
                </p>

                {isSubscribed ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>Teşekkürler! Abone oldunuz.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        />
                        <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                                'Abone Ol'
                            )}
                        </Button>
                    </form>
                )}

                <p className="text-xs text-slate-500 mt-2">
                    İstediğiniz zaman abonelikten çıkabilirsiniz. Gizlilik politikamızı okuyun.
                </p>
            </div>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <Card className={`bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Newsletter'a Abone Olun</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Hukuki gelişmeleri ve platform haberlerini kaçırmayın.
                            </p>

                            {isSubscribed ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Başarıyla abone oldunuz!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="E-posta"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-sm"
                                    />
                                    <Button type="submit" size="sm" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                        ) : (
                                            <Send className="h-3 w-3" />
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Inline variant
    if (variant === 'inline') {
        return (
            <div className={`bg-muted/30 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Newsletter</span>
                </div>

                {isSubscribed ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Abone oldunuz!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm h-8"
                        />
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                            ) : (
                                'Abone Ol'
                            )}
                        </Button>
                    </form>
                )}
            </div>
        );
    }

    // Default variant - full featured
    return (
        <Card className={`shadow-lg ${className}`}>
            <CardContent className="p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">
                        Hukuki Gelişmeleri Takip Edin
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Yeni özellikler, hukuki güncellemeler ve özel içerikleri e-posta ile alın.
                        Hiçbir önemli gelişmeyi kaçırmayın.
                    </p>
                </div>

                {showBenefits && (
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm mb-1">{benefit.title}</h3>
                                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isSubscribed ? (
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-600 mb-2">
                            Başarıyla Abone Oldunuz! 🎉
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            İlk newsletter'ımızı yakında alacaksınız.
                        </p>
                    </div>
                ) : (
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
                            <Input
                                type="email"
                                placeholder="E-posta adresiniz (örn: ornek@email.com)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="group whitespace-nowrap"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Abone Ediliyor...
                                    </>
                                ) : (
                                    <>
                                        Ücretsiz Abone Ol
                                        <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                ✅ Spam yapmayız • ✅ İstediğiniz zaman çıkabilirsiniz • ✅ KVKK uyumlu
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Newsletter;