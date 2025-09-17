import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// Google OAuth için Client ID'leri (production'da environment variables'dan alınmalı)
const GOOGLE_CLIENT_IDS = {
    ios: '209862574756-tv2toqphd3k3lvb6ffv05vt0p3glre7c.apps.googleusercontent.com', // iOS bundle ID ile eşleşmeli
    web: '209862574756-r2jpnsudbrv8mk8jghoj55u451jsqht1.apps.googleusercontent.com'
};

export const useIOSOAuth = () => {
    useEffect(() => {
        const initializeNativeOAuth = async () => {
            try {
                const platform = Capacitor.getPlatform();
                const isNative = Capacitor.isNativePlatform();
                const userAgent = navigator.userAgent;

                // Force iOS check even if detection fails
                const isLikelyiOS = /iPad|iPhone|iPod/.test(userAgent);

                // Sadece iOS native platformunda çalıştır
                if (isNative && platform === 'ios') {
                    // Google Auth'u initialize et
                    await GoogleAuth.initialize({
                        clientId: GOOGLE_CLIENT_IDS.ios,
                        scopes: ['profile', 'email'],
                        grantOfflineAccess: true,
                    });
                } else if (isLikelyiOS && typeof GoogleAuth !== 'undefined') {
                    // Platform detection başarısız ama iOS'ta çalışıyoruz
                    await GoogleAuth.initialize({
                        clientId: GOOGLE_CLIENT_IDS.ios,
                        scopes: ['profile', 'email'],
                        grantOfflineAccess: true,
                    });
                }
            } catch (error) {
                console.error('iOS OAuth initialization failed:', error);
            }
        };

        initializeNativeOAuth();
    }, []);
};