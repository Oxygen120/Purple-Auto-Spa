/* =========================================
   PURPLE AUTO SPA - SERVICE WORKER
   Handles: Caching & Offline Support
   ========================================= */

const CACHE_NAME = 'purple-spa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin_dashboard.html',
  './staff_dashboard.html',
  './new_job.html',
  './active_jobs.html',
  './bookings.html',
  './expenses.html',
  './manage_staff.html',
  './myspace.html',
  './reports.html',
  './invoice_view.html',
  './client_booking.html',
  
  './assets/css/style.css',
  './assets/css/print.css',
  './assets/js/config.js',
  './assets/js/api.js',
  './assets/js/auth.js',
  './assets/js/main.js',
  './assets/logo.png',
  './assets/icon.png',

  // External Libs (Cache them for speed)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. INSTALL EVENT
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATE EVENT (Clean old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. FETCH EVENT (Network First, Fallback to Cache)
// Kyunki hamara data Google Sheets par hai, hum pehle Network try karenge.
// Agar Offline hain, tabhi Cache dikhayenge (UI load ho jayega, par data nahi).
self.addEventListener('fetch', (event) => {
  
  // Google Script Requests -> Network Only
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // App Files -> Cache First (Speedy Load)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

