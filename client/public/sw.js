const CACHE = 'plannernote-v1';

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE).then(c => c.add('/')));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  const { request } = evt;
  const url = new URL(request.url);

  // Skip non-GET, API, and WebSocket requests
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.protocol === 'ws:' || url.protocol === 'wss:') return;

  // Cache-first for hashed assets (JS/CSS/fonts — filenames include content hash)
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(woff2?|ttf|otf|eot)$/i)) {
    evt.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Network-first for navigation (HTML) — fall back to cached root
  if (request.mode === 'navigate') {
    evt.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('/')))
    );
    return;
  }
});
