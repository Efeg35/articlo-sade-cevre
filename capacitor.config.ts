import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artiklo.app',
  appName: 'Artiklo',
  webDir: 'dist',
  ios: {
    path: 'ios/src' // iOS projesinin doğru yolunu buraya belirtiyoruz.
  },
  plugins: {
    // Mevcut eklenti ayarların varsa burası korunabilir.
  }
};

export default config;
