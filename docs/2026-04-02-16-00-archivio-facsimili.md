# Archivio e Facsimili — sezioni staff

**Data:** 2026-04-02  
**Stato:** completato

---

## Obiettivo

Aggiungere due nuove sezioni interne protette da matrice permessi:

- **Archivio** (ID 33) — conservazione di documenti generici aziendali
- **Facsimili** (ID 34) — modelli/template scaricabili (preventivi, privacy, ordini, carta intestata, ecc.)

---

## Struttura dati — tabella MySQL condivisa `documenti_interni`

```sql
CREATE TABLE IF NOT EXISTS documenti_interni (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  sezione      ENUM('archivio','facsimile') NOT NULL,
  nome         VARCHAR(255) NOT NULL,        -- nome visualizzato
  categoria    VARCHAR(100) NOT NULL DEFAULT '',
  filename     VARCHAR(255) NOT NULL,        -- nome file su disco
  mime_type    VARCHAR(100) NOT NULL DEFAULT '',
  size_bytes   INT          NOT NULL DEFAULT 0,
  uploaded_by  VARCHAR(100) NOT NULL DEFAULT '',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

I file vengono salvati in `public/uploads/documenti/` sul server.

---

## Categorie predefinite

### Archivio
- Contratti, Verbali, Corrispondenza, Certificati, Altro

### Facsimili
- Preventivi, Privacy, Accettazione preventivo, Ordini, Carta intestata, Biglietti da visita, Volantini, Altro

---

## File coinvolti

| File | Ruolo |
|---|---|
| `lib/nav-config.ts` | Aggiunta voci ID 33 e 34 in `internalPages` |
| `app/archivio/page.tsx` | Server component — lista documenti sezione archivio |
| `app/archivio/actions.ts` | Server actions: upload, delete |
| `app/archivio/archivio-client.tsx` | Client: griglia + upload modal |
| `app/facsimili/page.tsx` | Server component — lista facsimili |
| `app/facsimili/actions.ts` | Server actions: upload, delete |
| `app/facsimili/facsimili-client.tsx` | Client: griglia per categoria + upload modal |

---

## Funzionalità comuni (Archivio e Facsimili)

### Griglia documenti
- Colonne: **Nome**, **Categoria**, **Tipo file** (icona/badge), **Dimensione**, **Caricato da**, **Data**, **Azioni**
- Ordinamento su tutte le colonne
- Filtro testo (nome) + filtro categoria
- Pulsante **Scarica** per ogni riga
- Pulsante **Elimina** (solo admin)

### Modal "Carica documento"
- Nome documento (testo, obbligatorio)
- Categoria (select con opzioni predefinite)
- File (input file — PDF, Word, Excel, immagini, ZIP)
- Dimensione massima: 20 MB (validata lato server)

---

## Differenze tra Archivio e Facsimili

| | Archivio | Facsimili |
|---|---|---|
| Scopo | Documenti archiviati | Template riutilizzabili |
| Categorie | Contratti, Verbali, ecc. | Preventivi, Privacy, ecc. |
| Visualizzazione | Lista flat | Raggruppata per categoria |

---

## Scelte tecniche

- I file vengono salvati con un nome univoco (`{timestamp}_{originalname}`) in `public/uploads/documenti/`
- Il download usa il path `/uploads/documenti/{filename}` direttamente via browser
- `uploaded_by` viene letto dal cookie `session_user`
- Pattern identico a magazzino per la struttura server/client

---

## Passi di implementazione

1. Aggiornare `lib/nav-config.ts` (ID 33 Archivio, ID 34 Facsimili)
2. Creare `app/archivio/` (page, actions, client)
3. Creare `app/facsimili/` (page, actions, client)
4. La tabella DB e la cartella upload vengono create automaticamente al primo accesso
