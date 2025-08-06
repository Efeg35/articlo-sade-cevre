import { useState } from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const PartnerSignUpPage = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    city: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    specialties: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const specialtiesArray = formData.specialties.split(',').map(s => s.trim()).filter(Boolean);

    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          role: "partner",
          name: formData.name,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          website: formData.website,
          description: formData.description,
          specialties: specialtiesArray
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      toast({
        title: "Hata",
        description: signUpError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başvurunuz alındı!",
        description: "Lütfen e-posta adresinizi kontrol edin.",
      });
      navigate("/partner/giris-yap");
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Partner Başvuru Formu</h1>
        <div className="space-y-2">
          <label className="font-semibold">E-posta</label>
          <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="E-posta" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şifre</label>
          <Input type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} placeholder="Şifre (en az 6 karakter)" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şifre Tekrar</label>
          <Input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} placeholder="Şifre Tekrar" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <hr className="my-4" />
        <div className="space-y-2">
          <label className="font-semibold">Firma Adı</label>
          <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Firma Adı" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şehir</label>
          <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Şehir" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Adres</label>
          <Textarea value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="Adres" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Telefon</label>
          <Input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="Telefon" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Web Sitesi</label>
          <Input value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="Web Sitesi (opsiyonel)" />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Açıklama</label>
          <Textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Kısa açıklama" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Uzmanlıklar (virgülle ayırın)</label>
          <Input value={formData.specialties} onChange={(e) => handleInputChange("specialties", e.target.value)} placeholder="Örn: Ceza Hukuku, Aile Hukuku, Ticaret Hukuku" />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Başvurunuz gönderiliyor..." : "Başvuruyu Gönder"}</Button>
      </form>
    </div>
  );
};

export default PartnerSignUpPage; 