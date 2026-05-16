const CACHE = 'digi-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

// Passthrough: nessuna cache aggressiva (il sito è dinamico/DB-driven).
// Il SW serve solo a soddisfare il requisito di installabilità PWA.
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})
