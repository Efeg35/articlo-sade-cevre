import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artiklo.app',
  appName: 'Artiklo',
  webDir: 'dist',
  server: {
    hostname: 'app',
    allowNavigation: ["app", "127.0.0.1", "localhost"]
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;