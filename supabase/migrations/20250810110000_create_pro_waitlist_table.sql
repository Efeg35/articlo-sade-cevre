-- 🔒 KONTROL NOKTASI: PRO Waitlist Table Migration
-- Bu tablo PRO özellikler için bekleme listesini yönetir

-- PRO Waitlist table
CREATE TABLE IF NOT EXISTS pro_waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_notified BOOLEAN DEFAULT false,
    notification_sent_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id) -- Her kullanıcı sadece bir kez eklenebilir
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_user_id ON pro_waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_joined_at ON pro_waitlist(joined_at);
CREATE INDEX IF NOT EXISTS idx_pro_waitlist_is_notified ON pro_waitlist(is_notified);

-- Updated at trigger
CREATE TRIGGER update_pro_waitlist_updated_at BEFORE UPDATE ON pro_waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Security
ALTER TABLE pro_waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own waitlist entry" ON pro_waitlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waitlist entry" ON pro_waitlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own waitlist entry" ON pro_waitlist
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin policy for notifications (service role only)
CREATE POLICY "Service role can update notification status" ON pro_waitlist
    FOR UPDATE USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE pro_waitlist IS 'PRO özellikler için kullanıcı bekleme listesi';
COMMENT ON COLUMN pro_waitlist.user_id IS 'Bekleme listesine eklenen kullanıcı ID';
COMMENT ON COLUMN pro_waitlist.joined_at IS 'Bekleme listesine eklenme tarihi';
COMMENT ON COLUMN pro_waitlist.is_notified IS 'Kullanıcıya PRO çıkış bildirimi gönderildi mi?';
COMMENT ON COLUMN pro_waitlist.notification_sent_at IS 'Bildirim gönderilme tarihi';
COMMENT ON COLUMN pro_waitlist.metadata IS 'Ek bilgiler için JSON field';