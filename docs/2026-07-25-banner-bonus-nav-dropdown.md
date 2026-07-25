# Banner evidenziato nei dropdown "Riqualificazione Energetica" e "Ristrutturazioni Chiavi in Mano"

Stato: **completato** (2026-07-25)

## Riepilogo modifiche effettive

Confermato con: contenuto placeholder generico per la pagina bonus, link "Ristrutturazioni" che riusa la stessa logica condizionale della home (avvisa di registrarsi/loggarsi se il computo metrico non è abilitato, tramite `/aiuto/guida-computometrico` che ha già un banner di registrazione).

- `app/globals.css`: nuova classe `.nav-banner-bonus` — pill verde acceso (`#a8e600`), testo nero grassetto maiuscolo, ombra, hover brightness.
- `app/bonuss-riqualificazione/page.tsx` — **nuova**, contenuto segnaposto ("contenuto in aggiornamento, contattaci"), da completare con dati fiscali verificati in seguito.
- `components/navbar.tsx`:
  - `ProdottiDropdown` (Riqualificazione Energetica): il pannello aperto ora è un wrapper flex-column con il box esistente + banner `.nav-banner-bonus` sotto, che linka a `/bonuss-riqualificazione`.
  - `RistrutturazioniDropdown`: stessa ristrutturazione, nuova prop `computometricoHref`; banner "Computo Metrico Online" che linka a `computometricoHref`.
  - Nuovo calcolo `computometricoHref` nel componente `Navbar`, stessa logica già in `app/page.tsx` (`ctaComputometrico`): se abilitato → `/area-clienti/computometrici` (loggato) o `/area-clienti/carrello-computometrico`; altrimenti → `/aiuto/guida-computometrico` (pagina che already mostra l'avviso "devi registrarti/loggarti").
  - Stessi due banner aggiunti anche nel menu mobile (`MobileSection` "prodotti" e "ristrutturazioni").
- Non aggiunto al pannello admin "Pagine visibili" — è un banner promozionale fisso legato al dropdown, non una voce di catalogo con id proprio.

---


## Obiettivo

Aggiungere, sotto il pannello del dropdown (quando aperto), un bottone/banner molto evidenziato (verde acceso, testo nero in grassetto, pill arrotondata — vedi `screen.png` sul Desktop) che porti a:

1. **Dropdown "Riqualificazione Energetica"** → nuova pagina `/bonuss-riqualificazione`, da scrivere da zero.
2. **Dropdown "Ristrutturazioni Chiavi in Mano"** → pagina esistente del computo metrico (verosimilmente `/area-clienti/carrello-computometrico`, o la logica già usata in home per instradare in base a permessi/login), in attesa di un futuro wizard "prima idea di preventivo edile".

## File coinvolti

- `components/navbar.tsx` — `ProdottiDropdown` (Riqualificazione Energetica) e `RistrutturazioniDropdown`: aggiungere il banner sotto il pannello aperto, sia in versione desktop che nel menu mobile equivalente.
- `app/globals.css` — nuova classe per lo stile del banner (verde acceso, pill).
- `app/bonuss-riqualificazione/page.tsx` — **nuova** pagina, contenuto da scrivere.
- `lib/nav-config.ts` — eventuale registrazione della pagina se deve comparire nel pannello admin "Pagine visibili" (da valutare, essendo un banner promozionale più che una voce di menu tradizionale).

## Domande da confermare prima di procedere

1. **Contenuto `/bonuss-riqualificazione`**: è materia fiscale (bonus/detrazioni per riqualificazione energetica — Ecobonus, bonus ristrutturazioni, ecc.). Info fiscali sbagliate o superate sono un rischio concreto per l'azienda. Preferisci:
   - (a) una pagina con testo segnaposto generico (tipo "Bonus e detrazioni fiscali — contenuto in aggiornamento, contattaci per info") pubblicata subito, contenuto vero da inserire dopo con dati verificati da voi, oppure
   - (b) mi fornisci già ora i testi/dati fiscali esatti da inserire?
2. **Destinazione banner "Ristrutturazioni"**: link diretto e fisso a `/area-clienti/carrello-computometrico`, oppure riuso della stessa logica condizionale già presente in home (`ctaComputometrico` in `app/page.tsx:91`, che manda a `/aiuto/guida-computometrico` se il computo metrico non è abilitato per l'utente)?
3. **Etichette dei due bottoni**: nello screenshot c'è "BONUS BLA BLA DETRAZIONI" come testo segnaposto — per il banner "Riqualificazione" va bene un placeholder simile (es. "BONUS E DETRAZIONI FISCALI") in attesa del testo definitivo? E per quello di "Ristrutturazioni" (es. "COMPUTO METRICO ONLINE")?
4. **Visibilità mobile**: lo stesso banner va replicato anche nel menu mobile (sezione a tendina "Riqualificazione Energetica" / "Ristrutturazioni Chiavi in Mano"), giusto?
5. **Pannello admin**: la nuova pagina va aggiunta al pannello "Pagine visibili" (disattivabile dall'admin) o resta sempre visibile, essendo più un banner promozionale che una voce di catalogo?

In attesa di conferma esplicita prima di scrivere codice.
