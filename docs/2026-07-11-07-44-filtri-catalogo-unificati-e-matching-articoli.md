# Filtri catalogo unificati (classificazione + filtri catalogo + filtri modello) e matching articoli coerente

**Data:** 2026-07-11
**Stato:** completato (solo `app/serramenti/infissi-in-alluminio` — le altre pagine categoria restano da migrare in un secondo giro)

---

## Contesto / problema riscontrato

Una voce di catalogo (PDF) ha tre gruppi di filtro, oltre al percorso categoria/sottocategoria:

1. **Classificazione**: fase, materiale, tipologia, ambiente, fascia
2. **Filtri catalogo**: battente, scorrevole, taglio termico, taglio freddo, economico, fascia alta (colonne `filtro_battente` ecc. su `catalogo_voci`)
3. **Filtri modello**: 1 anta, 2 ante, 3+ ante, sopraluce (colonne `filtro_1..4` su `catalogo_voci` e su `listini`)

Verificando il codice reale (non solo i doc esistenti, che su questo punto erano in parte aspirazionali/mai completati):

- I filtri **classificazione** hanno una cascata funzionante in `catalogo-wrapper.tsx`, applicata sia ai PDF mostrati sia agli articoli — ma solo dove i dati sono popolati.
- I filtri **catalogo** (6 flag) esistono come "linguette" pillola, ma filtrano **solo** i PDF mostrati; sugli articoli applicano solo un match approssimativo per sottocategoria testuale, non un vero AND sui 6 flag.
- I filtri **modello** (`filtro_1..4`, incluso "Sopraluce") **non hanno alcuna rappresentazione nella UI** — esistono solo come colonne DB, usate esclusivamente dentro `matchArticoliPerVoce()`.
- **Aprire un PDF specifico non applica alcun filtro automatico**: `selectVoce()` si limita a `setSelectedVoce(voce)`, senza toccare lo stato dei filtri.
- Le pagine `/serramenti/*` (15 pagine, e verosimilmente `/legno/*`, `/metallurgia/*`, `/arredi/*`, `/tessuti/*`) usano ancora una query "piatta" per gli articoli — tutti gli articoli della coppia categoria+sottocategoria in un unico blocco, **senza matching per singola voce**. Solo `app/brand/cataloghi/[slug]/page.tsx` e `app/app/cataloghi/[slug]/page.tsx` usano `matchArticoliPerVoce()` (il matching corretto, per-voce, su tutti e 3 i gruppi + classificazione).

Risultato: flaggare "Sopraluce" (o qualunque filtro modello) su un catalogo oggi non ha alcun effetto visibile da nessuna parte del sito.

---

## Comportamento desiderato

1. Un'unica barra filtri con tutti e tre i gruppi (classificazione + filtri catalogo + filtri modello), ciascun controllo visibile solo se almeno una voce ha un valore per quel campo.
2. Ogni filtro impostato manualmente si applica in AND sia ai cataloghi PDF mostrati sia agli articoli proposti sotto (cascata unica — oggi invece i filtri catalogo e i filtri modello sono disallineati tra loro e rispetto agli articoli).
3. **Aprendo un PDF specifico**: i filtri si auto-impostano sui valori di quella voce (classificazione + filtri catalogo + filtri modello) e restano bloccati (disabilitati) finché il PDF è aperto. La lista articoli si restringe a quelli che soddisfano *tutti* questi valori in AND — quindi si vedranno meno articoli rispetto alla vista iniziale senza PDF selezionato.
4. **Chiudendo il PDF (✕)**: i filtri tornano allo stato manuale precedente all'apertura (salvato prima del click).
5. Tutte le pagine categoria (non solo brand/app) usano `matchArticoliPerVoce()` per il matching articoli, in modo che il comportamento sia coerente ovunque nel sito.

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` | Riscrittura cascata filtri: unione dei 3 gruppi (aggiunta filtri modello, oggi assenti), `selectVoce()` con auto-fill + lock dei controlli, `closeVoce()` con ripristino stato precedente (`savedFilters`) |
| Tutte le `app/serramenti/*/page.tsx` (15) + verosimilmente `/legno/*`, `/metallurgia/*`, `/arredi/*`, `/tessuti/*` (da confermare elenco esatto in fase di esecuzione) | Sostituire la query piatta di `articoliPerListino` con `matchArticoliPerVoce()`, come già fatto in `app/brand/cataloghi/[slug]/page.tsx` |
| `lib/catalogo-matching.ts` | Nessuna modifica di logica prevista (già corretto) |
| `app/area-lavoro/cataloghi/cataloghi-client.tsx` | Solo verifica che l'editor esponga già tutti i campi necessari (risulta di sì, `FLAG_MODELLO` incluso "Sopraluce") |

---

## Decisioni confermate dall'utente

1. **Lock filtri quando un PDF è aperto**: controlli **disabilitati** (visibili, non modificabili), non sostituiti da testo statico.
2. **Match articolo/catalogo per tipo di campo**:
   - **Flag booleani** (filtri catalogo: battente/scorrevole/tt/taglio freddo/economico/fascia alta; filtri modello: 1 anta/2 ante/3+ ante/sopraluce): match **rigoroso**. Se il catalogo (o il filtro attivo) ha il flag a 1, l'articolo deve avere lo stesso flag a 1, altrimenti escluso.
   - **Campi stringa classificazione** (fase, materiale, tipologia, ambiente, fascia): match **tollerante**. Se il filtro/catalogo ha un valore su un campo, l'articolo passa se ha lo **stesso valore** oppure se ha quel campo **vuoto/null** (vuoto = "va bene con qualunque valore", non è stato ristretto). Stessa logica già usata oggi per la sottocategoria negli articoli, da estendere a tutti i campi stringa sia nella cascata manuale (`catalogo-wrapper.tsx`) sia in `matchArticoliPerVoce()`.
3. **Ambito migrazione pagine**: tutte le categorie (`/serramenti/*`, `/legno/*`, `/metallurgia/*`, `/arredi/*`, `/tessuti/*`), non solo infissi-in-alluminio.
4. **Filtri catalogo (battente/scorrevole/tt/taglio freddo/economico/fascia alta)**: restano fuori da questo giro — continuano a filtrare solo la lista PDF mostrata, **non** si propagano agli articoli (non esiste una colonna corrispondente su `listini`, e non se ne aggiunge una per ora). Non vengono nemmeno auto-compilati/bloccati all'apertura di un PDF.

---

## Riepilogo implementazione effettiva (dopo correzioni in corso d'opera)

Durante il test è emerso che il modello iniziale era sbagliato su un punto chiave, corretto dall'utente:

- **La base articoli/PDF di una pagina categoria resta fissa**: è definita solo dal percorso di pagina (es. `categoria=Serramenti, sottocategoria=Infissi in alluminio`), **non** da un match per-singola-voce via `catalogo_voci_percorsi` (quello che fa `matchArticoliPerVoce()`, mai effettivamente collegato a nessuna pagina — resta così, non utilizzato). La pagina `app/serramenti/infissi-in-alluminio/page.tsx` è tornata alla query piatta originale su `listini_percorsi` per il percorso di pagina.
- **Aprendo un PDF**, i suoi valori di classificazione (fase/materiale/tipologia/ambiente/fascia) e i filtri modello diventano filtri aggiuntivi sulla **stessa** base fissa (non un set diverso), tramite la stessa cascata client usata per i filtri manuali — nessuna scorciatoia server-side separata.
- **La sottocategoria della voce non viene ereditata/bloccata** all'apertura di un PDF: è il percorso di pagina (uguale per tutte le voci), non un valore di classificazione dell'articolo — includerla causava un azzeramento totale degli articoli (la sottocategoria delle voci vale sempre "Infissi in alluminio", mentre quella degli articoli nei test valeva "Battente"/"Scorrevole", due tassonomie diverse con lo stesso nome di campo).
- **I filtri catalogo (linguette battente/scorrevole/tt/tf/economico/fascia alta) filtrano solo l'elenco PDF**, mai gli articoli — rimossa la logica residua che li applicava agli articoli via match testuale sulla sottocategoria.

File toccati nell'implementazione: `lib/catalogo-matching.ts` (match tollerante sui campi stringa, funzione non ancora collegata a nessuna pagina), `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` (cascata unificata + filtri modello + auto-fill/lock/restore), `app/brand/cataloghi/[slug]/catalogo-client.tsx` (fix indice fuori range), `app/serramenti/infissi-in-alluminio/page.tsx` (verificato/confermato sulla query piatta per percorso di pagina).

## Prossimi passi

Migrare le altre pagine categoria (`/serramenti/*` restanti, `/legno/*`, `/metallurgia/*`, `/arredi/*`, `/tessuti/*`) alla stessa cascata — al momento hanno ancora selezioni di voci più semplici che non includono i campi di classificazione/filtri modello. Da fare in un giro successivo, dopo conferma che il comportamento su questa pagina è quello corretto.
