import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding-mobil', { replace: true });
    }, 3000); // 3 saniye bekle

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Container */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
            <Scale className="w-16 h-16 text-white" />
          </div>
          {/* Glow Effect */}
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* App Name */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          Artiklo
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-gray-600 font-medium animate-fade-in-delay">
          Hukuki Belgeleri Anlaşılır Hale Getirin
        </p>

        {/* Loading Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </div>
  );
};

export default SplashScreen; 