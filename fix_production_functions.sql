-- 🔒 PRODUCTION FUNCTION SECURITY FIXES
-- Bu SQL'leri Supabase Dashboard → SQL Editor'da çalıştır

-- 1. update_updated_at_column_job
CREATE OR REPLACE FUNCTION public.update_updated_at_column_job()
RETURNS void AS $$
BEGIN
    -- Cleanup old sessions
    DELETE FROM public.user_sessions 
    WHERE last_activity < NOW() - INTERVAL '30 days';
    
    -- Cleanup old analytics
    DELETE FROM public.analytics_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    RAISE NOTICE 'Cleanup job completed';
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public, pg_temp;

-- 2. decrement_credit
CREATE OR REPLACE FUNCTION public.decrement_credit(user_uuid UUID, amount INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT credits INTO current_credits 
    FROM public.profiles 
    WHERE id = user_uuid;
    
    IF current_credits IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF current_credits < amount THEN
        RETURN FALSE;
    END IF;
    
    UPDATE public.profiles 
    SET credits = credits - amount
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public, pg_temp;

-- 3. purge_old_analytics
CREATE OR REPLACE FUNCTION public.purge_old_analytics()
RETURNS void AS $$
BEGIN
    DELETE FROM public.analytics_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM public.performance_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM public.user_sessions 
    WHERE last_activity < NOW() - INTERVAL '180 days';
    
    RAISE NOTICE 'Old analytics data purged';
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public, pg_temp;

-- 4. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public, pg_temp;




























