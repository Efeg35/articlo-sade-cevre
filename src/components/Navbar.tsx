import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FileText, ChevronDown, LogIn, User as UserIcon, Archive, LogOut, Sparkles } from "lucide-react";
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
          to="/"
          className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity"
        >
          <FileText className="h-6 w-6" />
          <span>Artiklo</span>
        </Link>

        {/* Navigation Links */}
        {!isDashboard && !isArchive && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/neden-artiklo">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      location.pathname === "/neden-artiklo" && "bg-accent/50"
                    )}
                  >
                    Neden Artiklo?
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      location.pathname === "/blog" && "bg-accent/50"
                    )}
                  >
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Hakkımızda</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <Link
                        to="/hakkimizda"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Artiklo Hakkında
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Vizyonumuz, değerlerimiz ve ekibimiz hakkında detaylı bilgi alın.
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/sss"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">SSS</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Sıkça sorulan sorular ve cevapları
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/kullanici-sozlesmesi"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Kullanıcı Sözleşmesi</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Kullanım koşulları ve yasal bilgiler
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/kvkk-aydinlatma"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">KVKK Aydınlatma Metni</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Kişisel verilerin korunması
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isDashboard || isArchive ? (
                <Link to={isDashboard ? "/archive" : "/dashboard"}>
                  <Button variant="ghost" className="text-sm font-medium">
                    {isDashboard ? "Dosyalarım" : "Dashboard"}
                  </Button>
                </Link>
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