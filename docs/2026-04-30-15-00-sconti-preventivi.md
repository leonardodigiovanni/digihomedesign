# Sconti preventivi — sconto cliente + sconto articolo

**Stato**: completato
**Data**: 2026-04-30

---

## Obiettivo

Gestire due livelli di sconto sui preventivi:

1. **Sconto articolo** — percentuale di sconto su un singolo prodotto del listino (es. promozioni). Editabile dallo staff in gestione listini. Applicato al prezzo unitario dell'articolo prima di calcolare il totale riga.

2. **Sconto cliente** — percentuale di sconto globale associata all'anagrafica cliente. Editabile dallo staff in anagrafica clienti. Applicato al totale imponibile (dopo sconti articolo) prima dell'IVA.

Il **carrello preventivo** non applica nessuno sconto — rimane invariato.

---

## Regole di calcolo

```
prezzo_riga  = prezzo_base × (1 − sconto_articolo/100) × quantita [× dimensioni se m²/ml]
imponibile   = Σ prezzo_riga
imponibile_scontato = imponibile × (1 − sconto_cliente/100)
importo (in preventivi) = imponibile_scontato   ← IVA gestita altrove/manualmente
```

Lo sconto cliente al momento della generazione viene snapshotato sul preventivo (`sconto_cliente_pct`) in modo che modifiche future all'anagrafica non alterino preventivi già emessi.

---

## Modifiche DB (migration idempotente via ALTER TABLE ... ADD COLUMN IF NOT EXISTS)

| Tabella | Colonna | Tipo |
|---------|---------|------|
| `clienti` | `sconto_pct` | `DECIMAL(5,2) NOT NULL DEFAULT 0` |
| `listini` | `sconto_articolo` | `DECIMAL(5,2) NOT NULL DEFAULT 0` |
| `preventivi` | `sconto_cliente_pct` | `DECIMAL(5,2) NOT NULL DEFAULT 0` |
| `preventivo_articoli` | `sconto_articolo_pct` | `DECIMAL(5,2) NOT NULL DEFAULT 0` (snapshot al momento della generazione) |

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-lavoro/anagrafica-clienti/page.tsx` | Aggiungere campo `sconto_pct` (%) editabile inline dallo staff (stessa UI degli altri campi inline) |
| `app/area-lavoro/listini/listini-client.tsx` | Aggiungere colonna `Sconto %` editabile in `RigaEdit` e `NuovoArticoloForm` |
| `app/area-lavoro/listini/actions.ts` | Includere `sconto_articolo` in `addArticolo`, `updateArticolo`, migration |
| `app/clienti/preventivi/actions.ts` — `generaPreventivo` | Applicare `sconto_articolo` per riga + `sconto_cliente_pct` al totale; salvare snapshot sui record |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Mostrare sconto articolo per riga e riepilogo sconto cliente a fondo preventivo |
| `app/area-clienti/preventivi/[id]/stampa/page.tsx` | Mostrare sconto nel riepilogo finale (subtotale, − sconto X%, = importo) |

---

## Comportamento per ruolo

- **Staff** (admin/dipendente): può modificare `sconto_pct` del cliente e `sconto_articolo` del listino
- **Cliente loggato**: alla generazione del preventivo vede automaticamente applicato il suo sconto
- **Carrello preventivo**: nessuno sconto (è solo un draft prima della generazione)
