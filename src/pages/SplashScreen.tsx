import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding-mobil', { replace: true });
    }, 2000); // 2 saniye bekle

    return () => clearTimeout(timer); // Component'ten çıkılırsa sayacı temizle
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