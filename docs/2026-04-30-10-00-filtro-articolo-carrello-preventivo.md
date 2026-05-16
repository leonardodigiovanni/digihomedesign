# Filtro articoli — Aggiungi articolo al carrello preventivo

**Stato**: completato  
**Data**: 2026-04-30

## Obiettivo

Nel componente `components/aggiungi-articolo-form.tsx` (usato nelle pagine catalogo brand per aggiungere articoli al carrello preventivo), la tendina articoli mostra tutti gli item in un'unica lista piatta senza filtri. Quando il numero di articoli è elevato, la lista diventa difficile da sfogliare.

L'obiettivo è aggiungere un filtro per **Produttore** prima della tendina articoli, così da ridurre il numero di opzioni visibili nella select.

## File coinvolti

- `components/aggiungi-articolo-form.tsx` — unico file da modificare

## Passi principali

1. Calcolare i produttori unici dalla prop `articoli` con `useMemo`.
2. Aggiungere stato `produttoreFiltro` (stringa, default `''` = tutti).
3. Aggiungere una `<select>` "Produttore" sopra la tendina articoli:
   - Opzione "— Tutti i produttori —" (valore `''`)
   - Una `<option>` per ogni produttore unico (ordinati A→Z)
   - Visibile solo se i produttori distinti sono ≥ 2
4. Filtrare `articoli` in base al `produttoreFiltro` selezionato prima di renderizzare la tendina articoli.
5. Quando cambia il filtro produttore, resettare `selectedId` al primo articolo del sottoinsieme filtrato.

## Scelte tecniche

- Nessun componente aggiuntivo, tutto inline nello stesso file.
- La select produttore viene mostrata solo se ci sono almeno 2 produttori distinti (altrimenti non ha senso).
- Stile coerente con gli altri input già presenti nel form.
