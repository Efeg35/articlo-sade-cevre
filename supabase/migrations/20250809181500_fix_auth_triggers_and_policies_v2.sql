-- Ensure auth signup creates profile and preferences under RLS safely

-- Preferences function with SECURITY DEFINER and safe search_path
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Handle new user profile creation (idempotent) with safe search_path (function may already exist)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    3
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers explicitly for both actions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profiles ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_preferences ON auth.users;

CREATE TRIGGER on_auth_user_created_profiles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_preferences();

-- RLS: allow service_role inserts from triggers where needed
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_notification_preferences' AND policyname = 'Service role can insert preferences'
  ) THEN
    CREATE POLICY "Service role can insert preferences" ON public.user_notification_preferences
      FOR INSERT TO service_role
      WITH CHECK (true);
  END IF;
END $$;


