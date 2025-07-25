import { useEffect } from "react";
import { usePlatform } from "@/hooks/usePlatform";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Navbar from "@/components/Navbar";
import NedenArtiklo from "./pages/NedenArtiklo";
import Yorumlar from "./pages/Yorumlar";
import Senaryolar from "./pages/Senaryolar";
import SSS from "./pages/SSS";
import Hakkimizda from "./pages/Hakkimizda";
import KullaniciSozlesmesi from "./pages/KullaniciSozlesmesi";
import KvkkAydinlatma from "./pages/KvkkAydinlatma";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ArchivePage from "./pages/ArchivePage";
import MobileWelcome from "./pages/MobileWelcome";
import RehberPage from "./pages/RehberPage";
import RehberDetayPage from "./pages/RehberDetayPage";
import PartnerSignUpPage from "./pages/partner/PartnerSignUpPage";
import PartnerLoginPage from "./pages/partner/PartnerLoginPage";
import ProfilePage from "./pages/partner/ProfilePage";
import DashboardPage from "./pages/partner/DashboardPage";
import ApplicationPage from "./pages/partner/ApplicationPage";

const AppRoutes = () => {
  const { isMobile } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();
  // Kullanıcı oturumunu kontrol et
  const session = localStorage.getItem("sb-artiklo-auth-token");

  useEffect(() => {
    if (isMobile && session && location.pathname === "/") {
      navigate("/archive", { replace: true });
    }
  }, [isMobile, session, location.pathname, navigate]);

  if (isMobile && !session && location.pathname === "/") {
    return <MobileWelcome />;
  }

  const hideNavbar = ["/auth", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/neden-artiklo" element={<NedenArtiklo />} />
        <Route path="/yorumlar" element={<Yorumlar />} />
        <Route path="/senaryolar" element={<Senaryolar />} />
        <Route path="/sss" element={<SSS />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kullanici-sozlesmesi" element={<KullaniciSozlesmesi />} />
        <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/archive" element={<ArchivePage />} />
        {/* <Route path="/rehber" element={<RehberPage />} /> */}
        {/* <Route path="/rehber/:slug" element={<RehberDetayPage />} /> */}
        {/* <Route path="/partner/basvuru" element={<ApplicationPage />} /> */}
        {/* <Route path="/partner/kayit-ol" element={<PartnerSignUpPage />} /> */}
        {/* <Route path="/partner/giris-yap" element={<PartnerLoginPage />} /> */}
        {/* <Route path="/partner/profil" element={<ProfilePage />} /> */}
        {/* <Route path="/partner/dashboard" element={<DashboardPage />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 