const CACHE_NAME = 'spectrum-super-hero-shell-v6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './spectrum-super-hero-kids-logo.png',
  './spectrum-super-hero-badges-updated.png',
  './hero-challenge-portraits/raife.jpg',
  './hero-challenge-portraits/kevin.jpg',
  './hero-challenge-portraits/sarah.jpg',
  './hero-challenge-portraits/charlie.jpg',
  './hero-challenge-portraits/emily.jpg',
  './hero-challenge-portraits/mya.jpg',
  './hero-challenge-portraits/john.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Do not cache Supabase/API calls or other cross-origin requests: account and cloud data need the network.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      return cached || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
