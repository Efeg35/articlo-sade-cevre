-- Profiles tablosuna INSERT policy'si ekle
-- RLS aktif olduğu için trigger INSERT yapamıyor

-- INSERT policy ekle - sadece authenticated kullanıcılar kendi profilini oluşturabilir
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role için de INSERT izni ver (trigger için gerekli)
CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT TO service_role
  WITH CHECK (true);