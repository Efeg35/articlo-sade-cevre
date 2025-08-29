import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    MessageCircle,
    Headphones,
    Users,
    FileText,
    ArrowRight
} from "lucide-react";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const Iletisim = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Mesajınız Alındı!",
            description: "24 saat içinde size dönüş yapacağız.",
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });

        setIsSubmitting(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "E-posta",
            value: "info@artiklo.com",
            description: "Genel sorularınız için",
            href: "mailto:info@artiklo.com"
        },
        {
            icon: Phone,
            title: "Telefon",
            value: "+90 (xxx) xxx xx xx",
            description: "Acil durumlar için",
            href: "tel:+90xxxxxxxxx"
        },
        {
            icon: MapPin,
            title: "Adres",
            value: "İstanbul, Türkiye",
            description: "Merkez ofisimiz",
            href: null
        },
        {
            icon: Clock,
            title: "Çalışma Saatleri",
            value: "09:00 - 18:00",
            description: "Hafta içi",
            href: null
        }
    ];

    const supportTypes = [
        {
            icon: MessageCircle,
            title: "Genel Sorular",
            description: "Ürün hakkında merak ettikleriniz",
            responseTime: "2-4 saat"
        },
        {
            icon: Headphones,
            title: "Teknik Destek",
            description: "Platform kullanımı ile ilgili yardım",
            responseTime: "1-2 saat"
        },
        {
            icon: Users,
            title: "Satış & Ortaklık",
            description: "Kurumsal satış ve iş birliği",
            responseTime: "4-8 saat"
        },
        {
            icon: FileText,
            title: "Hukuki Sorular",
            description: "KVKK, kullanım koşulları",
            responseTime: "24 saat"
        }
    ];

    const faqs = [
        {
            question: "Ne kadar sürede yanıt alırım?",
            answer: "Genellikle 24 saat içinde, acil durumlar için 2-4 saat içinde yanıt veriyoruz."
        },
        {
            question: "Telefon desteği var mı?",
            answer: "Şu anda e-posta üzerinden destek veriyoruz. Acil durumlar için telefon desteği mevcuttur."
        },
        {
            question: "Özel taleplerim için kimle görüşebilirim?",
            answer: "Kurumsal talepleriniz için info@artiklo.com adresinden bizimle iletişime geçebilirsiniz."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
            <div className="container mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <div className="mb-8">
                    <Breadcrumb />
                </div>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        İletişim
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Bizimle İletişime Geçin
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Sorularınızı yanıtlamak ve size yardımcı olmak için buradayız.
                        Herhangi bir konuda destek almak için aşağıdaki formu doldurun veya direkt iletişim bilgilerimizi kullanın.
                    </p>
                </div>

                {/* Contact Form & Info */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Mesaj Gönder
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Ad Soyad *
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Adınız ve soyadınız"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                E-posta *
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="ornek@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Konu *
                                        </label>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Mesajınızın konusu"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Mesaj *
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Mesajınızı buraya yazın..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full group"
                                        disabled={isSubmitting}
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                Mesajı Gönder
                                                <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-primary hover:underline font-medium block mb-1"
                                                    >
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <div className="font-medium text-foreground mb-1">{info.value}</div>
                                                )}
                                                <p className="text-sm text-muted-foreground">{info.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Support Types */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Destek Türleri</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            İhtiyacınıza göre uygun destek kanalını seçin
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{type.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {type.responseTime}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Sık Sorulan Sorular</h2>
                        <p className="text-lg text-muted-foreground">
                            İletişimle ilgili merak ettikleriniz
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-3 text-primary">{faq.question}</h3>
                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <CardContent className="p-8 text-center">
                        <div className="max-w-2xl mx-auto">
                            <CheckCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Size Nasıl Yardımcı Olabiliriz?
                            </h2>
                            <p className="text-lg opacity-90 mb-8">
                                Artiklo ekibi olarak sorularınızı yanıtlamak ve en iyi hizmeti sunmak için buradayız.
                                24 saat içinde size geri dönüş yapacağız.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    asChild
                                    className="group"
                                >
                                    <a href="mailto:info@artiklo.com">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Hemen E-posta Gönder
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white/20 text-white hover:bg-white/10"
                                    asChild
                                >
                                    <a href="/sss">
                                        SSS'leri İncele
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Hours Notice */}
                <div className="mt-12 text-center">
                    <Card className="max-w-2xl mx-auto bg-muted/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Çalışma Saatleri</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                <strong>Hafta içi:</strong> 09:00 - 18:00 |
                                <strong className="ml-2">Hafta sonu:</strong> E-posta desteği mevcut
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Mesaj gönderme saatinden bağımsız olarak en kısa sürede yanıt vermeye çalışıyoruz.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Iletisim;