import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  FileText,
  Sparkles,
  MessageSquareText,
  CheckCircle2,
  Shield,
  Eye,
  MapPin,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Zap,
  Target,
  Users,
  Award,
  ChevronRight,
  Lightbulb,
  Edit3,
  Brain,
  Settings,
  Download,
  PenTool
} from "lucide-react";

const NasilCalisir = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'petition'>('analysis');

  const handleStartAnalysis = () => {
    navigate("/auth");
  };

  const steps = [
    {
      number: 1,
      title: "Belgenizi Güvenle Yükleyin",
      description: "Anlamak istediğiniz belgenin fotoğrafını çekin, PDF/Word dosyasını seçin veya metni doğrudan yapıştırın. Hangi formatta olursa olsun, tüm yüklemeler bankacılık seviyesinde 256-bit SSL şifrelemesiyle korunur.",
      icon: FileText,
      color: "blue",
      duration: "30 saniye",
      details: [
        "Fotoğraf çekme veya dosya yükleme",
        "PDF, Word, TXT formatları desteklenir",
        "Metin kopyala-yapıştır seçeneği",
        "256-bit SSL şifreleme güvencesi"
      ]
    },
    {
      number: 2,
      title: "Derinlemesine Yapay Zeka Analizi",
      description: "Siz beklerken, gelişmiş AI motorumuz metninizi satır satır tarar. Bu aşamada sadece kelimeleri değil, cümleler arasındaki hukuki anlamları, ilişkileri ve olası sonuçları da çözümler.",
      icon: Sparkles,
      color: "purple",
      duration: "10 saniye",
      details: [
        "Google Gemini AI teknolojisi",
        "Hukuki terim tanıma",
        "Bağlam analizi",
        "Otomatik kategorilendirme"
      ]
    },
    {
      number: 3,
      title: "Anlaşılır Sonuç: Sade Türkçe Açıklama",
      description: "Analizin ilk çıktısı, karmaşık ve teknik dille yazılmış belgenizin herkesin anlayacağı, net ve akıcı bir Türkçeye çevrilmiş halidir. Artık metne yabancı kalmayacaksınız.",
      icon: MessageSquareText,
      color: "green",
      duration: "Anında",
      details: [
        "Sade Türkçe çeviri",
        "Teknik jargon açıklamaları",
        "Anlaşılır dil kullanımı",
        "Önemli vurgular"
      ]
    },
    {
      number: 4,
      title: "Vakit Kazandıran \"Yönetici Özeti\"",
      description: "Belgenin tamamını okumanıza gerek kalmadan, en kritik bilgileri, ana talepleri ve önemli sonuçları içeren bir özet sunulur. En can alıcı noktalar, gözünüzden kaçmaması için sizin için vurgulanır.",
      icon: CheckCircle2,
      color: "orange",
      duration: "Anında",
      details: [
        "Kritik bilgiler özetlendi",
        "Ana talepler vurgulandı",
        "Önemli sonuçlar belirlendi",
        "Hızlı genel bakış"
      ]
    },
    {
      number: 5,
      title: "Kişisel Etki Analizi: \"Bu Sizin İçin Ne Anlama Geliyor?\"",
      description: "Artiklo, bir adım daha ileri giderek belgenin sizi kişisel olarak nasıl etkilediğini açıklar: Size ne gibi haklar tanıdığını ve ne tür yükümlülükler getirdiğini net bir şekilde ortaya koyar.",
      icon: Eye,
      color: "teal",
      duration: "Anında",
      details: [
        "Kişisel etkiler belirlendi",
        "Haklar ve yükümlülükler",
        "Risk değerlendirmesi",
        "Fırsat analizi"
      ]
    },
    {
      number: 6,
      title: "Yol Haritanız: Somut Eylem Planı",
      description: "Belirsizliğe son veriyoruz. \"Peki, şimdi ne yapmalıyım?\" sorusuna, atmanız gereken adımları öncelik sırasına göre listeleyen, size özel ve net bir planla cevap veriyoruz.",
      icon: MapPin,
      color: "red",
      duration: "Anında",
      details: [
        "Adım adım eylem planı",
        "Öncelik sıralaması",
        "Zaman çizelgesi",
        "Gerekli belgeler listesi"
      ]
    },
    {
      number: 7,
      title: "Otomatik Etiketleme: Kilit Bilgiler Elinizin Altında",
      description: "Metindeki tüm önemli isimler, şirketler, tarihler, para tutarları ve kanun maddeleri otomatik olarak tespit edilir ve tek tıkla erişebileceğiniz, düzenli bir listede size sunulur.",
      icon: Shield,
      color: "indigo",
      duration: "Anında",
      details: [
        "Otomatik etiketleme",
        "Önemli bilgiler ayrıştırıldı",
        "Hızlı erişim linkleri",
        "Kategorize edilmiş veriler"
      ]
    }
  ];

  const petitionSteps = [
    {
      number: 1,
      title: "İhtiyacınızı Belirtin",
      description: "Hangi tür dilekçe oluşturmak istediğinizi seçin. Kira artışı, işe iade talebi, tazminat talep mektubu ve daha birçok dilekçe türü için adım adım rehberlik sağlanacak.",
      icon: Edit3,
      color: "blue",
      duration: "10 saniye",
      details: [
        "20+ dilekçe türü kategorisi",
        "Adım adım rehberlik sistemi",
        "Popüler dilekçe türleri",
        "Kişiselleştirilmiş form"
      ]
    },
    {
      number: 2,
      title: "Bilgilerinizi Girin",
      description: "Dilekçenizde yer alacak kişisel bilgilerinizi, karşı taraf bilgilerini ve konuyla ilgili detayları adım adım doldurursunuz. Her adımda size hangi bilgilerin gerekli olduğunu açıklarız.",
      icon: Settings,
      color: "green",
      duration: "2-3 dk",
      details: [
        "Soru-cevap şeklinde ilerleme",
        "Otomatik veri doğrulama",
        "Eksik bilgi uyarıları",
        "İlerleme kaydetme"
      ]
    },
    {
      number: 3,
      title: "Otomatik Belge Oluşturma",
      description: "Verdiğiniz cevaplar doğrultusunda sistem, hukuki diline uygun, eksiksiz ve profesyonel bir dilekçe oluşturur. Template tabanlı sistemimiz doğru format ve yasal dilin kullanılmasını garanti eder.",
      icon: Brain,
      color: "purple",
      duration: "15 saniye",
      details: [
        "Template tabanlı oluşturma",
        "Hukuki format kontrolü",
        "Yasal dayanak ekleme",
        "Profesyonel görünüm"
      ]
    },
    {
      number: 4,
      title: "İnceleme ve Düzenleme",
      description: "Oluşturulan dilekçeyi önizleme modunda inceleyebilir, gerekli gördüğünüz değişiklikleri yapabilirsiniz. Sistem size ek öneriler sunarak dilekçenizin daha güçlü olmasını sağlar.",
      icon: Eye,
      color: "orange",
      duration: "İsteğe bağlı",
      details: [
        "Canlı önizleme modu",
        "Kolay düzenleme araçları",
        "Güçlendirme önerileri",
        "Yasal kontroler"
      ]
    },
    {
      number: 5,
      title: "İndirme ve Kullanım",
      description: "Hazır dilekçenizi PDF, Word veya düz metin formatında indirebilirsiniz. Dilekçe, yazdırıp imzaladıktan sonra ilgili kurum veya kişiye teslim etmeye hazır haldedir.",
      icon: Download,
      color: "teal",
      duration: "Anında",
      details: [
        "Çoklu format desteği",
        "Yazdırma dostu tasarım",
        "İmza alanları hazır",
        "Arşivleme özelliği"
      ]
    }
  ];

  const stats = [
    {
      icon: Clock,
      number: "45 sn",
      label: "Ortalama Süre",
      description: "Baştan sona işlem süresi"
    },
    {
      icon: Zap,
      number: "%99.8",
      label: "Doğruluk Oranı",
      description: "AI analiz başarı oranı"
    },
    {
      icon: Users,
      number: "15K+",
      label: "Mutlu Kullanıcı",
      description: "Platform'u kullanan kişi sayısı"
    },
    {
      icon: Award,
      number: "50K+",
      label: "Toplam İşlem",
      description: "Analiz + oluşturulan belge sayısı"
    },
    {
      icon: PenTool,
      number: "15K+",
      label: "Belge Önerisi",
      description: "Analiz sonrası verilen öneriler"
    }
  ];

  const advantages = [
    {
      icon: Target,
      title: "Hassas Analiz",
      description: "Her belge türüne özel algoritma"
    },
    {
      icon: Shield,
      title: "Tam Güvenlik",
      description: "Verileriniz işlem sonrası silinir"
    },
    {
      icon: Zap,
      title: "Hızlı Sonuç",
      description: "Dakikalar içinde anlaşılır çıktı"
    },
    {
      icon: Users,
      title: "Kolay Kullanım",
      description: "Herkes için tasarlanmış arayüz"
    }
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const nextStep = () => {
    const currentSteps = activeTab === 'analysis' ? steps : petitionSteps;
    if (activeStep < currentSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const resetDemo = () => {
    setActiveStep(0);
  };

  const startDemo = () => {
    setIsAnimating(true);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const currentSteps = activeTab === 'analysis' ? steps : petitionSteps;
        if (prev >= currentSteps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Nasıl Çalışır?"
        description="Artiklo'nun belge analizi ve dilekçe oluşturma süreçlerini öğrenin. 7 adımda analiz, 5 adımda profesyonel dilekçe oluşturma."
        keywords="nasıl çalışır, adımlar, süreç, belge analizi, dilekçe oluşturma, yapay zeka"
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 px-6 py-2 text-base">
            <Lightbulb className="h-4 w-4 mr-2" />
            Süreç Açıklaması
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-primary">Nasıl</span>
            <span className="block">Çalışır?</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Artiklo'nun gücünü keşfedin: Belgelerinizi analiz edin veya yakında gelecek
            adım adım dilekçe hazırlama özelliğini keşfedin. Analiz işlemi saniyeler içinde tamamlanır.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>45 saniye süreç</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>%100 güvenli</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>%99.8 doğruluk</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'analysis'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Belge Analizi
            </button>
            <button
              onClick={() => setActiveTab('petition')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 relative ${activeTab === 'petition'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Edit3 className="h-4 w-4 mr-2 inline" />
              Dilekçe Oluşturma
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                YAKINDA
              </span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 max-w-7xl mx-auto">
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

        {/* Interactive Process Demo */}
        <div className="mb-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {activeTab === 'analysis' ? 'Belge Analizi' : 'Dilekçe Oluşturma'} Süreci
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {activeTab === 'analysis'
                ? 'Adımlara tıklayarak belge analizi sürecini keşfedin'
                : 'Adımlara tıklayarak dilekçe oluşturma sürecini keşfedin'
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={startDemo} disabled={isAnimating}>
                <Play className="h-4 w-4 mr-2" />
                {isAnimating ? 'Demo Çalışıyor...' : 'Otomatik Demo'}
              </Button>
              <Button variant="outline" onClick={resetDemo}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Sıfırla
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      {activeTab === 'analysis' ? 'Analiz' : 'Dilekçe'} Adımları
                    </h3>
                    <div className="space-y-3">
                      {(activeTab === 'analysis' ? steps : petitionSteps).map((step, index) => (
                        <button
                          key={index}
                          onClick={() => handleStepClick(index)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${activeStep === index
                            ? `bg-${step.color}-500/10 border border-${step.color}-500/20 text-foreground`
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${activeStep === index
                              ? `bg-${step.color}-500 text-white`
                              : 'bg-muted text-muted-foreground'
                              } flex items-center justify-center font-medium text-sm`}>
                              {step.number}
                            </div>
                            <span className="font-medium">{step.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Active Step Display */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-8">
                  {(() => {
                    const currentSteps = activeTab === 'analysis' ? steps : petitionSteps;
                    const currentStep = currentSteps[activeStep] || currentSteps[0];
                    return (
                      <>
                        <div className="flex items-start gap-6 mb-6">
                          <div className={`w-20 h-20 rounded-full bg-${currentStep.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                            {React.createElement(currentStep.icon, {
                              className: `h-10 w-10 text-${currentStep.color}-500`
                            })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-2xl font-bold">{currentStep.title}</h3>
                              <Badge variant="outline" className={`text-${currentStep.color}-600`}>
                                Adım {currentStep.number}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {currentStep.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-lg leading-relaxed mb-6">
                          {currentStep.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          {currentStep.details.map((detail, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle2 className={`h-4 w-4 text-${currentStep.color}-500 flex-shrink-0`} />
                              <span className="text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={activeStep === 0}
                          >
                            Önceki
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {activeStep + 1} / {currentSteps.length}
                          </span>
                          <Button
                            onClick={nextStep}
                            disabled={activeStep === currentSteps.length - 1}
                          >
                            Sonraki
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* All Steps Grid */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {activeTab === 'analysis' ? 'Belge Analizi' : 'Dilekçe Oluşturma'} - Tüm Adımlar
            </h2>
            <p className="text-lg text-muted-foreground">
              {activeTab === 'analysis'
                ? 'Baştan sona 7 adımda belge analizinin tamamı'
                : 'Baştan sona 5 adımda dilekçe oluşturmanın tamamı'
              }
            </p>
          </div>

          <div className="space-y-6">
            {(activeTab === 'analysis' ? steps : petitionSteps).map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-500 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-${step.color}-500/10 flex items-center justify-center group-hover:bg-${step.color}-500/20 transition-colors`}>
                        <Icon className={`h-8 w-8 text-${step.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-10 h-10 rounded-full bg-${step.color}-500 text-white flex items-center justify-center font-bold text-lg`}>
                            {step.number}
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {step.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className={`h-4 w-4 text-${step.color}-500 flex-shrink-0`} />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {index < (activeTab === 'analysis' ? steps : petitionSteps).length - 1 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-primary rotate-90" />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Advantages */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Neden Artiklo Seçmelisiniz?</h2>
            <p className="text-lg text-muted-foreground">
              Hem analiz hem dilekçe oluşturma için platform'umuzu diğerlerinden ayıran özellikler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tüm Bu Gücü Kendiniz Deneyimleyin
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Artiklo'nun karmaşık belgelerinizi nasıl analiz ettiğini ve profesyonel
                dilekçelerinizi nasıl oluşturduğunu görün. İlk işlemleriniz tamamen ücretsiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  size="lg"
                  onClick={handleStartAnalysis}
                  className="px-8 py-4 font-semibold text-lg group"
                >
                  {activeTab === 'analysis'
                    ? 'İlk Belgenizi Ücretsiz Analiz Edin'
                    : 'İlk Dilekçenizi Ücretsiz Oluşturun'
                  }
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-4 font-semibold"
                >
                  Süreci Tekrar İzle
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                ✓ Kredi kartı gerekmez  ✓ Saniyeler içinde sonuç  ✓ İlk 3 işlem ücretsiz
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NasilCalisir;