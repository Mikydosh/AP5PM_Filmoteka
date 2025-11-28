import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Filmotéka',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
