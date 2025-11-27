// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tmdbApiKey: '0d147ba1d4464d1ceec758e2a54e450e',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',

  firebase: {
  apiKey: "AIzaSyA227g1cTb4D52aPSFENRuXph8HY79Q0Ns",
  authDomain: "filmoteka-ebe17.firebaseapp.com",
  projectId: "filmoteka-ebe17",
  storageBucket: "filmoteka-ebe17.firebasestorage.app",
  messagingSenderId: "880867438842",
  appId: "1:880867438842:web:abca5fc6419972e8085943"
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
