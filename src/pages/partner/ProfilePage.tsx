import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { register, handleSubmit, setValue, reset } = useForm<ProfileForm>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/partner/giris-yap");
        return;
      }
      setUserId(user.id);
      // Profil var mı kontrol et
      const { data, error } = await supabase
        .from("law_firm_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        reset({
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
  }, [navigate, reset]);

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

  const onSubmit = async (values: ProfileForm) => {
    if (!userId) return;
    setLoading(true);
    const specialtiesArr = values.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const slug = generateSlug(values.name);
    const { error } = await supabase
      .from("law_firm_profiles")
      .upsert({
        id: userId,
        name: values.name,
        slug,
        city: values.city,
        address: values.address,
        phone: values.phone,
        website: values.website,
        description: values.description,
        specialties: specialtiesArr,
        logo_url: values.logo_url,
        status: "approved", // veya "pending" ihtiyaca göre
      });
    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Profil kaydedildi." });
      navigate("/partner/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-lg bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Hukuk Bürosu Profilim</h1>
        <Input {...register("name", { required: true })} placeholder="Firma Adı" />
        <Input {...register("city", { required: true })} placeholder="Şehir" />
        <Textarea {...register("address")} placeholder="Adres" />
        <Input {...register("phone")} placeholder="Telefon" />
        <Input {...register("website")} placeholder="Web Sitesi" />
        <Textarea {...register("description")} placeholder="Açıklama (Firma Tanıtımı)" />
        <Input {...register("specialties")} placeholder="Uzmanlıklar (virgül ile ayırın, ör: Bilişim Hukuku, Ceza Hukuku)" />
        <Input {...register("logo_url")} placeholder="Logo URL (resim bağlantısı)" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>
      </form>
    </div>
  );
};

export default ProfilePage; 