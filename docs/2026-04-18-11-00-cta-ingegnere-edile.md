# CTA Ingegnere Edile — Ristrutturazioni

**Stato:** completato

## Obiettivo
Nella pagina `/ristrutturazioni-chiavi-in-mano`:
- Rimuovere la CTA "Calcola il tuo preventivo"
- Sostituirla con "Chiedi al nostro Ingegnere Edile" che apre un modal form
- Il form invia la richiesta con messaggio pre-impostato "Richiesta Ingegnere Edile"

## File coinvolti
- `components/contatto-ingegnere-form.tsx` — nuovo componente client (modal + form)
- `app/contatto-ingegnere-actions.ts` — nuova server action (salva in email_inbox tipo='ingegnere_edile')
- `app/ristrutturazioni-chiavi-in-mano/page.tsx` — sostituisce CTA preventivo col nuovo componente

## Campi form
- Nome *
- Email *
- Telefono
- Messaggio (pre-compilato "Richiesta Ingegnere Edile", modificabile)

## Pattern tecnico
Stessa architettura di `partner-form.tsx` + `partner-actions.ts`:
- `useActionState` per gestire stato invio
- Modal overlay con Escape/click-outside per chiudere
- Salvataggio in `email_inbox` con `tipo='ingegnere_edile'`
- Bottone trigger: `className="cta-btn-metal"`
