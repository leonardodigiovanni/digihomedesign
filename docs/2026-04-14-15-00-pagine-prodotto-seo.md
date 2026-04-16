# Pagine prodotto SEO

**Data:** 2026-04-14  
**Stato:** completato

## Obiettivo

Creare 7 nuove pagine di prodotto con URL puliti per il posizionamento SEO locale a Palermo. Ogni keyword in grassetto nel blocco SEO della home diventa un link `<Link>` verso la pagina corrispondente.

## Pagine da creare

| Keyword (display) | aria-label | URL |
|---|---|---|
| infissi | infissi-a-palermo | `/infissi` |
| serramenti | serramenti-a-palermo | `/serramenti` |
| verande | verande-a-palermo | `/verande` |
| porte corazzate | porte-corazzate-a-palermo | `/porte-corazzate` |
| persiane in alluminio | persiane-in-alluminio-a-palermo | `/persiane-in-alluminio` |
| ristrutturazioni chiavi in mano | ristrutturazioni-chiavi-in-mano-a-palermo | `/ristrutturazioni-chiavi-in-mano` |
| strutture metalliche | strutture-metalliche-a-palermo | `/strutture-metalliche` |

## File coinvolti

- `app/infissi/page.tsx` (nuovo)
- `app/serramenti/page.tsx` (nuovo)
- `app/verande/page.tsx` (nuovo)
- `app/porte-corazzate/page.tsx` (nuovo)
- `app/persiane-in-alluminio/page.tsx` (nuovo)
- `app/ristrutturazioni-chiavi-in-mano/page.tsx` (nuovo)
- `app/strutture-metalliche/page.tsx` (nuovo)
- `app/page.tsx` — aggiornare il blocco SEO con i `<Link>`

## Struttura di ogni pagina

Ogni pagina sarà un server component con:
- `metadata` (title, description, canonical)
- `<h1>` con il nome del prodotto + "a Palermo"
- Testo descrittivo di 2–3 paragrafi ottimizzato SEO
- Link di ritorno alla home

## Note tecniche

- URL lowercase con trattini (slug SEO-friendly)
- Nessuna protezione di ruolo (pagine pubbliche come le client pages 2–15)
- Inline styles coerenti con il resto del progetto
