# Registrazione app — logica avanzata

**Data:** 2026-06-14  
**Stato:** completato

## Obiettivo

Migliorare il flusso di registrazione app su tre fronti:
1. Collegamento automatico con un record `clienti` preesistente (creato da dipendente)
2. Rimozione della doppia creazione se il cliente esiste già
3. Prompt post-login per completare la registrazione carente

---

## 1. Collegamento clienti preesistente (in `verifyAppPhone`)

Dopo OTP verificato, prima di creare i record:

```sql
SELECT id FROM clienti WHERE telefono = ? AND utente_id IS NULL LIMIT 1
```

- **Trovato** → crea solo `users` con `cliente_id = clienti.id`, UPDATE `clienti.utente_id`
- **Non trovato** → crea `clienti` + `users` come ora

---

## 2. Prompt post-login — "Completa la registrazione"

### Trigger
Nel layout `/app`, se utente loggato ha `nome='' OR cognome='' OR email=''`:
- Mostra pagina/banner con form di completamento
- Pulsante **Salta** → chiude per la sessione corrente, riappare al login successivo (non salvato su DB)

### Form di completamento — riuso form registrazione completa

Il form riusa il componente della registrazione completa (`app/registrazione/`) con queste varianti:

| Campo | Stato |
|-------|-------|
| username | visibile, **disabilitato** (già presente) |
| cellulare | visibile, editabile solo se vuole cambiarlo → cambiando scatta verifica SMS |
| nome | editabile se vuoto, disabilitato se già presente |
| cognome | editabile se vuoto, disabilitato se già presente |
| email | editabile (da null a valore) → scatta verifica email |
| password | non mostrata (già impostata) |

### Tab verifica SMS
- Nascosto se il cellulare **non** viene modificato (già verificato in fase di registrazione)
- Mostrato solo se l'utente cambia il numero di cellulare

### Logica verifica
- **Email**: passa da vuota a valorizzata → invio OTP email prima di salvare
- **Cellulare**: cambia valore rispetto al corrente → invio OTP SMS prima di salvare
- Se nessuno dei due cambia → salvataggio diretto senza verifica

### Action `completaProfilo`
Aggiorna `users` SET nome, cognome, email (e lancia flusso verifica se necessario).

---

## File coinvolti

| File | Azione |
|------|--------|
| `app/app/registrazione/actions.ts` | MODIFICA `verifyAppPhone` — check clienti preesistente |
| `app/app/layout.tsx` | MODIFICA — query profilo utente, passa `profiloIncompleto` flag |
| `app/app/completa-profilo/page.tsx` | NUOVO — pagina con form riuso |
| `app/app/completa-profilo/completa-form.tsx` | NUOVO — componente client, riusa logica registrazione completa |
| `app/app/completa-profilo/actions.ts` | NUOVO — `completaProfilo`, `verificaEmailProfilo`, `verificaCellulareProfilo` |

---

## Note tecniche

- Il form di completamento è un componente separato ma rispecchia struttura e campi del form di registrazione completa, adattato per pre-filling e disabilitazione campi già presenti
- "Salta" non tocca il DB — il prompt riappare ad ogni login finché il profilo non è completo
- Il profilo si considera "completo" quando `nome != '' AND cognome != '' AND email != ''`
- Cellulare già verificato in fase di registrazione: il tab SMS non appare a meno di modifica esplicita
