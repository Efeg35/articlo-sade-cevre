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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted justify-center items-center text-center relative overflow-hidden">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Ana içerik */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo container */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 animate-pulse">
            <img 
              src="/icon.png" 
              alt="Artiklo Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          {/* Glow efekti */}
          <div className="absolute inset-0 w-32 h-32 bg-primary/20 rounded-3xl blur-xl animate-pulse"></div>
        </div>
        
        {/* Başlık */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Artiklo
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Hukuki Belgelerinizi Anlayın
          </p>
        </div>
        
        {/* Loading animasyonu */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 