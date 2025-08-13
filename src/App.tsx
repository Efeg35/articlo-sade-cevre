import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { useAnalytics } from "./hooks/useAnalytics";
import ErrorBoundary from "./components/ErrorBoundary";
import { Logger } from "@/utils/logger";

// Critical pages - immediate load
import Index from "./pages/Index";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

// Lazy loaded pages - route-based code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage").then(module => ({ default: module.TemplatesPage })));
const NotificationSettingsPage = lazy(() => import("./pages/NotificationSettingsPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Admin pages - lazy load
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminDocuments = lazy(() => import("./pages/admin/AdminDocuments"));
const AdminSystem = lazy(() => import("./pages/admin/AdminSystem"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));

// Public pages - lazy load
const NasilCalisir = lazy(() => import("./pages/NasilCalisir"));
const Fiyatlandirma = lazy(() => import("./pages/Fiyatlandirma"));
const NedenArtiklo = lazy(() => import("./pages/NedenArtiklo"));
const Yorumlar = lazy(() => import("./pages/Yorumlar"));
const Senaryolar = lazy(() => import("./pages/Senaryolar"));
const SSS = lazy(() => import("./pages/SSS"));
const Hakkimizda = lazy(() => import("./pages/Hakkimizda"));
const KullaniciSozlesmesi = lazy(() => import("./pages/KullaniciSozlesmesi"));
const KvkkAydinlatma = lazy(() => import("./pages/KvkkAydinlatma"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Mobile specific pages
const MobileOnboarding = lazy(() => import("./pages/MobileOnboarding"));
const MobileWelcome = lazy(() => import("./pages/MobileWelcome"));

// Guide pages
const RehberPage = lazy(() => import("./pages/RehberPage"));
const RehberDetayPage = lazy(() => import("./pages/RehberDetayPage"));

// Partner pages
const PartnerSignUpPage = lazy(() => import("./pages/partner/PartnerSignUpPage"));
const PartnerLoginPage = lazy(() => import("./pages/partner/PartnerLoginPage"));
const ProfilePage = lazy(() => import("./pages/partner/ProfilePage"));
const DashboardPage = lazy(() => import("./pages/partner/DashboardPage"));
const ApplicationPage = lazy(() => import("./pages/partner/ApplicationPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Sayfa yükleniyor...</p>
    </div>
  </div>
);

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
    Logger.error('App', 'Platform detection error', error);
    return { isNative: false, platform: 'web' };
  }
};

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarOnPages = ['/splash', '/onboarding-mobil', '/auth', '/login', '/signup'];
  const shouldHideNavbar = hideNavbarOnPages.includes(location.pathname);

  useEffect(() => {
    Logger.debug('MainLayout', 'Route changed', { pathname: location.pathname });
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
      Logger.log('ProtectedRoute', 'Session check after initial load', {
        hasSession: !!session,
        pathname: location.pathname
      });

      if (!session) {
        Logger.log('ProtectedRoute', 'No session after timeout, redirecting to auth');
        navigate('/auth', { replace: true });
      } else {
        Logger.log('ProtectedRoute', 'Session found, allowing access', { pathname: location.pathname });
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

  // Initialize analytics tracking
  useAnalytics();

  // Platform detection'ı güncelle
  useEffect(() => {
    const info = getPlatformInfo();
    setPlatformInfo(info);
    Logger.log('AppContent', 'Platform info updated', info);
  }, []);

  // Native iOS platform için CSS sınıfı ekle
  useEffect(() => {
    if (platformInfo.isNative && platformInfo.platform === 'ios') {
      document.body.classList.add('native-ios-platform');
      Logger.log('AppContent', 'Added native-ios-platform class to body');

      return () => {
        document.body.classList.remove('native-ios-platform');
        Logger.log('AppContent', 'Removed native-ios-platform class from body');
      };
    }
  }, [platformInfo.isNative, platformInfo.platform]);

  // Global StatusBar ayarları
  useEffect(() => {
    if (!platformInfo.isNative) return;

    const setGlobalStatusBar = async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        Logger.log('AppContent', 'Global StatusBar set to dark style');
      } catch (error) {
        Logger.error('AppContent', 'Global StatusBar error (normal)', error);
      }
    };

    setGlobalStatusBar();
  }, [platformInfo.isNative]);

  // Güvenli geri tuş yönetimi
  useEffect(() => {
    if (!platformInfo.isNative) return;

    const handleBackButton = ({ canGoBack }: { canGoBack: boolean }) => {
      try {
        Logger.log('AppContent', 'Back button pressed', { canGoBack });
        if (canGoBack) {
          window.history.back();
        } else {
          Logger.log('AppContent', 'No more history to go back to');
        }
      } catch (error) {
        Logger.error('AppContent', 'Back button error', error);
      }
    };

    try {
      CapacitorApp.addListener('backButton', handleBackButton);
      Logger.log('AppContent', 'Back button listener added');
    } catch (error) {
      Logger.error('AppContent', 'Failed to add back button listener', error);
    }

    return () => {
      try {
        CapacitorApp.removeAllListeners();
        Logger.log('AppContent', 'Back button listener removed');
      } catch (error) {
        Logger.error('AppContent', 'Failed to remove back button listener', error);
      }
    };
  }, [platformInfo.isNative]);

  // Mobil platformlarda splash screen yönetimi
  useEffect(() => {
    if (platformInfo.isNative && location.pathname === '/') {
      try {
        const isFirstLaunch = sessionStorage.getItem('firstLaunchDone') !== 'true';
        Logger.log('AppContent', 'Mobile platform first launch check', { isFirstLaunch });

        if (isFirstLaunch) {
          sessionStorage.setItem('firstLaunchDone', 'true');
          Logger.log('AppContent', 'Redirecting to splash screen');
          navigate('/splash', { replace: true });
        }
      } catch (error) {
        Logger.error('AppContent', 'Splash screen redirect error', error);
      }
    }
  }, [navigate, location, platformInfo.isNative]);

  // Auth durumuna göre route yönetimi - sadece auth sayfasından çıkarken
  useEffect(() => {
    Logger.log('AppContent', 'Session state changed', {
      hasSession: !!session,
      pathname: location.pathname
    });

    // Sadece auth sayfasında olup da session geldiğinde dashboard'a yönlendir
    // Diğer durumlarda kullanıcıyı bulunduğu sayfada bırak
    if (session && location.pathname === '/auth') {
      Logger.log('AppContent', 'User authenticated from auth page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [session, location.pathname, navigate]);

  // Route change logging
  useEffect(() => {
    Logger.debug('AppContent', 'Route changed', { pathname: location.pathname });
  }, [location.pathname]);

  // Mobil platformlarda Index sayfasını render etme
  if (platformInfo.isNative && location.pathname === '/') {
    Logger.log('AppContent', 'Mobile platform, showing splash screen instead of Index');
    return <SplashScreen />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
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

          {/* Protected Routes with ErrorBoundary and Lazy Loading */}
          <Route path="/dashboard" element={
            <ErrorBoundary componentName="Dashboard">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/archive" element={
            <ErrorBoundary componentName="Archive">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ArchivePage />
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/templates" element={
            <ErrorBoundary componentName="Templates">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <TemplatesPage />
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/notifications" element={
            <ErrorBoundary componentName="Notifications">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <NotificationSettingsPage />
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          {/* Admin Routes - Protected with AdminLayout */}
          <Route path="/admin" element={
            <ErrorBoundary componentName="Admin">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/admin/users" element={
            <ErrorBoundary componentName="AdminUsers">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/admin/analytics" element={
            <ErrorBoundary componentName="AdminAnalytics">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/admin/settings" element={
            <ErrorBoundary componentName="AdminSettings">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/admin/documents" element={
            <ErrorBoundary componentName="AdminDocuments">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminDocuments />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/admin/system" element={
            <ErrorBoundary componentName="AdminSystem">
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout>
                    <AdminSystem />
                  </AdminLayout>
                </Suspense>
              </ProtectedRoute>
            </ErrorBoundary>
          } />
        </Route>

        {/* Navbar'ın görünmeyeceği, tam ekran sayfalar */}
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/onboarding-mobil" element={
          <Suspense fallback={<PageLoader />}>
            <MobileOnboarding />
          </Suspense>
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        {/* 🔒 Password Reset Page - No navbar */}
        <Route path="/reset-password" element={
          <Suspense fallback={<PageLoader />}>
            <ResetPassword />
          </Suspense>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  const [supabase] = useState(() => supabaseClient);

  useEffect(() => {
    Logger.log('App', 'App component mounted - Optimized for mobile security');
    return () => {
      Logger.log('App', 'App component unmounted');
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
