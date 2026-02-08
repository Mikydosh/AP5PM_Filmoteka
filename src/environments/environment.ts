// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tmdbApiKey: 'your_tmdb_api_key_here',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',

  firebase: {
    // your firebase configuration here
  apiKey: "your_firebase_api_key_here",
  authDomain: "your_firebase_auth_domain_here",
  projectId: "your_firebase_project_id_here",
  storageBucket: "your_firebase_storage_bucket_here",
  messagingSenderId: "your_firebase_messaging_sender_id_here",
  appId: "your_firebase_app_id_here"
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
