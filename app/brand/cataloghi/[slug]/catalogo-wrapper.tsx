'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import AggiungiArticolo, { type ArticoloListino } from './aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type Voce = {
  id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string
  descrizione?: string | null
  filtro_c1?: number; filtro_c2?: number; filtro_c3?: number
  filtro_c4?: number; filtro_c5?: number; filtro_c6?: number
  sottocategoria?: string | null; fase?: string | null; materiale?: string | null
  tipologia?: string | null; ambiente?: string | null; fascia?: string | null
  filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number
  filtro_5?: number; filtro_6?: number; filtro_7?: number; filtro_8?: number
  filtro_9?: number; filtro_10?: number
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
  filtriLabels?: Record<number, string>
  filtriCatalogoLabels?: Record<number, string>
}

// ─── Linguette PDF (C1..C6, etichette condivise dal pannello Cataloghi) ───────

const PDF_FILTRI: { n: number; key: keyof Voce }[] = [
  { n: 1, key: 'filtro_c1' },
  { n: 2, key: 'filtro_c2' },
  { n: 3, key: 'filtro_c3' },
  { n: 4, key: 'filtro_c4' },
  { n: 5, key: 'filtro_c5' },
  { n: 6, key: 'filtro_c6' },
]

// ─── Filtri modello (F1..F10, etichette condivise dal pannello Cataloghi) ─────

const MODELLO_N = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

function flagModello(obj: { filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number; filtro_5?: number; filtro_6?: number; filtro_7?: number; filtro_8?: number; filtro_9?: number; filtro_10?: number }, n: number): number {
  const key = `filtro_${n}` as keyof typeof obj
  return obj[key] ?? 0
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
  submitLabel, isApp, fixedCat, fixedSottocat, filtriLabels, filtriCatalogoLabels,
}: Props) {
  const modelloLabel = (n: number) => filtriLabels?.[n] ?? `F${n}`
  const catalogoLabel = (n: number) => filtriCatalogoLabels?.[n] ?? `C${n}`
  const [selectedVoce, setSelectedVoce] = useState<Voce | null>(null)

  const [faseSel, setFaseSel] = useState('')
  const [materialeSel, setMaterialeSel] = useState('')
  const [tipologiaSel, setTipologiaSel] = useState('')
  const [ambienteSel, setAmbienteSel] = useState('')
  const [fasciaSel, setFasciaSel] = useState('')
  const [filtriPdf, setFiltriPdf] = useState<Set<number>>(new Set())
  const [filtriModello, setFiltriModello] = useState<Set<number>>(new Set())
  const [savedFilters, setSavedFilters] = useState<{
    faseSel: string; materialeSel: string; tipologiaSel: string
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
  // (La sottocategoria non è più un filtro qui: è un livello di navigazione a sé —
  // /cataloghi/[categoria]/[sottocategoria] — quindi voci/articoli arrivano già filtrati.)
  const post1 = voci
  const art1  = articoliPool

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
  const modelloDisponibili = MODELLO_N.filter(n => voci.some(v => flagModello(v, n) === 1))
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
    [...filtriPdf].some(n => {
      const f = PDF_FILTRI.find(f => f.n === n)
      return f && (v[f.key] as number ?? 0) === 1
    })
  )

  // Eccezione: se l'etichetta di un C acceso combacia (case-insensitive) con il produttore
  // di almeno un articolo tra quelli candidati, quel C funge anche da filtro produttore
  // per gli articoli — OR tra i C accesi che fanno match. I C senza match restano solo-PDF.
  const marcheCAttive = [...filtriPdf]
    .map(n => catalogoLabel(n))
    .filter(label => artModello.some(a => a.produttore?.toLowerCase() === label.toLowerCase()))

  const artFiltrati = marcheCAttive.length === 0
    ? artModello
    : artModello.filter(a => marcheCAttive.some(m => a.produttore?.toLowerCase() === m.toLowerCase()))

  const hasFilters = !!(faseSel || materialeSel || tipologiaSel || ambienteSel || fasciaSel || filtriPdf.size || filtriModello.size)

  // Linguette PDF disponibili = solo quelle per cui almeno un PDF ha il flag
  const linguettePdfDisponibili = PDF_FILTRI.filter(f => voci.some(v => (v[f.key] as number ?? 0) === 1))
  // Tra queste: quali hanno l'etichetta che combacia con un produttore (→ zona "filtri per marca")
  const cMarche = linguettePdfDisponibili.filter(f => artModello.some(a => a.produttore?.toLowerCase() === catalogoLabel(f.n).toLowerCase()))
  const cClassiche = linguettePdfDisponibili.filter(f => !cMarche.includes(f))

  const showFiltriBar =
    linguettePdfDisponibili.length > 0 ||
    modelloDisponibili.length > 0 ||
    voci.some(v => v.sottocategoria || v.fase || v.materiale || v.tipologia || v.ambiente || v.fascia) ||
    articoliPool.some(a => a.sottocategoria || a.fase || a.materiale || a.tipologia || a.ambiente || a.fascia)

  function resetFiltri() {
    setFaseSel(''); setMaterialeSel('')
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
      setSavedFilters({ faseSel, materialeSel, tipologiaSel, ambienteSel, fasciaSel, filtriModello: new Set(filtriModello) })
      setFaseSel(voce.fase ?? '')
      setMaterialeSel(voce.materiale ?? '')
      setTipologiaSel(voce.tipologia ?? '')
      setAmbienteSel(voce.ambiente ?? '')
      setFasciaSel(voce.fascia ?? '')
      const m = new Set<number>()
      for (const n of MODELLO_N) { if (flagModello(voce, n) === 1) m.add(n) }
      setFiltriModello(m)
    } else if (savedFilters) {
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
        <div style={{ border: '1px solid #c8960c', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
        <div className="filtri-scroll-row" style={{ display: 'flex', flexWrap: 'nowrap', gap: 0, alignItems: 'stretch', background: '#fff', overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const }}>
          <button onClick={resetFiltri} disabled={!hasFilters || !!selectedVoce} className={hasFilters && !selectedVoce ? 'btn-red' : 'btn-gray'} style={{ fontSize: 11, padding: '2px 8px', height: 26, alignSelf: 'flex-end', flexShrink: 0, marginLeft: 12, marginBottom: 6 }}>✕</button>

          {/* Zona 1: filtri con corrispondenza obbligatoria (select classificazione + F) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', background: '#fff', padding: '6px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>Tutte corrispondenze esatte (catalogo+articolo)</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
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
              {modelloDisponibili.map(n => (
                <Linguetta key={n} label={modelloLabel(n)} attiva={filtriModello.has(n)} disabled={!!selectedVoce}
                  onToggle={() => setFiltriModello(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })}
                />
              ))}
            </div>
          </div>

          {/* Zona 2: filtri catalogo classici (una corrispondenza esatta basta, solo PDF) */}
          {cClassiche.length > 0 && (
            <>
              <div style={{ width: 1, background: '#e0d5b8', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', background: '#fff9d6', padding: '6px 12px', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#8a7a2a', whiteSpace: 'nowrap' }}>Almeno una corrispondenza (catalogo)</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {cClassiche.map(f => (
                    <Linguetta key={f.n} label={catalogoLabel(f.n)} attiva={filtriPdf.has(f.n)}
                      onToggle={() => setFiltriPdf(prev => { const s = new Set(prev); s.has(f.n) ? s.delete(f.n) : s.add(f.n); return s })}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Zona 3: filtri catalogo che combaciano con un produttore (filtrano anche gli articoli) */}
          {cMarche.length > 0 && (
            <>
              <div style={{ width: 1, background: '#e0d5b8', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', background: '#e8f7e8', padding: '6px 12px', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#4a8a4a', whiteSpace: 'nowrap' }}>Marche prestabilite (catalogo+articolo)</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {cMarche.map(f => (
                    <Linguetta key={f.n} label={catalogoLabel(f.n)} attiva={filtriPdf.has(f.n)}
                      onToggle={() => setFiltriPdf(prev => { const s = new Set(prev); s.has(f.n) ? s.delete(f.n) : s.add(f.n); return s })}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
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
            isStaff={isStaff}
            isLoggedIn={isLoggedIn}
            preventiviBozza={preventiviBozza}
            cartNonVuoto={cartNonVuoto}
            parentPendente={parentPendente}
            carrelloHref={carrelloHref}
            preventivoClienteBaseHref={preventivoClienteBaseHref}
            submitLabel={submitLabel}
            isApp={isApp}
            filtriLabels={filtriLabels}
            lockedFiltriModello={filtriModello}
          />
        </div>
      )}
    </>
  )
}
