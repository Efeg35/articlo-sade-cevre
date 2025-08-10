-- 🔒 KONTROL NOKTASI: Fix pro_waitlist table columns
-- Add missing columns to existing pro_waitlist table

-- Check if joined_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'joined_at'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;
END $$;

-- Check if is_notified column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'is_notified'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN is_notified BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Check if notification_sent_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'notification_sent_at'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN notification_sent_at TIMESTAMPTZ;
    END IF;
END $$;

-- Check if metadata column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Check if created_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Check if updated_at column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pro_waitlist' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE pro_waitlist ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Add indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_user_id ON pro_waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_joined_at ON pro_waitlist(joined_at);
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_is_notified ON pro_waitlist(is_notified);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_pro_waitlist_updated_at ON pro_waitlist;
CREATE TRIGGER update_pro_waitlist_updated_at BEFORE UPDATE ON pro_waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE pro_waitlist IS 'PRO özellikler için kullanıcı bekleme listesi';
COMMENT ON COLUMN pro_waitlist.user_id IS 'Bekleme listesine eklenen kullanıcı ID';
COMMENT ON COLUMN pro_waitlist.joined_at IS 'Bekleme listesine eklenme tarihi';
COMMENT ON COLUMN pro_waitlist.is_notified IS 'Kullanıcıya PRO çıkış bildirimi gönderildi mi?';
COMMENT ON COLUMN pro_waitlist.notification_sent_at IS 'Bildirim gönderilme tarihi';
COMMENT ON COLUMN pro_waitlist.metadata IS 'Ek bilgiler için JSON field';