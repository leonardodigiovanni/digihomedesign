# Ristrutturazione layout PDF preventivi

**Data:** 2026-05-24  
**Stato:** completato  

## Obiettivo

Ristrutturare il layout PDF (carrello provvisorio + preventivo definitivo) con:
1. Riepilogo compatto articoli in prima pagina (tabella N°/Categoria/Serie/LxH/Qtà)
2. Splitting blocchi articolo tra pagine (elimina spazi vuoti)
3. Banner "↳ Continua #X..." sulle pagine di continuazione
4. Sezione condizioni + firma dopo gli articoli (pagina dedicata)
5. Due pagine embed PDF (Condizioni Generali Preventivo + Vendita)
6. Blocco firma finale (PER ACCETTAZIONE / PER DIGI HOME DESIGN S.R.L.)

## File coinvolti

- `app/area-clienti/carrello-preventivo/stampa/page.tsx`
- `app/area-clienti/preventivi/[id]/stampa/page.tsx`

## PDF condizioni trovati

- `/docs/Condizioni-generali-del-preventivo.pdf`
- `/docs/Condizioni-generali-di-vendita.pdf`

## Struttura pagine nuova

```
Pagina 1:      header1 + riepilogo tabella + "DETTAGLIO:" + articoli
Pagine 2..N:   headerN + (↳ Continua se split) + articoli
Pagina N:      totale offerta (ultima pagina articoli)
Pagina N+1:    headerN + testo condizioni + firma
Pagina N+2:    embed Condizioni Generali Preventivo
Pagina N+3:    embed Condizioni Generali Vendita
```

## Splitting blocchi

Ogni blocco = parte_main (header barra + riga contenuto) + parte_caratt (caratteristiche).
- Entrambe entrano → nessuno split
- Solo main entra → split: main su pagina corrente, caratt su pagina nuova con banner "Continua"
- Niente entra → nuova pagina, poi eventuale split

## Struttura pagine finale (aggiornata)

```
Pagina 1:       header1 + riepilogo tabella + "DETTAGLIO:" + articoli
Pagine 2..N:    headerN + (↳ Continua se split) + articoli
Pagina N:       totale offerta (ultima pagina articoli)
Pagina N+1:     headerN + testo condizioni (Salvo accordi...)
[lato client]   PDF Condizioni Generali del Preventivo (ogni pagina come immagine)
[lato client]   PDF Condizioni Generali di Vendita (ogni pagina come immagine)
Pagina N+2:     headerN + blocco firma (Luogo e data + PER ACCETTAZIONE)
```

## Modifiche finali applicate

- `caratteristicheWrapperHTML`: rimosso `font-style:italic` dal banner "↳ Continua"
- `condizioniIntroHTML`: testo cambiato in "Salvo accordi differenti..."
- `firmaHTML`: aggiunto "Luogo e data, __________________", rimosso "PER DIGI HOME DESIGN S.R.L."
- `buildPages`: firma spostata DOPO i PDF condizioni (ora `totalPages = pageGroups.length + 2`)
- `estimaAltezza` / `estimaMainH`: stima ridotta (rimosso extra subtotale da textH, mediaH→130)
- `stampa-client.tsx`: usa `pdfjs-dist` per rendere i PDF condizioni come immagini canvas; pagine inserite tra condizioni intro e firma
- `public/pdf.worker.min.js`: copiato da `node_modules/pdfjs-dist/build/`

## Completato
