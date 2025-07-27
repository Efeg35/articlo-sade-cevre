import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck2, Sparkles, UploadCloud, ChevronRight, Check } from 'lucide-react';

const features = [
  {
    icon: <UploadCloud className="w-20 h-20 text-white" />,
    title: 'Belgelerinizi Yükleyin',
    description: 'PDF, DOCX veya resim formatındaki hukuki belgelerinizi güvenle sisteme yükleyin.',
    bgGradient: 'from-blue-500 to-blue-600',
    iconBg: 'from-blue-400 to-blue-500'
  },
  {
    icon: <Sparkles className="w-20 h-20 text-white" />,
    title: 'Yapay Zeka ile Sadeleştirin',
    description: 'Karmaşık hukuki metinleri anlaşılır, sade Türkçeye çevirin.',
    bgGradient: 'from-purple-500 to-purple-600',
    iconBg: 'from-purple-400 to-purple-500'
  },
  {
    icon: <FileCheck2 className="w-20 h-20 text-white" />,
    title: 'Özet ve Eylem Planı Alın',
    description: 'Belgelerinizin özetini çıkarın, eylem planları oluşturun ve yeni taslaklar hazırlayın.',
    bgGradient: 'from-green-500 to-green-600',
    iconBg: 'from-green-400 to-green-500'
  },
];

const MobileOnboarding = () => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [emblaApi, navigate]);

  const handleSlideChange = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useCallback(() => {
    if (!emblaApi) return;
    emblaApi.on('select', handleSlideChange);
    return () => emblaApi.off('select', handleSlideChange);
  }, [emblaApi, handleSlideChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Header */}
      <div className="relative z-10 pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Artiklo
            </span>
          </div>
          <div className="flex space-x-1">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="flex-1 relative" ref={emblaRef}>
        <div className="flex h-full">
          {features.map((feature, index) => (
            <div className="flex-[0_0_100%] min-w-0 h-full px-6" key={index}>
              <div className="h-full flex flex-col justify-center">
                {/* Feature Card */}
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    {/* Icon Container */}
                    <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {feature.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 right-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute bottom-1/4 left-4 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={handleNext}
        >
          {currentSlide === features.length - 1 ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Başlayalım
            </>
          ) : (
            <>
              Devam Et
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileOnboarding; 