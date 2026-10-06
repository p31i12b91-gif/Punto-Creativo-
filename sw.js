const CACHE_NAME = 'tejiendo-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// 1. Instalación del Service Worker y guardado en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos en caché guardados correctamente');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Error al guardar en caché durante la instalación:', err);
      })
  );
  self.skipWaiting();
});

// 2. Activación para limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estrategia de red con respaldo en caché (Network First / Cache Fallback)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si hay internet, devuelve la respuesta de la red
        return response;
      })
      .catch(() => {
        // Si falla la red (sin conexión), busca el archivo en la caché
        return caches.match(event.request);
      })
  );
});
