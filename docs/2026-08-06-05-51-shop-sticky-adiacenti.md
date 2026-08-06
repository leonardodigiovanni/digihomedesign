# Shop — bottoni "adiacenti" (gold) dinamici nello sticky, al posto dei link fissi

Stato: **completato**

## Riepilogo implementazione

- `lib/nav-config.ts`: aggiunta `getStandaloneNeighbors(currentId, disabledPages)` (wrapper di `getSectionNeighbors(standalonePages, ...)`).
- `app/shop/page.tsx` (id 41): `prev` sempre `null` (primo della lista) → resta solo `← Home` (nero, invariato) + nuovo `{next.label} →` **gold**, dinamico. Rimosso il vecchio link nero fisso `Promozioni →` (duplicato dal nuovo gold).
- `app/promozioni/page.tsx` (id 42): aggiunto `← {prev.label}` e `{next.label} →` gold dinamici. Rimosso il vecchio link nero fisso `Shop On Line →` (duplicato dal nuovo gold `← Shop On Line`). `← Home` lasciato invariato (non duplicato, Home non è in `standalonePages`).
- `app/brand/cataloghi/page.tsx` (id 38, pubblica su `/cataloghi`): `next` sempre `null` (ultimo della lista) → aggiunto solo `← {prev.label}` gold. Nessun nero da rimuovere qui (non c'era un link fisso a Promozioni). `← Home` e `Vai alla guida →` (solo utenti non loggati) lasciati invariati, non duplicati.
- Type-check pulito su tutti e tre i file.

Bottoni neri non duplicati (`← Home` ovunque, `Vai alla guida →` in Cataloghi) lasciati come da indicazione dell'utente — bonifica rimandata a lui.

## Correzione (2026-08-06): mancava il gold sui due bordi reali della navbar

L'utente ha fatto notare che l'adiacenza corretta non è solo tra Shop/Promozioni/Cataloghi tra loro, ma con la navbar intera: prima di Shop (primo standalone) c'è il dropdown **"Ristrutturazioni Chiavi in Mano"**, dopo Cataloghi (ultimo standalone) c'è il dropdown **"Serramenti"** (primo categoryGroup). `getStandaloneNeighbors` da solo non può saperlo (guarda solo dentro `standalonePages`), quindi mancavano i due bottoni gold di bordo, esattamente come nel pattern già usato ovunque nel sito (fallback a `NavDropdownTriggerButton` quando `prev`/`next` è `null` per essere il primo/ultimo della propria lista).

- `app/shop/page.tsx`: `{prev && ...}` → `{prev ? ... : <NavDropdownTriggerButton dropdownId="ristrutturazioni" label="← Ristrutturazioni Chiavi in Mano" />}`
- `app/brand/cataloghi/page.tsx`: aggiunto `next` (mancava, prendevo solo `prev`) e `{next ? ... : <NavDropdownTriggerButton dropdownId="cat-serramenti" label="Serramenti →" />}`
- Type-check pulito.

L'utente ha segnalato anche che potrebbero esserci **altri casi dimenticati** altrove nel sito (bordi di sezione senza fallback gold). Non ancora auditati: da fare a parte se richiesto esplicitamente (rischio di toccare molti file).

## Correzione (2026-08-06): primo caso trovato — Servizi → Aiuto

`app/servizi/contratti-di-pulizia/page.tsx` (ultima pagina dell'ultimo categoryGroup, "Servizi") aveva `{next && <Link btn-blue/>}` senza alcun fallback gold: a fine sezione il bottone destro spariva del tutto. L'utente ha confermato che deve puntare a **Aiuto**.

Problema: `AiutoDropdown` (in `components/navbar.tsx`) non era collegato al sistema `useNavDropdownRequest` che permette a un bottone gold nello sticky di riaprire da remoto una tendina della navbar (lo fanno già `ProdottiDropdown`, `ComfortDropdown`, `AntintrusioneDropdown`, `CarpenteriaDropdown`, `RistrutturazioniDropdown`, `CategoryDropdown`). Riallineato a quel pattern:
- `AiutoDropdown`: aggiunti `viaSticky`/`isMounted`/`dropRef`, `useDropdownAlign(open, ref, viaSticky ? 'aiuto' : null)` (già supportava `stickyTriggerId`, andava solo passato), `useNavDropdownRequest` con `request.id === 'aiuto'`, pannello spostato da `<div ref={alignRef}>` assoluto dentro il wrapper a `createPortal(..., document.body)` con `position:fixed` — stessa tecnica delle altre tendine (serve per posizionarsi sopra lo sticky bottom bar invece che sotto il trigger in navbar, e per sfuggire a `overflow-x` clip).
- `app/servizi/contratti-di-pulizia/page.tsx`: `{next && ...}` → `{next ? ... : <NavDropdownTriggerButton dropdownId="aiuto" label="Aiuto →" />}`.
- Type-check pulito.

## Correzione (2026-08-06): tutte le pagine sotto Aiuto e Chi Siamo non avevano blu/gold

L'utente ha confermato che il problema è sistemico: **nessuna** delle 4 pagine `/aiuto/*` e delle 6 pagine `/chi-siamo/*` (ex "Brand") aveva mai avuto i bottoni blu (vicino stessa sezione) o gold (bordo sezione) nello sticky — solo link neri bespoke per pagina, mai collegati a `getSectionNeighbors`.

**`lib/nav-config.ts`**: aggiunte `getAiutoNeighbors()` e `getClientPagesNeighbors()` (wrapper di `getSectionNeighbors` su `aiutoPages` e `clientPages`), sul modello delle altre sezioni.

**Catena gold attraversata**: `...Servizi (cat-servizi) ↔ Aiuto (aiuto) ↔ Chi Siamo (chi-siamo)` — fine catena pubblica, nessun gold dopo Chi Siamo (come non c'è nessun gold prima di Home).

- `app/aiuto/guida-preventivo/page.tsx` (101, primo): gold `← Servizi` (dropdownId `cat-servizi`) + blu `Guida CantiereOnLine →`.
- `app/aiuto/guida-cantiere/page.tsx` (102): blu `← Guida PreventivoOnLine` + blu `Guida DigiApp →`.
- `app/aiuto/app/page.tsx` (103): blu `← Guida CantiereOnLine` + blu `Guida alla Navigazione →`. Diventata `async` (prima era `function` sync, serviva per `readSettings()`).
- `app/aiuto/guida-navigazione/page.tsx` (104, ultimo): blu `← Guida DigiApp` + gold `Chi Siamo →` (dropdownId `chi-siamo`, sempre incondizionato, essendo l'ultimo elemento fisso). Diventata `async`.
- `app/brand/storia/page.tsx` (36, primo di clientPages): gold `← Aiuto` (dropdownId `aiuto`, incondizionato) + blu `Galleria →`. Diventata `async`.
- `app/brand/galleria/page.tsx` (6): blu `← Storia` + blu `Contatti →`. Diventata `async`.
- `app/brand/contatti/page.tsx` (15): blu `← Galleria` + blu `Partners →` (era già `async`).
- `app/brand/partners/page.tsx` (37): blu `← Contatti` + blu `Condizioni di Vendita →`. Diventata `async`.
- `app/brand/condizioni-di-vendita/page.tsx` (39): blu `← Partners` + blu `Documenti Legali →`. Diventata `async`.
- `app/brand/templates-documenti/page.tsx` (40, ultimo): solo blu `← Condizioni di Vendita` (nessun gold dopo, fine catena). Diventata `async`.

**Problema di fondo scoperto**: il gold `← Aiuto`/`Chi Siamo →` richiedeva che i dropdown corrispondenti in `components/navbar.tsx` sapessero riaprirsi da remoto (bottone nello sticky → tendina in navbar), sistema già esistente (`useNavDropdownRequest` + `useDropdownAlign` con `stickyTriggerId`) ma usato finora solo da Prodotti/Comfort/Antintrusione/Carpenteria/Ristrutturazioni/le categoryGroups. **Aiuto e Chi Siamo non erano mai stati collegati**:
- `AiutoDropdown`: aggiunto `viaSticky`/`isMounted`/`dropRef` dedicato, `useDropdownAlign(open, ref, viaSticky ? 'aiuto' : null)`, `useNavDropdownRequest`, pannello spostato da assoluto-inline a `createPortal(..., document.body)` con `position:fixed` (stessa tecnica delle altre 6 tendine).
- Blocco "Chi Siamo" (inline nel componente `Navbar` principale, non un sotto-componente separato): stessa cura — nuovo `chiSiamoViaSticky`/`chiSiamoMounted`/`chiSiamoPanelRef` (separato dal `dropRef` già esistente che avvolge solo il trigger, per non rompere il click-outside quando il pannello va in portal), `useDropdownAlign(sectionOpen, dropRef, chiSiamoViaSticky ? 'chi-siamo' : null)`, `useNavDropdownRequest` con id `'chi-siamo'`, pannello in portal.

Type-check pulito su tutti i file. Lint: nessun nuovo errore introdotto — i 2 nuovi `useEffect(() => setIsMounted(true), [])` replicano lo stesso pattern (con lo stesso warning `react-hooks/set-state-in-effect`) già presente nelle altre 5 tendine esistenti, verificato che l'errore preesisteva già 17 volte nel file prima di questa modifica.

## Contesto (come funziona già nel resto del sito)

Nelle pagine vetrina "a categoria" (es. `app/serramenti/box-doccia/page.tsx`) lo sticky bottom bar mostra:
- un bottone **nero** `← {categoria madre}` (risale di un livello)
- bottoni **blu** (`btn-blue`) precedente/successivo **dentro la stessa sezione**, calcolati dinamicamente da `getSectionNeighbors()` / `getCategoryGroupNeighbors()` in `lib/nav-config.ts` (rispettano `disabledPages` dal pannello admin)
- quando non c'è un vicino blu (sei al primo/ultimo elemento della sezione), il bottone diventa **gold** (`btn-gold`, vedi `NavDropdownTriggerButton`) e punta invece alla sezione di nav adiacente (altro gruppo/dropdown della navbar)

`Shop On Line` (id 41) è invece una voce **standalone** in `lib/nav-config.ts` (`standalonePages`, insieme a Promozioni id 42 e Cataloghi id 38): non ha una propria sezione con sottopagine, quindi non può avere bottoni blu. Oggi il suo sticky (`app/shop/page.tsx`) mostra due link **fissi, hardcoded**, colore nero:
```tsx
<Link href="/" className="btn-black fs-12">← Home</Link>
<Link href="/promozioni" className="btn-black fs-12">Promozioni →</Link>
```
(stesso pattern hardcoded, invertito, in `app/promozioni/page.tsx`: `← Home` / `Shop On Line →`).

## Cosa cambia

Per Shop, essendo una voce senza sottocategorie proprie, il concetto giusto è quello **gold** (adiacenti di navbar), reso però **dinamico** invece che fisso: se domani Promozioni o Cataloghi vengono disattivati dal pannello admin ("Pagine visibili"), il bottone deve saltarli automaticamente invece di puntare a un link morto.

### 1. `lib/nav-config.ts`
Aggiungere, sul modello di `getComfortNeighbors` / `getAntintrusioneNeighbors`:
```ts
export function getStandaloneNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(standalonePages, currentId, disabledPages)
}
```
Ordine attuale di `standalonePages`: **Shop (41) → Promozioni (42) → Cataloghi (38)**.
- Per Shop: `prev = null`, `next = Promozioni` (se non disabilitata, altrimenti Cataloghi).
- Per Promozioni: `prev = Shop`, `next = Cataloghi`.
- Per Cataloghi: `prev = Promozioni`, `next = null`.

### 2. `app/shop/page.tsx`
```tsx
const { disabledPages } = await readSettings()
const { prev, next } = getStandaloneNeighbors(41, disabledPages)
...
<StickyBottomBarContent>
  <Link href="/" className="btn-black fs-12">← Home</Link>
  {prev && <Link href={prev.href} className="btn-gold fs-12">← {prev.label}</Link>}
  {next && <Link href={next.href} className="btn-gold fs-12">{next.label} →</Link>}
</StickyBottomBarContent>
```
Per Shop `prev` è sempre `null` (è il primo della lista), quindi in pratica resta solo `← Home` (nero, invariato) + `Promozioni →` ma ora **gold** invece di nero, e calcolato dinamicamente.

## Domande aperte

1. **Solo `/shop`, o anche `/promozioni` e `/cataloghi`?** Per coerenza visiva propongo di applicare lo stesso cambio (link dinamico + colore gold) a tutte e tre, visto che oggi hanno tutte lo stesso pattern hardcoded nero. Se preferisci solo `/shop` per ora, lo limito a quella.
2. **`← Home` resta nero e fisso?** Home non fa parte di `standalonePages` quindi non rientra nel calcolo dinamico; lo lascerei come bottone fisso separato (è sempre raggiungibile), a meno che tu non voglia toglierlo del tutto ora che c'è il logo in header.

## File coinvolti
- `lib/nav-config.ts` — nuova funzione `getStandaloneNeighbors`
- `app/shop/page.tsx` (+ eventualmente `app/promozioni/page.tsx`, `app/brand/cataloghi/page.tsx` se si estende)
