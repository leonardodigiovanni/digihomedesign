# Fix navbar, login emergenza, sub-footer responsive

**Data:** 2026-04-13  
**Stato:** completato

---

## Modifiche effettive

### `components/navbar.tsx` — highlight "Area Lavoro"
- Il bottone "Area Lavoro" usava `linkStyle('/interno')` che non corrispondeva mai a nessun pathname reale → risultava sempre non evidenziato
- Aggiunto `const anyActive = items.some(p => isActive(p.href))`
- Il bottone ora riceve `color` e `boxShadow` espliciti in base ad `anyActive` (non `undefined`, che annullava il colore spread)

### `app/settings/banner-panel.tsx` — bottone Annulla + abilitazione condizionale
- Aggiunto bottone `type="reset"` ("Annulla") accanto a "Salva testo"
- Entrambi i bottoni partono disabilitati (`btn-gray`) e si attivano solo quando il testo nel textarea differisce dal valore salvato
- Stato `changed` tracciato con `useState`; resettato su `onReset` della form e dopo salvataggio OK
- `type="reset"` nativo ripristina il textarea al `defaultValue` senza logica aggiuntiva

### `app/globals.css` — fix `btn-gray` su bottoni attivi
- `cursor: default !important` e `opacity: 0.55` spostati da `.btn-gray` a `.btn-gray:disabled`
- Risultato: `btn-gray` su un bottone non-disabled mostra lo shimmer con cursore pointer; solo i bottoni con attributo `disabled` ottengono l'aspetto disabilitato

### `components/emergency-login.tsx` (nuovo) + `app/layout.tsx`
- Nuovo componente client che mostra un modal di login admin
- **Trigger desktop**: `Ctrl+Alt+F` (toggle apri/chiudi), `Escape` per chiudere
- **Trigger mobile**: 5 tap rapidi (entro 2s) sul logo nel sub-footer (`id="subfooter-logo"`)
- Entrambi i trigger attivi **solo quando `inManutenzione === true`**
- Usa l'action `login` esistente — gli admin possono accedere anche in manutenzione, i non-admin ricevono il messaggio di errore già previsto
- Montato nel layout fuori da qualsiasi condizione, riceve `inManutenzione` come prop

### `components/footer.tsx` — id logo + sub-footer responsive
- Aggiunto `id="subfooter-logo"` all'`<Image>` del sub-footer nero (usato dall'emergency login per il tap counter)
- Sub-footer: sostituito `flexWrap: 'wrap'` con classe CSS `subfooter-bar`
- A larghezze >540px: riga unica (testo — logo — testo)
- A larghezze ≤540px: colonna centrata (testo / logo / testo)

### `app/globals.css` — classe `subfooter-bar`
```css
.subfooter-bar { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; }
@media (max-width: 540px) { .subfooter-bar { flex-direction: column; gap: 4px; } }
```
