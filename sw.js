// Cache version - bumped to v2 to ensure users get the new Light/Dark theme and Global features
const CACHE = 'calcmy-v2'; 
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Forces the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  // Tell the active service worker to take control of the page immediately
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Return cached version if found, otherwise fetch from network. 
      // If network fails (offline), fallback to index.html for smooth offline PWA experience.
      return cached || fetch(e.request).catch(() => caches.match('/index.html'));
    })
  );
});
