# Carrello Preventivo — Gerarchia padre/figlio + modifica inline

**Data:** 2026-05-01  
**Stato:** completato

---

## Obiettivo

Aggiungere al carrello preventivo (`/area-clienti/carrello-preventivo`) una struttura ad albero padre/figlio con la possibilità di modificare gli articoli esistenti e aggiungere figli (caratteristiche).

---

## Funzionalità richieste

### Per ogni riga

- **Matita (✏)** → apre modal di modifica dell'articolo (quantita, ante, larghezza, altezza, colore, note)
- **+ (plus)** → aggiunge una caratteristica figlio a quell'articolo (riga testuale indentata)

### Bottoni globali (sotto o sopra la tabella)

1. **Aggiungi articolo** → link a `/brand/cataloghi` per scegliere dal catalogo
2. **Aggiungi articolo del tipo precedente** → duplica l'ultimo articolo (stesso `listino_id`) aprendo un mini-form per modificare dimensioni/qtà prima di aggiungere
3. **Aggiungi caratteristica dell'ultimo articolo** → aggiunge una riga figlia testuale all'ultimo articolo nella lista

### Display griglia

- Articoli padre: riga normale con numero progressivo
- Caratteristiche figlio: riga indentata (paddingLeft) con sfondo leggermente diverso, senza prezzo
- L'ordine nella tabella segue la gerarchia: padre → suoi figli → prossimo padre

---

## Struttura dati CartItem (estesa)

```typescript
type CartItem = {
  id: number         // listino_id; 0 per caratteristiche testuali
  q: number
  ante?: number
  l?: number
  h?: number
  colore?: string
  note?: string
  uid: number        // ID univoco nell'array (per riferimenti padre-figlio)
  parent?: number    // uid del padre (se figlio)
  tipo?: 'articolo' | 'caratteristica'
  desc?: string      // testo libero per le caratteristiche
}
```

Il `uid` viene assegnato automaticamente all'aggiunta. Per compatibilità con cookie esistenti (senza `uid`), si normalizza all'avvio: `uid = indice posizione`.

---

## File coinvolti

| File | Modifica |
|------|---------|
| `app/brand/cataloghi/actions.ts` | Aggiunge `uid`/`parent`/`tipo`/`desc` al tipo, normalizeCart helper, nuove actions: `aggiornaArticoloCarrello`, `aggiungiCaratteristicaAlCarrello`, `duplicaUltimoArticoloCarrello` |
| `app/area-clienti/carrello-preventivo/carrello-client.tsx` | Tipo esteso, rendering ad albero, modali edit/add-child, tre bottoni globali |
| `app/area-clienti/carrello-preventivo/page.tsx` | Passa `uid`/`parent`/`tipo`/`desc` nel mapping `getArticoliDaCookie` |

---

## Note tecniche

- Le caratteristiche (`tipo='caratteristica'`) NON hanno listino_id → non vengono incluse nel totale e nella richiesta DB
- `salvaCarrelloComePreventivo` skippa le caratteristiche (o le salva come note dell'articolo padre)
- Se si rimuove un articolo padre, i suoi figli diventano orfani → vengono mostrati a livello root (nessuna rimozione a cascata per semplicità)

---

## Scelte tecniche

- Modal overlay inline (no libreria esterna) con stile coerente con il resto del sito
- Bottoni in stile esistente (metallo spazzolato verde/nero/grigio)
