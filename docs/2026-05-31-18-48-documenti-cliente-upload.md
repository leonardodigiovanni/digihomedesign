# Upload documenti cliente (admin/dipendente)

**Stato**: completato  
**Data**: 2026-05-31

---

## Obiettivo

Aggiungere alla pagina `/area-clienti/documenti` un'interfaccia per admin e dipendente che permetta di:
- Caricare un file (PDF, immagine, qualsiasi tipo)
- Assegnare il documento a un cliente specifico
- Specificare titolo, tipo e note
- Scegliere se renderlo visibile al cliente
- Eliminare un documento esistente

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/area-clienti/documenti/page.tsx` | Aggiunge sezione upload (solo staff) + pulsante elimina per riga |
| `app/area-clienti/documenti/actions.ts` | Nuovo file — server actions: upload, delete |
| `app/api/upload-documento/route.ts` | Nuovo file — API route per il salvataggio fisico del file in `public/uploads/` |

---

## Passi principali

1. **API route upload** (`POST /api/upload-documento`):
   - Legge il file dal `FormData`
   - Salva in `public/uploads/` con nome univoco (`Date.now() + '_' + filename`)
   - Restituisce `{ filename }` in JSON

2. **Server action `uploadDocumento`** (`actions.ts`):
   - Chiama l'API route per salvare il file
   - Inserisce la riga in `documenti_cliente`
   - Fa `revalidatePath('/area-clienti/documenti')`

3. **Server action `deleteDocumento`** (`actions.ts`):
   - Elimina la riga da DB
   - Elimina il file fisico da `public/uploads/`
   - Fa `revalidatePath('/area-clienti/documenti')`

4. **UI** (in `page.tsx`, visibile solo a staff):
   - Form in cima: select cliente, input titolo, select tipo, input note, checkbox visibile, file picker → bottone "Carica"
   - Nella tabella, colonna aggiuntiva con bottone "Elimina" per ogni riga

---

## Scelte tecniche

- Il salvataggio fisico usa `fs.writeFile` (Node.js) nella API route, non una libreria esterna
- Il nome file salvato è `{timestamp}_{nomeoriginale}` per evitare collisioni
- La lista clienti per la select viene caricata dal DB (`SELECT id, ragione_sociale, cognome, nome FROM clienti ORDER BY ragione_sociale`)
- Nessun limite di dimensione file lato codice (lasciato al limite Next.js di default 4 MB per body; può essere alzato in `next.config.ts` se necessario)
- Il `tipo` è un campo libero (input text), non una select fissa

---

## Note

- L'eliminazione rimuove anche il file fisico — azione irreversibile, da confermare lato UI con un `confirm()`
- Se il file non esiste più su disco, l'eliminazione DB avviene comunque senza errore
