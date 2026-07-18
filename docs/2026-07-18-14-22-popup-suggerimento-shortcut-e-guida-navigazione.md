# Popup "suggerimento scorciatoia" dopo 2 minuti + Guida alla Navigazione

Stato: completato

## Contesto

Il doppio click per aggiungere una pagina come scorciatoia nella home
(`components/right-click-shortcut-hint.tsx`) è una funzionalità "nascosta":
i nuovi utenti non hanno modo di scoprirla da soli. Serve un modo per
insegnarla, senza essere invadenti (una volta sola, disattivabile per
sempre).

## Obiettivo

1. Se un utente **loggato** resta su una pagina (diversa dalla home) per
   almeno 2 minuti continuativi, mostrare un popup che:
   - Spiega cosa può fare: *"Sei interessato a {Nome Pagina}. Vuoi
     aggiungere una scorciatoia nella Homepage?"*
   - Ha un bottone verde con countdown **15 secondi** (più lungo dei 5
     del doppio click, per lasciare il tempo di leggere) —
     *"Aggiungi {Nome Pagina} alla Home 15sec"* — che aggiunge subito la
     scorciatoia (stessa azione di `add()` del Context) e chiude il popup.
   - Sotto il bottone, il testo che insegna il gesto:
     *"Puoi aggiungere scorciatoie di ogni pagina preferita facendo doppio
     click."*
   - Un'opzione **"Non mostrare mai più"** che disattiva il popup per
     sempre (anche ai prossimi login).
   - Si chiude anche cliccando fuori dal riquadro (senza disattivarlo per
     sempre — solo per questa volta).
2. Il popup compare **al massimo una volta per sessione di navigazione**
   (finché il browser/tab resta aperto), indipendentemente da come viene
   chiuso.
3. Se l'utente sceglie "Non mostrare mai più", il popup non compare più in
   nessuna sessione futura (anche dopo login/logout diversi).
4. Il popup **non** compare per chi naviga sloggato: chi non è loggato può
   comunque scoprire il doppio click da solo o dalla Guida (punto 5) — gli
   basta per la sessione di navigazione corrente, anche sapendo che
   pulendo i dati del browser le scorciatoie andranno perse (torna comodo
   comunque, nell'ambito di una singola visita).
5. Nuova pagina **Guida alla Navigazione** sotto "Aiuto"
   (`/aiuto/guida-navigazione`), che spiega la funzione delle scorciatoie
   (doppio click, il popup di suggerimento per i loggati, come rimuoverle
   dalla home) — menziona esplicitamente che funziona anche da sloggati,
   come comodità solo per la sessione di navigazione corrente (si perdono
   pulendo i dati del browser, ma per un utente che sta ancora decidendo
   se registrarsi è comunque utile nel frattempo).

## Scelta tecnica

### Persistenza dei due flag

- **"Già mostrato in questa sessione"** → `sessionStorage` (si cancella da
  solo alla chiusura del browser/tab): `shortcut_hint_shown_session = '1'`.
- **"Non mostrare mai più"** → `localStorage` (persiste per sempre, stesso
  meccanismo già usato per le scorciatoie stesse):
  `shortcut_hint_dismissed_forever = '1'`.

Nessuna delle due tocca il DB: è un flag di UI per-browser, non legato
all'account (coerente con `lib/home-shortcuts.ts`, che già usa
`localStorage` per lo stesso genere di stato).

### Nuovo componente `components/shortcut-hint-popup.tsx`

- Monta un timer di 2 minuti (`setTimeout`) legato al pathname corrente
  (`usePathname()`), azzerato/riavviato ad ogni cambio pagina (se l'utente
  naviga via prima dei 2 minuti, il conteggio ricomincia sulla pagina
  nuova).
- Non parte nemmeno il timer se: l'utente **non è loggato** (nessun
  `username`, passato come prop dal layout server-side, stesso pattern di
  `HomeShortcutsProvider`), `pathname === '/'`, la pagina è già una
  scorciatoia (`useHomeShortcuts().isShortcut(pathname)`), il flag di
  sessione è già impostato, o il flag "mai più" è impostato.
- Allo scadere dei 2 minuti: imposta subito il flag di sessione (comunque
  vada a finire, non ricompare più in questa sessione) e mostra il popup
  con countdown 15s (stesso pattern del countdown già usato in
  `right-click-shortcut-hint.tsx`, valore diverso).
- Il nome della pagina riusa la stessa logica di
  `nameFromPathname()`/`labelFromPathname()` oggi definita localmente in
  `right-click-shortcut-hint.tsx` → la estraggo in un file condiviso
  **`lib/page-label.ts`** e la importo in entrambi i componenti (nessuna
  duplicazione di logica).
- Struttura visiva: overlay di sfondo semi-trasparente (click fuori dal
  riquadro → chiude, non tocca il flag "mai più") + riquadro centrato con
  testo, bottone verde countdown, testo esplicativo, link/bottone piccolo
  "Non mostrare mai più".

### Montaggio

- **`app/layout.tsx`**: `<ShortcutHintPopup loggedIn={!!username} />`
  accanto a `<RightClickShortcutHint />` (stessa posizione, quindi
  automaticamente escluso dalle rotte `/app/*` come tutto quel blocco).

### Nuova pagina Aiuto

- **`lib/nav-config.ts`**: aggiunta a `aiutoPages` →
  `{ id: 104, label: 'Guida alla Navigazione', href: '/aiuto/guida-navigazione' }`.
- **`app/aiuto/guida-navigazione/page.tsx`**: stessa struttura delle altre
  pagine Aiuto esistenti (breadcrumb, `h1`, `testo-articoli`), contenuto:
  spiega il doppio click per aggiungere/rimuovere una scorciatoia, il
  popup di suggerimento dopo 2 minuti, dove appaiono le scorciatoie
  (barra in fondo alla Home) e come si rimuovono (✕).

## Non tocco

- Nessuna modifica al doppio click esistente o al suo popup countdown
  a 5s (restano due componenti distinti, che condividono solo
  `lib/page-label.ts` per il nome della pagina).
- Nessuna persistenza su DB per i flag del popup (solo browser).

## Riepilogo modifiche effettive

Implementato come da piano, nessuna deviazione:

- `lib/page-label.ts` (nuovo): `nameFromPathname`/`labelFromPathname`
  condivisi tra `right-click-shortcut-hint.tsx` e il nuovo popup.
- `components/shortcut-hint-popup.tsx` (nuovo): timer 2 minuti per pagina,
  countdown 15s, testo con punto interrogativo ("Sei interessato a X?",
  corretto durante il test), "Non mostrare mai più", overlay con click
  esterno per chiudere.
- `app/layout.tsx`: montato `<ShortcutHintPopup loggedIn={!!username} />`.
- `lib/nav-config.ts`: nuova voce `aiutoPages` id 104.
- `app/aiuto/guida-navigazione/page.tsx` (nuovo): guida completa, incluso
  il paragrafo per chi naviga sloggato.
