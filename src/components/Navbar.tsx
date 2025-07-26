import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Scale, ChevronDown, LogIn, User as UserIcon, Archive, LogOut, Sparkles } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCredits } from "../hooks/useCredits";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { credits, loading: creditsLoading, error: creditsError } = useCredits(user?.id);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isArchive = location.pathname.startsWith("/archive");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] md:pt-0",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Artiklo
          </span>
        </Link>

        {/* Navigation Links - sadece giriş yapmamış kullanıcılar için */}
        {!user && (
          <div className="hidden md:flex items-center gap-6">
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

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isDashboard || isArchive ? (
                <>
                <Link to={isDashboard ? "/archive" : "/dashboard"}>
                  <Button variant="ghost" className="text-sm font-medium">
                    {isDashboard ? "Belgelerim" : "Dashboard"}
                  </Button>
                </Link>
                {/* <Link to="/rehber">
                  <Button variant="outline" className="text-sm font-medium ml-1">
                    Avukat Rehberi
                  </Button>
                </Link> */}
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
                  <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
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