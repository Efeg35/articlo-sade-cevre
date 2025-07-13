import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { FileText, ChevronDown, LogIn } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
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
        {!isDashboard && (
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
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {!isDashboard && (
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Çıkış Yap
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="group"
            >
              <LogIn className="group-hover:-translate-y-0.5 transition-transform" />
              Giriş Yap
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 