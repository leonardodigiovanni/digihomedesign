# Sezione "Clienti" per dipendenti

**Data:** 2026-04-15
**Stato:** completato

---

## Obiettivo

Aggiungere una nuova sezione navbar "Clienti" visibile solo ai dipendenti (e admin), separata dall'"Area Clienti" che è per gli utenti finali.

---

## Pagine proposte

La sezione conterrà pagine operative per la gestione della clientela:

| ID  | Label                | URL                             |
|-----|----------------------|---------------------------------|
| 60  | Anagrafica Clienti   | `/clienti/anagrafica`           |
| 61  | Ordini Clienti       | `/clienti/ordini`               |
| 62  | Cantieri Clienti     | `/clienti/cantieri`             |
| 63  | Preventivi Clienti   | `/clienti/preventivi`           |
| 64  | Documenti Clienti    | `/clienti/documenti`            |
| 65  | Fatture Clienti      | `/clienti/fatture`              |

> **Domanda:** Quali pagine vuoi in questa sezione? Vuoi tutte quelle sopra, o solo alcune? Vuoi che alcune già esistano (come Anagrafica Clienti in Area Lavoro) vengano spostate qui, o aggiunte come alias?

---

## File coinvolti

- `lib/nav-config.ts` — nuova lista `clientiDipendentiPages` + funzione di visibilità (solo `role !== 'cliente'`)
- `components/navbar.tsx` — nuovo dropdown "Clienti" visibile solo a dipendenti/admin
- `app/clienti/*/page.tsx` — pagine da creare (o reindirizzare a quelle esistenti)
- `app/amministrazione/impostazioni/settings-form.tsx` + `actions.ts` — aggiungere il gruppo "Clienti" al pannello pagine visibili

---

## Note

- Le pagine in "Area Clienti" mostrano al cliente solo i propri dati; le pagine "Clienti" mostrano al dipendente tutti i clienti con filtri
- La visibilità sarà controllata dal flag `role !== 'cliente'`, non dalla matrice permessi (come admin/interni) — a meno che l'utente non voglia controllare per singola pagina
