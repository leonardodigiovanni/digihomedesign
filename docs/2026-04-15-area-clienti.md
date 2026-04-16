# Area Clienti — Sezione Nav + Pagine Role-Based

**Data:** 2026-04-15  
**Stato:** bozza — in attesa di conferma

---

## Obiettivo

Creare la sezione "Area Clienti" nella navbar con 5 voci:

| Voce        | URL                         | Pagina esistente collegata          |
|-------------|-----------------------------|-------------------------------------|
| Ordini      | `/area-clienti/ordini`      | dati da DB (tabella ordini)         |
| Cantieri    | `/area-clienti/cantieri`    | dati da DB (tabella cantieri)       |
| Preventivi  | `/area-clienti/preventivi`  | dati da DB (tabella preventivi)     |
| Documenti   | `/area-clienti/documenti`   | dati da DB (tabella documenti)      |
| Fatture     | `/area-clienti/fatture`     | dati da DB (tabella fatture)        |

---

## Logica di accesso e filtraggio

**Cliente** (`role = 'cliente'`):
- Vede solo i propri record, filtrati per `ID_CLIENTE` (letto da `session_user` → lookup in DB o direttamente da cookie se salvato)
- Visibile nella navbar

**Dipendente / Admin** (`role = 'dipendente'` o `'admin'`):
- Vede tutti i record senza filtro
- Visibile nella navbar

**Ospite (non loggato)**:
- Redirect a `/` o alla pagina di login

---

## File coinvolti

### Nav config
- `lib/nav-config.ts` — aggiungere nuovo array `areaClientiPages` o usare un `CategoryGroup` protetto

### Navbar
- `components/navbar.tsx` — aggiungere dropdown "Area Clienti" visibile solo a utenti loggati

### Nuove pagine (server components)
- `app/area-clienti/ordini/page.tsx`
- `app/area-clienti/cantieri/page.tsx`
- `app/area-clienti/preventivi/page.tsx`
- `app/area-clienti/documenti/page.tsx`
- `app/area-clienti/fatture/page.tsx`

Ogni pagina:
1. Legge `session_role` e `session_user` dai cookie
2. Se non loggato → `redirect('/')`
3. Se `cliente` → query con `WHERE id_cliente = ?` (recuperando l'ID dal DB tramite username)
4. Se `dipendente`/`admin` → query senza filtro
5. Mostra tabella dati

---

## Domande aperte

1. **Quali tabelle DB** contengono ordini, cantieri, preventivi, documenti, fatture? (nomi esatti delle tabelle e colonne chiave)
2. **Come ottenere ID_CLIENTE** del cliente loggato? Dal campo `username` nella tabella `users`, cercare il campo `id_cliente`?
3. Le pagine "esistenti" in `area-lavoro` (es. `/area-lavoro/fatture`, `/area-lavoro/cantieri`) devono restare separate o vanno unificate con le nuove?

---

## Passi principali

1. Aggiungere `areaClientiPages` in `nav-config.ts`
2. Aggiungere dropdown "Area Clienti" in `navbar.tsx` (visibile solo a loggati)
3. Creare le 5 pagine con logica role-based e query DB
4. Test con ruolo `cliente`, `dipendente` e ospite
