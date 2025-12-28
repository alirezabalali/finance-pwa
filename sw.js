self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("finance-pwa-v1").then((cache) =>
        cache.addAll(["./index.html", "./manifest.json", "./sw.js"])
      )
    );
    self.skipWaiting();
  });
  
  self.addEventListener("fetch", (event) => {
    // Skip caching for POST requests and external API calls
    if (event.request.method !== "GET" || event.request.url.includes("script.google.com")) {
      event.respondWith(fetch(event.request));
      return;
    }
    
    // Only cache GET requests for local resources
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  });
  
