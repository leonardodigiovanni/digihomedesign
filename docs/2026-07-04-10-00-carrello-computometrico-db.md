# Carrello Computometrico — Migrazione a DB

**Data:** 2026-07-04  
**Stato:** in attesa di conferma

## Problema

`carrello-preventivo` non ha il flash perché il carrello è sul **database**: la server page carica le righe da DB e le passa come props al client — l'HTML servito al browser contiene già gli articoli, nessun secondo render.

`carrello-computometrico` usa `localStorage` che non esiste lato server: il server renderizza sempre un carrello vuoto, poi il client legge il localStorage dopo il mount e ri-renderizza → flash inevitabile, indipendentemente da `ssr: false`, cache di modulo o qualsiasi altro trick client-side.

## Soluzione

Portare il carrello computometrico su DB esattamente come il preventivo.

## Schema DB

Nuova tabella (creata automaticamente al primo accesso, come già fatto per altre tabelle):

```sql
CREATE TABLE IF NOT EXISTS computometrici_carrello (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(100) NOT NULL,
  uid            INT          NOT NULL,
  parent_uid     INT          NULL,
  listino_id     INT          NOT NULL,
  categoria      VARCHAR(200) NOT NULL DEFAULT '',
  produttore     VARCHAR(200) NOT NULL DEFAULT '',
  serie          VARCHAR(200) NOT NULL DEFAULT '',
  descrizione    TEXT         NOT NULL,
  unita          VARCHAR(50)  NOT NULL DEFAULT 'pz',
  quantita       DECIMAL(10,3) NOT NULL DEFAULT 1,
  larghezza_cm   DECIMAL(10,2) NULL,
  altezza_cm     DECIMAL(10,2) NULL,
  colore         VARCHAR(200)  NULL,
  note           TEXT          NULL,
  prezzo_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
  totale_riga     DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order      INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
)
```

Una riga per utente (username da cookie `session_user`). Nessun `carrello_id` — un solo carrello attivo per utente.

## File coinvolti

| File | Cosa cambia |
|------|-------------|
| `app/area-clienti/carrello-computometrico/page.tsx` | Aggiunge query DB per caricare righe carrello dell'utente; le passa come prop `initialRighe` |
| `app/area-clienti/carrello-computometrico/actions.ts` | Aggiunge server actions: `addRigaCarrello`, `removeRigaCarrello`, `updateNoteCarrello`, `clearCarrelloComputometrico` |
| `app/area-clienti/carrello-computometrico/carrello-client.tsx` | Rimuove `localStorage` + cache di modulo; usa `initialRighe` come stato iniziale; chiama server actions per ogni mutazione; `salvaComputometrico` chiama `clearCarrelloComputometrico` a successo |
| `app/area-clienti/carrello-computometrico/carrello-wrapper.tsx` | **Eliminato** — non serve più `ssr: false` |

## Passi di implementazione

1. Aggiungere server actions per CRUD carrello in `actions.ts`
2. Aggiornare `page.tsx`: query DB → `initialRighe` → props al client
3. Aggiornare `carrello-client.tsx`:
   - `useState(initialRighe)` invece di lazy initializer localStorage
   - ogni `setRighe` diventa ottimista: aggiorna stato locale + chiama server action in background
   - rimuovere tutti i riferimenti a `localStorage`, `_righeCache`, `_uid` globale
4. Eliminare `carrello-wrapper.tsx`
5. Aggiornare badge navbar: il count viene ora dal DB (come `cartCount` del preventivo) oppure mantenuto via `useEffect` → localStorage solo per il badge (non per i dati del carrello)

## Note

- Il `uid` locale rimane per React key e per `expandedUID`, ma diventa l'`id` DB restituito dalla insert
- Le mutazioni sono ottimistiche (aggiornamento UI immediato, server action in background) per non avere lag percepibile
- La tabella viene creata in `page.tsx` con `CREATE TABLE IF NOT EXISTS`, come già fatto per `computometrici`
