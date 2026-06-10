'use client'

import { useState, useEffect, useMemo, useTransition, useRef } from 'react'
import { aggiungiAlCarrello, aggiungiAlPreventivoDaCatalogo, annullaParentPendente, type CartResult, type PreventivoDestOption } from '@/app/brand/cataloghi/actions'

export type ArticoloListino = {
  id: number
  descrizione: string
  produttore: string
  serie?: string | null
  unita: string
  prezzo_acquisto?: number | null
  prezzo_vendita: number
  sconto_articolo?: number | null
  richiede_larghezza?: number
  richiede_altezza?: number
  richiede_quantita?: number
  richiede_piano?: number
  richiede_km?: number
  richiede_peso?: number
  richiede_tipo_colore?: number
  richiede_tipo_vetro?: number
  richiede_tipo_montaggio?: number
  schema_url?: string | null
  max_acquistabile?: number | null
}


export default function AggiungiArticoloForm({
  articoli,
  isStaff = false,
  isLoggedIn = false,
  preventiviBozza,
  cartNonVuoto = false,
  parentPendente,
  carrelloHref = '/area-clienti/carrello-preventivo',
  preventivoClienteBaseHref = '/area-clienti/preventivi',
  submitLabel = 'Aggiungi al carrello',
}: {
  articoli: ArticoloListino[]
  isStaff?: boolean
  isLoggedIn?: boolean
  preventiviBozza?: PreventivoDestOption[]
  cartNonVuoto?: boolean
  parentPendente?: { uid: number; desc: string }
  carrelloHref?: string
  preventivoClienteBaseHref?: string
  submitLabel?: string
}) {
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [produttoreFiltro, setProduttoreFiltro] = useState('')
  const [serieFiltro, setSerieFiltro] = useState('')
  const [ricerca, setRicerca] = useState('')
  const [schemaFiltro, setSchemaFiltro] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number>(articoli[0]?.id ?? 0)
  const [result, setResult] = useState<CartResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [canSubmit, setCanSubmit] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const sel = artFiltrati.find(a => a.id === selectedId) ?? artFiltrati[0]
    const hasRequired = !!(sel && (
      sel.richiede_larghezza === 1 || sel.richiede_altezza === 1 ||
      sel.richiede_quantita === 1  || sel.richiede_piano === 1   ||
      sel.richiede_km === 1        || sel.richiede_peso === 1
    ))
    if (!hasRequired) { setCanSubmit(true); return }
    const t = setTimeout(() => setCanSubmit(formRef.current?.checkValidity() ?? false), 0)
    return () => clearTimeout(t)
  }, [selectedId, step])

  const mostraDestinazione = !cartNonVuoto && (preventiviBozza?.length ?? 0) > 0
  const [destId, setDestId] = useState('cart')

  useEffect(() => {
    if (!mostraDestinazione) return
    try {
      const stored = localStorage.getItem('digi_prev_dest') ?? ''
      if (preventiviBozza?.some(p => String(p.id) === stored)) setDestId(stored)
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const destOptions = useMemo(() => {
    if (!mostraDestinazione || !preventiviBozza) return []
    const selPrev = preventiviBozza.find(p => String(p.id) === destId)
    const others  = preventiviBozza.filter(p => String(p.id) !== destId)
    const cartOpt = { value: 'cart', label: 'Nuova simulazione' }
    const prefixed = (p: { id: number; label: string }) => ({ value: String(p.id), label: `Prev. N° ${p.label}` })
    return selPrev
      ? [prefixed(selPrev), cartOpt, ...others.map(prefixed)]
      : [cartOpt, ...preventiviBozza.map(prefixed)]
  }, [mostraDestinazione, preventiviBozza, destId])

  const produttori = useMemo(
    () => [...new Set(articoli.map(a => a.produttore))].filter(Boolean).sort(),
    [articoli]
  )

  const serie = useMemo(
    () => [...new Set(articoli.map(a => a.serie).filter(Boolean))].sort() as string[],
    [articoli]
  )

  const labelOf = (a: ArticoloListino) => {
    const parts = [a.descrizione, a.produttore, a.serie].filter(Boolean)
    const sc = a.sconto_articolo ?? 0
    // prezzo + unità sempre
    if (a.prezzo_vendita > 0) {
      const unitPart = a.unita ? ` al ${a.unita}` : ''
      parts.push(`(€${Number(a.prezzo_vendita).toFixed(2)}${unitPart})`)
    } else if (a.unita) {
      parts.push(a.unita)
    }
    // maggiorazione sempre
    if (sc < 0) parts.push(`magg. +${Math.abs(sc)}%`)
    // sconto solo se loggato
    else if (sc > 0 && isLoggedIn) parts.push(`sconto ${sc}%`)
    // costo fornitore solo per dipendente/admin
    if (isStaff && (a.prezzo_acquisto ?? 0) > 0) parts.push(`acq. €${Number(a.prezzo_acquisto).toFixed(2)}`)
    const label = parts.join(' - ')
    if (a.max_acquistabile === 0) return label + ' [ESAURITO]'
    if (a.max_acquistabile != null) return label + ` [Max ${a.max_acquistabile}]`
    return label
  }

  const artBase = useMemo(() => {
    let lista = articoli
    if (produttoreFiltro) lista = lista.filter(a => a.produttore === produttoreFiltro)
    if (serieFiltro) lista = lista.filter(a => a.serie === serieFiltro)
    if (ricerca.trim()) {
      const q = ricerca.trim().toLowerCase()
      lista = lista.filter(a =>
        [a.descrizione, a.produttore, a.serie, a.unita].some(v => v?.toLowerCase().includes(q))
      )
    }
    return lista
  }, [articoli, produttoreFiltro, serieFiltro, ricerca])

  const artFiltrati = useMemo(() => {
    let lista = artBase
    if (schemaFiltro) lista = lista.filter(a => a.schema_url === schemaFiltro)
    const seen = new Set<string>()
    return lista.filter(a => {
      const lbl = labelOf(a)
      if (seen.has(lbl)) return false
      seen.add(lbl)
      return true
    })
  }, [artBase, schemaFiltro])

  const thumbnailsData = useMemo(() => {
    const map = new Map<string, { arts: ArticoloListino[] }>()
    for (const a of artBase) {
      if (!a.schema_url) continue
      const entry = map.get(a.schema_url) ?? { arts: [] }
      entry.arts.push(a)
      map.set(a.schema_url, entry)
    }
    return [...map.entries()]
      .map(([url, { arts }]) => ({ url, count: arts.length, singleId: arts.length === 1 ? arts[0].id : null }))
      .sort((a, b) => b.count - a.count)
  }, [artBase])

  useEffect(() => {
    setSchemaFiltro(null)
  }, [produttoreFiltro, serieFiltro, ricerca])

  useEffect(() => {
    setSelectedId(artFiltrati[0]?.id ?? 0)
  }, [artFiltrati])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const goToCart = !mostraDestinazione || destId === 'cart'
    if (!goToCart) formData.set('preventivo_id', destId)
    if (mostraDestinazione) {
      try { localStorage.setItem('digi_prev_dest', destId) } catch {}
    }
    startTransition(async () => {
      let res: CartResult
      if (goToCart) {
        res = await aggiungiAlCarrello(null, formData)
      } else {
        res = await aggiungiAlPreventivoDaCatalogo(formData)
      }
      setResult(res)
      if (res.ok) setStep('select')
    })
  }

  if (articoli.length === 0) return null

  const selected = artFiltrati.find(a => a.id === selectedId) ?? artFiltrati[0]

  const inpStyle: React.CSSProperties = {
    padding: '7px 10px', border: '1px solid #ccc',
    borderRadius: 4, fontSize: 13, fontFamily: 'inherit',
    width: '100%', boxSizing: 'border-box',
    color: '#333', WebkitTextFillColor: '#333', background: '#fff',
  }
  const lbl: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 3,
  }

  function handleAnnullaParent() {
    annullaParentPendente().then(() => { window.location.href = carrelloHref })
  }

  return (
    <div style={{
      background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10,
      padding: '20px 4px',
    }}>
      {parentPendente && (
        <div style={{
          background: '#fff8e1', border: '1px solid #f0b429', borderRadius: 7,
          padding: '10px 14px', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span className="testo-articoli" style={{ flex: 1 }}>
            Stai aggiungendo una <strong>caratteristica</strong> di:{' '}
            <em>{parentPendente.desc}</em>
          </span>
          <button
            type="button"
            onClick={handleAnnullaParent}
            style={{ fontSize: 12, padding: '4px 12px', border: '1px solid #ccc', borderRadius: 4, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            Annulla
          </button>
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <h2 className="testo-articoli" style={{ margin: 0 }}>
          {parentPendente ? 'Scegli la caratteristica da aggiungere' : 'Aggiungi articolo al preventivo da elenco'}
        </h2>
      </div>

      {step === 'select' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Griglia schema */}
          {thumbnailsData.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
              {thumbnailsData.map(({ url, count, singleId }) => {
                const isSelected = schemaFiltro === url
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => {
                      if (singleId !== null) {
                        setSelectedId(singleId)
                        setSchemaFiltro(null)
                        setResult(null)
                        setStep('detail')
                      } else {
                        setSchemaFiltro(isSelected ? null : url)
                      }
                    }}
                    title={count > 1 ? `${count} articoli` : undefined}
                    style={{
                      padding: 0, background: '#fff', cursor: 'pointer',
                      border: isSelected ? '2px solid #c8960c' : '1px solid #ddd',
                      borderRadius: 6, overflow: 'hidden',
                      boxShadow: isSelected ? '0 0 0 2px rgba(200,150,12,0.25)' : 'none',
                    }}
                  >
                    <img src={url} alt="" style={{ display: 'block', width: '100%', height: 70, objectFit: 'contain', background: '#f9f9f9' }} />
                  </button>
                )
              })}
            </div>
          )}
          {/* Filtri */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {produttori.length >= 2 && (
              <div style={{ flex: '1 1 150px' }}>
                <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Produttore</label>
                <select value={produttoreFiltro} onChange={e => setProduttoreFiltro(e.target.value)} style={inpStyle}>
                  <option value="">— Tutti —</option>
                  {produttori.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
            {serie.length >= 2 && (
              <div style={{ flex: '1 1 150px' }}>
                <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Serie</label>
                <select value={serieFiltro} onChange={e => setSerieFiltro(e.target.value)} style={inpStyle}>
                  <option value="">— Tutte —</option>
                  {serie.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div style={{ flex: '2 1 200px' }}>
              <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Cerca per descrizione</label>
              <input
                type="text"
                value={ricerca}
                onChange={e => setRicerca(e.target.value)}
                placeholder="es. porta finestra, vasistas…"
                style={inpStyle}
              />
            </div>
          </div>
          {/* Selezione articolo */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '2 1 260px' }}>
              <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>
                Articolo{artFiltrati.length !== articoli.length ? ` (${artFiltrati.length} di ${articoli.length})` : ''}
              </label>
              {artFiltrati.length === 0 ? (
                <p className="testo-articoli" style={{ margin: 0 }}>Nessun articolo trovato.</p>
              ) : (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(Number(e.target.value))}
                  style={inpStyle}
                >
                  {artFiltrati.map(a => (
                    <option key={a.id} value={a.id}>{labelOf(a)}</option>
                  ))}
                </select>
              )}
            </div>
            {artFiltrati.length > 0 && (
              <div style={{ flex: '0 0 100%', display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setResult(null); setStep('detail') }}
                  className="btn-green"
                  style={{ padding: '0 22px', fontSize: 13, flexShrink: 0 }}
                >
                  {mostraDestinazione ? 'Aggiungi a:' : 'Aggiungi a simulazione'}
                </button>
                {mostraDestinazione && (
                  <select
                    value={destId}
                    onChange={e => setDestId(e.target.value)}
                    style={{ flex: 1, fontSize: 12, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', cursor: 'pointer', minWidth: 0, height: 42 }}
                  >
                    {destOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'detail' && selected && (
        <form key={selected.id} ref={formRef} onSubmit={handleSubmit} onChange={e => setCanSubmit((e.currentTarget as HTMLFormElement).checkValidity())} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
          <input type="hidden" name="listino_id" value={selected.id} />
          <p className="testo-articoli" style={{ margin: 0 }}>
            {selected.descrizione}{' '}
            <span style={{ fontWeight: 400 }}>— {selected.produttore}</span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {selected.richiede_larghezza === 1 && (
              <label className="testo-articoli" style={{ ...lbl, gridColumn: '1 / -1' }}>
                Larghezza (cm) *
                <input name="larghezza" type="number" min={0} step="0.1" placeholder="es. 120" required style={inpStyle} />
              </label>
            )}
            {selected.richiede_altezza === 1 && (
              <label className="testo-articoli" style={{ ...lbl, gridColumn: '1 / -1' }}>
                Altezza (cm) *
                <input name="altezza" type="number" min={0} step="0.1" placeholder="es. 210" required style={inpStyle} />
              </label>
            )}
            {selected.richiede_quantita === 1 && (
              <label className="testo-articoli" style={lbl}>
                Quantità *
                <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
              </label>
            )}
            {selected.richiede_piano === 1 && (
              <label className="testo-articoli" style={lbl}>
                Piano *
                <input name="piano" type="number" min={0} step="1" placeholder="es. 2" required style={inpStyle} />
              </label>
            )}
            {selected.richiede_km === 1 && (
              <label className="testo-articoli" style={lbl}>
                Km *
                <input name="km" type="number" min={0} step="0.1" placeholder="es. 15" required style={inpStyle} />
              </label>
            )}
            {selected.richiede_peso === 1 && (
              <label className="testo-articoli" style={lbl}>
                Peso (kg) *
                <input name="peso" type="number" min={0} step="0.1" placeholder="es. 5" required style={inpStyle} />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setStep('select')}
              className="btn-red"
              style={{ flex: 1, fontSize: 13 }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className={canSubmit && !isPending ? 'btn-green' : 'btn-gray'}
              style={{ flex: 1, fontSize: 13 }}
            >
              {isPending
                ? 'Aggiunta…'
                : mostraDestinazione && destId !== 'cart'
                  ? 'Aggiungi al preventivo'
                  : submitLabel}
            </button>
          </div>
        </form>
      )}

      {result?.ok && (
        <p className="testo-articoli" style={{ marginTop: 10, marginBottom: 0 }}>
          ✓ Articolo aggiunto.
        </p>
      )}
      {result && !result.ok && (
        <p className="testo-articoli" style={{ marginTop: 10, marginBottom: 0 }}>{result.error}</p>
      )}
    </div>
  )
}
