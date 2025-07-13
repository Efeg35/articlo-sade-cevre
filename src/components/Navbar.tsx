import { Link, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

const navLinks = [
  { name: "Anasayfa", path: "/" },
  { name: "Neden Artiklo?", path: "/neden-artiklo" },
  { name: "SSS", path: "/sss" },
  { name: "Hakkımızda", path: "/hakkimizda" },
];

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="bg-background border-b sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <FileText className="h-7 w-7 text-foreground mr-2" />
          <span className="text-2xl font-bold text-foreground">Artiklo</span>
        </div>
        <div className="flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${location.pathname === link.path ? "bg-accent/50" : ""}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/auth"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${location.pathname === "/auth" ? "bg-accent/50" : ""}`}
          >
            Giriş/Kayıt
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground ${location.pathname === "/dashboard" ? "bg-primary/80" : ""}`}
          >
            Panel
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 