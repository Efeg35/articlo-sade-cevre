import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck2, Sparkles, UploadCloud } from 'lucide-react';

const features = [
  {
    icon: <UploadCloud className="w-24 h-24 text-primary" />,
    title: 'Yükle',
    description: 'PDF, DOCX veya resim formatındaki belgelerinizi güvenle uygulamaya yükleyin.',
  },
  {
    icon: <Sparkles className="w-24 h-24 text-primary" />,
    title: 'Sadeleştir',
    description: 'Yapay zekamız, anlaşılması zor metinleri sizin için sade ve anlaşılır bir dile çevirsin.',
  },
  {
    icon: <FileCheck2 className="w-24 h-24 text-primary" />,
    title: 'Anla ve Oluştur',
    description: 'Özetleri alın, eylem planları çıkarın ve hatta tek tıkla yeni belge taslakları oluşturun.',
  },
];

const MobileOnboarding = () => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const handleNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      // Son karttaysa, dashboard'a yönlendir ve geçmişi değiştir
      navigate('/dashboard', { replace: true });
    }
  }, [emblaApi, navigate]);

  return (
    <div className="overflow-hidden h-screen bg-background flex flex-col">
      <div className="flex-grow" ref={emblaRef}>
        <div className="flex h-full">
          {features.map((feature, index) => (
            <div className="flex-[0_0_100%] min-w-0 h-full p-6" key={index}>
              <Card className="h-full border-none shadow-none flex flex-col justify-center items-center text-center bg-transparent">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="mb-8">{feature.icon}</div>
                  <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-lg text-muted-foreground max-w-xs">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <footer className="w-full p-6">
        <Button size="lg" className="w-full text-lg" onClick={handleNext}>
          İleri
        </Button>
      </footer>
    </div>
  );
};

export default MobileOnboarding; 