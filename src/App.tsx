import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
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
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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

// Yeni: Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute session check:', session);
    if (!session) {
      console.log('No session, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [session, navigate]);

  if (!session) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();

  // Geri tuş yönetimi
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          console.log('No more history to go back to.');
        }
      });
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);

  // İlk açılışta splash ekranına yönlendirme mantığı
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const isFirstLaunch = sessionStorage.getItem('firstLaunchDone') !== 'true';
      if (isFirstLaunch && location.pathname === '/') {
        sessionStorage.setItem('firstLaunchDone', 'true');
        navigate('/splash', { replace: true });
      }
    }
  }, [navigate, location]);

  // Auth durumuna göre route yönetimi
  useEffect(() => {
    console.log('Session state:', session);
    if (session && location.pathname === '/auth') {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [session, location, navigate]);

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

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/archive" element={
          <ProtectedRoute>
            <ArchivePage />
          </ProtectedRoute>
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

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
