import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Home,
  Search,
  ArrowRight,
  Mail,
  MessageCircle,
  Book,
  HelpCircle,
  Calculator,
  FileCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search logic - redirect to relevant pages based on keywords
      const query = searchQuery.toLowerCase();
      if (query.includes('blog') || query.includes('makale')) {
        navigate('/blog');
      } else if (query.includes('fiyat') || query.includes('ücret')) {
        navigate('/fiyatlandirma');
      } else if (query.includes('sss') || query.includes('soru')) {
        navigate('/sss');
      } else if (query.includes('iletişim') || query.includes('destek')) {
        navigate('/iletisim');
      } else if (query.includes('nasıl') || query.includes('çalışır')) {
        navigate('/nasil-calisir');
      } else {
        navigate('/sss');
      }
    }
  };

  const popularPages = [
    {
      title: "Ana Sayfa",
      description: "Artiklo hakkında genel bilgiler",
      icon: Home,
      href: "/"
    },
    {
      title: "Nasıl Çalışır?",
      description: "Platform kullanımı hakkında bilgi",
      icon: HelpCircle,
      href: "/nasil-calisir"
    },
    {
      title: "Fiyatlandırma",
      description: "Paket seçenekleri ve fiyatlar",
      icon: Calculator,
      href: "/fiyatlandirma"
    },
    {
      title: "Blog",
      description: "Hukuki konularda faydalı makaleler",
      icon: Book,
      href: "/blog"
    },
    {
      title: "SSS",
      description: "Sık sorulan sorular ve cevapları",
      icon: MessageCircle,
      href: "/sss"
    },
    {
      title: "İletişim",
      description: "Bize ulaşın ve destek alın",
      icon: Mail,
      href: "/iletisim"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background pt-24">
      <div className="container mx-auto px-4 py-16">

        {/* Main Error Section */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            {/* Animated 404 */}
            <div className="relative inline-block">
              <span className="text-8xl md:text-9xl font-bold text-primary/20 select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse">
                  <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary animate-bounce" />
                </div>
              </div>
            </div>
          </div>

          <Badge variant="outline" className="mb-4">
            Sayfa Bulunamadı
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Aradığınız Sayfa Bulunamadı
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Üzgünüz, aradığınız sayfa mevcut değil, taşınmış veya geçici olarak kullanılamıyor olabilir.
            Aşağıdaki seçeneklerden birini deneyebilirsiniz.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="group">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              Geri Git
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Belki Bunu Arıyordunuz?</h2>
              <p className="text-muted-foreground">
                Arama yapmak için anahtar kelimeler girin
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="blog, fiyatlandırma, sss, iletişim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="group">
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Popüler arama terimleri:
                <button
                  onClick={() => navigate('/blog')}
                  className="text-primary hover:underline ml-1"
                >
                  blog
                </button>
                ,
                <button
                  onClick={() => navigate('/fiyatlandirma')}
                  className="text-primary hover:underline ml-1"
                >
                  fiyatlar
                </button>
                ,
                <button
                  onClick={() => navigate('/sss')}
                  className="text-primary hover:underline ml-1"
                >
                  sss
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Popüler Sayfalar
            </h2>
            <p className="text-muted-foreground">
              En çok ziyaret edilen sayfalarımıza göz atabilirsiniz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPages.map((page, index) => {
              const Icon = page.icon;
              return (
                <Link key={index} to={page.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors flex items-center">
                            {page.title}
                            <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {page.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Hâlâ Aradığınızı Bulamadınız mı?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Size yardımcı olmak için buradayız. Destek ekibimizle iletişime geçin
                veya SSS sayfamızı inceleyin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link to="/iletisim">
                  <Mail className="h-4 w-4 mr-2" />
                  Destek Ekibi
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/sss">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  SSS'leri İncele
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Code Details */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Hata Kodu:</strong> 404 - Sayfa Bulunamadı
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Bu hatayı tekrar yaşıyorsanız, lütfen destek ekibimizle iletişime geçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
