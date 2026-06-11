# App Action Bar — area navigazione fissa

**Data:** 2026-06-11  
**Stato:** in attesa di conferma

---

## Obiettivo

Creare un'area fissa tra il contenuto scrollabile (`app-content`) e il bottom-nav nelle pagine `/app`. Quest'area conterrà i bottoni di navigazione di pagina (← Torna, Vai al carrello, Vai alla simulazione, ecc.) che ora si trovano in fondo al contenuto e scorrono via con esso.

---

## Architettura

### Struttura layout (aggiunta)

```
app-shell (flex column)
  app-topbar
  app-content (flex: 1, overflow-y: auto)   ← contenuto scrollabile
  app-action-bar (flex-shrink: 0)            ← NUOVO: area fissa
  app-bottom-nav
```

`app-action-bar` è parte del flex column del shell, quindi non scrolla.  
Se una pagina non registra nessun bottone, l'area non occupa spazio (height 0).  
Una linea orizzontale separa visivamente l'area dal contenuto.

### Meccanismo di iniezione (React Context)

Poiché le pagine App Router sono server component ma i bottoni dipendono da dati di pagina (href dinamici, stato carrello, ecc.), si usa un pattern context:

1. **`app/app/action-bar-context.tsx`** — context client + provider
2. **`app/app/set-action-bar.tsx`** — componente client che le pagine usano per registrare i bottoni (`useEffect` mount/unmount)
3. **`app/app/app-action-bar.tsx`** — UI bar che legge dal context
4. **`app/app/layout.tsx`** — wrappa tutto con il provider, aggiunge `<AppActionBar />` sopra il bottom-nav

### CSS (globals.css)

```css
.app-action-bar {
  flex-shrink: 0;
  border-top: 1px solid #333;
  padding: 10px 16px;
  background: #1a1a1a;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
```

---

## File coinvolti

| File | Azione |
|------|--------|
| `app/app/action-bar-context.tsx` | Nuovo — context + provider |
| `app/app/set-action-bar.tsx` | Nuovo — componente per iniettare bottoni |
| `app/app/app-action-bar.tsx` | Nuovo — UI barra |
| `app/app/layout.tsx` | Modifica — aggiunge provider + AppActionBar |
| `app/globals.css` | Modifica — aggiunge `.app-action-bar` |
| `app/app/cataloghi/[slug]/page.tsx` | Migrazione — sposta i Link in fondo in SetActionBar |
| `app/app/preventivo/[id]/page.tsx` | Migrazione — passa backHref al SetActionBar via wrapper |

### Pagine da migrare (prima tranche)

- `/app/cataloghi/[slug]` — "← Torna ai Cataloghi" + "Vai alla simulazione"
- `/app/preventivo/[id]` — "← Preventivi" (attualmente dentro PreventivoClient)

### Pagine complesse (seconda tranche, post-conferma)

- `CarrelloAcquistiClient` — bottoni azione multipli
- `CarrelloClient` (preventivo) — bottoni azione multipli
- `CantieriClienteClient`, `AvvisiCliente`, ecc.

---

## Note tecniche

- `SetActionBar` usa `useEffect` con deps vuote: si aggiorna solo a mount/unmount, non a re-render. Sufficiente per bottoni statici di navigazione.
- La pulizia (`set(null)`) garantisce che navigando tra pagine i bottoni della pagina precedente scompaiano.
- Compatibile con soft navigation Next.js App Router: i client component montano/smontano normalmente tra route diverse.
