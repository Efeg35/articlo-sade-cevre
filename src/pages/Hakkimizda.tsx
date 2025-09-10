import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Lightbulb,
  ArrowRight,
  Zap,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  Star,
  Sparkles,
  Building,
  Globe,
  CheckCircle,
  Rocket,
  Code,
  Coffee,
  Brain,
  FileText,
  Edit3,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";

const Hakkimizda = () => {
  const values = [
    {
      icon: Heart,
      title: "Önce İnsan",
      description: "Teknolojiyi insanlar için geliştiriyoruz. Arayüzümüzün sadeliğinden metinlerimizin anlaşılırlığına kadar her detayda, odağımızda her zaman siz varsınız.",
      color: "red"
    },
    {
      icon: Shield,
      title: "Gizliliğin Kutsallığı",
      description: "Güven, her şeyden önce gelir. Verilerinizin sadece size ait olduğuna inanıyor ve bu ilkeyi sarsılmaz bir taahhütle koruyoruz.",
      color: "green"
    },
    {
      icon: Users,
      title: "Erişilebilirlik",
      description: "Bilgi temel bir haktır. Bu hakka erişimin önünde finansal veya teknik hiçbir engel olmamalıdır.",
      color: "blue"
    },
    {
      icon: Lightbulb,
      title: "Cesaret ve İnovasyon",
      description: "Statükoya meydan okumaktan ve en zor sorunlara teknolojiyle çözüm aramaktan asla çekinmeyiz.",
      color: "purple"
    }
  ];

  const timeline = [
    {
      date: "2023 Q4",
      title: "Fikrin Doğuşu",
      description: "Karmaşık hukuki belgelerin herkes için anlaşılır hale getirilmesi fikri doğdu.",
      icon: Lightbulb
    },
    {
      date: "2024 Q1",
      title: "Araştırma ve Geliştirme",
      description: "Yapay zeka teknolojileri araştırıldı, prototip geliştirme süreci başladı.",
      icon: Brain
    },
    {
      date: "2024 Q2",
      title: "İlk Beta Versiyonu",
      description: "Platform'un ilk beta versiyonu test kullanıcılarla buluştu.",
      icon: Code
    },
    {
      date: "2024 Q3",
      title: "Artiklo Lansmanı",
      description: "Artiklo resmi olarak kullanıcılarla buluştu ve hizmet vermeye başladı.",
      icon: Rocket
    }
  ];

  const team = [
    {
      name: "Ekip",
      role: "Teknoloji ve İnovasyon",
      description: "Deneyimli geliştiriciler ve AI uzmanlarından oluşan ekibimiz",
      icon: Code,
      color: "blue"
    },
    {
      name: "Vizyon",
      role: "Ürün ve Strateji",
      description: "Kullanıcı deneyimi ve ürün geliştirme odaklı yaklaşım",
      icon: Target,
      color: "green"
    },
    {
      name: "Misyon",
      role: "Hukuki Danışmanlık",
      description: "Hukuk alanında uzman danışmanlarımızla doğru çözümler",
      icon: Award,
      color: "purple"
    }
  ];

  const achievements = [
    {
      number: "15K+",
      label: "Aktif Kullanıcı",
      icon: Users,
      description: "Platformumuzu düzenli olarak kullanan mutlu kullanıcı"
    },
    {
      number: "50K+",
      label: "İşlenen Belge",
      icon: FileText,
      description: "Başarıyla sadeleştirilen ve analiz edilen belge sayısı"
    },
    {
      number: "15K+",
      label: "Belge Önerisi",
      icon: PenTool,
      description: "Analiz sonrası kullanıcılarımıza verdiğimiz belge önerileri"
    },
    {
      number: "%99.8",
      label: "Doğruluk Oranı",
      icon: CheckCircle,
      description: "Yapay zeka analizlerimizin doğruluk ve güvenilirlik oranı"
    },
    {
      number: "24/7",
      label: "Kesintisiz Hizmet",
      icon: Clock,
      description: "Her an erişilebilir, güvenilir platform hizmeti"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Anında Analiz",
      description: "Saniyeler içinde karmaşık belgeleri sadeleştiren AI teknolojisi"
    },
    {
      icon: Shield,
      title: "Güvenli İşlem",
      description: "Verileriniz işlem sonrası otomatik olarak silinir"
    },
    {
      icon: Globe,
      title: "Her Yerden Erişim",
      description: "Web ve mobil platformlarda kesintisiz kullanım deneyimi"
    },
    {
      icon: Star,
      title: "Premium Kalite",
      description: "Google Gemini AI ile desteklenen üstün analiz kalitesi"
    },
    {
      icon: Edit3,
      title: "Belge Hazırlama Rehberliği",
      description: "Analiz sonrası hangi belgelere ihtiyacınız olduğunu öğrenin"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Hakkımızda"
        description="Artiklo'nun hikayesi, misyonu, vizyonu ve değerleri. Karmaşık hukuki belgeleri analiz ediyor, sadeleştiriyor ve belge hazırlama konusunda rehberlik sağlıyoruz."
        keywords="hakkımızda, artiklo hikayesi, misyon, vizyon, ekip, teknoloji, belge hazırlama, belge analizi, hukuki rehberlik"
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
            <Building className="h-4 w-4 mr-2" />
            Hikayemiz
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Bir Fikirden Daha Fazlası
            <span className="block text-primary mt-2">Artiklo'nun Hikayesi</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Her şey basit bir soruyla başladı: Hayatımızı doğrudan etkileyen belgeleri
            neden anlamak zorunda değilmişiz gibi davranıyoruz?
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>2024'te kuruldu</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Türkiye</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>15K+ Kullanıcı</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <Card className="mb-20 max-w-6xl mx-auto border-l-4 border-l-primary">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Sorunun Kalbinde</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              Bir mahkeme tebligatı, bir kira kontratı, bir veraset ilamı... Bu belgelerle karşılaştığımızda
              hissettiğimiz o yabancılık ve çaresizlik hissini hepimiz biliriz. Aynı şekilde, haklarımızı korumak
              için dilekçe yazma ihtiyacında kaldığımızda da benzer bir çaresizlik yaşarız. Anlamadığımız bir dil
              yüzünden haklarımızın kaybolabileceği veya yanlış bir adım atabileceğimiz korkusuyla yaşarız.
            </p>
            <div className="bg-primary/5 rounded-xl p-6 mt-8">
              <p className="text-center font-semibold text-lg">
                <strong className="text-primary">Biz, bu duruma bir son vermek için yola çıktık.</strong>
                {" "}Bilginin, sadece hukukçuların veya uzmanların elinde bir güç olduğu bir dünyayı kabul etmedik.
                Artiklo, bu inancın bir ürünüdür.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 max-w-6xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-3xl">Misyonumuz</CardTitle>
              <p className="text-xl font-medium text-blue-600">Bilgiyi Demokratikleştirmek</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                En karmaşık hukuki, resmi ve bürokratik dili herkes için anında anlaşılır,
                erişilebilir ve eyleme geçirilebilir bilgiye dönüştürmektir. Analiz sonrasında
                hangi belgeler gerekiyorsa size rehberlik ederek, haklarınızı korumanız için
                gerekli adımları atmanıza yardımcı oluyoruz. Teknolojiyi, vatandaş ile adalet arasındaki duvarları yıkmak için bir köprü olarak kullanıyoruz.
              </p>
              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Her vatandaş için eşit erişim</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="text-3xl">Vizyonumuz</CardTitle>
              <p className="text-xl font-medium text-purple-600">Herkes İçin Dijital Adalet</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Türkiye'de ve dünyada hukuki okuryazarlığın bir lüks değil, bir standart haline geldiği
                bir gelecek hayal ediyoruz. Hiç kimsenin, anlamadığı bir belge yüzünden geceleri
                uykusunun kaçmadığı bir dünya yaratmak, bizim en büyük hedefimizdir.
              </p>
              <div className="mt-6 flex items-center gap-2 text-purple-600">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Global etki, yerel çözümler</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Yolculuğumuz</h2>
            <p className="text-lg text-muted-foreground">
              Artiklo'nun gelişim hikayesi ve önemli kilometre taşları
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 to-primary/80 rounded-full"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-3">
                            {item.date}
                          </Badge>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bize Yol Gösteren Değerler</h2>
            <p className="text-lg text-muted-foreground">
              Her kararımızın arkasında duran ilkeler
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className={`hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-${value.color}-500`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-${value.color}-500/10 flex items-center justify-center group-hover:bg-${value.color}-500/20 transition-colors`}>
                        <Icon className={`h-8 w-8 text-${value.color}-500`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Neden Artiklo?</h2>
            <p className="text-lg text-muted-foreground">
              Bizi diğerlerinden farklı kılan özellikler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ekibimiz</h2>
            <p className="text-lg text-muted-foreground">
              Farklı uzmanlık alanlarından profesyonellerden oluşan ekibimiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-full bg-${member.color}-500/10 flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-8 w-8 text-${member.color}-500`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="font-medium text-primary mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Başarılarımız Rakamlarla</h2>
            <p className="text-lg text-muted-foreground">
              Kullanıcılarımızın güvenini kazandığımızın kanıtları
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {achievements.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="font-medium text-foreground mb-2">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-12">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Bu Yolculuğun Bir Parçası Olun
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Artiklo, bir ekipten daha fazlasıdır; ortak bir amaca inanan bir topluluktur.
                  Bu vizyonu paylaşıyorsanız, sizi de aramızda görmekten mutluluk duyarız.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="font-semibold px-8">
                  <Link to="/auth">
                    <Rocket className="h-5 w-5 mr-2" />
                    Artiklo'yu Şimdi Deneyin
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="font-semibold px-8">
                  <Link to="/neden-artiklo">
                    Neden Bizi Seçmelisiniz?
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span>Türk kahvesiyle kodlanan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Sevgiyle geliştirilen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hakkimizda;