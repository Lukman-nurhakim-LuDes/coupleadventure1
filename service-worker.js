// Nama cache
const CACHE_NAME = 'couple-adventure-cache-v1';
// Daftar aset yang akan di-cache
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icons/background.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
  'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

// Event: Menginstal Service Worker dan meng-cache aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Mengambil dari cache saat offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - mengembalikan respons dari cache
        if (response) {
          return response;
        }
        // Tidak ada di cache - mencoba mengambil dari jaringan
        return fetch(event.request).catch(() => {
          // Jika gagal mengambil dari jaringan, berikan respons offline
          return new Response('Anda sedang offline. Silakan coba lagi saat terhubung ke internet.');
        });
      })
  );
});

// Event: Mengelola pembaruan cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
