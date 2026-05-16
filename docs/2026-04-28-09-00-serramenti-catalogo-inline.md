# Catalogo + Carrello inline nelle pagine serramenti

**Stato:** completato  
**Data:** 2026-04-28

## Obiettivo

Mostrare direttamente nelle pagine prodotto (es. `/serramenti/infissi-in-alluminio`) i cataloghi PDF con viewer e il form per aggiungere articoli al carrello preventivi, senza rimandare a `/brand/cataloghi`.

## Approccio

La pagina `infissi-in-alluminio/page.tsx` è già un Server Component. Si aggiunge una funzione `getCatalogoData(nomeCategoria)` che:
1. Cerca in `catalogo_categorie` la riga con `nome` corrispondente (es. `'Infissi in Alluminio'`)
2. Recupera le voci PDF da `catalogo_voci`
3. Recupera gli articoli da `listini` se `listino_categoria` è valorizzato

Si riusano i componenti già esistenti:
- `CatalogoWrapper` — griglia card + PDF viewer (react-pdf)
- `AggiungiArticolo` — form carrello preventivi

## File coinvolti

- `app/serramenti/infissi-in-alluminio/page.tsx` — aggiunta sezione catalogo in fondo alla pagina

## Note

- Se la categoria non esiste nel DB la sezione viene omessa silenziosamente
- Il nome categoria da cercare va passato come stringa hardcoded nella pagina
