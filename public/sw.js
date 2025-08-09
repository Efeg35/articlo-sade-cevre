// Service Worker for Push Notifications
const CACHE_NAME = 'artiklo-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('[SW] Install event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Push event - ana push notification handler
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let notificationData = {};

    if (event.data) {
        try {
            notificationData = event.data.json();
        } catch (e) {
            notificationData = {
                title: 'ARTIKLO',
                body: event.data.text() || 'Yeni bir bildiriminiz var!',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png'
            };
        }
    } else {
        notificationData = {
            title: 'ARTIKLO',
            body: 'Yeni bir bildiriminiz var!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png'
        };
    }

    const {
        title,
        body,
        icon = '/icons/icon-192x192.png',
        badge = '/icons/badge-72x72.png',
        actions = [],
        data = {},
        requireInteraction = false,
        tag,
        renotify = false,
        silent = false,
        vibrate = [200, 100, 200],
        timestamp
    } = notificationData;

    const notificationOptions = {
        body,
        icon,
        badge,
        actions,
        data,
        requireInteraction,
        tag: tag || 'artiklo-notification',
        renotify,
        silent,
        vibrate,
        timestamp: timestamp || Date.now(),
        // Visual options
        dir: 'auto',
        lang: 'tr-TR',
        // Interaction options
        sticky: requireInteraction
    };

    console.log('[SW] Showing notification:', title, notificationOptions);

    event.waitUntil(
        self.registration.showNotification(title, notificationOptions)
            .then(() => {
                console.log('[SW] Notification shown successfully');
                // Track notification delivered event
                return trackNotificationEvent('delivered', notificationData);
            })
            .catch((error) => {
                console.error('[SW] Error showing notification:', error);
            })
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event);

    const notification = event.notification;
    const action = event.action;
    const data = notification.data || {};

    // Close notification
    notification.close();

    // Track click event
    trackNotificationEvent('clicked', { action, data });

    // Handle action
    if (action === 'dismiss' || action === 'close') {
        // Just close, no action needed
        return;
    }

    let urlToOpen = '/';

    // Determine URL based on action or notification data
    if (action === 'explore') {
        urlToOpen = '/templates';
    } else if (action === 'view') {
        urlToOpen = data.action_url || '/dashboard';
    } else if (action === 'download') {
        // Handle download action
        if (data.document_id) {
            urlToOpen = `/documents/${data.document_id}`;
        } else {
            urlToOpen = '/dashboard';
        }
    } else if (data.action_url) {
        urlToOpen = data.action_url;
    } else if (data.type === 'welcome') {
        urlToOpen = '/templates';
    } else if (data.type === 'template_recommendation' && data.template_id) {
        urlToOpen = `/templates?id=${data.template_id}`;
    } else if (data.type === 'document_ready') {
        urlToOpen = '/dashboard';
    }

    // Open/focus window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window/tab open with the target URL
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        console.log('[SW] Focusing existing window:', urlToOpen);
                        return client.focus();
                    }
                }

                // Check if there's any ARTIKLO window open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'navigate' in client) {
                        console.log('[SW] Navigating existing window to:', urlToOpen);
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }

                // If no window is open, open a new one
                if (clients.openWindow) {
                    console.log('[SW] Opening new window:', urlToOpen);
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed:', event);

    const notification = event.notification;
    const data = notification.data || {};

    // Track dismiss event
    trackNotificationEvent('dismissed', data);
});

// Background sync event
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event);

    if (event.tag === 'background-sync-notifications') {
        event.waitUntil(
            syncPendingNotifications()
        );
    }
});

// Message event (communication with main thread)
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event);

    const { type, data } = event.data || {};

    switch (type) {
        case 'TRACK_NOTIFICATION_EVENT':
            trackNotificationEvent(data.event, data.notificationData);
            break;
        case 'CLEAR_NOTIFICATIONS':
            clearAllNotifications();
            break;
        case 'GET_NOTIFICATIONS':
            getNotifications().then(notifications => {
                event.ports[0].postMessage({ notifications });
            });
            break;
        default:
            console.log('[SW] Unknown message type:', type);
    }
});

// Helper functions

async function trackNotificationEvent(eventType, notificationData = {}) {
    try {
        const trackingData = {
            event_type: eventType,
            campaign_id: notificationData.campaignId,
            user_id: notificationData.userId,
            timestamp: new Date().toISOString(),
            metadata: {
                action: notificationData.action,
                notification_type: notificationData.type,
                ...notificationData.data
            }
        };

        // Send to main thread for database tracking
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'NOTIFICATION_EVENT',
                data: trackingData
            });
        });

        console.log('[SW] Tracked notification event:', eventType, trackingData);
    } catch (error) {
        console.error('[SW] Error tracking notification event:', error);
    }
}

async function syncPendingNotifications() {
    try {
        console.log('[SW] Syncing pending notifications...');

        // Get pending notifications from IndexedDB or localStorage
        // This would be implemented based on your offline storage strategy

        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_NOTIFICATIONS'
            });
        });
    } catch (error) {
        console.error('[SW] Error syncing notifications:', error);
    }
}

async function clearAllNotifications() {
    try {
        const notifications = await self.registration.getNotifications();
        notifications.forEach(notification => {
            notification.close();
        });
        console.log('[SW] Cleared all notifications');
    } catch (error) {
        console.error('[SW] Error clearing notifications:', error);
    }
}

async function getNotifications() {
    try {
        const notifications = await self.registration.getNotifications();
        return notifications.map(n => ({
            tag: n.tag,
            title: n.title,
            body: n.body,
            icon: n.icon,
            data: n.data,
            timestamp: n.timestamp
        }));
    } catch (error) {
        console.error('[SW] Error getting notifications:', error);
        return [];
    }
}

// Fetch event (for caching and offline support)
self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Skip analytics and notification API calls
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('supabase.co') ||
        event.request.url.includes('analytics') ||
        event.request.url.includes('notifications')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Return offline page if available
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});

// Error event
self.addEventListener('error', (event) => {
    console.error('[SW] Error:', event);
});

// Unhandled rejection event
self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled rejection:', event);
});

console.log('[SW] Service Worker loaded successfully');