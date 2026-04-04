# Bottoni con effetto shimmering spazzolato

**Data:** 2026-04-04 14:37  
**Stato:** completato

---

## Obiettivo

Sostituire gli stili attuali di tutti i bottoni con un effetto "metallo spazzolato" (brushed metal) con shimmer animato. Tre varianti cromatiche:

| Variante | Colore | Quando si usa |
|----------|--------|---------------|
| **Verde** | Verde metallico | Conferma, Salva, Login "Entra", Continua, Carica, Aggiungi, Nuovo |
| **Rosso** | Rosso metallico | Annulla, Logout, Elimina |
| **Grigio** | Grigio metallico | Stato disabilitato (`disabled` / `opacity` ridotta) |

---

## Tecnica CSS

### Effetto "brushed metal"
Sfondo con gradiente lineare stretto e ripetuto che simula le righe di spazzolatura:
```css
background: repeating-linear-gradient(
  90deg,
  color-stop-dark,
  color-stop-light,
  color-stop-dark
);
```

### Effetto shimmer
Pseudoelemento `::after` con gradiente bianco semitrasparente spostato via `@keyframes` da sinistra a destra:
```css
@keyframes btn-shimmer {
  0%   { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(300%) skewX(-15deg); }
}
```
L'animazione parte al caricamento (una sola passata) e poi si ripete ogni ~4 secondi.

---

## File coinvolti

### Nuovo
- `app/globals.css` — aggiunta classi `.btn-green`, `.btn-red`, `.btn-gray`

### Modificati (sostituzione stili)
| File | Bottoni interessati |
|------|---------------------|
| `components/login-form.tsx` | Entra |
| `components/header-auth.tsx` | Logout, Entra |
| `components/inactivity-guard.tsx` | Rimani connesso |
| `app/registrazione/registration-flow.tsx` | Continua, Verifica email, Completa registrazione |
| `app/settings/settings-form.tsx` | Salva (×4), Annulla (×4) |
| `app/anagrafica-clienti/client.tsx` | Salva, Annulla, Nuovo cliente, Elimina |
| `app/anagrafica-fornitori/client.tsx` | Salva, Annulla, Nuovo fornitore, Elimina |
| `app/magazzino/magazzino-client.tsx` | Salva, Annulla, Salva materiale, Annulla (modal), Aggiungi materiale, Elimina |
| `app/ordini-ricevuti/client.tsx` | Salva, Annulla, Aggiungi nota, Nuovo ordine, Elimina |
| `app/ordini-fornitori/client.tsx` | Salva, Annulla, Nuovo ordine, Elimina |
| `app/facsimili/facsimili-client.tsx` | Carica, Annulla, Carica facsimile, Elimina |
| `app/archivio/archivio-client.tsx` | Carica, Annulla, Carica documento, Elimina |
| `app/gestione-utenti/gestione-utenti-client.tsx` | Salva ruolo, Attiva/Disattiva |

### Non modificati (comportamento invariato)
- Bottoni di navigazione (navbar, hamburger, toggle sezioni) — stile link, nessun chrome visivo
- Bottoni di selezione mode in settings (RGB/Oro/Argento) — hanno già i loro stili tematici
- Bottoni chiudi modal (✕) — icona neutrale
- Dots del carousel — indicatori, non azioni
- Bottoni reinvia codice (link-style)

---

## Passi principali

1. Aggiungere in `globals.css` le tre classi CSS con effetto brushed + shimmer + stato `disabled`/`:disabled`.
2. Definire in ogni file un helper locale o costante per i padding/border-radius già in uso, applicando la classe al posto del background inline.
3. Gestire lo stato disabilitato: dove oggi si usa `opacity: 0.35 / 0.5`, passare alla classe `.btn-gray` o aggiungere l'attributo `disabled`.

---

## Scelte tecniche

- Le classi usano `!important` su `background`, `color`, `border` per avere la precedenza sugli stili inline residui.
- Gli stili inline sono stati ripuliti: rimangono solo `padding`, `fontSize`, `borderRadius`, `fontFamily`, `width`, `whiteSpace`.
- Lo shimmer usa `overflow: hidden` + `position: relative` sul bottone e pseudoelemento `::after` — non richiede JS.
- Animazione: `btn-shimmer` con opacity + translate, ciclo 4s (sweep visibile al 35–65% del ciclo, poi pausa).
- Stato disabilitato gestito con className dinamico: `btn-gray` quando `disabled/pending`, `btn-green/btn-red` quando attivo.
- Build Turbopack: "Compiled successfully". Errori TypeScript pre-esistenti in `app/email/page.tsx` e `inactivity-guard.tsx` righe 18-19 (non toccati da questa implementazione).

## File modificati effettivamente
- `app/globals.css` — aggiunto `@keyframes btn-shimmer` + 3 classi
- `components/login-form.tsx`
- `components/header-auth.tsx`
- `components/inactivity-guard.tsx`
- `app/registrazione/registration-flow.tsx`
- `app/settings/settings-form.tsx`
- `app/anagrafica-clienti/client.tsx`
- `app/anagrafica-fornitori/client.tsx`
- `app/magazzino/magazzino-client.tsx`
- `app/ordini-ricevuti/client.tsx`
- `app/ordini-fornitori/client.tsx`
- `app/facsimili/facsimili-client.tsx`
- `app/archivio/archivio-client.tsx`
- `app/gestione-utenti/gestione-utenti-client.tsx`
