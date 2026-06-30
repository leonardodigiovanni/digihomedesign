# Carrello Preventivo — Aggiungi articolo via modale

**Data:** 2026-06-28  
**Stato:** completato

## Obiettivo

Il bottone "+ Aggiungi articolo" in `/area-clienti/carrello-preventivo` attualmente è un `<a href>` che porta alla pagina cataloghi. Deve diventare un bottone che apre una modale di selezione articolo identica a quella di `/clienti/preventivi/[id]`.

## File coinvolti

| File | Modifica |
|---|---|
| `app/area-clienti/carrello-preventivo/page.tsx` | Aggiungere query listini (principale=1, disponibile=1, preventivabile=1) e passarli a `CarrelloClient` |
| `app/area-clienti/carrello-preventivo/carrello-client.tsx` | Nuovo tipo modale `aggiungi`, form a cascata per selezione, chiamata `aggiungiArticoloAlCarrello` |

## Passi

1. **`page.tsx`** — aggiungere SELECT listini con tutti i campi di classificazione (categoria, sottocategoria, fase, materiale, tipologia, ambiente, produttore, serie, descrizione, fascia, unita, prezzo_vendita, prezzo_acquisto, sconto_articolo, richiede_*, minimo, schema_url, filtri 1-4). Passare come prop `listini` a `CarrelloClient`.

2. **`CarrelloClient` — tipo e prop** — aggiungere `listini: ListinoItem[]` ai props (tipo da definire inline o importare). Aggiungere `{ type: 'aggiungi' }` a `ModalState`.

3. **`CarrelloClient` — stato cascata** — aggiungere state e useMemo per: tipo, sottocatFiltro, faseFiltro, materialeFiltro, tipologiaFiltro, ambienteFiltro, fasciaFiltro, marca, serieFiltro, listinoId, schemaFiltro. Uguale alla logica in `preventivo-client.tsx`.

4. **`CarrelloClient` — renderModal aggiungi** — form con SelectLookup a cascata (tipo → sottocat → fase → materiale → tipologia → ambiente → fascia → marca → serie → linguette → thumbnails → descrizione), poi i campi dimensione/quantità in base all'articolo selezionato (`richiede_larghezza`, `richiede_altezza`, `richiede_tipo_colore` ecc.). Submit chiama `aggiungiArticoloAlCarrello`.

5. **Bottone** — cambiare `<a href={cataloghiHref}>` in `<button onClick={() => setModal({ type: 'aggiungi' })}>`

## Note tecniche

- I 6 campi classificazione (sottocategoria, fase, materiale, tipologia, ambiente, fascia) potrebbero essere NULL se non ancora compilati in DB — la modale li mostra comunque (come in preventivi).
- La logica thumbnails/schemaFiltro/filtriModelloAttivi (linguette) è identica a `preventivo-client.tsx`.
- Il form dimensioni dipende da `richiede_larghezza`, `richiede_altezza`, `richiede_tipo_colore`, ecc. sull'articolo selezionato.
- Dopo aggiunta: `router.refresh()` + chiudere la modale.
