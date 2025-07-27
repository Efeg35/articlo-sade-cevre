import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Capacitor } from '@capacitor/core';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import Navbar from "./components/Navbar";
import MobileOnboarding from "./pages/MobileOnboarding";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import NedenArtiklo from "./pages/NedenArtiklo";
import Yorumlar from "./pages/Yorumlar";
import Senaryolar from "./pages/Senaryolar";
import SSS from "./pages/SSS";
import Hakkimizda from "./pages/Hakkimizda";
import KullaniciSozlesmesi from "./pages/KullaniciSozlesmesi";
import KvkkAydinlatma from "./pages/KvkkAydinlatma";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MobileWelcome from "./pages/MobileWelcome";
import NasilCalisir from "./pages/NasilCalisir";
import Fiyatlandirma from "./pages/Fiyatlandirma";
import RehberPage from "./pages/RehberPage";
import RehberDetayPage from "./pages/RehberDetayPage";
import PartnerSignUpPage from "./pages/partner/PartnerSignUpPage";
import PartnerLoginPage from "./pages/partner/PartnerLoginPage";
import ProfilePage from "./pages/partner/ProfilePage";
import DashboardPage from "./pages/partner/DashboardPage";
import ApplicationPage from "./pages/partner/ApplicationPage";

const queryClient = new QueryClient();

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarOnPages = ['/splash', '/onboarding-mobil', '/auth', '/login', '/signup'];
  const shouldHideNavbar = hideNavbarOnPages.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- YENİ VE GELİŞMİŞ YÖNLENDİRME MANTIĞI ---
  useEffect(() => {
    // Eğer uygulama native bir mobil platformda çalışıyorsa (iOS veya Android)
    if (Capacitor.isNativePlatform()) {
      // Ve bu, oturumdaki ilk açılışsa (kullanıcı uygulama içinde ana sayfaya dönerse tekrar yönlenmesin diye)
      const isFirstLaunch = sessionStorage.getItem('firstLaunchDone') !== 'true';
      
      if (isFirstLaunch && location.pathname === '/') {
        // İlk açılış olduğunu işaretle ve bir daha yönlendirme yapma
        sessionStorage.setItem('firstLaunchDone', 'true');
        // Splash ekranına yönlendir
        navigate('/splash', { replace: true });
      }
    }
  }, [navigate, location]);

  return (
    <Routes>
      {/* Navbar'ın görüneceği sayfalar MainLayout içinde */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/nasil-calisir" element={<NasilCalisir />} />
        <Route path="/fiyatlandirma" element={<Fiyatlandirma />} />
        <Route path="/neden-artiklo" element={<NedenArtiklo />} />
        <Route path="/yorumlar" element={<Yorumlar />} />
        <Route path="/senaryolar" element={<Senaryolar />} />
        <Route path="/sss" element={<SSS />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/kullanici-sozlesmesi" element={<KullaniciSozlesmesi />} />
        <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        {/* <Route path="/rehber" element={<RehberPage />} /> */}
        {/* <Route path="/rehber/:slug" element={<RehberDetayPage />} /> */}
        {/* <Route path="/partner/basvuru" element={<ApplicationPage />} /> */}
        {/* <Route path="/partner/kayit-ol" element={<PartnerSignUpPage />} /> */}
        {/* <Route path="/partner/giris-yap" element={<PartnerLoginPage />} /> */}
        {/* <Route path="/partner/profil" element={<ProfilePage />} /> */}
        {/* <Route path="/partner/dashboard" element={<DashboardPage />} /> */}
      </Route>
      
      {/* Navbar'ın görünmeyeceği, tam ekran sayfalar */}
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/onboarding-mobil" element={<MobileOnboarding />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
