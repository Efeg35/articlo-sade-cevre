import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Logger } from '@/utils/logger';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

interface HapticOptions {
    fallback?: boolean; // Use web vibration API as fallback
    duration?: number; // For web vibration fallback
}

export const useHapticFeedback = () => {
    const triggerHaptic = useCallback(async (
        type: HapticType = 'light',
        options: HapticOptions = {}
    ) => {
        const { fallback = true, duration = 50 } = options;

        try {
            if (Capacitor.isNativePlatform()) {
                // Use Capacitor Haptics plugin
                const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');

                switch (type) {
                    case 'light':
                        await Haptics.impact({ style: ImpactStyle.Light });
                        break;
                    case 'medium':
                        await Haptics.impact({ style: ImpactStyle.Medium });
                        break;
                    case 'heavy':
                        await Haptics.impact({ style: ImpactStyle.Heavy });
                        break;
                    case 'selection':
                        await Haptics.selectionChanged();
                        break;
                    case 'success':
                        await Haptics.notification({ type: NotificationType.Success });
                        break;
                    case 'warning':
                        await Haptics.notification({ type: NotificationType.Warning });
                        break;
                    case 'error':
                        await Haptics.notification({ type: NotificationType.Error });
                        break;
                    default:
                        await Haptics.impact({ style: ImpactStyle.Light });
                }

                Logger.debug('HapticFeedback', 'Native haptic triggered', { type });
            } else if (fallback && 'vibrate' in navigator) {
                // Fallback to web vibration API
                const vibrationPattern = getVibrationPattern(type, duration);
                navigator.vibrate(vibrationPattern);

                Logger.debug('HapticFeedback', 'Web vibration triggered', { type, pattern: vibrationPattern });
            }
        } catch (error) {
            Logger.warn('HapticFeedback', 'Haptic feedback failed', { type, error });
        }
    }, []);

    // Convenience methods
    const light = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
    const medium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
    const heavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);
    const selection = useCallback(() => triggerHaptic('selection'), [triggerHaptic]);
    const success = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
    const warning = useCallback(() => triggerHaptic('warning'), [triggerHaptic]);
    const error = useCallback(() => triggerHaptic('error'), [triggerHaptic]);

    return {
        triggerHaptic,
        light,
        medium,
        heavy,
        selection,
        success,
        warning,
        error,
    };
};

// Helper function to get vibration patterns for web fallback
const getVibrationPattern = (type: HapticType, baseDuration: number): number | number[] => {
    switch (type) {
        case 'light':
            return baseDuration;
        case 'medium':
            return baseDuration * 1.5;
        case 'heavy':
            return baseDuration * 2;
        case 'selection':
            return [baseDuration * 0.5];
        case 'success':
            return [baseDuration, baseDuration * 0.5, baseDuration];
        case 'warning':
            return [baseDuration * 1.5, baseDuration, baseDuration * 1.5];
        case 'error':
            return [baseDuration * 2, baseDuration, baseDuration * 2, baseDuration, baseDuration * 2];
        default:
            return baseDuration;
    }
};