import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
    Shield,
    FileText,
    Users,
    Lock,
    AlertCircle,
    CheckCircle,
    Database,
    Clock,
    Mail,
    Eye,
    Globe,
    ScrollText,
    ArrowRight,
    ExternalLink,
    UserCheck,
    Ban,
    AlertTriangle,
    Info,
    Phone,
    BookOpen,
    Cookie,
    Settings,
    Share,
    Trash2,
    Download,
    Edit,
    Key,
    Server,
    Monitor,
    Smartphone,
    Fingerprint
} from "lucide-react";

interface TableOfContentsItem {
    id: string;
    title: string;
    level: number;
}

const GizlilikPolitikasi = () => {
    const [activeSection, setActiveSection] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);

    const lastUpdated = "25 Temmuz 2024";
    const effectiveDate = "01 Ağustos 2024";

    const tableOfContents: TableOfContentsItem[] = useMemo(() => [
        { id: 'giris', title: 'Giriş ve Genel Bilgiler', level: 1 },
        { id: 'veri-toplama', title: 'Hangi Verileri Topluyoruz', level: 1 },
        { id: 'veri-kullanim', title: 'Verilerinizi Nasıl Kullanıyoruz', level: 1 },
        { id: 'veri-paylasim', title: 'Veri Paylaşımı ve Aktarımı', level: 1 },
        { id: 'veri-saklama', title: 'Veri Saklama ve Güvenlik', level: 1 },
        { id: 'cerezler', title: 'Çerezler ve Takip Teknolojileri', level: 1 },
        { id: 'kullanici-haklari', title: 'Kullanıcı Hakları ve Kontrol', level: 1 },
        { id: 'cocuk-gizlilik', title: 'Çocuk Gizliliği', level: 1 },
        { id: 'uluslararasi-transfer', title: 'Uluslararası Veri Transferi', level: 1 },
        { id: 'politika-degisiklikleri', title: 'Politika Değişiklikleri', level: 1 },
        { id: 'iletisim', title: 'Bizimle İletişime Geçin', level: 1 }
    ], []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);

            // Update active section based on scroll position
            const sections = tableOfContents.map(item => document.getElementById(item.id));
            const currentSection = sections.find(section => {
                if (!section) return false;
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tableOfContents]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
            <SEO
                title="Gizlilik Politikası"
                description="Artiklo Gizlilik Politikası - Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgiler."
                keywords="gizlilik politikası, kişisel veri koruma, veri güvenliği, KVKK uyum"
                type="article"
                publishedTime="2024-07-25T00:00:00Z"
                modifiedTime="2024-08-01T00:00:00Z"
            />

            {/* Scroll Progress Bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Breadcrumb />
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Table of Contents - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ScrollText className="h-5 w-5 text-primary" />
                                        İçindekiler
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {tableOfContents.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full text-left text-sm transition-colors p-2 rounded-md ${activeSection === item.id
                                                ? 'bg-primary text-primary-foreground font-medium'
                                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                } ${item.level === 2 ? 'pl-6' : ''}`}
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Info Card */}
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Okuma Süresi:</span>
                                        <span className="font-medium">8-10 dakika</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Son Güncelleme:</span>
                                        <span className="font-medium">{lastUpdated}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-muted-foreground">Yürürlük:</span>
                                        <span className="font-medium">{effectiveDate}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Header Section */}
                        <div className="mb-12 text-center">
                            <Badge variant="outline" className="mb-4 px-4 py-2">
                                <Shield className="h-4 w-4 mr-2" />
                                Gizlilik ve Güvenlik
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                <span className="text-primary">Gizlilik</span>
                                <span className="block">Politikası</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Kişisel verilerinizin gizliliği bizim için önemlidir. Bu politika,
                                verilerinizin nasıl toplandığı, kullanıldığı ve korunduğunu açıklar.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Son Güncelleme: {lastUpdated}
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Yürürlük: {effectiveDate}
                                </div>
                            </div>
                        </div>

                        {/* Privacy Promise Banner */}
                        <Card className="mb-8 border-l-4 border-l-green-500 bg-green-50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2 text-green-800">Gizlilik Taahhüdümüz</h3>
                                        <p className="text-green-700 mb-3">
                                            Kişisel verilerinizi korumak bizim önceliğimizdir. KVKK ve GDPR standartlarına
                                            tam uyum sağlayarak, verilerinizi en yüksek güvenlik standartlarıyla koruyoruz.
                                        </p>
                                        <div className="text-sm text-green-600 space-y-1">
                                            <p>✓ Verileriniz asla satılmaz veya kiralanmaz</p>
                                            <p>✓ Minimum veri toplama ilkesi</p>
                                            <p>✓ Şeffaf veri kullanımı</p>
                                            <p>✓ Güvenli şifreleme ile koruma</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Sections */}
                        <div className="space-y-8">
                            {/* Section 1: Giriş */}
                            <section id="giris">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>1. Giriş ve Genel Bilgiler</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="leading-relaxed">
                                            Bu Gizlilik Politikası, Artiklo platformunu kullandığınızda kişisel verilerinizin
                                            nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklar.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-3">Bu Politika Neden Önemli?</h4>
                                            <div className="grid gap-2 text-sm text-blue-700">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                    <span>Veri işleme süreçlerimiz hakkında şeffaflık sağlar</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                    <span>Haklarınızı ve kontrol seçeneklerinizi açıklar</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                    <span>KVKK ve GDPR uyumluluğumuzu gösterir</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 2: Veri Toplama */}
                            <section id="veri-toplama">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Database className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>2. Hangi Verileri Topluyoruz</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-6">
                                            {[
                                                {
                                                    icon: UserCheck,
                                                    title: 'Hesap Bilgileri',
                                                    items: [
                                                        'E-posta adresi (kimlik doğrulama için)',
                                                        'Şifrelenmiş parola bilgisi',
                                                        'Hesap oluşturma tarihi'
                                                    ]
                                                },
                                                {
                                                    icon: FileText,
                                                    title: 'Belge İşleme Verileri',
                                                    items: [
                                                        'Yüklenen belgelerin içeriği (geçici)',
                                                        'İşlem sonuçları ve özetler',
                                                        'İşlem tarihi ve süresi'
                                                    ]
                                                },
                                                {
                                                    icon: Monitor,
                                                    title: 'Teknik Veriler',
                                                    items: [
                                                        'IP adresi ve konum bilgisi',
                                                        'Cihaz ve tarayıcı bilgisi',
                                                        'Platform kullanım istatistikleri'
                                                    ]
                                                },
                                                {
                                                    icon: Settings,
                                                    title: 'Kullanım Verileri',
                                                    items: [
                                                        'Hangi özellikleri kullandığınız',
                                                        'Platform içi gezinme geçmişi',
                                                        'Hata ve performans logları'
                                                    ]
                                                }
                                            ].map((category, index) => (
                                                <div key={index} className="bg-muted/30 rounded-lg p-4">
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                        <category.icon className="h-5 w-5 text-primary" />
                                                        {category.title}
                                                    </h4>
                                                    <ul className="space-y-1 text-sm">
                                                        {category.items.map((item, itemIndex) => (
                                                            <li key={itemIndex} className="flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 3: Veri Kullanımı */}
                            <section id="veri-kullanim">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Settings className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>3. Verilerinizi Nasıl Kullanıyoruz</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="leading-relaxed">
                                            Topladığımız kişisel veriler yalnızca belirli, meşru ve şeffaf amaçlar için kullanılır:
                                        </p>
                                        <div className="grid gap-4">
                                            {[
                                                {
                                                    icon: Key,
                                                    title: 'Hizmet Sağlama',
                                                    desc: 'Platform hizmetlerini sunmak, belge analizi yapmak ve kullanıcı deneyimi sağlamak'
                                                },
                                                {
                                                    icon: Shield,
                                                    title: 'Güvenlik ve Koruma',
                                                    desc: 'Hesabınızı korumak, dolandırıcılığı önlemek ve güvenlik ihlallerini tespit etmek'
                                                },
                                                {
                                                    icon: Eye,
                                                    title: 'Hizmet İyileştirme',
                                                    desc: 'Platform performansını analiz etmek ve kullanıcı deneyimini geliştirmek'
                                                },
                                                {
                                                    icon: Mail,
                                                    title: 'İletişim',
                                                    desc: 'Önemli bildirimleri göndermek ve kullanıcı desteği sağlamak'
                                                }
                                            ].map((purpose, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <purpose.icon className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-blue-800">{purpose.title}</h5>
                                                        <p className="text-sm text-blue-700">{purpose.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 4: Veri Paylaşımı */}
                            <section id="veri-paylasim">
                                <Card className="border-l-4 border-l-orange-500">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                <Share className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <span>4. Veri Paylaşımı ve Aktarımı</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                                <Ban className="h-5 w-5" />
                                                ÖNEMLİ: Verilerinizi ASLA satmıyoruz!
                                            </h4>
                                            <p className="text-orange-700 text-sm">
                                                Kişisel verileriniz hiçbir şekilde üçüncü taraflara satılmaz, kiralanmaz veya
                                                ticari amaçlarla paylaşılmaz.
                                            </p>
                                        </div>
                                        <p className="leading-relaxed">
                                            Verilerinizi yalnızca aşağıdaki sınırlı durumlarda paylaşabiliriz:
                                        </p>
                                        <div className="space-y-3">
                                            {[
                                                'Yasal zorunluluklar (mahkeme kararı, resmi talep)',
                                                'Platform güvenliğini sağlayan teknik servis sağlayıcılar',
                                                'Veri işleme hizmetleri (şifreli ve güvenli)',
                                                'Kullanıcının açık rızası ile'
                                            ].map((condition, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">{condition}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 5: Veri Saklama */}
                            <section id="veri-saklama">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Server className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>5. Veri Saklama ve Güvenlik</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                                    <Clock className="h-5 w-5" />
                                                    Saklama Süreleri
                                                </h4>
                                                <div className="space-y-2 text-sm text-green-700">
                                                    <div className="flex justify-between">
                                                        <span>Yüklenen belgeler:</span>
                                                        <span className="font-medium">İşlem sonrası silinir</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Hesap bilgileri:</span>
                                                        <span className="font-medium">Hesap aktif olduğu sürece</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Log kayıtları:</span>
                                                        <span className="font-medium">90 gün</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                    <Lock className="h-5 w-5" />
                                                    Güvenlik Önlemleri
                                                </h4>
                                                <div className="space-y-2 text-sm text-blue-700">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>256-bit SSL şifreleme</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Düzenli güvenlik denetimleri</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Erişim kontrolü ve izleme</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Güvenli sunucu altyapısı</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 6: Çerezler */}
                            <section id="cerezler">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Cookie className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>6. Çerezler ve Takip Teknolojileri</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="leading-relaxed">
                                            Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler ve benzer teknolojiler kullanır.
                                        </p>
                                        <div className="grid gap-4">
                                            {[
                                                {
                                                    icon: Key,
                                                    title: 'Gerekli Çerezler',
                                                    desc: 'Platform işlevselliği için zorunlu çerezler (oturum yönetimi, güvenlik)',
                                                    color: 'red'
                                                },
                                                {
                                                    icon: Settings,
                                                    title: 'İşlevsellik Çerezleri',
                                                    desc: 'Kullanıcı tercihlerini hatırlamak ve deneyimi kişiselleştirmek',
                                                    color: 'blue'
                                                },
                                                {
                                                    icon: Eye,
                                                    title: 'Analitik Çerezler',
                                                    desc: 'Platform kullanımını analiz etmek ve performansı iyileştirmek',
                                                    color: 'green'
                                                }
                                            ].map((cookie, index) => (
                                                <div key={index} className={`bg-${cookie.color}-50 border border-${cookie.color}-200 rounded-lg p-4`}>
                                                    <h4 className={`font-semibold text-${cookie.color}-800 mb-2 flex items-center gap-2`}>
                                                        <cookie.icon className="h-4 w-4" />
                                                        {cookie.title}
                                                    </h4>
                                                    <p className={`text-sm text-${cookie.color}-700`}>{cookie.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 7: Kullanıcı Hakları */}
                            <section id="kullanici-haklari">
                                <Card className="border-l-4 border-l-purple-500">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Fingerprint className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <span>7. Kullanıcı Hakları ve Kontrol</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="leading-relaxed">
                                            KVKK ve GDPR kapsamında sahip olduğunuz haklar:
                                        </p>
                                        <div className="grid gap-4">
                                            {[
                                                {
                                                    icon: Eye,
                                                    title: 'Erişim Hakkı',
                                                    desc: 'Hangi kişisel verilerinizin işlendiğini öğrenme hakkı',
                                                    action: 'Veri raporunu talep edin'
                                                },
                                                {
                                                    icon: Edit,
                                                    title: 'Düzeltme Hakkı',
                                                    desc: 'Yanlış veya eksik verilerin düzeltilmesini isteme hakkı',
                                                    action: 'Düzeltme talebinde bulunun'
                                                },
                                                {
                                                    icon: Trash2,
                                                    title: 'Silme Hakkı',
                                                    desc: 'Kişisel verilerinizin silinmesini isteme hakkı',
                                                    action: 'Hesabınızı kapatın'
                                                },
                                                {
                                                    icon: Ban,
                                                    title: 'İşleme İtiraz Hakkı',
                                                    desc: 'Belirli veri işleme faaliyetlerine itiraz etme hakkı',
                                                    action: 'İtirazınızı bildirin'
                                                },
                                                {
                                                    icon: Download,
                                                    title: 'Veri Taşınabilirlik Hakkı',
                                                    desc: 'Verilerinizi başka bir platforma aktarma hakkı',
                                                    action: 'Veri dışa aktarımı yapın'
                                                }
                                            ].map((right, index) => (
                                                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                            <right.icon className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-purple-800 mb-1">{right.title}</h5>
                                                            <p className="text-sm text-purple-700 mb-2">{right.desc}</p>
                                                            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                                                {right.action}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 8: Çocuk Gizliliği */}
                            <section id="cocuk-gizlilik">
                                <Card className="border-l-4 border-l-red-500">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-red-600" />
                                            </div>
                                            <span>8. Çocuk Gizliliği</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-red-800 font-medium mb-2">18 Yaş Sınırı</p>
                                            <p className="text-red-700 text-sm">
                                                Platformumuz 18 yaş altı kişiler için tasarlanmamıştır. 18 yaş altı kullanıcılardan
                                                bilerek kişisel veri toplamamız. Eğer 18 yaş altı bir kişinin veri sağladığını
                                                öğrenirsek, bu verileri derhal sileriz.
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Eğer 18 yaş altı bir çocuğun platformu kullandığını düşünüyorsanız,
                                            lütfen bizimle iletişime geçin.
                                        </p>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 9: Uluslararası Transfer */}
                            <section id="uluslararasi-transfer">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>9. Uluslararası Veri Transferi</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="leading-relaxed">
                                            Verileriniz öncelikle Türkiye'de bulunan sunucularımızda işlenir.
                                            Bazı teknik hizmetler için veriler güvenli bir şekilde AB ülkelerine aktarılabilir.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-2">Transfer Güvenceleri:</h4>
                                            <div className="space-y-1 text-sm text-blue-700">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>GDPR uyumlu ülkelere transfer</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Standart sözleşme hükümleri</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Şifreli veri transferi</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 10: Politika Değişiklikleri */}
                            <section id="politika-degisiklikleri">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>10. Politika Değişiklikleri</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="leading-relaxed mb-4">
                                            Bu Gizlilik Politikası'nda değişiklik yapabiliriz. Önemli değişiklikleri
                                            platformumuzda duyuracak ve e-posta ile bilgilendireceğiz.
                                        </p>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="text-sm text-yellow-800">
                                                <Info className="h-4 w-4 inline mr-2" />
                                                <strong>Önerı:</strong> Bu politikayı düzenli olarak kontrol ederek güncellemelerden haberdar olun.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 11: İletişim */}
                            <section id="iletisim">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <span>11. Bizimle İletişime Geçin</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="leading-relaxed">
                                            Gizlilik politikamız hakkında sorularınız veya verilerinizle ilgili talebiniz için:
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-primary" />
                                                    Veri Koruma Sorumlusu
                                                </h4>
                                                <a
                                                    href="mailto:privacy@artiklo.com"
                                                    className="text-primary hover:underline"
                                                >
                                                    privacy@artiklo.com
                                                </a>
                                            </div>
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-primary" />
                                                    Genel İletişim
                                                </h4>
                                                <a
                                                    href="mailto:info@artiklo.com"
                                                    className="text-primary hover:underline"
                                                >
                                                    info@artiklo.com
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                        </div>

                        {/* Footer CTA */}
                        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5">
                            <CardContent className="p-8 text-center">
                                <div className="max-w-2xl mx-auto">
                                    <h3 className="text-2xl font-bold mb-4">Gizlilik Hakkında Sorularınız mı Var?</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Kişisel verilerinizin korunması hakkında merak ettiklerinizi
                                        öğrenmek için bizimle iletişime geçebilirsiniz.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button asChild>
                                            <a href="mailto:privacy@artiklo.com">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Veri Koruma Ekibimiz
                                            </a>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <a href="/kvkk-aydinlatma">
                                                KVKK Aydınlatma Metni
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GizlilikPolitikasi;