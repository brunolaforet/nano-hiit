const CACHE_NAME = 'hiit-v1.23';
const ASSETS = [
  '/nano-hiit/',
  '/nano-hiit/index.html',
  '/nano-hiit/manifest.json',
  '/nano-hiit/icon-192.png',
  '/nano-hiit/icon-512.png',
  '/nano-hiit/a.svg'
];

// Installation : mise en cache + skipWaiting chaîné correctement
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(ASSETS.map(url =>
        cache.add(url).catch(err => console.log("Fichier non bloquant manquant :", url))
      ));
    }).then(() => self.skipWaiting()) // ← chaîné après la mise en cache complète
  );
});

// Activation : nettoyage des anciennes versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    )).then(() => self.clients.claim())
  );
});

// Stratégie : CACHE-FIRST (priorité absolue au local pour la vitesse)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(res => {
      return res || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/nano-hiit/index.html');
      });
    })
  );
});
