# Fix campi Larghezza/Altezza nel form "Aggiungi articolo" del preventivo cliente

**Stato:** completato
**Data:** 2026-08-27

## Problema riscontrato

In `https://www.digi-home-design.com/clienti/preventivi/151`, aggiungendo un articolo che nel listino ha `richiede_quantita = 1` ma `richiede_larghezza = 0` e `richiede_altezza = 0`, la modale "Aggiungi articolo" mostra comunque i campi Larghezza e Altezza come obbligatori.

## Causa

Esistono due componenti distinti per l'aggiunta di un articolo, con logiche diverse:

1. **`components/aggiungi-articolo-form.tsx`** (usato in carrello, carrello-computometrico, cataloghi brand) — legge dal DB i flag per-articolo della tabella `listini`: `richiede_larghezza`, `richiede_altezza`, `richiede_altezza3d`, `richiede_quantita`, `richiede_piano`, `richiede_km`, `richiede_peso`, e mostra/nasconde i campi di conseguenza. **Corretto.**

2. **`app/clienti/preventivi/[id]/preventivo-client.tsx`** (componente interno `ArticoloForm`, righe ~414‑1164, montato come modale righe ~2393‑2411) — form specifico e più vecchio, mai allineato al punto 1 (già segnalato come "da valutare separatamente" in `docs/2026-04-28-10-00-aggiungi-articolo-centralizzato.md`). Questo form:
   - non seleziona affatto i flag `richiede_*` di misura nella query in `app/clienti/preventivi/[id]/page.tsx` (righe ~123‑146: seleziona solo `richiede_tipo_colore`, `richiede_tipo_colore_acc`, `richiede_tipo_vetro`, `richiede_tipo_montaggio`);
   - il tipo `ListinoItem` (righe 16‑52 di `preventivo-client.tsx`) non li espone;
   - decide quali campi mostrare (righe ~1018‑1088) **indovinando dall'unità di misura** (`unita`) dell'articolo:
     - `m²`/`mq`/`m2` → mostra sempre Larghezza + Altezza + Quantità
     - `ml`/`m`/`mt` → mostra Lunghezza + Quantità
     - `kg` → solo Quantità
     - altro → solo Quantità

L'articolo in questione ha `unita = 'm²'`, quindi il form forza Larghezza/Altezza indipendentemente dalla configurazione reale dell'articolo nel listino.

## Fix proposto

Allineare `ArticoloForm` in `preventivo-client.tsx` alla logica già corretta e centralizzata:

1. **`app/clienti/preventivi/[id]/page.tsx`** — estendere la query SELECT (~riga 131) aggiungendo `l.richiede_larghezza, l.richiede_altezza, l.richiede_altezza3d, l.richiede_quantita, l.richiede_piano, l.richiede_km, l.richiede_peso`, e mapparli nell'oggetto passato a `ListinoItem` (righe ~148‑184).
2. **`app/clienti/preventivi/[id]/preventivo-client.tsx`**:
   - estendere il tipo `ListinoItem` (righe 16‑52) con questi nuovi campi opzionali;
   - in `ArticoloForm` (righe ~1018‑1088), sostituire l'euristica `isMq/isMl/isKg` basata su `unita` con controlli diretti sui flag (`listinoSel.richiede_larghezza === 1`, `richiede_altezza === 1`, `richiede_quantita === 1`, ecc.), sullo stesso schema già usato in `components/aggiungi-articolo-form.tsx` (righe ~649‑690).
3. Mantenere `unita` solo come etichetta (es. "cm", "kg") nei campi mostrati, non più come selettore di quali campi mostrare.

## File coinvolti

- `app/clienti/preventivi/[id]/page.tsx`
- `app/clienti/preventivi/[id]/preventivo-client.tsx`

Nessuna modifica a `components/aggiungi-articolo-form.tsx` (già corretto, resta il riferimento).

## Modifiche effettive

- `app/clienti/preventivi/[id]/page.tsx`: aggiunte `l.richiede_larghezza, l.richiede_altezza, l.richiede_quantita` alla query SELECT e al mapping verso `ListinoItem`.
- `app/clienti/preventivi/[id]/preventivo-client.tsx`:
  - tipo `ListinoItem` esteso con `richiede_larghezza?`, `richiede_altezza?`, `richiede_quantita?`;
  - in `ArticoloForm`, l'euristica `isMq/isMl/isKg` è stata rimossa dalla decisione di quali campi mostrare. Ora `rLarghezza`/`rAltezza`/`rQuantita` derivano **esclusivamente** dai flag del listino (`richiede_larghezza === 1` ecc.), esattamente come in `components/aggiungi-articolo-form.tsx`. Nessun fallback sull'unità di misura.
  - `unita` resta usata solo per l'etichetta ("Lunghezza" invece di "Larghezza" se `ml`/`m`/`mt`, "Quantità (kg)" se `kg`), non più per decidere la visibilità dei campi.

### Scelta rispetto al piano iniziale

Il piano prevedeva inizialmente anche `richiede_altezza3d`, `richiede_piano`, `richiede_km`, `richiede_peso`: non sono stati aggiunti perché la tabella `preventivo_articoli` non ha colonne corrispondenti e il form non ha input per questi campi — fuori scope, eventuale lavoro futuro se servirà.

Durante l'implementazione era stato inizialmente previsto anche un fallback sull'euristica storica (basata su `unita`) per i listini con tutti i flag `richiede_*` a 0 (mai configurati esplicitamente — es. 8 articoli `m²` e 5 `pz` nel DB). L'utente ha chiesto esplicitamente di **non** mantenere questo fallback: la modale deve riflettere solo ciò che è stato configurato sul listino. Se un articolo non richiede alcun campo (flag tutti a 0), la modale ora non mostra Larghezza/Altezza/Quantità finché l'admin non imposta i flag opportuni in Listini.

## Estensione: stesso bug nella modale "Modifica articolo"

Segnalato dall'utente su "Modifica articolo #782": la modale di modifica (`ModificaArticoloModal`, righe ~1155‑1492) aveva la stessa euristica sull'unità (`isRootMq`/`isRootMl`/`isRootKg`) per decidere i campi dell'articolo root, non collegata ai flag `richiede_*`. Stesso fix applicato:

- Rimosso `isRootMq`; aggiunte `rootRLarghezza`/`rootRAltezza`/`rootRQuantita` derivate da `childListino` (il listino dell'articolo in modifica, già risolto in precedenza nel componente) — stesso pattern di `ArticoloForm`.
- I campi Larghezza/Altezza/Quantità vengono mostrati solo se il relativo flag è a 1; per i campi non mostrati viene comunque inviato un input hidden con il valore corrente, per non azzerarlo al salvataggio.
- Nessuna modifica a query: `listini` arriva già con i flag dalla fix precedente in `page.tsx`.

## Note

- Cambio mirato al solo rendering condizionale dei campi e alla query dati; non tocca la logica di salvataggio/calcolo prezzo già esistente per l'articolo.
- Stessa identica logica esiste duplicata (stessa query/pattern) in `app/area-clienti/preventivi/[id]/page.tsx` e `app/app/preventivo/[id]/page.tsx` (entrambi riusano lo stesso `PreventivoClient`/`ArticoloForm`), ma non sono stati toccati: non erano nello scope richiesto. Segnalato all'utente, da valutare se allineare anche quei due entry point.
