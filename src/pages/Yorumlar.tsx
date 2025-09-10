import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
  Heart,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Building2,
  GraduationCap,
  ShoppingBag,
  UserCircle,
  Sparkles,
  ThumbsUp,
  Calendar,
  Edit3,
  PenTool
} from "lucide-react";
import { Link } from "react-router-dom";

const Yorumlar = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Ayşe Y.",
      role: "Ev Hanımı",
      location: "İstanbul",
      avatar: "AY",
      rating: 5,
      date: "2024-08-15",
      category: "Kira Sözleşmesi",
      title: "Gerçekten hayat kurtarıcı!",
      content: "Kira sözleşmemi 2 dakikada anladım. Ev sahibinin eklediği ek maddelerin ne anlama geldiğini öğrenince çok şaşırdım. Artiklo olmasaydı büyük bir soruna girebilirdim.",
      helpful: 24,
      icon: Building2,
      color: "blue"
    },
    {
      id: 2,
      name: "Mehmet Ö.",
      role: "İş İnsanı",
      location: "Ankara",
      avatar: "MÖ",
      rating: 5,
      date: "2024-08-20",
      category: "İş Sözleşmesi",
      title: "Çok pratik ve güvenli",
      content: "Belgelerim asla kaydedilmedi, içim rahat. İş ortaklığı sözleşmesindeki karmaşık maddeleri anlamak için saatler harcıyordum. Artiklo ile saniyeler içinde her şey netleşti.",
      helpful: 31,
      icon: ShoppingBag,
      color: "green"
    },
    {
      id: 3,
      name: "Zeynep D.",
      role: "Öğretmen",
      location: "İzmir",
      avatar: "ZD",
      rating: 5,
      date: "2024-08-25",
      category: "Resmi Evrak",
      title: "Herkese tavsiye ederim",
      content: "Resmi yazıları artık korkmadan okuyorum. MEB'den gelen yeni yönetmeliği Artiklo sayesinde kolayca anladım ve öğrencilerime de doğru şekilde aktardım.",
      helpful: 18,
      icon: GraduationCap,
      color: "purple"
    },
    {
      id: 4,
      name: "Ahmet K.",
      role: "Emekli",
      location: "Bursa",
      avatar: "AK",
      rating: 5,
      date: "2024-07-30",
      category: "Veraset İlamı",
      title: "Yaşlı gözüyle de çok kolay",
      content: "Veraset ilamındaki terimleri anlamadığım için endişeleniyordum. Artiklo ile haklarımı ve sonraki adımları kolayca öğrendim. 70 yaşında olsam da rahatlıkla kullanabiliyorum.",
      helpful: 42,
      icon: UserCircle,
      color: "orange"
    },
    {
      id: 5,
      name: "Fatma Ş.",
      role: "Avukat",
      location: "Antalya",
      avatar: "FS",
      rating: 5,
      date: "2024-08-10",
      category: "Hukuki İnceleme",
      title: "Meslek hayatımda çok faydalı",
      content: "Müvekkillerime karmaşık kararları açıklamak için Artiklo'yu kullanıyorum. Hem zaman tasarrufu yapıyorum hem de müvekkillerim daha iyi anlıyor. Harika bir araç!",
      helpful: 35,
      icon: Award,
      color: "red"
    },
    {
      id: 6,
      name: "Murat K.",
      role: "KOBİ Sahibi",
      location: "Gaziantep",
      avatar: "MK",
      rating: 5,
      date: "2024-08-05",
      category: "Vergi Bildirimi",
      title: "İş hayatında vazgeçilmez",
      content: "Vergi dairesinden gelen ödeme emrinin aciliyetini Artiklo ile kavradım, süreci zamanında yönettim. Şimdi tüm resmi evraklarımı Artiklo'ya yüklüyorum.",
      helpful: 28,
      icon: Building2,
      color: "blue"
    },
    {
      id: 7,
      name: "Selma T.",
      role: "Öğrenci",
      location: "Konya",
      avatar: "ST",
      rating: 5,
      date: "2024-08-28",
      category: "Dilekçe Oluşturma",
      title: "Hayat kurtardı!",
      content: "Kira artış dilekçesi hazırlamamı gerekiyordu. Hiç bilmiyordum nasıl yazılacağını. Artiklo ile 2 dakikada profesyonel bir dilekçe oluşturdum ve haklarımı korudum.",
      helpful: 19,
      icon: Edit3,
      color: "teal"
    },
    {
      id: 8,
      name: "Can B.",
      role: "Mühendis",
      location: "Eskişehir",
      avatar: "CB",
      rating: 5,
      date: "2024-08-22",
      category: "Dilekçe Oluşturma",
      title: "Çok pratik ve güvenilir",
      content: "İşveren ile yaşadığım sorunu çözmek için işe iade dilekçesi hazırladım. Profesyonel avukatların yazacağından farkı yok. Gerçekten işe yaradı!",
      helpful: 26,
      icon: PenTool,
      color: "indigo"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "15.000+",
      label: "Mutlu Kullanıcı",
      description: "Platform'u aktif olarak kullanan"
    },
    {
      icon: MessageCircle,
      number: "4.9/5",
      label: "Kullanıcı Puanı",
      description: "Ortalama memnuniyet oranı"
    },
    {
      icon: TrendingUp,
      number: "%97",
      label: "Tavsiye Oranı",
      description: "Artiklo'yu başkalarına tavsiye eder"
    },
    {
      icon: CheckCircle,
      number: "%99.2",
      label: "Başarı Oranı",
      description: "Belgeleri doğru analiz etme"
    }
  ];

  const categories = [
    { name: "Kira Sözleşmeleri", count: 45, color: "blue" },
    { name: "İş Sözleşmeleri", count: 32, color: "green" },
    { name: "Resmi Evraklar", count: 28, color: "purple" },
    { name: "Mahkeme Kararları", count: 23, color: "red" },
    { name: "Dilekçe Oluşturma", count: 21, color: "teal" },
    { name: "Veraset İşlemleri", count: 18, color: "orange" },
    { name: "Vergi Belgeleri", count: 15, color: "yellow" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Kullanıcı Yorumları"
        description="Artiklo kullanıcılarının gerçek deneyimleri ve yorumları. Belge analizi ve dilekçe oluşturma hizmetimizi kullanan binlerce kişinin memnuniyet hikayelerini keşfedin."
        keywords="kullanıcı yorumları, deneyimler, testimonial, memnuniyet, geri bildirim, dilekçe oluşturma, belge analizi"
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
            <Heart className="h-4 w-4 mr-2" />
            Kullanıcı Deneyimleri
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-primary">Kullanıcılarımız</span>
            <span className="block">Ne Diyor?</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Binlerce kullanıcımızın gerçek deneyimleri ve Artiklo'nun belge analizi
            ile dilekçe oluşturma hizmetleriyle hayatlarında yaşadıkları pozitif değişimlerin hikayesi.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>15.000+ aktif kullanıcı</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 ortalama puan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>%97 tavsiye oranı</span>
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

        {/* Featured Testimonial Carousel */}
        <div className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Öne Çıkan Deneyimler</h2>
            <p className="text-lg text-muted-foreground">
              Kullanıcılarımızdan gelen en etkileyici geri bildirimler
            </p>
          </div>

          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-80 flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
                  <div className="relative z-10 w-full p-12">
                    <div className="flex items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 rounded-full bg-${testimonials[currentTestimonial].color}-500/10 flex items-center justify-center mb-4`}>
                          <span className="text-2xl font-bold text-foreground">
                            {testimonials[currentTestimonial].avatar}
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          {renderStars(testimonials[currentTestimonial].rating)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <Quote className="h-8 w-8 text-primary/30 mb-2" />
                          <h3 className="text-xl font-bold mb-2">{testimonials[currentTestimonial].title}</h3>
                          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                            {testimonials[currentTestimonial].content}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</span>
                          <span>•</span>
                          <span>{testimonials[currentTestimonial].role}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {testimonials[currentTestimonial].location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="mb-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tüm Kullanıcı Yorumları</h2>
            <p className="text-lg text-muted-foreground">
              Farklı kategorilerden gerçek kullanıcı deneyimleri
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => {
              const Icon = testimonial.icon;
              return (
                <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-${testimonial.color}-500/10 flex items-center justify-center`}>
                          <span className="font-bold text-foreground">{testimonial.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-${testimonial.color}-600`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {testimonial.category}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                      <h4 className="font-semibold text-lg mb-3">{testimonial.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {testimonial.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(testimonial.date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{testimonial.helpful} faydalı</span>
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
            <h2 className="text-3xl font-bold mb-4">Yorum Kategorileri</h2>
            <p className="text-lg text-muted-foreground">
              Hangi belge türlerinde kullanıcılarımız en çok memnun?
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full bg-${category.color}-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-${category.color}-500/20 transition-colors`}>
                    <MessageCircle className={`h-6 w-6 text-${category.color}-500`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-1">{category.count}</div>
                  <div className="text-sm text-muted-foreground">pozitif yorum</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <Card className="mb-20 max-w-6xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Güven ve Kalite Göstergeleri</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">%99.8</div>
                <div className="font-semibold mb-1">Doğruluk Oranı</div>
                <div className="text-sm text-muted-foreground">AI analizlerinin güvenilirliği</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="font-semibold mb-1">Veri İhlali</div>
                <div className="text-sm text-muted-foreground">Kurulduğumuzdan beri hiçbir güvenlik sorunu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="font-semibold mb-1">Kesintisiz Hizmet</div>
                <div className="text-sm text-muted-foreground">Her an erişilebilir platform</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Siz de Bu Deneyimin Parçası Olun</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Binlerce kullanıcımız gibi siz de karmaşık belgeleri anlamakta zorlandığınız
                günleri geride bırakın. Artiklo ile tanışın, farkı hemen hissedin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="font-semibold px-8 py-4">
                  <Link to="/auth">
                    <Star className="h-5 w-5 mr-2" />
                    Ücretsiz Denemeye Başla
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
                ✓ 5 dakikada kurulum  ✓ Kredi kartı gerektirmez  ✓ Anında sonuç alın
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Yorumlar;