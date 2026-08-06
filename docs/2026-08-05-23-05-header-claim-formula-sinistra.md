# Header: claim "Fai bene i tuoi conti" a sinistra + formula spostata accanto

Stato: **completato**

## Riepilogo implementazione

- `components/header.tsx`: nuovo blocco `.header-left-formula` (absolute, `left:16`, `top:50%`, `translateY(-50%)`) con il testo oro (`#e0b030`) e, subito accanto, il blocchetto formula spostato via da `.header-logos` (che ora contiene solo il logo).
- `app/globals.css`: regola `@media (max-width: 900px) { .header-left-formula { display: none } }` — sotto i 900px il blocco sparisce per non sovrapporsi a logo/HeaderAuth nello spazio ristretto.
- Type-check (`tsc --noEmit`) pulito, nessun altro file toccato.
- Aggiornamento testo (2026-08-05): claim cambiato da "Fai bene i tuoi conti, usa la formula giusta!" a **"Fatti bene i conti..."** su richiesta esplicita dell'utente.
- Layout iterazione 3 e 4 (2026-08-05): richiesto di riallineare claim e formula sulla stessa verticale, poi ridisegnato l'header su due righe:
  - riga superiore: grid 3 colonne (`1fr auto 1fr`) — logo a sinistra, formula ("somma") centrata, `HeaderAuth` a destra;
  - riga inferiore: claim finale **"Lavori a casa? Fai bene i tuoi conti ... usa la formula giusta!"** a tutta larghezza, centrato, in oro.
  - Header non più ad altezza fissa 90px ma auto (flex column), verificato che nessun altro file dipenda da quell'altezza fissa.
  - CSS: rimosse le classi ormai inutilizzate `.header-logos` / `.header-left-formula`; aggiunta `.header-formula-center` con `display:none` sotto i 480px per non stringere troppo logo+auth.
  - Type-check pulito ad ogni iterazione.
- Iterazione 5 (2026-08-05): fontSize di formula e claim convertiti da px fissi a `clamp(min, Xvw, max)`, così scalano leggermente con la larghezza pagina invece di restare fissi:
  - righe formula (Serramenti/Sicurezza/Ristrutturazioni): `clamp(10px, 1vw, 13px)`
  - riga "DIGI Home Design": `clamp(13px, 1.3vw, 17px)`
  - claim in basso: `clamp(11px, 1.1vw, 14px)`
- Iterazione 6 (2026-08-05): righe formula riscritte da `flex justify-content:space-between` (addendo a sinistra, segno spinto tutto a destra) a testo semplice centrato (`textAlign:center` sul contenitore, ogni riga `"Addendo +"` con un solo spazio prima del segno) — così addendi e risultato ("DIGI Home Design") condividono lo stesso centro orizzontale.
- Iterazione 7 (2026-08-05): claim oro spostato sopra la riga logo/formula/accedi invece che sotto (ordine JSX invertito, nessun altro cambio di stile).
- Iterazione 8 (2026-08-05): testo claim cambiato in "Lavori a casa? Fai bene i conti con la formula giusta!".
- Iterazione 9 (2026-08-05): testo claim cambiato in "Lavori a casa? Fai i conti giusti con una formula unica!".
- Iterazione 10 (2026-08-05): rimossa la freccetta ▾ dal bottone "Accedi" in `components/header-auth.tsx` (resta solo su "Chiudi ▴" quando il dropdown è aperto, non richiesto togliere anche quella).
- Iterazione 11 (2026-08-05): claim spezzato in due `<span whiteSpace:nowrap>` — "Lavori a casa?" e "Fai i conti giusti con una formula unica!" — separati da uno spazio normale, così se il testo è costretto ad andare a capo lo fa esattamente in quel punto (mai a metà di uno dei due pezzi).
- Iterazione 12 (2026-08-05): aggiunta una linea `borderBottom: 2px solid #e2e2e2` (silver piatto, stesso tono di `.class_silver_*`) sotto il claim. Il wrapper del testo è `display:inline-block` dentro il contenitore `textAlign:center`, quindi si restringe alla larghezza della riga più larga e la linea risulta larga esattamente quanto quella riga, centrata.
- Iterazione 13 (2026-08-05): padding laterale `0 6px` aggiunto al wrapper (prima solo `paddingBottom`, la linea toccava i bordi del testo) e colore linea cambiato da silver `#e2e2e2` a grigio `#999` — stesso grigio usato per gli addendi della formula (Serramenti/Sicurezza/Ristrutturazioni).
- Iterazione 14 (2026-08-05): la linea non segue più la larghezza del testo (`inline-block`) ma quasi tutta la larghezza della pagina: `borderBottom` spostato sul div esterno, con `margin: '0 -4px'` che compensa il padding orizzontale 16px dell'header per ottenere ~12px di distanza dai bordi reali della pagina. Il testo resta centrato dentro (via `textAlign:center` + `inline-block` interno).
- Iterazione 15 (2026-08-05): spessore linea ridotto da 2px a 1px.
- Iterazione 16 (2026-08-05): primo rigo claim cambiato da "Lavori a casa?" a "Lavori di casa" (senza punto interrogativo).
- Iterazione 17 (2026-08-05): ripristinato il punto interrogativo — "Lavori di casa?".

## Obiettivo

Nella fascia sinistra dell'header (attualmente vuota, a sinistra del blocco logo+formula centrato), aggiungere il testo:

> **Fai bene i tuoi conti, usa la formula giusta!**

in colore oro (stessa palette gold usata altrove, es. `#c8960c` / colori `class_gold_*`).

Subito accanto a questo testo va spostata la "formula" (l'addizione Serramenti + Sicurezza + Ristrutturazioni = DIGI Home Design) che oggi si trova accanto al logo, dentro `.header-logos`.

## Situazione attuale (`components/header.tsx`)

`.header-logos` è un div assoluto centrato (`left: 50%; transform: translateX(-50%)`) che contiene, affiancati:
1. il logo (`Image DIGIHOMEDESIGN.webp`)
2. il blocchetto formula (Serramenti+ / Sicurezza+ / Ristrutturazioni= / riga totale "DIGI Home Design")

A destra, assoluto, c'è `HeaderAuth`.

## Modifica proposta

- Rimuovere il blocchetto formula da dentro `.header-logos` (il logo resta da solo, centrato).
- Aggiungere a sinistra dell'header un nuovo blocco, non assoluto ma ancorato al bordo sinistro (`position: absolute; left: 8/16px; top: 50%; translateY(-50%)`, simmetrico a come `HeaderAuth` è ancorato a destra), contenente:
  - il testo "Fai bene i tuoi conti, usa la formula giusta!" in oro, andato a capo se serve (font-size contenuto per stare nei 90px di altezza header)
  - accanto, il blocchetto formula spostato qui (stesso markup/stile che ha oggi)
- Su schermi stretti (mobile, dove oggi `.header-logos` si sposta con `left:0; right:170px`) questo nuovo blocco sinistro andrà nascosto o adattato per non sovrapporsi al logo — da verificare in fase di implementazione, presumibilmente `display: none` sotto una soglia (es. `768px` o `480px`, coerente con i breakpoint già presenti in `globals.css`).

## File coinvolti

- `components/header.tsx` — markup/stile del nuovo blocco sinistro, rimozione formula da `.header-logos`
- `app/globals.css` — eventuale nuova classe per il blocco sinistro + regola responsive per nasconderlo/adattarlo sotto una certa larghezza

## Note

- Nessuna scelta tecnica particolare da segnalare oltre al breakpoint di occultamento su mobile, da confermare/aggiustare a vista una volta implementato.
