-- Fix auth.users triggers and RLS-safe inserts for default preferences and profiles

-- Recreate preferences function with SECURITY DEFINER and safe search_path
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure handle_new_user has a safe search_path as well
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Clean up any previous single trigger name and recreate two distinct triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profiles ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_preferences ON auth.users;

-- Trigger to create profile rows on signup
CREATE TRIGGER on_auth_user_created_profiles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to create default notification preferences on signup
CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_preferences();

-- Allow service_role to insert into user_notification_preferences for trigger
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


