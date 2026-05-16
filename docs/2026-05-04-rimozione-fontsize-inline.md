# Rimozione inline fontSize

**Data:** 2026-05-04  
**Stato:** in attesa di conferma

---

## Obiettivo

Rimuovere le dichiarazioni `fontSize` inline dagli stili React (proprietà `style={{ fontSize: ... }}`) e sostituirle con classi CSS in `globals.css`.

---

## Analisi della portata

La ricerca nel codice ha trovato **oltre 2.000 occorrenze** di `fontSize` inline distribuite in circa **200 file**.

### Categoria A — Componenti strutturali (frame del sito)
File visibili su ogni pagina:

| File | Occorrenze |
|------|-----------|
| `components/navbar.tsx` | 6 |
| `components/header.tsx` | 1 |
| `components/footer.tsx` | 3 |
| `components/sitemap-section.tsx` | 3 |
| `app/layout.tsx` | 1 |

### Categoria B — Pagine prodotto/vetrina (pattern ripetitivo)
Decine di pagine come `app/serramenti/*/page.tsx`, `app/metallurgia/*/page.tsx`, ecc.  
Ciascuna ha ~8 occorrenze con pattern identici (es. `fontSize: 28` per il titolo, `fontSize: 14` per il testo).

### Categoria C — Pannelli admin e area lavoro
Molte occorrenze in tabelle e form. Ogni valore è contestuale al componente.

---

## Approccio proposto

Creare classi di utilità in `globals.css` per le dimensioni ricorrenti:

```css
.fs-11 { font-size: 11px; }
.fs-12 { font-size: 12px; }
.fs-13 { font-size: 13px; }
.fs-14 { font-size: 14px; }
.fs-15 { font-size: 15px; }
.fs-16 { font-size: 16px; }
.fs-18 { font-size: 18px; }
.fs-22 { font-size: 22px; }
.fs-24 { font-size: 24px; }
.fs-28 { font-size: 28px; }
```

Poi sostituire i `fontSize` inline con queste classi file per file.

---

## Opzioni di scope

**Opzione 1 — Solo Categoria A (frame del sito)**  
Tocca 5 file, ~14 occorrenze. Veloce e chirurgico.

**Opzione 2 — Categoria A + Categoria B (vetrina + frame)**  
Tocca ~120 file di pagine prodotto + i 5 del frame.

**Opzione 3 — Tutto il codebase**  
Tocca tutti i ~200 file, >2.000 occorrenze.

---

## Conferma richiesta

Quale scope preferisci? (1 / 2 / 3)
