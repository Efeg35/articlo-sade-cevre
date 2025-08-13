import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Scale, ChevronDown, LogIn, User as UserIcon, Archive, LogOut, Sparkles, FileText, BarChart3, Bell, Menu, CreditCard, Coins } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCredits } from "../hooks/useCredits";
import { Badge } from "@/components/ui/badge";
import { Capacitor } from "@capacitor/core";
import { Logger } from "@/utils/logger";

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
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
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

  // 🔒 KONTROL NOKTASI: Secure navbar logging
  Logger.debug('Navbar', 'Navbar render', {
    hasSession: !!session,
    hasUser: !!user,
    pathname: location.pathname,
    isMobile,
    isNative: Capacitor.isNativePlatform()
  });

  // Kredi sistemi aktif
  const { credits, loading: creditsLoading, error: creditsError } = useCredits(user?.id);

  // Admin kontrolü
  const { isAdmin } = useAdminAuth();

  Logger.debug('Navbar', 'Credits status', {
    hasUserId: !!user?.id,
    hasCredits: credits !== null,
    creditsLoading,
    hasCreditsError: !!creditsError
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
      Logger.log('Navbar', 'Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        Logger.error('Navbar', 'Error signing out', error);
        return;
      }
      Logger.log('Navbar', 'Sign out successful, navigating to home');
      navigate("/", { replace: true });
    } catch (error) {
      Logger.error('Navbar', 'Sign out error', error);
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreditModalOpen(true)}
                        className="text-sm font-medium flex items-center gap-1 text-primary border-primary"
                      >
                        <Coins className="h-4 w-4" />
                        Kredi Satın Al
                      </Button>
                    </div>
                  ) : (
                    /* Mobile Navigation - Native mobil VE mobil tarayıcı için dropdown */
                    <DropdownMenu>
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
                      >
                        <DropdownMenuItem
                          onSelect={() => navigate("/dashboard")}
                          className="cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => navigate("/templates")}
                          className="cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Şablonlar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => navigate("/archive")}
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
                    onSelect={() => handleSignOut()}
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

      {/* Kredi Satın Alma Modal */}
      <Dialog
        open={isCreditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Modal kapatılırken agresif temizlik
            document.body.style.cssText = '';
            document.documentElement.style.cssText = '';
            document.body.style.overflow = 'visible';
            document.body.style.pointerEvents = 'auto';
            window.scrollTo(0, window.scrollY);

            // Radix UI'dan kalan elementleri temizle
            setTimeout(() => {
              const overlays = document.querySelectorAll('[data-radix-dialog-overlay], [data-radix-dialog-content]');
              overlays.forEach(el => el.remove());

              document.body.style.overflow = '';
              document.body.style.position = '';
              document.body.style.pointerEvents = '';

              Logger.log('Navbar', 'Modal closed with force cleanup');
            }, 50);
          }
          setIsCreditModalOpen(open);
        }}
      >
        <DialogContent
          className="credit-modal-center bg-white rounded-lg shadow-2xl border"
          forceMount
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className={`flex items-center gap-2 ${Capacitor.isNativePlatform() || isMobile ? 'text-xl' : 'text-2xl'}`}>
              <Coins className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
              Kredi Satın Al
            </DialogTitle>
            <DialogDescription className="text-sm">
              Artiklo kredileri ile belge sadeleştirme ve oluşturma işlemlerinizi gerçekleştirebilirsiniz.
            </DialogDescription>
          </DialogHeader>

          <div className={`${Capacitor.isNativePlatform() || isMobile ? 'flex flex-col gap-3 py-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 py-6'} overflow-y-auto flex-1`}>
            {/* Mini Paket */}
            <div className={`group relative border border-gray-200 rounded-lg ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-6'} hover:border-primary hover:shadow-lg transition-all duration-300 bg-white`}>
              <div className="text-center">
                <div className={`bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-full ${Capacitor.isNativePlatform() || isMobile ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Coins className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-blue-600`} />
                </div>
                <h3 className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-xl'} font-bold mb-2 text-gray-800`}>Mini Paket</h3>
                <div className="mb-3">
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-lg' : 'text-3xl'} font-bold text-primary mb-1`}>3 Kredi</div>
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-2xl'} font-semibold text-gray-800`}>₺119</div>
                </div>
                <Button
                  className={`w-full ${Capacitor.isNativePlatform() || isMobile ? 'py-1.5 text-xs' : 'py-3 text-base'} font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300`}
                  onClick={() => {
                    alert('Ödeme sistemi yakında aktif olacak!');
                  }}
                >
                  Satın Al
                </Button>
              </div>
            </div>

            {/* Küçük Paket */}
            <div className={`group relative border border-gray-200 rounded-lg ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-6'} hover:border-primary hover:shadow-lg transition-all duration-300 bg-white`}>
              <div className="text-center">
                <div className={`bg-gradient-to-br from-green-100 to-green-200 p-2 rounded-full ${Capacitor.isNativePlatform() || isMobile ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Sparkles className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-green-600`} />
                </div>
                <h3 className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-xl'} font-bold mb-2 text-gray-800`}>Küçük Paket</h3>
                <div className="mb-3">
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-lg' : 'text-3xl'} font-bold text-primary mb-1`}>5 Kredi</div>
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-2xl'} font-semibold text-gray-800`}>₺149</div>
                </div>
                <Button
                  className={`w-full ${Capacitor.isNativePlatform() || isMobile ? 'py-1.5 text-xs' : 'py-3 text-base'} font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300`}
                  onClick={() => {
                    alert('Ödeme sistemi yakında aktif olacak!');
                  }}
                >
                  Satın Al
                </Button>
              </div>
            </div>

            {/* Standart Paket */}
            <div className={`group relative border-2 border-primary rounded-lg ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-6'} bg-gradient-to-br from-primary/5 via-white to-primary/10 shadow-lg transform hover:scale-105 transition-all duration-300`}>
              <div className={`absolute ${Capacitor.isNativePlatform() || isMobile ? '-top-1.5' : '-top-3'} left-1/2 transform -translate-x-1/2`}>
                <Badge className={`bg-gradient-to-r from-primary to-primary/80 text-white ${Capacitor.isNativePlatform() || isMobile ? 'px-2 py-0.5 text-xs' : 'px-4 py-1 text-sm'} font-semibold shadow-md`}>
                  🔥 En Popüler
                </Badge>
              </div>
              <div className={`text-center ${Capacitor.isNativePlatform() || isMobile ? 'pt-0.5' : 'pt-2'}`}>
                <div className={`bg-gradient-to-br from-primary/20 to-primary/30 p-2 rounded-full ${Capacitor.isNativePlatform() || isMobile ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <FileText className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-primary`} />
                </div>
                <h3 className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-xl'} font-bold mb-2 text-gray-800`}>Standart Paket</h3>
                <div className="mb-3">
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-lg' : 'text-3xl'} font-bold text-primary mb-1`}>10 Kredi</div>
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-2xl'} font-semibold text-gray-800`}>₺249</div>
                </div>
                <Button
                  className={`w-full ${Capacitor.isNativePlatform() || isMobile ? 'py-1.5 text-xs' : 'py-3 text-base'} font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300`}
                  onClick={() => {
                    alert('Ödeme sistemi yakında aktif olacak!');
                  }}
                >
                  Satın Al
                </Button>
              </div>
            </div>

            {/* Pro Paket */}
            <div className={`group relative border border-gray-200 rounded-lg ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-6'} hover:border-primary hover:shadow-lg transition-all duration-300 bg-white`}>
              <div className="text-center">
                <div className={`bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-full ${Capacitor.isNativePlatform() || isMobile ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <CreditCard className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-purple-600`} />
                </div>
                <h3 className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-xl'} font-bold mb-2 text-gray-800`}>Pro Paket</h3>
                <div className="mb-3">
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-lg' : 'text-3xl'} font-bold text-primary mb-1`}>25 Kredi</div>
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-2xl'} font-semibold text-gray-800`}>₺500</div>
                </div>
                <Button
                  className={`w-full ${Capacitor.isNativePlatform() || isMobile ? 'py-1.5 text-xs' : 'py-3 text-base'} font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300`}
                  onClick={() => {
                    alert('Ödeme sistemi yakında aktif olacak!');
                  }}
                >
                  Satın Al
                </Button>
              </div>
            </div>

            {/* Özel Paket */}
            <div className={`group relative border-2 border-dashed border-orange-300 rounded-lg ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-6'} hover:border-orange-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-white`}>
              <div className="text-center">
                <div className={`bg-gradient-to-br from-orange-100 to-orange-200 p-2 rounded-full ${Capacitor.isNativePlatform() || isMobile ? 'w-10 h-10' : 'w-16 h-16'} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <svg className={`${Capacitor.isNativePlatform() || isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <h3 className={`${Capacitor.isNativePlatform() || isMobile ? 'text-base' : 'text-xl'} font-bold mb-2 text-gray-800`}>Özel Paket</h3>
                <div className="mb-3">
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-lg' : 'text-3xl'} font-bold text-orange-600 mb-1`}>25+ Kredi</div>
                  <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-sm' : 'text-lg'} font-medium text-gray-600`}>Özel Fiyat</div>
                </div>
                <Button
                  variant="outline"
                  className={`w-full ${Capacitor.isNativePlatform() || isMobile ? 'py-1.5 text-xs' : 'py-3 text-base'} font-medium border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 transition-all duration-300`}
                  onClick={() => {
                    window.open('mailto:info@artiklo.com?subject=Özel Kredi Paketi Talebi&body=Merhaba,%0A%0A25+ kredi paketi için özel fiyat almak istiyorum.%0A%0ATeşekkürler.', '_blank');
                  }}
                >
                  İletişime Geç
                </Button>
              </div>
            </div>
          </div>

          <div className={`bg-gray-50 ${Capacitor.isNativePlatform() || isMobile ? 'p-3' : 'p-4'} rounded-lg mt-4 flex-shrink-0`}>
            <h4 className={`font-medium mb-2 ${Capacitor.isNativePlatform() || isMobile ? 'text-sm' : 'text-base'}`}>💡 Kredi Kullanımı</h4>
            <div className={`${Capacitor.isNativePlatform() || isMobile ? 'text-xs' : 'text-sm'} text-gray-600 space-y-1`}>
              <p>• Her belge sadeleştirme işlemi 1 kredi harcar</p>
              <p>• AI ile belge oluşturma işlemi 1 kredi harcar</p>
              <p>• Şablon ile belge oluşturma işlemi 1 kredi harcar</p>
              <p>• Krediler hiç süre sonu dolmaz</p>
            </div>
          </div>

          <div className={`text-center ${Capacitor.isNativePlatform() || isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-4 flex-shrink-0`}>
            <p>
              <strong>Not:</strong> Ödeme sistemi henüz aktif değil. Yakında kullanıma sunulacak!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;