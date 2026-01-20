const CACHE_NAME = 'angel-pwa-v8';
const ASSETS = [
  'index.html',
  'assets/home.webp',
  'assets/brain.webp',
  'assets/soul.webp',
  'assets/relation.webp',
  'assets/story.webp',
  'assets/tool.webp',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
