# Revisione testi: home page e brand/storia

**Data:** 2026-04-25
**Stato:** completato

## Obiettivo

Revisione editoriale completa della pagina `brand/storia` e ritocchi UI/testi sulla home page.

## File toccati

- `app/brand/storia/page.tsx` — riscrittura testo
- `app/page.tsx` — titolo h1, titolo articolo 3D, sezione consegne, testo vario
- `components/hero-carousel.tsx` — testo bottone toggle overlay

## Modifiche effettive

### brand/storia
- Ogni frase ora è un `<p>` separato in un `div` con `gap: 14` (a capo con rigo vuoto tra ogni frase)
- Biografia Francesco riscritta: "Da bambino, orfano…", consegna caffè, officina, autodidatta
- Paragrafo finale riordinato: prima "Per decenni…passaparola", poi "Con i suoi preziosi consigli…", poi "A lui dobbiamo tutto." e "Grazie, Papà." con cuore SVG rosso `#8c0808`

### home page
- H1 principale: 3 righe (infissi/soluzioni/ristrutturazioni)
- Aggiunto `h2` con `effetto-3d` prima dell'articolo: "Perché sceglierci. / Preventivi senza registrazione. / Il tuo Cantiere dal cellulare."
- Tutti i titoli di sezione `effetto-3d` uniformati a `fontSize: 20`
- Elenco consegne convertito da `<p>` con `<br />` a `<ul>` / `<li>`
- Rimosso virgolette attorno a "DIGI Home Design"

### hero-carousel
- Bottone toggle: `+`/`−` → `Scopri di più..` / `Chiudi` (pill orizzontale)
