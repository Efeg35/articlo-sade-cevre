-- Mevcut kullanıcılar için profiles tablosuna eksik kayıtları ekle
INSERT INTO public.profiles (id, email, full_name, credits)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  3
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
