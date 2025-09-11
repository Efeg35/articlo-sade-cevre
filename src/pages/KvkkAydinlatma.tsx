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
  Smartphone,
  Clock,
  Mail,
  Eye,
  Database,
  Globe,
  ScrollText,
  ArrowRight,
  ExternalLink,
  Download,
  Phone
} from "lucide-react";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const KvkkAydinlatma = () => {
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastUpdated = "25 Temmuz 2024";
  const effectiveDate = "01 Ağustos 2024";

  const tableOfContents: TableOfContentsItem[] = useMemo(() => [
    { id: 'veri-sorumlusu', title: 'Veri Sorumlusu', level: 1 },
    { id: 'isleme-amaclari', title: 'Kişisel Verilerin İşlenme Amaçları', level: 1 },
    { id: 'mobil-uygulama', title: 'Mobil Uygulama Veri İşleme Politikası', level: 2 },
    { id: 'veri-turleri', title: 'İşlenen Kişisel Veri Türleri', level: 1 },
    { id: 'toplama-yontemi', title: 'Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi', level: 1 },
    { id: 'veri-aktarimi', title: 'Kişisel Verilerin Aktarılması', level: 1 },
    { id: 'veri-haklari', title: 'Veri Sahibinin Hakları', level: 1 },
    { id: 'cerez-politikasi', title: 'Çerez Politikası', level: 1 },
    { id: 'iletisim', title: 'İletişim', level: 1 }
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
        title="KVKK Aydınlatma Metni"
        description="Artiklo KVKK Aydınlatma Metni - Kişisel verilerinizin korunması hakkında detaylı bilgiler. 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca hazırlanmıştır."
        keywords="KVKK, kişisel veri korunması, aydınlatma metni, veri güvenliği, gizlilik"
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
                Yasal Belge
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Kişisel Verilerin Korunması Hakkında
                <span className="block text-primary">Aydınlatma Metni</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca,
                kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
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

            {/* Important Notice */}
            <Card className="mb-8 border-l-4 border-l-primary bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Önemli Bilgilendirme</h3>
                    <p className="text-muted-foreground">
                      Bu aydınlatma metni, Artiklo platformunu kullanırken kişisel verilerinizin nasıl işlendiği,
                      hangi amaçlarla kullanıldığı ve haklarınızın neler olduğu hakkında detaylı bilgi vermektedir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1: Veri Sorumlusu */}
              <section id="veri-sorumlusu">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span>1. Veri Sorumlusu</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      KVKK uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>Artiklo</strong> tarafından
                      aşağıda açıklanan kapsamda işlenebilecektir.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">İletişim Bilgileri:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>E-posta: info@artiklo.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>Adres: İstanbul, Türkiye</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2: İşlenme Amaçları */}
              <section id="isleme-amaclari">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>2. Kişisel Verilerin İşlenme Amaçları</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Toplanan kişisel verileriniz, aşağıdaki amaçlar doğrultusunda işlenmektedir:
                    </p>
                    <div className="grid gap-3">
                      {[
                        'Hizmetlerimizi sunabilmek ve platforma erişiminizi sağlamak (hesap oluşturma, giriş yapma)',
                        'Yüklediğiniz belgeleri yapay zeka ile analiz ederek sadeleştirme hizmetini gerçekleştirmek',
                        'Platformun performansını ve güvenliğini sağlamak, iyileştirmek',
                        'Gerekli durumlarda sizinle iletişim kurmak (hesap doğrulama vb.)',
                        'Yasal yükümlülüklerimizi yerine getirmek'
                      ].map((purpose, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{purpose}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2.1: Mobil Uygulama */}
              <section id="mobil-uygulama">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>2.1. Mobil Uygulama Veri İşleme Politikası</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        iOS/Android Uygulama Özel Koşulları
                      </h4>
                      <div className="grid gap-4">
                        {[
                          {
                            icon: Eye,
                            title: 'Cihaz İzinleri',
                            desc: 'Kamera ve dosya erişimi izinleri yalnızca belge yükleme işlemi için kullanılır.'
                          },
                          {
                            icon: Database,
                            title: 'Veri Yerelliği',
                            desc: 'Hiçbir kişisel veri cihazda kalıcı olarak saklanmaz.'
                          },
                          {
                            icon: Clock,
                            title: 'Anlık İşleme',
                            desc: 'Yüklenen belgeler anlık olarak işlenir ve hemen silinir.'
                          },
                          {
                            icon: Shield,
                            title: 'Ağ Güvenliği',
                            desc: 'Tüm veri transferleri HTTPS ile şifrelenir.'
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-blue-800">{item.title}</h5>
                              <p className="text-sm text-blue-700">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3: Veri Türleri */}
              <section id="veri-turleri">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <span>3. İşlenen Kişisel Veri Türleri</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-green-700">Kimlik ve İletişim Bilgileri</h4>
                        <p className="text-sm text-muted-foreground">
                          E-posta adresiniz, şifreniz (şifrelenmiş olarak)
                        </p>
                      </div>
                      <div className="border rounded-lg p-4 border-l-4 border-l-red-500">
                        <h4 className="font-semibold mb-2 text-red-700">İçerik Verileri</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Hizmetin sağlanması amacıyla platforma yüklediğiniz metin, dosya veya görseller.
                        </p>
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-red-800">
                            ⚠️ ÖNEMLİ: Bu veriler, işleme anı dışında KESİNLİKLE sunucularımızda saklanmaz,
                            kaydedilmez ve işlem bittikten sonra derhal ve kalıcı olarak silinir.
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-blue-700">İşlem Güvenliği Bilgileri</h4>
                        <p className="text-sm text-muted-foreground">
                          IP adresi, tarayıcı bilgileri, çerezler
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4: Toplama Yöntemi */}
              <section id="toplama-yontemi">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed mb-4">
                      Kişisel verileriniz, platforma kayıt olmanız, form doldurmanız veya belge yüklemeniz gibi
                      otomatik yöntemlerle toplanır.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Hukuki Dayanaklar (KVKK Madde 5):</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</li>
                        <li>• Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5: Veri Aktarımı */}
              <section id="veri-aktarimi">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <span>5. Kişisel Verilerin Aktarılması</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Kişisel verileriniz, yasal zorunluluklar dışında hiçbir şekilde üçüncü kişi veya kurumlarla paylaşılmaz.
                      Yüklediğiniz belgeler, analiz edilmesi için yalnızca altyapı sağlayıcımızın (Google Gemini API) yapay zeka
                      sistemine güvenli bir bağlantı üzerinden gönderilir.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Veri Güvenliği Taahhütlerimiz
                      </h4>
                      <div className="grid gap-2 text-sm text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Google Gemini API ile veri paylaşımı yalnızca analiz için geçicidir</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>API sağlayıcısı verilerinizi saklamaz (Google taahhüdü)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Veri transferi AES-256 şifreleme ile korunur</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>AB GDPR ve Türkiye KVKK standartlarına uygunluk</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6: Veri Hakları */}
              <section id="veri-haklari">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <span>6. Veri Sahibinin Hakları (KVKK Madde 11)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Veri sahibi olarak, KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                    </p>
                    <div className="grid gap-3">
                      {[
                        'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                        'İşlenmişse buna ilişkin bilgi talep etme',
                        'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
                        'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme',
                        'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
                        'KVKK\'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
                        'Verilerinizin aktarıldığı üçüncü kişilere yukarıdaki işlemlerin bildirilmesini isteme',
                        'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
                        'Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme'
                      ].map((right, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm">{right}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 7: Çerez Politikası */}
              <section id="cerez-politikasi">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <span>7. Çerez Politikası</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">
                      Platformumuz, kullanıcı deneyimini iyileştirmek ve hizmetin temel işlevlerini
                      (oturum yönetimi gibi) sağlamak amacıyla çerezler kullanmaktadır. Bu çerezler,
                      kişisel veri toplamaz. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 8: İletişim */}
              <section id="iletisim">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <span>8. İletişim</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          E-posta
                        </h4>
                        <a
                          href="mailto:info@artiklo.com"
                          className="text-primary hover:underline"
                        >
                          info@artiklo.com
                        </a>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Telefon
                        </h4>
                        <span>+90 (xxx) xxx xx xx</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Not:</strong> Talepleriniz en geç 30 gün içinde cevaplanacaktır.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Footer CTA */}
            <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Sorularınız mı var?</h3>
                  <p className="text-muted-foreground mb-6">
                    KVKK kapsamındaki haklarınız veya kişisel veri işleme politikamız hakkında
                    daha fazla bilgi almak için bizimle iletişime geçin.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <a href="mailto:info@artiklo.com">
                        <Mail className="h-4 w-4 mr-2" />
                        Bize Ulaşın
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/iletisim">
                        İletişim Sayfası
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

export default KvkkAydinlatma;