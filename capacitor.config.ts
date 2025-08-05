import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artiklo.app',
  appName: 'Artiklo',
  webDir: 'dist',
  server: {
    hostname: 'app',
    // allowNavigation DİKKAT: Bu satır 'ios' içinden buraya taşındı.
    allowNavigation: ["app"]
  }
};

export default config;