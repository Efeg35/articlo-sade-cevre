-- profiles tablosunu oluşturur
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  credits INTEGER NOT NULL DEFAULT 3
);

-- Row Level Security aktif
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi profilini görebilsin
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Kullanıcılar sadece kendi profilini güncelleyebilsin
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id); 