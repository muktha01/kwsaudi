// googleMapsLoader.js
// Singleton loader for Google Maps API using @googlemaps/js-api-loader
import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance = null;
let loaderPromise = null;

export function loadGoogleMaps(options) {
  if (!loaderInstance) {
    loaderInstance = new Loader(options);
    loaderPromise = loaderInstance.load();
  }
  return loaderPromise;
}
