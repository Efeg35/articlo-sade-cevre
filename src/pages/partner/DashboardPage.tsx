import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [profile, setProfile] = useState<{ name: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/partner/giris-yap");
        return;
      }
      const { data } = await supabase
        .from("law_firm_profiles")
        .select("name, status")
        .eq("id", user.id)
        .single();
      setProfile(data || null);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-2">
        <h1 className="text-3xl font-bold mb-4 text-center">Partner Programına Hoşgeldiniz</h1>
        <p className="mb-6 text-muted-foreground text-center max-w-md">Dizinde listelenmek ve Artiklo'nun onaylı hukuk büroları arasında yer almak için lütfen profilinizi oluşturun.</p>
        <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate("/partner/profil")}>+ Profil Oluştur</Button>
      </div>
    );
  }

  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let statusText = "";
  if (profile.status === "pending") {
    badgeVariant = "secondary";
    statusText = "Profiliniz incelemede. Onaylandığında e-posta ile bilgilendirileceksiniz.";
  } else if (profile.status === "approved") {
    badgeVariant = "default";
    statusText = "Tebrikler, profiliniz yayında! Artiklo Rehberi'nde listeleniyorsunuz.";
  } else if (profile.status === "rejected") {
    badgeVariant = "destructive";
    statusText = "Üzgünüz, profiliniz onaylanmadı. Detaylar için bizimle iletişime geçin.";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-2">
      <h1 className="text-3xl font-bold mb-4 text-center">Hoşgeldiniz, {profile.name}</h1>
      <div className="mb-4">
        <Badge variant={badgeVariant}>{profile.status}</Badge>
      </div>
      <p className="mb-6 text-muted-foreground text-center max-w-md">{statusText}</p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/partner/profil")}>Profili Düzenle</Button>
        <Button variant="outline" onClick={() => navigate("/partner/abonelik")}>Abonelik Yönet</Button>
      </div>
    </div>
  );
};

export default DashboardPage; 