# Bonifica pagine linkabili da due elementi di nav diversi

**Stato**: completato

## Obiettivo

Nessuna pagina pubblica deve essere raggiungibile da due voci di navigazione diverse con due id diversi (causa doppie checkbox in "Pagine visibili"). Regola concordata: vince la gerarchia di nav **attuale** — se una pagina esiste sotto due url, viene fisicamente riposizionata sotto l'url della sezione che la mostra oggi nel menu, creando quella sezione/url se non esiste.

## Diagnosi completa (scansione di tutto `lib/nav-config.ts`)

Confrontando tutte le liste di pagine pubbliche, le uniche 4 pagine con **stesso href ma id diverso in due punti diversi** sono:

| Pagina | Href attuale | Id "vecchio" (categoryGroups) | Id "Riqualificazione Energetica" (prodottiPages) |
|---|---|---|---|
| Infissi in PVC | `/serramenti/infissi-in-pvc` | 202 (Serramenti) | 291 |
| Persiane in Alluminio | `/serramenti/persiane-in-alluminio` | 204 (Serramenti) | 294 |
| Monoblocchi | `/serramenti/monoblocchi` | 205 (Serramenti) | 296 |
| Infissi in Legno | `/legno/infissi-in-legno` | 249 (Legno) | 292 |

Tutte e 4 sono **già nascoste** dal dropdown Serramenti/Legno (`HIDDEN_FROM_CATEGORY`) e **già navigate** con `getProdottiNeighbors` nel loro `page.tsx` (prev/next già nella catena Riqualificazione Energetica) — la migrazione a suo tempo è stata fatta solo a metà: manca lo spostamento vero e proprio dell'URL, del breadcrumb, del canonical e la pulizia delle voci residue in `categoryGroups` (causa delle doppie checkbox in admin).

Ho controllato anche gli altri 6 elementi di `prodottiPages` (290, 293, 295, 297, 298, 299): non hanno alcun duplicato in `categoryGroups`, quindi restano dove sono, nessuna azione.

*(Trovati anche 2 casi con stesso href/id diverso in aree interne — `/area-clienti/avvisi` id 55/56 e `/area-lavoro/cantieri` id 28/31 — ma sono varianti per ruolo diverso, non visibili contemporaneamente allo stesso utente: non li tocco, fuori tema rispetto a questa bonifica.)*

## Approccio scelto: rewrite + redirect (stesso pattern già usato per `/chi-siamo` ↔ `app/brand`)

Non sposto le cartelle fisiche in `app/` (zero rischio sulla logica DB/carrello/preventivi già funzionante). Uso lo stesso meccanismo già collaudato in `next.config.ts`:
- **rewrite**: `/riqualificazione-energetica/<slug>` → serve silenziosamente la pagina fisica esistente (`/serramenti/<slug>` o `/legno/infissi-in-legno`)
- **redirect 301 permanente**: vecchio url → nuovo url canonico (fondamentale per SEO, il sito ha appena sistemato problemi di indicizzazione simili)

## File da modificare

### 1. `next.config.ts`
4 nuove regole `rewrites()` + 4 nuove regole `redirects()` (vecchio → nuovo url).

### 2. `lib/nav-config.ts`
- Rimuovo del tutto gli id 202, 204, 205 da `categoryGroups.serramenti.pages` e l'id 249 da `categoryGroups.legno.pages`
- Aggiorno `HIDDEN_FROM_CATEGORY.serramenti` togliendo 202/204/205 (restano solo i 5 id del gruppo Comfort, tuttora validi); rimuovo del tutto `legno: [249]` (non serve più nasconderlo, non esiste più lì)
- Aggiorno gli `href` di `prodottiPages` id 291, 292, 294, 296 ai nuovi url `/riqualificazione-energetica/...`

Effetto automatico: la card "Riqualificazione Energetica" nel pannello admin "Pagine visibili" (che già lista tutto `prodottiPages`) resta invariata nel contenuto; le card "Serramenti"/"Legno" perdono le 3+1 righe duplicate. **Nessuna modifica necessaria a `settings-form.tsx`** per la deduplica in sé.

### 3. Le 4 pagine fisiche (`app/serramenti/infissi-in-pvc`, `persiane-in-alluminio`, `monoblocchi`, `app/legno/infissi-in-legno`)
Nessuna modifica alla logica DB/carrello/preventivi. Solo:
- `metadata.alternates.canonical` e `metadata.openGraph.url` → nuovo url
- Breadcrumb: da `<Link href="/serramenti">Serramenti</Link> / X` a testo semplice non cliccabile **"Riqualificazione Energetica / X"** (stessa convenzione già usata per le intestazioni non cliccabili di `prodottiSubgroups`) — non esiste una pagina hub per Riqualificazione Energetica a cui linkare
- Bottone nero "← Serramenti"/"← Legno" nello sticky bar → sostituito da `NavDropdownTriggerButton dropdownId="prodotti" label="← Riqualificazione Energetica"` (bottone oro, apre il menu a tendina — stesso meccanismo già usato altrove per i fallback verso questa sezione, es. in `vetrate-panoramiche/page.tsx`)
- Prev/next: **nessuna modifica**, già corretti (`getProdottiNeighbors`)

### 4. `app/serramenti/page.tsx` e `app/legno/page.tsx` (pagine indice di categoria)
Rimuovo le card "Infissi in PVC", "Persiane in Alluminio", "Monoblocchi" (da Serramenti) e "Infissi in Legno" (da Legno): non sono più sottocategorie di quelle sezioni. Anche l'indice di categoria è a tutti gli effetti un elemento di nav che le linkava due volte.

### 5. `app/page.tsx` (home)
Le 4 card in home sono contenuti promozionali curati a mano (non un menu di categoria) e restano — aggiorno solo l'`href` di ciascuna al nuovo url canonico, per evitare un redirect superfluo al click.

### 6. `app/sitemap.ts`
Aggiorno le 4 righe con il nuovo url.

## Punti su cui vorrei conferma prima di scrivere codice

1. **Rimozione card da `/serramenti` e `/legno`** (punto 4): sei d'accordo che queste 4 pagine spariscano anche dagli indici di categoria, non solo dal dropdown? È la lettura più coerente di "non linkabile da due elementi diversi", ma è un cambio di contenuto visibile su quelle pagine.
2. **Pannello "Pagine visibili" in admin** — "fai gli item che mancano e metti i sottoitems nella posizione giusta": una volta tolti i duplicati da `categoryGroups`, la colonna "Riqualificazione Energetica" del pannello admin contiene già tutti e 10 gli elementi (nessun item manca davvero). L'unica cosa che oggi manca rispetto al menu reale del sito è la suddivisione visiva in due sottogruppi ("Infissi Isolanti Termoacustici" / "Sistemi Oscuranti", da `prodottiSubgroups`, già usata nel dropdown pubblico) — vuoi che la aggiunga anche nel pannello admin, o va bene la lista piatta attuale?
3. Ho trovato un bug di codifica preesistente e non collegato in `app/serramenti/persiane-in-alluminio/page.tsx` (caratteri tipo "â€”" al posto di "—" in titolo/descrizione SEO e in una stringa di preventivo). Lo lascio stare per questa bonifica o lo sistemo già che tocco quel file?

Attendo conferma (ed eventuali risposte ai 3 punti sopra) prima di procedere.

## Riepilogo implementazione

Confermato dall'utente: 1=sì (rimuovere le card dagli indici categoria), 2=sì (sottogruppi visivi anche in admin), 3=sì (fix mojibake). Eseguito come da piano:

- **`next.config.ts`**: 4 redirect 301 (vecchio → `/riqualificazione-energetica/...`) + 4 rewrite (nuovo url → cartella fisica invariata). Aggiornato anche il vecchio redirect legacy `/serramenti/imbotti` per puntare direttamente alla destinazione finale invece di incatenare un doppio redirect.
- **`lib/nav-config.ts`**: rimossi gli id 202/204/205 da `categoryGroups.serramenti` e 249 da `categoryGroups.legno`; ripulito `HIDDEN_FROM_CATEGORY` (tolti i 3 id da `serramenti`, rimossa la chiave `legno` non più necessaria); aggiornati gli `href` di `prodottiPages` (291, 292, 294, 296) ai nuovi url.
- **Le 4 pagine fisiche** (`app/serramenti/infissi-in-pvc`, `persiane-in-alluminio`, `monoblocchi`, `app/legno/infissi-in-legno`): canonical/OG url aggiornati; breadcrumb ora testo semplice non cliccabile "Riqualificazione Energetica / X"; bottone nero "← Serramenti/Legno" sostituito da `NavDropdownTriggerButton dropdownId="prodotti"` (oro, apre il menu); prev/next lasciati invariati (già corretti). In `persiane-in-alluminio` corrette anche le 3 occorrenze di codifica errata (`â€”` → `—`) in title/OG/label preventivo.
- **`app/serramenti/page.tsx` e `app/legno/page.tsx`**: rimosse le 4 card ridondanti dagli indici di categoria.
- **`app/page.tsx`**: aggiornati gli `href`/gate `ok()` delle 4 card promozionali in home al nuovo url (card lasciate, sono contenuto curato non menu).
- **`app/sitemap.ts`**: spostate le 4 righe in una nuova sezione `/riqualificazione-energetica/...`.
- **`app/amministrazione/impostazioni/settings-form.tsx`**: aggiunto supporto a `subgroups` in `PAGE_GROUPS`; la colonna "Riqualificazione Energetica" ora mostra le due sotto-intestazioni "Infissi Isolanti Termoacustici" / "Sistemi Oscuranti" (da `prodottiSubgroups`, riusate dal menu pubblico) invece di un'unica lista piatta.

Verifiche: `tsc --noEmit` pulito (unico errore residuo preesistente, cache `.next` della vecchia rotta `pagine/[id]`, non collegato); `eslint` sui file toccati senza nuovi errori/warning (i problemi rilevati in `settings-form.tsx`/`app/page.tsx` sono preesistenti, fuori dalle righe modificate); scansione automatica di tutto `lib/nav-config.ts` per altri href duplicati: nessun altro caso pubblico oltre ai 4 gestiti (segnalati solo 2 casi interni per-ruolo, fuori scope, non toccati).

## Fase 2 — estensione a tutti i menu flat (stessa sera, su richiesta esplicita)

L'utente ha fatto notare (giustamente) un'incoerenza: `/edilizia/solarium` non rifletteva affatto la sua posizione reale in nav (Spazi Esterni e Comfort), esattamente come le altre pagine "prestate" a Comfort e Spazi Esterni / Antintrusione e Sicurezza / Carpenteria d'Arredo restavano sotto le url delle categorie d'origine (Serramenti/Metallurgia). Indicazione ricevuta: l'url deve sempre riflettere la struttura di nav attuale (voce principale + voce secondaria), non la categoria storica d'origine — applicata quindi a **tutte** le pagine "prestate" a un menu flat, non solo al caso Riqualificazione Energetica già sistemato.

**Nuovi namespace url creati** (stesso meccanismo rewrite+redirect, nessuna cartella fisica spostata):
- `/riqualificazione-energetica/*` — completati i 6 elementi rimasti (`infissi-in-alluminio-taglio-termico`, `infissi-in-legno-alluminio`, `persiane-in-pvc`, `cassonetti-in-pvc`, `tapparelle-in-alluminio`, `tapparelle-in-pvc`), che non avevano un id duplicato ma vivevano comunque solo sotto `/serramenti/*` senza voce propria nel dropdown Serramenti.
- `/comfort-e-spazi-esterni/*` — 7 pagine (Vetrate Panoramiche, Pergole Bioclimatiche, Verande in Alluminio, Verande in PVC, Zanzariere, Piscine, Solarium).
- `/antintrusione-e-sicurezza/*` — 5 pagine (Porte Blindate Riv. Legno/Alluminio/PVC, Grate, Cancelli).
- `/carpenteria-arredo/*` — 4 pagine (Scale a Rampe, Scale a Chiocciola, Ringhiere, Balconi).

**File toccati** (22 pagine in più rispetto alla fase 1):
- `next.config.ts`: 22 redirect 301 + 22 rewrite in più (stesso pattern).
- `lib/nav-config.ts`: rimossi del tutto da `categoryGroups.serramenti`/`metallurgia`/`edilizia` tutti gli id ora "prestati"; `HIDDEN_FROM_CATEGORY` è ora vuoto (non serve più, tutte le pagine hanno url e id propri); aggiornati gli `href` di `comfortSpaziEsterniPages`, `antintrusioneSicurezzaPages`, `carpenteriaArredoPages` e i 6 `prodottiPages` rimasti.
- Le 22 pagine fisiche: canonical/OG url, breadcrumb (testo semplice non cliccabile col nome del menu flat) e bottone hub (nero → `NavDropdownTriggerButton` oro del menu flat corrispondente) aggiornati con uno script Node mirato (poi 6 fix manuali per import mancante per via di terminatori di riga CRLF non gestiti dalla regex, e 4 fix per apostrofo non escapato in "Carpenteria d'Arredo" dentro JSX, rilevato da eslint). Prev/next lasciati invariati, già corretti in tutte le 22 pagine.
- `app/serramenti/page.tsx`, `app/metallurgia/page.tsx`, `app/edilizia/page.tsx`: rimosse tutte le card delle pagine ora prestate.
- `app/page.tsx`: aggiornati gli `href`/gate `ok()` di 14 card promozionali in home.
- `app/sitemap.ts`: create le sezioni `/antintrusione-e-sicurezza`, `/carpenteria-arredo`, `/comfort-e-spazi-esterni`; completata `/riqualificazione-energetica`; ripulite le sezioni Serramenti/Metallurgia/Edilizia.
- `app/amministrazione/impostazioni/settings-form.tsx`: aggiunti i 3 gruppi mancanti ("Comfort e Spazi Esterni", "Antintrusione e Sicurezza", "Carpenteria d'Arredo") al pannello "Pagine visibili" — prima non comparivano affatto come colonna propria, solo dentro Serramenti/Metallurgia con url ormai superata.

Verifiche finali: `tsc --noEmit` e `eslint` puliti su tutti i file toccati; scansione automatica di `lib/nav-config.ts` ripetuta — zero duplicati pubblici residui (solo i 2 casi interni per-ruolo già segnalati, invariati, fuori scope).
