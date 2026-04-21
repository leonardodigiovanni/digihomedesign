# Preventivi — Form articoli e genera preventivo

**Data:** 2026-04-19  
**Stato:** completato

---

## Obiettivo

Permettere al personale (dipendente/admin) di costruire un preventivo aggiungendo articoli uno a uno tramite form con lookup a cascata, quindi calcolare il totale con "Genera preventivo".

---

## Flusso utente

1. Da `/clienti/preventivi` → pulsante **"Nuovo preventivo"** crea una bozza e apre la pagina di dettaglio.
2. Nella pagina di dettaglio (`/clienti/preventivi/[id]`) l'utente vede:
   - Header preventivo (cliente, data, stato, note)
   - Lista articoli già aggiunti (tabella)
   - Pulsante **"Aggiungi articolo"** → form vuoto
   - Pulsante **"Aggiungi articolo del tipo precedente"** (visibile solo se esiste almeno un articolo) → form con tipo/marca/modello/colore pre-selezionati dall'ultimo articolo
   - Pulsante **"Genera preventivo"** → calcola prezzo per ogni articolo, aggiorna `importo` del preventivo, mostra totale
3. Il form articolo (modale o pannello laterale) contiene:
   - **Tipo prodotto** (lookup da `listini.categoria` DISTINCT)
   - **Marca** (lookup da `listini.produttore` filtrato per categoria selezionata)
   - **Modello** (lookup da `listini.descrizione` filtrato per categoria+produttore selezionati)
   - **Colore** (lookup da tabella `colori` oppure lista statica: Bianco, Bronzo, Oro, Antracite, RAL personalizzato…)
   - **Tipo vetro** — visibile solo se il tipo prodotto prevede vetro (infissi, finestre, porte vetrate); lookup da lista statica: Singolo, Camera 4+12+4, Camera basso-emissivo, Triplo, Acidato…
   - **Allestimento/accessori** — selezione multipla opzionale da lista: Maniglia, Serratura multipunto, Cerniere rinforzate, Zanzariera, Cassonetto…
   - **Altezza (cm)** — numero
   - **Larghezza (cm)** — numero
   - **N° di ante** — numero intero
   - **Quantità** — numero intero (default 1)
   - Pulsanti **Salva** e **Annulla**

---

## Calcolo prezzi (Genera preventivo)

Per ogni articolo, il prezzo si calcola dal `prezzo_vendita` del listino corrispondente:

| Unità listino | Formula articolo                                     |
|---------------|------------------------------------------------------|
| m²            | `prezzo_vendita × (altezza/100 × larghezza/100) × quantità` |
| pz / corpo    | `prezzo_vendita × quantità`                          |
| ml            | `prezzo_vendita × (larghezza/100) × quantità`        |

Eventuali extra per colore non-standard o tipo vetro: da definire (per ora 0 extra).

Il totale degli articoli viene scritto in `preventivi.importo` e lo stato rimane `bozza` (l'utente potrà poi cambiarlo manualmente).

---

## Struttura DB — nuove tabelle

### `preventivo_articoli`
```sql
CREATE TABLE preventivo_articoli (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  preventivo_id  INT NOT NULL,
  tipo_prodotto  VARCHAR(100) NOT NULL,
  marca          VARCHAR(100) NOT NULL DEFAULT '',
  modello        VARCHAR(300) NOT NULL DEFAULT '',
  listino_id     INT NULL,           -- FK a listini.id (nullable se il listino cambia)
  prezzo_base    DECIMAL(10,2) NOT NULL DEFAULT 0,
  unita          VARCHAR(30) NOT NULL DEFAULT 'pz',
  colore         VARCHAR(100) NOT NULL DEFAULT '',
  tipo_vetro     VARCHAR(100) NOT NULL DEFAULT '',
  accessori      TEXT NOT NULL DEFAULT '',  -- CSV dei nomi accessori selezionati
  altezza_cm     DECIMAL(7,2) NOT NULL DEFAULT 0,
  larghezza_cm   DECIMAL(7,2) NOT NULL DEFAULT 0,
  n_ante         INT NOT NULL DEFAULT 1,
  quantita       INT NOT NULL DEFAULT 1,
  prezzo_totale  DECIMAL(10,2) NOT NULL DEFAULT 0,
  note           TEXT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

Non si aggiungono tabelle separate per colori/vetri/accessori: si usano liste statiche hardcoded nel client (più facile da cambiare in seguito).

---

## File coinvolti

### Nuovi
| File | Ruolo |
|------|-------|
| `app/clienti/preventivi/[id]/page.tsx` | Server component: carica preventivo + articoli, espone dati al client |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Client component: gestione stato form, modale aggiunta articolo |
| `app/clienti/preventivi/actions.ts` | Server actions: crea preventivo, aggiungi/rimuovi articolo, genera preventivo |

### Modificati
| File | Modifica |
|------|----------|
| `app/clienti/preventivi/page.tsx` | + pulsante "Nuovo preventivo"; righe diventano link alla pagina dettaglio |

---

## Lookup a cascata — strategia

Le opzioni di tipo/marca/modello vengono caricate **una volta sola** dalla pagina server, che passa al client un array di tutti i listini disponibili (`{id, categoria, produttore, descrizione, unita, prezzo_vendita}`).

Il client filtra lato browser senza ulteriori chiamate:
- `marca` options = listini con `categoria === selectedTipo`
- `modello` options = listini con `categoria === selectedTipo && produttore === selectedMarca`
- `prezzo_base` e `unita` si leggono direttamente dall'elemento selezionato

---

## Passi di implementazione

1. Aggiornare `app/clienti/preventivi/page.tsx`: pulsante "Nuovo preventivo" + righe cliccabili
2. Creare `app/clienti/preventivi/actions.ts`: `creaPreventivo`, `aggiungiArticolo`, `rimuoviArticolo`, `generaPreventivo`
3. Creare `app/clienti/preventivi/[id]/page.tsx`: carica preventivo + articoli + listini
4. Creare `app/clienti/preventivi/[id]/preventivo-client.tsx`: UI completa con modale form

---

## Note / scelte tecniche

- Liste statiche (colori, tipi vetro, accessori) hardcoded in `preventivo-client.tsx` — facili da spostare su DB in futuro.
- Tipi prodotto che prevedono vetro: si determina con `['infissi alluminio','infissi pvc','finestre','porte vetrate','box doccia','verande'].includes(tipo)` — la lista è configurabile.
- Nessuna tabella separata per colori/vetri/accessori nel MVP.
- Prezzo extra per colore/vetro non-standard: **non implementato** in MVP, importo rimane quello del listino base.
