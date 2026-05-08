const cacheName = 'nano-hiit-v1';
const assets = [
  '/nano-hiit/',
  '/nano-hiit/index.html',
  '/nano-hiit/manifest.json',
  '/nano-hiit/sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
