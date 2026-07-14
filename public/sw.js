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
  e.respondWith(
    fetch(e.request).catch(async () => {
      const cached = await caches.match(e.request)
      if (cached) return cached
      // Mai restituire undefined a respondWith(): il browser lo tratta come
      // ERR_EMPTY_RESPONSE invece di un errore di rete normale/ritentabile.
      return new Response('', { status: 503, statusText: 'Service Unavailable' })
    })
  )
})
