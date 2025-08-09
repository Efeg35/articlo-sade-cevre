import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface PushSubscription {
    id?: string;
    user_id: string;
    endpoint: string;
    p256dh_key: string;
    auth_key: string;
    user_agent: string;
    is_active: boolean;
    created_at?: string;
}

export interface NotificationTemplate {
    id?: string;
    name: string;
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    actions?: NotificationAction[];
    data?: Record<string, string | number | boolean>;
    require_interaction?: boolean;
}

export interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}

export interface NotificationCampaign {
    id?: string;
    title: string;
    template_id: string;
    target_criteria: {
        user_segments?: string[];
        user_behavior?: string[];
        location?: string;
        device_type?: string;
    };
    scheduled_at?: string;
    sent_at?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    recipients_count?: number;
    delivered_count?: number;
    clicked_count?: number;
    created_at?: string;
}

class NotificationService {
    private vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BMxW8J3qJ4K9HY7JXQP1X2K8V4N0X5Y9Z3M2L7Q0R6T8S1U0V7W3X9Y6Z4A2B5C8D1E4F7G0H3I6J9K2L5M8N1O4P7Q0R3S6T9U2V5W8X1Y4Z7A0B3C6D9E2F5G8H1I4J7K0L3M6N9O2P5Q8R1S4T7U0V3W6X9Y2Z5A8B1C4D7E0F3G6H9I2J5K8L1M4N7O0P3Q6R9S2T5U8V1W4X7Y0Z3A6B9C2D5E8F1G4H7I0J3K6L9M2N5O8P1Q4R7S0T3U6V9W2X5Y8Z1A4B7C0D3E6F9G2H5I8J1K4L7M0N3O6P9Q2R5S8T1U4V7W0X3Y6Z9A2B5C8D1E4F7G0H3I6J9K2L5M8N1O4P7Q0';
    private isSupported: boolean;
    private registration: ServiceWorkerRegistration | null = null;

    constructor() {
        this.isSupported = this.checkSupport();
        this.initializeServiceWorker();
    }

    private checkSupport(): boolean {
        return (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
    }

    private async initializeServiceWorker() {
        if (!this.isSupported) {
            console.warn('[Notifications] Push notifications not supported');
            return;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('[Notifications] Service Worker registered');
        } catch (error) {
            console.error('[Notifications] Service Worker registration failed:', error);
        }
    }

    async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported) {
            throw new Error('Push notifications not supported');
        }

        const permission = await Notification.requestPermission();
        console.log('[Notifications] Permission:', permission);

        return permission;
    }

    async subscribe(userId: string): Promise<PushSubscription | null> {
        try {
            // First ensure we have permission
            const permission = await this.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Bildirim izni gerekli');
            }

            // Development fallback: Create mock subscription for browser notifications
            if (!this.vapidPublicKey || this.vapidPublicKey.length < 50) {
                console.warn('[Notifications] VAPID key not configured, using browser notification fallback');

                const mockSubscription: PushSubscription = {
                    user_id: userId,
                    endpoint: `mock-browser-${Date.now()}`,
                    p256dh_key: 'mock-p256dh-key',
                    auth_key: 'mock-auth-key',
                    user_agent: navigator.userAgent,
                    is_active: true
                };

                // Try to save to database, fallback to local if fails
                try {
                    const { data, error } = await supabase
                        .from('push_subscriptions')
                        .upsert([mockSubscription], {
                            onConflict: 'user_id,endpoint',
                            ignoreDuplicates: false
                        })
                        .select()
                        .single();

                    if (error) {
                        console.warn('[Notifications] Database save failed, using local subscription:', error);
                        return mockSubscription;
                    }

                    console.log('[Notifications] Mock subscription saved:', data);
                    return data;
                } catch (dbError) {
                    console.warn('[Notifications] Database not available, using local subscription');
                    return mockSubscription;
                }
            }

            // Real push subscription with valid VAPID key
            if (!this.registration) {
                throw new Error('Service Worker bulunamadı');
            }

            const pushSubscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            });

            const subscriptionData: PushSubscription = {
                user_id: userId,
                endpoint: pushSubscription.endpoint,
                p256dh_key: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('p256dh')!))),
                auth_key: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('auth')!))),
                user_agent: navigator.userAgent,
                is_active: true
            };

            // Save to database
            const { data, error } = await supabase
                .from('push_subscriptions')
                .upsert([subscriptionData], {
                    onConflict: 'user_id,endpoint',
                    ignoreDuplicates: false
                })
                .select()
                .single();

            if (error) {
                console.error('[Notifications] Database save failed:', error);
                throw new Error('Database kaydetme hatası: ' + error.message);
            }

            console.log('[Notifications] Real subscription saved successfully:', data);
            return data;

        } catch (error) {
            console.error('[Notifications] Subscription failed:', error);
            throw error;
        }
    }

    async unsubscribe(userId: string): Promise<boolean> {
        if (!this.registration) {
            return false;
        }

        try {
            const subscription = await this.registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
            }

            // Deactivate in database
            const { error } = await supabase
                .from('push_subscriptions')
                .update({ is_active: false })
                .eq('user_id', userId);

            if (error) {
                console.error('[Notifications] Failed to deactivate subscription:', error);
                return false;
            }

            console.log('[Notifications] Unsubscribed successfully');
            return true;

        } catch (error) {
            console.error('[Notifications] Unsubscribe failed:', error);
            return false;
        }
    }

    async getSubscriptionStatus(userId: string): Promise<{ isSubscribed: boolean; subscription?: PushSubscription }> {
        try {
            const { data } = await supabase
                .from('push_subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .single();

            return {
                isSubscribed: !!data,
                subscription: data || undefined
            };
        } catch (error) {
            return { isSubscribed: false };
        }
    }

    // Notification Templates
    async createTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at'>): Promise<NotificationTemplate | null> {
        try {
            const { data, error } = await supabase
                .from('notification_templates')
                .insert(template)
                .select()
                .single();

            if (error) {
                console.error('[Notifications] Failed to create template:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('[Notifications] Create template error:', error);
            return null;
        }
    }

    async getTemplates(): Promise<NotificationTemplate[]> {
        try {
            const { data } = await supabase
                .from('notification_templates')
                .select('*')
                .order('created_at', { ascending: false });

            return data || [];
        } catch (error) {
            console.error('[Notifications] Get templates error:', error);
            return [];
        }
    }

    async updateTemplate(id: string, updates: Partial<NotificationTemplate>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notification_templates')
                .update(updates)
                .eq('id', id);

            return !error;
        } catch (error) {
            console.error('[Notifications] Update template error:', error);
            return false;
        }
    }

    async deleteTemplate(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notification_templates')
                .delete()
                .eq('id', id);

            return !error;
        } catch (error) {
            console.error('[Notifications] Delete template error:', error);
            return false;
        }
    }

    // Send notification
    async sendNotification(
        title: string,
        body: string,
        options: {
            targetUsers?: string[];
            targetSegments?: string[];
            icon?: string;
            badge?: string;
            actions?: NotificationAction[];
            data?: Record<string, string | number | boolean>;
            requireInteraction?: boolean;
            scheduledAt?: Date;
        } = {}
    ): Promise<{ success: boolean; campaignId?: string }> {
        try {
            // Create notification campaign
            const campaign = {
                title,
                template_id: 'custom',
                target_criteria: {
                    user_segments: options.targetSegments,
                    device_type: 'web'
                },
                scheduled_at: options.scheduledAt?.toISOString(),
                status: options.scheduledAt ? 'scheduled' : 'sending'
            };

            const { data: campaignData, error: campaignError } = await supabase
                .from('notification_campaigns')
                .insert(campaign)
                .select()
                .single();

            if (campaignError) {
                console.error('[Notifications] Failed to create campaign:', campaignError);
                return { success: false };
            }

            // If scheduled, don't send immediately
            if (options.scheduledAt) {
                return { success: true, campaignId: campaignData.id };
            }

            // Send notification via Edge Function
            const payload = {
                title,
                body,
                icon: options.icon || '/icons/icon-192x192.png',
                badge: options.badge || '/icons/badge-72x72.png',
                actions: options.actions,
                data: options.data,
                requireInteraction: options.requireInteraction,
                targetUsers: options.targetUsers,
                targetSegments: options.targetSegments,
                campaignId: campaignData.id
            };

            const { data, error } = await supabase.functions.invoke('send-push-notification', {
                body: payload
            });

            if (error) {
                console.error('[Notifications] Send notification error:', error);
                return { success: false };
            }

            console.log('[Notifications] Notification sent:', data);
            return { success: true, campaignId: campaignData.id };

        } catch (error) {
            console.error('[Notifications] Send notification error:', error);
            return { success: false };
        }
    }

    // Quick notification methods
    async sendWelcomeNotification(userId: string): Promise<boolean> {
        const result = await this.sendNotification(
            'ARTIKLO\'ya Hoş Geldiniz! 🎉',
            'Hukuki belgelerinizi kolayca oluşturmaya başlayın. 50+ profesyonel şablon sizi bekliyor!',
            {
                targetUsers: [userId],
                icon: '/icons/welcome.png',
                actions: [
                    { action: 'explore', title: 'Şablonları Keşfet', icon: '/icons/explore.png' },
                    { action: 'dismiss', title: 'Kapat' }
                ],
                data: { type: 'welcome', action_url: '/templates' }
            }
        );

        return result.success;
    }

    async sendTemplateRecommendation(userId: string, templateTitle: string, templateId: string): Promise<boolean> {
        const result = await this.sendNotification(
            'Size Özel Şablon Önerisi 📋',
            `"${templateTitle}" şablonu ihtiyaçlarınıza uygun olabilir. Hemen inceleyin!`,
            {
                targetUsers: [userId],
                actions: [
                    { action: 'view', title: 'Şablonu Görüntüle' },
                    { action: 'dismiss', title: 'Daha Sonra' }
                ],
                data: { type: 'template_recommendation', template_id: templateId, action_url: `/templates?id=${templateId}` }
            }
        );

        return result.success;
    }

    async sendDocumentReady(userId: string, documentTitle: string): Promise<boolean> {
        const result = await this.sendNotification(
            'Belgeniz Hazır! ✅',
            `"${documentTitle}" belgesi başarıyla oluşturuldu. İndirebilir veya paylaşabilirsiniz.`,
            {
                targetUsers: [userId],
                requireInteraction: true,
                actions: [
                    { action: 'download', title: 'İndir' },
                    { action: 'view', title: 'Görüntüle' }
                ],
                data: { type: 'document_ready', document_title: documentTitle }
            }
        );

        return result.success;
    }

    async sendSystemMaintenance(message: string, scheduledTime: Date): Promise<boolean> {
        const result = await this.sendNotification(
            'Sistem Bakımı Bildirimi 🔧',
            message,
            {
                targetSegments: ['all_users'],
                scheduledAt: scheduledTime,
                requireInteraction: true,
                data: { type: 'system_maintenance' }
            }
        );

        return result.success;
    }

    // Analytics
    async trackNotificationEvent(
        campaignId: string,
        event: 'delivered' | 'clicked' | 'dismissed',
        userId?: string
    ): Promise<void> {
        try {
            await supabase
                .from('notification_events')
                .insert({
                    campaign_id: campaignId,
                    event_type: event,
                    user_id: userId,
                    timestamp: new Date().toISOString()
                });
        } catch (error) {
            console.error('[Notifications] Track event error:', error);
        }
    }

    // Helper methods
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Test notification (fallback to browser notification)
    async sendTestNotification(userId: string): Promise<boolean> {
        try {
            // Try browser notification first (simpler)
            if (Notification.permission === 'granted') {
                new Notification('Test Bildirimi 🧪', {
                    body: 'Bu bir test bildirimidir. Bildirimler başarıyla çalışıyor!',
                    icon: '/logo-transparent.png',
                    badge: '/logo-transparent.png'
                });
                console.log('[Notifications] Browser notification sent');
                return true;
            }

            // Fallback to service if available
            const result = await this.sendNotification(
                'Test Bildirimi 🧪',
                'Bu bir test bildirimidir. Bildirimler başarıyla çalışıyor!',
                {
                    targetUsers: [userId],
                    actions: [
                        { action: 'success', title: '👍 Harika!' },
                        { action: 'dismiss', title: 'Tamam' }
                    ],
                    data: { type: 'test' }
                }
            );

            return result.success;
        } catch (error) {
            console.error('[Notifications] Test notification failed:', error);
            return false;
        }
    }
}

// Singleton instance
export const notificationService = new NotificationService();

// Export for global use
declare global {
    interface Window {
        notificationService: NotificationService;
    }
}

if (typeof window !== 'undefined') {
    window.notificationService = notificationService;
}