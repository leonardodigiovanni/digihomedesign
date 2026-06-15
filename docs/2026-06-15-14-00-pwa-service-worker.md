# PWA Service Worker — bottone Installa su LAN mobile

**Data:** 2026-06-15  
**Stato:** completato

## Obiettivo

Far comparire il bottone "⬇ Installa" quando l'utente apre l'app da telefono su `ip_server:3000/app`.

## Problema attuale

`beforeinstallprompt` (che fa comparire il bottone) richiede due condizioni:

1. **Service Worker registrato** — mancante
2. **Contesto sicuro** — HTTPS oppure `localhost`; su HTTP + IP LAN il browser non lancia mai l'evento

## Soluzione

### 1. Service Worker minimo (`public/sw.js`)

Un SW fetch-through (nessuna cache aggressiva) serve solo a soddisfare il criterio di installabilità:

```js
self.addEventListener('fetch', () => {})
```

### 2. Registrazione SW nel layout app

In `app/app/layout.tsx` aggiungere un `<Script>` inline (strategy `afterInteractive`) che registra `/sw.js`.

### 3. HTTPS in sviluppo LAN

`beforeinstallprompt` non scatta mai su HTTP da IP LAN.  
Opzioni:
- **`--experimental-https`** flag di Next.js dev (genera cert self-signed, il telefono mostra avviso ma funziona)
- oppure mkcert con certificato locale

Procedo con `--experimental-https` perché non richiede installazioni extra.  
Si aggiorna lo script `dev` in `package.json`:

```json
"dev": "next dev --experimental-https"
```

### File coinvolti

| File | Modifica |
|------|----------|
| `public/sw.js` | nuovo — SW minimo |
| `app/app/layout.tsx` | aggiunge registrazione SW via Script |
| `package.json` | `dev` con `--experimental-https` |

## Note

- Il SW non fa caching: serve solo per soddisfare il requisito PWA
- Su produzione (Vercel, HTTPS reale) il bottone funzionerà senza modifiche a `package.json`
