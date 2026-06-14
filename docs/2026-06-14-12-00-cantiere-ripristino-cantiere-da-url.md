# Cantiere: ripristino cantiere selezionato dopo chiusura viewer

**Data:** 2026-06-14  
**Stato:** completato

## Problema

In `/app/cantiere`:
1. L'utente clicca un cantiere → `setSelectedCantiere(c)` (stato client-side)
2. L'utente clicca un task → `router.push('/area-clienti/cantieri/task/{id}')` → nuova route
3. L'utente chiude il viewer → `router.back()` → torna a `/app/cantiere`
4. Il componente si rimonta con `selectedCantiere = null` → torna alla lista cantieri invece che alla lista task

## Soluzione

Usare un URL search param `?cantiere={id}` come memoria dello stato selezionato:

- Quando si seleziona un cantiere → `router.replace(pathname + '?cantiere=' + c.id)` (silenzioso, non aggiunge storia)
- Quando si torna alla lista → `router.replace(pathname)` (rimuove il param)
- Al mount del componente → leggere `searchParams.get('cantiere')` e inizializzare `selectedCantiere` con il cantiere corrispondente

Così al `router.back()` dal viewer, l'URL è già `/app/cantiere?cantiere=123` e il componente si inizializza direttamente sulla lista task del cantiere giusto.

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-clienti/cantieri/cantieri-cliente-client.tsx` | Aggiungere `useSearchParams` + `usePathname`; inizializzare `selectedCantiere` dal param; aggiornare URL a `select`/`deselect` |

Un solo file da modificare.

## Passi principali

1. Aggiungere import `useSearchParams`, `usePathname` da `next/navigation`
2. Nel componente `CantieriClienteClient`:
   - Leggere `searchParams.get('cantiere')` e `pathname`
   - Inizializzare `useState` con lazy initializer: `cantieri.find(c => c.id === Number(param)) ?? null`
   - Al `setSelectedCantiere(c)`: aggiungere `router.replace(pathname + '?cantiere=' + c.id)`
   - Al `setSelectedCantiere(null)` (onBack): aggiungere `router.replace(pathname)`

## Scelte tecniche

- `router.replace` (non `push`) per non aggiungere voci extra alla storia del browser
- Il param è solo `cantiere={id}` — nessun altro stato viene serializzato nell'URL
- Non tocca il viewer né `apri-task-btn.tsx`
- Compatibile sia con `/app/cantiere` che con `/area-clienti/cantieri` (usa `usePathname`)
