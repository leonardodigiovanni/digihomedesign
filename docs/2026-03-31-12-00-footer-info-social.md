# Footer: info azienda + icone social

**Data**: 2026-03-31  
**Stato**: completato

## Obiettivo

Arricchire il footer con:
1. Una sezione a due colonne sopra al copyright.
2. **Colonna sinistra**: dati aziendali (ragione sociale, sede legale, P.IVA, email, PEC, telefono).
3. **Colonna destra**: 4 icone social cliccabili (WhatsApp, Telegram, Instagram, LinkedIn).
4. Copyright aggiornato a `© 2026 DIGI Home Design SRL — tutti i diritti riservati`.

## Scelte tecniche

- **Icone social**: SVG inline nel componente (lucide-react non ha WhatsApp/Telegram). Ogni icona è un `<a>` con `href` segnaposto, `target="_blank" rel="noopener"`, colore brand al hover.
- **Dati aziendali**: valori segnaposto facilmente sostituibili direttamente in `footer.tsx`.
- **Layout colonne**: `display: grid; grid-template-columns: 1fr 1fr` con un `gap`. Su schermi stretti (< 600px) si impila in colonna singola via media query inline.
- **Nessun nuovo file**: tutto in `components/footer.tsx`.

## File coinvolti

| File | Modifica |
|------|----------|
| `components/footer.tsx` | Aggiunta sezione info+social, copyright aggiornato |

## Dati segnaposto (da sostituire)

- Azienda: DIGI Home Design SRL
- Sede legale: Via Esempio 1, 00100 Roma (RM)
- P.IVA: 12345678901
- Email: info@digihomedesign.it
- PEC: digihomedesign@pec.it
- Telefono: +39 06 1234567
- Link social: `#` (da sostituire con URL reali)
