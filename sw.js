const CACHE_NAME = "finance-pwa-v2";

self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>
        cache.addAll(["./index.html", "./manifest.json", "./sw.js"])
      )
    );
    self.skipWaiting();
  });

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
  
  self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Don't intercept POST/PUT/DELETE requests - let browser handle them
    if (request.method !== "GET") {
      return; // Browser handles it normally
    }
    
    // Don't intercept external API calls - let browser handle them
    if (
      url.hostname.includes("script.google.com") ||
      url.hostname.includes("googleapis.com") ||
      url.origin !== self.location.origin
    ) {
      return; // Browser handles it normally
    }
    
    // Only cache GET requests for local resources (same origin)
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          // Only cache successful responses for same-origin requests
          if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          }
          return response;
        });
      })
    );
  });
  
