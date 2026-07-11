'use client'
import { b } from '@/lib/btn'

import { useState, useEffect, useMemo, useTransition, useRef } from 'react'
import { usePreventiviAbilitato } from '@/lib/preventivi-flag-context'
import SelectLookup from '@/components/select-lookup'
import { useRouter } from 'next/navigation'
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
  filtro_1?: number
  filtro_2?: number
  filtro_3?: number
  filtro_4?: number
  filtro_5?: number
  filtro_6?: number
  filtro_7?: number
  filtro_8?: number
  filtro_9?: number
  filtro_10?: number
  sottocategoria?: string | null
  fase?: string | null
  materiale?: string | null
  tipologia?: string | null
  ambiente?: string | null
  fascia?: string | null
  categoria?: string | null
}

export type ConfirmData = {
  listinoId: number
  larghezza?: number
  altezza?: number
  quantita?: number
  piano?: number
  km?: number
  peso?: number
  colore?: string
  note?: string
}

const FILTRI_MODELLO: { label: string; key: 'filtro_1' | 'filtro_2' | 'filtro_3' | 'filtro_4' }[] = [
  { label: '1 Anta',    key: 'filtro_1' },
  { label: '2 Ante',   key: 'filtro_2' },
  { label: '3+ Ante',  key: 'filtro_3' },
  { label: 'Sopraluce', key: 'filtro_4' },
]

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
  isApp,
  hideClassificationFilters = false,
  lockedCat,
  lockedSottocat,
  onSottocatChange,
  onConfirm,
  onClose,
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
  isApp?: boolean
  hideClassificationFilters?: boolean
  lockedCat?: string
  lockedSottocat?: string
  onSottocatChange?: (val: string) => void
  onConfirm?: (data: ConfirmData) => Promise<CartResult>
  onClose?: () => void
}) {
  const preventiviAbilitato = usePreventiviAbilitato()
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [sottocatFiltro, setSottocatFiltro] = useState('')
  const [faseFiltro, setFaseFiltro]         = useState('')
  const [materialeFiltro, setMaterialeFiltro] = useState('')
  const [tipologiaFiltro, setTipologiaFiltro] = useState('')
  const [ambienteFiltro, setAmbienteFiltro] = useState('')
  const [fasciaFiltro, setFasciaFiltro]     = useState('')
  const [produttoreFiltro, setProduttoreFiltro] = useState('')
  const [serieFiltro, setSerieFiltro] = useState('')
  const [catFiltro, setCatFiltro] = useState('')
  const [filtriModelloAttivi, setFiltriModelloAttivi] = useState<Set<string>>(new Set())
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

  // cascata classificazione
  const catOpt       = useMemo(() => [...new Set(articoli.map(a => a.categoria).filter(Boolean))].sort() as string[], [articoli])
  const postCat      = useMemo(() => catFiltro ? articoli.filter(a => a.categoria === catFiltro) : articoli, [articoli, catFiltro])
  const sottocatOpt  = useMemo(() => [...new Set(postCat.map(a => a.sottocategoria).filter(Boolean))].sort() as string[], [postCat])
  const postSottocat = useMemo(() => sottocatFiltro ? postCat.filter(a => a.sottocategoria === sottocatFiltro) : postCat, [postCat, sottocatFiltro])
  const faseOpt      = useMemo(() => [...new Set(postSottocat.map(a => a.fase).filter(Boolean))].sort() as string[], [postSottocat])
  const postFase     = useMemo(() => faseFiltro ? postSottocat.filter(a => a.fase === faseFiltro) : postSottocat, [postSottocat, faseFiltro])
  const matOpt       = useMemo(() => [...new Set(postFase.map(a => a.materiale).filter(Boolean))].sort() as string[], [postFase])
  const postMat      = useMemo(() => materialeFiltro ? postFase.filter(a => a.materiale === materialeFiltro) : postFase, [postFase, materialeFiltro])
  const tipoOpt      = useMemo(() => [...new Set(postMat.map(a => a.tipologia).filter(Boolean))].sort() as string[], [postMat])
  const postTipo     = useMemo(() => tipologiaFiltro ? postMat.filter(a => a.tipologia === tipologiaFiltro) : postMat, [postMat, tipologiaFiltro])
  const ambOpt       = useMemo(() => [...new Set(postTipo.map(a => a.ambiente).filter(Boolean))].sort() as string[], [postTipo])
  const postAmb      = useMemo(() => ambienteFiltro ? postTipo.filter(a => a.ambiente === ambienteFiltro) : postTipo, [postTipo, ambienteFiltro])
  const fasciaOpt    = useMemo(() => [...new Set(postAmb.map(a => a.fascia).filter(Boolean))].sort() as string[], [postAmb])
  const postClassifica = useMemo(() => fasciaFiltro ? postAmb.filter(a => a.fascia === fasciaFiltro) : postAmb, [postAmb, fasciaFiltro])

  const produttori = useMemo(
    () => [...new Set(postClassifica.map(a => a.produttore))].filter(Boolean).sort(),
    [postClassifica]
  )

  const serie = useMemo(
    () => [...new Set(postClassifica.map(a => a.serie).filter(Boolean))].sort() as string[],
    [postClassifica]
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
    let lista = postClassifica
    if (produttoreFiltro) lista = lista.filter(a => a.produttore === produttoreFiltro)
    if (serieFiltro) lista = lista.filter(a => a.serie === serieFiltro)
    return lista
  }, [postClassifica, produttoreFiltro, serieFiltro])

  const haFiltriModello = useMemo(
    () => FILTRI_MODELLO.some(f => artBase.some(a => (a[f.key] ?? 0) === 1)),
    [artBase]
  )

  const artFiltrati = useMemo(() => {
    let lista = artBase
    if (filtriModelloAttivi.size > 0) {
      lista = lista.filter(a => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (a[f.key] ?? 0) === 1
      }))
    }
    if (schemaFiltro) lista = lista.filter(a => a.schema_url === schemaFiltro)
    const seen = new Set<string>()
    return lista.filter(a => {
      const lbl = labelOf(a)
      if (seen.has(lbl)) return false
      seen.add(lbl)
      return true
    })
  }, [artBase, schemaFiltro, filtriModelloAttivi])

  const thumbnailsData = useMemo(() => {
    let base = artBase
    if (filtriModelloAttivi.size > 0) {
      base = base.filter(a => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (a[f.key] ?? 0) === 1
      }))
    }
    const map = new Map<string, number>()
    for (const a of base) {
      if (!a.schema_url) continue
      map.set(a.schema_url, (map.get(a.schema_url) ?? 0) + 1)
    }
    return [...map.entries()]
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
  }, [artBase, filtriModelloAttivi])

  useEffect(() => {
    setSchemaFiltro(null)
    setFiltriModelloAttivi(new Set())
  }, [sottocatFiltro, faseFiltro, materialeFiltro, tipologiaFiltro, ambienteFiltro, fasciaFiltro, produttoreFiltro, serieFiltro])

  useEffect(() => {
    setSottocatFiltro(''); setFaseFiltro(''); setMaterialeFiltro(''); setTipologiaFiltro('')
    setAmbienteFiltro(''); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro('')
    setSchemaFiltro(null); setFiltriModelloAttivi(new Set())
  }, [catFiltro])

  useEffect(() => {
    setSelectedId(artFiltrati[0]?.id ?? 0)
  }, [artFiltrati])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (onConfirm && selected) {
      const formData = new FormData(e.currentTarget)
      const data: ConfirmData = {
        listinoId: selected.id,
        larghezza: parseFloat(formData.get('larghezza') as string) || undefined,
        altezza:   parseFloat(formData.get('altezza')   as string) || undefined,
        quantita:  parseFloat(formData.get('quantita')  as string) || undefined,
        piano:     parseFloat(formData.get('piano')     as string) || undefined,
        km:        parseFloat(formData.get('km')        as string) || undefined,
        peso:      parseFloat(formData.get('peso')      as string) || undefined,
        colore:    (formData.get('colore') as string)   || undefined,
        note:      (formData.get('note')   as string)   || undefined,
      }
      startTransition(async () => {
        const res = await onConfirm(data)
        setResult(res)
        if (res.ok) { setStep('select'); onClose?.() }
      })
      return
    }
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
      if (res.ok) { setStep('select'); router.refresh() }
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

  if (!preventiviAbilitato) return null

  return (
    <div style={{
      background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10,
      padding: isApp ? '20px 4px 0' : '20px 24px',
    }}>
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button type="button" onClick={onClose} className={b('btn-red', isApp)} style={{ width: 32, height: 32, fontSize: 16, padding: 0, borderRadius: '50%', lineHeight: 1 }}>✕</button>
        </div>
      )}
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
          {/* Filtri a cascata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!hideClassificationFilters && (lockedCat || catOpt.length > 0) && (
              <div>
                <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Categoria</label>
                {lockedCat ? (
                  <select disabled value={lockedCat} style={{ ...inpStyle, opacity: 0.6, cursor: 'not-allowed' }}>
                    <option value={lockedCat}>{lockedCat}</option>
                  </select>
                ) : (
                  <SelectLookup value={catFiltro} onChange={v => setCatFiltro(v)} options={[{ value: '', label: '— Tutti —' }, ...catOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                )}
              </div>
            )}
            {!hideClassificationFilters && (
              <>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Sottocategoria</label>
                  {lockedSottocat ? (
                    <select disabled value={lockedSottocat} style={{ ...inpStyle, opacity: 0.6, cursor: 'not-allowed' }}>
                      <option value={lockedSottocat}>{lockedSottocat}</option>
                    </select>
                  ) : (
                    <SelectLookup value={sottocatFiltro} onChange={v => { setSottocatFiltro(v); setFaseFiltro(''); setMaterialeFiltro(''); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro(''); onSottocatChange?.(v) }} options={[{ value: '', label: '— Tutte —' }, ...sottocatOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                  )}
                </div>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Fase</label>
                  <SelectLookup value={faseFiltro} onChange={v => { setFaseFiltro(v); setMaterialeFiltro(''); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro('') }} options={[{ value: '', label: '— Tutte —' }, ...faseOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                </div>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Materiale</label>
                  <SelectLookup value={materialeFiltro} onChange={v => { setMaterialeFiltro(v); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro('') }} options={[{ value: '', label: '— Tutti —' }, ...matOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                </div>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Tipologia</label>
                  <SelectLookup value={tipologiaFiltro} onChange={v => { setTipologiaFiltro(v); setAmbienteFiltro(''); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro('') }} options={[{ value: '', label: '— Tutte —' }, ...tipoOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                </div>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Ambiente</label>
                  <SelectLookup value={ambienteFiltro} onChange={v => { setAmbienteFiltro(v); setFasciaFiltro(''); setProduttoreFiltro(''); setSerieFiltro('') }} options={[{ value: '', label: '— Tutti —' }, ...ambOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                </div>
                <div>
                  <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Fascia</label>
                  <SelectLookup value={fasciaFiltro} onChange={v => { setFasciaFiltro(v); setProduttoreFiltro(''); setSerieFiltro('') }} options={[{ value: '', label: '— Tutte —' }, ...fasciaOpt.map(v => ({ value: v, label: v }))]} style={inpStyle} />
                </div>
              </>
            )}
            <div>
              <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Marca</label>
              <SelectLookup value={produttoreFiltro} onChange={v => { setProduttoreFiltro(v); setSerieFiltro('') }} options={[{ value: '', label: '— Tutti —' }, ...produttori.map(p => ({ value: p, label: p }))]} style={inpStyle} />
            </div>
            <div>
              <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Serie</label>
              <SelectLookup value={serieFiltro} onChange={setSerieFiltro} options={[{ value: '', label: '— Tutte —' }, ...serie.map(s => ({ value: s, label: s }))]} style={inpStyle} />
            </div>
          </div>
          {/* Linguette filtro modello */}
          {haFiltriModello && (() => {
            const H = 28, THUMB = 22
            const chipsDisponibili = FILTRI_MODELLO.filter(f => artBase.some(a => (a[f.key] ?? 0) === 1))
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #d0d0d0', borderRadius: 10, padding: '6px 12px', overflow: 'hidden' }}>
                <button type="button" disabled={filtriModelloAttivi.size === 0 && !schemaFiltro}
                  className={`${filtriModelloAttivi.size > 0 || schemaFiltro ? 'btn-red' : 'btn-gray'} btn-icon fs-11`}
                  style={{ flexShrink: 0 }}
                  onClick={() => { setFiltriModelloAttivi(new Set()); setSchemaFiltro(null) }}
                >✕</button>
                <div style={{ width: 1, height: 20, background: '#ddd', flexShrink: 0, margin: '0 10px' }} />
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const, paddingBottom: 2 }}>
                  {chipsDisponibili.map(f => {
                    const attiva = filtriModelloAttivi.has(f.label)
                    const W = Math.max(THUMB + 8 + f.label.length * 7, 90)
                    return (
                      <div key={f.label} role="button" tabIndex={0}
                        onClick={() => {
                          setFiltriModelloAttivi(prev => { const n = new Set(prev); n.has(f.label) ? n.delete(f.label) : n.add(f.label); return n })
                          setSchemaFiltro(null)
                        }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setFiltriModelloAttivi(prev => { const n = new Set(prev); n.has(f.label) ? n.delete(f.label) : n.add(f.label); return n }); setSchemaFiltro(null) } }}
                        style={{ position: 'relative', width: W, height: H, borderRadius: H / 2, flexShrink: 0, background: attiva ? '#1e5c1e' : '#3a3a3a', transition: 'background 0.2s', cursor: 'pointer', userSelect: 'none' }}
                      >
                        <span style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 700, color: attiva ? '#7dda7d' : 'transparent', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{f.label}</span>
                        <span style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 400, color: attiva ? 'transparent' : '#aaaaaa', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{f.label}</span>
                        <div style={{ position: 'absolute', width: THUMB, height: THUMB, borderRadius: '50%', background: '#fff', top: (H - THUMB) / 2, left: attiva ? W - THUMB - 3 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
          {/* Griglia schema */}
          {thumbnailsData.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
              {thumbnailsData.map(({ url, count }) => {
                const isSelected = schemaFiltro === url
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSchemaFiltro(isSelected ? null : url)}
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
          {/* Selezione articolo */}
          <div>
            <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>
              Articolo{artFiltrati.length !== articoli.length ? ` (${artFiltrati.length} di ${articoli.length})` : ''}
            </label>
            {artFiltrati.length === 0 ? (
              <p className="testo-articoli" style={{ margin: 0 }}>Nessun articolo trovato.</p>
            ) : (
              <SelectLookup
                value={String(selectedId)}
                onChange={v => { setSelectedId(Number(v)); if (!v) setSchemaFiltro(null) }}
                options={artFiltrati.map(a => ({ value: String(a.id), label: labelOf(a) }))}
                style={inpStyle}
              />
            )}
          </div>
          {artFiltrati.length > 0 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: isApp ? 'center' : undefined, marginTop: isApp ? 6 : undefined, marginBottom: isApp ? 14 : undefined }}>
              <button
                type="button"
                onClick={() => { setResult(null); setStep('detail') }}
                className={b('btn-green', isApp)}
                style={{ padding: '0 22px', fontSize: 13, flexShrink: 0 }}
              >
                {onConfirm ? 'Avanti →' : mostraDestinazione ? 'Aggiungi a:' : '+ Aggiungi a simulazione'}
              </button>
              {mostraDestinazione && (
                <SelectLookup
                  value={destId}
                  onChange={setDestId}
                  options={destOptions}
                  style={{ flex: 1, fontSize: 12, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', minWidth: 0 }}
                />
              )}
            </div>
          )}
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
                <input name="larghezza" type="number" min={0} step="0.1" required style={inpStyle} />
              </label>
            )}
            {selected.richiede_altezza === 1 && (
              <label className="testo-articoli" style={{ ...lbl, gridColumn: '1 / -1' }}>
                Altezza (cm) *
                <input name="altezza" type="number" min={0} step="0.1" required style={inpStyle} />
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

          {selected.richiede_tipo_colore === 1 && (
            <label className="testo-articoli" style={lbl}>
              Colore
              <input name="colore" type="text" placeholder="es. Bianco RAL 9010" style={inpStyle} />
            </label>
          )}
          {onConfirm && (
            <label className="testo-articoli" style={lbl}>
              Note
              <textarea name="note" rows={2} style={{ ...inpStyle, resize: 'vertical' as const }} />
            </label>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => { onClose ? onClose() : setStep('select') }}
              className={b('btn-red', isApp)}
              style={{ minWidth: 120, fontSize: 13 }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className={canSubmit && !isPending ? b('btn-green', isApp) : b('btn-gray', isApp)}
              style={{ minWidth: 120, fontSize: 13 }}
            >
              {isPending
                ? 'Aggiunta…'
                : onConfirm
                  ? (submitLabel ?? 'Conferma')
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
