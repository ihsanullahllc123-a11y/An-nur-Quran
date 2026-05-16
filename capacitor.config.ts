import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quran.annur',
    appName: 'An Nur Quran',
      webDir: 'dist',
        plugins: {
            AdMob: {
                  appId: 'ca-app-pub-9722480803829956~8304060688'
                      }
                        }
                        };

                        export default config;
                        