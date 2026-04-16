'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addOrdineFornitore, updateOrdineFornitore, toggleFatturato, togglePagato,
  updateStatoConsegna, sollecitaFornitore, deleteOrdineFornitore,
  type MutResult
} from './actions'

export type OrdineFornitore = {
  id: number
  numero_ordine: string
  fornitore: string
  descrizione: string
  data_ordine: string
  created_by: string
  qta: number
  prezzo_unitario: number
  aliq_sconto: number
  aliq_iva: number
  totale: number
  fatturato: number
  pagato: number
  stato_consegna: string
  data_consegna_stimata: string | null
  data_consegna: string | null
  ultimo_sollecito: string | null
  note: string | null
  email_fornitore: string
  email_anagrafica: string
  pec_anagrafica: string
}

// ─── styles ─────────────────────────────────────────────────────────────────
const thSt: React.CSSProperties = {
  padding: '9px 10px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em',
  whiteSpace: 'nowrap', background: '#fafafa', borderBottom: '1px solid #e8e8e8',
}
const tdSt: React.CSSProperties = { padding: '8px 10px', fontSize: 13, textAlign: 'center', verticalAlign: 'middle' }
const inputSt: React.CSSProperties = { padding: '7px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }
const btnBase: React.CSSProperties = { padding: '8px 18px', fontSize: 14, borderRadius: 6, fontFamily: 'inherit' }

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtDate(s: string | null) {
  if (!s) return '—'
  try { return new Date(s).toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' }) } catch { return s }
}
function fmtDatetime(s: string | null) {
  if (!s) return null
  try { return new Date(s).toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' }) } catch { return s }
}
function calcTotale(qta: number, prezzo: number, sconto: number, iva: number) {
  return qta * prezzo * (1 - sconto / 100) * (1 + iva / 100)
}

// ─── badges ──────────────────────────────────────────────────────────────────
function ConsegnaBadge({ stato }: { stato: string }) {
  const map: Record<string, [string, string, string]> = {
    non_consegnato: ['#c00',    '#fff5f5', 'Non consegnato'],
    parziale:       ['#b45309', '#fffbeb', 'Parziale'],
    consegnato:     ['#276749', '#f0fff4', 'Consegnato'],
  }
  const [color, bg, label] = map[stato] ?? ['#888', '#f5f5f5', stato]
  return <span style={{ color, background: bg, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>{label}</span>
}
function BoolBadge({ val, label }: { val: number; label?: string }) {
  return val
    ? <span style={{ color: '#276749', background: '#f0fff4', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 10 }}>{label ?? '✓'}</span>
    : <span style={{ color: '#999', background: '#f5f5f5', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10 }}>{label ? `Non ${label.toLowerCase()}` : '✗'}</span>
}

// ─── field helper ─────────────────────────────────────────────────────────────
function F({ label, name, type, placeholder, step, min, max, required, defaultValue, children }: {
  label: string; name: string; type: string; placeholder?: string
  step?: string; min?: string; max?: string; required?: boolean; defaultValue?: string
  children?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{label}</label>
      {children ?? (
        <input name={name} type={type} placeholder={placeholder} step={step} min={min} max={max}
          required={required} defaultValue={defaultValue} style={inputSt} />
      )}
    </div>
  )
}

// ─── toggle fatturato ────────────────────────────────────────────────────────
function ToggleFatturato({ id, val }: { id: number; val: number }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(toggleFatturato, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} style={{ display: 'contents' }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} title="Clicca per cambiare"
        style={{ background: 'none', border: 'none', cursor: pending ? 'wait' : 'pointer', padding: 0 }}>
        <BoolBadge val={val} label="Fatturato" />
      </button>
    </form>
  )
}

// ─── toggle pagato ───────────────────────────────────────────────────────────
function TogglePagato({ id, val }: { id: number; val: number }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(togglePagato, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} style={{ display: 'contents' }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} title="Clicca per cambiare"
        style={{ background: 'none', border: 'none', cursor: pending ? 'wait' : 'pointer', padding: 0 }}>
        <BoolBadge val={val} label="Pagato" />
      </button>
    </form>
  )
}

// ─── select consegna inline ───────────────────────────────────────────────────
function SelectConsegna({ id, val }: { id: number; val: string }) {
  const router = useRouter()
  const [stato, setStato] = useState(val)
  const dirty = stato !== val
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateStatoConsegna, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
      <input type="hidden" name="id" value={id} />
      <select name="stato_consegna" value={stato} onChange={e => setStato(e.target.value)}
        style={{ padding: '3px 6px', fontSize: 11, border: '1px solid #ccc', borderRadius: 5, fontFamily: 'inherit', background: '#fff' }}>
        <option value="non_consegnato">Non consegnato</option>
        <option value="parziale">Parziale</option>
        <option value="consegnato">Consegnato</option>
      </select>
      {dirty && (
        <button type="submit" disabled={pending}
          className={pending ? 'btn-gray' : 'btn-green'}
          style={{ padding: '3px 6px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}>
          {pending ? '…' : '✓'}
        </button>
      )}
    </form>
  )
}

// ─── modale modifica ─────────────────────────────────────────────────────────
function EditModal({ ordine, onClose }: { ordine: OrdineFornitore; onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(updateOrdineFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])

  const [qta, setQta]       = useState(ordine.qta)
  const [prezzo, setPrezzo]  = useState(ordine.prezzo_unitario)
  const [sconto, setSconto]  = useState(ordine.aliq_sconto)
  const [iva, setIva]        = useState(ordine.aliq_iva)
  const totale = calcTotale(qta, prezzo, sconto, iva)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.45)', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 600, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Modifica ordine</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="hidden" name="id" value={ordine.id} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <F label="N° ordine" name="numero_ordine" type="text" placeholder="ORD-2026-001" defaultValue={ordine.numero_ordine} />
            <F label="Fornitore *" name="fornitore" type="text" placeholder="es. Edilforniture SRL" required defaultValue={ordine.fornitore} />
          </div>
          <F label="Descrizione" name="descrizione" type="text" placeholder="Materiali, riferimento…" defaultValue={ordine.descrizione} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            <F label="Qtà" name="qta" type="number" step="0.001" min="0" defaultValue={String(ordine.qta)}>
              <input name="qta" type="number" step="0.001" min="0" defaultValue={String(ordine.qta)}
                style={inputSt} onChange={e => setQta(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="P. unit. (€)" name="prezzo_unitario" type="number" step="0.01" min="0" defaultValue={String(ordine.prezzo_unitario)}>
              <input name="prezzo_unitario" type="number" step="0.01" min="0" defaultValue={String(ordine.prezzo_unitario)}
                style={inputSt} onChange={e => setPrezzo(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="Sconto %" name="aliq_sconto" type="number" step="0.01" min="0" max="100" defaultValue={String(ordine.aliq_sconto)}>
              <input name="aliq_sconto" type="number" step="0.01" min="0" max="100" defaultValue={String(ordine.aliq_sconto)}
                style={inputSt} onChange={e => setSconto(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="IVA %" name="aliq_iva" type="number" step="0.01" min="0" defaultValue={String(ordine.aliq_iva)}>
              <input name="aliq_iva" type="number" step="0.01" min="0" defaultValue={String(ordine.aliq_iva)}
                style={inputSt} onChange={e => setIva(parseFloat(e.target.value) || 0)} />
            </F>
          </div>
          <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#276749', fontWeight: 600 }}>Totale calcolato</span>
            <span style={{ fontSize: 18, color: '#276749', fontWeight: 700 }}>€ {totale.toFixed(2)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <F label="Data ordine *" name="data_ordine" type="date" defaultValue={ordine.data_ordine} required />
            <F label="Data consegna stimata" name="data_consegna_stimata" type="date" defaultValue={ordine.data_consegna_stimata ?? ''} />
          </div>
          <F label="Email fornitore" name="email_fornitore" type="email" placeholder="fornitore@esempio.it" defaultValue={ordine.email_fornitore} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Note</label>
            <textarea name="note" rows={3} defaultValue={ordine.note ?? ''}
              style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── modale sollecito ─────────────────────────────────────────────────────────
function SollecitaModal({ ordine, onClose }: { ordine: OrdineFornitore; onClose: () => void }) {
  const router = useRouter()

  // A: email anagrafica, fallback all'email salvata sull'ordine
  const emailDefault = ordine.email_anagrafica || ordine.email_fornitore
  // CC: PEC anagrafica
  const ccDefault = ordine.pec_anagrafica

  const testo = `Gentile ${ordine.fornitore},\n\ncon la presente siamo a sollecitare l'evasione dell'ordine N°${ordine.numero_ordine || ordine.id}.\n\nDescrizione: ${ordine.descrizione || '—'}\nQuantità: ${ordine.qta}\nData ordine: ${fmtDate(ordine.data_ordine)}\nData consegna stimata: ${fmtDate(ordine.data_consegna_stimata)}\n\nIn attesa di Vs. riscontro, porgiamo cordiali saluti.`

  const [result, action, pending] = useActionState<MutResult | null, FormData>(sollecitaFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 560, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Sollecita fornitore — {ordine.fornitore}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="hidden" name="id" value={ordine.id} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>
              A: <span style={{ fontWeight: 400, color: '#999' }}>— più indirizzi separati da ;</span>
            </label>
            <input name="email" type="text" required defaultValue={emailDefault}
              placeholder="email@fornitore.it; altro@esempio.it"
              style={inputSt} />
            {!emailDefault && (
              <span style={{ fontSize: 11, color: '#e67e00' }}>⚠ Nessuna email trovata in anagrafica — inserirla manualmente</span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>
              CC: <span style={{ fontWeight: 400, color: '#999' }}>— più indirizzi separati da ;</span>
            </label>
            <input name="cc" type="text" defaultValue={ccDefault}
              placeholder="cc@esempio.it; altro@esempio.it"
              style={inputSt} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Testo sollecito *</label>
            <textarea name="testo" rows={8} defaultValue={testo} required
              style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Invio…' : 'Invia sollecito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── modale nuovo ordine ─────────────────────────────────────────────────────
function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addOrdineFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  const today = new Date().toISOString().slice(0, 10)

  const [qta, setQta]       = useState(1)
  const [prezzo, setPrezzo]  = useState(0)
  const [sconto, setSconto]  = useState(0)
  const [iva, setIva]        = useState(22)
  const totale = calcTotale(qta, prezzo, sconto, iva)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.45)', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 600, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nuovo ordine a fornitore</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <F label="N° ordine" name="numero_ordine" type="text" placeholder="ORD-2026-001" />
            <F label="Fornitore *" name="fornitore" type="text" placeholder="es. Edilforniture SRL" required />
          </div>
          <F label="Descrizione" name="descrizione" type="text" placeholder="Materiali, riferimento…" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            <F label="Qtà" name="qta" type="number" step="0.001" min="0" defaultValue="1">
              <input name="qta" type="number" step="0.001" min="0" defaultValue="1"
                style={inputSt} onChange={e => setQta(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="P. unit. (€)" name="prezzo_unitario" type="number" step="0.01" min="0" defaultValue="0">
              <input name="prezzo_unitario" type="number" step="0.01" min="0" defaultValue="0"
                style={inputSt} onChange={e => setPrezzo(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="Sconto %" name="aliq_sconto" type="number" step="0.01" min="0" max="100" defaultValue="0">
              <input name="aliq_sconto" type="number" step="0.01" min="0" max="100" defaultValue="0"
                style={inputSt} onChange={e => setSconto(parseFloat(e.target.value) || 0)} />
            </F>
            <F label="IVA %" name="aliq_iva" type="number" step="0.01" min="0" defaultValue="22">
              <input name="aliq_iva" type="number" step="0.01" min="0" defaultValue="22"
                style={inputSt} onChange={e => setIva(parseFloat(e.target.value) || 0)} />
            </F>
          </div>
          <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#276749', fontWeight: 600 }}>Totale calcolato</span>
            <span style={{ fontSize: 18, color: '#276749', fontWeight: 700 }}>€ {totale.toFixed(2)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <F label="Data ordine *" name="data_ordine" type="date" defaultValue={today} required />
            <F label="Data consegna stimata" name="data_consegna_stimata" type="date" />
          </div>
          <F label="Email fornitore" name="email_fornitore" type="email" placeholder="fornitore@esempio.it" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Note</label>
            <textarea name="note" rows={3} placeholder="Note aggiuntive…"
              style={{ ...inputSt, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── delete btn ───────────────────────────────────────────────────────────────
function DeleteBtn({ id }: { id: number }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteOrdineFornitore, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo ordine?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

// ─── main client ──────────────────────────────────────────────────────────────
export default function OrdiniForniClient({ ordini, role }: { ordini: OrdineFornitore[]; role: string }) {
  const [showModal, setShowModal]       = useState(false)
  const [modificaOrdine, setModifica]   = useState<OrdineFornitore | null>(null)
  const [sollecitaOrdine, setSollecita] = useState<OrdineFornitore | null>(null)
  const [search, setSearch]             = useState('')
  const [filtroConsegna, setFiltroConsegna] = useState('')
  const [filtroFatturato, setFiltroFatturato] = useState('')
  const [filtroPagato, setFiltroPagato] = useState('')

  const filtered = ordini.filter(o => {
    const q = search.toLowerCase()
    const matchText = !q || o.fornitore.toLowerCase().includes(q) || o.numero_ordine.toLowerCase().includes(q) || o.descrizione.toLowerCase().includes(q)
    const matchConsegna = !filtroConsegna || o.stato_consegna === filtroConsegna
    const matchFatturato = !filtroFatturato || String(o.fatturato) === filtroFatturato
    const matchPagato = !filtroPagato || String(o.pagato) === filtroPagato
    return matchText && matchConsegna && matchFatturato && matchPagato
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} />}
      {modificaOrdine && <EditModal ordine={modificaOrdine} onClose={() => setModifica(null)} />}
      {sollecitaOrdine && <SollecitaModal ordine={sollecitaOrdine} onClose={() => setSollecita(null)} />}

      {/* filtri + nuovo */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca fornitore, numero, descrizione…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <select value={filtroConsegna} onChange={e => setFiltroConsegna(e.target.value)}
          style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Tutte le consegne</option>
          <option value="non_consegnato">Non consegnato</option>
          <option value="parziale">Parziale</option>
          <option value="consegnato">Consegnato</option>
        </select>
        <select value={filtroFatturato} onChange={e => setFiltroFatturato(e.target.value)}
          style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Fatturato: tutti</option>
          <option value="1">Fatturato</option>
          <option value="0">Non fatturato</option>
        </select>
        <select value={filtroPagato} onChange={e => setFiltroPagato(e.target.value)}
          style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Pagato: tutti</option>
          <option value="1">Pagato</option>
          <option value="0">Non pagato</option>
        </select>
        <button onClick={() => setShowModal(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Nuovo ordine
        </button>
      </div>

      {/* tabella */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px 10px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
            {(search || filtroConsegna || filtroFatturato || filtroPagato)
              ? `${filtered.length} risultati`
              : `${ordini.length} ordini totali`}
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr>
                <th style={thSt}>N° Ordine</th>
                <th style={thSt}>Fornitore</th>
                <th style={thSt}>Descrizione</th>
                <th style={thSt}>Qtà</th>
                <th style={thSt}>P. Unit.</th>
                <th style={thSt}>Sconto%</th>
                <th style={thSt}>IVA%</th>
                <th style={thSt}>Totale</th>
                <th style={thSt}>Fatturato</th>
                <th style={thSt}>Pagato</th>
                <th style={thSt}>Consegna</th>
                <th style={thSt}>Data stim.</th>
                <th style={thSt}>Data cons.</th>
                <th style={thSt}>Ultimo soll.</th>
                <th style={thSt}>Note</th>
                <th style={{ ...thSt, cursor: 'default' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={16} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun ordine trovato.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ ...tdSt, fontWeight: 600 }}>{o.numero_ordine || '—'}</td>
                  <td style={{ ...tdSt, whiteSpace: 'nowrap' }}>{o.fornitore}</td>
                  <td style={{ ...tdSt, maxWidth: 180, textAlign: 'left' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: o.descrizione ? undefined : '#ccc' }}>
                      {o.descrizione || '—'}
                    </div>
                  </td>
                  <td style={tdSt}>{o.qta}</td>
                  <td style={tdSt}>€ {o.prezzo_unitario.toFixed(2)}</td>
                  <td style={tdSt}>{o.aliq_sconto > 0 ? `${o.aliq_sconto}%` : '—'}</td>
                  <td style={tdSt}>{o.aliq_iva}%</td>
                  <td style={{ ...tdSt, fontWeight: 700 }}>€ {o.totale.toFixed(2)}</td>
                  <td style={tdSt}><ToggleFatturato id={o.id} val={o.fatturato} /></td>
                  <td style={tdSt}><TogglePagato id={o.id} val={o.pagato} /></td>
                  <td style={tdSt}><SelectConsegna id={o.id} val={o.stato_consegna} /></td>
                  <td style={{ ...tdSt, whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(o.data_consegna_stimata)}</td>
                  <td style={{ ...tdSt, whiteSpace: 'nowrap', fontSize: 12 }}>{fmtDate(o.data_consegna)}</td>
                  <td style={{ ...tdSt, fontSize: 11, color: o.ultimo_sollecito ? '#b45309' : '#ccc', whiteSpace: 'nowrap' }}>
                    {fmtDatetime(o.ultimo_sollecito) ?? '—'}
                  </td>
                  <td style={{ ...tdSt, maxWidth: 140, textAlign: 'left' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: o.note ? '#444' : '#ccc' }}>
                      {o.note || '—'}
                    </div>
                  </td>
                  <td style={{ ...tdSt, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                      <button onClick={() => setModifica(o)} className="btn-green"
                        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
                        Modifica
                      </button>
                      <button onClick={() => setSollecita(o)} className="btn-orange"
                        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
                        Sollecita
                      </button>
                      {role === 'admin' && <DeleteBtn id={o.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
