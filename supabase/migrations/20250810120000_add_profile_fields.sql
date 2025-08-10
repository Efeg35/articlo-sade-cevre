-- Profiles tablosuna yeni kayıt formundan gelen alanları ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS reference_code TEXT,
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Telefon numarası için index ekle (arama performansı için)
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Referans kodu için index ekle
CREATE INDEX IF NOT EXISTS idx_profiles_reference_code ON public.profiles(reference_code);

-- Updated_at alanını otomatik güncelleyen trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ı profiles tablosuna bağla
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();