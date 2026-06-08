# Routing cataloghi per slug anziché ID numerico

**Data:** 2026-05-21  
**Stato:** proposta

## Obiettivo

Cambiare `/brand/cataloghi/8` → `/brand/cataloghi/infissi-in-pvc` usando uno slug generato dal nome della categoria.

## Strategia slug

Generazione lato JavaScript, nessuna colonna DB aggiuntiva:

```typescript
function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // rimuove accenti
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
// "Infissi in PVC" → "infissi-in-pvc"
// "Verande in Alluminio" → "verande-in-alluminio"
```

## File coinvolti

| File | Modifica |
|------|----------|
| `app/brand/cataloghi/[id]/` → `[slug]/` | Rinomina directory via shell |
| `app/brand/cataloghi/[slug]/page.tsx` | params `slug` invece di `id`; `getData(slug)` carica tutte le categorie e trova quella il cui `toSlug(nome) === slug` |
| `app/brand/cataloghi/page.tsx` | Link `href` usa `toSlug(c.nome)` invece di `c.id` |

## Note

- Nessuna modifica al DB
- Se due categorie generassero lo stesso slug (es. "PVC" e "pvc"), la prima trovata verrebbe servita — ma nella pratica non accade
- Link da `area-lavoro/cataloghi` non puntano al frontend pubblico quindi non serve aggiornare
- Redirect da vecchi URL `/brand/cataloghi/8` non implementato (gli ID non sono pubblici/indicizzati)
