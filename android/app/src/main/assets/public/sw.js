const CACHE_NAME = 'annur-quran-v2';
const STATIC_CACHE = 'annur-static-v1';
const IMAGE_CACHE = 'annur-images-v1';
const AUDIO_CACHE = 'annur-audio-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== AUDIO_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy for Quran Images (Cache First)
  if (url.href.includes('everyayah.com/data/pakistan_16row') || url.href.includes('raw.githubusercontent.com/pesantren-dev')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then(networkResponse => {
          return caches.open(IMAGE_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy for Audio Files (Cache First)
  if (url.href.includes('everyayah.com/data/audio') || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then(networkResponse => {
          return caches.open(AUDIO_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy for UI Assets & Dynamic Content (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        // Only cache successful GET requests from our origin or common CDNs
        if (request.method === 'GET' && 
            (url.origin === location.origin || url.href.includes('fonts.googleapis.com') || url.href.includes('fonts.gstatic.com'))) {
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for offline - if we have it in cache, return it, otherwise potentially a generic offline page
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-app-data') {
    event.waitUntil(syncAppData());
  }
});

async function syncAppData() {
  console.log('[SW] Syncing application data...');
  // Implement actual sync logic here (e.g. sending queued bookmarks to Firestore)
}

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { 
    title: 'An-Nur Quran', 
    body: 'Time for your daily Quran reading.',
    url: '/'
  };

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    },
    actions: [
      { action: 'open', title: 'Open App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window open
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
