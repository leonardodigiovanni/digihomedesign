# Sezione Amministrazione "B2B" — Template email per collaborazioni commerciali

Stato: **completato**

## Riepilogo modifiche effettive

- `lib/nav-config.ts`: voce "B2B" (id 66) in `adminPages`.
- `app/amministrazione/b2b/page.tsx`, `actions.ts`, `b2b-client.tsx` creati secondo il piano.
- Tabelle `b2b_templates` e `b2b_brand` (con `telefono`/`note` come deciso).
- Invio email individuale per destinatario tramite `lib/email.ts` (`sendEmail`), un'email separata per ciascun brand selezionato.
- `b2b_brand` parte vuota: i contatti reali vanno inseriti dall'admin dal form "+ Nuovo".

## Obiettivo

Nuova sezione in Amministrazione (solo ruolo `admin`), per gestire template di email da inviare a marchi/fornitori (richiesta apertura account rivenditore, richiesta programma rivenditori B2B, proposta produzione linee esclusive, ecc.) e una rubrica di contatti (marchio + email) selezionabili, con invio effettivo — un'email individuale e separata per ciascun destinatario selezionato, in modo che nessuno veda gli altri destinatari.

## Layout pagina

Due colonne:

**Colonna centrale — Editor template**
- Elenco template salvati (cliccabile: click su uno lo carica nell'editor)
- Editor: campo Oggetto (input) + campo Testo (textarea grande)
- Bottoni: **Nuovo** (svuota editor per crearne uno da zero) · **Salva** (aggiorna il template attualmente caricato) · **Salva con nome** (crea un nuovo template invece di sovrascrivere quello caricato) · **Elimina** (cancella il template caricato, con conferma)

**Colonna destra — Rubrica brand**
- Elenco marchi con checkbox + nome + email (+ telefono e note, opzionali)
- Bottoni: **Nuovo brand** (form nome+email) · **Modifica** · **Elimina** (con conferma)
- Parte vuota: inserirai tu i contatti reali via form (non ho le email reali dei 65 loghi in home)

**Barra azione (in basso, sempre visibile)**
- Bottone **"Invia mail"**, abilitato solo se: editor ha oggetto+testo non vuoti E almeno un brand è selezionato
- Al click: invio **server-side via Nodemailer** (stesso sistema già usato per gli OTP in `lib/email.ts`) — un'email individuale per ciascun brand selezionato, ognuna con `to:` il solo indirizzo di quel brand (nessun CC/BCC condiviso, nessuno vede gli altri destinatari). Stesso oggetto e stesso testo per tutti gli invii di quella "sessione".
- Dopo l'invio: messaggio di conferma con l'elenco degli indirizzi a cui è stata effettivamente inviata l'email (ed eventuali errori per singolo indirizzo, senza bloccare gli altri invii).

## Perché invio da server invece di mailto:

Con `mailto:` il browser apre un'unica bozza nel client di posta locale; per nascondere i destinatari tra loro dovresti usare tutti in CCN (Bcc), soluzione fragile (dipende dal client installato, spesso finisce in spam, un solo invio manuale). Con l'invio da server il sito manda automaticamente un'email separata e a sé stante per ciascun destinatario selezionato — comportamento corretto e affidabile per "ognuno riceve solo la propria mail".

## Fuori scope per ora (passo futuro)

Quando un brand risponde e si avvia una collaborazione, il collegamento con la tabella "Anagrafica Fornitori" (`area-lavoro/anagrafica-fornitori`) resta un passo successivo separato, da progettare a parte quando serve.

## File coinvolti

- `lib/nav-config.ts` — nuova voce in `adminPages`: `{ id: 66, label: 'B2B', href: '/amministrazione/b2b', roles: ['admin'] }`.
- `app/amministrazione/b2b/page.tsx` — server component: crea le tabelle se non esistono, inserisce il template di esempio se `b2b_templates` è vuota, carica template + brand, passa i dati al client.
- `app/amministrazione/b2b/b2b-client.tsx` — UI descritta sopra (editor template, rubrica brand, invio).
- `app/amministrazione/b2b/actions.ts` — server actions:
  - `creaTemplateB2B`, `aggiornaTemplateB2B`, `eliminaTemplateB2B`
  - `creaBrandB2B`, `aggiornaBrandB2B`, `eliminaBrandB2B`
  - `inviaEmailB2B(oggetto, testo, brandIds[])` — carica gli indirizzi dei brand selezionati, invia un'email individuale a ciascuno via `lib/email.ts`, ritorna esito per indirizzo.

## DB

```sql
CREATE TABLE IF NOT EXISTS b2b_templates (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  oggetto    VARCHAR(255) NOT NULL,
  testo      LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS b2b_brand (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(200) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  telefono   VARCHAR(50)  NULL,
  note       TEXT         NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

Template di esempio inserito automaticamente al primo avvio (se `b2b_templates` è vuota) — quello fornito come esempio:

- **Oggetto**: Richiesta di collaborazione commerciale e condizioni riservate alle imprese
- **Testo**: "…a disposizione per fornire qualsiasi ulteriore informazione sulla nostra azienda e sarei lieto di fissare un colloquio telefonico o un incontro conoscitivo qualora lo riteneste opportuno. Ringraziandovi anticipatamente per l'attenzione, porgo cordiali saluti.\n[NOME E COGNOME]\n[TITOLO]\n[NOME AZIENDA]\n[Telefono]\n[E-mail]\n[Sito web]"

I segnaposto tra `[ ]` sono il blocco firma di DIGI Home Design: restano testo libero da compilare a mano nell'editor prima di salvare/inviare (nessuna sostituzione automatica per destinatario, dato che l'unico dato per brand è nome+email, non un referente specifico).

Gli altri due template che hai in mente (richiesta programma rivenditori B2B; proposta produzione linee esclusive) li crei tu direttamente dall'editor una volta pronta la sezione — non serve seedarli via codice.

---
In attesa di conferma prima di scrivere codice.
