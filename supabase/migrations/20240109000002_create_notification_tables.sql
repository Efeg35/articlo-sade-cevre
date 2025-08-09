-- Push Notification sistemi için tablolar

-- Push subscriptions tablosu
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh_key TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- Notification templates tablosu
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    badge TEXT,
    actions JSONB,
    data JSONB,
    require_interaction BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification campaigns tablosu
CREATE TABLE IF NOT EXISTS notification_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    template_id TEXT NOT NULL,
    target_criteria JSONB,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification events tablosu (analytics için)
CREATE TABLE IF NOT EXISTS notification_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'clicked', 'dismissed')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User notification preferences tablosu
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    welcome_notifications BOOLEAN DEFAULT true,
    template_recommendations BOOLEAN DEFAULT true,
    document_ready BOOLEAN DEFAULT true,
    system_updates BOOLEAN DEFAULT true,
    marketing_notifications BOOLEAN DEFAULT false,
    daily_digest BOOLEAN DEFAULT false,
    weekly_summary BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Notification queue tablosu (scheduled notifications için)
CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    badge TEXT,
    actions JSONB,
    data JSONB,
    require_interaction BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON push_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status ON notification_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_scheduled_at ON notification_campaigns(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_notification_events_campaign_id ON notification_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_user_id ON notification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_event_type ON notification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_notification_events_timestamp ON notification_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled_for ON notification_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_user_id ON notification_queue(user_id);

-- Trigger'lar updated_at alanları için
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_campaigns_updated_at BEFORE UPDATE ON notification_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at BEFORE UPDATE ON user_notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) politikaları
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- Push subscriptions - kullanıcılar sadece kendi subscription'larını görebilir
CREATE POLICY "Users can view own subscriptions" ON push_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON push_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON push_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON push_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- Notification templates - herkes görebilir, sadece admin ekleyebilir
CREATE POLICY "Anyone can view templates" ON notification_templates
    FOR SELECT USING (true);

-- Notification campaigns - herkes görebilir
CREATE POLICY "Anyone can view campaigns" ON notification_campaigns
    FOR SELECT USING (true);

-- Notification events - kullanıcılar kendi eventlerini görebilir
CREATE POLICY "Users can view own events" ON notification_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert events" ON notification_events
    FOR INSERT WITH CHECK (true);

-- User notification preferences - kullanıcılar sadece kendi ayarlarını görebilir/düzenleyebilir
CREATE POLICY "Users can view own preferences" ON user_notification_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_notification_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_notification_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Notification queue - sistem tarafından yönetiliyor
CREATE POLICY "Service can manage queue" ON notification_queue
    FOR ALL USING (true);

-- Fonksiyonlar

-- Kullanıcı için varsayılan notification preferences oluşturma
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_notification_preferences (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auth.users'a yeni kullanıcı eklendiğinde preferences oluştur
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();

-- Scheduled notification'ları işlemek için fonksiyon
CREATE OR REPLACE FUNCTION process_scheduled_notifications()
RETURNS TABLE(
    queue_id UUID,
    user_id UUID,
    subscription_endpoint TEXT,
    subscription_p256dh TEXT,
    subscription_auth TEXT,
    title TEXT,
    body TEXT,
    icon TEXT,
    badge TEXT,
    actions JSONB,
    data JSONB,
    require_interaction BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nq.id as queue_id,
        nq.user_id,
        ps.endpoint as subscription_endpoint,
        ps.p256dh_key as subscription_p256dh,
        ps.auth_key as subscription_auth,
        nq.title,
        nq.body,
        nq.icon,
        nq.badge,
        nq.actions,
        nq.data,
        nq.require_interaction
    FROM notification_queue nq
    JOIN push_subscriptions ps ON nq.user_id = ps.user_id
    WHERE nq.scheduled_for <= NOW()
    AND nq.status = 'pending'
    AND ps.is_active = true
    ORDER BY nq.scheduled_for ASC;
END;
$$ LANGUAGE plpgsql;

-- Notification statistics view
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
    nc.id,
    nc.title,
    nc.status,
    nc.recipients_count,
    nc.delivered_count,
    nc.clicked_count,
    ROUND(
        CASE 
            WHEN nc.recipients_count > 0 
            THEN (nc.delivered_count::FLOAT / nc.recipients_count::FLOAT) * 100 
            ELSE 0 
        END, 
        2
    ) as delivery_rate,
    ROUND(
        CASE 
            WHEN nc.delivered_count > 0 
            THEN (nc.clicked_count::FLOAT / nc.delivered_count::FLOAT) * 100 
            ELSE 0 
        END, 
        2
    ) as click_rate,
    nc.sent_at,
    nc.created_at
FROM notification_campaigns nc
ORDER BY nc.created_at DESC;

-- Daily notification analytics view
CREATE OR REPLACE VIEW daily_notification_analytics AS
SELECT 
    DATE(ne.timestamp) as date,
    COUNT(*) FILTER (WHERE ne.event_type = 'sent') as notifications_sent,
    COUNT(*) FILTER (WHERE ne.event_type = 'delivered') as notifications_delivered,
    COUNT(*) FILTER (WHERE ne.event_type = 'clicked') as notifications_clicked,
    COUNT(*) FILTER (WHERE ne.event_type = 'dismissed') as notifications_dismissed,
    COUNT(DISTINCT ne.user_id) as unique_users_reached
FROM notification_events ne
WHERE ne.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(ne.timestamp)
ORDER BY date DESC;

-- User engagement view
CREATE OR REPLACE VIEW user_notification_engagement AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(ne.id) as total_notifications_received,
    COUNT(ne.id) FILTER (WHERE ne.event_type = 'clicked') as notifications_clicked,
    COUNT(ne.id) FILTER (WHERE ne.event_type = 'dismissed') as notifications_dismissed,
    ROUND(
        CASE 
            WHEN COUNT(ne.id) > 0 
            THEN (COUNT(ne.id) FILTER (WHERE ne.event_type = 'clicked')::FLOAT / COUNT(ne.id)::FLOAT) * 100 
            ELSE 0 
        END, 
        2
    ) as engagement_rate,
    MAX(ne.timestamp) as last_interaction,
    ps.is_active as push_subscription_active
FROM auth.users u
LEFT JOIN notification_events ne ON u.id = ne.user_id
LEFT JOIN push_subscriptions ps ON u.id = ps.user_id AND ps.is_active = true
GROUP BY u.id, u.email, ps.is_active
ORDER BY engagement_rate DESC;

-- Default notification templates
INSERT INTO notification_templates (name, title, body, icon, actions) VALUES
('welcome', 'ARTIKLO''ya Hoş Geldiniz! 🎉', 'Hukuki belgelerinizi kolayca oluşturmaya başlayın. 50+ profesyonel şablon sizi bekliyor!', '/icons/welcome.png', '[{"action": "explore", "title": "Şablonları Keşfet"}, {"action": "dismiss", "title": "Kapat"}]'::jsonb),
('template_recommendation', 'Size Özel Şablon Önerisi 📋', 'İhtiyaçlarınıza uygun yeni bir şablon önerisi var!', '/icons/recommendation.png', '[{"action": "view", "title": "Şablonu Görüntüle"}, {"action": "dismiss", "title": "Daha Sonra"}]'::jsonb),
('document_ready', 'Belgeniz Hazır! ✅', 'Belgesi başarıyla oluşturuldu. İndirebilir veya paylaşabilirsiniz.', '/icons/document-ready.png', '[{"action": "download", "title": "İndir"}, {"action": "view", "title": "Görüntüle"}]'::jsonb),
('system_maintenance', 'Sistem Bakımı Bildirimi 🔧', 'Sistem bakımı hakkında önemli bildirim.', '/icons/maintenance.png', '[{"action": "ok", "title": "Anladım"}]'::jsonb),
('daily_digest', 'Günlük Özet 📊', 'Bugünkü platform aktivitelerinizin özeti.', '/icons/digest.png', '[{"action": "view", "title": "Detayları Gör"}, {"action": "dismiss", "title": "Kapat"}]'::jsonb)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE push_subscriptions IS 'Kullanıcı push notification subscription bilgileri';
COMMENT ON TABLE notification_templates IS 'Notification şablonları';
COMMENT ON TABLE notification_campaigns IS 'Notification kampanyaları ve istatistikleri';
COMMENT ON TABLE notification_events IS 'Notification etkileşim olayları';
COMMENT ON TABLE user_notification_preferences IS 'Kullanıcı bildirim tercihleri';
COMMENT ON TABLE notification_queue IS 'Zamanlanmış notification kuyruğu';