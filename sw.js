var CACHE = 'calai-v1';
var SHELL = [
  '/calai/',
  '/calai/index.html',
  '/calai/manifest.json',
  '/calai/icon-192.png',
  '/calai/icon-512.png',
  '/calai/apple-touch-icon.png'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Fetch handler — required for Chrome PWA installability
self.addEventListener('fetch', function(e) {
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request);
      })
    );
  }
});
