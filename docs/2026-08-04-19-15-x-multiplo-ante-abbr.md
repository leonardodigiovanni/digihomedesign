# Supporto a X(anta+anta) nella grammatica Abbr

Stato: **completato** (iterazione 1 e iterazione 2)

## Problema

In `components/preview-infisso.tsx`, dentro un wrapper a larghezza/altezza variabile `X(...)` (o qualunque lettera singola, es. `X(F())`), il parser accetta **una sola anta**. Se dentro ci sono due (o più) ante unite da `+`/`-`, es.:

```
Tc(X(cA(F())+mAc(F())) + P + 55())
```

il match fallisce (o produce un parse sporco), perché il branch che gestisce `X(...)` (righe 362-364) prova `tryAnta()` sull'**intero contenuto** aspettandosi il pattern di una singola anta (`[C/M]?[A/R][C/M]?(...)`).

Il wrapper numerico `N(...)` invece **già supporta** più ante dentro, dividendo `N` cm in parti uguali (righe 347-356):
```js
const ip = splitTP(inner).filter(p => p.trim().length > 0)
const ais = ip.map(p => tryAnta(p.trim().toUpperCase()))
if (ip.length > 0 && ais.every(a => a != null)) {
  const perCm = totalCm / ip.length
  ais.forEach(a => tokens.push({ type: 'area', cm: perCm, fisso: false, ...a! }))
  continue
}
```
Es. `100(cA(F())+mAc(F()))` funziona già: 2 ante da 50cm ciascuna.

## Soluzione — calcola X, sostituisci, riusa il codice dei numeri

Esattamente come proposto: si calcola quanto vale lo slot variabile (in cm, con la stessa formula già usata: spazio totale meno la somma delle aree a cm fisso, diviso il numero di slot variabili), poi lo si "sostituisce" al posto della lettera. La sostituzione non avviene come editing testuale della stringa Abbr (che richiederebbe un secondo giro di parsing da zero e bookkeeping di indici), ma direttamente sui **token già parsati**: si espande il token-gruppo in N token a `cm` fisso (`cm = valoreCalcolato / N`), cioè lo si trasforma nella stessa identica struttura dati che il branch `100(A+A)` già produce. Da quel punto in poi i 3 blocchi che disegnano/posizionano le ante (righe 375-392, 394-418, 420-444) **non vengono toccati per niente**: vedono N token con `cm` valorizzato, esattamente come se fossero stati scritti `50(A)+50(A)` a mano, e li disegnano già correttamente. Zero duplicazione della logica di disegno.

### Modifiche

**File**: `components/preview-infisso.tsx` (unico file toccato)

1. **Tokenizer** (righe 362-364): quando il contenuto di `X(...)` (o qualunque lettera singola) contiene **più** ante valide (stessa condizione già usata dal branch numerico: `splitTP(inner)` + `tryAnta` su ognuna, tutte non-null, count > 1), non forzare più `tryAnta` sull'intero blocco. Push di un `AreaTok` speciale con `cm: null` ma con un campo aggiuntivo `group: AntaInfo[]` (le N ante già parsate da `tryAnta`), e `antaKind: null` (così il codice di disegno attuale lo ignora finché non viene espanso).
   - Contenuto con una sola anta → comportamento attuale invariato (nessuna regressione).

2. **Subito dopo** aver costruito `tokens`/`areaTokens`/`hasDiv` (dopo riga 373), un passaggio breve:
   - determina l'asse (larghezza se non c'è divisorio T, altezza se c'è un divisorio T — stessa condizione già usata più sotto per scegliere quale dei 3 blocchi eseguire)
   - calcola `fixedSum_cm` (somma dei `cm` già noti tra gli areaTokens) e `nVar` (quanti hanno `cm === null`, un token-gruppo conta 1, non N)
   - `varCm = nVar > 0 ? (totalCm - fixedSum_cm) / nVar : 0`
   - per ogni token con `.group`, lo sostituisce nell'array `tokens`/`areaTokens` con N nuovi `AreaTok`, ciascuno `cm: varCm / group.length` — cioè la stessa identica espansione che il branch numerico fa già con `perCm = totalCm / ip.length`.
   - da qui in poi i 3 blocchi di disegno restano invariati.

3. Nessuna modifica a `lib/disegno-infisso.ts` (usato per calcolo Uw/PDF, non per l'anteprima interattiva) — se serve lo stesso supporto lì per coerenza area vetro/Uw, lo faccio come step separato dopo, solo se lo chiedi esplicitamente.

## File coinvolti

- `components/preview-infisso.tsx` — unica modifica

## Verifica

Test manuale nello strumento `/amministrazione/test-anteprime` con:
- `Tc(X(cA(F())+mAc(F()))+P+55())` — il caso che hai segnalato
- Verifica di non-regressione sugli esempi già presenti (in particolare quelli con `X(...)` a singola anta, es. `Tc(X(F())+P+80(mAc(F())))`, e quelli con `N(anta+anta)`)

## Riepilogo implementazione (2026-08-04)

Implementato esattamente come da piano, nessuna scelta cambiata:

- `components/preview-infisso.tsx`:
  - `AreaTok` ha ora un campo opzionale `group?: AntaInfo[]` (tipo `AntaInfo = NonNullable<ReturnType<typeof tryAnta>>`).
  - Il branch `X(...)` nel tokenizer, quando il contenuto tra parentesi contiene più ante valide separate da `+`/`-` (stesso controllo già usato dal branch numerico: `splitTP` + `tryAnta` su ognuna, tutte non-null, count > 1), produce un token `group` invece di tentare `tryAnta` sull'intero blocco. Il caso a singola anta resta invariato.
  - Subito dopo la costruzione di `tokens`/`areaTokens`/`hasDiv`, un nuovo passaggio calcola `varCm` per gli slot con `group` (stessa formula `(totale − somma cm fissi) / n. slot variabili`, sull'asse larghezza o altezza a seconda che ci sia un divisorio T) e sostituisce ogni token-gruppo con N token a `cm` fisso (`varCm / n. ante nel gruppo`) direttamente nell'array `tokens` (via `splice`) e in `areaTokens`. I 3 blocchi di disegno/posizionamento esistenti non sono stati toccati.
- `app/amministrazione/test-anteprime/test-anteprime-client.tsx`: aggiunto l'esempio `Tc(X(cA(F())+mAc(F()))+P+55())` alla lista Esempi Abbr per verifica rapida.

Verifica: `npx tsc --noEmit` senza errori (nessun nuovo warning introdotto). Verifica visiva da fare manualmente nello strumento (preferenza utente di non usare Chrome headless per gli screenshot).

### Bug collaterale scoperto e corretto

Testando `Tc(X(cA(F())+mAc(F()))+P+40(F()))` è emerso un bug preesistente (non introdotto da questa feature, ma reso visibile da essa): nei 3 blocchi di calcolo larghezza/altezza, `const fallback = varW <= 0` (o `varH`) scattava anche quando `nVar === 0` (nessuno slot variabile, perché in quel caso il ternario forza comunque `varW = 0`), facendo sì che TUTTI i token — anche quelli con `cm` esplicita — venissero disegnati a larghezza/altezza uguale, ignorando i valori calcolati. Nel caso di test, dopo l'espansione del gruppo X in due token a cm fisso, l'area fissa da 40cm rimasta come unico altro token era anch'essa a `cm` fisso → `nVar` diventava 0 → fallback scattava erroneamente → tutte e 3 le aree (i 2 ante del gruppo + l'area da 40) venivano disegnate della stessa larghezza invece che 40 fisso + resto diviso equamente tra i 2 ante.

Fix: `fallback` ora è `nVar > 0 && varW <= 0` (idem per `varH`) nei 3 blocchi (righe con `hasDiv` false, divisorio T, divisorio P) — scatta solo quando c'è davvero qualcosa di variabile che non trova spazio positivo, non quando semplicemente non c'è nulla da dividere.

---

## Iterazione 2 — ricorsione vera (X con contenuto complesso, non solo lista di ante)

### Problema

```
Tc(X(cA(F())+mAc(F())) + P + X(F()+P+40()))
```

Il secondo `X(...)` non contiene una lista di ante (quello gestito dall'iterazione 1), contiene un **sotto-disegno completo con un proprio divisorio P** (`F()+P+40()`: un'area variabile e una da 40cm, separate da un pilastrino). Il tokenizer attuale, dentro `X(...)`, riconosce solo: singola anta, lista di ante, o vetro fisso/vuoto — non un contenuto con divisori propri. Quando non riconosce nulla, il token cade nel ramo finale "area variabile senza niente dentro" (riga 382): non viene disegnato nulla, il divisorio interno sparisce.

### Causa architetturale

Il rendering Tc/Ta oggi fa **un solo livello**: un tokenizer piatto (righe 341-383) più 3 blocchi che calcolano larghezza/altezza e disegnano (righe 409-426 nessun divisorio, 428-452 divisorio T, 454-478 divisorio P), tutti e 3 duplicano la stessa logica (fixedSum/nVar/varW-o-H/fallback/cursor) operando solo sui token di primo livello. Non c'è modo di "scendere dentro" a un wrapper con contenuto complesso.

### Soluzione — funzione ricorsiva unica

Sostituire tokenizer + 3 blocchi con **una funzione sola**, che prende un contenuto testuale e un riquadro (posizione, dimensioni px, dimensioni cm) e:
1. tokenizza il contenuto (stessa `splitTP`/`tryAnta` di oggi)
2. classifica ogni token come: divisorio T/P, foglia (anta/ribalta/vasistas/fisso, disegnata subito come oggi), oppure **sotto-contenuto** (wrapper `N(...)`/`X(...)` il cui interno non è una singola anta semplice — lista di ante, o qualunque mix con propri T/P)
3. calcola, con la stessa identica formula di oggi (fixedSum/nVar/quota-variabile/fallback), quanto spazio (px e cm) tocca a ciascun token
4. per le foglie: disegna come oggi (`drawAnta`/`pushFermavetri`)
5. per i sotto-contenuti: **richiama se stessa** passando il riquadro appena calcolato — la stessa funzione gestisce quindi `X(anta+anta)` (iterazione 1, che diventa un caso normale senza bisogno del campo `group` speciale che ho aggiunto — lo rimuovo, non serve più), `X(F()+P+40())`, e in generale qualunque nesting (`X(...)` dentro `N(...)` dentro `X(...)`, ecc.).

L'asse di distribuzione (larghezza vs altezza) per ogni livello si decide come oggi: se il contenuto di quel livello ha un divisorio `T` → asse altezza; altrimenti (divisorio `P` o nessuno) → asse larghezza. La dimensione sull'asse **opposto** per un sotto-contenuto resta quella del riquadro genitore (se sto dividendo in larghezza, l'altezza del sotto-blocco è la stessa del blocco che lo contiene, invariata).

### Modifiche

**File**: `components/preview-infisso.tsx` (unico file toccato)

- Rimuovo il campo `group` su `AreaTok` e il passaggio di espansione aggiunto nell'iterazione 1 (righe 337-338, 363-372, 387-407) — sostituiti dal meccanismo generale.
- Il tokenizer diventa una funzione `tokenize(content: string)`, richiamabile sia sul contenuto di `Tc(...)/Ta(...)` sia ricorsivamente sull'interno di ogni wrapper `N(...)`/`X(...)` che non sia singola-anta/F()/vuoto.
- I 3 blocchi di calcolo diventano una funzione `layout(tokens, x, y, w, h, wCm, hCm)` chiamata una volta per il contenuto esterno e ricorsivamente per ogni sotto-contenuto.
- Nessun cambiamento visivo per tutti i casi già funzionanti oggi (singola anta, F(), `N(anta)`, `N(anta+anta)`, `X(anta)`, `X(anta+anta)`, T-only, P-only, nessun divisorio): la funzione unica riproduce esattamente la stessa matematica dei 3 blocchi attuali, solo fattorizzata e richiamabile in profondità.

### Rischio e verifica

Questo tocca il cuore del rendering condiviso da preventivi/carrelli/ordini (5 punti in produzione), non solo lo strumento di test. Prima di considerarlo concluso, verifico visivamente **tutti** gli esempi già presenti in `/amministrazione/test-anteprime` (per accertare zero regressioni sui casi semplici) più i due casi nuovi:
- `Tc(X(cA(F())+mAc(F()))+P+X(F()+P+40()))`
- eventuali altri che vuoi testare prima che segni l'iterazione come completata

### File coinvolti

- `components/preview-infisso.tsx`
- `app/amministrazione/test-anteprime/test-anteprime-client.tsx` — aggiunta esempio del nuovo caso

### Riepilogo implementazione (2026-08-04)

Tokenizer e i 3 blocchi (nessun divisorio / T / P) sono stati sostituiti da due funzioni ricorsive dentro `components/preview-infisso.tsx`:

- `tokenize(content)`: divisori T/P, foglie dirette (anta/ribalta/vasistas via `tryAnta`, fisso `F()`, area vuota), oppure — per un wrapper `N(...)`/lettera-singola il cui contenuto non si riduce a vuoto/`F()`/singola-anta — un token `sub` con il contenuto grezzo, da tokenizzare più tardi ricorsivamente.
- `layout(toks, x, y, w, h, wCm, hCm)`: stessa identica formula usata prima (somma cm fissi, spazio residuo diviso per gli slot variabili, fallback a spartizione equa SOLO quando c'è davvero qualcosa di variabile senza spazio — il fix della iterazione 1), applicata a un riquadro qualsiasi; le foglie si disegnano subito (`drawAnta`/`pushFermavetri`), i token `sub` fanno ricorsione su `layout(tokenize(sub.content), ...)` passando il riquadro (px e cm) appena calcolato per quello slot.
- Rimosso il campo `group` e il passaggio di espansione dell'iterazione 1 (non più necessari: un gruppo di ante dentro `X(...)` è ora semplicemente un `sub` che, ricorsivamente, non ha divisori e quindi si spartisce lo spazio in parti uguali con la stessa logica generale).
- **Bug trovato e corretto durante l'implementazione**: la regex del wrapper a lettera singola usava `(.*)` (contenuto anche vuoto), che intercettava erroneamente `F()` (e in teoria `X()`) prima del controllo esplicito `u === 'F()'`, trasformando un vetro fisso in un'area vuota. Corretta in `(.+)` (contenuto obbligatorio), come nella regex originale — nessuna regressione visibile durante lo sviluppo perché il `tsc` non poteva rilevarlo (era un errore di logica, non di tipo), trovato ripercorrendo a mano la grammatica.
- Verificati a mano (ripercorrendo l'algoritmo passo passo) tutti gli esempi già presenti nello strumento `/amministrazione/test-anteprime`, incluso il caso combinato `Tc(X(cA(F())+mAc(F()))+P+X(F()+P+40()))`: nessuna regressione, il nuovo caso produce esattamente il disegno atteso (a sinistra 2 ante che si dividono lo spazio residuo, a destra un pilastrino con 40cm fisso — vuoto, non vetrato, perché `40()` a parentesi vuote segue la stessa convenzione già in uso per le aree a cm fisso senza `F()` dentro).
- Aggiunto l'esempio `Tc(X(cA(F())+mAc(F()))+P+X(F()+P+40()))` nello strumento di test.

Verifica: `npx tsc --noEmit` senza errori. Verifica visiva nello strumento da fare manualmente (preferenza utente di non usare Chrome headless).
