import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.mrk.freenotes',
  appName: 'Free Notes',
  webDir: 'dist',
  server: { androidScheme: 'https' }
};
export default config;
