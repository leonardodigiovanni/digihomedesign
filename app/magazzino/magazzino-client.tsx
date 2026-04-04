'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addMateriale, deleteMateriale, updateGiacenza, type AddMaterialeResult, type DeleteMaterialeResult, type UpdateGiacenzaResult } from './actions'

export type Materiale = {
  id: number
  descrizione: string
  produttore: string
  modello: string
  costo_unitario: number
  tipo_unita: string
  colore: string
  giacenza: number
  totale_caricato: number
  created_at: string
}

type SortCol = 'descrizione' | 'produttore' | 'modello' | 'colore' | 'costo_unitario' | 'tipo_unita' | 'giacenza' | 'totale_caricato' | 'created_at'

const UNITA_SUGGERITE = ['pz', 'm²', 'kg', 'ml', 'mt', 'lt', 'cm', 'g']

const thStyle: React.CSSProperties = {
  padding: '9px 12px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em',
  cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  background: '#fafafa', borderBottom: '1px solid #e8e8e8',
}

const btnBase: React.CSSProperties = {
  padding: '9px 18px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
}

function SortIcon({ col, sortCol, sortDir }: { col: SortCol; sortCol: SortCol; sortDir: 'asc' | 'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

function formatNum(n: number) {
  return n % 1 === 0 ? n.toString() : n.toFixed(2)
}

function formatDate(s: string) {
  const d = new Date(s)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function QuantityEditor({ id, giacenza, totaleCaricato, tipoUnita, onUpdate }: {
  id: number
  giacenza: number
  totaleCaricato: number
  tipoUnita: string
  onUpdate: (g: number, t: number) => void
}) {
  const isPz = tipoUnita.trim().toLowerCase() === 'pz'
  const step = isPz ? 1 : 0.01
  const [value, setValue] = useState(Number(giacenza))
  const [saved, setSaved]  = useState(Number(giacenza))
  const dirty = value !== saved
  const [result, formAction, pending] = useActionState<UpdateGiacenzaResult | null, FormData>(updateGiacenza, null)
  const formRef = React.useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (result?.ok) {
      const g = Number(result.giacenza)
      const t = Number(result.totale_caricato)
      setSaved(g)
      setValue(g)
      onUpdate(g, t)
    }
  }, [result])

  const btnQ: React.CSSProperties = {
    width: 26, height: 26, border: '1px solid #ccc', borderRadius: 4,
    background: '#fafafa', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
      {/* form nascosto — viene submittato solo al click Salva */}
      <form ref={formRef} action={formAction} style={{ display: 'none' }}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="giacenza" value={value} />
        <input type="hidden" name="giacenza_old" value={saved} />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button type="button" style={btnQ} disabled={pending || value <= 0}
          onClick={() => setValue(v => isPz ? Math.max(0, Math.round(v) - 1) : Math.max(0, parseFloat((v - step).toFixed(2))))}>−</button>

        <input
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={e => {
            const raw = Math.max(0, parseFloat(e.target.value) || 0)
            setValue(isPz ? Math.round(raw) : raw)
          }}
          style={{
            width: 64, padding: '4px 6px', fontSize: 13,
            border: `1px solid ${dirty ? '#f5a623' : '#ccc'}`,
            borderRadius: 5, textAlign: 'center', fontFamily: 'inherit',
          }}
        />

        <button type="button" style={btnQ} disabled={pending}
          onClick={() => setValue(v => isPz ? Math.round(v) + 1 : parseFloat((v + step).toFixed(2)))}>+</button>
      </div>

      {dirty && (
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            disabled={pending}
            onClick={() => formRef.current?.requestSubmit()}
            className={pending ? 'btn-gray' : 'btn-green'}
            style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}
          >
            {pending ? '…' : 'Salva'}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setValue(saved)}
            className={pending ? 'btn-gray' : 'btn-red'}
            style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}
          >
            Annulla
          </button>
        </div>
      )}

      {result && !result.ok && (
        <span style={{ fontSize: 11, color: '#c00' }}>{result.error}</span>
      )}
    </div>
  )
}

function DeleteBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<DeleteMaterialeResult | null, FormData>(deleteMateriale, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo materiale?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}
      >
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

function AddModal({ onClose, role }: { onClose: () => void; role: string }) {
  const router = useRouter()
  const [tipoUnita, setTipoUnita] = useState('')
  const isPz = tipoUnita.trim().toLowerCase() === 'pz'
  const [result, formAction, pending] = useActionState<AddMaterialeResult | null, FormData>(addMateriale, null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); onClose() }
  }, [result])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 540,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Aggiungi materiale</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Descrizione *" name="descrizione" type="text" placeholder="es. Tubo in PVC 32mm" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Produttore *" name="produttore" type="text" placeholder="es. Wavin" />
            <Field label="Modello *" name="modello" type="text" placeholder="es. Series S" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Costo per unità (€) *" name="costo_unitario" type="number" placeholder="0.00" step="0.01" min="0" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Tipo unità *</label>
              <input
                name="tipo_unita"
                list="unita-list"
                required
                placeholder="es. pz"
                value={tipoUnita}
                onChange={e => setTipoUnita(e.target.value)}
                style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }}
              />
              <datalist id="unita-list">
                {UNITA_SUGGERITE.map(u => <option key={u} value={u} />)}
              </datalist>
            </div>
          </div>
          <Field label="Colore" name="colore" type="text" placeholder="es. Bianco, RAL 9010, #ffffff" />
          <Field label="Giacenza iniziale" name="giacenza" type="number" placeholder="0" step={isPz ? '1' : '0.01'} min="0" defaultValue="0" />

          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>
              {result.error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>
              Annulla
            </button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva materiale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, type, placeholder, step, min, defaultValue }: {
  label: string; name: string; type: string; placeholder?: string; step?: string; min?: string; defaultValue?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        step={step}
        min={min}
        defaultValue={defaultValue}
        required={!label.endsWith(')')}
        style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }}
      />
    </div>
  )
}

function MaterialeRow({ m, role, onGiacenzaUpdate }: { m: Materiale; role: string; onGiacenzaUpdate: (id: number, g: number, t: number) => void }) {
  const [giacenza, setGiacenza]             = useState(Number(m.giacenza))
  const [totaleCaricato, setTotaleCaricato] = useState(Number(m.totale_caricato))

  function handleUpdate(g: number, t: number) {
    setGiacenza(g)
    setTotaleCaricato(t)
    onGiacenzaUpdate(m.id, g, t)
  }

  return (
    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', textAlign: 'center' }}>{m.descrizione}</td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#444', textAlign: 'center' }}>{m.produttore}</td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#444', textAlign: 'center' }}>{m.modello}</td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#444', textAlign: 'center' }}>{m.colore || <span style={{ color: '#ccc' }}>—</span>}</td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#444', textAlign: 'center' }}>€ {Number(m.costo_unitario).toFixed(2)}</td>
      <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'center' }}>
        <span style={{ background: '#f0f4ff', color: '#3a5fa8', fontWeight: 600, fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>
          {m.tipo_unita}
        </span>
      </td>
      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
        <QuantityEditor
          id={m.id}
          giacenza={giacenza}
          totaleCaricato={totaleCaricato}
          tipoUnita={m.tipo_unita}
          onUpdate={handleUpdate}
        />
      </td>
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#888', textAlign: 'center' }}>{formatNum(totaleCaricato)}</td>
      <td style={{ padding: '10px 12px', fontSize: 12, color: '#aaa', whiteSpace: 'nowrap', textAlign: 'center' }}>{formatDate(m.created_at)}</td>
      {role === 'admin' && (
        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
          <DeleteBtn id={m.id} role={role} />
        </td>
      )}
    </tr>
  )
}

function RiepilogoMagazzino({ materiali }: { materiali: Materiale[] }) {
  const totaleArticoli   = materiali.length
  const articoliEsauriti = materiali.filter(m => Number(m.giacenza) === 0).length
  const valoreGiacenza   = materiali.reduce((acc, m) => acc + Number(m.giacenza) * Number(m.costo_unitario), 0)
  const valoreCaricato   = materiali.reduce((acc, m) => acc + Number(m.totale_caricato) * Number(m.costo_unitario), 0)

  // Raggruppamento per tipo unità
  const perUnita: Record<string, { quantita: number; valore: number; articoli: number }> = {}
  for (const m of materiali) {
    if (!perUnita[m.tipo_unita]) perUnita[m.tipo_unita] = { quantita: 0, valore: 0, articoli: 0 }
    perUnita[m.tipo_unita].quantita += Number(m.giacenza)
    perUnita[m.tipo_unita].valore   += Number(m.giacenza) * Number(m.costo_unitario)
    perUnita[m.tipo_unita].articoli += 1
  }
  const unitaRows = Object.entries(perUnita).sort((a, b) => b[1].valore - a[1].valore)

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10,
    padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 4,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={card}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Articoli totali</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a' }}>{totaleArticoli}</span>
        </div>
        <div style={{ ...card, borderLeft: articoliEsauriti > 0 ? '3px solid #e05a00' : '1px solid #e0e0e0' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Esauriti / a zero</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: articoliEsauriti > 0 ? '#e05a00' : '#1a1a1a' }}>{articoliEsauriti}</span>
        </div>
        <div style={card}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valore giacenza attuale</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>€ {valoreGiacenza.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div style={card}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valore totale caricato</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#555' }}>€ {valoreCaricato.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Tabella per tipo unità */}
      {unitaRows.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Giacenza per tipo unità</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                {['Tipo unità', 'Articoli', 'Quantità totale', 'Valore giacenza'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: '#888', textAlign: h === 'Tipo unità' ? 'left' : 'right', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unitaRows.map(([unita, dati]) => (
                <tr key={unita} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '9px 16px' }}>
                    <span style={{ background: '#f0f4ff', color: '#3a5fa8', fontWeight: 600, fontSize: 12, padding: '3px 10px', borderRadius: 10 }}>{unita}</span>
                  </td>
                  <td style={{ padding: '9px 16px', fontSize: 13, color: '#888', textAlign: 'right' }}>{dati.articoli}</td>
                  <td style={{ padding: '9px 16px', fontSize: 13, color: '#444', textAlign: 'right', fontWeight: 600 }}>{formatNum(dati.quantita)} {unita}</td>
                  <td style={{ padding: '9px 16px', fontSize: 13, color: '#1a1a1a', textAlign: 'right', fontWeight: 600 }}>€ {dati.valore.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function MagazzinoClient({ materiali, role }: { materiali: Materiale[]; role: string }) {
  const [liveMateriali, setLiveMateriali] = useState(materiali)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch]       = useState('')
  const [unitaFilter, setUnitaFilter] = useState('')
  const [sortCol, setSortCol]     = useState<SortCol>('descrizione')
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('asc')

  // Sincronizza quando il server fa refresh (nuovo materiale aggiunto, ecc.)
  useEffect(() => { setLiveMateriali(materiali) }, [materiali])

  function handleGiacenzaUpdate(id: number, giacenza: number, totale_caricato: number) {
    setLiveMateriali(prev => prev.map(m => m.id === id ? { ...m, giacenza, totale_caricato } : m))
  }

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const unitaOptions = [...new Set(liveMateriali.map(m => m.tipo_unita))].sort()

  const filtered = liveMateriali
    .filter(m => {
      const q = search.toLowerCase()
      const matchText = !q || (
        m.descrizione.toLowerCase().includes(q) ||
        m.produttore.toLowerCase().includes(q) ||
        m.modello.toLowerCase().includes(q)
      )
      const matchUnita = !unitaFilter || m.tipo_unita === unitaFilter
      return matchText && matchUnita
    })
    .sort((a, b) => {
      const va = a[sortCol]
      const vb = b[sortCol]
      if (va === vb) return 0
      const cmp = typeof va === 'string'
        ? va.toLowerCase().localeCompare((vb as string).toLowerCase())
        : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const cols: { key: SortCol; label: string }[] = [
    { key: 'descrizione',    label: 'Descrizione' },
    { key: 'produttore',     label: 'Produttore' },
    { key: 'modello',        label: 'Modello' },
    { key: 'colore',         label: 'Colore' },
    { key: 'costo_unitario', label: 'Costo/unità (€)' },
    { key: 'tipo_unita',     label: 'Unità' },
    { key: 'giacenza',       label: 'Giacenza' },
    { key: 'totale_caricato',label: 'Tot. caricato' },
    { key: 'created_at',     label: 'Aggiunto il' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} role={role} />}

      {/* Pannello riepilogo */}
      <RiepilogoMagazzino materiali={liveMateriali} />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <input
            type="text"
            placeholder="Cerca descrizione, produttore, modello…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }}
          />
          <select
            value={unitaFilter}
            onChange={e => setUnitaFilter(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
          >
            <option value="">Tutte le unità</option>
            {unitaOptions.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-green"
          style={{ ...btnBase, whiteSpace: 'nowrap' }}
        >
          + Aggiungi materiale
        </button>
      </div>

      {/* Tabella */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Materiali{(search || unitaFilter) ? ` — ${filtered.length} risultati` : ` — ${liveMateriali.length} totali`}
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c.key} style={thStyle} onClick={() => handleSort(c.key)}>
                    {c.label} <SortIcon col={c.key} sortCol={sortCol} sortDir={sortDir} />
                  </th>
                ))}
                {role === 'admin' && <th style={{ ...thStyle, cursor: 'default' }}>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={cols.length + 1} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
                    Nessun materiale trovato.
                  </td>
                </tr>
              ) : filtered.map(m => <MaterialeRow key={m.id} m={m} role={role} onGiacenzaUpdate={handleGiacenzaUpdate} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
