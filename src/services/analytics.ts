import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface AnalyticsEvent {
    event_type: string;
    event_name: string;
    user_id?: string;
    session_id: string;
    page_url: string;
    page_title: string;
    user_agent: string;
    timestamp: string;
    properties?: Record<string, string | number | boolean | null>;
    device_info?: {
        isMobile: boolean;
        platform: string;
        viewport: {
            width: number;
            height: number;
        };
    };
}

export interface UserSession {
    session_id: string;
    user_id?: string;
    start_time: string;
    last_activity: string;
    page_views: number;
    device_info: {
        isMobile: boolean;
        platform: string;
        viewport: {
            width: number;
            height: number;
        };
    };
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}

class AnalyticsService {
    private sessionId: string;
    private userId?: string;
    private startTime: string;
    private pageViews: number = 0;
    private isTrackingEnabled: boolean = true;

    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date().toISOString();
        this.initializeTracking();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getDeviceInfo() {
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            platform: navigator.platform,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    private getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || undefined,
            utm_medium: urlParams.get('utm_medium') || undefined,
            utm_campaign: urlParams.get('utm_campaign') || undefined,
        };
    }

    async initializeTracking() {
        if (!this.isTrackingEnabled) return;

        try {
            // Kullanıcı session'ını başlat
            const sessionData: UserSession = {
                session_id: this.sessionId,
                user_id: this.userId,
                start_time: this.startTime,
                last_activity: new Date().toISOString(),
                page_views: 0,
                device_info: this.getDeviceInfo(),
                referrer: document.referrer || undefined,
                ...this.getUrlParams()
            };

            await supabase
                .from('user_sessions')
                .insert(sessionData);

            console.log('[Analytics] Session initialized:', this.sessionId);
        } catch (error) {
            console.error('[Analytics] Failed to initialize session:', error);
        }
    }

    setUserId(userId: string) {
        this.userId = userId;
        this.updateSession({ user_id: userId });
    }

    private async updateSession(updates: Partial<UserSession>) {
        if (!this.isTrackingEnabled) return;

        try {
            await supabase
                .from('user_sessions')
                .update({
                    ...updates,
                    last_activity: new Date().toISOString()
                })
                .eq('session_id', this.sessionId);
        } catch (error) {
            console.error('[Analytics] Failed to update session:', error);
        }
    }

    async trackEvent(eventType: string, eventName: string, properties?: Record<string, string | number | boolean | null>) {
        if (!this.isTrackingEnabled) return;

        try {
            const event: AnalyticsEvent = {
                event_type: eventType,
                event_name: eventName,
                user_id: this.userId,
                session_id: this.sessionId,
                page_url: window.location.href,
                page_title: document.title,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                properties,
                device_info: this.getDeviceInfo()
            };

            await supabase
                .from('analytics_events')
                .insert(event);

            console.log('[Analytics] Event tracked:', eventName, properties);
        } catch (error) {
            console.error('[Analytics] Failed to track event:', error);
        }
    }

    async trackPageView(pagePath: string, pageTitle: string) {
        this.pageViews++;
        await this.updateSession({ page_views: this.pageViews });

        await this.trackEvent('page_view', 'Page View', {
            page_path: pagePath,
            page_title: pageTitle,
            page_views_in_session: this.pageViews
        });
    }

    async trackTemplateView(templateId: string, templateTitle: string, category: string) {
        await this.trackEvent('template_interaction', 'Template View', {
            template_id: templateId,
            template_title: templateTitle,
            template_category: category
        });
    }

    async trackTemplateGenerate(templateId: string, templateTitle: string, category: string) {
        await this.trackEvent('template_interaction', 'Template Generate', {
            template_id: templateId,
            template_title: templateTitle,
            template_category: category
        });
    }

    async trackDocumentDownload(templateId: string, format: 'docx' | 'txt' | 'pdf', templateTitle: string) {
        await this.trackEvent('document_action', 'Document Download', {
            template_id: templateId,
            template_title: templateTitle,
            download_format: format
        });
    }

    async trackSearch(query: string, resultsCount: number, filters?: Record<string, string | number | boolean>) {
        await this.trackEvent('search', 'Search Query', {
            search_query: query,
            results_count: resultsCount,
            ...filters
        });
    }

    async trackUserAction(action: string, target: string, properties?: Record<string, string | number | boolean | null>) {
        await this.trackEvent('user_action', action, {
            target,
            ...properties
        });
    }

    async trackError(errorType: string, errorMessage: string, stackTrace?: string) {
        await this.trackEvent('error', 'Application Error', {
            error_type: errorType,
            error_message: errorMessage,
            stack_trace: stackTrace
        });
    }

    async trackPerformance(metricName: string, value: number, unit: string) {
        await this.trackEvent('performance', 'Performance Metric', {
            metric_name: metricName,
            metric_value: value,
            metric_unit: unit
        });
    }

    // Conversion tracking
    async trackConversion(conversionType: string, value?: number, properties?: Record<string, string | number | boolean | null>) {
        await this.trackEvent('conversion', conversionType, {
            conversion_value: value,
            ...properties
        });
    }

    // Feature usage tracking
    async trackFeatureUsage(featureName: string, action: string, properties?: Record<string, string | number | boolean | null>) {
        await this.trackEvent('feature_usage', `${featureName}: ${action}`, properties);
    }

    // Session management
    async endSession() {
        await this.updateSession({
            last_activity: new Date().toISOString()
        });
    }

    // Privacy controls
    enableTracking() {
        this.isTrackingEnabled = true;
        localStorage.setItem('analytics_enabled', 'true');
    }

    disableTracking() {
        this.isTrackingEnabled = false;
        localStorage.setItem('analytics_enabled', 'false');
    }

    getTrackingStatus(): boolean {
        const stored = localStorage.getItem('analytics_enabled');
        return stored !== 'false'; // Default to enabled
    }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Export analytics for global use
declare global {
    interface Window {
        analytics: AnalyticsService;
    }
}

if (typeof window !== 'undefined') {
    window.analytics = analytics;
}