# Filtri a cascata cataloghi — area-lavoro

**Data:** 2026-06-28  
**Stato:** completato

---

## Obiettivo

Aggiungere filtri a cascata all'interno di ogni categoria nell'accordion di `area-lavoro/cataloghi`.  
Quando si apre una categoria, appare una barra filtri che restringe le voci mostrate in base ai campi di classificazione (sottocategoria, fase, materiale, tipologia, ambiente, fascia) e ai filtri modello (filtro_1–4).

---

## Comportamento

1. La categoria si apre → vengono mostrate tutte le voci
2. Si seleziona Sottocategoria → restano solo le voci con quella sottocategoria; le opzioni di Fase si aggiornano di conseguenza
3. Si seleziona Fase → si restringe ulteriormente; e così via per Materiale, Tipologia, Ambiente, Fascia
4. I chip filtro_1–4 (1 anta / 2 ante / 3+ ante / Sopraluce) si aggiungono in AND
5. Bottone ✕ resetta tutti i filtri
6. La barra filtri compare solo se almeno una voce della categoria ha dati di classificazione

---

## File coinvolti

| File | Operazione |
|------|-----------|
| `app/area-lavoro/cataloghi/cataloghi-client.tsx` | Aggiungere stato filtri + cascade + filter bar in `CategoriaAccordion` |

---

## Scelte tecniche

- Cascade a 6 livelli: sottocategoria → fase → materiale → tipologia → ambiente → fascia
- Filtri modello in AND (tutti i chip attivi devono matchare)
- Reset dipendenti su cambio filtro genitore
- `showFiltriBar` evita di mostrare la barra se nessuna voce ha classificazione
