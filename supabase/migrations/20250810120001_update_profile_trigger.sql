-- Kullanıcı kayıt olduğunda tüm yeni alanları da profiles tablosuna kaydet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    phone,
    birth_date,
    reference_code,
    marketing_consent,
    email_consent,
    sms_consent,
    credits
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL AND NEW.raw_user_meta_data->>'birth_date' != ''
      THEN (NEW.raw_user_meta_data->>'birth_date')::DATE
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'reference_code', ''),
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'email_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'sms_consent')::BOOLEAN, false),
    3
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı güncelle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();