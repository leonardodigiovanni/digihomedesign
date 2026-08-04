# Test anteprime Abbr — pagina amministrazione

Stato: **completato**

## Obiettivo

Creare una pagina di amministrazione (visibile solo a `admin`) dove è possibile:
- inserire manualmente una stringa `Abbr` (la grammatica testuale già usata nei listini, es. `Tc(F())`, `Tc(mAc(F()))`, `Tc(X(F())+P+80(mAc(F())))`)
- inserire larghezza e altezza in cm
- vedere immediatamente, su un "foglio" bianco, l'anteprima grafica risultante

Serve come strumento di lavoro per fare test massivi e velocizzare il miglioramento del rendering delle anteprime (oggi si può vedere una Abbr renderizzata solo aprendo un preventivo/ordine/carrello reale che contenga quell'articolo).

## Componente riusato (nessuna nuova logica di disegno)

Il disegno viene generato interamente da un componente client già esistente e usato in 5 punti del sito (preventivi, carrello preventivo, carrello acquisti, ordini cliente, ordini ricevuti):

`components/preview-infisso.tsx` → `export default function PreviewInfisso(props: PreviewInfissoProps)`

```ts
interface PreviewInfissoProps {
  larghezza_cm:  number
  altezza_cm:    number
  colore:        string
  descrizione:   string
  tipo_prodotto: string
  n_ante:        number
  abbr?:         string
  profilo_mm?:   number
  bar_color?:     string
  bar_color_acc?: string | null
  maxHeight?:     number | string
}
```

Se `abbr` inizia con `Tc(`/`Ta(` (case-insensitive) il componente fa il parsing della grammatica e disegna telaio, ante, ribalte, vasistas, divisori, cerniere, maniglie. La nuova pagina non deve reimplementare nulla di questa logica: passa semplicemente i valori del form come props a `PreviewInfisso`.

Non verrà toccato/riusato `lib/disegno-infisso.ts` (quello serve per SVG statico da stampa/PDF, non per la preview interattiva).

## File coinvolti

- **Nuovo**: `app/amministrazione/test-anteprime/page.tsx` — server component, guard `session_role === 'admin'` (pattern identico a `app/disegno/page.tsx`), nessuna query DB necessaria.
- **Nuovo**: `app/amministrazione/test-anteprime/test-anteprime-client.tsx` — client component con:
  - form: input testo `Abbr`, input numerico larghezza (cm), input numerico altezza (cm)
  - campi opzionali per test avanzati: `profilo_mm` (default 80), `colore` (select/testo libero, default "Bianco"), `bar_color`/`bar_color_acc` (color picker, opzionali — nel sito reale sono calcolati automaticamente dalla foto colore, qui possiamo lasciarli vuoti o con default)
  - "foglio" = area bianca centrale che monta `<PreviewInfisso>` con i valori correnti dello state (aggiornamento live, nessun bottone "genera" necessario, dato che il componente è già reattivo alle props)
  - eventuale lista di Abbr di esempio cliccabili (presi dai valori reali visti nei listini, es. `Tc(F())`, `Tc(mAc(F()))`, `Tc(V(F()))`) per velocizzare i test, senza necessità di collegarsi al DB
- **Modifica**: `lib/nav-config.ts` — aggiunta voce in `adminPages` (es. `{ id: 69, label: 'Test Anteprime', href: '/amministrazione/test-anteprime', roles: ['admin'] }`)

## Scelte tecniche

- Nessuna lettura/scrittura DB: la pagina è uno strumento di test isolato, l'utente digita la Abbr a mano (eventualmente copiandola dalla colonna Abbr dei listini). Se in futuro serve un dropdown "carica da un articolo esistente del listino", si può aggiungere in un secondo momento con una query mirata.
- `n_ante` e `tipo_prodotto`/`descrizione` restano come props richieste da `PreviewInfissoProps` ma quando `abbr` è valorizzato e riconosciuto (`Tc(`/`Ta(`) non influenzano il disegno (sono usati solo dal vecchio ramo "classico" di fallback) — verranno comunque esposti nel form per poter testare anche quel ramo legacy (Abbr vuota o non riconosciuta).
- Nessun impatto sul rendering esistente altrove: `PreviewInfisso` non viene modificato in questa fase, solo riusato.

## Passi principali

1. Creare `app/amministrazione/test-anteprime/page.tsx` (guard admin, mount client component).
2. Creare `test-anteprime-client.tsx`: form + stato + `<PreviewInfisso>` dentro un "foglio" (contenitore bianco con bordo, dimensioni fisse tipo A4/quadrato).
3. Aggiungere alcuni Abbr di esempio precompilati come scorciatoie.
4. Aggiungere voce in `lib/nav-config.ts` → `adminPages`.
5. Verifica manuale: aprire la pagina da admin, provare alcune Abbr reali viste nel DB e controllare che il disegno corrisponda a quello già visibile in un preventivo esistente con lo stesso articolo.

## Note

Non è stata creata/modificata alcuna route pubblica né alcuna tabella DB. Nessuna modifica a `components/preview-infisso.tsx` o `lib/disegno-infisso.ts` — sono stati solo riusati.

## Riepilogo implementazione (2026-08-04)

File creati/modificati esattamente come da piano, nessuna scelta cambiata rispetto al progetto:

- `app/amministrazione/test-anteprime/page.tsx` — server component, guard `session_role === 'admin'`, mount del client component, `<ShortcutStar>`.
- `app/amministrazione/test-anteprime/test-anteprime-client.tsx` — form con: campo Abbr + 5 pulsanti di esempio precompilati (valori reali visti nei listini: `Tc(F())`, `Tc(mAc(F()))`, `Tc(cA(F())+mAc(F()))`, `Tc(V(F()))`, `Tc(X(F())+P+80(mAc(F())))`), larghezza/altezza cm, profilo mm, color picker per `bar_color`/`bar_color_acc` (con pulsante "usa colore barra" per azzerare l'accento), sezione separata per i campi del ramo classico legacy (colore testuale, tipo prodotto, descrizione, n. ante) usati solo quando l'Abbr è vuota o non riconosciuta. Il "foglio" è un riquadro bianco con bordo che monta `<PreviewInfisso>` in modo reattivo (nessun bottone "genera", update live ad ogni digitazione).
- `lib/nav-config.ts` — aggiunta `{ id: 69, label: 'Test Anteprime', href: '/amministrazione/test-anteprime', roles: ['admin'] }` in `adminPages`.

Verifica: `npx tsc --noEmit` senza errori. Verifica visiva in browser non eseguita in automatico (preferenza utente di non lanciare Chrome headless per gli screenshot); da controllare manualmente su `/amministrazione/test-anteprime`.
