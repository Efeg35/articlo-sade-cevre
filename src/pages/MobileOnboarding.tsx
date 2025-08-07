import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';

// Onboarding resimlerinin listesi
const onboardingImages = [
  '/onboarding-1.png',
  '/onboarding-2.png',
  '/onboarding-3.png',
  '/onboarding-4.png',
];

const MobileOnboarding = () => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // Bir sonraki slayta geçmek için fonksiyon
  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // Onboarding'i bitirip ana uygulamaya geçmek için fonksiyon
  const finishOnboarding = useCallback(() => {
    // DÜZELTİLDİ: Yönlendirme hedefi artık doğrudan /auth ve geçmişi değiştir
    navigate('/auth', { replace: true });
  }, [navigate]);

  return (
    <div className="overflow-hidden h-screen bg-black" ref={emblaRef}>
      <div className="flex h-full">
        {onboardingImages.map((imgSrc, index) => (
          <div
            className="flex-[0_0_100%] min-w-0 h-full relative overflow-hidden"
            key={index}
          >
            <img
              src={imgSrc}
              alt={`Onboarding ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center 30%',
                backgroundColor: '#000'
              }}
            />

            {/* Bu kısım interaktif katman (görünmez butonlar) */}
            <div className="absolute inset-0 w-full h-full z-10">

              {/* İlk 3 slayt için sağ alttaki görünmez "İleri" butonu */}
              {index < 3 && (
                <button
                  onClick={scrollNext}
                  className="absolute bottom-[1%] right-[8%] w-[60px] h-[60px] rounded-full bg-transparent focus:outline-none cursor-pointer"
                  aria-label="Sonraki Adım"
                />
              )}

              {/* Son slayt (index 3) için "Hadi Başlayalım" görünmez butonu */}
              {index === 3 && (
                <button
                  onClick={finishOnboarding}
                  className="absolute bottom-[2%] left-0 right-0 mx-auto w-[65%] h-[60px] rounded-lg bg-transparent focus:outline-none cursor-pointer"
                  aria-label="Başlayalım"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileOnboarding;