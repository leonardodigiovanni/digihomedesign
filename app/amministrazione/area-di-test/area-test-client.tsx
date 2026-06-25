'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import SelectLookup from '@/components/select-lookup'
import { aggiungiAPreventivo2, eliminaDaPreventivo2, inserisciArticolo2 } from './actions'

export type FlatRow = {
  id: number
  percorso_id: number
  fase: string
  materiale: string
  tipologia: string
  ambiente: string
  articolo: string
  fascia: string
  marca: string
  serie: string
  categoria: string
  sottocategoria: string
}

export type Pv2Row = {
  id: number
  articolo2_id: number
  articolo: string
  fase: string
  marca: string
  serie: string
  categoria: string
  sottocategoria: string
  created_at: string
}

const DIMS: { key: keyof FlatRow; label: string }[] = [
  { key: 'categoria',      label: 'Categoria' },
  { key: 'sottocategoria', label: 'Sottocategoria' },
  { key: 'fase',           label: 'Fase' },
  { key: 'materiale',      label: 'Materiale' },
  { key: 'tipologia',      label: 'Tipologia' },
  { key: 'ambiente',       label: 'Ambiente' },
  { key: 'articolo',       label: 'Articolo' },
  { key: 'fascia',         label: 'Fascia' },
  { key: 'marca',          label: 'Marca' },
  { key: 'serie',          label: 'Serie' },
]

const emptyFilters = () => Object.fromEntries(DIMS.map(d => [d.key, ''])) as Record<string, string>

const CAMPI: { key: string; label: string }[] = [
  { key: 'fase',        label: 'Fase' },
  { key: 'materiale',   label: 'Materiale' },
  { key: 'tipologia',   label: 'Tipologia' },
  { key: 'ambiente',    label: 'Ambiente' },
  { key: 'articolo',    label: 'Articolo' },
  { key: 'fascia',      label: 'Fascia' },
  { key: 'marca',       label: 'Marca' },
  { key: 'serie',       label: 'Serie' },
]

const emptyArticolo = () => ({ fase: '', materiale: '', tipologia: '', ambiente: '', articolo: '', fascia: '', marca: '', serie: '' })
const emptyPercorso = () => ({ categoria: '', sottocategoria: '' })

const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#555',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  display: 'block', marginBottom: 4,
}
const tdS: React.CSSProperties = {
  padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 12, verticalAlign: 'middle',
}

export default function AreaTestClient({ flatRows, pv2 }: { flatRows: FlatRow[]; pv2: Pv2Row[] }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState<Record<string, string>>(emptyFilters())
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')

  // form inserimento articolo2
  const [formOpen, setFormOpen] = useState(false)
  const [campi, setCampi] = useState(emptyArticolo())
  const [percorsi, setPercorsi] = useState([emptyPercorso()])
  const [formErr, setFormErr] = useState('')
  const [formOk, setFormOk] = useState(false)

  function optionsFor(dim: string): { value: string; label: string }[] {
    const filtered = flatRows.filter(row =>
      DIMS.every(d => {
        if (d.key === dim) return true
        const v = filters[d.key]
        return !v || (row as Record<string, unknown>)[d.key] === v
      })
    )
    const vals = [...new Set(filtered.map(r => (r as Record<string, unknown>)[dim] as string).filter(Boolean))].sort()
    return vals.map(v => ({ value: v, label: v }))
  }

  const matchedRows = useMemo(() => {
    return flatRows.filter(row =>
      DIMS.every(d => {
        const v = filters[d.key]
        return !v || (row as Record<string, unknown>)[d.key] === v
      })
    )
  }, [flatRows, filters])

  const canConfirm = matchedRows.length === 1

  function handleConfirm() {
    if (!canConfirm) return
    const row = matchedRows[0]
    setError('')
    startT(async () => {
      const res = await aggiungiAPreventivo2(row.id, row.percorso_id, row.categoria, row.sottocategoria)
      if (!res.ok) { setError(res.error ?? 'Errore'); return }
      setShowModal(false)
      setFilters(emptyFilters())
      router.refresh()
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Eliminare questa riga?')) return
    startT(async () => {
      await eliminaDaPreventivo2(id)
      router.refresh()
    })
  }

  function handleFormSubmit() {
    setFormErr('')
    setFormOk(false)
    startT(async () => {
      const res = await inserisciArticolo2({ ...campi, percorsi })
      if (!res.ok) { setFormErr(res.error ?? 'Errore'); return }
      setCampi(emptyArticolo())
      setPercorsi([emptyPercorso()])
      setFormOk(true)
      router.refresh()
    })
  }

  function openModal() {
    setFilters(emptyFilters())
    setError('')
    setShowModal(true)
  }

  const matchInfo = canConfirm
    ? `✓ Selezione univoca: articolo #${matchedRows[0].id} — ${matchedRows[0].categoria || '(nessun percorso)'}${matchedRows[0].sottocategoria ? ' / ' + matchedRows[0].sottocategoria : ''}`
    : matchedRows.length === 0
    ? 'Nessuna combinazione corrisponde ai filtri.'
    : `${matchedRows.length} combinazioni articolo/percorso — affina i filtri.`

  const matchColor = canConfirm ? '#2e7d32' : matchedRows.length === 0 ? '#c00' : '#c77700'
  const matchBg    = canConfirm ? '#e8f5e9' : matchedRows.length === 0 ? '#fff5f5' : '#fff8e1'

  const inp: React.CSSProperties = { width: '100%', padding: '6px 8px', border: '1px solid #ccc', borderRadius: 5, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }

  return (
    <>
      {/* Form inserimento articoli2 */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <button
          onClick={() => { setFormOpen(o => !o); setFormErr(''); setFormOk(false) }}
          style={{ width: '100%', padding: '12px 16px', background: '#f5f5f5', border: 'none', borderBottom: formOpen ? '1px solid #e0e0e0' : 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>+ Nuovo articolo in articoli2</span>
          <span style={{ color: '#888', fontSize: 12 }}>{formOpen ? '▲' : '▼'}</span>
        </button>

        {formOpen && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 8 campi in griglia */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {CAMPI.map(c => (
                <div key={c.key}>
                  <span style={lbl}>{c.label}</span>
                  <input
                    value={(campi as Record<string, string>)[c.key]}
                    onChange={e => setCampi(f => ({ ...f, [c.key]: e.target.value }))}
                    style={inp}
                    placeholder={c.label}
                  />
                </div>
              ))}
            </div>

            {/* Percorsi */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={lbl}>Percorsi (categoria / sottocategoria)</span>
                <button
                  type="button"
                  onClick={() => setPercorsi(p => [...p, emptyPercorso()])}
                  className="btn-black"
                  style={{ padding: '0 12px', fontSize: 12 }}
                >
                  + Aggiungi percorso
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {percorsi.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      value={p.categoria}
                      onChange={e => setPercorsi(ps => ps.map((x, j) => j === i ? { ...x, categoria: e.target.value } : x))}
                      placeholder="Categoria"
                      style={{ ...inp, flex: 1 }}
                    />
                    <input
                      value={p.sottocategoria}
                      onChange={e => setPercorsi(ps => ps.map((x, j) => j === i ? { ...x, sottocategoria: e.target.value } : x))}
                      placeholder="Sottocategoria"
                      style={{ ...inp, flex: 1 }}
                    />
                    {percorsi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPercorsi(ps => ps.filter((_, j) => j !== i))}
                        className="btn-red btn-icon"
                        style={{ fontFamily: 'inherit', flexShrink: 0 }}
                      >
                        <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {formErr && <p style={{ margin: 0, fontSize: 12, color: '#c00' }}>{formErr}</p>}
            {formOk  && <p style={{ margin: 0, fontSize: 12, color: '#2e7d32' }}>✓ Articolo inserito.</p>}

            <div>
              <button
                onClick={handleFormSubmit}
                disabled={pending}
                className={pending ? 'btn-gray' : 'btn-green'}
                style={{ padding: '0 24px', fontSize: 13 }}
              >
                {pending ? 'Salvataggio…' : 'Salva articolo'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sinistra: griglia articoli2 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>articoli2</h3>
          {flatRows.length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, fontStyle: 'italic' }}>Nessun articolo nella tabella.</div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    {['ID','Categoria','Sottocategoria','Fase','Materiale','Tipologia','Ambiente','Articolo','Fascia','Marca','Serie'].map(h => (
                      <th key={h} style={{ ...tdS, fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #ddd' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flatRows.map((r, i) => (
                    <tr key={`${r.id}-${i}`} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...tdS, color: '#888', fontFamily: 'monospace' }}>{r.id}</td>
                      <td style={tdS}>{r.categoria || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.sottocategoria || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.fase || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.materiale || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.tipologia || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.ambiente || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.articolo || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.fascia || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.marca || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.serie || <span style={{ color: '#ccc' }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Destra: preventivo2 */}
        <div style={{ width: 360, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>preventivo2</h3>
            <button onClick={openModal} className="btn-green" style={{ padding: '0 16px', fontSize: 13 }}>
              + Aggiungi
            </button>
          </div>
          {pv2.length === 0 ? (
            <div style={{ color: '#888', fontSize: 13, fontStyle: 'italic' }}>Nessuna riga.</div>
          ) : (
            <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    {['ID','Articolo','Fase','Marca','Serie','Categoria','Sottocategoria',''].map((h, i) => (
                      <th key={i} style={{ ...tdS, fontWeight: 700, textAlign: 'left', borderBottom: '2px solid #ddd' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pv2.map(r => (
                    <tr key={r.id}>
                      <td style={{ ...tdS, fontFamily: 'monospace', color: '#888' }}>{r.id}</td>
                      <td style={tdS}>{r.articolo}</td>
                      <td style={tdS}>{r.fase}</td>
                      <td style={tdS}>{r.marca}</td>
                      <td style={tdS}>{r.serie}</td>
                      <td style={tdS}>{r.categoria || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={tdS}>{r.sottocategoria || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={{ ...tdS, textAlign: 'center', width: 36 }}>
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={pending}
                          className="btn-red btn-icon"
                          style={{ fontFamily: 'inherit' }}
                        >
                          <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Aggiungi a preventivo2</h3>
              <button onClick={() => setShowModal(false)} className="btn-red btn-icon" style={{ fontFamily: 'inherit' }}>
                <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {DIMS.map(d => (
                <div key={d.key}>
                  <span style={lbl}>{d.label}</span>
                  <SelectLookup
                    value={filters[d.key]}
                    onChange={v => setFilters(f => ({ ...f, [d.key]: v }))}
                    options={optionsFor(d.key)}
                    placeholder="— Tutti —"
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', background: matchBg, borderRadius: 6, fontSize: 12, color: matchColor, fontWeight: 600 }}>
              {matchInfo}
            </div>

            {error && <p style={{ color: '#c00', fontSize: 12, margin: '8px 0 0' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setShowModal(false)} className="btn-red" style={{ padding: '0 18px', fontSize: 13 }}>
                Annulla
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm || pending}
                className={canConfirm && !pending ? 'btn-green' : 'btn-gray'}
                style={{ padding: '0 22px', fontSize: 13, opacity: canConfirm && !pending ? 1 : 0.5 }}
              >
                {pending ? 'Salvataggio…' : 'Conferma'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
