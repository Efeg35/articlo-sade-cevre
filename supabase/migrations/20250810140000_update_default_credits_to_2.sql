-- Yeni üyelere verilen başlangıç kredisini 3'ten 2'ye düşür

-- 1. Profiles tablosundaki default değeri güncelle
ALTER TABLE public.profiles ALTER COLUMN credits SET DEFAULT 2;

-- 2. Mevcut trigger fonksiyonunu güncelle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  BEGIN
    -- Try to create full profile with all fields
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      birth_date,
      phone,
      address,
      city,
      district,
      email_consent,
      sms_consent,
      credits
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      (NEW.raw_user_meta_data->>'birth_date')::date,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'district',
      COALESCE((NEW.raw_user_meta_data->>'email_consent')::boolean, false),
      COALESCE((NEW.raw_user_meta_data->>'sms_consent')::boolean, false),
      2  -- Yeni başlangıç kredi miktarı
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error and continue with basic profile creation
    INSERT INTO public.profiles (id, email, full_name, credits)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 2);
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;