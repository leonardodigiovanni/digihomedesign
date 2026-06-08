# Sistema Avvisi cliente

**Stato**: completato  
**Data**: 2026-06-01

---

## Tabella DB

```sql
CREATE TABLE avvisi (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id  INT NOT NULL,             -- FK → clienti.id
  testo       TEXT NOT NULL,
  letto       TINYINT(1) NOT NULL DEFAULT 0,
  cestinato   TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## Pagine

### `/area-clienti/avvisi` (id 55, già in nav)
- **Cliente**: vede solo i propri avvisi (cestinato=0), può cestinarli (tasto Elimina → cestinato=1)
- **Staff** (dipendente/admin): vede tutti gli avvisi con colonne letto + cestinato, filtro per cliente, form crea nuovo avviso, tasto Elimina (cancellazione fisica)

### `/clienti/avvisi`  
- Alternativa per staff: stessa vista gestionale ma sotto route `/clienti/`
- **Scelta**: una sola pagina `/area-clienti/avvisi` che si adatta al ruolo (come `/area-clienti/documenti`)

---

## Comportamento

| Azione | Cliente | Staff |
|---|---|---|
| Vedere avvisi | Solo propri, `cestinato=0` | Tutti, con flag letto/cestinato |
| Filtrare per cliente | — | Select cliente |
| Creare avviso | — | Form: select cliente + textarea testo |
| "Eliminare" | `SET cestinato=1` (soft delete) | `DELETE` (fisico) |
| Marcare letto | Automatico all'apertura pagina | Visibile come flag |

---

## File

| File | Tipo |
|---|---|
| `app/area-clienti/avvisi/page.tsx` | Server component, routing per ruolo |
| `app/area-clienti/avvisi/actions.ts` | Server actions: crea, cestina, elimina, segna letto |
| `app/area-clienti/avvisi/avvisi-client.tsx` | Client component: filtri + form nuovo avviso (solo staff) |
