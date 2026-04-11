# Cataloghi — macrocategorie, voci/marche, PDF depliant

**Data:** 2026-04-11  
**Stato:** completato

---

## Obiettivo

Sezione `/cataloghi` (id 23, già presente in nav-config) con struttura a due livelli:

1. **Macrocategoria** — es. Infissi, Porte, Ceramiche, Pavimenti, …
2. **Voce** — marca / produttore (es. Schüco, Oikos, Marazzi…), con un PDF depliant allegato

Click sulla voce → apre il PDF in nuova scheda.

---

## Struttura DB

### Tabella `catalogo_categorie`
| Colonna  | Tipo                    | Note              |
|----------|-------------------------|-------------------|
| `id`     | INT PK AUTO             |                   |
| `nome`   | VARCHAR(100) NOT NULL   | Es. "Infissi"     |
| `ordine` | INT NOT NULL DEFAULT 0  | Per ordinamento   |

### Tabella `catalogo_voci`
| Colonna        | Tipo                  | Note                                |
|----------------|-----------------------|-------------------------------------|
| `id`           | INT PK AUTO           |                                     |
| `categoria_id` | INT NOT NULL FK       | → catalogo_categorie.id             |
| `nome`         | VARCHAR(200) NOT NULL | Marca / produttore                  |
| `pdf_filename` | VARCHAR(255) NOT NULL | Filename in `/uploads/cataloghi/`   |
| `pdf_label`    | VARCHAR(200) NOT NULL DEFAULT '' | Etichetta opzionale del PDF |
| `created_at`   | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |                        |

---

## Upload PDF

- Nuova API route `/api/upload-catalogo` → salva in `public/uploads/cataloghi/`
- Usa lettura stream (stesso pattern di upload-marketing) per evitare troncamenti
- Accetta solo `.pdf`

---

## UI — `cataloghi-client.tsx`

### Vista comune (tutti i ruoli)
- Accordion per macrocategoria (espandi/chiudi)
- In ogni accordion: lista voci con nome marca + pulsante "Apri catalogo" (apre PDF in nuova scheda)
- Se nessuna voce: messaggio "Nessun catalogo disponibile"

### Vista staff (dipendenti / admin)
In più rispetto alla vista comune:
- Pulsante **"+ Nuova categoria"** → form inline (solo nome)
- In ogni accordion: pulsante **"+ Aggiungi voce"** → form con nome marca + upload PDF + etichetta opzionale
- Pulsante **Elimina** su ogni voce (rimuove DB + file PDF)
- Pulsante **Elimina categoria** (solo se vuota, oppure con conferma che elimina anche le voci)

---

## Accesso

- Id pagina: **23** (già in nav-config come "Cataloghi")
- `hasPageAccess(role, 23, settings)` — configurabile in Settings come le altre
- Clienti che devono vedere i cataloghi: admin aggiunge 23 a `rolePermissions.cliente`
- La pagina mostra UI diversa in base al ruolo (staff vs cliente), non due pagine separate

---

## File coinvolti

| File | Azione |
|---|---|
| `lib/nav-config.ts` | id 23 href: `/interno/23` → `/cataloghi` |
| `app/cataloghi/page.tsx` | Server component, fetch categorie+voci, passa `isStaff` |
| `app/cataloghi/cataloghi-client.tsx` | Client component, accordion, form, upload |
| `app/cataloghi/actions.ts` | `addCategoria`, `deleteCategoria`, `addVoce`, `deleteVoce` |
| `app/api/upload-catalogo/route.ts` | Upload PDF con stream |
