import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Users, 
  Lightbulb, 
  ArrowRight,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Hakkimizda = () => {
  const values = [
    {
      icon: Heart,
      title: "Önce İnsan",
      description: "Teknolojiyi insanlar için geliştiriyoruz. Arayüzümüzün sadeliğinden metinlerimizin anlaşılırlığına kadar her detayda, odağımızda her zaman siz varsınız."
    },
    {
      icon: Shield,
      title: "Gizliliğin Kutsallığı",
      description: "Güven, her şeyden önce gelir. Verilerinizin sadece size ait olduğuna inanıyor ve bu ilkeyi sarsılmaz bir taahhütle koruyoruz."
    },
    {
      icon: Users,
      title: "Erişilebilirlik",
      description: "Bilgi temel bir haktır. Bu hakka erişimin önünde finansal veya teknik hiçbir engel olmamalıdır."
    },
    {
      icon: Lightbulb,
      title: "Cesaret ve İnovasyon",
      description: "Statükoya meydan okumaktan ve en zor sorunlara teknolojiyle çözüm aramaktan asla çekinmeyiz."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Hikayemiz
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Bir Fikirden Daha Fazlası: <br />
            <span className="text-primary">Artiklo'nun Hikayesi</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Her şey basit bir soruyla başladı: Hayatımızı doğrudan etkileyen belgeleri 
            neden anlamak zorunda değilmişiz gibi davranıyoruz?
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="mb-16 max-w-5xl mx-auto">
          <CardContent className="p-8">
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Bir mahkeme tebligatı, bir kira kontratı, bir veraset ilamı... Bu belgelerle karşılaştığımızda 
              hissettiğimiz o yabancılık ve çaresizlik hissini hepimiz biliriz. Anlamadığımız bir dil yüzünden 
              haklarımızın kaybolabileceği veya yanlış bir adım atabileceğimiz korkusuyla yaşarız.
              <br /><br />
              <strong className="text-foreground">Biz, bu duruma bir son vermek için yola çıktık.</strong> 
              {" "}Bilginin, sadece hukukçuların veya uzmanların elinde bir güç olduğu bir dünyayı kabul etmedik. 
              Artiklo, bu inancın bir ürünüdür.
            </p>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Misyonumuz</CardTitle>
              <p className="text-lg font-medium text-primary">Bilgiyi Demokratikleştirmek</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                En karmaşık hukuki, resmi ve bürokratik dili herkes için anında anlaşılır, 
                erişilebilir ve eyleme geçirilebilir bilgiye dönüştürmektir. Teknolojiyi, 
                vatandaş ile adalet arasındaki duvarları yıkmak için bir köprü olarak kullanıyoruz.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Vizyonumuz</CardTitle>
              <p className="text-lg font-medium text-primary">Herkes İçin Dijital Adalet</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Türkiye'de ve dünyada hukuki okuryazarlığın bir lüks değil, bir standart haline geldiği 
                bir gelecek hayal ediyoruz. Hiç kimsenin, anlamadığı bir belge yüzünden geceleri 
                uykusunun kaçmadığı bir dünya yaratmak, bizim en büyük hedefimizdir.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bize Yol Gösteren Değerler</h2>
            <p className="text-lg text-muted-foreground">
              Her kararımızın arkasında duran ilkeler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
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

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Bu Yolculuğun Bir Parçası Olun
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Artiklo, bir ekipten daha fazlasıdır; ortak bir amaca inanan bir topluluktur. 
                  Bu vizyonu paylaşıyorsanız, sizi de aramızda görmekten mutluluk duyarız.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="font-semibold">
                  <Link to="/auth">
                    <Zap className="h-4 w-4 mr-2" />
                    Artiklo'yu Şimdi Deneyin
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="font-semibold">
                  <Link to="/neden-artiklo">
                    Neden Bizi Seçmelisiniz?
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Mutlu Kullanıcı</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Sadeleştirilen Belge</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">%99.9</div>
              <div className="text-sm text-muted-foreground">Doğruluk Oranı</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hakkimizda; 