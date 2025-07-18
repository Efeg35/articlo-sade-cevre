import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  specialties: string;
}

const PartnerSignUpPage = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [error, setError] = useState("");

  const onSubmit = async (data: FormValues) => {
    setError("");
    if (data.password !== data.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    const specialtiesArray = data.specialties.split(',').map(s => s.trim()).filter(Boolean);
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: "partner",
          name: data.name,
          city: data.city,
          address: data.address,
          phone: data.phone,
          website: data.website,
          description: data.description,
          specialties: specialtiesArray
        }
      }
    });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      toast({
        title: "Başvurunuz alındı!",
        description: "Lütfen e-posta adresinizi kontrol edin.",
        duration: 6000
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Partner Başvuru Formu</h1>
        <div className="space-y-2">
          <label className="font-semibold">E-posta</label>
          <Input type="email" {...register("email", { required: true })} placeholder="E-posta" />
          {errors.email && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şifre</label>
          <Input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="Şifre (en az 6 karakter)" />
          {errors.password && <span className="text-red-500 text-sm">En az 6 karakterli bir şifre girin.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şifre Tekrar</label>
          <Input type="password" {...register("confirmPassword", { required: true })} placeholder="Şifre Tekrar" />
          {errors.confirmPassword && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <hr className="my-4" />
        <div className="space-y-2">
          <label className="font-semibold">Firma Adı</label>
          <Input {...register("name", { required: true })} placeholder="Firma Adı" />
          {errors.name && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Şehir</label>
          <Input {...register("city", { required: true })} placeholder="Şehir" />
          {errors.city && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Adres</label>
          <Textarea {...register("address", { required: true })} placeholder="Adres" />
          {errors.address && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Telefon</label>
          <Input {...register("phone", { required: true })} placeholder="Telefon" />
          {errors.phone && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Web Sitesi</label>
          <Input {...register("website")} placeholder="Web Sitesi (opsiyonel)" />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Açıklama</label>
          <Textarea {...register("description", { required: true })} placeholder="Kısa açıklama" />
          {errors.description && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Uzmanlıklar (virgülle ayırın)</label>
          <Input {...register("specialties", { required: true })} placeholder="Örn: Ceza Hukuku, Aile Hukuku, Ticaret Hukuku" />
          {errors.specialties && <span className="text-red-500 text-sm">Bu alan zorunlu.</span>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Başvurunuz gönderiliyor..." : "Başvuruyu Gönder"}</Button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default PartnerSignUpPage; 