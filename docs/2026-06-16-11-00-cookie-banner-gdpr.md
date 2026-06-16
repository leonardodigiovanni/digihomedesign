# Banner Cookie GDPR — Rifacimento

**Data**: 2026-06-16  
**Stato**: completato

## Obiettivo

Adeguare il banner cookie esistente (`components/cookie-banner.tsx`) ai requisiti GDPR e alle linee guida del Garante:
- Equilibrio visivo tra "Accetta tutto" e "Rifiuta tutto" (stesso stile)
- Pannello "Gestisci preferenze" con scelta granulare per categoria
- Nessun cookie opzionale impostato prima del consenso
- Link alla Privacy Policy

## File coinvolti

- `components/cookie-banner.tsx` — riscrittura completa

## Struttura banner (primo livello)

Banner fisso in basso, fondo nero `#1a1a1a`, bordo superiore oro:

- Testo descrittivo con link Privacy Policy
- 3 pulsanti affiancati, **stesso stile** (`btn-orange` per tutti e tre per equilibrio visivo):
  - **Accetta tutto** — imposta `cookie_consent=all`, `_digi_analytics=1`, `_digi_marketing=1`
  - **Rifiuta tutto** — imposta `cookie_consent=technical`, cancella gli altri
  - **Gestisci preferenze** — apre il pannello dettaglio (stesso evento custom già usato)

## Pannello preferenze (secondo livello)

Overlay modale sopra il banner. Tre categorie:

### Cookie Tecnici
- Toggle sempre ON, disabilitato (non modificabile)
- Descrizione: necessari al funzionamento (login, carrello, sessione)

### Cookie Analitici
- Messaggio: "Questo sito non utilizza attualmente cookie analitici di terze parti"
- Toggle disabilitato (grayed out, non cliccabile)

### Cookie di Profilazione e Marketing
- Messaggio: "Questo sito non utilizza attualmente cookie di profilazione o marketing"
- Toggle disabilitato (grayed out, non cliccabile)

Pulsanti in fondo al pannello:
- **Salva preferenze** — chiude pannello e applica (nel caso attuale = solo tecnici)
- **Accetta tutto** — accetta tutto e chiude

## Cookie salvati

| Cookie | Tipo | Valore | Note |
|--------|------|--------|------|
| `cookie_consent` | tecnico | `all` / `technical` / `custom` | durata 1 anno |
| `_digi_analytics` | analytics | `1` | solo se consenso |
| `_digi_marketing` | marketing | `1` | solo se consenso |

## Stato consenso

Il componente legge `cookie_consent` al mount. Se assente → mostra banner. Se presente → nascosto. Il link "Gestisci preferenze cookie" nel footer lo riapre via evento `open-cookie-banner` (invariato).

## Note tecniche

- Nessun cookie opzionale scritto prima di interazione utente
- Toggle analitici/marketing disabled ma visibili, con testo esplicativo
- Stile coerente col progetto: monospace, fondo scuro, oro `#c8960c`
