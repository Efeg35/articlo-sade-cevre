import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface PlatformInfo {
  isNative: boolean;
  platform: string;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
}

interface PluginAvailability {
  camera: boolean;
  filesystem: boolean;
  haptics: boolean;
  statusBar: boolean;
  keyboard: boolean;
}

export function usePlatform() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isNative: false,
    platform: 'web',
    isIOS: false,
    isAndroid: false,
    isWeb: true
  });

  const [pluginAvailability, setPluginAvailability] = useState<PluginAvailability>({
    camera: false,
    filesystem: false,
    haptics: false,
    statusBar: false,
    keyboard: false
  });

  // Platform detection
  const detectPlatform = useCallback(() => {
    try {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();

      const info: PlatformInfo = {
        isNative,
        platform,
        isIOS: platform === 'ios',
        isAndroid: platform === 'android',
        isWeb: platform === 'web'
      };

      setPlatformInfo(info);
      console.log('[usePlatform] Platform detected:', info);
      return info;
    } catch (error) {
      console.error('[usePlatform] Platform detection error:', error);
      const fallbackInfo: PlatformInfo = {
        isNative: false,
        platform: 'web',
        isIOS: false,
        isAndroid: false,
        isWeb: true
      };
      setPlatformInfo(fallbackInfo);
      return fallbackInfo;
    }
  }, []);

  // Plugin availability kontrolü
  const checkPluginAvailability = useCallback(async () => {
    const availability: PluginAvailability = {
      camera: false,
      filesystem: false,
      haptics: false,
      statusBar: false,
      keyboard: false
    };

    try {
      // Camera plugin kontrolü
      try {
        const { Camera } = await import('@capacitor/camera');
        availability.camera = true;
        console.log('[usePlatform] Camera plugin available');
      } catch (error) {
        console.warn('[usePlatform] Camera plugin not available:', error);
      }

      // Filesystem plugin kontrolü
      try {
        const { Filesystem } = await import('@capacitor/filesystem');
        availability.filesystem = true;
        console.log('[usePlatform] Filesystem plugin available');
      } catch (error) {
        console.warn('[usePlatform] Filesystem plugin not available:', error);
      }

      // Haptics plugin kontrolü
      try {
        const { Haptics } = await import('@capacitor/haptics');
        availability.haptics = true;
        console.log('[usePlatform] Haptics plugin available');
      } catch (error) {
        console.warn('[usePlatform] Haptics plugin not available:', error);
      }

      // StatusBar plugin kontrolü
      try {
        const { StatusBar } = await import('@capacitor/status-bar');
        availability.statusBar = true;
        console.log('[usePlatform] StatusBar plugin available');
      } catch (error) {
        console.warn('[usePlatform] StatusBar plugin not available:', error);
      }

      // Keyboard plugin kontrolü
      try {
        const { Keyboard } = await import('@capacitor/keyboard');
        availability.keyboard = true;
        console.log('[usePlatform] Keyboard plugin available');
      } catch (error) {
        console.warn('[usePlatform] Keyboard plugin not available:', error);
      }

    } catch (error) {
      console.error('[usePlatform] Plugin availability check error:', error);
    }

    setPluginAvailability(availability);
    console.log('[usePlatform] Plugin availability:', availability);
  }, []);

  useEffect(() => {
    const platform = detectPlatform();

    if (platform.isNative) {
      checkPluginAvailability();
    }
  }, [detectPlatform, checkPluginAvailability]);

  // Web fallback mekanizması
  const getWebFallback = useCallback((feature: keyof PluginAvailability) => {
    if (!platformInfo.isNative) {
      console.log(`[usePlatform] Using web fallback for ${feature}`);
      return true;
    }
    return pluginAvailability[feature];
  }, [platformInfo.isNative, pluginAvailability]);

  return {
    ...platformInfo,
    pluginAvailability,
    getWebFallback,
    // Utility fonksiyonlar
    isFeatureAvailable: (feature: keyof PluginAvailability) => getWebFallback(feature),
    // Platform-specific helpers
    isMobile: platformInfo.isNative,
    isDesktop: !platformInfo.isNative,
    // Plugin-specific helpers
    canUseCamera: getWebFallback('camera'),
    canUseFilesystem: getWebFallback('filesystem'),
    canUseHaptics: getWebFallback('haptics'),
    canUseStatusBar: getWebFallback('statusBar'),
    canUseKeyboard: getWebFallback('keyboard')
  };
} 