# Modifica cliente su documento esistente

**Stato**: in pianificazione  
**Data**: 2026-05-31

---

## Obiettivo

Permettere a admin/dipendente di assegnare o cambiare il `cliente_id` di un documento già salvato, direttamente dalla tabella in `/clienti/documenti`.

---

## Approccio

Nella colonna "Cliente" della tabella, al posto del testo statico, compare una `<select>` con la lista clienti già preselezionata sul cliente corrente (o "— nessuno —"). Al cambio di valore la select chiama una server action `updateClienteDocumento(id, clienteId)` che aggiorna il DB e fa `revalidatePath`.

Nessun bottone salva separato: il salvataggio avviene `onChange` (UX inline, stessa convenzione usata altrove).

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/clienti/documenti/actions.ts` | Aggiunge `updateClienteDocumento(id, clienteId)` |
| `app/clienti/documenti/cliente-select.tsx` | Nuovo client component — `<select>` inline con onChange |
| `app/clienti/documenti/page.tsx` | Passa `clienti` alla `ClienteSelect` per ogni riga |
