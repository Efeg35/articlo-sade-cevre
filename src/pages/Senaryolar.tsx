import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  UserCheck,
  GraduationCap,
  Building,
  Users,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Target,
  Zap,
  Shield,
  Globe,
  Star,
  Calendar,
  MapPin,
  AlertCircle,
  ThumbsUp,
  Eye,
  BookOpen,
  Briefcase,
  Home,
  Scale,
  DollarSign,
  PlusCircle,
  ChevronRight,
  Lightbulb,
  Trophy,
  Edit3,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";

const Senaryolar = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const scenarios = [
    {
      id: 1,
      icon: UserCheck,
      emoji: "👴",
      category: "Aile Hukuku",
      title: "Emekli Ahmet B.",
      subtitle: "Veraset İlamı Sorunu",
      age: "67 yaş",
      location: "Kayseri",
      problem: "Veraset ilamındaki hukuki terimleri anlamadığı için büyük endişe yaşıyordu.",
      beforeSituation: [
        "Karmaşık hukuki terimler yüzünden stres",
        "Avukat masrafından çekinme",
        "Haklarını tam olarak bilememe",
        "İşlem süreci konusunda belirsizlik"
      ],
      solution: "Artiklo ile veraset ilamını analiz etti",
      afterSituation: [
        "Haklarını tam olarak öğrendi",
        "Sonraki adımları net bir şekilde gördü",
        "Stresini büyük ölçüde azalttı",
        "Güvenle işlemleri başlattı"
      ],
      quote: "Artiklo sayesinde hangi haklarım olduğunu ve ne yapmam gerektiğini anladım. Artık rahatım.",
      timeSpent: "3 dakika",
      savings: "2.500 TL avukat masrafı",
      color: "blue",
      difficulty: "Yüksek → Kolay"
    },
    {
      id: 2,
      icon: GraduationCap,
      emoji: "🎓",
      category: "Konut",
      title: "Öğrenci Ayşe Y.",
      subtitle: "Kira Kontratı Analizi",
      age: "22 yaş",
      location: "İstanbul",
      problem: "İlk defa ev kiralayacak, kira kontratındaki maddeleri anlamıyordu.",
      beforeSituation: [
        "Kontrat maddelerinden korkma",
        "Ev sahibinin yanılttığını düşünme",
        "Arkadaşlarından sürekli yardım isteme",
        "Yanlış karar verme korkusu"
      ],
      solution: "Artiklo ile kira kontratını detayca inceledi",
      afterSituation: [
        "Tüm maddeleri net anladı",
        "Haklarını ve sorumluluklarını öğrendi",
        "Güvenle sözleşme imzaladı",
        "Sorunlu maddeleri tespit etti"
      ],
      quote: "Kira kontratındaki gizli maddeleri görünce çok şaşırdım. Artiklo olmasaydı büyük sorun yaşardım.",
      timeSpent: "2 dakika",
      savings: "5.000 TL olası hukuki sorun",
      color: "green",
      difficulty: "Karmaşık → Basit"
    },
    {
      id: 3,
      icon: Building,
      emoji: "💼",
      category: "İş Dünyası",
      title: "KOBİ Sahibi Murat K.",
      subtitle: "Vergi Ödeme Emri",
      age: "45 yaş",
      location: "Gaziantep",
      problem: "Vergi dairesinden gelen ödeme emrinin aciliyet derecesini anlayamıyordu.",
      beforeSituation: [
        "Ödeme emrinin ciddiyetini bilmeme",
        "Zaman sınırlarını kavrayamama",
        "Hangi işlemleri yapacağını bilememe",
        "Ceza konusunda endişe"
      ],
      solution: "Artiklo ile vergi belgesini analiz etti",
      afterSituation: [
        "Aciliyet seviyesini anladı",
        "Ödeme tarihlerini net gördü",
        "Süreci zamanında yönetti",
        "Ceza almaktan kurtuldu"
      ],
      quote: "15 günlük sürem kaldığını Artiklo sayesinde anladım. Zamanında ödeme yapıp cezadan kurtuldum.",
      timeSpent: "5 dakika",
      savings: "15.000 TL gecikme cezası",
      color: "purple",
      difficulty: "Acil → Kontrollü"
    },
    {
      id: 4,
      icon: Users,
      emoji: "👨‍⚖️",
      category: "Hukuk",
      title: "Avukat Fatma H.",
      subtitle: "Müvekkil Bilgilendirme",
      age: "38 yaş",
      location: "Ankara",
      problem: "Karmaşık mahkeme kararlarını müvekkillerine anlatmakta zorlanıyordu.",
      beforeSituation: [
        "Uzun açıklama seansları",
        "Müvekkillerin anlamaması",
        "Tekrar tekrar soru alması",
        "Zaman kaybı yaşaması"
      ],
      solution: "Müvekkillerine Artiklo özetlerini göstermeye başladı",
      afterSituation: [
        "Müvekkilleri daha hızlı anlıyor",
        "Daha az soru geliyor",
        "Zaman tasarrufu yapıyor",
        "Müvekkil memnuniyeti arttı"
      ],
      quote: "Artiklo, meslek hayatımda çok değerli bir araç. Müvekkillerim artık kararları daha iyi anlıyor.",
      timeSpent: "30 saniye",
      savings: "2 saat zaman tasarrufu",
      color: "red",
      difficulty: "Zor → Kolay"
    },
    {
      id: 5,
      icon: Home,
      emoji: "🏠",
      category: "Emlak",
      title: "Ev Sahibi Mehmet B.",
      subtitle: "İcra Takibi Belgesi",
      age: "52 yaş",
      location: "İzmir",
      problem: "Kiracısından gelen icra takibi belgesini nasıl yanıtlayacağını bilmiyordu.",
      beforeSituation: [
        "Hukuki süreçlerden korkma",
        "Yanlış adım atma endişesi",
        "Avukat bulma zorluğu",
        "Süre kaybetme riski"
      ],
      solution: "Artiklo ile icra belgesini analiz etti",
      afterSituation: [
        "Yanıtlama süresini öğrendi",
        "Hangi belgeleri hazırlaması gerektiğini anladı",
        "Doğru prosedürü takip etti",
        "Hakkını savunabildi"
      ],
      quote: "İcra takibinin nasıl yanıtlanacağını öğrendim. Doğru zamanda doğru belgelerle karşılık verdim.",
      timeSpent: "4 dakika",
      savings: "3.000 TL avukat ücreti",
      color: "orange",
      difficulty: "Karmaşık → Anlaşılır"
    },
    {
      id: 6,
      icon: Heart,
      emoji: "👵",
      category: "Sağlık",
      title: "Emekli Zeynep H.",
      subtitle: "Sigorta Poliçesi",
      age: "63 yaş",
      location: "Adana",
      problem: "Sağlık sigortası poliçesindeki teminat kapsamını anlayamıyordu.",
      beforeSituation: [
        "Hangi tedavilerin karşılandığını bilmeme",
        "Ek ödeme gereken durumları bilmeme",
        "Poliçe şartlarından emin olamama",
        "Sağlık harcamaları konusunda endişe"
      ],
      solution: "Artiklo ile sigorta poliçesini detayca inceledi",
      afterSituation: [
        "Teminat kapsamını net öğrendi",
        "Ödeme koşullarını anladı",
        "Hangi hastaneleri kullanabileceğini öğrendi",
        "Güvenle sağlık hizmetlerini kullanıyor"
      ],
      quote: "Artık hangi tedavilerim karşılanacak biliyorum. Sağlık konusunda içim çok rahat.",
      timeSpent: "6 dakika",
      savings: "Gereksiz ek ödemelerden korunma",
      color: "pink",
      difficulty: "Belirsiz → Net"
    },
    {
      id: 7,
      icon: Edit3,
      emoji: "📝",
      category: "Dilekçe Oluşturma",
      title: "Öğrenci Merve K.",
      subtitle: "Kira Artış Dilekçesi",
      age: "24 yaş",
      location: "Ankara",
      problem: "Ev sahibi kira artışı yapmak istiyordu, hukuki haklarını korumak için dilekçe hazırlaması gerekiyordu.",
      beforeSituation: [
        "Nasıl dilekçe yazacağını bilmeme",
        "Hukuki dili kullanamama",
        "Avukat masrafından çekinme",
        "Süre kaybetme korkusu"
      ],
      solution: "Artiklo ile kira artış dilekçesi oluşturdu",
      afterSituation: [
        "Profesyonel dilekçe hazırladı",
        "Hukuki haklarını korudu",
        "Masraf yapmadan çözdü",
        "Güvenle başvuruda bulundu"
      ],
      quote: "Hiç dilekçe yazmamıştım. Artiklo sayesinde avukat yazmış gibi profesyonel bir dilekçe hazırladım.",
      timeSpent: "3 dakika",
      savings: "1.500 TL avukat ücreti",
      color: "teal",
      difficulty: "İmkansız → Kolay"
    },
    {
      id: 8,
      icon: PenTool,
      emoji: "⚖️",
      category: "Dilekçe Oluşturma",
      title: "İşçi Hasan Y.",
      subtitle: "İşe İade Dilekçesi",
      age: "35 yaş",
      location: "İstanbul",
      problem: "Haksız yere işten çıkarıldığını düşünüyordu, işe iade talebi için dilekçe hazırlaması gerekiyordu.",
      beforeSituation: [
        "Hukuki süreçlerden korkma",
        "Dilekçe yazma bilgisi eksikliği",
        "Yanlış adım atma endişesi",
        "Pahalı avukat masrafları"
      ],
      solution: "Artiklo ile işe iade dilekçesi oluşturdu",
      afterSituation: [
        "Güçlü dilekçe hazırladı",
        "Tüm yasal dayanakları ekledi",
        "Kendini güvende hissetti",
        "İşine geri dönebildi"
      ],
      quote: "İşime geri dönmek için hazırladığım dilekçe çok profesyoneldi. Artiklo sayesinde haklarımı korudum.",
      timeSpent: "5 dakika",
      savings: "4.000 TL avukat ücreti + işe geri dönüş",
      color: "indigo",
      difficulty: "Zor → Basit"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "10K+",
      label: "Farklı Senaryo",
      description: "Çözülen gerçek hayat durumu"
    },
    {
      icon: Clock,
      number: "5 dk",
      label: "Ortalama Süre",
      description: "Problem çözme süresi"
    },
    {
      icon: DollarSign,
      number: "₺8.500",
      label: "Ortalama Tasarruf",
      description: "Kullanıcı başına"
    },
    {
      icon: TrendingUp,
      number: "%95",
      label: "Başarı Oranı",
      description: "Sorun çözme başarısı"
    }
  ];

  const categories = [
    { name: "Aile Hukuku", icon: Users, count: 156, color: "blue" },
    { name: "İş Sözleşmeleri", icon: Briefcase, count: 142, color: "green" },
    { name: "Emlak İşlemleri", icon: Home, count: 128, color: "purple" },
    { name: "Dilekçe Oluşturma", icon: Edit3, count: 114, color: "teal" },
    { name: "Vergi Belgeleri", icon: DollarSign, count: 98, color: "red" },
    { name: "Sigorta Poliçeleri", icon: Shield, count: 87, color: "orange" },
    { name: "Mahkeme Kararları", icon: Scale, count: 76, color: "indigo" }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Belgeyi Yükle",
      description: "Probleminiz olan belgeyi platforma yükleyin",
      icon: FileText,
      time: "30 saniye"
    },
    {
      step: 2,
      title: "AI Analizi",
      description: "Yapay zeka belgenizi detayca analiz eder",
      icon: Zap,
      time: "10 saniye"
    },
    {
      step: 3,
      title: "Anlaşılır Özet",
      description: "Karmaşık metni sade Türkçe ile alın",
      icon: Eye,
      time: "1 dakika"
    },
    {
      step: 4,
      title: "Eylem Planı",
      description: "Yapmanız gerekenleri adım adım görün",
      icon: CheckCircle,
      time: "2 dakika"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Kullanım Senaryoları"
        description="Artiklo'nun gerçek hayatta nasıl kullanıldığına dair hikayeler. Belge analizi ve dilekçe oluşturma ile farklı yaş ve meslek gruplarından kullanıcılarımızın deneyimleri."
        keywords="kullanım senaryoları, gerçek hikayeler, deneyimler, örnekler, kullanım alanları, dilekçe oluşturma, belge analizi"
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
            <BookOpen className="h-4 w-4 mr-2" />
            Gerçek Hikayeler
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-primary">Gerçek Hayat</span>
            <span className="block">Senaryoları</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Farklı yaşlardan ve mesleklerden kullanıcılarımızın Artiklo'nun belge analizi
            ve dilekçe oluşturma hizmetleri ile nasıl sorunlarını çözdüklerine dair gerçek hikayeler.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>10.000+ çözülen durum</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Ortalama 5 dakika</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>%95 başarı oranı</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
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
        </div>

        {/* Featured Scenario */}
        <div className="mb-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Öne Çıkan Hikayeler</h2>
            <p className="text-lg text-muted-foreground">
              En etkileyici kullanıcı deneyimlerinden seçmeler
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {scenarios.slice(0, 3).map((scenario, index) => (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all duration-300 ${selectedScenario === index
                      ? `border-${scenario.color}-500 bg-${scenario.color}-50/50`
                      : 'hover:shadow-md'
                      }`}
                    onClick={() => setSelectedScenario(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{scenario.emoji}</div>
                        <div>
                          <h3 className="font-semibold">{scenario.title}</h3>
                          <p className="text-sm text-muted-foreground">{scenario.subtitle}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {scenario.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="text-6xl">{scenarios[selectedScenario].emoji}</div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-bold">{scenarios[selectedScenario].title}</h3>
                        <Badge variant="outline">{scenarios[selectedScenario].category}</Badge>
                      </div>
                      <p className="text-lg text-primary font-medium mb-2">{scenarios[selectedScenario].subtitle}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{scenarios[selectedScenario].age}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {scenarios[selectedScenario].location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Problem
                      </h4>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {scenarios[selectedScenario].problem}
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h5 className="font-medium text-red-800 mb-2">Artiklo Öncesi</h5>
                          <ul className="space-y-1">
                            {scenarios[selectedScenario].beforeSituation.map((item, index) => (
                              <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-medium text-green-800 mb-2">Artiklo Sonrası</h5>
                          <ul className="space-y-1">
                            {scenarios[selectedScenario].afterSituation.map((item, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-bold text-primary">"</span>
                        </div>
                        <div>
                          <p className="text-lg italic text-foreground mb-3">
                            {scenarios[selectedScenario].quote}
                          </p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-blue-600">
                              <Clock className="h-4 w-4" />
                              <span>{scenarios[selectedScenario].timeSpent}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span>{scenarios[selectedScenario].savings}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-600">
                              <TrendingUp className="h-4 w-4" />
                              <span>{scenarios[selectedScenario].difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* All Scenarios Grid */}
        <div className="mb-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tüm Kullanım Senaryoları</h2>
            <p className="text-lg text-muted-foreground">
              Farklı yaş, meslek ve ihtiyaçlardaki kullanıcılarımızın hikayeleri
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <Card key={scenario.id} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-4xl">{scenario.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{scenario.title}</h3>
                          <Badge variant="outline" className={`text-${scenario.color}-600`}>
                            {scenario.category}
                          </Badge>
                        </div>
                        <p className="text-lg font-medium text-primary mb-1">{scenario.subtitle}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span>{scenario.age}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {scenario.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {scenario.problem}
                    </p>

                    <div className="bg-primary/5 rounded-lg p-4 mb-6">
                      <p className="text-sm italic">{scenario.quote}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span>{scenario.timeSpent}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-3 w-3" />
                          <span>{scenario.savings}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {scenario.difficulty}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Senaryo Kategorileri</h2>
            <p className="text-lg text-muted-foreground">
              En çok çözülen problem alanları
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full bg-${category.color}-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-${category.color}-500/20 transition-colors`}>
                      <Icon className={`h-8 w-8 text-${category.color}-500`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{category.count}</div>
                    <div className="text-sm text-muted-foreground">çözülen durum</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-lg text-muted-foreground">
              Probleminizi çözene kadar 4 basit adım
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="hover:shadow-lg transition-all duration-300 group h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {step.time}
                      </Badge>
                    </CardContent>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <Card className="mb-20 max-w-6xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Başarı Hikayeleri Özeti</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">₺2.1M</div>
                <div className="font-semibold mb-1">Toplam Tasarruf</div>
                <div className="text-sm text-muted-foreground">Kullanıcılarımızın kazandığı</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">847</div>
                <div className="font-semibold mb-1">Saat Tasarrufu</div>
                <div className="text-sm text-muted-foreground">Günlük ortalama</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">%98</div>
                <div className="font-semibold mb-1">Problem Çözme</div>
                <div className="text-sm text-muted-foreground">Başarı oranımız</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <Lightbulb className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Siz de Bu Hikayenin Parçası Olun</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Binlerce kullanıcımız gibi siz de karmaşık belgelerinizle ilgili sorunlarınızı
                dakikalar içinde çözün. İlk belgenizi şimdi yükleyin, farkı hemen görün.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="font-semibold px-8 py-4">
                  <Link to="/auth">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Kendi Hikayenizi Yazın
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="font-semibold px-8 py-4">
                  <Link to="/yorumlar">
                    Daha Fazla Deneyim
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                ✓ 3 dakikada kurulum  ✓ Anında sonuç  ✓ Ücretsiz deneme
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Senaryolar;