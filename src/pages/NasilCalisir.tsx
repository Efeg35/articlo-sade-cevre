import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, MessageSquareText, CheckCircle2 } from "lucide-react";

const NasilCalisir = () => {
  const steps = [
    {
      number: 1,
      title: "Belgenizi Yükleyin",
      description: "PDF, Word veya fotoğraf formatındaki hukuki belgenizi platforma yükleyin.",
      icon: FileText
    },
    {
      number: 2,
      title: "Yapay Zeka Analizi",
      description: "Gelişmiş AI teknolojimiz belgenizi analiz eder ve önemli noktaları tespit eder.",
      icon: Sparkles
    },
    {
      number: 3,
      title: "Sade Türkçe Açıklama",
      description: "Saniyeler içinde belgenizin anlaşılır bir özetini ve yapmanız gerekenleri görün.",
      icon: MessageSquareText
    },
    {
      number: 4,
      title: "Akıllı Özetleme",
      description: "Belgenin kritik bilgilerini içeren 'Yönetici Özeti' ve vurgulanan önemli noktalar sunulur.",
      icon: CheckCircle2
    },
    {
      number: 5,
      title: "'Sizin İçin Anlamı' Analizi",
      description: "Belgenin sizi nasıl etkilediğini açıklayan özel bir bölüm sunar.",
      icon: MessageSquareText
    },
    {
      number: 6,
      title: "Eylem Planı",
      description: "Belgeyle ilgili atmanız gereken adımları somut bir liste halinde görün.",
      icon: CheckCircle2
    },
    {
      number: 7,
      title: "Kilit Varlık Tespiti",
      description: "Metin içindeki önemli bilgiler (tarihler, tutarlar, isimler vb.) otomatik olarak tespit edilir ve ayrı bir liste halinde sunulur.",
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nasıl Çalışır?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Artiklo ile hukuki belgeleri anlamak çok kolay. İşte adım adım süreç:
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NasilCalisir; 