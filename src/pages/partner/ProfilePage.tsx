import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";

interface ProfileForm {
  name: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  specialties: string; // comma separated
  logo_url: string;
}

const ProfilePage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user;

  const [formData, setFormData] = useState<ProfileForm>({
    name: "",
    city: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    specialties: "",
    logo_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUserAndProfile = async () => {
      if (!user) {
        navigate("/partner/giris-yap");
        return;
      }

      setLoading(true);
      // Profil var mı kontrol et
      const { data, error } = await supabase
        .from("law_firm_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFormData({
          name: data.name || "",
          city: data.city || "",
          address: data.address || "",
          phone: data.phone || "",
          website: data.website || "",
          description: data.description || "",
          specialties: (data.specialties || []).join(", "),
          logo_url: data.logo_url || "",
        });
      }
      setLoading(false);
    };
    getUserAndProfile();
  }, [user, navigate, supabase]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    const specialtiesArr = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const slug = generateSlug(formData.name);

    const { error } = await supabase
      .from("law_firm_profiles")
      .upsert({
        id: user.id,
        name: formData.name,
        slug,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        website: formData.website,
        description: formData.description,
        specialties: specialtiesArr,
        logo_url: formData.logo_url,
        status: "approved", // veya "pending" ihtiyaca göre
      });

    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Profil kaydedildi." });
      navigate("/partner/dashboard");
    }
  };

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-2">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Hukuk Bürosu Profilim</CardTitle>
          <CardDescription>
            Hukuk büronuzun bilgilerini güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Firma Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Firma Adı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Şehir</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Şehir"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Adres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Telefon"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Web Sitesi</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="Web Sitesi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Açıklama (Firma Tanıtımı)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Uzmanlıklar</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => handleInputChange("specialties", e.target.value)}
                placeholder="Uzmanlıklar (virgül ile ayırın, ör: Bilişim Hukuku, Ceza Hukuku)"
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Profili Kaydet
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button
        variant="ghost"
        onClick={() => navigate("/partner/dashboard")}
        className="mt-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri Dön
      </Button>
    </div>
  );
};

export default ProfilePage; 