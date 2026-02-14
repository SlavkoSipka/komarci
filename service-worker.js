// Service Worker - Obriši sve cache-ove i deregistruj se
// Ovo će osigurati da korisnici dobiju svežu verziju sajta

self.addEventListener('install', event => {
  // Odmah skini se i obriši sve
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Obriši SVE cache-ove
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('Deleting caches:', cacheNames);
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Deregistruj se
      return self.unregister();
    })
  );
});

self.addEventListener('fetch', event => {
  // Nemoj cache-ovati ništa, pusti browser da sve učita normalno
  return;
});
