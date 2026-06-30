# Rimozione `catalogo_categorie` e campi ridondanti in `catalogo_voci`

**Data:** 2026-06-30  
**Stato:** completato

## Obiettivo

`catalogo_voci_percorsi` è ora la fonte di verità per (categoria, sottocategoria) di ogni voce.
Di conseguenza `catalogo_voci` ha tre campi ridondanti:
- `categoria_id` — FK verso `catalogo_categorie` (raggruppamento)
- `listino_categoria` — stringa libera che duplicava `percorsi.categoria`
- `sottocategoria` — stringa che duplicava `percorsi.sottocategoria`

E la tabella `catalogo_categorie` diventa completamente inutile.

## Modifiche DB

1. `catalogo_voci`: DROP COLUMN `categoria_id`, `sottocategoria`, `listino_categoria`
2. DROP TABLE `catalogo_categorie` (dopo aver rimosso la FK da `catalogo_voci`)
3. `lib/percorsi.ts`: eliminare i tre blocchi INSERT IGNORE di migrazione (dati già migrati)

## File da aggiornare (~30 file)

### Admin (`area-lavoro/cataloghi`)
- **`page.tsx`**: non più JOIN `catalogo_categorie`. Carica voci flat + percorsi; raggruppa per `percorsi[0].categoria` in memoria.
- **`cataloghi-client.tsx`**: il tipo `Categoria` diventa `CategoriaGroup { nome: string; voci: Voce[] }` derivato dai percorsi, non dalla tabella.
- **`actions.ts`**: eliminare `addCategoria`, `deleteCategoria`, `updateCategoria`, `updateListinoCategoria`; rimuovere `categoria_id` da `addVoce`.

### Brand/App cataloghi index
- **`brand/cataloghi/page.tsx`** e **`app/cataloghi/page.tsx`**: cambiare query `catalogo_categorie` → `SELECT DISTINCT categoria FROM catalogo_voci_percorsi ORDER BY categoria ASC`; slug derivato da `categoria`.

### Brand/App cataloghi [slug]/page.tsx
- **`brand/cataloghi/[slug]/page.tsx`** e **`app/cataloghi/[slug]/page.tsx`**: sostituire `WHERE categoria_id = ?` con `WHERE id IN (SELECT voce_id FROM catalogo_voci_percorsi WHERE categoria = ?)`.

### Serramenti (18 file)
Ogni file ha il pattern:
```sql
-- Prima:
SELECT id FROM catalogo_categorie WHERE LOWER(nome) = ?   -- trova categoria
SELECT * FROM catalogo_voci WHERE categoria_id = ? AND sottocategoria = ?
-- Dopo:
SELECT cv.* FROM catalogo_voci cv
JOIN catalogo_voci_percorsi vp ON vp.voce_id = cv.id
WHERE vp.categoria = ? AND vp.sottocategoria = ?
```
Eliminare anche la query `listino_categoria` sull'acquisto: l'unica fonte è ora i percorsi del listino.

### Altre pagine prodotto (legno, metallurgia, tessuti, arredi — ~15 file)
Stesso pattern delle serramenti.

### `lib/percorsi.ts`
- Rimuovere i 3 blocchi INSERT IGNORE (migrazione già completata).
- Non serve più il riferimento a `catalogo_voci.listino_categoria` e `catalogo_voci.sottocategoria`.

## Rischio / note

- La migrazione dei dati è già avvenuta (tramite `ensurePercorsiTables`).
  Bisogna verificare che ogni voce abbia almeno un record in `catalogo_voci_percorsi` prima di droppare i campi.
- DROP COLUMN e DROP TABLE sono operazioni distruttive irreversibili — fare un backup prima.
- Le pagine serramenti che cercano per `nomeCategoria = 'serramenti'` e `sottocatSlug = 'infissi-in-pvc'` continueranno a funzionare se i percorsi hanno `categoria = 'serramenti'` e `sottocategoria = 'infissi-in-pvc'`.
