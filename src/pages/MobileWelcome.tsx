import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MobileWelcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <img src="/pwa-192x192.png" alt="Artiklo Logo" className="w-20 h-20 mb-6" />
      <h1 className="text-3xl font-bold mb-3 text-foreground text-center">Artiklo'ya Hoş Geldiniz</h1>
      <h2 className="text-xl font-semibold text-center mb-2">Resmi belgeler için kişisel tercümanınız</h2>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
        Evinize gelen bir tebligatı veya bir kira kontratını anlamadınız mı? Panik yapmayın hemen fotoğrafını çekip Artiklo'ya yükleyin, sizin için anında açıklasın, özetlesin ve ne yapmanız gerektiğini anlatsın.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button size="lg" className="w-full" onClick={() => navigate("/login")}>Giriş Yap</Button>
        <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/signup")}>Hesap Oluştur</Button>
      </div>
    </div>
  );
} 