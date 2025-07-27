import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artiklo.app',
  appName: 'Artiklo',
  webDir: 'dist',
  plugins: {
    // Mevcut eklenti ayarların varsa burası korunabilir.
  }
};

export default config;
