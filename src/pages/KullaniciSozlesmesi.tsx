import React, { useEffect, useState } from 'react';
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
  Scale,
  UserCheck,
  Ban,
  AlertTriangle,
  Info,
  Phone,
  BookOpen
} from "lucide-react";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const KullaniciSozlesmesi = () => {
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastUpdated = "25 Temmuz 2024";
  const effectiveDate = "01 Ağustos 2024";

  const tableOfContents: TableOfContentsItem[] = [
    { id: 'taraflar', title: 'Taraflar ve Tanımlar', level: 1 },
    { id: 'hizmet-tanimi', title: 'Hizmetin Tanımı ve Kapsamı', level: 1 },
    { id: 'sorumluluk-reddi', title: 'Sorumluluğun Reddi ve Hukuki Uyarı', level: 1 },
    { id: 'mobil-kosullar', title: 'Mobil Uygulama Özel Koşulları', level: 2 },
    { id: 'kullanici-yukumlulukler', title: 'Kullanıcı Yükümlülükleri', level: 1 },
    { id: 'gizlilik-guvenlik', title: 'Gizlilik ve Veri Güvenliği', level: 1 },
    { id: 'fikri-mulkiyet', title: 'Fikri Mülkiyet', level: 1 },
    { id: 'hizmet-askiya-alma', title: 'Hizmetin Askıya Alınması ve Fesih', level: 1 },
    { id: 'sozlesme-degisiklikleri', title: 'Sözleşme Değişiklikleri', level: 1 },
    { id: 'uygulanacak-hukuk', title: 'Uygulanacak Hukuk ve Yetkili Mahkeme', level: 1 },
    { id: 'iletisim', title: 'İletişim', level: 1 }
  ];

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
  }, []);

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
        title="Kullanıcı Sözleşmesi"
        description="Artiklo Kullanıcı Sözleşmesi - Platform kullanım şartları, hakları ve yükümlülükleri hakkında detaylı bilgiler."
        keywords="kullanıcı sözleşmesi, hizmet şartları, platform kuralları, yasal şartlar"
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
                    <span className="font-medium">10-12 dakika</span>
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
                <BookOpen className="h-4 w-4 mr-2" />
                Yasal Sözleşme
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-primary">Artiklo</span>
                <span className="block">Kullanıcı Sözleşmesi</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Bu sözleşme, Artiklo platformunu kullanmadan önce dikkatlice okumanız gereken
                kullanım şartları, hakları ve yükümlülükleri içermektedir.
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

            {/* Critical Warning */}
            <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-red-800">Kritik Uyarı</h3>
                    <p className="text-red-700 mb-3">
                      Bu platformu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
                      Artiklo hiçbir şekilde hukuki danışmanlık hizmeti sağlamaz.
                    </p>
                    <div className="text-sm text-red-600 space-y-1">
                      <p>• Yapay zeka teknolojisi kullanır ve hata yapabilir</p>
                      <p>• Yasal işlemler için mutlaka avukata danışın</p>
                      <p>• Resmi belge niteliği taşımaz</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1: Taraflar */}
              <section id="taraflar">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span>1. Taraflar ve Tanımlar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Bu sözleşme, <strong>"Artiklo"</strong> (bundan sonra "Hizmet Sağlayıcı" veya "Platform" olarak anılacaktır)
                      ile Artiklo platformunu kullanan <strong>"Kullanıcı"</strong> arasında akdedilmiştir.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Scale className="h-4 w-4 text-primary" />
                          Hizmet Sağlayıcı
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Artiklo platformu ve ilgili tüm hizmetlerin sahibi
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          Kullanıcı
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Platformu kullanan gerçek veya tüzel kişi
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2: Hizmet Tanımı */}
              <section id="hizmet-tanimi">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>2. Hizmetin Tanımı ve Kapsamı</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Artiklo, kullanıcılar tarafından yüklenen hukuki ve bürokratik metinleri yapay zeka teknolojisi
                      kullanarak analiz eden ve bu metinleri daha anlaşılır, sadeleştirilmiş bir dilde özetleyen bir platformdur.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Hizmet Özellikleri:</h4>
                      <div className="grid gap-2 text-sm text-blue-700">
                        {[
                          'Hukuki metinlerin sadeleştirilmesi',
                          'Ana noktaların vurgulanması',
                          'Anlaşılır dilde özet çıkarılması',
                          'Yapay zeka destekli analiz'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3: Sorumluluk Reddi */}
              <section id="sorumluluk-reddi">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <span>3. Sorumluluğun Reddi ve Hukuki Uyarı</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6">
                      <h4 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
                        <Ban className="h-5 w-5" />
                        ÖNEMLİ: Bu uygulama hiçbir şekilde hukuki danışmanlık hizmeti sağlamaz
                      </h4>
                      <div className="grid gap-4">
                        {[
                          {
                            icon: AlertCircle,
                            title: 'Yapay Zeka Sınırlamaları',
                            desc: 'Bu platform AI teknolojisi kullanır ve hata yapabilir, yanlış veya eksik bilgi üretebilir.'
                          },
                          {
                            icon: Ban,
                            title: 'Hukuki Geçerlik Yok',
                            desc: 'Üretilen içerikler hiçbir şekilde yasal belge niteliği taşımaz.'
                          },
                          {
                            icon: Users,
                            title: 'Profesyonel Destek Gerekli',
                            desc: 'Herhangi bir yasal işlem yapmadan önce MUTLAKA avukata danışın.'
                          },
                          {
                            icon: Shield,
                            title: 'Resmi İşlemler',
                            desc: 'Mahkeme, icra, vergi dairesi gibi resmi işlemlerde kullanmayın.'
                          },
                          {
                            icon: AlertTriangle,
                            title: 'Tam Sorumluluk Reddi',
                            desc: 'Bu uygulamanın kullanımından doğacak tüm riskler kullanıcıya aittir.'
                          }
                        ].map((warning, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                              <warning.icon className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-red-800">{warning.title}</h5>
                              <p className="text-sm text-red-700">{warning.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3.1: Mobil Koşullar */}
              <section id="mobil-kosullar">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>3.1. Mobil Uygulama Özel Koşulları</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {[
                        {
                          icon: UserCheck,
                          title: 'Yaş Sınırı',
                          desc: 'Bu uygulama 18 yaş ve üzeri kullanıcılar içindir.'
                        },
                        {
                          icon: Eye,
                          title: 'Cihaz İzinleri',
                          desc: 'Kamera, dosya erişimi gibi izinler yalnızca belge yükleme için kullanılır.'
                        },
                        {
                          icon: Globe,
                          title: 'İnternet Bağlantısı',
                          desc: 'Uygulama internet bağlantısı gerektirir, çevrimdışı çalışmaz.'
                        },
                        {
                          icon: CheckCircle,
                          title: 'App Store Uyumluluğu',
                          desc: 'Apple App Store kurallarına uygun olarak geliştirilmiştir.'
                        }
                      ].map((condition, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <condition.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-800">{condition.title}</h5>
                            <p className="text-sm text-blue-700">{condition.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4: Kullanıcı Yükümlülükleri */}
              <section id="kullanici-yukumlulukler">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <span>4. Kullanıcı Yükümlülükleri</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        'Kullanıcı, platforma yüklediği belgelerin içeriğinden ve bu belgeleri işleme hakkına sahip olduğundan tek başına sorumludur',
                        'Kullanıcı, platformu yasa dışı, ahlaka aykırı veya üçüncü şahısların haklarını (telif hakkı, mahremiyet vb.) ihlal edecek şekilde kullanamaz',
                        'Kullanıcı, hesap bilgilerinin (e-posta, şifre) güvenliğinden kendisi sorumludur',
                        'Kullanıcı, 18 yaşından büyük olduğunu veya yasal vasisinin onayını aldığını beyan eder'
                      ].map((obligation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm">{obligation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5: Gizlilik */}
              <section id="gizlilik-guvenlik">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <span>5. Gizlilik ve Veri Güvenliği</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Kullanıcı gizliliği bizim için esastır. Yüklenen belgeler, yalnızca yapay zeka tarafından işlenmek
                      amacıyla geçici olarak kullanılır ve işlem tamamlandıktan sonra sistemlerimizden kalıcı olarak silinir.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Gizlilik Taahhütlerimiz
                      </h4>
                      <div className="grid gap-2 text-sm text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Belgeler hiçbir şekilde saklanmaz veya depolanmaz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Üçüncü taraflarla paylaşılmaz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>İşlem sonrası otomatik silme</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Şifreli veri transferi</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Detaylı bilgi için lütfen{' '}
                      <a href="/kvkk-aydinlatma" className="text-primary hover:underline">
                        KVKK Aydınlatma Metni'mizi
                      </a>{' '}
                      inceleyiniz.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6: Fikri Mülkiyet */}
              <section id="fikri-mulkiyet">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>6. Fikri Mülkiyet</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-primary">Platform Hakları</h4>
                        <p className="text-sm text-muted-foreground">
                          Artiklo platformunun kendisi, tasarımı, metinleri, logoları ve kodları dahil tüm unsurları
                          Hizmet Sağlayıcı'ya aittir ve fikri mülkiyet yasalarıyla korunmaktadır.
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-primary">Kullanıcı Hakları</h4>
                        <p className="text-sm text-muted-foreground">
                          Kullanıcılar, yükledikleri belgelere ilişkin tüm fikri mülkiyet haklarını saklı tutar.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 7: Hizmetin Askıya Alınması */}
              <section id="hizmet-askiya-alma">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Ban className="h-5 w-5 text-primary" />
                      </div>
                      <span>7. Hizmetin Askıya Alınması ve Fesih</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed mb-4">
                      Hizmet Sağlayıcı, bu sözleşmeye aykırı hareket eden veya platformun güvenliğini tehlikeye atan
                      kullanıcıların hizmete erişimini önceden bildirimde bulunmaksızın askıya alma veya tamamen
                      sonlandırma hakkını saklı tutar.
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Askıya Alma Koşulları:</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Sözleşme şartlarının ihlali</li>
                        <li>• Platform güvenliğini tehlikeye atma</li>
                        <li>• Yasadışı içerik paylaşımı</li>
                        <li>• Diğer kullanıcıları rahatsız etme</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 8: Sözleşme Değişiklikleri */}
              <section id="sozlesme-degisiklikleri">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span>8. Sözleşme Değişiklikleri</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed mb-4">
                      Hizmet Sağlayıcı, bu sözleşmeyi herhangi bir zamanda tek taraflı olarak değiştirme hakkını saklı tutar.
                      Değişiklikler platformda yayınlandığı anda yürürlüğe girer.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <Info className="h-4 w-4 inline mr-2" />
                        <strong>Not:</strong> Platformu kullanmaya devam ederek güncel sözleşmeyi kabul etmiş sayılırsınız.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 9: Uygulanacak Hukuk */}
              <section id="uygulanacak-hukuk">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <span>9. Uygulanacak Hukuk ve Yetkili Mahkeme</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          Uygulanacak Hukuk
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Bu sözleşmenin yorumlanmasında ve uygulanmasında Türkiye Cumhuriyeti yasaları geçerlidir.
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Scale className="h-4 w-4 text-primary" />
                          Yetkili Mahkeme
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Bu sözleşmeden doğabilecek her türlü uyuşmazlığın çözümünde İstanbul (Çağlayan)
                          Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 10: İletişim */}
              <section id="iletisim">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <span>10. İletişim</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">
                      Bu sözleşme hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Footer CTA */}
            <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Sözleşme Hakkında Sorularınız mı Var?</h3>
                  <p className="text-muted-foreground mb-6">
                    Kullanıcı sözleşmesi hakkında daha fazla bilgi almak veya
                    sorularınızı iletmek için bizimle iletişime geçin.
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

export default KullaniciSozlesmesi;