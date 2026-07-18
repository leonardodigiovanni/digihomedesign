# Conteggio pagine visitate (visite, scorciatoie, minuti di lettura)

Stato: **completato**

## Contesto

Obiettivo: dati SEO seri. Nel pannello "Pagine visibili" di
`/amministrazione/impostazioni`, accanto a ogni pagina (comprese le
super-categorie navigabili tipo `/serramenti`, `/metallurgia`, ecc.) mostrare
5 numeri:

1. Visite da utenti **sloggati**
2. Visite da utenti **clienti** loggati
3. Scorciatoie home **attive** per quella pagina
4. Scorciatoie home **cancellate** per quella pagina (ex-attive, poi rimosse)
5. **Minuti totali** di lettura attiva accumulati sulla pagina

I dipendenti e gli admin **non vengono mai conteggiati** (né come visite né
come minuti): quello che navigano loro non è traffico SEO.

Esempio reale discusso: pagina Infissi in PVC → `321 sloggati / 54 clienti /
42 scorciatoie attive / 11 cancellate / 1200 minuti totali`.

## Decisioni prese in conversazione

### Cosa conta come "visita" (deduplica per sessione)

Non ogni caricamento pagina è una visita. Se un utente entra su Divani, esce
su Lampadari, e torna su Divani nella stessa "uscita" (stessa sessione
browser), la visita a Divani conta **una sola volta**, non due — i minuti
invece si sommano sempre, ad ogni permanenza sulla pagina, anche ai rientri.

Analogia usata dall'utente: quante volte uso la macchina per fare la spesa?
Se esco di casa e faccio 4 tappe (supermercato, fruttivendolo, macellaio,
panettiere) è **un** uso dell'auto, non 4 accensioni separate.

Meccanismo: **`sessionStorage`** del browser (si svuota da solo alla
chiusura di tab/browser — è esattamente il confine "uscita di casa" di cui
sopra, senza bisogno di gestire timeout o sessioni lato server). Il tracker
tiene un elenco di href già visti in questa sessione; se un href è già
nell'elenco, non manda l'evento "visita", solo l'evento "minuti".

### Cosa conta come "minuto" (solo tempo attivo, non tempo con tab aperta)

Se un utente apre una pagina alle 2 di notte sul divano e si addormenta col
browser aperto, non vogliamo contare le ore di sonno come minuti di lettura.

Meccanismo: **battito ("heartbeat") ogni 30 secondi**, con doppio scopo:

1. **Anti tempo-morto**: ad ogni battito, il tracker controlla se c'è stata
   almeno un'interazione dell'utente (mousemove, click, scroll, tasto,
   touch) negli ultimi 30 secondi — stessi eventi già usati da
   `components/inactivity-guard.tsx` per il logout automatico. Se sì, quei
   30 secondi (0,5 minuti) contano; se no, non contano. Il battito si mette
   in pausa quando la tab va in background (`visibilitychange` → hidden) e
   riprende quando torna in foreground.
2. **Anti perdita dati per spegnimento improvviso**: se il PC si spegne di
   colpo (mancanza di corrente, crash, task kill) nessun codice JS fa in
   tempo a girare e l'ultimo intervallo va perso — limite intrinseco di
   qualunque analytics lato browser, non evitabile. Mandando un aggiornamento
   ogni 30s invece che solo all'uscita dalla pagina, il danno massimo in
   questo scenario si riduce a "perdi gli ultimi 30 secondi", non "perdi
   tutta la permanenza sulla pagina".

Su chiusura pagina "pulita" (cambio pagina via router, chiusura tab,
spegnimento normale del PC dal menu Avvio — il sistema dà al browser il
tempo di chiudersi) il residuo di tempo non ancora inviato dall'ultimo
battito viene mandato con `navigator.sendBeacon`, pensato apposta per
sopravvivere alla chiusura della pagina (a differenza di una `fetch`
normale, che può essere interrotta a metà).

### Esclusione dipendente/admin

Il bucket viene deciso **lato server**, leggendo il cookie `session_role`
nel Route Handler — non lato client. Se `dipendente` o `admin`: nessuna
scrittura, richiesta scartata (204 senza side effect). Se `cliente`: bucket
`cliente`. Se cookie assente: bucket `sloggato`.

### Scorciatoie attive/cancellate (nessuna modifica DB)

`lib/home-shortcuts-db.ts` già non cancella mai le righe (`cancellato =
0/1`, mai una `DELETE`). Basta una query di aggregazione sulla tabella
esistente `home_shortcuts`, nessuna migrazione necessaria.

### Super-categorie (hub, es. `/serramenti`)

Oggi non hanno un checkbox in "Pagine visibili" (solo le sotto-pagine ce
l'hanno, tramite `PAGE_GROUPS` in `settings-form.tsx`). Per questa fase
aggiungo **solo la riga di statistiche** accanto al nome del gruppo, senza
aggiungere un checkbox nuovo per attivare/disattivare l'hub — è fuori dallo
scope di questa richiesta (se un domani vorrai anche quello, è un documento
a parte).

## File coinvolti

**Nuovi:**
- `lib/page-visits-db.ts` — `ensureTable()`, `recordVisit(href, bucket)`,
  `recordDwell(href, bucket, minutes)`, `getVisitStats()` (per il pannello),
  `getShortcutStats()` (aggregazione da `home_shortcuts`, già esistente).
- `components/page-visit-tracker.tsx` (`'use client'`) — montato una volta
  sola nel layout globale, per tutti gli utenti (loggati e no). Gestisce
  `sessionStorage`, rilevamento pathname (`usePathname`), rilevamento
  attività (stessi listener di `inactivity-guard.tsx`), battito 30s,
  `sendBeacon` in uscita.
- `app/api/track-visit/route.ts` — Route Handler POST, legge
  `session_role`, decide bucket o scarta, scrive su `page_visits`.

**Modificati:**
- `app/layout.tsx` — monta `<PageVisitTracker />` per tutti gli utenti
  (diversamente da `InactivityGuard`, che è solo per chi è loggato).
- `app/amministrazione/impostazioni/page.tsx` — recupera
  `getVisitStats()` + `getShortcutStats()`, li passa a `SettingsForm`.
- `app/amministrazione/impostazioni/settings-form.tsx` — `PagesPanel`:
  aggiunge la riga dei 5 numeri sotto ogni `CheckRow` e sotto il nome di
  ogni gruppo (per l'hub).

**Non tocco:** `lib/home-shortcuts-db.ts` (solo letto, non modificato),
nessuna sessione lato server per gli sloggati, nessun'altra pagina.

## Schema DB

```sql
CREATE TABLE IF NOT EXISTS page_visits (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  href             VARCHAR(255) NOT NULL,
  bucket           ENUM('sloggato','cliente') NOT NULL,
  visits           INT NOT NULL DEFAULT 0,
  total_dwell_min  DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_href_bucket (href, bucket)
)
```

Una riga per `href` × `bucket` (es. `/serramenti/infissi-in-pvc` +
`sloggato`, e una riga separata `+ cliente`). Il numero "minuti totali"
mostrato nel pannello è la somma delle due righe per quell'href. La media
(se mai servisse in futuro) resta ricavabile con `total_dwell_min / visits`
senza bisogno di un'altra colonna.

## Flusso lato client (`page-visit-tracker.tsx`)

1. Al mount / ad ogni cambio `pathname`:
   - Legge `pv_seen` da `sessionStorage` (array di href).
   - Se l'href corrente non c'è → `fetch POST /api/track-visit
     {href, event:'visit'}` e lo aggiunge all'elenco.
   - Riavvia `lastActivityRef` e il timer del battito per il nuovo href.
2. Listener globali (`mousemove, keydown, mousedown, touchstart,
   touchmove, pointerdown, pointermove, click, scroll`, `passive: true`)
   aggiornano `lastActivityRef.current = Date.now()`.
3. `setInterval` ogni 30s, solo se `document.visibilityState === 'visible'`:
   se c'è stata attività negli ultimi 30s, invia (via `sendBeacon`)
   `{href, event:'dwell', minutes: 0.5}`; altrimenti non invia nulla.
4. Su `visibilitychange` (hidden) o cambio pathname o `pagehide`: ferma il
   battito, invia con `sendBeacon` l'eventuale frazione residua non ancora
   mandata. Su ritorno a `visible`, il battito riprende.

## Flusso lato server (`app/api/track-visit/route.ts`)

1. Legge `session_role` dai cookie della richiesta.
2. `dipendente`/`admin` → risponde 204, nessuna scrittura.
3. Altrimenti bucket = `cliente` se loggato come cliente, `sloggato` se
   nessun cookie di sessione.
4. `event === 'visit'` → `INSERT ... ON DUPLICATE KEY UPDATE visits =
   visits + 1`.
5. `event === 'dwell'` → `INSERT ... ON DUPLICATE KEY UPDATE
   total_dwell_min = total_dwell_min + ?`.

Nota tecnica da verificare in fase di sviluppo: `sendBeacon` manda il body
come testo/Blob (non sempre `Content-Type: application/json` di default) —
il Route Handler deve leggere il body in modo tollerante a questo (es.
`await request.text()` + `JSON.parse`, invece di affidarsi solo a
`request.json()`).

## Pannello "Pagine visibili" — formato display

Per ogni sotto-pagina (`CheckRow` esistente) e per ogni riga di intestazione
gruppo/hub, una riga piccola sotto il nome (stile `fs-11`, colore grigio,
sempre visibile — non è un dato di debug, è un dato admin):

```
321/54 · 42/11 · 1200min
```

(sloggati/clienti · scorciatoie attive/cancellate · minuti totali)

## Verifica prevista

- `npm run lint` + `npx tsc --noEmit` sull'intero progetto.
- Test manuale: visita una pagina da sloggato → verificare +1 visita;
  ricaricare/rientrare nella stessa sessione → verificare che la visita
  NON si incrementi di nuovo, ma i minuti sì; aspettare un paio di battiti
  muovendo il mouse vs stando fermi → verificare che i minuti si accumulino
  solo nel primo caso; chiudere la tab → verificare (via query diretta al
  DB) che l'ultimo residuo sia stato salvato; login come dipendente/admin →
  verificare che non venga scritta alcuna riga.
- Controllo visivo del pannello `/amministrazione/impostazioni` con dati
  reali per almeno una sotto-pagina e un hub.

## Riepilogo modifiche effettive

Implementato esattamente secondo il piano, nessuna scelta tecnica cambiata
in corsa.

- **`lib/page-visits-db.ts`** (nuovo): `ensureTable`, `recordVisit`,
  `recordDwell`, `getVisitStats` (aggrega i due bucket per href, somma i
  minuti), `getShortcutStats` (query di aggregazione read-only su
  `home_shortcuts`, nessuna modifica a quella tabella).
- **`app/api/track-visit/route.ts`** (nuovo): legge `session_role` dal
  cookie, scarta silenziosamente `dipendente`/`admin` (204 senza scrittura),
  instrada `cliente`/assente sui due bucket. Legge il body con
  `request.text()` + `JSON.parse` invece di `request.json()` per tollerare
  sia `fetch` che `sendBeacon` (che non garantisce sempre
  `Content-Type: application/json`).
- **`components/page-visit-tracker.tsx`** (nuovo): dedup visite via
  `sessionStorage` (chiave `pv_seen`), listener di attività (stessi eventi
  di `inactivity-guard.tsx`), battito ogni 30s con flush basato su tempo
  reale trascorso (non un fisso 0,5 min fissi) gestito da `visibilitychange`
  e `pagehide` oltre che dal cambio `pathname`.
- **`app/layout.tsx`**: montato `<PageVisitTracker />` per tutti gli utenti
  del sito (non nel ramo `/app` PWA, coerente con lo scope "solo sito" già
  usato per la sticky bar).
- **`app/amministrazione/impostazioni/page.tsx`**: recupera
  `getVisitStats()`/`getShortcutStats()` e li passa a `SettingsForm`.
- **`app/amministrazione/impostazioni/settings-form.tsx`**: `PagesPanel`
  riceve le due mappe di statistiche; ogni `CheckRow` mostra la riga
  `sloggati/clienti · attive/cancellate · minuti totali` sotto il label;
  ogni intestazione di gruppo categoria (`PAGE_GROUPS` esteso con
  `hubHref`) mostra la stessa riga per l'href dell'hub (es. `/serramenti`),
  in sola lettura, senza nuovo checkbox — come deciso.
- **Bug corretto durante lo sviluppo**: `useRef(Date.now())` nel tracker
  violava la regola React "no impure call durante il render" (rilevato dal
  linter, categoria `no-unused-expressions`/regole React Compiler); corretto
  inizializzando il ref a `0` e valorizzandolo dentro `useEffect`.
- **Verifica**: `npx tsc --noEmit` pulito; `npm run lint` senza nuovi errori
  (confermato confrontando i warning pre-esistenti di `settings-form.tsx`
  con lo stesso pattern `react-hooks/set-state-in-effect` già presente
  altrove nel file prima di questa modifica). Test end-to-end con `curl`
  contro il dev server già in esecuzione: `POST /api/track-visit` con
  `event:'visit'` + `event:'dwell'` da sloggato → riga creata in
  `page_visits` con `visits=1, total_dwell_min=3.50`; stessa chiamata con
  cookie `session_role=dipendente` e `admin` → nessuna riga scritta (204
  senza side effect); con `session_role=cliente` → riga separata sul bucket
  `cliente`. Verificato anche il rendering reale di
  `/amministrazione/impostazioni` (200, nessun errore, 114 righe di
  statistiche renderizzate: sotto-pagine + 9 hub categoria, numeri reali da
  `home_shortcuts` esistente). Righe di test cancellate da `page_visits`
  dopo la verifica per non sporcare i dati reali.

## Correzione post-rilascio (2026-07-18, sera)

Bug segnalato dall'utente durante il primo test reale: il conteggio
scorciatoie attive/cancellate includeva anche le scorciatoie create da
account **admin/dipendente** (es. account di test) — dato non significativo
per la SEO, stessa logica di esclusione già applicata alle visite ma
dimenticata qui perché `home_shortcuts` ha solo `username`, non il ruolo.

**Fix**: `getShortcutStats()` in `lib/page-visits-db.ts` ora fa `JOIN` con
`users` e filtra `WHERE u.role = 'cliente'`, escludendo dipendente/admin
dal conteggio scorciatoie, coerente con la stessa regola già in vigore per
le visite.

Verificato sui dati reali: 75 scorciatoie totali in tabella, di cui 61 di un
account admin (probabilmente di test) e solo 14 di clienti veri — col fix il
pannello ora conta solo le 14.

## Correzione post-rilascio #2 — varianti dinamiche non confluite

Secondo problema, stesso test reale: delle 14 scorciatoie cliente, solo 5
"unità" comparivano nel pannello (5 righe visibili) perché `getShortcutStats`
raggruppava per href **esatto** — varianti come
`/area-clienti/cantieri?cantiere=2` o `/area-clienti/ordini/4` restavano
isolate, senza combaciare con la pagina madre `/area-clienti/cantieri` /
`/area-clienti/ordini`.

**Fix**: riuso la stessa funzione `matchesPage` già presente in
`lib/nav-config.ts` (usata per la matrice permessi — riconosce "stesso
percorso, sotto-percorso `/pagina/dettaglio`, o query string
`/pagina?param=x`" come la stessa pagina) — **esportata** per poterla
importare. In `getShortcutStats`, ogni href di scorciatoia viene ricondotto
alla pagina nota più specifica che lo contiene (`resolveCanonicalHref`,
lista `KNOWN_PAGE_HREFS` ordinata dalla più lunga alla più corta) prima di
aggregare attive/cancellate. Le pagine `carrello-*` (non presenti come voci
di menu in nessun `PAGE_GROUPS`) restano fuori, per scelta esplicita
dell'utente — sono comunque fuori scope della SEO, essendo pagine
interne dietro login.

Verificato sui dati reali: Cantieri passa da `1 attiva/1 cancellata` a
`1/2` (assorbe la query string), Ordini e Preventivi passano da `0/1` a
`0/2` ciascuna (assorbono il sotto-percorso `/dettaglio`). Somma totale
invariata: 10 unità ora visibili su pagine note + 4 orfane su `carrello-*`
= 14.

## Nota scope SEO

Confermato con l'utente: le pagine sotto `/area-clienti/*` (Area Personale)
sono dietro login e non indicizzate da Google — i loro numeri restano utili
come metrica di utilizzo interno, ma non sono "dato SEO" in senso stretto.
Il dato SEO vero riguarda solo le pagine vetrina pubbliche (categorie, hub,
Brand, Prodotti, Aiuto). Nessuna modifica di scope richiesta per ora — il
pannello continua a mostrare tutte le pagine indistintamente.

## Non tocco

- Nessuna modifica a `home_shortcuts` (solo lettura via nuova query di
  aggregazione).
- Nessun checkbox nuovo per attivare/disattivare le super-categorie hub
  (solo statistiche in sola lettura).
- Nessuna sessione lato server per gli utenti sloggati (dedup solo via
  `sessionStorage` client-side).
- Nessuna modifica al comportamento di `InactivityGuard` esistente (resta
  invariato, solo per utenti loggati e per il logout automatico).
