# Sezione Amministrazione "B2C" — Template email per comunicazioni ai clienti

Stato: **completato** (mirror di [[2026-07-09-08-01-sezione-b2b-templates]], via libera esplicita dell'utente: "dai fai b2c")

## Obiettivo

Stessa identica struttura della sezione B2B già esistente (editor template con Salva/Salva con nome/Elimina, elenco selezionabile a destra, bottone "Invia mail" con invio individuale per destinatario), ma per comunicazioni ai **clienti finali** (offerte, apertura showroom, ecc.) invece che a marchi/fornitori.

## Differenze rispetto a B2B

- Tabelle **separate e indipendenti**: `b2c_templates`, `b2c_clienti` — non collegate/derivate dalla tabella `clienti`/`users` esistente. L'admin inserisce i contatti a mano dal form, come in B2B.
- Colonna destra: "Clienti" invece di "Brand" (nome + email, stessi campi telefono/note).
- Nessun controllo sul consenso marketing per ora (esplicitamente rimandato da chiedere in futuro: "poi troverò la maniera di disabilitare il flag per chi non dà il consenso... per ora me ne frego").
- Nessun template di esempio pre-caricato (a differenza di B2B che parte con quello fornito) — l'utente non ne ha fornito uno per il B2C, la lista parte vuota e li crea lui dall'editor.

## File

- `lib/nav-config.ts` — nuova voce `adminPages`: `{ id: 67, label: 'B2C', href: '/amministrazione/b2c', roles: ['admin'] }`.
- `app/amministrazione/b2c/page.tsx`, `b2c-client.tsx`, `actions.ts` — stessa struttura di `app/amministrazione/b2b/*`, rinominata.
