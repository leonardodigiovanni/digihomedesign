# Scorciatoie home: persistenza su DB per utenti loggati

Stato: completato

## Contesto

Le "scorciatoie" (feature descritta in `docs/` precedenti, sistema sticky
bottom bar) sono oggi salvate **solo** in `localStorage` del browser
(`lib/home-shortcuts.ts`, chiave `home_shortcuts`), sia per utenti anonimi
che per utenti loggati. Se un utente loggato pulisce i dati del browser (o
cambia dispositivo), perde tutte le scorciatoie salvate.

## Obiettivo

Per gli utenti **loggati**, le scorciatoie vivono **sia** su `localStorage`
**sia** sul DB MySQL (scrittura doppia, DB come fonte durevole/di verità,
`localStorage` come cache locale veloce):

- Aggiungi/rimuovi scorciatoia → scrive su entrambi, `localStorage` e DB
  (tabella nuova, legata allo `username`).
- Al login, l'utente ritrova le sue scorciatoie salvate in precedenza (dal
  DB), anche su un dispositivo/browser diverso da quello con cui le aveva
  salvate.
- Per gli utenti **non loggati**, nessun cambiamento: continuano a usare solo
  `localStorage` come oggi (se puliscono la cronologia, le perdono — comportamento
  voluto, "premia" chi si registra).

### Migrazione al login (una tantum, filtrata per permessi)

Se un utente salva una scorciatoia da sloggato e **nel frattempo si logga**
(stesso dispositivo, stessa sessione browser), quella scorciatoia non deve
andare persa: al momento in cui il Context rileva `loggedIn === true`, fa una
sincronizzazione:

1. Legge le scorciatoie attualmente in `localStorage`.
2. Le **filtra** con `isHrefAccessible(href, role, rolePermissions, disabledPages)`
   usando il ruolo/permessi dell'utente appena loggato.
3. Solo quelle **accessibili per questo utente** vengono inserite nel DB
   (`INSERT IGNORE`, idempotente).
4. Le scorciatoie del DB non ancora presenti in `localStorage` vengono
   aggiunte anche lì (così un login su un dispositivo nuovo popola subito la
   cache locale).

Il filtro al punto 2 è necessario perché `localStorage` è per-browser, non
per-utente: su un computer condiviso, un utente precedente (anonimo o con un
altro account) potrebbe aver salvato pagine valide per lui ma non per il
ruolo dell'utente che si sta loggando ora — quelle **non** vanno inserite nel
suo DB. Restano semplicemente ignorate (non cancellate da `localStorage`, ma
mai proposte al DB); dato che la visualizzazione già filtra per accessibilità
in `home-shortcuts-content.tsx`, restano comunque invisibili finché non
accessibili.

**Fuori scope per questa fase** (rimandato a un documento successivo): la
vista admin per consultare le scorciatoie salvate per utente a fini di
marketing/targeting.

## Scelta tecnica

### Nuova tabella

```sql
CREATE TABLE IF NOT EXISTS home_shortcuts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(191) NOT NULL,
  href       VARCHAR(255) NOT NULL,
  label      VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_username_href (username, href)
)
```

Creata on-demand con `CREATE TABLE IF NOT EXISTS` (stesso pattern già usato
in tutto il progetto, es. `app/area-clienti/avvisi/actions.ts`), nessuna
migrazione manuale richiesta.

### Nuovo file `lib/home-shortcuts-db.ts` (`'use server'`)

Tre funzioni, ciascuna legge `username` dal cookie `session_user` (nessun
parametro sensibile passato dal client):

- `getMyShortcuts(): Promise<Shortcut[]>` — se non loggato ritorna `[]`.
- `addMyShortcut(href, label): Promise<void>` — `INSERT IGNORE` (idempotente).
- `removeMyShortcut(href): Promise<void>` — `DELETE ... WHERE username = ? AND href = ?`.

### Nuovo Context `lib/home-shortcuts-context.tsx` (client)

Punto unico da cui tutti i componenti leggono/scrivono le scorciatoie,
al posto delle chiamate dirette a `lib/home-shortcuts.ts`:

- `HomeShortcutsProvider({ loggedIn, role, rolePermissions, disabledPages, children })`
  — props passate dal layout server-side (già disponibili in
  `app/layout.tsx`: `username`/`role`, `rolePermissions`, `settings.disabledPages`).
  - Se `loggedIn === false`: usa solo le funzioni esistenti di
    `lib/home-shortcuts.ts` (`getShortcuts`/`addShortcut`/`removeShortcut`,
    `localStorage` + `SHORTCUTS_EVENT`) — comportamento invariato.
  - Se `loggedIn === true`:
    - Al mount: chiama `getMyShortcuts()` (server action), esegue la
      migrazione filtrata descritta sopra (localStorage → DB, e DB →
      localStorage per l'unione), poi popola lo stato React con l'unione.
    - `add(href,label)`: scrive subito in `localStorage`
      (`addShortcut` di `lib/home-shortcuts.ts`) **e** chiama
      `addMyShortcut(href,label)` (DB), aggiornando lo stato React.
    - `remove(href)`: stesso doppio scrivi, con `removeShortcut` +
      `removeMyShortcut(href)`.
- Espone un hook `useHomeShortcuts()` → `{ shortcuts, isShortcut(href), add(href,label), remove(href) }`.

### File da aggiornare per usare il nuovo Context

- **`app/layout.tsx`**: monta
  `<HomeShortcutsProvider loggedIn={!!username} role={role} rolePermissions={rolePermissions} disabledPages={settings.disabledPages}>`
  attorno all'albero (vicino a `StickyBottomBarProvider`, che già avvolge
  tutto il sito tranne `/app`).
- **`components/right-click-shortcut-hint.tsx`**: sostituisce le import da
  `lib/home-shortcuts` con `useHomeShortcuts()` per `isShortcut`/`addShortcut`/`removeShortcut`.
- **`components/home-shortcuts-content.tsx`**: sostituisce la lettura diretta
  di `getShortcuts()` + i listener `SHORTCUTS_EVENT`/`focus`/`pageshow` con
  `useHomeShortcuts()` (il Context, essendo montato una sola volta nel
  layout, resta sincronizzato da solo — non serve più il refresh difensivo
  su `focus`/`pageshow`).
- **`components/add-shortcut-button.tsx`** (oggi non referenziato da nessuna
  pagina dopo la rimozione da `/brand/storia`): aggiornato per coerenza, nel
  caso torni utile in futuro.
- **`lib/home-shortcuts.ts`**: resta invariato nel contenuto, ma ora usato dal
  Context in entrambi i rami — da solo per l'utente anonimo, insieme alle
  server action per l'utente loggato (scrittura doppia).

## Non tocco

- Nessuna vista admin per marketing in questa fase (documento a parte).
- Nessuna modifica alla UI dei bottoni (verde/rosso, countdown, badge ✕) —
  cambia solo *dove* i dati vivono, non come appaiono.

## Riepilogo modifiche effettive

- `lib/home-shortcuts-db.ts` (nuovo): `getMyShortcuts`/`addMyShortcut`/`removeMyShortcut`,
  tabella `home_shortcuts` creata on-demand.
- `lib/home-shortcuts-context.tsx` (nuovo): `HomeShortcutsProvider`/`useHomeShortcuts()`
  come da piano, con una correzione emersa durante il test manuale: la
  migrazione **non** scrive più le voci del DB nel `localStorage` condiviso
  (rimosso il passaggio "DB → localStorage" previsto nel piano originale) —
  su un computer condiviso, quella scrittura faceva "resuscitare" scorciatoie
  già cancellate da un altro account al login successivo. Ora la migrazione
  va solo `localStorage → DB`, filtrata per accessibilità.
- `app/layout.tsx`: montato `HomeShortcutsProvider` con
  `key={username ?? 'anon'}` — necessario perché altrimenti il componente non
  si rimonta tra un login e l'altro (stessa istanza React), e il ref
  "migrazione già fatta" restava `true` per sempre dal primo login, bloccando
  la migrazione per ogni account successivo sullo stesso browser.
- `components/right-click-shortcut-hint.tsx`, `home-shortcuts-content.tsx`,
  `add-shortcut-button.tsx`: aggiornati per usare `useHomeShortcuts()`.
- **Soft-delete** (richiesta successiva all'approvazione, non nel piano
  originale): `home_shortcuts` ha una colonna `cancellato` — `removeMyShortcut`
  fa `UPDATE ... SET cancellato = 1` invece di `DELETE`; `getMyShortcuts`
  legge solo `cancellato = 0`; `addMyShortcut` usa
  `INSERT ... ON DUPLICATE KEY UPDATE cancellato = 0` per riattivare una riga
  già esistente. Le righe cancellate restano per sempre in tabella (nessuna
  vista admin ancora costruita, ma i dati storici sono già lì per quando
  servirà).
- `isHrefAccessible` (`lib/nav-config.ts`) esteso, su richiesta successiva:
  nasconde la scorciatoia anche per le pagine vetrina pubbliche disabilitate
  dal pannello "Pagine visibili" (prima veniva controllato `disabledPages`
  solo per le pagine protette da login).
