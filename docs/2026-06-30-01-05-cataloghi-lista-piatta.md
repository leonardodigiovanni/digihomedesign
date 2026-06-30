# Cataloghi area lavoro — lista piatta senza categoria

**Data:** 2026-06-30  
**Stato:** completato

## Obiettivo

Eliminare il raggruppamento per categoria (non esiste più `catalogo_categorie`).
`area-lavoro/cataloghi` diventa una lista piatta di `catalogo_voci` con dettaglio espandibile.

## Layout per ogni voce

**Riga chiusa:**
- Nome voce + badge `pdf_label`
- A sinistra (o sotto il nome): lista delle coppie `categoria / sottocategoria` prese da `catalogo_voci_percorsi`
- Bottone espandi / freccia

**Riga aperta (accordion):**
- Campi testuali: `serie`, `descrizione`, `fase`, `materiale`, `tipologia`, `ambiente`, `fascia`
- Flags booleani: `filtro_battente`, `filtro_scorrevole`, `filtro_taglio_termico`, `filtro_taglio_freddo`, `filtro_economico`, `filtro_fascia_alta`, `filtro_1..4`
- PDF: link/anteprima `pdf_filename`
- Gestione percorsi: aggiunta/rimozione coppie categoria+sottocategoria
- Modifica campi + salvataggio
- Eliminazione voce

## File coinvolti

- `app/area-lavoro/cataloghi/page.tsx` — query flat di tutte le voci + tutti i percorsi
- `app/area-lavoro/cataloghi/cataloghi-client.tsx` — riscrittura completa UI (rimozione accordion per categoria, nuova lista piatta con riga espandibile)
- `app/area-lavoro/cataloghi/actions.ts` — nessuna modifica necessaria (già pulito)

## Passi

1. `page.tsx`: rimuovere la logica di raggruppamento per categoria; passare al client `voci[]` flat + `percorsiPerVoce` Record
2. `cataloghi-client.tsx`: riscrivere con lista piatta; ogni `VoceRow` mostra i percorsi sulla sinistra; accordion per i dettagli
