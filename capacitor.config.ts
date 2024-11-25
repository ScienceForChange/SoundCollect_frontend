import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qualud.soundcollect',
  appName: 'sonsCAT',
  webDir: 'www',
  plugins:{
    SplashScreen:{
      launchAutoHide:true,
      showSpinner:false,
      androidSpinnerStyle:'small',
      iosSpinnerStyle:'small',
      spinnerColor:'#ffffff',
      splashFullScreen:true,
      androidScaleType:'CENTER_CROP',
      splashImmersive:false
    }
  }
};

export default config;
