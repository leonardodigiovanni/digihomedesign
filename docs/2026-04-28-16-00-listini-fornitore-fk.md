# Listini → FK Fornitori

**Data:** 2026-04-28  
**Stato:** completato

## Obiettivo

Aggiungere `fornitore_id` a `listini` come informazione interna (non esposta al cliente).

Modello corretto:
- `listini.produttore` = brand/fabbricante → compare nel preventivo come "Marca"
- `listini.fornitore_id` = chi vende l'articolo all'azienda → solo uso interno
- Stesso articolo (stessa categoria+produttore+descrizione) può avere più righe da fornitori diversi con prezzi d'acquisto diversi → si sceglie il fornitore col prezzo minore

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-lavoro/listini/page.tsx` | ALTER TABLE: aggiunge `fornitore_id INT NULL`; SELECT join fornitori per portare `fornitore_nome` |
| `app/area-lavoro/listini/actions.ts` | `addArticolo`/`updateArticolo` salvano `fornitore_id` |
| `app/area-lavoro/listini/listini-client.tsx` | Aggiunge dropdown fornitori nel form nuovo/modifica; tipo `Articolo` aggiornato; colonna "Fornitore" in tabella |

## Nessuna modifica a preventivo, cataloghi, area-clienti

`produttore` resta immutato ovunque. Il fornitore è dato interno gestito solo in `/area-lavoro/listini`.

## Passi

1. `ALTER TABLE listini ADD COLUMN fornitore_id INT NULL` (con catch se già esiste)
2. Page server: JOIN listini LEFT JOIN fornitori per portare `ragione_sociale` come `fornitore_nome`
3. `Articolo` type: aggiunge `fornitore_id: number | null`, `fornitore_nome: string`
4. Client: dropdown fornitore nel form + colonna visibile in tabella
5. Actions: legge `fornitore_id` dal FormData
