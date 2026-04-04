# Ruoli, pagine interne e matrice permessi

**Stato:** in pianificazione  
**Data:** 2026-04-01

---

## Obiettivo

Sistema completo di ruoli aziendali con permessi configurabili dall'admin:

1. **Nuovi ruoli**: ragioniere, commercialista, venditore, operaio, direttore, marketing (oltre ai già esistenti cliente, dipendente, admin)
2. **Nuove pagine interne** (staff): Anagrafica Clienti, Adempimenti, Cataloghi, Anagrafica Fornitori, Listini, Ordini, Worklist, Cantieri (staff), Pubblicità e Promozioni
3. **Nuove pagine personali** (clienti): I Miei Ordini, I Miei Cantieri
4. **Matrice permessi** in Settings: righe = ruolo, colonne = pagina interna; checkbox per abilitare/disabilitare
5. **Pannello cambio ruolo** in Gestione Utenti: lista utenti con dropdown per cambiare ruolo
6. **Nuovi utenti DB** con i nuovi ruoli (email e cellulare già verificati)

---

## Struttura pagine

### Pagine esistenti (invariate)
| ID | Label | Tipo |
|----|-------|------|
| 1 | Home | pubblica |
| 2–15 | Sito vetrina | pubblica |
| 16 | Magazzino | interna |
| 17 | Fatture | interna |
| 18 | Bilancio | interna |
| 19 | Settings | admin |
| 20 | Gestione Utenti | admin |

### Nuove pagine interne staff (IDs 21–29)
| ID | Label | Route |
|----|-------|-------|
| 21 | Anagrafica Clienti | /interno/21 |
| 22 | Adempimenti | /interno/22 |
| 23 | Cataloghi | /interno/23 |
| 24 | Anagrafica Fornitori | /interno/24 |
| 25 | Listini | /interno/25 |
| 26 | Ordini | /interno/26 |
| 27 | Worklist | /interno/27 |
| 28 | Cantieri (staff) | /interno/28 |
| 29 | Pubblicità e Promozioni | /interno/29 |

### Nuove pagine personali clienti (IDs 30–31)
| ID | Label | Route |
|----|-------|-------|
| 30 | I Miei Ordini | /interno/30 |
| 31 | I Miei Cantieri | /interno/31 |

Tutte le pagine 21–31 usano un'unica route dinamica `app/interno/[id]/page.tsx`.

---

## Permessi default (configurabili dall'admin)

| Ruolo | Pagine abilitate di default |
|-------|-----------------------------|
| admin | tutte |
| dipendente | 16, 17, 18 |
| ragioniere | 17, 21 |
| commercialista | 18, 22 |
| venditore | 23, 24, 25, 26 |
| operaio | 27 |
| direttore | 28 |
| marketing | 29 |
| cliente | 30, 31 |

---

## Architettura permessi

- `settings.json` aggiunge `rolePermissions: Record<string, number[]>` con i valori default sopra
- Funzione utility `lib/permissions.ts` → `hasPageAccess(role, pageId, settings): boolean`
  - admin: sempre true
  - altri: controlla `settings.rolePermissions[role]?.includes(pageId)`
- `app/interno/[id]/page.tsx` usa `hasPageAccess` per fare redirect se non autorizzato
- Il navbar filtra le pagine interne in base al ruolo + permessi (passati dal layout)
- Le pagine 16–18 esistenti vengono aggiornate a usare `hasPageAccess`

---

## File coinvolti

| File | Modifica |
|------|----------|
| `lib/nav-config.ts` | Aggiungere `internalPages` (21–31), `clientPersonalPages`, helper `visibleInternalPages(role, permissions)` |
| `lib/permissions.ts` | Nuovo file: `hasPageAccess()` |
| `lib/settings.ts` | Aggiungere `rolePermissions` al tipo e ai default |
| `data/settings.json` | Aggiungere `rolePermissions` con valori default |
| `app/interno/[id]/page.tsx` | Nuova route dinamica per le pagine 21–31 |
| `app/magazzino/page.tsx` | Aggiornare protezione con `hasPageAccess` |
| `app/fatture/page.tsx` | Aggiornare protezione con `hasPageAccess` |
| `app/bilancio/page.tsx` | Aggiornare protezione con `hasPageAccess` |
| `app/layout.tsx` | Passare `rolePermissions` al Navbar |
| `components/navbar.tsx` | Mostrare le pagine interne filtrate per ruolo+permessi |
| `app/settings/page.tsx` | Passare `rolePermissions` al form |
| `app/settings/settings-form.tsx` | Aggiungere pannello matrice permessi |
| `app/settings/actions.ts` | Aggiungere `saveRolePermissions` |
| `app/gestione-utenti/page.tsx` | Implementare lista utenti + pannello cambio ruolo |
| `app/gestione-utenti/actions.ts` | Nuovo file: `changeUserRole` |
| DB (SQL) | INSERT nuovi utenti con i nuovi ruoli |

---

## Nuovi utenti DB

| Username | Ruolo | Nome |
|----------|-------|------|
| mario.rossi | ragioniere | Mario Rossi |
| giulia.bianchi | commercialista | Giulia Bianchi |
| luca.verdi | venditore | Luca Verdi |
| andrea.neri | operaio | Andrea Neri |
| sofia.russo | direttore | Sofia Russo |
| marco.ferrari | marketing | Marco Ferrari |

Password: `Password123` — email e cellulare segnati come verificati.

---

## Stato al completamento

**Stato:** completato — 2026-04-01

### File creati
- `lib/permissions.ts` — `hasPageAccess()`, `ALL_ROLES`, tipo `Role`
- `app/interno/[id]/page.tsx` — route dinamica per pagine 21–31
- `app/gestione-utenti/actions.ts` — `changeUserRole` server action
- `app/gestione-utenti/gestione-utenti-client.tsx` — tabella utenti con cambio ruolo

### File modificati
- `lib/nav-config.ts` — aggiunto `internalPages`, `visibleInternalPages()`, rimossa duplicazione adminPages 16-18
- `lib/settings.ts` — aggiunto `rolePermissions` al tipo e ai default
- `data/settings.json` — aggiunto `rolePermissions` con valori default
- `app/settings/actions.ts` — aggiunto `saveRolePermissions`, import `ALL_ROLES` e `internalPages`
- `app/settings/page.tsx` — passa `rolePermissions` al form
- `app/settings/settings-form.tsx` — aggiunto pannello `RolePermissionsPanel` (matrice)
- `app/magazzino/page.tsx`, `app/fatture/page.tsx`, `app/bilancio/page.tsx` — protezione via `hasPageAccess`
- `app/layout.tsx` — passa `rolePermissions` al Navbar
- `components/navbar.tsx` — dropdown "Area Lavoro" con pagine filtrate per ruolo+permessi
- `app/gestione-utenti/page.tsx` — carica utenti dal DB e renderizza il client component

### DB
- 6 nuovi utenti inseriti: mario.rossi (ragioniere), giulia.bianchi (commercialista), luca.verdi (venditore), andrea.neri (operaio), sofia.russo (direttore), marco.ferrari (marketing)
