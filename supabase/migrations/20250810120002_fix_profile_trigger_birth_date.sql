-- Fix birth date parsing in profile trigger
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
      WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'birth_date' != ''
           AND NEW.raw_user_meta_data->>'birth_date' != 'undefined'
      THEN 
        CASE 
          WHEN NEW.raw_user_meta_data->>'birth_date' ~ '^\d{4}-\d{2}-\d{2}$'
          THEN (NEW.raw_user_meta_data->>'birth_date')::DATE 
          ELSE NULL 
        END
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'reference_code', ''),
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'email_consent')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'sms_consent')::BOOLEAN, false),
    3
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and continue with basic profile creation
    INSERT INTO public.profiles (id, email, full_name, credits)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 3);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;