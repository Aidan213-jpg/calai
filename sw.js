var CACHE = 'calai-v3';
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
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    }).then(() => clients.claim())
  );
});

// Network-first: always try to get fresh content, fall back to cache
self.addEventListener('fetch', function(e) {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(function(response) {
      // Update cache with fresh response
      const clone = response.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return response;
    }).catch(function() {
      // Offline fallback
      return caches.match(e.request);
    })
  );
});
