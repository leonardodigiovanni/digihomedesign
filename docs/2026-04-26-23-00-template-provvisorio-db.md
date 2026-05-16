# Template Preventivo Provvisorio — DB

**Data:** 2026-04-26  
**Stato:** completato

## Obiettivo

Spostare l'intestazione del documento "preventivo provvisorio" (carrello stampato) dal codice hardcoded al sistema di template DB già esistente (`preventivo_templates`), così l'admin può modificarla dall'interfaccia `/amministrazione/templates`.

## Scelte tecniche

- Nuovo `tipo = 'preventivo_provvisorio'` nella tabella `preventivo_templates`
- Il template memorizzato è **solo l'intestazione** (tutto ciò che precede le schede articolo). Le schede articolo, il blocco totale e il piè di pagina vengono sempre generati server-side.
- Placeholder supportati: `{{data}}`, `{{cliente_nome}}`
- Riutilizza `salvaDisegnoTemplate` (action esistente che salva per `tipo`) — nessuna nuova action necessaria
- Fallback in caso di template assente: usa l'HTML hardcoded come default

## File coinvolti

- `app/amministrazione/templates/page.tsx` — auto-insert default, carica e passa al client
- `app/amministrazione/templates/templates-client.tsx` — nuova sezione "Template Preventivo Provvisorio" con editor (modifica only, come disegno)
- `app/area-clienti/carrello-preventivo/stampa/page.tsx` — legge template dal DB, sostituisce placeholder, usa come header in `buildPages()`

## Modifiche effettive

- `headerFullHTML()` rimossa: sostituita da fetch DB + replace placeholder
- `buildPages()` ora accetta `headerHtml: string` già pronto
