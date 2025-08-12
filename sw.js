const CACHE_NAME = "electrodeck-v1";
const ASSETS = [
  "/Elex1/", 
  "/Elex1/index.html",
  "/Elex1/styles/main.css",
  "/Elex1/scripts/flashcard.js",
  "/Elex1/favicon.ico",
  "/Elex1/manifest.json",
  "/Elex1/introsemiconductors.json",
  "/Elex1/semiconductor-diodes.json",
  "/Elex1/special-diodes-and-applications.json",
  "/Elex1/fets.json",
  "/Elex1/bjts.json",
  "/Elex1/combinational.json",
  "/Elex1/fundamentals.json"
];

// Install: cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
