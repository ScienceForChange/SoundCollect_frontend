// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  serverURL: 'https://soundcollectapp.com',
  serverCalibrationURL: 'https://soundcollectflask.com',
  encryptionKey: '0123456789abcdef0123456789abcdef',
  urlUpdateAndroid: 'https://play.google.com/store/apps/details?id=com.qualud.soundcollect',
  urlUpdateIOS: 'https://apps.apple.com/us/app/sound-collect/id64707141238',
  appVersion: '1.1.10',
  API_VERSION: 1,
  keys: {
    googleMaps: 'AIzaSyAv9L4QUQYplK9TOdNavuFFmmQgiwVETT0'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
