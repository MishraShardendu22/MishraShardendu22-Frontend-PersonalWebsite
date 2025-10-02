const CACHE_NAME = 'shardendu-portfolio-v1'
const STATIC_CACHE_NAME = 'static-cache-v1'
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1'

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.ico',
  '/Professional.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline - API not available' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      })
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/offline') || caches.match('/')
      })
    )
    return
  }
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()

        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: 'Shardendu Portfolio',
        body: 'Welcome back!',
      }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open Portfolio',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(Promise.resolve())
  }
})
