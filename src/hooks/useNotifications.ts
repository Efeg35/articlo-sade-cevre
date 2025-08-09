import { useEffect, useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { notificationService } from '../services/notifications';
import { toast } from 'sonner';

interface NotificationState {
    isSupported: boolean;
    permission: NotificationPermission;
    isSubscribed: boolean;
    loading: boolean;
    error?: string;
}

export const useNotifications = () => {
    const session = useSession();
    const [state, setState] = useState<NotificationState>({
        isSupported: false,
        permission: 'default',
        isSubscribed: false,
        loading: false
    });

    useEffect(() => {
        checkNotificationSupport();
        if (session?.user?.id) {
            checkSubscriptionStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    useEffect(() => {
        // Service Worker message listener
        const handleServiceWorkerMessage = (event: MessageEvent) => {
            const { type, data } = event.data || {};

            if (type === 'NOTIFICATION_EVENT') {
                // Handle notification events from service worker
                console.log('[Notifications] Event received:', data);

                // You could track these events in analytics here
                // analytics.trackNotificationEvent(data.event_type, data);
            }
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

            return () => {
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            };
        }
    }, []);

    const checkNotificationSupport = () => {
        const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
        const permission = isSupported ? Notification.permission : 'denied';

        setState(prev => ({
            ...prev,
            isSupported,
            permission
        }));
    };

    const checkSubscriptionStatus = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            const status = await notificationService.getSubscriptionStatus(session.user.id);
            setState(prev => ({
                ...prev,
                isSubscribed: status.isSubscribed
            }));
        } catch (error) {
            console.error('[useNotifications] Check subscription error:', error);
        }
    }, [session?.user?.id]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        setState(prev => ({ ...prev, loading: true, error: undefined }));

        try {
            const permission = await notificationService.requestPermission();
            setState(prev => ({ ...prev, permission, loading: false }));

            if (permission === 'granted') {
                toast.success('Bildirim izni verildi!');
                return true;
            } else if (permission === 'denied') {
                toast.error('Bildirim izni reddedildi. Tarayıcı ayarlarından değiştirebilirsiniz.');
                setState(prev => ({ ...prev, error: 'Bildirim izni reddedildi' }));
            } else {
                toast.info('Bildirim izni bekleniyor...');
            }

            return false;
        } catch (error) {
            console.error('[useNotifications] Permission request error:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'İzin isteği başarısız'
            }));
            toast.error('Bildirim izni isteği başarısız oldu');
            return false;
        }
    }, []);

    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!session?.user?.id) {
            toast.error('Giriş yapmadan bildirim aboneliği yapılamaz');
            return false;
        }

        setState(prev => ({ ...prev, loading: true, error: undefined }));

        try {
            // First request permission if not granted
            if (state.permission !== 'granted') {
                const permissionGranted = await requestPermission();
                if (!permissionGranted) {
                    setState(prev => ({ ...prev, loading: false }));
                    return false;
                }
            }

            const subscription = await notificationService.subscribe(session.user.id);

            if (subscription) {
                setState(prev => ({ ...prev, isSubscribed: true, loading: false }));
                toast.success('Bildirim aboneliği aktif edildi! 🔔');

                // Send welcome notification
                setTimeout(() => {
                    notificationService.sendWelcomeNotification(session.user.id);
                }, 2000);

                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Abonelik oluşturulamadı'
                }));
                toast.error('Bildirim aboneliği oluşturulamadı');
                return false;
            }
        } catch (error) {
            console.error('[useNotifications] Subscribe error:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Abonelik başarısız'
            }));
            toast.error('Bildirim aboneliği başarısız oldu');
            return false;
        }
    }, [session?.user?.id, state.permission, requestPermission]);

    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!session?.user?.id) return false;

        setState(prev => ({ ...prev, loading: true, error: undefined }));

        try {
            const success = await notificationService.unsubscribe(session.user.id);

            if (success) {
                setState(prev => ({ ...prev, isSubscribed: false, loading: false }));
                toast.success('Bildirim aboneliği iptal edildi');
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Abonelik iptal edilemedi'
                }));
                toast.error('Bildirim aboneliği iptal edilemedi');
                return false;
            }
        } catch (error) {
            console.error('[useNotifications] Unsubscribe error:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Abonelik iptali başarısız'
            }));
            toast.error('Bildirim aboneliği iptali başarısız oldu');
            return false;
        }
    }, [session?.user?.id]);

    const sendTestNotification = useCallback(async (): Promise<boolean> => {
        if (!session?.user?.id) {
            toast.error('Test bildirimi göndermek için giriş yapmalısınız');
            return false;
        }

        if (!state.isSubscribed) {
            toast.error('Test bildirimi göndermek için önce abone olmalısınız');
            return false;
        }

        try {
            const success = await notificationService.sendTestNotification(session.user.id);

            if (success) {
                toast.success('Test bildirimi gönderildi! 🧪');
                return true;
            } else {
                toast.error('Test bildirimi gönderilemedi');
                return false;
            }
        } catch (error) {
            console.error('[useNotifications] Test notification error:', error);
            toast.error('Test bildirimi başarısız oldu');
            return false;
        }
    }, [session?.user?.id, state.isSubscribed]);

    // Notification methods
    const sendWelcomeNotification = useCallback(async () => {
        if (!session?.user?.id) return false;
        return await notificationService.sendWelcomeNotification(session.user.id);
    }, [session?.user?.id]);

    const sendTemplateRecommendation = useCallback(async (templateTitle: string, templateId: string) => {
        if (!session?.user?.id) return false;
        return await notificationService.sendTemplateRecommendation(session.user.id, templateTitle, templateId);
    }, [session?.user?.id]);

    const sendDocumentReady = useCallback(async (documentTitle: string) => {
        if (!session?.user?.id) return false;
        return await notificationService.sendDocumentReady(session.user.id, documentTitle);
    }, [session?.user?.id]);

    return {
        // State
        isSupported: state.isSupported,
        permission: state.permission,
        isSubscribed: state.isSubscribed,
        loading: state.loading,
        error: state.error,

        // Actions
        requestPermission,
        subscribe,
        unsubscribe,
        sendTestNotification,

        // Notification senders
        sendWelcomeNotification,
        sendTemplateRecommendation,
        sendDocumentReady,

        // Utils
        checkSubscriptionStatus
    };
};