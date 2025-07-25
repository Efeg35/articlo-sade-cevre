import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, HelpCircle, Shield, FileText, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SSS = () => {
  const faqData = [
    {
      id: "1",
      question: "Artiklo nedir ve nasıl çalışır?",
      answer: "Artiklo, karmaşık hukuki belgeleri anlaşılır Türkçeye çeviren yapay zeka destekli bir platformdur. Belgenizi yükleyin, AI analizimiz sayesinde saniyeler içinde sade bir açıklama alın.",
      icon: HelpCircle
    },
    {
      id: "2", 
      question: "Hangi belge türlerini destekliyorsunuz?",
      answer: "Kira sözleşmeleri, mahkeme kararları, tebligatlar, veraset ilamları, icra takip belgeleri, sigorta poliçeleri ve diğer hukuki metinleri analiz edebiliyoruz.",
      icon: FileText
    },
    {
      id: "3",
      question: "Belgelerim güvende mi?",
      answer: "Evet, tüm belgeleriniz en yüksek güvenlik standartlarıyla korunur. Verileriniz şifrelenir ve analiz sonrası silinir. Hiçbir bilginiz üçüncü taraflarla paylaşılmaz.",
      icon: Shield
    },
    {
      id: "4",
      question: "Ücretsiz sürümde kaç belge analiz edebilirim?",
      answer: "Ücretsiz hesabınızla ayda 3 belge analiz edebilirsiniz. Daha fazla analiz için PRO planımıza geçebilirsiniz.",
      icon: Users
    },
    {
      id: "5",
      question: "PRO plan neler sunuyor?",
      answer: "PRO planımızla sınırsız belge analizi, öncelikli destek, dosya yükleme özelliği ve gelişmiş AI modeli kullanabilirsiniz.",
      icon: Zap
    },
    {
      id: "6",
      question: "Analizin doğruluğu ne kadar?",
      answer: "AI sistemimiz %95+ doğruluk oranına sahiptir. Ancak önemli kararlar için mutlaka bir hukuk uzmanına danışmanızı öneriyoruz.",
      icon: Shield
    },
    {
      id: "7",
      question: "Hangi dosya formatlarını destekliyorsunuz?",
      answer: "PDF, Word (.docx), metin dosyaları (.txt) ve fotoğraf formatlarını (JPG, PNG) destekliyoruz. Metni kopyala-yapıştır yöntemiyle de analiz yapabilirsiniz.",
      icon: FileText
    },
    {
      id: "8",
      question: "Mobil uygulamanız var mı?",
      answer: "Şu anda web platformumuz tüm cihazlarda mükemmel çalışmaktadır. Mobil uygulamamız geliştirme aşamasındadır.",
      icon: Users
    },
    {
      id: "9",
      question: "Hukuki tavsiye veriyor musunuz?",
      answer: "Hayır, Artiklo hukuki tavsiye vermez. Amacımız belgeleri anlaşılır hale getirmektir. Hukuki kararlar için mutlaka avukata danışın.",
      icon: HelpCircle
    },
    {
      id: "10",
      question: "Destek ekibinizle nasıl iletişime geçebilirim?",
      answer: "info@artiklo.com adresinden bizimle iletişime geçebilir veya platform üzerinden destek talebi oluşturabilirsiniz.",
      icon: Mail
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Destek Merkezi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sık Sorulan Sorular
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Artiklo hakkında merak ettiklerinizi burada bulabilirsiniz. Aradığınız cevabı bulamadıysanız bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg mb-4 px-6">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pl-13">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  Başka sorularınız mı var?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Aradığınız cevabı bulamadınız mı? Size yardımcı olmaktan memnuniyet duyarız. Destek ekibimiz size 24 saat içinde yanıt verecektir.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:info@artiklo.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Bize Ulaşın
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">
                    Ücretsiz Denemeye Başla
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
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
              <div className="text-sm text-muted-foreground">Analiz Edilen Belge</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">%95+</div>
              <div className="text-sm text-muted-foreground">Doğruluk Oranı</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SSS; 