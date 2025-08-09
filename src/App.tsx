import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import { TemplatesPage } from "./pages/TemplatesPage";
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
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Platform detection utility
const getPlatformInfo = () => {
  try {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    return { isNative, platform };
  } catch (error) {
    console.error('[App] Platform detection hatası:', error);
    return { isNative: false, platform: 'web' };
  }
};

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarOnPages = ['/splash', '/onboarding-mobil', '/auth', '/login', '/signup'];
  const shouldHideNavbar = hideNavbarOnPages.includes(location.pathname);

  useEffect(() => {
    console.log('[MainLayout] Route changed:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

// Güvenli Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // İlk yüklemede kısa bir gecikme ile session durumunu kontrol et
    const timer = setTimeout(() => {
      console.log('[ProtectedRoute] Session check after initial load:', !!session, 'Path:', location.pathname);

      if (!session) {
        console.log('[ProtectedRoute] No session after timeout, redirecting to auth');
        navigate('/auth', { replace: true });
      } else {
        console.log('[ProtectedRoute] Session found, allowing access to:', location.pathname);
      }

      setIsInitialLoading(false);
    }, 100); // Session yüklenmesi için kısa gecikme

    return () => clearTimeout(timer);
  }, [session, navigate, location.pathname]);

  // Session durumu belirsizse (henüz yükleniyorsa) loading göster
  if (session === undefined || isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Session yoksa null döndür (yönlendirme useEffect'te yapılıyor)
  if (!session) {
    return null;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [platformInfo, setPlatformInfo] = useState(() => getPlatformInfo());

  // Platform detection'ı güncelle
  useEffect(() => {
    const info = getPlatformInfo();
    setPlatformInfo(info);
    console.log('[AppContent] Platform info:', info);
  }, []);

  // Güvenli geri tuş yönetimi
  useEffect(() => {
    if (!platformInfo.isNative) return;

    const handleBackButton = ({ canGoBack }: { canGoBack: boolean }) => {
      try {
        console.log('[AppContent] Back button pressed, canGoBack:', canGoBack);
        if (canGoBack) {
          window.history.back();
        } else {
          console.log('[AppContent] No more history to go back to.');
        }
      } catch (error) {
        console.error('[AppContent] Back button error:', error);
      }
    };

    try {
      CapacitorApp.addListener('backButton', handleBackButton);
      console.log('[AppContent] Back button listener added');
    } catch (error) {
      console.error('[AppContent] Failed to add back button listener:', error);
    }

    return () => {
      try {
        CapacitorApp.removeAllListeners();
        console.log('[AppContent] Back button listener removed');
      } catch (error) {
        console.error('[AppContent] Failed to remove back button listener:', error);
      }
    };
  }, [platformInfo.isNative]);

  // Mobil platformlarda splash screen yönetimi
  useEffect(() => {
    if (platformInfo.isNative && location.pathname === '/') {
      try {
        const isFirstLaunch = sessionStorage.getItem('firstLaunchDone') !== 'true';
        console.log('[AppContent] Mobile platform, first launch:', isFirstLaunch);

        if (isFirstLaunch) {
          sessionStorage.setItem('firstLaunchDone', 'true');
          console.log('[AppContent] Redirecting to splash screen');
          navigate('/splash', { replace: true });
        }
      } catch (error) {
        console.error('[AppContent] Splash screen redirect error:', error);
      }
    }
  }, [navigate, location, platformInfo.isNative]);

  // Auth durumuna göre route yönetimi - sadece auth sayfasından çıkarken
  useEffect(() => {
    console.log('[AppContent] Session state changed:', !!session, 'Current path:', location.pathname);

    // Sadece auth sayfasında olup da session geldiğinde dashboard'a yönlendir
    // Diğer durumlarda kullanıcıyı bulunduğu sayfada bırak
    if (session && location.pathname === '/auth') {
      console.log('[AppContent] User authenticated from auth page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [session, location.pathname, navigate]);

  // Route change logging
  useEffect(() => {
    console.log('[AppContent] Route changed to:', location.pathname);
  }, [location.pathname]);

  // Mobil platformlarda Index sayfasını render etme
  if (platformInfo.isNative && location.pathname === '/') {
    console.log('[AppContent] Mobile platform, showing splash screen instead of Index');
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Navbar'ın görüneceği public sayfalar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
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

        {/* Protected Routes with ErrorBoundary */}
        <Route path="/dashboard" element={
          <ErrorBoundary componentName="Dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/archive" element={
          <ErrorBoundary componentName="Archive">
            <ProtectedRoute>
              <ArchivePage />
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/templates" element={
          <ErrorBoundary componentName="Templates">
            <ProtectedRoute>
              <TemplatesPage />
            </ProtectedRoute>
          </ErrorBoundary>
        } />
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

const App = () => {
  const [supabase] = useState(() => supabaseClient);

  useEffect(() => {
    console.log('[App] App component mounted - Optimized for mobile security');
    return () => {
      console.log('[App] App component unmounted');
    };
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        {/* 🔧 TOOLTIP SYSTEM TAMAMEN KALDIRILDI - MAX GÜVENLİK VE PERFORMANS */}
        <BrowserRouter>
          <ErrorBoundary componentName="App">
            <AppContent />
          </ErrorBoundary>
          <Toaster />
          <Sonner />
        </BrowserRouter>
        {/* 🔧 TOOLTIP SYSTEM TAMAMEN KALDIRILDI - MAX GÜVENLİK VE PERFORMANS */}
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
