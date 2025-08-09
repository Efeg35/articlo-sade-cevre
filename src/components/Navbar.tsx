import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Scale, ChevronDown, LogIn, User as UserIcon, Archive, LogOut, Sparkles, FileText, BarChart3, Bell, Menu } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCredits } from "../hooks/useCredits";
import { Badge } from "@/components/ui/badge";
import { Capacitor } from "@capacitor/core";

// Mobil tarayıcı detection fonksiyonu
const isMobileBrowser = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isSmallScreen;
};

const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user || null;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mobil browser detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(isMobileBrowser());
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Debug log'ları
  console.log('Navbar render:', {
    session: !!session,
    user: !!user,
    userEmail: user?.email,
    pathname: location.pathname,
    isMobile,
    isNative: Capacitor.isNativePlatform()
  });

  // Kredi sistemi aktif
  const { credits, loading: creditsLoading, error: creditsError } = useCredits(user?.id);

  // Admin kontrolü
  const { isAdmin } = useAdminAuth();

  console.log('Credits debug:', {
    userId: user?.id,
    credits,
    loading: creditsLoading,
    error: creditsError
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      console.log('Sign out successful, navigating to home');
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isArchive = location.pathname.startsWith("/archive");
  const isTemplates = location.pathname.startsWith("/templates");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 pt-[env(safe-area-inset-top)] md:pt-0",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
      style={{
        position: 'fixed' as const,
        top: '0',
        left: '0',
        right: '0',
        zIndex: '9999',
        transform: 'translateZ(0)',
        willChange: 'transform',
        WebkitTransform: 'translateZ(0)'
      } as React.CSSProperties}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Sol (Web'de logo, mobilde sadece yazı) */}
        {!Capacitor.isNativePlatform() ? (
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-0 font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-transparent.png"
              alt="Artiklo Logo"
              className="w-16 h-16 object-contain"
            />
            <span className="text-black font-bold text-2xl -ml-6">
              ARTIKLO
            </span>
          </Link>
        ) : (
          /* Mobil platformda sadece yazı */
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-black font-bold text-base">
              ARTIKLO
            </span>
          </Link>
        )}

        {/* Navigation Links - Orta */}
        {!user && (
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/nasil-calisir" className="text-sm font-medium hover:text-primary transition-colors">
              Nasıl Çalışır?
            </Link>
            <Link to="/fiyatlandirma" className="text-sm font-medium hover:text-primary transition-colors">
              Fiyatlandırma
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/sss" className="text-sm font-medium hover:text-primary transition-colors">
              SSS
            </Link>
            <Link to="/hakkimizda" className="text-sm font-medium hover:text-primary transition-colors">
              Hakkımızda
            </Link>
          </div>
        )}

        {/* Auth Buttons - Sağ */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              {isDashboard || isArchive || isTemplates ? (
                <>
                  {/* Desktop Navigation - Sadece gerçek desktop'ta göster */}
                  {!Capacitor.isNativePlatform() && !isMobile ? (
                    <div className="flex items-center gap-1">
                      <Link to="/dashboard">
                        <Button
                          variant={isDashboard ? "default" : "ghost"}
                          size="sm"
                          className="text-sm font-medium"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/templates">
                        <Button
                          variant={isTemplates ? "default" : "ghost"}
                          size="sm"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Şablonlar
                        </Button>
                      </Link>
                      <Link to="/archive">
                        <Button
                          variant={isArchive ? "default" : "ghost"}
                          size="sm"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Archive className="h-4 w-4" />
                          Belgelerim
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    /* Mobile Navigation - Native mobil VE mobil tarayıcı için dropdown */
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Menu className="h-4 w-4" />
                          <span className="text-xs">Menü</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 z-[10000]"
                        side="bottom"
                        sideOffset={4}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            navigate("/dashboard");
                          }}
                          className="cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            navigate("/templates");
                          }}
                          className="cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Şablonlar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            navigate("/archive");
                          }}
                          className="cursor-pointer"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Belgelerim
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 space-y-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Kullanıcı Paneli</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      {creditsLoading ? (
                        <span>Kredi yükleniyor...</span>
                      ) : creditsError ? (
                        <span className="text-red-500">Kredi alınamadı</span>
                      ) : (
                        <Badge variant="outline">Kalan Kredi: {credits}</Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onSelect={() => navigate("/admin")} className="cursor-pointer">
                      <Scale className="w-4 h-4 mr-2" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => navigate("/notifications")} className="cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" /> Bildirim Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="group flex items-center gap-2"
            >
              <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Giriş Yap
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 