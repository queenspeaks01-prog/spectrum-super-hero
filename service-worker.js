const CACHE_NAME = 'spectrum-super-hero-shell-calm-corner-v1';
const APP_SHELL = [
  './',
  './index.html',
  './calm-corner/index.html',
  './quiet-room/charlie-calming-bubbles.html',
  './quiet-room/emily-peaceful-sounds.html',
  './quiet-room/index.html',
  './quiet-room/john-quiet-break.html',
  './quiet-room/kevin-find-five.html',
  './quiet-room/mya-feelings.html',
  './quiet-room/raife-count-with-me.html',
  './quiet-room/sarah-breathe-with-me.html',

  './theater.css',
  './theater.js',
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
  './hero-challenge-portraits/john.jpg',
  './grownup-hero-avatars/caregiver-coach-v3.jpg',
  './grownup-hero-avatars/family-guide-v3.jpg',
  './grownup-hero-avatars/educator-mentor-v3.jpg',
  './grownup-hero-avatars/community-mentor-v3.jpg',
  './grownup-hero-avatars/sunshine-v3.jpg',
  './grownup-hero-avatars/sky-v3.jpg',
  './grownup-hero-avatars/spark-v3.jpg',
  './grownup-hero-avatars/wisdom-v3.jpg'
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
  // Let media range requests stream directly; partial video responses cannot be cached reliably.
  if (request.headers.has('range')) return;
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
