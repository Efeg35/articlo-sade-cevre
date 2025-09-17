import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artiklo.app',
  appName: 'Artiklo',
  webDir: 'dist',

  // Development server ayarları (sadece development'ta aktif)
  server: process.env.NODE_ENV === 'development' ? {
    hostname: 'app',
    allowNavigation: ["app", "127.0.0.1", "localhost", "capacitor://localhost"]
  } : undefined,

  // Plugin konfigürasyonları
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#1a73e8",
      splashFullScreen: true,
      splashImmersive: true,
      autoHide: true
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ffffff",
      overlaysWebView: false
    },
    Keyboard: {
      resize: "none",
      style: "default",
      resizeOnFullScreen: false
    },
    Camera: {
      quality: 90,
      allowEditing: false,
      resultType: "Base64"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_launcher",
      iconColor: "#1a73e8"
    },
    Haptics: {
      enabled: true
    }
  },

  // iOS özel ayarları (GÜVENLİK DÜZELTMELERİ)
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: false,
    backgroundColor: '#ffffff',
    // 🔧 YAZIM HATASI DÜZELTİLDİ - SecurityError çözümü için kritik:
    limitsNavigationsToAppBoundDomains: false,  // ✅ DÜZELTME: "App" kelimesi eklendi
    scheme: 'capacitor'
  },

  // Android özel ayarları (GÜVENLİK DÜZELTMELERİ)
  android: {
    allowMixedContent: process.env.NODE_ENV === 'development',
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV === 'development',
    appendUserAgent: 'Artiklo-Mobile',
    backgroundColor: '#ffffff',
    minWebViewVersion: 55
  },

  // Production ayarları
  loggingBehavior: process.env.NODE_ENV === 'production' ? 'none' : 'debug',

  // SecurityError çözümü için ek konfigürasyonlar
  cordova: {
    preferences: {
      scheme: 'https',
      hostname: 'localhost'
    }
  }
};

export default config;
