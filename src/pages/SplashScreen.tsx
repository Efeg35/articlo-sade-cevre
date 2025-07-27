import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding-mobil', { replace: true });
    }, 2000); // 2 saniye bekle

    return () => clearTimeout(timer); // Component'ten çıkılırsa sayacı temizle
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background justify-center items-center text-center animate-pulse">
      <FileText className="w-24 h-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold text-foreground">Artiklo</h1>
    </div>
  );
};

export default SplashScreen; 