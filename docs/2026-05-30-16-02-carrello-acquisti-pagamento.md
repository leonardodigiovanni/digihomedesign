# Pagina pagamento carrello acquisti

**Data:** 2026-05-30 16:02  
**Stato:** completato

## Obiettivo

Creare la pagina `/area-clienti/carrello-acquisti/pagamento` e aggiornare il bottone "Acquista" del carrello acquisti per portare lì invece di lanciare direttamente Stripe.

## Comportamento attuale

Il bottone "Acquista" (utente loggato, nessuna lacuna) chiama `handlePaga` → server action `creaCheckoutSession` → redirect diretto a Stripe.

## Comportamento nuovo

Il bottone "Acquista" naviga a `/area-clienti/carrello-acquisti/pagamento`.

## File coinvolti

1. **`app/area-clienti/carrello-acquisti/carrello-acquisti-client.tsx`**  
   - `onClick` del bottone Acquista (loggato): `router.push('/area-clienti/carrello-acquisti/pagamento')` invece di `handlePaga`
   - Rimuovere `payPending` / `startPay` se non più usati

2. **`app/area-clienti/carrello-acquisti/pagamento/page.tsx`** *(nuovo)*  
   - Server component, protetto da login (`redirect('/login')` se non loggato)
   - Legge il cookie `digi_cart_acquisti`, decomprime, carica i dati dal DB
   - Mostra riepilogo ordine: lista articoli con subtotali, totale
   - Bottone "Paga ora" → form action che chiama `creaCheckoutSession`

## Scelte tecniche

- La pagina è server component per sicurezza (niente dati sensibili lato client)
- Il riepilogo usa la stessa logica di calcolo prezzi già presente in `stampa/page.tsx`
- Il bottone "Paga ora" è un `<form action={creaCheckoutSession}>` (server action)
