# Sezione "Area Fornitori" per dipendenti

**Data:** 2026-04-15
**Stato:** completato

---

## Obiettivo

Creare un nuovo dropdown navbar "Area Fornitori" visibile solo a dipendenti/admin, spostando da "Area Lavoro":

| ID  | Label                | URL attuale                          |
|-----|----------------------|--------------------------------------|
| 23  | Cataloghi            | `/area-lavoro/cataloghi`             |
| 24  | Anagrafica Fornitori | `/area-lavoro/anagrafica-fornitori`  |
| 25  | Listini              | `/area-lavoro/listini`               |
| 26  | Ordini a Fornitori   | `/area-lavoro/ordini-fornitori`      |

Nessuna pagina nuova da creare — URL e file restano invariati.

---

## File coinvolti

- `lib/nav-config.ts` — nuova lista `fornitoriDipendentiPages`, rimozione dai `internalPages`, nuova `visibleFornitoriPages()`
- `components/navbar.tsx` — nuovo dropdown + voce mobile
- `app/amministrazione/impostazioni/settings-form.tsx` — aggiunta gruppo "Area Fornitori" alla matrice permessi
- `app/amministrazione/impostazioni/actions.ts` — `saveRolePermissions` include le nuove pagine
