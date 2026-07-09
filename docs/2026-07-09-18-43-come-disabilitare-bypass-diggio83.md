# Come disabilitare l'accesso privilegiato del cliente Diggio83

Stato: **attivo** (bypass manutenzione in produzione)

## Contesto

Il cliente con `username = 'Diggio83'` può accedere ed essere operativo sul sito anche quando la modalità Manutenzione è attiva da Impostazioni admin, per permettere test in produzione come cliente mentre tutti gli altri clienti/dipendenti restano bloccati. Nessun flag DB, nessun toggle UI: solo un confronto hardcoded `role === 'cliente' && username === 'Diggio83'` ripetuto nei punti dove la manutenzione viene applicata.

## Quando disabilitarlo

Quando l'utente dice "disabilita l'accesso privilegiato del cliente Diggio83 guardando il file di progetto come-disabilitare-bypass-diggio83", applicare le modifiche reverse elencate sotto, poi aggiornare lo stato di questo documento in `disabilitato`.

## Modifiche da fare (reverse) — 5 file

### 1. `app/actions.ts` (login sito principale)

Da:
```ts
const bypassManutenzione = role === 'cliente' && username === 'Diggio83'

if (role !== 'admin' && !bypassManutenzione) {
```
A:
```ts
if (role !== 'admin') {
```
(rimuovere anche la riga `const bypassManutenzione = ...` sopra)

### 2. `app/app/login/actions.ts` (login PWA /app)

Da:
```ts
const bypassManutenzione = role === 'cliente' && username === 'Diggio83'

if (role !== 'admin' && !bypassManutenzione) {
```
A:
```ts
if (role !== 'admin') {
```
(rimuovere anche la riga `const bypassManutenzione = ...` sopra)

### 3. `app/layout.tsx` (blocco contenuto sito principale durante manutenzione)

Da:
```ts
const bypassManutenzione = role === 'cliente' && username === 'Diggio83'
const inManutenzione = settings.manutenzione && role !== 'admin' && !bypassManutenzione
```
A:
```ts
const inManutenzione = settings.manutenzione && role !== 'admin'
```

E più sotto, da:
```tsx
<ManutenzioneWatcher manutenzione={settings.manutenzione} role={role ?? ''} username={username ?? ''} />
```
A:
```tsx
<ManutenzioneWatcher manutenzione={settings.manutenzione} role={role ?? ''} />
```

### 4. `app/app/layout.tsx` (layout PWA /app)

Da:
```ts
const { manutenzione: manutenzioneRaw, rolePermissions } = await readSettings()
const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
const preventiviAbilitato = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
const bypassManutenzione = role === 'cliente' && username === 'Diggio83'
const manutenzione = manutenzioneRaw && !bypassManutenzione
```
A:
```ts
const { manutenzione, rolePermissions } = await readSettings()
const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
const preventiviAbilitato = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
```

E più sotto, da:
```tsx
<ManutenzioneWatcher manutenzione={manutenzioneRaw} role={role} username={username ?? ''} dest="/app" />
```
A:
```tsx
<ManutenzioneWatcher manutenzione={manutenzione} role={role} dest="/app" />
```

### 5. `components/manutenzione-watcher.tsx`

Da:
```tsx
export default function ManutenzioneWatcher({ manutenzione: initial, role, username = '', dest = '/' }: { manutenzione: boolean; role: string; username?: string; dest?: string }) {
  const lastSeen = useRef(initial)
  const bypass = role === 'cliente' && username === 'Diggio83'

  useEffect(() => {
    if (bypass) return

    const check = async () => {
```
A:
```tsx
export default function ManutenzioneWatcher({ manutenzione: initial, role, dest = '/' }: { manutenzione: boolean; role: string; dest?: string }) {
  const lastSeen = useRef(initial)

  useEffect(() => {
    const check = async () => {
```

E più sotto, da:
```ts
  }, [role, bypass, dest])
```
A:
```ts
  }, [role])
```

## Verifica dopo il revert

- `npx tsc --noEmit -p .` pulito
- Con manutenzione attiva da Impostazioni: login di `Diggio83` come cliente deve tornare a essere bloccato come tutti gli altri clienti, sia su sito principale che su `/app`.
