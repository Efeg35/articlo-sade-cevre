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
    private vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
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
        if (!this.registration) {
            throw new Error('Service Worker not registered');
        }

        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            });

            const subscriptionData: PushSubscription = {
                user_id: userId,
                endpoint: subscription.endpoint,
                p256dh_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
                auth_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
                user_agent: navigator.userAgent,
                is_active: true
            };

            // Save to database
            const { data, error } = await supabase
                .from('push_subscriptions')
                .insert(subscriptionData)
                .select()
                .single();

            if (error) {
                console.error('[Notifications] Failed to save subscription:', error);
                return null;
            }

            console.log('[Notifications] Subscription saved:', data);
            return data;

        } catch (error) {
            console.error('[Notifications] Subscription failed:', error);
            return null;
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

    // Test notification
    async sendTestNotification(userId: string): Promise<boolean> {
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