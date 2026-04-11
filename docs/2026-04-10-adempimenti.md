# Adempimenti SRL — pagina dedicata

**Data:** 2026-04-10  
**Stato:** completato

---

## Obiettivo

Pagina `/adempimenti` per gestire gli adempimenti fiscali/amministrativi della SRL, pensata come promemoria ricorrente anno per anno.

---

## Struttura DB — tabella `adempimenti`

| Colonna        | Tipo                                              | Note                                    |
|----------------|---------------------------------------------------|-----------------------------------------|
| `id`           | INT PK AUTO                                       |                                         |
| `descrizione`  | VARCHAR(300)                                      | Es. "Dichiarazione IVA annuale"         |
| `ente`         | VARCHAR(150)                                      | Es. "Agenzia delle Entrate", "INPS"...  |
| `periodo`      | VARCHAR(100)                                      | Es. "Entro 30 aprile", "Trimestrale"    |
| `data_scadenza`| DATE NULL                                         | Data precisa se disponibile             |
| `incaricato`   | VARCHAR(100)                                      | Es. "Commercialista", "Amministratore"  |
| `stato`        | ENUM('da_fare','in_corso','completato','n_a')     | Stato corrente                          |
| `anno`         | SMALLINT                                          | Anno di riferimento                     |
| `ricorrente`   | TINYINT(1) DEFAULT 1                              | 1 = si ripete ogni anno                 |
| `note`         | TEXT NULL                                         |                                         |
| `created_at`   | TIMESTAMP                                         |                                         |

---

## Funzionalità

- **Tabella** con tutte le colonne, ordinabile e filtrabile lato client
- **Form aggiunta** adempimento
- **Filtro anno** in cima (select, default anno corrente)
- **Badge stato** colorato: 🔴 Da fare / 🟡 In corso / 🟢 Completato / ⚪ N/A
- **Toggle stato** rapido dalla tabella (click sul badge cicla gli stati)
- **Duplica per anno successivo** — pulsante che crea una copia dell'adempimento per l'anno +1 (utile per ricorrenti)
- **Elimina**

---

## Navigazione

Creare route dedicata `app/adempimenti/page.tsx` e aggiornare `lib/nav-config.ts` (id 22) con `href: '/adempimenti'` invece di `/interno/22`.

---

## File coinvolti

| File | Azione |
|---|---|
| `lib/nav-config.ts` | Cambia href id 22 da `/interno/22` a `/adempimenti` |
| `app/adempimenti/page.tsx` | Server component: guard, fetch, passa al client |
| `app/adempimenti/adempimenti-client.tsx` | Client component: tabella, form, filtri |
| `app/adempimenti/actions.ts` | Server actions: add, delete, updateStato, duplicaAnno |
