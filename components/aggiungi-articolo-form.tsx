'use client'

import { useState, useEffect, useMemo, useTransition } from 'react'
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
}


export default function AggiungiArticoloForm({
  articoli,
  isStaff = false,
  isLoggedIn = false,
  preventiviBozza,
  cartNonVuoto = false,
  parentPendente,
}: {
  articoli: ArticoloListino[]
  isStaff?: boolean
  isLoggedIn?: boolean
  preventiviBozza?: PreventivoDestOption[]
  cartNonVuoto?: boolean
  parentPendente?: { uid: number; desc: string }
}) {
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [produttoreFiltro, setProduttoreFiltro] = useState('')
  const [serieFiltro, setSerieFiltro] = useState('')
  const [ricerca, setRicerca] = useState('')
  const [selectedId, setSelectedId] = useState<number>(articoli[0]?.id ?? 0)
  const [result, setResult] = useState<CartResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    const sel = artFiltrati.find(a => a.id === selectedId) ?? artFiltrati[0]
    const hasRequired = !!(sel && (
      sel.richiede_larghezza === 1 || sel.richiede_altezza === 1 ||
      sel.richiede_quantita === 1  || sel.richiede_piano === 1   ||
      sel.richiede_km === 1        || sel.richiede_peso === 1
    ))
    setCanSubmit(!hasRequired)
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
    const cartOpt = { value: 'cart', label: 'Nuovo carrello' }
    return selPrev
      ? [{ value: String(selPrev.id), label: selPrev.label }, cartOpt, ...others.map(p => ({ value: String(p.id), label: p.label }))]
      : [cartOpt, ...preventiviBozza.map(p => ({ value: String(p.id), label: p.label }))]
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
    return parts.join(' - ')
  }

  const artFiltrati = useMemo(() => {
    let lista = articoli
    if (produttoreFiltro) lista = lista.filter(a => a.produttore === produttoreFiltro)
    if (serieFiltro) lista = lista.filter(a => a.serie === serieFiltro)
    if (ricerca.trim()) {
      const q = ricerca.trim().toLowerCase()
      lista = lista.filter(a =>
        [a.descrizione, a.produttore, a.serie, a.unita].some(v => v?.toLowerCase().includes(q))
      )
    }
    const seen = new Set<string>()
    return lista.filter(a => {
      const lbl = labelOf(a)
      if (seen.has(lbl)) return false
      seen.add(lbl)
      return true
    })
  }, [articoli, produttoreFiltro, serieFiltro, ricerca])

  useEffect(() => {
    setSelectedId(artFiltrati[0]?.id ?? 0)
  }, [produttoreFiltro, serieFiltro, ricerca, artFiltrati])

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
    annullaParentPendente().then(() => { window.location.href = '/area-clienti/carrello-preventivo' })
  }

  return (
    <div style={{
      background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10,
      padding: '20px 24px', marginTop: 32,
    }}>
      {parentPendente && (
        <div style={{
          background: '#fff8e1', border: '1px solid #f0b429', borderRadius: 7,
          padding: '10px 14px', marginBottom: 16,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <h2 className="testo-articoli" style={{ margin: 0 }}>
          {parentPendente ? 'Scegli la caratteristica da aggiungere' : 'Aggiungi articolo al preventivo da elenco'}
        </h2>
        {mostraDestinazione && (
          <select
            value={destId}
            onChange={e => setDestId(e.target.value)}
            style={{ fontSize: 12, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', cursor: 'pointer', flex: '1 1 0', minWidth: 0 }}
          >
            {destOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>

      {step === 'select' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Filtri */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
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
              <button
                type="button"
                onClick={() => { setResult(null); setStep('detail') }}
                className="btn-green"
                style={{ padding: '7px 22px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Aggiungi →
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'detail' && selected && (
        <form key={selected.id} onSubmit={handleSubmit} onChange={e => setCanSubmit((e.currentTarget as HTMLFormElement).checkValidity())} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
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
            {selected.richiede_tipo_colore === 1 && (
              <p className="testo-articoli" style={{ gridColumn: '1 / -1', margin: 0, background: '#fff8e1', border: '1px solid #f0b429', borderRadius: 5, padding: '7px 10px', WebkitTextFillColor: '#7a5800' }}>
                Opzionare tra Colori standard o colori con maggiorazione di prezzo
              </p>
            )}
            {selected.richiede_tipo_vetro === 1 && (
              <p className="testo-articoli" style={{ gridColumn: '1 / -1', margin: 0, background: '#fff8e1', border: '1px solid #f0b429', borderRadius: 5, padding: '7px 10px', WebkitTextFillColor: '#7a5800' }}>
                Opzionare se Fornitura senza vetri o il tipo di vetri
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setStep('select')}
              className="btn-red"
              style={{ padding: '7px 16px', fontSize: 13, fontFamily: 'inherit' }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className={canSubmit && !isPending ? 'btn-green' : 'btn-gray'}
              style={{ padding: '7px 22px', fontSize: 13, fontWeight: 600 }}
            >
              {isPending
                ? 'Aggiunta…'
                : mostraDestinazione && destId !== 'cart'
                  ? 'Aggiungi al preventivo'
                  : 'Aggiungi al carrello'}
            </button>
          </div>
        </form>
      )}

      {result?.ok && (
        <p className="testo-articoli" style={{ marginTop: 10, marginBottom: 0 }}>
          ✓ Articolo aggiunto.{' '}
          {result.preventivoId ? (
            <a href={isStaff ? `/clienti/preventivi/${result.preventivoId}` : `/area-clienti/preventivi/${result.preventivoId}`} style={{ color: '#2e7d32', fontWeight: 600 }}>
              Vai al preventivo →
            </a>
          ) : (
            <a href="/area-clienti/carrello-preventivo" style={{ color: '#2e7d32', fontWeight: 600 }}>
              Vai al carrello →
            </a>
          )}
        </p>
      )}
      {result && !result.ok && (
        <p className="testo-articoli" style={{ marginTop: 10, marginBottom: 0 }}>{result.error}</p>
      )}
    </div>
  )
}
