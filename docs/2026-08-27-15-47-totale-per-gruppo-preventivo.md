# Totale per gruppo di articoli (vista web + stampa PDF)

**Stato:** completato
**Data:** 2026-08-27

## Obiettivo

Nella pagina preventivo (es. `/clienti/preventivi/128`), gli articoli sono già raggruppati per Categoria · Marca · Serie (es. "Infissi in alluminio · ALSistem · 3G SYSTEM REVOLUTION"), con una barra titolo in cima al gruppo. Il cliente vede il totale generale del preventivo ma non quanto sta spendendo per ciascun gruppo (es. 5.000 € infissi, 2.000 € porta blindata, 3.000 € veranda), costringendolo a sommare a mente le singole righe.

Va aggiunta una riga "totale gruppo", simmetrica alla barra titolo (stessa fascia, in fondo alla tabella del gruppo invece che in cima), sia nella vista web sia nella stampa PDF.

## Vista web — `app/clienti/preventivi/[id]/preventivo-client.tsx`

I gruppi sono già calcolati in `catGroups` (riga ~2023-2035): per ogni gruppo, `cg.groups` è un array di `[root, ...children]`. Ogni `catGroups.map(cg => ...)` renderizza una card con barra titolo (`cg.label`, riga ~2063-2065) + tabella articoli (righe ~2066-2349).

**Modifica**: dopo la chiusura di `</table>` (riga ~2349) e prima della chiusura della card (riga ~2350), aggiungere una barra "Totale gruppo" con lo stesso stile della barra titolo (stesso sfondo `VERDE`/`groupBg`, stesso bordo), allineata a destra, con il totale:

```
totaleGruppo = cg.groups.flat().reduce((s, a) => s + a.prezzo_totale, 0)
```

(somma di `prezzo_totale` su root **e** figli/caratteristiche di tutti gli articoli del gruppo — stessa logica già usata riga ~2235 per il totale di riga singola, estesa a tutto il gruppo).

Esempio visivo:
```
┌─────────────────────────────────────────────┐
│ Infissi in alluminio · ALSistem · 3G SYSTEM  │  ← barra titolo (esistente)
├─────────────────────────────────────────────┤
│ [riga articolo: finestra]                    │
│ [riga articolo: porta]                       │
├─────────────────────────────────────────────┤
│                        Totale gruppo: €5.000 │  ← nuova barra (simmetrica)
└─────────────────────────────────────────────┘
```

## Stampa PDF — `app/area-clienti/preventivi/[id]/stampa/page.tsx`

Il PDF ha una tabella di riepilogo iniziale (`riepilogoTableHeaderHtml`/`riepilogoTableRowHtml`, righe ~528-558) che elenca ogni articolo root con Rif./Categoria/Marca/Serie/Descrizione/L×H/Qtà — **ma senza colonna prezzo** (il prezzo compare solo più avanti, nel dettaglio per-articolo). I gruppi sono già usati per l'ordinamento (`_catKey`, righe ~1024-1028) ma non sono visivamente separati né totalizzati in questa tabella.

**Modifica**:
1. Aggiungere una colonna **"Totale €"** a `riepilogoTableHeaderHtml`/`riepilogoTableRowHtml` (somma root+figli per quella riga, stessa formula della vista web).
2. Nel ciclo che costruisce i blocchi (riga ~1086 `roots.forEach((p, i) => blocks.push(...))`), rilevare il cambio di `_catKey` tra un root e il successivo (o la fine dell'elenco) e inserire, subito dopo l'ultima riga del gruppo, un blocco "Subtotale gruppo" con lo stesso stile della tabella (sfondo evidenziato, es. `#f0f0f0` come l'header) e il totale del gruppo.

Nessuna modifica alla sezione "DETTAGLIO FORNITURA" (i blocchi per-articolo più dettagliati più avanti nel PDF) — i totali di gruppo compaiono solo nella tabella di riepilogo iniziale, che è il punto in cui il cliente ha già una vista d'insieme di categoria/marca/serie/quantità.

## File coinvolti

- `app/clienti/preventivi/[id]/preventivo-client.tsx` (vista web)
- `app/area-clienti/preventivi/[id]/stampa/page.tsx` (PDF: header/row/riepilogo tabella + ciclo di costruzione blocchi)

## Note

- Il totale di gruppo usa sempre `prezzo_totale` (netto, dopo eventuali sconti articolo) — coerente con il subtotale generale già mostrato in fondo al preventivo.
- Non tocco la pagina `app/app/preventivo/[id]/page.tsx` (versione PWA) né `app/area-clienti/preventivi/[id]/page.tsx`: riusano lo stesso `PreventivoClient`, quindi la fix sulla vista web si applica automaticamente anche lì.

## Modifiche effettive

- `app/clienti/preventivi/[id]/preventivo-client.tsx`: in `catGroups.map`, aggiunto `totaleGruppo = cg.groups.reduce((s, grp) => s + grp.reduce((s2, a) => s2 + a.prezzo_totale, 0), 0)` e una barra `Totale gruppo: € …` (stesso `VERDE`/bordo della barra titolo) subito dopo `</table>`, prima della chiusura della card del gruppo.
- `app/area-clienti/preventivi/[id]/stampa/page.tsx`:
  - `riepilogoTableHeaderHtml`/`riepilogoTableRowHtml`: aggiunta colonna "Totale €" (12%), ridotte "Descrizione articolo" (27%→19%) e "L×H" (16%→12%) per fare spazio.
  - `riepilogoTableRowHtml` ora accetta un terzo parametro `totale` (root+figli, calcolato dal chiamante con `childrenMap` già disponibile in `buildStampaData`).
  - Nuova funzione `riepilogoSubtotaleGruppoHtml(totale)`: riga evidenziata (`#f0f0f0`, grassetto) allineata a destra.
  - Nel ciclo che costruisce i blocchi di riepilogo, accumulo `groupSum` per ogni root e, quando `_catKey` del prossimo root cambia (o è l'ultimo), inserisco il blocco subtotale e azzero l'accumulatore.
- Nessuna modifica alla sezione "DETTAGLIO FORNITURA" del PDF, come da piano.
- Lint e type-check verificati su tutti i file toccati: nessun nuovo errore/warning introdotto (confrontato con `git stash` per isolare i problemi preesistenti).
