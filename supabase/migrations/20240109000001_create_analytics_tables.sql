-- Analytics ve tracking için tablolar

-- User sessions tablosu
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    page_views INTEGER DEFAULT 0,
    device_info JSONB,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events tablosu
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    page_url TEXT,
    page_title TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    properties JSONB,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User behavior aggregation tablosu
CREATE TABLE IF NOT EXISTS user_behavior_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_views INTEGER DEFAULT 0,
    session_duration_seconds INTEGER DEFAULT 0,
    templates_viewed INTEGER DEFAULT 0,
    templates_generated INTEGER DEFAULT 0,
    documents_downloaded INTEGER DEFAULT 0,
    searches_performed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Template performance tracking
CREATE TABLE IF NOT EXISTS template_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id TEXT NOT NULL,
    template_title TEXT,
    template_category TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    generations INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, date)
);

-- Search analytics tablosu
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT REFERENCES user_sessions(session_id) ON DELETE SET NULL,
    filters JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error tracking tablosu
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    error_type TEXT NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT REFERENCES user_sessions(session_id) ON DELETE SET NULL,
    page_url TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics tablosu
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT REFERENCES user_sessions(session_id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_user_behavior_stats_user_id ON user_behavior_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_stats_date ON user_behavior_stats(date);

CREATE INDEX IF NOT EXISTS idx_template_analytics_template_id ON template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_template_analytics_date ON template_analytics(date);

CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Trigger'lar updated_at alanları için
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_behavior_stats_updated_at BEFORE UPDATE ON user_behavior_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_analytics_updated_at BEFORE UPDATE ON template_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) politikaları
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Analytics tabloları için politikalar (sadece kendi verilerini görebilir)
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own behavior stats" ON user_behavior_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own behavior stats" ON user_behavior_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior stats" ON user_behavior_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Template analytics herkes görebilir (genel istatistikler)
CREATE POLICY "Anyone can view template analytics" ON template_analytics
    FOR SELECT USING (true);

CREATE POLICY "Service can insert template analytics" ON template_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update template analytics" ON template_analytics
    FOR UPDATE USING (true);

-- Search analytics sadece kendi aramalarını görebilir
CREATE POLICY "Users can view own searches" ON search_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON search_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Error logs ve performance metrics - sadece insert
CREATE POLICY "Anyone can insert errors" ON error_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert performance metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- Analytics fonksiyonları

-- Günlük kullanıcı istatistikleri güncellemek için fonksiyon
CREATE OR REPLACE FUNCTION update_daily_user_stats(
    p_user_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_behavior_stats (
        user_id,
        date,
        page_views,
        templates_viewed,
        templates_generated,
        documents_downloaded,
        searches_performed
    )
    SELECT 
        p_user_id,
        p_date,
        COUNT(*) FILTER (WHERE event_type = 'page_view'),
        COUNT(*) FILTER (WHERE event_type = 'template_interaction' AND event_name = 'Template View'),
        COUNT(*) FILTER (WHERE event_type = 'template_interaction' AND event_name = 'Template Generate'),
        COUNT(*) FILTER (WHERE event_type = 'document_action' AND event_name = 'Document Download'),
        COUNT(*) FILTER (WHERE event_type = 'search')
    FROM analytics_events 
    WHERE user_id = p_user_id 
    AND DATE(timestamp) = p_date
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        page_views = EXCLUDED.page_views,
        templates_viewed = EXCLUDED.templates_viewed,
        templates_generated = EXCLUDED.templates_generated,
        documents_downloaded = EXCLUDED.documents_downloaded,
        searches_performed = EXCLUDED.searches_performed,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Template istatistikleri güncellemek için fonksiyon
CREATE OR REPLACE FUNCTION update_template_stats(
    p_template_id TEXT,
    p_template_title TEXT,
    p_template_category TEXT,
    p_date DATE DEFAULT CURRENT_DATE
) RETURNS VOID AS $$
BEGIN
    INSERT INTO template_analytics (
        template_id,
        template_title,
        template_category,
        date,
        views,
        generations,
        downloads
    )
    SELECT 
        p_template_id,
        p_template_title,
        p_template_category,
        p_date,
        COUNT(*) FILTER (WHERE event_name = 'Template View'),
        COUNT(*) FILTER (WHERE event_name = 'Template Generate'),
        COUNT(*) FILTER (WHERE event_type = 'document_action' AND event_name = 'Document Download' 
                        AND properties->>'template_id' = p_template_id)
    FROM analytics_events 
    WHERE (properties->>'template_id' = p_template_id OR 
           (event_type = 'template_interaction' AND properties->>'template_id' = p_template_id))
    AND DATE(timestamp) = p_date
    ON CONFLICT (template_id, date) 
    DO UPDATE SET
        views = EXCLUDED.views,
        generations = EXCLUDED.generations,
        downloads = EXCLUDED.downloads,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Analytics dashboard için view'lar

-- Günlük genel istatistikler
CREATE OR REPLACE VIEW daily_platform_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_type = 'template_interaction') as template_interactions,
    COUNT(*) FILTER (WHERE event_type = 'document_action') as document_actions,
    COUNT(*) FILTER (WHERE event_type = 'search') as searches
FROM analytics_events
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Popüler şablonlar
CREATE OR REPLACE VIEW popular_templates AS
SELECT 
    template_id,
    template_title,
    template_category,
    SUM(views) as total_views,
    SUM(generations) as total_generations,
    SUM(downloads) as total_downloads,
    ROUND(AVG(views), 2) as avg_daily_views
FROM template_analytics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY template_id, template_title, template_category
ORDER BY total_views DESC;

-- Kullanıcı aktivite özeti
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT s.session_id) as total_sessions,
    SUM(s.page_views) as total_page_views,
    MAX(s.last_activity) as last_seen,
    SUM(ubs.templates_viewed) as templates_viewed,
    SUM(ubs.templates_generated) as templates_generated,
    SUM(ubs.documents_downloaded) as documents_downloaded
FROM auth.users u
LEFT JOIN user_sessions s ON u.id = s.user_id
LEFT JOIN user_behavior_stats ubs ON u.id = ubs.user_id
GROUP BY u.id, u.email
ORDER BY last_seen DESC;

COMMENT ON TABLE user_sessions IS 'Kullanıcı oturumları ve temel bilgiler';
COMMENT ON TABLE analytics_events IS 'Tüm kullanıcı etkileşimleri ve olaylar';
COMMENT ON TABLE user_behavior_stats IS 'Günlük kullanıcı davranış istatistikleri';
COMMENT ON TABLE template_analytics IS 'Şablon performans istatistikleri';
COMMENT ON TABLE search_analytics IS 'Arama sorguları ve sonuçları';
COMMENT ON TABLE error_logs IS 'Uygulama hataları ve log kayıtları';
COMMENT ON TABLE performance_metrics IS 'Performans metrikleri';