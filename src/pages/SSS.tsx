import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  HelpCircle,
  Shield,
  FileText,
  Zap,
  Users,
  Search,
  Filter,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  Star,
  BookOpen,
  Phone,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

const SSS = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData: FAQ[] = useMemo(() => [
    {
      id: "1",
      question: "Artiklo nedir ve nasıl çalışır?",
      answer: "Artiklo, karmaşık hukuki belgeleri anlaşılır Türkçeye çeviren yapay zeka destekli bir platformdur. Belgenizi yükleyin, AI analizimiz sayesinde saniyeler içinde sade bir açıklama alın. 7 adımda: Belge yükleme → AI analizi → Sadeleştirme → Özet → Etki analizi → Eylem planı → Etiketleme.",
      icon: HelpCircle,
      category: "genel",
      priority: "high",
      tags: ["nasıl çalışır", "temel", "platform"]
    },
    {
      id: "2",
      question: "Hangi belge türlerini destekliyorsunuz?",
      answer: "Kira sözleşmeleri, mahkeme kararları, tebligatlar, veraset ilamları, icra takip belgeleri, sigorta poliçeleri, iş sözleşmeleri, vergi belgeleri, noter belgeleri ve diğer tüm hukuki metinleri analiz edebiliyoruz. PDF, Word, fotoğraf ve metin formatlarında kabul ediyoruz.",
      icon: FileText,
      category: "ozellikler",
      priority: "high",
      tags: ["belge türleri", "desteklenen formatlar", "analiz"]
    },
    {
      id: "3",
      question: "Belgelerim güvende mi? Veri güvenliği nasıl sağlanıyor?",
      answer: "Evet, tüm belgeleriniz en yüksek güvenlik standartlarıyla korunur. 256-bit SSL şifreleme, analiz sonrası otomatik veri silme, KVKK ve GDPR tam uyumluluğu. Hiçbir verıniz üçüncü taraflarla paylaşılmaz veya saklanmaz. Bankacılık seviyesinde güvenlik kullanıyoruz.",
      icon: Shield,
      category: "guvenlik",
      priority: "high",
      tags: ["güvenlik", "KVKK", "GDPR", "şifreleme"]
    },
    {
      id: "4",
      question: "Ücretsiz sürümde neler var? Limitler nedir?",
      answer: "Ücretsiz hesabınızla ayda 1 belge analiz edebilirsiniz. Temel AI modeli, belge özeti, sadeleştirme, kısıtlı risk önizlemesi, filigranlı PDF çıktısı ve son 3 dosya geçmişi dahildir. Limitiniz dolunca bir sonraki ayı bekleyebilir veya ücretli plana geçebilirsiniz.",
      icon: Users,
      category: "planlar",
      priority: "high",
      tags: ["ücretsiz", "limit", "özellikler"]
    },
    {
      id: "5",
      question: "PRO plan neler sunuyor? Fiyatı ne kadar?",
      answer: "PRO planımız ₺299/ay: 50 belge analizi, 5 belge oluşturma, gelişmiş AI modeli, filigransız çıktı, sınırsız geçmiş, klasörleme, bildirimler, öncelikli destek. Yıllık ödemede %20 indirim. Ek belge paketleri de mevcut.",
      icon: Zap,
      category: "planlar",
      priority: "high",
      tags: ["PRO", "fiyat", "özellikler", "ücretli"]
    },
    {
      id: "6",
      question: "AI analizinin doğruluğu ne kadar? Güvenilir mi?",
      answer: "AI sistemimiz Google Gemini teknolojisi ile %99.8 doğruluk oranına sahiptir. Ancak önemli hukuki kararlar için mutlaka bir hukuk uzmanına danışmanızı öneriyoruz. Artiklo sadece belgeleri anlaşılır hale getirir, hukuki tavsiye vermez.",
      icon: CheckCircle,
      category: "teknoloji",
      priority: "high",
      tags: ["doğruluk", "AI", "güvenilirlik"]
    },
    {
      id: "7",
      question: "Hangi dosya formatlarını destekliyorsunuz?",
      answer: "PDF, Word (.docx), metin dosyaları (.txt) ve fotoğraf formatlarını (JPG, PNG) destekliyoruz. Metni kopyala-yapıştır yöntemiyle de analiz yapabilirsiniz. Belge kalitesi ne kadar yüksek olursa, analiz o kadar hassas olur.",
      icon: FileText,
      category: "teknik",
      priority: "medium",
      tags: ["format", "dosya", "yükleme"]
    },
    {
      id: "8",
      question: "Mobil uygulamanız var mı? Telefondan kullanabilir miyim?",
      answer: "Şu anda web platformumuz tüm cihazlarda mükemmel çalışmaktadır. Mobil-first tasarımımız sayesinde telefon ve tablet'ten rahatlıkla kullanabilirsiniz. Native mobil uygulamamız geliştirme aşamasındadır.",
      icon: Globe,
      category: "teknik",
      priority: "medium",
      tags: ["mobil", "uygulama", "telefon"]
    },
    {
      id: "9",
      question: "Hukuki tavsiye veriyor musunuz? Resmi belge niteliği var mı?",
      answer: "⚠️ KESİNLİKLE HAYIR! Artiklo hiçbir şekilde hukuki tavsiye, danışmanlık veya görüş vermez. Amacımız yalnızca karmaşık belgeleri anlaşılır hale getirmektir. Bu platform yapay zeka teknolojisi kullanır ve hata yapabilir. Herhangi bir yasal karar almadan, belge imzalamadan veya resmi işlem yapmadan önce MUTLAKA kalifiye bir hukuk uzmanına (avukata) danışmanız zorunludur.",
      icon: AlertTriangle,
      category: "onemli",
      priority: "high",
      tags: ["hukuki tavsiye", "sorumluluk", "uyarı"]
    },
    {
      id: "10",
      question: "Destek ekibinizle nasıl iletişime geçebilirim?",
      answer: "info@artiklo.com adresinden 24 saat içinde yanıt alabilir, platform üzerinden destek talebi oluşturabilir veya canlı destek özelliğimizi kullanabilirsiniz. PRO kullanıcıları öncelikli destek alır.",
      icon: Mail,
      category: "destek",
      priority: "medium",
      tags: ["iletişim", "destek", "yardım"]
    },
    {
      id: "11",
      question: "Aboneliğimi nasıl iptal edebilirim? Gizli ücret var mı?",
      answer: "Hesap ayarlarından tek tıkla iptal edebilirsiniz. Hiçbir uzun vadeli taahhüt yoktur. İptal ettiğinizde ödediğiniz dönem sonuna kadar kullanmaya devam edersiniz. Gizli ücret asla yoktur, tam şeffaflık sağlıyoruz.",
      icon: CheckCircle,
      category: "planlar",
      priority: "medium",
      tags: ["iptal", "şeffaflık", "ücret"]
    },
    {
      id: "12",
      question: "KURUMSAL plan kimler için uygun? Ne gibi avantajları var?",
      answer: "KURUMSAL plan (₺899/ay) avukat büroları, şirket hukuk departmanları ve hukuki danışmanlık firmaları için idealdir: 5 kullanıcı, 25 belge oluşturma, ekip yönetimi, paylaşımlı workspace, avukat modülleri ve öncelikli destek dahildir.",
      icon: Users,
      category: "planlar",
      priority: "medium",
      tags: ["kurumsal", "ekip", "avukat"]
    }
  ], []);

  const categories = [
    { id: 'all', name: 'Tümü', icon: BookOpen, count: faqData.length },
    { id: 'genel', name: 'Genel Sorular', icon: HelpCircle, count: faqData.filter(f => f.category === 'genel').length },
    { id: 'planlar', name: 'Planlar & Fiyatlandırma', icon: Star, count: faqData.filter(f => f.category === 'planlar').length },
    { id: 'guvenlik', name: 'Güvenlik & Gizlilik', icon: Shield, count: faqData.filter(f => f.category === 'guvenlik').length },
    { id: 'ozellikler', name: 'Özellikler', icon: Sparkles, count: faqData.filter(f => f.category === 'ozellikler').length },
    { id: 'teknoloji', name: 'Teknoloji', icon: Zap, count: faqData.filter(f => f.category === 'teknoloji').length },
    { id: 'teknik', name: 'Teknik Sorular', icon: FileText, count: faqData.filter(f => f.category === 'teknik').length },
    { id: 'destek', name: 'Destek', icon: MessageCircle, count: faqData.filter(f => f.category === 'destek').length },
    { id: 'onemli', name: 'Önemli Uyarılar', icon: AlertTriangle, count: faqData.filter(f => f.category === 'onemli').length }
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by priority
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [searchQuery, selectedCategory, faqData]);

  const stats = [
    {
      icon: HelpCircle,
      number: faqData.length.toString(),
      label: "SSS",
      description: "Kapsamlı sorular"
    },
    {
      icon: Clock,
      number: "< 2 dk",
      label: "Ortalama Okuma",
      description: "Hızlı cevaplar"
    },
    {
      icon: CheckCircle,
      number: "%98",
      label: "Sorun Çözme",
      description: "Başarı oranı"
    },
    {
      icon: Users,
      number: "24/7",
      label: "Destek",
      description: "Sürekli yardım"
    }
  ];

  const popularQuestions = faqData.filter(faq => faq.priority === 'high').slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <SEO
        title="Sık Sorulan Sorular (SSS)"
        description="Artiklo hakkında merak ettiklerinizi burada bulabilirsiniz. Belge analizi, dilekçe oluşturma, platform özellikleri, güvenlik, planlar ve teknik sorular hakkında detaylı cevaplar."
        keywords="SSS, sık sorulan sorular, yardım, destek, Artiklo sorular, belge analizi, dilekçe oluşturma"
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
            <MessageCircle className="h-4 w-4 mr-2" />
            Destek Merkezi
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-primary">Sık Sorulan</span>
            <span className="block">Sorular</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Artiklo hakkında merak ettiklerinizi burada bulabilirsiniz.
            Aradığınız cevabı bulamadıysanız bizimle iletişime geçmekten çekinmeyin.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Arama yapabilirsiniz</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Kategoriye göre filtreleyin</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24 saat içinde cevap</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
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

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Sorunuzu yazın veya anahtar kelime ile arayın..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Kategori Filtresi</div>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 4).map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{category.name}</span>
                          <span className="text-xs">({category.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Questions */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">En Popüler Sorular</h2>
              <p className="text-lg text-muted-foreground">
                En sık sorulan ve önemli sorular
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {popularQuestions.map((faq) => {
                const Icon = faq.icon;
                return (
                  <Card key={faq.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setOpenItems([faq.id])}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === faq.category)?.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({category.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Tüm Sorular' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredFAQs.length} soru bulundu
            </div>
          </div>

          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  Aradığınız kriterlere uygun soru bulunamadı. Farklı anahtar kelimeler deneyin veya kategori filtrelerini değiştirin.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Tüm Soruları Göster
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full space-y-4">
              {filteredFAQs.map((faq) => {
                const Icon = faq.icon;
                return (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                    <AccordionTrigger className="text-left hover:no-underline px-6 py-6">
                      <div className="flex items-center gap-4 w-full">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${faq.category === 'onemli' ? 'bg-red-100' : 'bg-primary/10'
                          } flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${faq.category === 'onemli' ? 'text-red-600' : 'text-primary'
                            }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base mb-1">{faq.question}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === faq.category)?.name}
                            </Badge>
                            {faq.priority === 'high' && (
                              <Badge className="text-xs bg-orange-100 text-orange-600">
                                <Star className="h-3 w-3 mr-1" />
                                Popüler
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-6">
                      <div className="pl-14">
                        {faq.answer}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {faq.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Başka sorularınız mı var?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Aradığınız cevabı bulamadınız mı? Size yardımcı olmaktan memnuniyet duyarız.
                Destek ekibimiz size 24 saat içinde yanıt verecektir.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="font-semibold px-8">
                  <a href="mailto:info@artiklo.com">
                    <Mail className="h-5 w-5 mr-2" />
                    Bize Ulaşın
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="font-semibold px-8">
                  <Link to="/auth">
                    Ücretsiz Denemeye Başla
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                ✓ 24 saat içinde yanıt  ✓ Türkçe destek  ✓ Ücretsiz yardım
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Options */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">E-posta Desteği</h3>
              <p className="text-sm text-muted-foreground mb-3">24 saat içinde yanıt</p>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@artiklo.com">info@artiklo.com</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Canlı Destek</h3>
              <p className="text-sm text-muted-foreground mb-3">Anlık yardım</p>
              <Button variant="outline" size="sm">
                Yakında
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telefon Desteği</h3>
              <p className="text-sm text-muted-foreground mb-3">Acil durumlar</p>
              <Button variant="outline" size="sm">
                Kurumsal Planlar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SSS;