# Listini — Scheda tecnica + foto profilo

**Data:** 2026-04-21  
**Stato:** completato

## Obiettivo

Aggiungere a ogni articolo del listino un pannello "Scheda tecnica" per inserire:
- **Foto del profilo** (upload immagine)
- **Misura frontale** (mm) — base visibile del profilo
- **Profondità** (mm) — spessore del telaio
- **Trasmittanza termica Uw** (W/m²K)

## Dove appare

- Pulsante "Scheda" nella colonna azioni della riga — apre un pannello/modale dedicato
- Nella riga normale: miniatura della foto (20×20 px) se presente, badge "Scheda" se ci sono dati tecnici

## File coinvolti

### `app/area-lavoro/listini/actions.ts`
- `ensureTable()`: aggiunge 4 colonne via `ALTER TABLE … ADD COLUMN IF NOT EXISTS`:
  - `foto_url VARCHAR(500) NULL`
  - `profilo_frontale_mm DECIMAL(6,2) NULL`
  - `profilo_profondita_mm DECIMAL(6,2) NULL`
  - `trasmittanza_uw DECIMAL(5,3) NULL`
- Nuova action esportata: `updateSchedaTecnica(_: MutResult|null, fd: FormData)`:
  - Legge i campi numerici dal FormData
  - Se c'è un File allegato (`foto`), lo scrive in `/public/listini/<id>-<ts>.<ext>` via stream (Buffer.concat)
  - Aggiorna le 4 colonne con `UPDATE listini SET … WHERE id=?`
  - Cancella il vecchio file se l'URL cambia

### `app/area-lavoro/listini/listini-client.tsx`
- Tipo `Articolo`: + 4 campi opzionali (`foto_url`, `profilo_frontale_mm`, `profilo_profondita_mm`, `trasmittanza_uw`)
- Import di `updateSchedaTecnica`
- Nuovo componente `SchedaTecnicaModal`: modal centrata con:
  - Preview immagine (o placeholder grigio se assente)
  - Input file per l'upload
  - 3 input numerici: frontale mm, profondità mm, trasmittanza Uw
  - Pulsanti Salva / Annulla
- `RigaNormale`: + miniatura foto (20×20, object-fit cover, border-radius 2) e pulsante "Scheda" accanto a Modifica/Elimina

### `app/area-lavoro/listini/page.tsx`
- Aggiungere i 4 nuovi campi nella query `SELECT`

## Scelte tecniche

- File salvati in `/public/listini/` (path locale — **non funzionerà su Vercel**, da migrare su S3/Cloudinary se necessario)
- Upload via `stream().getReader() + Buffer.concat()` come da feedback memory
- MySQL: `ALTER TABLE … ADD COLUMN IF NOT EXISTS` per retrocompatibilità (MySQL 8+)
  - Per MySQL < 8 si usa il pattern `ADD COLUMN` + `catch()` già presente nel codice

## Nessun impatto su

- Paginazione PDF / stampa preventivo
- Logica preventivi
- Altri moduli
