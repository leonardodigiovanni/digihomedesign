# Menu "Riqualificazione Energetica" al posto di "Prodotti"

**Data:** 2026-07-21
**Stato:** completato

---

## Obiettivo

Sostituire il dropdown "Prodotti" della navbar con "Riqualificazione Energetica", una voce di menu a 3 livelli:

```
Riqualificazione Energetica
├── Infissi Isolanti Termoacustici
│   ├── Alluminio
│   ├── PVC
│   ├── Legno
│   └── Misti
└── Sistemi Oscuranti
    ├── Persiane in Alluminio
    ├── Persiane in PVC
    ├── Imbotti
    ├── Cassonetti in PVC
    ├── Tapparelle in Alluminio
    └── Tapparelle in PVC
```

Il dropdown va posizionato subito dopo "Home" (prima voce cliccabile della nav) e **sostituisce integralmente** il dropdown "Prodotti" attuale. Le voci oggi in Prodotti (Infissi, Verande, Persiane, Porte Blindate, Strutture Metalliche, Ristrutturazioni Chiavi in Mano) escono dalla nav — le pagine restano online ma non più raggiungibili dal menu.

## Perché serve una struttura dati nuova

Le strutture attuali in `lib/nav-config.ts` supportano solo 2 livelli:
- `NavPage` (flat: id/label/href) — usata da `prodottiPages`
- `CategoryGroup` (gruppo + sottopagine flat) — usata da `categoryGroups` (Serramenti, Metallurgia, ecc.)

Nessuna delle due gestisce 3 livelli (categoria → sottocategoria → pagina foglia). Serve un nuovo tipo, ad esempio:

```typescript
export type NestedCategoryGroup = {
  id: string
  label: string
  href: string
  subgroups: {
    id: string
    label: string
    href: string
    pages: { id: number; label: string; href: string }[]
  }[]
}
```

## File coinvolti

- `lib/nav-config.ts` — nuovo tipo `NestedCategoryGroup`, nuova costante con i dati di Riqualificazione Energetica, rimozione dell'uso di `prodottiPages` in navbar.
- `components/navbar.tsx` — nuovo componente dropdown a 2 livelli (sostituisce `ProdottiDropdown`), spostato subito dopo Home; versione mobile nel menu hamburger con sotto-sezioni annidate.
- Nuove pagine vetrina da creare (12 foglia + eventuali indici):
  - `/riqualificazione-energetica` (indice, opzionale)
  - `/riqualificazione-energetica/infissi-isolanti-termoacustici` (indice sottocategoria, opzionale)
  - `/riqualificazione-energetica/infissi-isolanti-termoacustici/alluminio`
  - `/riqualificazione-energetica/infissi-isolanti-termoacustici/pvc`
  - `/riqualificazione-energetica/infissi-isolanti-termoacustici/legno`
  - `/riqualificazione-energetica/infissi-isolanti-termoacustici/misti`
  - `/riqualificazione-energetica/sistemi-oscuranti` (indice sottocategoria, opzionale)
  - `/riqualificazione-energetica/sistemi-oscuranti/persiane-in-alluminio`
  - `/riqualificazione-energetica/sistemi-oscuranti/persiane-in-pvc`
  - `/riqualificazione-energetica/sistemi-oscuranti/imbotti`
  - `/riqualificazione-energetica/sistemi-oscuranti/cassonetti-in-pvc`
  - `/riqualificazione-energetica/sistemi-oscuranti/tapparelle-in-alluminio`
  - `/riqualificazione-energetica/sistemi-oscuranti/tapparelle-in-pvc`

## Passi principali

1. Aggiungere tipo e dati in `lib/nav-config.ts`.
2. Creare il componente dropdown a 2 livelli in `navbar.tsx` (desktop: flyout con le due sottocategorie come intestazioni di sezione e le rispettive foglie sotto; mobile: sezione con due sotto-elenchi collassabili).
3. Sostituire `ProdottiDropdown` con il nuovo componente, spostandolo subito dopo Home (rimane il trigger a due righe "Riqualificazione" / "Energetica" già implementato).
4. Creare le pagine vetrina mancanti per evitare 404 (stub minimi, stessa struttura delle pagine categoria esistenti).
5. Verificare se `prodottiPages` va rimosso del tutto o lasciato (referenziato in `PUBLIC_PAGES_WITH_ID` per il pannello admin "Pagine visibili").

## Domande aperte — risposte ricevute

1. Contenuto reale, non stub — con lo stesso stile prototipale delle pagine che oggi sono sotto Prodotti (es. `app/infissi/page.tsx`: singolo blocco fototesto + 3 paragrafi + CTA, senza integrazione catalogo).
2. "Infissi Isolanti Termoacustici" e "Sistemi Oscuranti" sono solo intestazioni di raggruppamento non cliccabili (nessuna pagina indice propria), come dedotto dal punto 1.
3. Slug confermati implicitamente (nessuna obiezione).

## Riepilogo modifiche effettive

- **`lib/nav-config.ts`**: il contenuto di `prodottiPages` (stesso export, per non toccare gli altri 4 file che lo importano) è stato sostituito con le 10 pagine foglia (id 290-299, i vecchi id 280-285 sono liberati). Aggiunto `prodottiSubgroups` (label + lista id) per il raggruppamento visivo nel dropdown/mobile. Nessun nuovo tipo `NestedCategoryGroup` introdotto: si è preferita questa soluzione più snella, che riusa `NavPage` flat + una piccola tabella di raggruppamento, evitando di duplicare la wiring già esistente in footer/admin/page-visits.
- **`components/navbar.tsx`**: `ProdottiDropdown` (trigger "Riqualificazione"/"Energetica", già a due righe) spostato subito dopo Home (prima voce cliccabile, prima di Shop/Cataloghi) sia in desktop che in mobile; il dropdown ora raggruppa le voci per sottocategoria con intestazioni non cliccabili (desktop: colonne affiancate; mobile: sotto-etichette indentate dentro la stessa `MobileSection`).
- **`components/sitemap-section.tsx`**: colonna footer rinominata da "Prodotti" a "Riqualificazione Energetica" (stessa lista filtrata per `disabledPages`, ora con 10 voci anziché 6 — va automaticamente su 2 colonne da 8+2 per `MAX_PER_COL`).
- **`app/amministrazione/impostazioni/settings-form.tsx`**: riga del pannello "Pagine visibili" rinominata da "Prodotti" a "Riqualificazione Energetica" (stesso `pages: prodottiPages`, ora con i 10 nuovi id/checkbox).
- **`lib/page-visits-db.ts`** e **`app/amministrazione/impostazioni/actions.ts`**: nessuna modifica necessaria, referenziano `prodottiPages` genericamente e recepiscono automaticamente i nuovi href/id.
- **10 nuove pagine vetrina reali** (stile `app/infissi/page.tsx`, non quello con catalogo DB):
  - `app/riqualificazione-energetica/infissi-isolanti-termoacustici/{alluminio,pvc,legno,misti}/page.tsx`
  - `app/riqualificazione-energetica/sistemi-oscuranti/{persiane-in-alluminio,persiane-in-pvc,imbotti,cassonetti-in-pvc,tapparelle-in-alluminio,tapparelle-in-pvc}/page.tsx`
  - Ognuna con metadata SEO completi (title/description/canonical/openGraph/robots), breadcrumb a 4 livelli (Home / Riqualificazione Energetica / sottocategoria / voce — solo Home è link, gli altri sono testo perché non esistono pagine indice), 2 foto placeholder, 3 paragrafi di testo reale specifico per prodotto, CTA preventivo/cantiere/contatti.
- Le vecchie pagine (`app/infissi`, `app/verande`, `app/persiane`, `app/porte-blindate`, `app/strutture-metalliche`, `app/ristrutturazioni-chiavi-in-mano`) **non sono state toccate**: restano online e raggiungibili via URL diretto ma non più in nav/footer/admin (stesso principio già applicato alle pagine categoria nascoste).
- `tsc --noEmit` ed `eslint` puliti (nessun nuovo errore/warning sui file toccati).
