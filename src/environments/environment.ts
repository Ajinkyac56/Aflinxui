// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://3.213.139.49:8080',
  OCR_IMAGE_URL:'https://ocr.asego.in:8999',
  b2bWsBrokerURL: 'ws://3.213.139.49:8080/aflinxws',
  SockJSEndpoint: 'http://3.213.139.49:8080/aflinxws',
  key_disable : false,
  expand_action: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
