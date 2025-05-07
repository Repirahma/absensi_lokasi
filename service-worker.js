const CACHE_NAME = "absensi-cache-v1";
const assetsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/icon-192x192.png",
    "/icon-512x512.png"
];

// Install Service Worker dan Cache Assets
self.addEventListener("install", (event) => {
    console.log("Service Worker: Installed");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Caching Files");
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// Activate Service Worker dan Hapus Cache Lama
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activated");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: Fetching", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Jika offline dan tidak ada cache
                if (event.request.destination === "document") {
                    return caches.match("/index.html");
                }
            });
        })
    );
});
