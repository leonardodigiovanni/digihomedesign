# Filtri tabella documenti clienti

**Stato**: in pianificazione  
**Data**: 2026-05-31

---

## Obiettivo

Aggiungere una barra filtri sopra la tabella di `/clienti/documenti` per cercare documenti per cliente, tipo, titolo e visibilità.

---

## Approccio

Client component `DocumentiFiltri` con stato locale. Riceve tutti i documenti come prop e li filtra lato client (nessuna round-trip al server — la lista è già in pagina).

Filtri proposti:
| Filtro | Tipo controllo |
|---|---|
| Titolo | input text (ricerca parziale, case-insensitive) |
| Cliente | select con lista clienti presenti nei record |
| Tipo | select con valori distinti presenti nei record |
| Visibile al cliente | select: Tutti / Sì / No |

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/clienti/documenti/filtri.tsx` | Nuovo client component — contiene i 4 controlli + logica di filtro; renderizza la tabella filtrata |
| `app/clienti/documenti/page.tsx` | Passa `documenti` e `clienti` a `DocumentiFiltri` al posto di renderizzare la tabella direttamente |
