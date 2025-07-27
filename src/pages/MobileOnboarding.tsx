import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck2, Sparkles, UploadCloud, Scale, BookOpen, Shield } from 'lucide-react';

const features = [
  {
    icon: <UploadCloud className="w-16 h-16 text-white" />,
    title: 'Belgelerinizi Yükleyin',
    description: 'Hukuki belgelerinizi güvenle sisteme yükleyin ve analiz için hazırlayın.',
    bgColor: 'from-gray-600 to-gray-700',
    image: '/onboarding-1.jpg' // DÜZELTİLDİ
  },
  {
    icon: <Sparkles className="w-16 h-16 text-white" />,
    title: 'Yapay Zeka ile Sadeleştirin',
    description: 'Karmaşık hukuki metinleri anlaşılır ve basit bir dile çevirelim.',
    bgColor: 'from-gray-500 to-gray-600',
    image: '/onboarding-2.jpg' // DÜZELTİLDİ
  },
  {
    icon: <FileCheck2 className="w-16 h-16 text-white" />,
    title: 'Anlayın ve Oluşturun',
    description: 'Özetler alın, eylem planları çıkarın ve yeni belgeler oluşturun.',
    bgColor: 'from-gray-700 to-gray-800',
    image: '/onboarding-3.png' // BU ZATEN DOĞRUYDU
  },
  {
    icon: <Shield className="w-16 h-16 text-white" />,
    title: 'Güvenle Kullanın',
    description: 'KVKK uyumlu, güvenli ve gizli bir şekilde hukuki belgelerinizi işleyin.',
    bgColor: 'from-gray-600 to-gray-700',
    image: '/onboarding-4.jpg' // DÜZELTİLDİ
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
    <div className="overflow-hidden h-screen flex flex-col">
      <div className="flex-grow relative" ref={emblaRef}>
        <div className="flex h-full">
          {features.map((feature, index) => (
            <div className="flex-[0_0_100%] min-w-0 h-full" key={index}>
              {/* Üst kısım - Görsel */}
              <div className={`h-2/3 bg-gradient-to-br ${feature.bgColor} flex flex-col items-center justify-center relative overflow-hidden`}>
                {/* Arka plan deseni */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full"></div>
                  <div className="absolute top-20 right-16 w-16 h-16 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full"></div>
                </div>
                
                {/* Onboarding görseli */}
                <div className="relative z-10 flex items-center justify-center mb-8">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-64 h-64 object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Alt kısım - Beyaz arka plan */}
              <div className="h-1/3 bg-white flex flex-col items-center justify-center px-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  {feature.description}
                </p>
                
                {/* Step indicator */}
                <div className="flex space-x-2 mt-6">
                  {features.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === index ? 'bg-gray-900 scale-125' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer - Beyaz arka plan */}
      <div className="bg-white p-6 border-t border-gray-100">
        <Button 
          size="lg" 
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-medium text-lg shadow-lg transition-all duration-300 hover:scale-105" 
          onClick={handleNext}
        >
          {emblaApi && emblaApi.canScrollNext() ? 'Devam Et' : 'Başlayalım'}
        </Button>
      </div>
    </div>
  );
};

export default MobileOnboarding;