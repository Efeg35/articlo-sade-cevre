import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Logger } from '@/utils/logger';

interface PlatformOptimizations {
    isNative: boolean;
    platform: string;
    isIOS: boolean;
    isAndroid: boolean;
    hasNotch: boolean;
    safeAreaInsets: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

export const usePlatformOptimizations = () => {
    const [optimizations, setOptimizations] = useState<PlatformOptimizations>({
        isNative: false,
        platform: 'web',
        isIOS: false,
        isAndroid: false,
        hasNotch: false,
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    useEffect(() => {
        const initializePlatformOptimizations = async () => {
            try {
                const isNative = Capacitor.isNativePlatform();
                const platform = Capacitor.getPlatform();
                const isIOS = platform === 'ios';
                const isAndroid = platform === 'android';

                const safeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
                let hasNotch = false;

                if (isNative) {
                    // iOS specific optimizations
                    if (isIOS) {
                        try {
                            // Fallback: detect notch using CSS env variables
                            if (typeof window !== 'undefined') {
                                const topInset = parseInt(getComputedStyle(document.documentElement)
                                    .getPropertyValue('env(safe-area-inset-top)').replace('px', '')) || 0;

                                safeAreaInsets.top = topInset;
                                hasNotch = topInset > 20;
                            }

                            // Set status bar for iOS
                            try {
                                const { StatusBar, Style } = await import('@capacitor/status-bar');
                                await StatusBar.setStyle({ style: Style.Dark });
                                await StatusBar.setBackgroundColor({ color: '#ffffff' });
                            } catch (error) {
                                Logger.warn('PlatformOptimizations', 'StatusBar plugin error', error);
                            }
                        } catch (error) {
                            Logger.warn('PlatformOptimizations', 'iOS optimization error', error);
                        }
                    }

                    // Android specific optimizations
                    if (isAndroid) {
                        try {
                            const { StatusBar, Style } = await import('@capacitor/status-bar');
                            await StatusBar.setStyle({ style: Style.Dark });
                            await StatusBar.setBackgroundColor({ color: '#ffffff' });
                        } catch (error) {
                            Logger.warn('PlatformOptimizations', 'StatusBar plugin error', error);
                        }
                    }
                }

                setOptimizations({
                    isNative,
                    platform,
                    isIOS,
                    isAndroid,
                    hasNotch,
                    safeAreaInsets
                });

                Logger.log('PlatformOptimizations', 'Platform optimizations initialized', {
                    isNative,
                    platform,
                    hasNotch
                });

            } catch (error) {
                Logger.error('PlatformOptimizations', 'Initialization error', error);
            }
        };

        initializePlatformOptimizations();
    }, []);

    // Apply CSS custom properties for safe areas
    useEffect(() => {
        if (optimizations.isNative && optimizations.isIOS) {
            const root = document.documentElement;
            root.style.setProperty('--safe-area-inset-top', `${optimizations.safeAreaInsets.top}px`);
            root.style.setProperty('--safe-area-inset-bottom', `${optimizations.safeAreaInsets.bottom}px`);
            root.style.setProperty('--safe-area-inset-left', `${optimizations.safeAreaInsets.left}px`);
            root.style.setProperty('--safe-area-inset-right', `${optimizations.safeAreaInsets.right}px`);

            // Add platform classes
            document.body.classList.add('platform-ios');
            if (optimizations.hasNotch) {
                document.body.classList.add('has-notch');
            }
        }

        if (optimizations.isAndroid) {
            document.body.classList.add('platform-android');
        }

        return () => {
            document.body.classList.remove('platform-ios', 'platform-android', 'has-notch');
        };
    }, [optimizations]);

    return optimizations;
};