# Dettaglio sconti nel riquadro totale preventivo

**Stato**: completato  
**Data**: 2026-06-01

---

## Obiettivo

Aggiungere trasparenza sugli sconti applicati nel riquadro del totale, sia nella pagina UI che nel PDF di stampa. Il cliente deve percepire il valore reale dello sconto ottenuto.

---

## Struttura proposta del riquadro totale

```
Listino (escluso IVA):        € 382,68    ← somma prezzo_pre_sconto di tutti gli articoli
Sconti promozionali:        − € 27,10    ← differenza lordo − netto articoli (solo se > 0)
─────────────────────────────────────────
Subtotale:                    € 355,58    ← già esistente (somma prezzo_totale)
Sconto riservato (X%):      − € 21,33    ← già esistente (sconto cliente)
─────────────────────────────────────────
Importo preventivo:           € 334,25    ← già esistente
```

- La riga "Listino" e "Sconti promozionali" appaiono **solo se** `lordo > subtotale` (cioè se ci sono sconti articolo)
- La riga "Sconto riservato" appare solo se `scontoCliPct > 0` (già così)
- Formato prezzi: `fmt()` con separatore migliaia e virgola decimale

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Riquadro totale UI |
| `app/area-clienti/preventivi/[id]/stampa/page.tsx` | Funzione `totaleNoteHtml` o equivalente nel PDF |
