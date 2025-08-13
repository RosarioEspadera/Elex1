const CACHE_NAME = 'electrodeck-v2';
const STATIC_ASSETS = [
  '/Elex1/',
  '/Elex1/index.html',
  '/Elex1/styles/main.css',
  '/Elex1/scripts/flashcard.js',
  '/Elex1/favicon.ico',
  '/Elex1/manifest.json'
];

const JSON_DECKS = [
  '/Elex1/introsemiconductors.json',
  '/Elex1/semiconductor-diodes.json',
  '/Elex1/special-diodes-and-applications.json',
  '/Elex1/fets.json',
  '/Elex1/bjts.json',
  '/Elex1/combinational.json',
  '/Elex1/fundamentals.json'
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([...STATIC_ASSETS])
    )
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  clients.claim();
});

// Fetch: smart strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // Network-first for version.json
  if (request.url.endsWith('version.json')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for JSON decks
  if (JSON_DECKS.some(deck => request.url.endsWith(deck))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(cached =>
      cached || fetch(request)
    )
  );
});
