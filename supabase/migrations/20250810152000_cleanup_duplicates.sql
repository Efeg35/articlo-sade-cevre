-- 🧹 CLEANUP: Duplicate migration temizlikleri
-- Bu migration duplicate table/trigger hatalarını önler

-- IF NOT EXISTS ile trigger'ları güvenli oluştur
DO $$ 
BEGIN
    -- update_user_sessions_updated_at trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_sessions_updated_at'
        AND tgrelid = 'user_sessions'::regclass
    ) THEN
        CREATE TRIGGER update_user_sessions_updated_at 
        BEFORE UPDATE ON user_sessions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Created trigger: update_user_sessions_updated_at';
    ELSE
        RAISE NOTICE 'Trigger update_user_sessions_updated_at already exists, skipping';
    END IF;
    
    -- update_analytics_events_updated_at trigger (eğer yoksa)
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_analytics_events_updated_at'
        AND tgrelid = 'analytics_events'::regclass
    ) THEN
        CREATE TRIGGER update_analytics_events_updated_at 
        BEFORE UPDATE ON analytics_events
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Created trigger: update_analytics_events_updated_at';
    END IF;
    
    -- update_push_subscriptions_updated_at trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_push_subscriptions_updated_at'
        AND tgrelid = 'push_subscriptions'::regclass
    ) THEN
        CREATE TRIGGER update_push_subscriptions_updated_at 
        BEFORE UPDATE ON push_subscriptions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Created trigger: update_push_subscriptions_updated_at';
    END IF;
    
    -- update_user_notification_preferences_updated_at trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_notification_preferences_updated_at'
        AND tgrelid = 'user_notification_preferences'::regclass
    ) THEN
        CREATE TRIGGER update_user_notification_preferences_updated_at 
        BEFORE UPDATE ON user_notification_preferences
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Created trigger: update_user_notification_preferences_updated_at';
    END IF;
END $$;

-- Duplicate olan migration'ı devre dışı bırak
-- 20250809132752_create_missing_tables_final.sql dosyasında trigger hataları var
-- Bu dosya artık sadece table creation yapacak, trigger'lar burada

