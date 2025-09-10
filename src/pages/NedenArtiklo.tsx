import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  Zap,
  Shield,
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  Globe,
  Users,
  Lock,
  FileText,
  TrendingUp,
  Award,
  Rocket,
  Heart,
  Eye,
  Coffee,
  Code2,
  Lightbulb,
  Building,
  Cpu,
  Database,
  Fingerprint,
  Edit3,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";

const NedenArtiklo = () => {
  const mainFeatures = [
    {
      icon: Zap,
      title: "Saniyeler İçinde Netlik",
      subtitle: "Çünkü Zamanınız Değerli",
      description: "Sayfalarca metni dakikalarca okumak zorunda değilsiniz. Artiklo, en karmaşık hukuki ve bürokratik belgeleri bile saniyeler içinde analiz eder.",
      details: [
        "Anında belge yükleme ve işleme",
        "Sadeleştirilmiş metin ve özet",
        "Atmanız gereken adımları gösteren yol haritası",
        "Önemli tarih ve tutarların vurgulanması"
      ],
      color: "blue"
    },
    {
      icon: Shield,
      title: "Verileriniz Kutsaldır",
      subtitle: "%100 Güvenlik ve Gizlilik Garantisi",
      description: "Gizliliğiniz, bizim için bir özellik değil, bir yemindir. Artiklo'ya yüklediğiniz hiçbir belge veya kişisel veri sunucularımızda asla kalıcı olarak saklanmaz.",
      details: [
        "İşlem sonrası otomatik veri silme",
        "Uçtan uca şifreli veri transferi",
        "Kişisel veriler asla paylaşılmaz",
        "KVKK ve GDPR tam uyumluluğu"
      ],
      color: "green"
    },
    {
      icon: Brain,
      title: "Sadece Sadeleştirmeyen, Anlam Katan Teknoloji",
      subtitle: "Google Gemini AI Gücü",
      description: "Gücümüzü, Google'ın en gelişmiş Gemini yapay zeka modellerinden alıyoruz. Teknolojimiz, metindeki kelimeleri değiştirmekle kalmaz.",
      details: [
        "Hukuki jargonun anlaşılır çevirisi",
        "Önemli tarih ve para birimlerinin tespiti",
        "Sorumlu tarafların belirlenmesi",
        "Belgenin ardındaki anlam ve niyet analizi"
      ],
      color: "purple"
    },
    {
      icon: Edit3,
      title: "Sadece Analiz Değil, Rehberlik de",
      subtitle: "Belge Hazırlama Yardımı",
      description: "Analiz sonrasında hangi belgelere ihtiyacınız olduğunu öğrenin. Yakında gelecek adım adım belge hazırlama özelliğimizle size özel dilekçeler oluşturabileceksiniz.",
      details: [
        "Analiz sonrası belge önerileri",
        "Hazır şablon erişimi",
        "Adım adım rehberlik (yakında)",
        "Kişiselleştirilmiş yönlendirmeler"
      ],
      color: "orange"
    }
  ];

  const philosophy = [
    {
      icon: Users,
      title: "Biz Bir Veritabanı Değiliz, Sizin Kişisel 'Tercümanınız'",
      description: "Amacımız size binlerce kanun maddesi sunmak değil, elinizdeki tek bir belgenin sizin için ne ifade ettiğini anlatmak ve gerektiğinde hangi adımları atmanız gerektiğini rehberlik etmektir."
    },
    {
      icon: Lock,
      title: "Gizlilik Bir Seçenek Değil, Zorunluluktur",
      description: "'Verileri sil' düğmesine basmanıza gerek yok. Biz bunu sizin için otomatik olarak yapıyoruz. Çünkü doğru olan bu."
    },
    {
      icon: Globe,
      title: "Bilgiye Erişimin Önünde Engel Olmaz",
      description: "Misyonumuz bilgiyi demokratikleştirmek. Bu yüzden Artiklo'nun temel hizmetleri her zaman ücretsiz, reklamsız ve kullanıcı dostu olacaktır."
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: "Zaman Tasarrufu",
      stat: "%95",
      description: "Ortalama belge okuma süresini %95 azaltır"
    },
    {
      icon: CheckCircle,
      title: "Doğruluk Oranı",
      stat: "%99.8",
      description: "Yapay zeka analizlerinde yüksek doğruluk"
    },
    {
      icon: Users,
      title: "Kullanıcı Memnuniyeti",
      stat: "%97",
      description: "Kullanıcıların platformu tavsiye etme oranı"
    },
    {
      icon: Shield,
      title: "Güvenlik",
      stat: "100%",
      description: "Veri güvenliği ve gizlilik koruması"
    }
  ];

  const useCases = [
    {
      icon: FileText,
      title: "Hukuki Belgeler",
      examples: ["Mahkeme kararları", "Tebligatlar", "Dava dosyaları", "Hukuki görüşler"]
    },
    {
      icon: Building,
      title: "İş Dünyası",
      examples: ["Sözleşmeler", "Protokoller", "Tüzükler", "Yönetmelikler"]
    },
    {
      icon: Users,
      title: "Kişisel İşlemler",
      examples: ["Kira kontratları", "Sigorta poliçeleri", "Veraset ilamları", "Noter belgeleri"]
    },
    {
      icon: Award,
      title: "Resmi Evraklar",
      examples: ["Vergi bildirimleri", "Devlet daireleri", "Belediye işleri", "SGK belgeleri"]
    },
    {
      icon: Edit3,
      title: "Belge Önerileri",
      examples: ["Hangi dilekçe gerekli", "Gerekli belgeler listesi", "İzlenecek prosedürler", "Başvuru rehberleri"]
    }
  ];

  const comparison = [
    {
      feature: "İşlem Hızı",
      artiklo: "Saniyeler içinde",
      others: "Saatler/günler"
    },
    {
      feature: "Veri Güvenliği",
      artiklo: "Otomatik silme",
      others: "Belirsiz saklama"
    },
    {
      feature: "Maliyet",
      artiklo: "Ücretsiz başlangıç",
      others: "Yüksek danışmanlık ücreti"
    },
    {
      feature: "Erişilebilirlik",
      artiklo: "7/24 online",
      others: "Randevu sistemi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Neden Artiklo?"
        description="Artiklo'yu tercih etmeniz için nedenler: Hızlı belge analizi, belge hazırlama rehberliği, tam güvenlik, AI destekli teknoloji."
        keywords="neden artiklo, avantajlar, özellikler, farklar, AI teknolojisi, belge hazırlama, belge analizi, hukuki rehberlik"
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-6 py-2 text-base">
            <Sparkles className="h-4 w-4 mr-2" />
            Neden Biz?
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-primary">Neden Artiklo?</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Çünkü karmaşık belgeler hayatınızı ertelemek için bir neden olmamalı. Haklarınızı öğrenmek ve gerekli adımları atmak bu kadar zor olmamalı.
          </p>
          <div className="bg-primary/10 rounded-2xl p-8 max-w-5xl mx-auto">
            <p className="text-lg leading-relaxed text-center">
              Resmi bir dil, anlaşılmaz terimler ve sayfalarca metin... Bir sözleşme, mahkeme kararı veya tebligatla
              karşılaştığınızda hissettiğiniz stresi ve belirsizliği anlıyoruz.
              <span className="font-semibold text-primary"> Artiklo, tam olarak bu sorunu çözmek için doğdu.</span>
              <br /><br />
              Biz, teknolojiyle bilgiyi birleştirerek gücü yeniden sizin elinize veriyoruz.
            </p>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Temel Avantajlarımız</h2>
            <p className="text-lg text-muted-foreground">
              Artiklo'yu benzersiz kılan üç temel özellik
            </p>
          </div>

          <div className="space-y-16">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <Card className={`hover:shadow-xl transition-all duration-500 border-l-4 border-l-${feature.color}-500`}>
                      <CardContent className="p-10">
                        <div className="flex items-start gap-6">
                          <div className={`w-20 h-20 rounded-full bg-${feature.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-10 w-10 text-${feature.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                              <p className={`text-lg font-medium text-${feature.color}-600`}>{feature.subtitle}</p>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                              {feature.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {feature.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-center gap-2">
                                  <CheckCircle className={`h-4 w-4 text-${feature.color}-500 flex-shrink-0`} />
                                  <span className="text-sm">{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden lg:block w-64">
                    <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-500/5 flex items-center justify-center`}>
                      <Icon className={`h-24 w-24 text-${feature.color}-500/30`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rakamlarla Artiklo</h2>
            <p className="text-lg text-muted-foreground">
              Başarımızı gösteren önemli metrikler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-3">{advantage.stat}</div>
                    <h3 className="font-semibold text-lg mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Philosophy */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bizim Felsefemiz: Sadece Size Odaklanmak</h2>
            <p className="text-lg text-muted-foreground">
              Her kararımızın arkasındaki ilkeler
            </p>
          </div>

          <div className="space-y-6">
            {philosophy.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hangi Belgelerde Kullanabilirsiniz?</h2>
            <p className="text-lg text-muted-foreground">
              Artiklo'nun size yardımcı olabileceği belge türleri
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{useCase.title}</h3>
                    <ul className="space-y-1">
                      {useCase.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Artiklo vs Geleneksel Yöntemler</h2>
            <p className="text-lg text-muted-foreground">
              Neden geleneksel danışmanlık yerine Artiklo'yu seçmelisiniz?
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/5">
                    <tr>
                      <th className="text-left p-6 font-semibold">Özellik</th>
                      <th className="text-left p-6 font-semibold text-primary">Artiklo</th>
                      <th className="text-left p-6 font-semibold text-muted-foreground">Geleneksel Yöntemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-6 font-medium">{item.feature}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-700 font-medium">{item.artiklo}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-muted-foreground">{item.others}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vision */}
        <Card className="mb-20 max-w-6xl mx-auto bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Bir Yazılımdan Daha Fazlası: Dijital Adalet Vizyonu</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-8">
              Artiklo, yalnızca ticari bir girişim değildir. Biz, Türkiye'nin dijital dönüşümünde adalete erişimi
              kolaylaştıran bir sosyal inovasyon projesiyiz. Her vatandaşın, finansal durumu veya hukuki bilgisi
              ne olursa olsun, haklarını ve yükümlülüklerini anlayabilmesi gerektiğine inanıyoruz.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Sosyal sorumluluk</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>Şeffaflık</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>Toplumsal fayda</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <Rocket className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Karmaşaya Son Vermeye Hazır Mısınız?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Belirsizliğin ve stresin yerini netliğin ve güvenin almasına izin verin.
                İlk belgenizi analiz edin, hangi adımları atmanız gerektiğini öğrenin. Artiklo farkını saniyeler içinde kendiniz görün.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="font-semibold px-8 py-4">
                  <Link to="/auth">
                    <Zap className="h-5 w-5 mr-2" />
                    Hemen Ücretsiz Başlayın
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="font-semibold px-8 py-4">
                  <Link to="/senaryolar">
                    Gerçek Örnekleri İncele
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                ✓ Kredi kartı gerekmez  ✓ Anında başlayın  ✓ İlk 3 işlem ücretsiz
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NedenArtiklo;