import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck2, Sparkles, UploadCloud } from 'lucide-react';

const features = [
  {
    icon: <UploadCloud className="w-20 h-20 text-primary-foreground" />,
    title: 'Belgelerinizi Yükleyin',
    description: 'PDF, DOCX veya resim formatındaki hukuki belgelerinizi güvenle sisteme yükleyin.',
    bgColor: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Sparkles className="w-20 h-20 text-primary-foreground" />,
    title: 'Yapay Zeka ile Sadeleştirin',
    description: 'Karmaşık hukuki metinleri sizin için anlaşılır ve basit bir dile çevirelim.',
    bgColor: 'from-purple-500 to-purple-600',
  },
  {
    icon: <FileCheck2 className="w-20 h-20 text-primary-foreground" />,
    title: 'Anlayın ve Oluşturun',
    description: 'Özetler alın, eylem planları çıkarın ve yeni belgeler oluşturun.',
    bgColor: 'from-green-500 to-green-600',
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
    <div className="overflow-hidden h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col relative">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Progress bar */}
      <div className="relative z-10 w-full h-1 bg-muted mt-4">
        <div className="h-full bg-primary transition-all duration-500 ease-out" 
             style={{ width: emblaApi ? `${((emblaApi.selectedScrollSnap() + 1) / features.length) * 100}%` : '33.33%' }}>
        </div>
      </div>

      <div className="flex-grow relative z-10" ref={emblaRef}>
        <div className="flex h-full">
          {features.map((feature, index) => (
            <div className="flex-[0_0_100%] min-w-0 h-full p-6" key={index}>
              <Card className="h-full border-none shadow-none flex flex-col justify-center items-center text-center bg-transparent">
                <CardContent className="flex flex-col items-center justify-center p-0 space-y-8">
                  {/* İkon container */}
                  <div className={`w-32 h-32 bg-gradient-to-br ${feature.bgColor} rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 transform transition-all duration-300 hover:scale-105`}>
                    {feature.icon}
                  </div>
                  
                  {/* İçerik */}
                  <div className="space-y-4 max-w-sm">
                    <h2 className="text-3xl font-bold text-foreground">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Step indicator */}
                  <div className="flex space-x-2">
                    {features.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i === index ? 'bg-primary scale-125' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full p-6 relative z-10">
        <Button 
          size="lg" 
          className="w-full text-lg h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105" 
          onClick={handleNext}
        >
          {emblaApi && emblaApi.canScrollNext() ? 'Devam Et' : 'Başlayalım'}
        </Button>
      </footer>
    </div>
  );
};

export default MobileOnboarding; 