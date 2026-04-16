# CTA Home + Sezione Aiuto

**Stato**: completato  
**Data**: 2026-04-14

## Obiettivo

1. Aggiungere due CTA nella home page, sotto il carosello
2. Creare sezione "Aiuto" nella navbar con due sottopagine guida
3. Le due pagine guida sono sempre pubbliche
4. I bottoni CTA sono smart: destinazione diversa a seconda del login

---

## Logica CTA (server component — legge il cookie)

| Situazione | CTA Cantiere | CTA Preventivi |
|---|---|---|
| Non loggato | `/aiuto/guida-cantiere` | `/aiuto/guida-preventivo` |
| Loggato (qualsiasi ruolo) | `/cantieri` | `/pagine/5` |

Le pagine `/cantieri` e `/pagine/5` mostrano dati filtrati per ruolo:
- `dipendente` / `admin` → vede tutto
- `cliente` → vede solo i propri (filtro per ID_CLIENTE, da implementare nelle pagine)

---

## Navbar — nuova voce "Aiuto"

Dropdown "Aiuto ▾" con due voci (sempre visibile, nessun filtro ruolo):
- **Guida PreventivoOnLine** → `/aiuto/guida-preventivo`
- **Guida CantiereOnLine** → `/aiuto/guida-cantiere`

Posizionato tra "Sezioni" e "Area Lavoro".

---

## Pagine guida (pubbliche)

### `app/aiuto/guida-preventivo/page.tsx`
- H1: "Preventivo serramenti online"
- Spiegazione del servizio
- Sezione "Come funziona" (3 step)
- Banner: invito a registrarsi o loggarsi

### `app/aiuto/guida-cantiere/page.tsx`
- H1: "Segui il tuo cantiere in tempo reale"
- Spiegazione del servizio
- Sezione "Cosa trovi nell'area clienti"
- Banner: invito a registrarsi o loggarsi

---

## File coinvolti

- `lib/nav-config.ts` — aggiunta array `aiutoPages`
- `components/navbar.tsx` — aggiunta dropdown "Aiuto" (desktop + mobile)
- `app/page.tsx` — CTA condizionale (legge `session_role` dal cookie)
- `app/aiuto/guida-preventivo/page.tsx` — nuova pagina pubblica
- `app/aiuto/guida-cantiere/page.tsx` — nuova pagina pubblica
