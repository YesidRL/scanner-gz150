// Service Worker para Scanner Vision-FI PWA
// Versión del cache - cambiar este número cuando se actualice la app
const CACHE_NAME = 'scanner-vision-fi-v1';

// Archivos que se guardan en el celular para uso sin internet
const ARCHIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// INSTALACIÓN: guarda los archivos en el celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_PARA_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN: limpia cachés viejos si hubiera versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres.filter((nombre) => nombre !== CACHE_NAME)
               .map((nombre) => caches.delete(nombre))
      );
    })
  );
  self.clients.claim();
});

// FETCH: cuando la app pide un archivo, lo busca en el cache primero
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      // Si está en cache, lo entrega desde el celular (sin internet)
      if (respuestaCache) {
        return respuestaCache;
      }
      // Si no está en cache, lo intenta descargar de internet
      return fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
