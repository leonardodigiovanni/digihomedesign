# Supporto a X(anta+anta) nella grammatica Abbr

Stato: **completato** (iterazione 1, 2 e 3)

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

---

## Iterazione 3 — bug reale trovato con test manuale + unificazione con la stampa PDF

### Bug trovato testando `Tc(X(cA()+aC())+P+50())`

L'utente ha segnalato che aggiungendo una seconda anta dentro `X(...)` (es. `X(cA()+aC())`), il disegno restava identico al caso con una sola anta: la prima prendeva il 100% dello spazio, la seconda spariva.

Causa reale (confermata con `node -e` sulla regex e non solo a mente): `tryAnta` usa `/^([CM]?)([AR])([CM]?)\((.*)\)$/` — il gruppo `(.*)` non bilancia le parentesi. Applicato al contenuto **non ancora diviso** `"CA()+AC()"` (l'intero interno di `X(...)`, prima dello split su `+`), la regex matcha comunque, interpretando l'intera stringa come una singola anta con `innerContent` spazzatura (`)+AC(`), ingoiando la seconda anta. Il controllo introdotto in iterazione 2 (`const single = tryAnta(inner)`, tentato PRIMA di instradare al ramo ricorsivo `sub`) veniva quindi eseguito sul contenuto sbagliato.

**Fix**: il tentativo "è una singola anta?" ora scatta solo se `splitTP(inner).length === 1` (nessun `+`/`-` di primo livello nel contenuto) — altrimenti va diretto al ramo `sub` (ricorsivo), che già splittava correttamente. Verificato con `splitTP('CA()+AC()')` → `['CA()','AC()']`, due pezzi distinti.

### Unificazione con la stampa PDF preventivi

L'utente ha fatto notare che la stampa PDF dei preventivi disegna gli infissi da Abbr con una logica **completamente separata** da `preview-infisso.tsx`. Verifica (via subagent di ricerca): esistevano **tre implementazioni indipendenti**, nessuna condivisa:

1. `components/preview-infisso.tsx` (anteprima schermo)
2. `disegnoSVGAbbr`/`disegnoTcTa`, reimplementate da zero e **duplicate** (già divergenti tra loro) in `app/area-clienti/preventivi/[id]/stampa/page.tsx` e `app/area-clienti/carrello-preventivo/stampa/page.tsx` (stampa PDF, generata client-side con `html2canvas`/`jsPDF`, non server-side)
3. `computeGlassGeometry` in `lib/disegno-infisso.ts` (solo calcolo area/Uw, non disegna — grammatica più limitata, non gestisce sotto-divisori annidati dentro un'anta)

Le funzioni `tcTaSvg`/`tcTaDataUri` in `lib/disegno-infisso.ts`, che sembravano pensate per il PDF, sono risultate codice morto (mai chiamate). Le due copie PDF avevano **esattamente gli stessi due bug** appena descritti (regex non bilanciata, fallback su `nVar===0`).

**Decisione presa con l'utente**: unificare **solo** la logica di parsing+layout (non la paginazione PDF, non `html2canvas`/`jsPDF`, non il calcolo Uw, non altro).

**Soluzione**: nuovo modulo condiviso `lib/abbr-layout.ts`, framework-agnostico (nessun JSX, nessuna stringa SVG):
- `tokenize(content)` — identica logica di `preview-infisso.tsx` (con il fix di questa iterazione), esportata.
- `layoutAbbr(toks, box, pxDiv, sink)` — stessa geometria ricorsiva; invece di disegnare direttamente, chiama `sink.leaf(tok, x, y, w, h)` per ogni foglia e `sink.divider(kind, x, y, w, h)` per ogni divisorio T/P. Il chiamante decide come tradurli (JSX per lo schermo, stringa SVG per il PDF) riusando le proprie funzioni di disegno esistenti (`pushFermavetri`/`drawAnta`), che non sono state toccate.

**File modificati**:
- `lib/abbr-layout.ts` — nuovo modulo condiviso.
- `components/preview-infisso.tsx` — tokenizer/layout locali rimossi, sostituiti da `layoutAbbr(tokenize(tcContent), {...}, pxW, sink)` con `sink` che chiama `pushFermavetri`/`drawAnta`/`dividers.push(<rect.../>)` esistenti.
- `app/area-clienti/preventivi/[id]/stampa/page.tsx` — stessa sostituzione, `sink` che chiama `pushFermavetri`/`drawAnta`/`divRects.push(\`<rect.../>\`)` esistenti.
- `app/area-clienti/carrello-preventivo/stampa/page.tsx` — idem.

Non toccati: `disegnoSVG`/`computeSVGDims` (fallback per abbr non-Tc/Ta), `pushFermavetri`/`drawAnta` in tutti e 3 i file (restano le rispettive implementazioni JSX/stringa, solo ora chiamate dal sink condiviso invece che da un tokenizer locale), `computeGlassGeometry`/`lib/disegno-infisso.ts` (calcolo Uw, esplicitamente fuori scope).

Verifica: `npx tsc --noEmit` e `npm run lint` sull'intero progetto senza nuovi errori/warning nei file toccati. Verifica visiva nello strumento `/amministrazione/test-anteprime` da fare manualmente; verifica della stampa PDF non eseguita in automatico (richiede login + un preventivo reale in DB) — da controllare manualmente generando una stampa con un articolo che ha `abbr` valorizzato.

---

## Iterazione 4 — parentesi intercambiabili `()`/`[]`/`{}` + textbox Abbr in listini

Richiesta: poter scrivere l'Abbr usando a scelta `(x)`, `[x]` o `{x}` come coppia di parentesi (nessuna priorità tra loro, basta chiuderle in modo coerente) per leggere meglio l'annidamento; e una casella di testo più larga nel form di modifica listini (colonna larga ma input minuscolo).

### Grammatica — `lib/abbr-layout.ts`

- `splitTP`: la profondità ora sale con **qualunque** apertura (`(`, `[`, `{`) e scende con qualunque chiusura (`)`, `]`, `}`) — nessuna verifica incrociata che l'apertura e la chiusura siano dello stesso tipo (l'utente garantisce la coerenza, come richiesto).
- `tryAnta`, il branch `NUMBER(INNER)`/`LETTER(INNER)` in `tokenize`, e il riconoscimento del wrapper esterno (nuova funzione esportata `extractTcTa(abbr)`) usano tutti la stessa classe di caratteri `[([{]`/`[)\]}]` al posto dei letterali `\(`/`\)`.
- Nuovi helper `isFisso(s)` (equivalente di `s === 'F()'` ma per qualunque coppia di parentesi) e `hasFissoWrap(s)` (equivalente di `.includes('(F())')`).
- `extractTcTa(abbr)` centralizza anche il riconoscimento del wrapper esterno `Tc(...)/Ta(...)` (prima duplicato in ognuno dei 3 file con `abbrUp.startsWith('TC(')` + una regex separata per estrarre il contenuto) — ora un'unica funzione condivisa usata ovunque, incluso nei due punti di `app/area-clienti/.../stampa/page.tsx` che decidevano se estrarre il colore barra da una foto figlia (`if (!extractTcTa(...)) return`).
- Il mini-parser duplicato 3 volte dentro `drawAnta` (per il caso "un'anta contiene a sua volta un divisorio T interno", es. `cA(F()+T+F())`) usava anch'esso un contatore di profondità hardcoded su `(`/`)`: sostituito, in tutti e 3 i file, con lo `splitTP` condiviso (importato da `lib/abbr-layout.ts` invece di essere reimplementato localmente), e la regex del prefisso numerico generalizzata allo stesso modo.

**Verificato con esecuzione reale** (script `tsx` temporaneo, non solo a mente) che `Tc[X(cA{F()}+mAc[F{}])+P+X{F[]+P+40{}}]` produce esattamente la stessa geometria (proporzioni, cerniere, maniglie) della versione scritta solo con `()`. Aggiunto l'esempio con parentesi miste nello strumento `/amministrazione/test-anteprime`.

**Gap noto, non risolto**: alcune pagine client (es. `app/clienti/preventivi/[id]/page.tsx`, `app/area-clienti/carrello-acquisti/page.tsx` e simili) fanno un check leggero `abbr.toUpperCase().startsWith('TC(')` solo per decidere se recuperare il colore barra da una foto figlia PRIMA di passare i dati a `PreviewInfisso` — se il wrapper esterno usa `[` o `{` invece di `(`, quel check fallisce silenziosamente e il colore barra resta quello di default invece di quello estratto dalla foto (nessun crash, solo colore non ottimale). Non l'ho esteso a tutti quei punti per restare nello scope segnalato; da sistemare se e quando capita in pratica.

### UI listini — `app/area-lavoro/listini/listini-client.tsx`

- Riga edit (form): input `abbr` aveva `width: 70` fisso — rimosso, sostituito con `minWidth: 220` + `fontFamily: 'monospace'` (eredita `width: '100%'` dallo stile `inp` comune, quindi ora riempie la colonna invece di restare minuscolo).
- Riga di sola visualizzazione: aggiunto `fontFamily: 'monospace'` per leggere meglio le parentesi annidate anche fuori modifica.

Verifica: `npx tsc --noEmit` e `npm run lint` senza nuovi errori/warning nei file toccati.

---

## Iterazione 5 — spessori derivati da `profilo_frontale_mm`

Richiesta: letto `profilo_frontale_mm` del listino, i **telai** (Tc/Ta + divisori T/P) devono avere spessore pari alla **metà** del profilo; **ante/ribalta/vasistas** pari al profilo **intero**; il **fermavetro** (bordo dei vetri fissi E bordo interno di ogni anta/ribalta/vasistas) **fisso a 20mm**, indipendente dal profilo.

Prima, un solo valore (`profilo_mm * 2/3`, fattore di calibrazione empirico) veniva usato indistintamente per telaio, ante e come base per il fermavetro (`fvPx = pxW/2`) — questa iterazione lo sostituisce con le tre regole esplicite.

### Modifiche (stesso schema in tutti e 3 i file: `components/preview-infisso.tsx`, `app/area-clienti/preventivi/[id]/stampa/page.tsx`, `app/area-clienti/carrello-preventivo/stampa/page.tsx`)

- Rimosso il fattore `* (2/3)` (nei due file di stampa era applicato dal chiamante `disegnoSVGAbbr` prima di passare `profiloMm` a `disegnoTcTa`; ora passa il valore grezzo).
- Nuovo helper locale `mmToPx(mm)` (stessa forma di clamping già usata prima, solo parametrizzata sui mm invece che fissa sul profilo).
- `pxTelaio = mmToPx(profilo/2)` → usato per il bordo esterno Tc/Ta e per lo spessore dei divisori T/P (passato come `pxDiv` a `layoutAbbr`/usato per `pX`/`pY`).
- `pxAnta = mmToPx(profilo)` → usato dentro `drawAnta` per lo spessore del telaio di ogni anta/ribalta/vasistas (variabile `p`, prima era la stessa di `pxTelaio`).
- `fvPx` (fermavetro, disegnato da `pushFermavetri` — sia per i fissi `F()` sia per l'interno di ogni anta) non deriva più da `pxW/pX` ma da un valore fisso: `Math.max(2, (20/10) * pxPerCm)`.

### Due assunzioni prese senza chiedere conferma esplicita (l'utente ha detto "proviamo" — verificabili subito nello strumento test-anteprime, correggibili se sbagliate)

1. **Divisori T/P a livello di `Tc(...)`** (i pilastrini/traverse tra aree diverse): trattati come "telaio" → spessore dimezzato (`pxTelaio`), non come le ante. Non esplicitamente elencati dall'utente tra le 3 categorie, ma strutturalmente sono elementi fissi come il telaio esterno, non ante mobili.
2. **Divisorio T dentro un'anta** (es. `cA(F()+T+F())`, un'anta che al suo interno si divide in due vetri): questo divisorio resta a spessore `p` (ora `pxAnta`, invariato rispetto a prima) — non gestito separatamente, dato che è un caso raro/annidato e non menzionato esplicitamente.

Verifica: `npx tsc --noEmit` e `npm run lint` sull'intero progetto senza nuovi errori/warning nei file toccati; sanity-check numerico dei tre spessori con `node -e` (telaio ≈ metà px dell'anta, fermavetro costante indipendente dal profilo). Verifica visiva da fare nello strumento `/amministrazione/test-anteprime` (campo "Profilo (mm)" già presente) — confronta il caso con profilo alto (es. 100mm) vs basso (es. 40mm) per vedere la differenza tra spessore telaio e spessore anta.

---

## Iterazione 6 — bonifica grafica: niente più linee doppie, niente più chiaroscuro (solo `components/preview-infisso.tsx`)

L'utente ha segnalato linee doppie sul perimetro esterno del telaio, poi soprattutto sui tagli a 45°, e infine ha chiesto una bonifica sistematica: **ogni confine deve avere un solo bordo 1px** (invariante allo zoom, `vector-effect="non-scaling-stroke"`), che agli incroci si sovrappone senza raddoppiare lo spessore. In più: **eliminare tutto il chiaroscuro** (gradienti, lucidi, ombre) — l'interno del profilo deve essere colore piatto. I contorni, per ora, **rossi** (invece del grigio finale) per rendere ogni errore residuo immediatamente visibile.

Fix applicati, in ordine (tutti solo in `components/preview-infisso.tsx`, non nei generatori PDF):

1. **Rimossa la "luce speculare"** (righe originali 376-377): due linee bianche semitrasparenti disegnate esattamente sopra al bordo esterno (spessori diversi, 1.5 e 1), che affiancandosi al bordo vero creavano una doppia linea visibile solo su top/left (asimmetrico).
2. **Rimosse le 4 diagonali a 45° del telaio** ridondanti: i 4 trapezi (`top`/`right`/`left`/`bottom`) condividevano già quella diagonale come lato tra loro (differenza di gradiente = giunto visibile); disegnarci sopra un'altra `<line>` esplicita raddoppiava lo spessore. (Poi reintrodotte in forma diversa, vedi punto 6.)
3. **Fermavetro** (`pushFermavetri`): le 4 barre avevano ciascuna il proprio contorno completo — dove due barre si toccano (es. sopra+sinistra) il contorno si sovrapponeva per un tratto, non in un punto solo. Fix: le 4 barre diventano solo riempimento (`stroke:'none'`), un contorno unico sul perimetro esterno e uno su quello interno, ciascuno un solo elemento.
4. **Ogni anta/ribalta/vasistas** (`drawAnta`): stesso problema del telaio ma peggiore — i 4 trapezi avevano `stroke: sc` sul proprio perimetro completo (non `stroke:'none'` come il telaio) *più* le 4 diagonali esplicite (`diagPx`) sopra: fino a 3 strati sovrapposti sullo stesso segmento. Fix: trapezi a `stroke:'none'`.
5. **Cerniere/maniglie/meccanismo vasistas**: ogni pezzo hardware (rect col proprio contorno) aveva ANCHE una riga di "lucido" (`a-hsp1`, `a-hsp2`, `a-vhs1`, `a-vhs2`, `a-vcls`, `a-msp` — tutte disegnate esattamente sopra un lato del rect già stroked). Rimosse: erano chiaroscuro e raddoppio insieme. Tenute le righe centrali (`a-hm1`/`a-hm2`/`a-vhv1`/`a-vhv2`, dettaglio vite/perno, non un bordo duplicato).
6. **Eliminati tutti i gradienti** (`gTop`, `gLft`, `gHw`, `gHwa` — quattro `<linearGradient>`, uno dei quali con id duplicato per errore preesistente, non più rilevante) e le funzioni `darken`/`mixWhite` che li generavano. Riempimento profilo → `fill={bc}` piatto ovunque (telaio, ante, hardware con `bca ?? bc`). Siccome i 4 trapezi (telaio e ogni anta) ora sono tutti dello stesso colore piatto, il taglio a 45° non ha più un bordo "gratis" dato dal cambio di sfumatura: **reintrodotte le 4 diagonali** per il telaio e per ogni anta, questa volta come **unica** rappresentazione del giunto (non più doppiate da nulla).
7. **Rimossi gli highlight decorativi rimasti**: il rettangolo di tint azzurrino e il triangolo bianco semitrasparente sul vetro (dentro il gruppo clippato), e le due righe "ombra interna" (`rgba(0,0,0,...)`) — chiaroscuro non legato al profilo, tolti per coerenza con "eliminiamo i chiaro scuri" detto in modo generale.
8. Tutti gli `stroke={sc}`/`scHwA`/`bcHiA` rimanenti sostituiti con una costante `DEBUG_STROKE = '#ff0000'`, commentata esplicitamente come temporanea (diventerà grigio).

### Non ancora sistemato — stesso problema, caso più complesso

Il rettangolo dei **divisori T/P** (`layoutAbbr` → `sink.divider`) ha ancora un contorno completo sul proprio perimetro: dove le sue estremità toccano il bordo interno del telaio, o dove il suo lato lungo tocca il nuovo anello esterno del fermavetro, si ripresenta lo stesso tipo di sovrapposizione parziale — più piccola di quelle già risolte. Non l'ho toccato perché la scelta giusta lì dipende da cosa c'è dall'altra parte del divisorio (telaio, fermavetro o anta hanno trattamenti diversi: alcuni stroke:'none', altri con contorno proprio), quindi serve decidere un criterio esplicito prima di intervenire, invece di indovinare.

Verifica: `npx tsc --noEmit` e `npm run lint` sull'intero progetto — nessun nuovo errore/warning (l'unico avviso rimasto su questo file, `tcTaProfileRatio` non usato, è preesistente e indipendente da questa modifica). Verifica visiva da fare nello strumento `/amministrazione/test-anteprime`.

---

## Iterazione 7 — lato comune mancante tra due ante adiacenti (bug reale, non arrotondamento)

Segnalato dall'utente con screenshot: due ante affiancate senza divisorio tra loro (es. `X(cA()+aC())`) risultavano fuse visivamente in un unico blocco — mancava la linea di confine verticale tra le due. Ipotesi iniziale dell'utente: errore di arrotondamento nel calcolo dei pixel. Verificato che non è quello: `layoutAbbr` già fa arrotondare solo gli elementi non-ultimi e fa assorbire il resto all'ultimo (`isLast ? (bx+bw)-cursor : Math.round(...)`), quindi non ci sono gap di arrotondamento.

Causa reale: telaio e divisori T/P forniscono "gratis" il bordo alle aree che li toccano (bordo interno del telaio, contorno del divisorio), ma quando **due ante si toccano direttamente senza divisorio** nessuno dei due disegna quel lato — prima (iterazione 6) lo forniva il cambio di sfumatura tra i due trapezi adiacenti, ma coi gradienti tolti (riempimento piatto ovunque) quel confine è sparito del tutto.

### Fix — modulo condiviso `lib/abbr-layout.ts`

Aggiunto un nuovo metodo **opzionale** all'interfaccia `LayoutSink`: `seam?(x1,y1,x2,y2)`. `layoutAbbr` lo richiama quando, scorrendo i token, due aree si susseguono **senza un token divisorio tra loro** (traccia `prevWasArea` nel loop principale) — cioè esattamente il caso "due ante dirette". Non scatta quando c'è un divisorio T/P di mezzo (quello fornisce già il bordo da solo).

Essendo opzionale, non serve implementarlo nei generatori PDF (che non hanno questo bug: le loro ante usano ancora i gradienti originali, mai toccati in questa bonifica — il cambio di sfumatura tra ante adiacenti lì fa ancora da confine "gratis").

**File modificati**:
- `lib/abbr-layout.ts` — `LayoutSink.seam?` + logica `prevWasArea` nel loop di `layoutAbbr`.
- `components/preview-infisso.tsx` — implementato `seam` nel sink passato a `layoutAbbr`: disegna una `<line>` con `DEBUG_STROKE`, stessa convenzione delle altre linee.

Verificato con esecuzione reale (script `tsx` temporaneo) su `Tc(X(cA()+aC())+P+50())` e `Tc(cA()+mAc())`: il seam scatta esattamente alla x di confine tra le due ante, per tutta l'altezza, e correttamente NON scatta quando c'è un divisorio P o T di mezzo (verificato anche `Tc(F()+T+F())` come caso di controllo negativo).

Verifica: `npx tsc --noEmit` senza errori.

---

## Iterazione 8 — altezza maniglia sbagliata per le finestre

L'utente ha notato che l'altezza maniglia (135cm se l'infisso è ≥200cm, 35cm altrimenti) era misurata dalla base dell'**anta**, non dal pavimento. Per una porta (base a terra) è corretto. Per una finestra, la base dell'anta è sollevata di 100cm (`liftPx = isBalcone ? 0 : 100 * pxPerCm`) — quindi una finestra ≥200cm finiva con la maniglia a 100+135 = **235cm da terra**, non raggiungibile.

Fix in `components/preview-infisso.tsx` (`drawAnta`): riusa `isBalcone` (già calcolato in cima al componente cercando "port"/"balcone" in `tipo_prodotto`/`descrizione` — esattamente il meccanismo suggerito dall'utente, nessuno stato nuovo).

```js
const liftCm = isBalcone ? 0 : liftPx / pxPerCm
const fromBottomCm = isBalcone
  ? (altezza_cm >= 200 ? 135 : 35)          // porta: invariato
  : Math.max(10, 135 - liftCm)              // finestra: punta a ~135cm da terra, sconta il sollevamento
```

Risultato: porta invariata; finestra ora sempre a 135cm da terra (prima 235cm per finestre ≥200cm), indipendentemente dall'altezza propria. Verificabile nello strumento test-anteprime con la linguetta Finestra/Porta già presente.

Verifica: `npx tsc --noEmit` e `npm run lint` senza nuovi errori/warning.

---

## Iterazione 9 — aree a percentuale fissa (`33%(...)`)

Nuova sintassi concordata con l'utente: `N%(...)` riserva una **percentuale** del riquadro corrente invece di cm assoluti — stessa identica semantica di `N(...)` (riserva prima, il resto si divide equamente tra le aree variabili), solo con un'unità diversa. Es. `T(15%()+X+20%())` → riserva 15%+20%=35%, l'unica area variabile prende il restante 65%.

### Modifiche — `lib/abbr-layout.ts` (unico file toccato)

- `AreaTok` (`LeafTok`/`SubTok`) ha un nuovo campo `pct: number | null`, parallelo a `cm` — al più uno dei due è valorizzato, entrambi `null` = area variabile.
- `tokenize()`: nuova regex `pctm` (`/^(\d+(?:\.\d+)?)%[([{](.*)[)\]}]$/`), controllata **prima** di `nm` (il wrapper numerico normale) così `33%()` non viene mai scambiato per `33()`. Stesso trattamento del contenuto interno di `N(...)` (vuoto → blank, `F()` → fisso, singola anta → leaf, altrimenti → sotto-livello ricorsivo), solo passando `pct` invece di `cm`.
- `layoutAbbr()`: nuovo helper `cmOf(tok)` che converte `pct` nel suo equivalente in cm rispetto al riquadro corrente (`(pct/100) * totalCm`) prima di qualunque altro calcolo — da lì in poi tutta la formula esistente (somma riserve fisse, spazio residuo diviso tra le variabili, l'ultima area assorbe l'arrotondamento) resta identica, ora generica su `cmOf(tok)` invece che su `tok.cm` diretto.

Verificato con esecuzione reale (script `tsx` temporaneo): `Tc(33%()+X()+X())` → 33% / 33.5% / 33.5%; `Tc(15%()+X+20%())` → 15% / 65% / 20%. Aggiunti due esempi nello strumento `/amministrazione/test-anteprime`.

Verifica: `npx tsc --noEmit` senza errori.

---

## Iterazione 10 — unificazione del disegno (non solo layout) — completata

Prima `lib/abbr-layout.ts` condivideva solo parsing+layout geometrico; il disegno vero (`pushFermavetri`/`drawAnta` — riempimenti, contorni, cerniere, maniglie) restava **triplicato e indipendente** in `components/preview-infisso.tsx` e nei due generatori PDF. Tutta la bonifica grafica delle iterazioni 6-9 (niente chiaroscuro, niente linee doppie, seam tra ante adiacenti, altezza maniglia finestra, percentuali) esisteva quindi solo nell'anteprima a schermo, non nei PDF.

### Nuovo modulo condiviso — `lib/infisso-drawing.ts`

Non produce JSX né stringhe SVG direttamente: riceve un'interfaccia `DrawSink` (3 primitivi: `rect`, `polygon`, `line`) che il chiamante implementa nel proprio formato. Contiene:
- `pushFermavetri(sink, ax, ay, aw, ah, style)` — 4 barre a riempimento piatto (`stroke:null`) + un solo contorno esterno e uno interno (niente più raddoppio agli angoli).
- `drawAnta(sink, ax, ay, aw, ah, hingeLeft, handleLeft, handleRight, kind, innerContent, style)` — i 4 trapezi a riempimento piatto + le 4 diagonali del taglio a 45° (uniche, non raddoppiate), cerniere/maniglie/meccanismo vasistas, e la logica del divisorio T interno a un'anta.
- `drawInfisso(sink, isTa, ox, oy, outerW, outerH, content, wCm, hCm, style)` — orchestratore: bande esterne del telaio, bordo esterno/interno, diagonali, poi chiama `layoutAbbr`/`tokenize` (da `lib/abbr-layout.ts`, già condiviso) per posizionare ante/fissi/divisori/seam tramite `pushFermavetri`/`drawAnta`.
- `innerRect(isTa, ox, oy, outerW, outerH, pxTelaio)` — helper per calcolare il rettangolo interno, usato sia internamente sia dal chiamante (es. per il clip dell'immagine di sfondo nell'anteprima).

`InfissoStyle` bundle: `{ fill, hwFill, stroke, pxTelaio, pxAnta, fvPx, pxPerCm, handleFromBottomCm }` — ogni chiamante calcola questi valori secondo il proprio contesto (scala stanza-foto per lo schermo, scala schema-tecnico per il PDF) e li passa già risolti; il modulo condiviso non conosce isBalcone/liftPx/room-photo, riceve solo `handleFromBottomCm` già calcolato.

### Chiamanti aggiornati

- **`components/preview-infisso.tsx`**: il blocco Tc/Ta ora calcola solo le costanti di stile (pxTelaio/pxAnta/fvPx/handleFromBottomCm/FRAME_STROKE grigio) e un `DrawSink` che spinge elementi JSX in un array, poi chiama `drawInfisso`. Circa 180 righe di JSX duplicato sostituite da ~35.
- **`app/area-clienti/preventivi/[id]/stampa/page.tsx`** e **`app/area-clienti/carrello-preventivo/stampa/page.tsx`**: `disegnoTcTa` ridotta da ~200 righe a ~35: calcola le stesse costanti di stile (scala propria `pxPerCmX`, clamp `mmToPx` proprio del PDF — non tocca quello del preview) e un `DrawSink` che produce stringhe SVG, poi chiama `drawInfisso`. **Conseguenza attesa**: i PDF ora hanno lo stesso stile piatto/grigio senza chiaroscuro né linee doppie — un cambiamento visivo per la stampa, voluto (è lo scopo dell'unificazione).
- Rimosso il clip-path difensivo attorno al contenuto (ante/fermavetro/divisori) in tutti e 3 i punti: era un'esatta duplicazione delle coordinate già garantite dalla matematica di `layoutAbbr`, non necessario.

### Limite noto — altezza maniglia nel PDF

Il PDF non ha (e non riceve, senza un cambio di firma più ampio in entrambi i file chiamanti) il concetto porta/finestra sollevata da terra: `handleFromBottomCm` nel PDF resta la vecchia soglia incondizionata (`altezza ≥ 200cm → 130cm, altrimenti 35cm`, sempre dalla base dello schema) — il fix dell'iterazione 8 (altezza reale da terra per le finestre) **non è stato portato al PDF**. Non toccato per restare nello scope segnalato; da fare se richiesto esplicitamente.

---

## Iterazione 11 — rifiniture: dimensioni hardware, altezza maniglia, effetto vetro, contorno adattivo, percentuale verticale

Serie di piccole richieste dopo l'unificazione, tutte in `lib/infisso-drawing.ts` salvo dove indicato:

1. **Dimensioni cerniere/maniglia**: cerniere 2,5×20cm → **2×15cm** (anche la variante ruotata del vasistas); maniglia 3×20cm → **2,5×15cm**.
2. **Altezza maniglia**: soglia ergonomica 135cm → **130cm da terra**, sia per le porte (≥200cm) sia per le finestre (scontato il sollevamento di 100cm) — 3 punti: `preview-infisso.tsx` e i due PDF.
3. **Effetto vetro nell'anteprima** (solo `components/preview-infisso.tsx`, il PDF non ha foto di sfondo): aggiunto un velo piatto (`rgba(190,215,235,0.14)`, opacità immagine 0.94) sopra la foto vista dietro il vetro, e un finto riflesso — poligono bianco piatto in diagonale nell'angolo (`rgba(255,255,255,0.16)`), nessun gradiente. Il ramo di rendering classico (legacy) aveva già un proprio effetto vetro (`col.glass`), non toccato.
4. **Contorno adattivo**: `FRAME_STROKE`/`stroke` non è più un grigio fisso — nuova funzione esportata `adaptiveStroke(fill, amount=0.22)` in `lib/infisso-drawing.ts`: scurisce se il colore infisso è chiaro, schiarisce se è scuro (luminanza percepita, soglia 0.5), sempre un solo valore fisso (non un gradiente). Usata nei 3 chiamanti al posto di `'#555555'`. Verificato con esecuzione reale: `#d8d4cc` (chiaro) → `#a8a59f`, `#3e3e3e`/`#1c1c1c` (scuri) → `#686868`/`#4e4e4e`.
5. **Bug reale trovato dall'utente**: `Tc(cA()+mAc(X()+T+33%())+P+33%(F()))` — la percentuale **dentro il divisorio T di un'anta** (es. `mAc(X()+T+33%())`) non veniva riconosciuta. Causa: il contenuto interno di un'anta con un proprio divisorio T (`cA(F()+T+F())`) usava un **mini-parser separato e più povero** dentro `drawAnta`, non il `tokenize`/`layoutAbbr` condiviso — quel mini-parser riconosceva solo un prefisso numerico puro (`/^(\d+(?:\.\d+)?)[([{]/`), mai `NN%(...)`, e non gestiva ante annidate.

   **Fix**: rimosso il mini-parser, `drawAnta` ora richiama lo stesso `tokenize`/`layoutAbbr` ricorsivamente sul proprio `innerContent` — stesso supporto percentuali/seam/gruppi di qualunque altro livello della grammatica. Per farlo, `LayoutSink.leaf` (in `lib/abbr-layout.ts`) ora passa anche `wCm`/`hCm` (dimensioni reali del riquadro di quella foglia, non solo i px) ad ogni callback — necessario per calcolare le percentuali a qualunque livello di annidamento; `drawAnta` riceve `wCm`/`hCm` come nuovi parametri e li propaga (invariati, stessa approssimazione già esistente altrove nel sistema: le percentuali sono relative al cm nominale del riquadro contenitore, non ricalcolate sottraendo lo spessore del proprio profilo).

   Verificato con esecuzione reale (`tokenize('X()+T+33%()')` + `layoutAbbr` su un riquadro 100cm asse verticale): area `33%` → 33cm esatti, area variabile `X()` → 67cm (il resto) — prima la percentuale sarebbe stata trattata come un'altra area variabile (50/50). Aggiunto l'esempio nello strumento di test.

Verifica: `npx tsc --noEmit` e `npm run lint` sull'intero progetto senza nuovi errori/warning.

Verifica: `npx tsc --noEmit` e `npm run lint` sull'intero progetto — zero nuovi errori/warning su tutti i file toccati (anzi, `tcTaProfileRatio` importato-ma-mai-usato in `preview-infisso.tsx`, preesistente, è sparito da solo perché l'import non serve più con la riscrittura). Verificato con esecuzione reale (script `tsx` temporanei): `drawInfisso` con un mock sink su 4 casi (fisso, 2 ante adiacenti, percentuali, telaio Ta) senza errori e con conteggi elementi plausibili; la sink-stringa (replica esatta di quella usata nei PDF) produce SVG ben formato (57 tag aperti, 57 chiusi) sullo stesso caso di test con ante adiacenti + percentuale.

---

## Iterazione 12 — divisori T/P con spessore custom in mm (T60, P40)

Richiesta: poter scrivere `P40` o `T60` in un'Abbr per ottenere un divisorio verticale/orizzontale con uno spessore esplicito **in millimetri**, indipendente da `profilo_frontale_mm`/`pxTelaio` — a differenza di `T`/`P` "nudi" che continuano a usare lo spessore di default del profilo.

### Modifiche — `lib/abbr-layout.ts`

1. **`DivTok`** esteso con un campo opzionale: `{ type: 'div'; kind: 'T' | 'P'; widthMm?: number }`.
2. **`tokenize()`**: nuovo riconoscimento `/^([TP])(\d+(?:\.\d+)?)$/` per `T60`/`P40` (subito dopo i controlli su `T`/`P` nudi, che restano invariati — nessuna ambiguità: `T`/`P` da soli non hanno cifre, quindi non possono matchare la nuova regex).
3. **`layoutAbbr()`**: introdotta `divPxOf(tok)` — se il token ha `widthMm`, lo spessore in px è `(widthMm/10/totalCm) * totalPx` (stessa scala px/cm già in uso per quel riquadro/asse, coerente con come tutte le altre misure — cm fissi, percentuali — vengono già convertite); altrimenti resta `pxDiv` (il default derivato dal profilo). Tutti i punti che sommavano `nDiv * pxDiv` (spazio totale occupato dai divisori, sottratto prima di dividere lo spazio variabile) ora sommano lo spessore **effettivo** di ciascun divisorio (`totalDivPx`), perché con spessori diversi tra loro la vecchia formula uniforme sarebbe stata sbagliata.
4. Il ciclo di disegno usa `divPxOf(tok)` per calcolare il box del singolo divisorio e per avanzare il cursore — nessuna modifica necessaria a `LayoutSink.divider` né ai chiamanti (`lib/infisso-drawing.ts`): ricevono già `x,y,w,h` del divisorio, spessore custom o di default che sia, e disegnano un rettangolo con quel box — funziona automaticamente in tutti e 3 i punti di rendering (schermo + 2 PDF) senza toccarli.

### Verifica

`npx tsc --noEmit` pulito; `npm run lint` senza nuovi errori/warning (solo quelli preesistenti in script non correlati). Script `tsx` temporaneo (cancellato dopo l'uso) su scala 5px/cm:
- `X()+T60+X()` → divisorio T da 30px (60mm), aree rimanenti divise a metà del residuo — **contro** `X()+T+X()` che usa il `pxDiv` passato (40px in questo test).
- `X()+P40+X()` (asse orizzontale, 200cm/1000px) → divisorio P da 20px (40mm).
- `tokenize('X()+T+X()+T60+X()')` → i 4 token risultanti confermano che `T` e `T60` restano distinti (`kind:'T'` senza `widthMm` vs `kind:'T', widthMm:60`), stessa cosa per P/P40.

Aggiunti 2 esempi in `app/amministrazione/test-anteprime/test-anteprime-client.tsx`: divisorio P40 e un caso misto T60+P normale.

Stato: **completato**.

---

## Iterazione 13 — nuova variante anta "Z" (zoccolo)

Richiesta: una variante di A ("anta con zoccolo") che si comporta esattamente come A (cerniere, maniglia, contenuto interno) ma con una base diversa: una fascia dritta (senza taglio a 45°) di spessore personalizzabile in mm — es. `Z()` (zoccolo di default, stesso spessore delle altre fasce) o `Z120()` (zoccolo esplicito 120mm). L'utente ha mostrato uno screenshot di riferimento (3 ante: A(), Z(), Z120()) per chiarire la geometria.

### Grammatica — `lib/abbr-layout.ts`

1. **`AntaKind`** esteso con `'zoccolo'`.
2. **`AntaInfo`/`LeafTok`**: nuovo campo opzionale `zoccoloMm?: number | null` (mm espliciti della base; `null`/assente = default, stesso spessore delle altre fasce).
3. **`tryAnta()`**: regex estesa da `/^([CM]?)([AR])([CM]?)[([{](.*)[)\]}]$/` a `/^([CM]?)([ARZ])(\d+(?:\.\d+)?)?([CM]?)[([{](.*)[)\]}]$/` — aggiunge Z come terza lettera valida e un gruppo opzionale di cifre subito dopo la lettera (stesso pattern già usato per T60/P40, qui applicato a una lettera anta anziché a un divisorio). Cerniera/maniglia (`hingeLeft`/`handleLeft`/`handleRight`) restano identiche a prima — Z non cambia quella logica.

### Disegno — `lib/infisso-drawing.ts`, `drawAnta()`

Prima iterazione (poi corretta su indicazione dell'utente): avevo fatto fermare i laterali prima del fondo e riempito la base con un rettangolo a tutta larghezza sotto di loro. **Sbagliato** — l'utente ha corretto: "non sono i laterali che vanno sopra la base ma la base unisce i laterali che arrivano in fondo". Geometria corretta:

- **Laterali** (fasce sinistra/destra): dritti, NON mitrati in basso — raggiungono l'angolo vivo in fondo all'anta (`ay+ah`), invece di fermarsi prima. Polygon: `[[ax,ay],[ax+p,ay+p],[ax+p,ay+ah],[ax,ay+ah]]` (mitra solo in alto, poi dritto fino in fondo).
- **Base** (zoccolo): fascia dritta **inset** (larghezza `ax+p`..`ax+aw-p`, tra le facce interne dei due laterali — non a tutta larghezza sotto di loro), spessore `zH` (custom in mm o default `p`), posizionata a ridosso del fondo: `sink.rect(ax+p, ay+ah-zH, aw-2*p, zH, ...)`.
- Diagonali: solo le 2 in alto (miter normale); **nessuna** diagonale in basso (il giunto è ad angolo vivo).
- Bordo superiore della base: coincide esattamente col contorno del vetro/contenuto interno sopra di essa (che si ferma a `iH0 = ah - p - zH`, formula che si riduce a `ah - 2p` — identica al caso non-zoccolo — quando `zH === p`), quindi nessuna riga aggiuntiva lì.
- **Corretto su ulteriore indicazione dell'utente** ("le due righine verticali di congiunzione ci vogliono"): aggiunte 2 righe verticali esplicite al giunto laterale/base (`ax+p` e `ax+aw-p`, da `ay+ah-zH` a `ay+ah`) — stesso fill ma due sagome distinte, senza una riga esplicita il giunto sarebbe invisibile (stessa logica del `seam` tra due aree adiacenti senza divisorio).
- Cerniere/maniglia: **nessuna modifica** — restano posizionate con la stessa formula di sempre (basata su `p`, non su `zH`), per esplicita richiesta dell'utente ("per il resto si comporta come A").
- `drawAnta()` ha un nuovo parametro `zoccoloMm: number | null | undefined`, propagato dai due punti che lo richiamano (leaf callback di `drawInfisso` e leaf callback ricorsivo interno di `drawAnta` stesso per ante annidate).

### Verifica

`npx tsc --noEmit` pulito, `npm run lint` senza nuovi errori/warning sui 2 file toccati. Script `tsx` temporanei (cancellati dopo l'uso):
- `tokenize('CZ()+MZC()')` e `tokenize('cZ120m()')` → confermato `antaKind:'zoccolo'`, `zoccoloMm` rispettivamente `null` e `120`, e che `Z`/`A`/`R`/`V` non si confondono tra loro.
- `drawInfisso` con mock sink su `Tc(cZ120(F()))` (scala 5px/cm) → laterali che raggiungono `y=680` (fondo esatto) con angolo vivo, base inset `x=40..210` (larghezza tra le facce interne), altezza 60px (= 120mm), contenuto vetro che si ferma esattamente al bordo superiore della base (nessuna sovrapposizione/vuoto), nessuna diagonale in basso.
- Confronto con `Tc(cA(F()))` (kind `'anta'` normale) → geometria identica a prima dell'introduzione di Z, nessuna regressione.

Aggiunti 2 esempi in `test-anteprime-client.tsx`: `Tc(CZ(F())+MZC(F()))` (due Z affiancate, zoccolo default) e `Tc(cZ120m(F()))` (zoccolo esplicito 120mm).

Stato: **completato**.

---

## Iterazione 14 — linee del senso di apertura (A/R/V)

Richiesta: linee sottili sul vetro che indicano il senso di apertura, per anta/ribalta/vasistas (non per lo zoccolo, non menzionato dall'utente — da confermare se vada esteso anche lì). Regola data dall'utente: si guarda il lato dove sono le cerniere; i due spigoli del vetro vicino alle cerniere (alta e bassa) si congiungono nella mezzeria del lato di vetro OPPOSTO a quello delle cerniere — **non** il contrario (il codice legacy del "rendering classico" in `preview-infisso.tsx`, non toccato, usa la convenzione opposta — apice sul lato cerniere — ma è un ramo distinto per un formato Abbr diverso, non un riferimento per questo).

Quattro correzioni dell'utente dopo la prima stesura:
1. **"Non entrano nel fermavetro del fisso, sono solo nel vetro"**: le linee devono restare dentro il vetro VERO, non nel fermavetro (le 4 barre di `pushFermavetri`, spesse `fvPx`, che sono telaio/profilo, non vetro) — il riquadro di riferimento va quindi ristretto di `fvPx` su ogni lato rispetto al riquadro dell'anta.
2. **"Falla grigia, non bianca, se no nella stampa su carta non si vede"**: colore cambiato da bianco a un grigio fisso.
3. **"Falla un colore che risalta, blu, ma tratteggiata"**: colore cambiato di nuovo, da grigio a blu (`#1a56db`, `APERTURA_STROKE`) e tratteggiata (`dash: '4 3'`, nuovo campo opzionale `dash` aggiunto a `DrawSink.line()` e implementato nei 3 sink concreti — `components/preview-infisso.tsx` con `strokeDasharray`, i due PDF con `stroke-dasharray`).
4. **"Anche Z ed R hanno la stessa coppia di linee"**: la condizione che decide quali `antaKind` ricevono le linee è stata estesa da `kind === 'anta' || kind === 'ribalta'` a includere anche `kind === 'zoccolo'` (R era già incluso) — usa la stessa logica basata su `hingeLeft`, adattandosi automaticamente al riquadro vetro più corto quando lo zoccolo ha uno spessore custom.

### Implementazione — `lib/infisso-drawing.ts`, `drawAnta()`

Aggiunto un blocco alla fine di `drawAnta`, dopo il disegno del contenuto interno (in modo che le linee stiano sopra al vetro, non sotto):

- Riquadro del **vetro vero**: `gX0 = iX0+fvPx, gY0 = iY0+fvPx, gW0 = iW0-2*fvPx, gH0 = iH0-2*fvPx` (inset rispetto al riquadro dell'anta `iX0..iH0`, che è a sua volta il riquadro del fermavetro/contenuto).
- **anta/ribalta** (cerniere laterali, in base a `hingeLeft`): 2 linee dai due spigoli del vetro vero sul lato cerniere (alto e basso) alla mezzeria del lato di vetro vero opposto.
- **vasistas** (cerniere in basso): 2 linee dai due spigoli bassi del vetro vero alla mezzeria del lato alto.
- Colore finale `#1a56db` (blu), tratteggiata (`4 3`), `strokeWidth: 1` (sottile, coerente col resto del sistema `vector-effect="non-scaling-stroke"` applicato dai chiamanti).
- Incluso anche `kind === 'zoccolo'` (stessa logica di anta/ribalta, hinge laterale).

### Verifica

`npx tsc --noEmit` pulito, `npm run lint` invariato (stesso totale problemi preesistenti, 125 errori/1588 warning, nessuno nuovo, in tutte e 3 le versioni: bianco+riquadro anta, poi bianco+riquadro vetro vero, poi grigio+riquadro vetro vero). Script `tsx` temporanei (cancellati dopo l'uso) su `drawInfisso` con mock sink:
- Prima versione (riquadro anta, sbagliata): coordinate `(40,40)-(460,350)` per `cAm()` — includevano lo spessore del fermavetro.
- Versione corretta (riquadro vetro vero, `fvPx=10`): `(50,50)-(450,350)` e `(50,650)-(450,350)` per `cAm()` (cerniera sx) — dentro il vetro vero, non nel fermavetro.
- `mAc()` (cerniera dx): speculare.
- `mRc()` (ribalta, cerniera dx): identico ad anta (stessa logica hingeLeft).
- `V()` (vasistas): dal basso alla mezzeria alta, stesso inset.
- `cZ()` (zoccolo, spessore default = profilo): coppia di linee identica ad anta, confermato dopo l'estensione.
- `cZ120()` (zoccolo custom 120mm): coppia di linee con riquadro vetro correttamente più corto (mezzeria a y=330 invece di 350, per il vetro che si ferma prima).

### Seconda coppia di linee per R (ribalta) — rossa

Ulteriore richiesta: R ha ANCHE una seconda coppia di linee che si aggiunge a quella blu (già condivisa con A/Z) — rappresenta la seconda modalità di apertura (anta-ribalta: apre sia a battente che a vasistas). Geometria data dall'utente: "dai due angoli in basso verso la mezzeria del lato superiore, sempre filo vetro" — identica alla formula già usata per il vasistas (`kind==='vasistas'`), ma colore rosso (`#dc2626`) invece di blu, e SOLO per `kind==='ribalta'` (si aggiunge alla coppia blu esistente, non la sostituisce).

Verificato con script `tsx`: `mRc()` produce 2 linee blu (`#1a56db`, pattern anta/cerniera) + 2 linee rosse (`#dc2626`, pattern vasistas-like, dagli angoli inferiori del vetro vero alla mezzeria superiore) — 4 linee totali. `cAm()` e `cZ()` producono solo le 2 blu, nessuna rossa (confermato che la seconda coppia è esclusiva di R).

**Correzione finale**: "vasistas V ha la stessa coppia rossa (solo la coppia rossa)" — il vasistas puro non usa più il blu (come prima, per errore ereditato dalla prima stesura) ma condivide lo stesso rosso/stessa geometria della seconda coppia di R, ed è l'UNICA coppia per V (niente blu). Codice riorganizzato: il blocco blu resta per `anta|ribalta|zoccolo` (basato su `hingeLeft`), il blocco rosso (`VASISTAS_STROKE`, stessa geometria "angoli inferiori → mezzeria superiore") ora copre `vasistas|ribalta` — per la ribalta si SOMMA al blu (2+2 linee), per il vasistas è l'unica (2 linee).

Verificato: `V()` → solo 2 linee rosse; `mRc()` → 2 blu + 2 rosse; `cAm()` → solo 2 blu. `npx tsc --noEmit` pulito, `npm run lint` invariato in ogni iterazione di questa correzione.

Stato: **completato**.

---

## Iterazione 15 — simbolo croce rossa per i fissi (F), verde per V/R

Richiesta: un simbolo per i fissi (F, che non si aprono) — rosso; V/R passano dal rosso al verde, così verde+blu indicano movimento, rosso indica staticità.

### Colori — `lib/infisso-drawing.ts`

Costanti spostate a livello di modulo (prima erano locali a `drawAnta`, ora condivise anche da `pushFermavetri`): `APERTURA_STROKE` (blu, invariato), `VASISTAS_STROKE` (era rosso `#dc2626`, ora verde `#16a34a`), nuova `FISSO_STROKE` (rosso `#dc2626`, riprende il valore liberato dal vasistas), `SIMBOLO_DASH` (rinominata da `APERTURA_DASH`, stesso valore `4 3`).

### Simbolo — `pushFermavetri()`

Nuovo parametro `isFisso = false`. Quando `true`, disegna in più una **croce** (+, non X — cambiata su indicazione dell'utente: "anziché la X rossa fai una croce rossa") nel vetro vero (inset di `fvPx`, stesso vincolo delle altre linee): una linea verticale e una orizzontale che si incrociano nel centro del vetro, colore `FISSO_STROKE`, senza tratteggio (a differenza delle linee di apertura, che sono tratteggiate).

### Problema logico segnalato dall'utente — dove si applica la croce

Prima stesura: avevo marcato con la croce OGNI foglia `F()`, compreso il caso in cui `F()` è semplicemente il contenuto interno di un'anta/ribalta/zoccolo/vasistas (es. `cAm(F())`, `mAc(X()+T+F())`) — ma quel vetro si apre insieme al genitore (anta), non è affatto un vetro fisso indipendente: quasi tutti gli esempi in `ESEMPI_ABBR` scrivono `F()` così, quindi quasi ogni anta avrebbe mostrato la croce, contraddicendo lo scopo del simbolo. L'utente ha confermato la regola esatta: **"il fisso è fisso quando è figlio diretto di un telaio, separato magari da qualche P o T. Ma se è dentro una A R Z V allora non è fisso ma è semplicemente un vetro. Va marcato con la croce rossa solo quando figlio di telaio."**

Implementazione coerente con questa regola:
- **`drawInfisso()`** (livello Tc/Ta, top-level, anche dentro gruppi `X(...)`/`N(...)` fratelli del telaio): `pushFermavetri(sink, x, y, w, h, style, true)` — croce presente.
- **`drawAnta()`** (contenuto interno di un'anta/ribalta/zoccolo/vasistas, a QUALUNQUE profondità di annidamento, es. il proprio T/P interno): `pushFermavetri(sink, x, y, w, h, style)` — **nessuna** croce (default `false`), perché quel vetro si apre assieme al genitore.

### Verifica

`npx tsc --noEmit` pulito, `npm run lint` invariato (stesso baseline). Script `tsx` temporanei (cancellati dopo l'uso):
- `cAm(F())` e `mAc(X()+T+F())`: 0 croci (vetro dell'anta, si apre col genitore).
- `Tc(F()+T+mAc(F()))`: 1 croce (sul primo `F()`, fratello diretto del telaio separato da T), nessuna sul vetro dentro `mAc(...)`.
- `Tc(X(F())+P+mAc(F()))`: 1 croce sul `F()` dentro il gruppo `X(...)` (fratello del telaio), nessuna dentro `mAc(...)`.
- `V()`: ora verde (`#16a34a`) invece di rosso. `mRc()`: blu + verde. `Tc(F())`: croce rossa verticale a x=250, orizzontale a y=350 (centro esatto del vetro vero).

Stato: **completato**.

---

## Iterazione 16 — maniglia troppo vicina al bordo superiore → centrata a metà finestra

Richiesta: quando l'altezza ergonomica della maniglia (misurata da terra, `handleFromBottomCm`) porrebbe la maniglia troppo vicina al bordo superiore di una finestra bassa, riposizionarla a metà della finestra — distanza relativa alla finestra stessa, non più alla stanza.

### Implementazione — `lib/infisso-drawing.ts`, `drawAnta()`

Nel blocco maniglia (ramo non-vasistas): calcolata `myFromFloor` come prima (formula invariata, da terra), poi se `myFromFloor < ay + p` (il bordo superiore della maniglia finirebbe al/sopra il bordo interno superiore dell'anta) si sostituisce con `ay + ah/2 - mH/2` (centro verticale dell'anta stessa). Nessun altro punto toccato: cerniere, larghezza, colore invariati.

### Verifica

`npx tsc --noEmit` pulito, `npm run lint` invariato. Script `tsx` temporaneo: finestra normale (handle ben dentro l'altezza) → posizione invariata rispetto alla formula da terra; finestra bassa (50cm) con `handleFromBottomCm=130` (che darebbe una posizione sopra il bordo) → maniglia centrata esattamente a metà anta (y=87.5, calcolo a mano: `ay+ah/2-mH/2 = 20+105-37.5 = 87.5`).

Stato: **completato**.
