import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[SplashScreen] Component mounted');

    const timer = setTimeout(() => {
      console.log('[SplashScreen] Timer expired, navigating to onboarding-mobil');
      try {
        navigate('/onboarding-mobil', { replace: true });
        console.log('[SplashScreen] Navigation called successfully');
      } catch (error) {
        console.error('[SplashScreen] Navigation error:', error);
      }
    }, 2000); // 2 saniye bekle

    return () => {
      console.log('[SplashScreen] Component unmounting, clearing timer');
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white justify-center items-center">
      {/* Sadece logo - daha yukarıda */}
      <div className="flex justify-center items-center mb-32">
        <img
          src="/splash.png"
          alt="Artiklo Logo"
          className="w-[500px] h-[500px] object-contain"
        />
      </div>
    </div>
  );
};

export default SplashScreen; 