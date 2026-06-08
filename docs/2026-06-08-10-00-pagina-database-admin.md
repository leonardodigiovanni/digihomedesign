# Pagina Database — Amministrazione

**Data**: 2026-06-08  
**Stato**: completato

## Obiettivo

Creare una nuova pagina `/amministrazione/database` accessibile esclusivamente al ruolo `admin`. La pagina verrà aggiunta alla sezione Amministrazione nella navbar.

## File coinvolti

- `app/amministrazione/database/page.tsx` — nuova pagina (server component con guard ruolo)
- `lib/nav-config.ts` — aggiunta voce nell'array `adminPages`

## Passi principali

1. Aggiungere voce `{ id: 64, label: 'Database', href: '/amministrazione/database', roles: ['admin'] }` in `adminPages` in `lib/nav-config.ts`
2. Creare `app/amministrazione/database/page.tsx` con:
   - Guard ruolo: se `session_role !== 'admin'` → `redirect('/')`
   - Contenuto placeholder (da definire con l'utente)

## Funzionalità confermata

- Esecuzione query SQL manuali con visualizzazione risultati in tabella

## Note tecniche

- Pattern identico alle altre pagine admin: cookie check + redirect
- Nessun middleware, protezione inline nella page
