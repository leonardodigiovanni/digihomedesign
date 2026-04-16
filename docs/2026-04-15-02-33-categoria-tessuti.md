# Categoria Tessuti

**Data:** 2026-04-15 02:33
**Stato:** completato

## Obiettivo

Creare la prima categoria prodotto con sottopagine, usando URL semantici senza numeri.
Le pagine già esistenti (infissi, serramenti, ecc.) rimangono standalone per ora.

## Struttura URL

```
/tessuti/divani
/tessuti/tendaggi
```

## File coinvolti

| File | Azione |
|------|--------|
| `app/tessuti/divani/page.tsx` | nuovo — pagina Divani |
| `app/tessuti/tendaggi/page.tsx` | nuovo — pagina Tendaggi |
| `app/tessuti/page.tsx` | nuovo — indice categoria (opzionale, redirect o lista) |
| `lib/nav-config.ts` | aggiungere le nuove voci |

## Passi principali

1. Creare `app/tessuti/divani/page.tsx` — pagina prodotto con struttura analoga alle pagine SEO già presenti (`app/infissi/`, `app/serramenti/`, ecc.)
2. Creare `app/tessuti/tendaggi/page.tsx` — stessa struttura
3. Creare `app/tessuti/page.tsx` — indice categoria, lista le sottopagine o redirect a divani
4. Aggiungere le voci in `lib/nav-config.ts` come gruppo "Tessuti" con href `/tessuti/divani` e `/tessuti/tendaggi`

## Scelte tecniche

- Struttura identica alle pagine prodotto esistenti (server component, metadata SEO, stesso layout)
- Nessun numero nell'URL
- Le pagine standalone esistenti non vengono toccate

## Note

Aggiungere altre categorie in futuro seguirà lo stesso schema.
