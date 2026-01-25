// Service Worker - DEAKTIVIRAN
// Pravi probleme sa cache-ovanjem slika i back/forward navigacijom
// Možete ga ponovo aktivirati kasnije ako želite offline funkcionalnost

// Unregister this service worker immediately
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Don't intercept any fetch requests
self.addEventListener('fetch', event => {
  // Let browser handle all requests normally
  return;
});
