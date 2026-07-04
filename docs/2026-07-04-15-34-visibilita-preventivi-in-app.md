# Applicare le regole di visibilità Preventivi anche in /app

**Data:** 2026-07-04
**Stato:** completato

## Riepilogo implementazione

Tutti i punti del piano implementati come descritto, redirect verso `/app` (non
verso il sito) confermato. Type-check (`tsc --noEmit`) pulito.

## Obiettivo

Sul sito web, quando l'admin toglie a `cliente` il permesso "Preventivi" (id 52 in
`rolePermissions['cliente']`, gestito da `/amministrazione/impostazioni`), l'accesso
al flusso preventivo viene bloccato sia per i clienti loggati che per gli sloggati
(guest = permessi di `cliente`):

- `app/page.tsx` (home) sceglie l'href della CTA in base al flag
- `app/area-clienti/carrello-preventivo/page.tsx:252-256` fa redirect a
  `/aiuto/guida-preventivo` se non staff e permesso assente
- `app/area-clienti/carrello-computometrico/page.tsx:144-148` stesso pattern per il
  computo metrico (id 54)
- `components/navbar.tsx:158-159,258-266` nasconde le voci di menu corrispondenti

La sezione `/app` (PWA) **non applica nessuna di queste regole**: `app/app/carrello-preventivo/page.tsx`
non fa nessun controllo di permesso, `app/app/preventivo/page.tsx` richiede solo il
login, `app/app/app-bottom-nav.tsx` mostra sempre le voci "Preventivi" e "Simulazione",
e `app/app/home-cards.tsx` mostra sempre le card "Preventivi" e "Simulazione preventivo".
Risultato: chi disabilita Preventivi per i clienti dal pannello admin, lo vede sparire
sul sito ma non nell'app.

## Cosa verrà implementato

Applicare in `/app` esattamente le stesse regole già esistenti sul sito (nessuna
regola nuova, solo replica):

1. **`app/app/layout.tsx`**: leggere anche `rolePermissions` da `readSettings()`,
   calcolare `preventiviAbilitato = isStaff || (rolePermissions['cliente'] ?? []).includes(52)`,
   passarlo come prop ad `AppBottomNav`.
2. **`app/app/app-bottom-nav.tsx`**: nuova prop `preventiviAbilitato: boolean`.
   Quando `false`, rimuovere dalla lista voci sia "Preventivi" (`/app/preventivo`,
   solo lista loggati) sia "Simulazione" (`/app/carrello-preventivo`, presente sia
   per loggati che per sloggati quando il carrello non è vuoto).
3. **`app/app/page.tsx`**: calcolare lo stesso flag e passarlo come prop
   `preventiviAbilitato` a `HomeCards`.
4. **`app/app/home-cards.tsx`**: nuova prop `preventiviAbilitato: boolean`. Quando
   `false`, non renderizzare la card "Preventivi" né la card "Simulazione preventivo".
5. **`app/app/carrello-preventivo/page.tsx`**: aggiungere lo stesso guard di
   permesso presente in `app/area-clienti/carrello-preventivo/page.tsx:252-256`
   (stessa condizione: non staff e permesso assente), ma con destinazione
   **adattata** a `redirect('/app')` invece che `/aiuto/guida-preventivo`. Vedi
   sezione "Redirect di destinazione" più sotto per il motivo.

## Cosa NON verrà toccato (per coerenza con le regole esistenti sul sito)

- `app/app/preventivo/page.tsx` (lista preventivi salvati): sul sito
  `app/area-clienti/preventivi/page.tsx` non applica il flag, richiede solo il
  login — stesso comportamento in app, nessuna modifica.
- Computo metrico (id 54): non menzionato dall'utente in questa richiesta, resta
  fuori scope.

## Redirect di destinazione

Verificato con `grep -rn "redirect(" app/app`: **ogni** redirect esistente dentro
la sezione `/app` (login, cantiere, avvisi, documenti, preventivo, carrello-acquisti,
ecc.) punta sempre a un'altra pagina sotto `/app/...` o a `/app` stesso — mai al
sito principale. Usare `/aiuto/guida-preventivo` (fuori da `/app`) romperebbe
questa convenzione, facendo uscire l'utente dalla shell dell'app (niente più
bottom-nav, topbar app, ecc.) — comportamento che oggi non esiste da nessuna
parte in `/app`.

Per questo il redirect del guard su `app/app/carrello-preventivo/page.tsx` punterà
a **`/app`** (home dell'app), non a `/aiuto/guida-preventivo`. La condizione di
blocco resta identica a quella del sito (stesso flag, stesso permesso), cambia
solo la destinazione per restare coerenti con le convenzioni di `/app`.
