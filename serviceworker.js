const CACHE_NAME = 'my-player-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/resources/hiphopbackground.jpeg',
  '/resources/icon.png',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css',
  'https://www.youtube.com/iframe_api'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
