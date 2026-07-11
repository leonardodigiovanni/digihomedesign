'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import AggiungiArticolo, { type ArticoloListino } from './aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type Voce = {
  id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string
  descrizione?: string | null
  filtro_battente?: number; filtro_scorrevole?: number; filtro_taglio_termico?: number
  filtro_taglio_freddo?: number; filtro_economico?: number; filtro_fascia_alta?: number
  sottocategoria?: string | null; fase?: string | null; materiale?: string | null
  tipologia?: string | null; ambiente?: string | null; fascia?: string | null
  filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number
}

type Props = {
  voci: Voce[]
  articoliPerListino: Record<string, ArticoloListino[]>
  isStaff: boolean
  isLoggedIn: boolean
  preventiviBozza: PreventivoDestOption[]
  cartNonVuoto: boolean
  parentPendente?: { uid: number; desc: string }
  categorySlug?: string
  basePath?: string
  carrelloHref?: string
  preventivoClienteBaseHref?: string
  submitLabel?: string
  isApp?: boolean
  mostraFiltri?: boolean
  fixedCat?: string
  fixedSottocat?: string
}

// ─── Linguette PDF ─────────────────────────────────────────────────────────────

const PDF_FILTRI: { label: string; key: keyof Voce }[] = [
  { label: 'Battente',    key: 'filtro_battente' },
  { label: 'Scorrevole',  key: 'filtro_scorrevole' },
  { label: 'T. Termico',  key: 'filtro_taglio_termico' },
  { label: 'T. Freddo',   key: 'filtro_taglio_freddo' },
  { label: 'Economico',   key: 'filtro_economico' },
  { label: 'Fascia Alta', key: 'filtro_fascia_alta' },
]

// ─── Filtri modello (1 anta/2 ante/3+ ante/sopraluce) ─────────────────────────

const MODELLO_FILTRI = [
  { n: 1, label: '1 Anta' },
  { n: 2, label: '2 Ante' },
  { n: 3, label: '3+ Ante' },
  { n: 4, label: 'Sopraluce' },
] as const

function flagModello(obj: { filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number }, n: number): number {
  if (n === 1) return obj.filtro_1 ?? 0
  if (n === 2) return obj.filtro_2 ?? 0
  if (n === 3) return obj.filtro_3 ?? 0
  return obj.filtro_4 ?? 0
}

const H = 28, THUMB = 22

function Linguetta({ label, attiva, onToggle, disabled }: { label: string; attiva: boolean; onToggle: () => void; disabled?: boolean }) {
  const W = Math.max(THUMB + 8 + label.length * 7, 90)
  return (
    <div
      role="button" tabIndex={disabled ? -1 : 0} onClick={disabled ? undefined : onToggle}
      onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onToggle() }}
      style={{ position: 'relative', width: W, height: H, borderRadius: H / 2, flexShrink: 0, background: attiva ? '#1e5c1e' : '#3a3a3a', transition: 'background 0.2s', cursor: disabled ? 'default' : 'pointer', userSelect: 'none', opacity: disabled ? 0.55 : 1 }}
    >
      <span style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 700, color: attiva ? '#7dda7d' : 'transparent', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{label}</span>
      <span style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 400, color: attiva ? 'transparent' : '#aaaaaa', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{label}</span>
      <div style={{ position: 'absolute', width: THUMB, height: THUMB, borderRadius: '50%', background: '#fff', top: (H - THUMB) / 2, left: attiva ? W - THUMB - 3 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }} />
    </div>
  )
}

// ─── Dynamic import ───────────────────────────────────────────────────────────

const CatalogoClient = dynamic(() => import('./catalogo-client'), {
  ssr: false,
  loading: () => <p className="fs-14" style={{ color: '#aaa' }}>Caricamento…</p>,
})

const selStyle = { fontSize: 11, padding: '3px 6px', border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', background: '#fff', height: 26 }

// ─── Main component ───────────────────────────────────────────────────────────

export default function CatalogoWrapper({
  voci, articoliPerListino, isStaff, isLoggedIn, preventiviBozza, cartNonVuoto,
  parentPendente, categorySlug, basePath, carrelloHref, preventivoClienteBaseHref,
  submitLabel, isApp, fixedCat, fixedSottocat,
}: Props) {
  const [selectedVoce, setSelectedVoce] = useState<Voce | null>(null)

  const [formSottocat, setFormSottocat] = useState('')
  const [faseSel, setFaseSel] = useState('')
  const [materialeSel, setMaterialeSel] = useState('')
  const [tipologiaSel, setTipologiaSel] = useState('')
  const [ambienteSel, setAmbienteSel] = useState('')
  const [fasciaSel, setFasciaSel] = useState('')
  const [filtriPdf, setFiltriPdf] = useState<Set<string>>(new Set())
  const [filtriModello, setFiltriModello] = useState<Set<number>>(new Set())
  const [savedFilters, setSavedFilters] = useState<{
    formSottocat: string; faseSel: string; materialeSel: string; tipologiaSel: string
    ambienteSel: string; fasciaSel: string; filtriModello: Set<number>
  } | null>(null)

  // Pool articoli: tutti gli articoli da tutti i voci, deduplicati
  const articoliPool: ArticoloListino[] = (() => {
    const seen = new Set<number>()
    const result: ArticoloListino[] = []
    for (const arts of Object.values(articoliPerListino)) {
      for (const a of arts) { if (!seen.has(a.id)) { seen.add(a.id); result.push(a) } }
    }
    return result
  })()

  // Cascade — opzioni da unione voci+articoli; voci senza campo passano sempre.
  // Voci: match esatto (sono i cataloghi stessi). Articoli: match tollerante — un
  // articolo senza quel campo compilato non è stato ristretto, quindi va bene comunque.
  const sottocatOpt = [...new Set([...voci.map(v => v.sottocategoria), ...articoliPool.map(a => a.sottocategoria)].filter(Boolean))].sort() as string[]
  const post1 = formSottocat ? voci.filter(v => v.sottocategoria?.toLowerCase() === formSottocat.toLowerCase()) : voci
  const art1  = formSottocat ? articoliPool.filter(a => !a.sottocategoria || a.sottocategoria.toLowerCase() === formSottocat.toLowerCase()) : articoliPool

  const faseOpt = [...new Set([...post1.map(v => v.fase), ...art1.map(a => a.fase)].filter(Boolean))].sort() as string[]
  const post2 = faseSel ? post1.filter(v => v.fase === faseSel) : post1
  const art2  = faseSel ? art1.filter(a => !a.fase || a.fase === faseSel) : art1

  const materialeOpt = [...new Set([...post2.map(v => v.materiale), ...art2.map(a => a.materiale)].filter(Boolean))].sort() as string[]
  const post3 = materialeSel ? post2.filter(v => v.materiale === materialeSel) : post2
  const art3  = materialeSel ? art2.filter(a => !a.materiale || a.materiale === materialeSel) : art2

  const tipologiaOpt = [...new Set([...post3.map(v => v.tipologia), ...art3.map(a => a.tipologia)].filter(Boolean))].sort() as string[]
  const post4 = tipologiaSel ? post3.filter(v => v.tipologia === tipologiaSel) : post3
  const art4  = tipologiaSel ? art3.filter(a => !a.tipologia || a.tipologia === tipologiaSel) : art3

  const ambienteOpt = [...new Set([...post4.map(v => v.ambiente), ...art4.map(a => a.ambiente)].filter(Boolean))].sort() as string[]
  const post5 = ambienteSel ? post4.filter(v => v.ambiente === ambienteSel) : post4
  const art5  = ambienteSel ? art4.filter(a => !a.ambiente || a.ambiente === ambienteSel) : art4

  const fasciaOpt = [...new Set([...post5.map(v => v.fascia), ...art5.map(a => a.fascia)].filter(Boolean))].sort() as string[]
  const post6 = fasciaSel ? post5.filter(v => v.fascia === fasciaSel) : post5
  const art6  = fasciaSel ? art5.filter(a => !a.fascia || a.fascia === fasciaSel) : art5

  // Filtri modello (1 anta/2 ante/3+ ante/sopraluce): flag booleano, match sempre rigoroso.
  // Selezione manuale (nessun PDF aperto) = OR tra i chip attivi. PDF aperto = AND (eredita tutti i suoi flag insieme).
  const modelloDisponibili = MODELLO_FILTRI.filter(f => voci.some(v => flagModello(v, f.n) === 1))
  const postModello = filtriModello.size === 0 ? post6 : post6.filter(v =>
    selectedVoce
      ? [...filtriModello].every(n => flagModello(v, n) === 1)
      : [...filtriModello].some(n => flagModello(v, n) === 1)
  )
  const artModello = filtriModello.size === 0 ? art6 : art6.filter(a =>
    selectedVoce
      ? [...filtriModello].every(n => flagModello(a, n) === 1)
      : [...filtriModello].some(n => flagModello(a, n) === 1)
  )

  // Linguette PDF (filtri catalogo): filtrano SOLO l'elenco dei PDF mostrati, mai gli articoli
  // (non esiste un campo corrispondente sugli articoli — vedi decisione nel doc di progetto).
  const vociFiltrate = filtriPdf.size === 0 ? postModello : postModello.filter(v =>
    [...filtriPdf].some(lbl => {
      const f = PDF_FILTRI.find(f => f.label === lbl)
      return f && (v[f.key] as number ?? 0) === 1
    })
  )

  const artFiltrati = artModello

  const hasFilters = !!(faseSel || materialeSel || tipologiaSel || ambienteSel || fasciaSel || filtriPdf.size || filtriModello.size)

  // Linguette PDF disponibili = solo quelle per cui almeno un PDF ha il flag
  const linguettePdfDisponibili = PDF_FILTRI.filter(f => voci.some(v => (v[f.key] as number ?? 0) === 1))

  const showFiltriBar =
    linguettePdfDisponibili.length > 0 ||
    modelloDisponibili.length > 0 ||
    voci.some(v => v.sottocategoria || v.fase || v.materiale || v.tipologia || v.ambiente || v.fascia) ||
    articoliPool.some(a => a.sottocategoria || a.fase || a.materiale || a.tipologia || a.ambiente || a.fascia)

  function resetFiltri() {
    setFormSottocat(''); setFaseSel(''); setMaterialeSel('')
    setTipologiaSel(''); setAmbienteSel(''); setFasciaSel('')
    setFiltriPdf(new Set()); setFiltriModello(new Set())
  }

  // Aprendo un PDF: salva i filtri correnti ed eredita i valori di classificazione della voce
  // (fase/materiale/tipologia/ambiente/fascia + filtri modello) come ulteriori filtri sulla stessa
  // base articoli della pagina, bloccando i controlli finché resta aperto. La sottocategoria NON
  // viene ereditata: è il percorso di pagina (uguale per tutte le voci), non un valore di
  // classificazione dell'articolo. Chiudendo (voce=null): ripristina i filtri precedenti.
  function selectVoce(voce: Voce | null) {
    if (voce) {
      setSavedFilters({ formSottocat, faseSel, materialeSel, tipologiaSel, ambienteSel, fasciaSel, filtriModello: new Set(filtriModello) })
      setFaseSel(voce.fase ?? '')
      setMaterialeSel(voce.materiale ?? '')
      setTipologiaSel(voce.tipologia ?? '')
      setAmbienteSel(voce.ambiente ?? '')
      setFasciaSel(voce.fascia ?? '')
      const m = new Set<number>()
      for (const f of MODELLO_FILTRI) { if (flagModello(voce, f.n) === 1) m.add(f.n) }
      setFiltriModello(m)
    } else if (savedFilters) {
      setFormSottocat(savedFilters.formSottocat)
      setFaseSel(savedFilters.faseSel)
      setMaterialeSel(savedFilters.materialeSel)
      setTipologiaSel(savedFilters.tipologiaSel)
      setAmbienteSel(savedFilters.ambienteSel)
      setFasciaSel(savedFilters.fasciaSel)
      setFiltriModello(savedFilters.filtriModello)
      setSavedFilters(null)
    }
    setSelectedVoce(voce)
  }

  return (
    <>
      {showFiltriBar && (
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 6, alignItems: 'center', background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '8px 16px', marginBottom: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const }}>
          <button onClick={resetFiltri} disabled={!hasFilters || !!selectedVoce} className={hasFilters && !selectedVoce ? 'btn-red' : 'btn-gray'} style={{ fontSize: 11, padding: '2px 8px', height: 26 }}>✕</button>
          {faseOpt.length > 0 && (
            <select value={faseSel} disabled={!!selectedVoce} onChange={e => { setFaseSel(e.target.value); setMaterialeSel(''); setTipologiaSel(''); setAmbienteSel(''); setFasciaSel('') }} style={selStyle}>
              <option value="">Fase</option>
              {faseOpt.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {materialeOpt.length > 0 && (
            <select value={materialeSel} disabled={!!selectedVoce} onChange={e => { setMaterialeSel(e.target.value); setTipologiaSel(''); setAmbienteSel(''); setFasciaSel('') }} style={selStyle}>
              <option value="">Materiale</option>
              {materialeOpt.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {tipologiaOpt.length > 0 && (
            <select value={tipologiaSel} disabled={!!selectedVoce} onChange={e => { setTipologiaSel(e.target.value); setAmbienteSel(''); setFasciaSel('') }} style={selStyle}>
              <option value="">Tipologia</option>
              {tipologiaOpt.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {ambienteOpt.length > 0 && (
            <select value={ambienteSel} disabled={!!selectedVoce} onChange={e => { setAmbienteSel(e.target.value); setFasciaSel('') }} style={selStyle}>
              <option value="">Ambiente</option>
              {ambienteOpt.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {fasciaOpt.length > 0 && (
            <select value={fasciaSel} disabled={!!selectedVoce} onChange={e => setFasciaSel(e.target.value)} style={selStyle}>
              <option value="">Fascia</option>
              {fasciaOpt.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {modelloDisponibili.map(f => (
            <Linguetta key={f.label} label={f.label} attiva={filtriModello.has(f.n)} disabled={!!selectedVoce}
              onToggle={() => setFiltriModello(prev => { const s = new Set(prev); s.has(f.n) ? s.delete(f.n) : s.add(f.n); return s })}
            />
          ))}
          {linguettePdfDisponibili.map(f => (
            <Linguetta key={f.label} label={f.label} attiva={filtriPdf.has(f.label)}
              onToggle={() => setFiltriPdf(prev => { const s = new Set(prev); s.has(f.label) ? s.delete(f.label) : s.add(f.label); return s })}
            />
          ))}
        </div>
      )}

      {voci.length > 0 && (vociFiltrate.length === 0 ? (
        <p className="fs-13" style={{ color: '#aaa', padding: '12px 0' }}>
          Nessun catalogo corrisponde ai filtri selezionati.
        </p>
      ) : (
        <CatalogoClient voci={vociFiltrate} onSelect={selectVoce} isApp={isApp} />
      ))}

      {artFiltrati.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <AggiungiArticolo
            articoli={artFiltrati}
            lockedCat={fixedCat}
            lockedSottocat={fixedSottocat}
            onSottocatChange={fixedSottocat ? undefined : v => setFormSottocat(v)}
            isStaff={isStaff}
            isLoggedIn={isLoggedIn}
            preventiviBozza={preventiviBozza}
            cartNonVuoto={cartNonVuoto}
            parentPendente={parentPendente}
            carrelloHref={carrelloHref}
            preventivoClienteBaseHref={preventivoClienteBaseHref}
            submitLabel={submitLabel}
            isApp={isApp}
          />
        </div>
      )}
    </>
  )
}
