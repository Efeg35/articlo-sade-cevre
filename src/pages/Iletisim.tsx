import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
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
    ArrowRight,
    Globe,
    Timer,
    Star,
    Shield,
    Heart,
    Sparkles,
    Award,
    Target
} from "lucide-react";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
}

const Iletisim = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'genel'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Mesajınız Başarıyla Alındı! ✨",
            description: "En geç 24 saat içinde size dönüş yapacağız. Teşekkür ederiz!",
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            category: 'genel'
        });

        setIsSubmitting(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "E-posta Desteği",
            value: "info@artiklo.com",
            description: "7/24 e-posta desteği",
            href: "mailto:info@artiklo.com",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Phone,
            title: "Telefon Hattı",
            value: "0850 XXX XX XX",
            description: "Hafta içi 09:00-18:00",
            href: "tel:+90850xxxxxxx",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: MapPin,
            title: "Merkez Ofis",
            value: "Maslak, İstanbul",
            description: "Türkiye'nin teknoloji merkezi",
            href: "https://maps.google.com",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: Globe,
            title: "Online Destek",
            value: "artiklo.com",
            description: "Canlı destek yakında",
            href: "https://artiklo.com",
            color: "bg-orange-100 text-orange-600"
        }
    ];

    const supportTypes = [
        {
            icon: MessageCircle,
            title: "Genel Sorular",
            description: "Ürün özellikleri, kullanım rehberi",
            responseTime: "2-4 saat",
            priority: "Orta"
        },
        {
            icon: Headphones,
            title: "Teknik Destek",
            description: "Platform kullanımı, hata bildirimi",
            responseTime: "1-2 saat",
            priority: "Yüksek"
        },
        {
            icon: Users,
            title: "Satış & Ortaklık",
            description: "Kurumsal satış, iş geliştirme",
            responseTime: "4-8 saat",
            priority: "Orta"
        },
        {
            icon: FileText,
            title: "Hukuki & Gizlilik",
            description: "KVKK, sözleşmeler, gizlilik",
            responseTime: "12-24 saat",
            priority: "Düşük"
        }
    ];

    const stats = [
        {
            icon: Timer,
            number: "< 4 saat",
            label: "Ortalama Yanıt",
            description: "Hızlı destek garantisi",
            gradient: "from-blue-400 to-cyan-400"
        },
        {
            icon: Star,
            number: "%98",
            label: "Memnuniyet",
            description: "Kullanıcı değerlendirmeleri",
            gradient: "from-yellow-400 to-orange-400"
        },
        {
            icon: Shield,
            number: "7/24",
            label: "E-posta Desteği",
            description: "Kesintisiz hizmet",
            gradient: "from-green-400 to-emerald-400"
        },
        {
            icon: Heart,
            number: "5000+",
            label: "Mutlu Kullanıcı",
            description: "Çözülen sorunlar",
            gradient: "from-pink-400 to-rose-400"
        }
    ];

    const quickActions = [
        {
            icon: FileText,
            title: "SSS'leri İncele",
            description: "En sık sorulan sorular",
            href: "/sss",
            badge: "Hızlı Çözüm"
        },
        {
            icon: MessageCircle,
            title: "Canlı Destek",
            description: "Gerçek zamanlı yardım",
            href: "#",
            badge: "Yakında"
        },
        {
            icon: Users,
            title: "Topluluk",
            description: "Kullanıcı forumları",
            href: "#",
            badge: "Beta"
        }
    ];

    const workingHours = [
        { day: "Pazartesi - Cuma", hours: "09:00 - 18:00", status: "active" },
        { day: "Cumartesi", hours: "10:00 - 16:00", status: "limited" },
        { day: "Pazar", hours: "E-posta desteği", status: "email" }
    ];

    const testimonials = [
        {
            name: "Ahmet K.",
            role: "Avukat",
            message: "Destek ekibi çok yardımcı. Soruma 2 saat içinde detaylı cevap aldım.",
            rating: 5
        },
        {
            name: "Elif Y.",
            role: "Girişimci",
            message: "Teknik sorunumu hızlıca çözdüler. Kesinlikle tavsiye ederim.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background pt-24">
            <SEO
                title="İletişim - Bize Ulaşın | Artiklo"
                description="Artiklo destek ekibi ile iletişime geçin. Belge analizi, dilekçe oluşturma, 7/24 e-posta desteği, teknik yardım ve tüm sorularınız için hızlı çözümler."
                keywords="iletişim, destek, yardım, Artiklo support, teknik destek, müşteri hizmetleri, belge analizi, dilekçe oluşturma"
                type="website"
            />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Breadcrumb />
                </div>

                {/* Header Section */}
                <div className="text-center mb-20">
                    <Badge variant="outline" className="mb-6 px-6 py-2 text-base">
                        <Heart className="h-4 w-4 mr-2" />
                        Size Yardımcı Olmak İçin Buradayız
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        <span className="text-primary">Bizimle</span>
                        <span className="block">İletişime Geçin</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                        Sorularınızı yanıtlamak, size yardımcı olmak ve en iyi hizmeti sunmak için buradayız.
                        Hangi konuda destek isterseniz isteyin, uzman ekibimiz sizinle.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-primary" />
                            <span>4 saat içinde yanıt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span>7/24 e-posta desteği</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            <span>%98 memnuniyet oranı</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                                <CardContent className="p-8 relative">
                                    <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                                    <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Contact Form & Info */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Send className="h-5 w-5 text-primary" />
                                    </div>
                                    Mesaj Gönderin
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Sorularınızı detaylı şekilde yazın, size en uygun çözümü sunalım.
                                </p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-foreground">
                                                Ad Soyad *
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Adınız ve soyadınız"
                                                className="h-12"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-foreground">
                                                E-posta Adresi *
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="ornek@email.com"
                                                className="h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-foreground">
                                                Konu Kategorisi *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full h-12 px-3 border border-input bg-background rounded-md text-sm"
                                                required
                                            >
                                                <option value="genel">Genel Sorular</option>
                                                <option value="teknik">Teknik Destek</option>
                                                <option value="satis">Satış & Ortaklık</option>
                                                <option value="hukuki">Hukuki & Gizlilik</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-3 text-foreground">
                                                Konu Başlığı *
                                            </label>
                                            <Input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="Mesajınızın konusu"
                                                className="h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-3 text-foreground">
                                            Mesajınız *
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Sorununuzu veya talebinizi detaylı şekilde açıklayın..."
                                            rows={6}
                                            className="resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            <Shield className="h-4 w-4 inline mr-2" />
                                            Tüm mesajlarınız güvenli ve gizli tutulur. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full group h-14 text-lg font-semibold"
                                        disabled={isSubmitting}
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                                                Mesajınız Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5 mr-3" />
                                                Mesajı Gönder
                                                <Send className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Methods */}
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-primary hover:underline font-medium block mb-1 transition-colors"
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

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Hızlı Aksiyonlar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={action.href}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                        >
                                            <Icon className="h-5 w-5 text-primary" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{action.title}</div>
                                                <div className="text-xs text-muted-foreground">{action.description}</div>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {action.badge}
                                            </Badge>
                                        </a>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Working Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="h-5 w-5" />
                                    Çalışma Saatleri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {workingHours.map((schedule, index) => (
                                    <div key={index} className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium">{schedule.day}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                                            <div className={`w-2 h-2 rounded-full ${schedule.status === 'active' ? 'bg-green-500' :
                                                schedule.status === 'limited' ? 'bg-yellow-500' : 'bg-gray-400'
                                                }`} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Support Types */}
                <div className="mb-16 max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 px-4 py-2">
                            <Target className="h-4 w-4 mr-2" />
                            Uzmanlaşmış Destek
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Destek Türleri</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Her ihtiyacınız için özel destek kanalları ve uzman ekiplerimiz
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 group border-0 bg-gradient-to-br from-white to-secondary/20">
                                    <CardContent className="p-8">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                                            <Icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{type.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{type.description}</p>

                                        <div className="space-y-2">
                                            <Badge variant="secondary" className="text-xs">
                                                <Timer className="h-3 w-3 mr-1" />
                                                {type.responseTime}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground">
                                                Öncelik: <span className="font-medium">{type.priority}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Kullanıcılarımız Ne Diyor?</h2>
                        <p className="text-lg text-muted-foreground">
                            Destek kalitemizle ilgili gerçek kullanıcı deneyimleri
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-4 italic">"{testimonial.message}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{testimonial.name}</div>
                                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20 bg-white/5"></div>
                    <CardContent className="p-12 text-center relative">
                        <div className="max-w-3xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                                <Award className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Size Nasıl Yardımcı Olabiliriz?
                            </h2>
                            <p className="text-xl opacity-90 mb-10 leading-relaxed">
                                Artiklo ekibi olarak her türlü sorunuzu çözmeye ve size en iyi deneyimi yaşatmaya odaklıyız.
                                Uzman destek ekibimiz 7/24 hizmetinizde.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    asChild
                                    className="group font-semibold px-8 h-14"
                                >
                                    <a href="mailto:info@artiklo.com">
                                        <Mail className="h-5 w-5 mr-3" />
                                        Hemen E-posta Gönderin
                                        <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-14"
                                    asChild
                                >
                                    <a href="/sss">
                                        <FileText className="h-5 w-5 mr-3" />
                                        SSS'leri İnceleyin
                                    </a>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-90">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>24 saat yanıt garantisi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Güvenli iletişim</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    <span>Türkçe destek</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Iletisim;