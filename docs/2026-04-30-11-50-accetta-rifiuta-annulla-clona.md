# Accetta/Rifiuta cliente + Annulla staff + Clone su invio

**Stato**: completato
**Data**: 2026-04-30

---

## Nuovo stato: `annullato`

Aggiungere `annullato` all'ENUM di `preventivi.stato`.

---

## Logica "Invia al cliente" — clone

Quando il dipendente clicca "Invia al cliente" su un preventivo `bozza` o `richiesto`:

1. Il preventivo corrente → `stato = 'annullato'` (rimane visibile al cliente come "storico")
2. Viene creato un clone identico (cliente, articoli + tutti i campi, sconti, note, validità)
3. Il clone → `stato = 'inviato'`, nuovo `numero` (formato `{data}-{id}`), `data = oggi`
4. L'email parte sul clone

Il cliente nella lista preventivi vede entrambi: quello annullato (sua bozza originale) e quello inviato (offerta definitiva del dipendente). Può confrontarli.

---

## Bottoni cliente su preventivo `inviato`

Solo per cliente (non-staff), solo quando `stato === 'inviato'`:

- **"Accetta"** (verde) → `stato = 'accettato'` + notifica in `email_inbox` tipo `preventivo_accettato`
- **"Rifiuta"** (rosso) → `stato = 'rifiutato'` + notifica in `email_inbox` tipo `preventivo_rifiutato`

---

## Scaduto automatico

In `area-clienti/preventivi/[id]/page.tsx` (server, al caricamento pagina): se `stato === 'inviato'` e `data + validita_giorni < oggi` → eseguire UPDATE `stato = 'scaduto'` prima di rendere la pagina. Nessun cron.

---

## Bottone "Annulla" per staff

Visibile al dipendente su qualsiasi preventivo con stato diverso da `annullato` (può annullare anche `accettato`, `inviato`, ecc.).

- Stile: btn-red, testo "Annulla preventivo"
- Conferma con `confirm()`
- `stato = 'annullato'`

---

## Colori stato aggiornati

| Stato | Colore |
|-------|--------|
| `annullato` | `#718096` (grigio medio) |

---

## Nuove server actions

| Action | Descrizione |
|--------|-------------|
| `accettaPreventivo` | Cliente: stato → accettato, inserisce in email_inbox |
| `rifiutaPreventivo` | Cliente: stato → rifiutato, inserisce in email_inbox |
| `annullaPreventivo` | Staff: stato → annullato |
| `inviaAlCliente` | Modificata: annulla originale, clona, invia clone |

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | Modifica `inviaAlCliente` (clone), aggiunge `accettaPreventivo`, `rifiutaPreventivo`, `annullaPreventivo`; migrazione ENUM |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Bottoni Accetta/Rifiuta (cliente, inviato), bottone Annulla (staff), colore annullato |
| `app/area-clienti/preventivi/[id]/page.tsx` | Check scaduto automatico al caricamento |
| `app/area-lavoro/email/email-client.tsx` | Aggiunge tipi `preventivo_accettato`, `preventivo_rifiutato` |
