# Quantità diretta per unità di misura non derivabile da dimensioni

**Stato:** completato
**Data:** 2026-08-27

## Problema

Con la fix precedente (`docs/2026-08-27-12-13-fix-campi-misura-form-preventivo-cliente.md`), la modale mostra Larghezza/Altezza solo se il listino ha `richiede_larghezza`/`richiede_altezza` a 1. Per articoli con `unita = 'm²'` (o `'ml'`) ma questi flag a 0 (es. articolo #782 "Veranda in alluminio freddo", listino id 118), il valore da moltiplicare per il prezzo unitario (l'area o la lunghezza) non può più essere calcolato da nessuna dimensione inserita — risultato: prezzo totale sempre 0, indipendentemente da `richiede_quantita`.

## Regola richiesta

Per un articolo il cui listino ha unità "di misura" (`m²`/`mq`/`m2` oppure `ml`/`m`/`mt`):

- Se le dimensioni necessarie a calcolare il valore sono richieste (`richiede_larghezza` **e** `richiede_altezza` per m²; `richiede_larghezza` per ml) → comportamento invariato: si chiedono le dimensioni, il valore si calcola da L×H (o L), eventualmente con `minimo` come soglia.
- Se manca anche solo una delle dimensioni necessarie (quindi il valore non è calcolabile) → la modale mostra **sempre** un campo diretto **"Quantità (m²) \*"** / **"Quantità (ml) \*"**, a prescindere dallo stato del flag `richiede_quantita`. Il numero inserito è il valore stesso da fatturare (es. "12" = 12 m²).
- In questo caso il prezzo si calcola come `prezzo_base × valore_inserito` (niente più moltiplicazione per larghezza×altezza, che non esistono), analogo al meccanismo `formula_diretta` già presente oggi solo per le caratteristiche-figlie con unità m²/ml.
- Per unità non "di misura" (`pz`, `kg`, `Km`, `Piano`, o etichette libere tipo "banane"), nessun cambiamento: la formula usa già `prezzo_base × quantità` come conteggio diretto, e il campo Quantità continua a comparire solo se `richiede_quantita = 1`, come già fixato.

## File coinvolti

- `app/clienti/preventivi/[id]/preventivo-client.tsx`
  - `ArticoloForm` (aggiunta articolo): quando l'unità è m²/ml e le dimensioni non sono entrambe richieste, mostrare il campo diretto al posto di Larghezza/Altezza/Quantità "a pezzi"; impostare un flag `formula_diretta=1` nel FormData inviato.
  - `ModificaArticoloModal` (modifica articolo, sezione root): stessa logica — attualmente il ramo root non ha alcun concetto di `formula_diretta` (esiste solo per `isChildUnit`); va aggiunto anche lì, riusando lo stesso campo diretto.
- `app/clienti/preventivi/actions.ts`
  - `aggiungiArticolo`: attualmente non gestisce affatto `formula_diretta` per l'articolo root — va aggiunto (stesso ramo già presente in `modificaArticolo` per i figli, righe ~553-554: `if (formulaDiretta) prezzoLordo = prezzo_base_calc * quantita`), bypassando il calcolo area/minimo quando il flag è attivo.
  - `modificaArticolo`: il ramo root (righe ~549-559) va esteso per accettare `formula_diretta` allo stesso modo del ramo `isChildUnit` già esistente.

## Comportamento UI

Nel form, quando si applica il caso "quantità diretta":
```
Quantità (m²) *:  [ ___ ]
```
al posto di:
```
Larghezza (cm) *: [ ___ ]   Altezza (cm) *: [ ___ ]   Quantità *: [ ___ ]
```
Nessun altro campo dimensionale viene mostrato/richiesto in questo caso (larghezza_cm e altezza_cm restano 0 nel DB, come già avviene oggi per le caratteristiche-figlie con `formula_diretta`).

## Correzione post-implementazione

La prima implementazione confondeva "quantità" (numero di pezzi) con "unità" (valore m²/ml per pezzo), usando lo stesso campo `quantita` per entrambi. Corretto su richiesta dell'utente: sono due campi distinti e indipendenti.

Esempio: 1 veranda (**quantità = 1**) di 13,5 m² (**unità = 13,5**), prezzo unitario 200 €/m² → prezzo totale = 200 × 13,5 × 1 = **2.700 €**.

- Nuova colonna dedicata `unita_valore` in `preventivo_articoli` (DECIMAL(10,3) NULL) — **non** riusa `larghezza_cm` (che ha una conversione cm→m/100 incompatibile con un valore già in m²).
- `quantita` resta il numero di pezzi (es. 1 veranda, 2 verande…).
- Formula: `prezzo_base × unita_valore × quantita`.
- Le caratteristiche-figlie (`isChildUnit`, che già usavano `formula_diretta` per un caso diverso) non inviano `unita_valore`: la formula condivisa in `modificaArticolo` ricade su `× 1` quando `unita_valore` è assente, quindi il loro comportamento storico (`prezzo_base × quantita`) resta invariato.

## Modifiche effettive

- `app/clienti/preventivi/actions.ts`
  - `ensureTables()`: aggiunta `ALTER TABLE preventivo_articoli MODIFY COLUMN quantita DECIMAL(10,2) NOT NULL DEFAULT 1` (idempotente). La colonna era `INT` — non avrebbe potuto contenere valori come "12.34 m²" (troncati/arrotondati). Applicata e verificata sul DB di sviluppo, dati esistenti preservati.
  - `aggiungiArticolo`: `quantita` letta con `parseFloat` invece di `parseInt` (coerente con `modificaArticolo`, che già usava `parseFloat`); aggiunta lettura `formula_diretta` dal FormData; nel ramo root (non-`parent_id`) il calcolo bypassa area/minimo quando `formula_diretta` è attivo (`prezzoLordo = prezzo_base * quantita`).
  - `modificaArticolo`: **nessuna modifica** — gestiva già `formula_diretta` in modo generico (non solo per `isChildUnit`), bastava che il frontend lo inviasse anche per il ramo root.
- `app/clienti/preventivi/[id]/preventivo-client.tsx`
  - `ArticoloForm`: aggiunte `isMq`, `dimensioniComplete`, `formulaDiretta`; quando attivo mostra il campo unico "Quantità (<unità>) \*" con hidden `formula_diretta=1`, al posto del blocco Larghezza/Altezza/Quantità.
  - `ModificaArticoloModal`: ripristinato `isRootMq`; aggiunte `rootDimensioniComplete`/`rootFormulaDiretta` sullo stesso schema; il ramo root ora mostra lo stesso campo diretto quando serve (`handleSubmit` non ha richiesto modifiche: usa già `new FormData` che raccoglie l'hidden `formula_diretta`).

## Note

- Dopo il fix, l'articolo #782 continuerà a mostrare prezzo 0 finché non viene riaperto in modifica: ora la modale mostrerà il campo "Quantità (m²) \*" dove inserire i m² reali della veranda — non è una migrazione automatica dei dati esistenti, va corretto manualmente riaprendo l'articolo.
- Lint e type-check verificati sui file toccati: nessun nuovo errore introdotto (i problemi residui sono preesistenti, non legati a questa modifica).
