# Campo descrizione su voci catalogo

**Data:** 2026-05-21  
**Stato:** proposta

## Obiettivo

Aggiungere un campo `descrizione` (testo lungo) a ogni voce (`catalogo_voci`), editabile dallo staff e visualizzabile in frontend.

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-lavoro/cataloghi/page.tsx` | ALTER TABLE + SELECT descrizione |
| `app/area-lavoro/cataloghi/actions.ts` | `addVoce` e `updateVoce` leggono `descrizione` da FormData |
| `app/area-lavoro/cataloghi/cataloghi-client.tsx` | Tipo `Voce`, form add/edit, visualizzazione in `VoceRow` |
| `app/brand/cataloghi/[id]/page.tsx` | Passare `descrizione` al componente pubblico (se necessario) |

## Schema DB

```sql
ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NOT NULL DEFAULT '';
```

Gestita con `.catch(() => {})` per idempotenza (colonna già esistente non lancia errore).

## Passi principali

1. `page.tsx`: aggiungere `ALTER TABLE` con catch + includere `descrizione` nella SELECT
2. `Voce` type: aggiungere `descrizione: string`
3. `addVoce` action: leggere `fd.get('descrizione')` e inserirlo nell'INSERT
4. `updateVoce` action: aggiornare UPDATE con `descrizione`
5. `NuovaVoceForm`: aggiungere `<textarea name="descrizione">` (opzionale)
6. `VoceEditForm`: aggiungere textarea pre-popolata con valore attuale
7. `VoceRow`: mostrare `descrizione` (collassabile o sempre visibile) se non vuota

## Note tecniche

- Tipo `TEXT` (no limite esplicito) per supportare testi lunghi come l'esempio fornito
- Il campo è opzionale: voci esistenti avranno stringa vuota, non si rompono
- L'uso del campo verrà definito dall'utente nella fase successiva
