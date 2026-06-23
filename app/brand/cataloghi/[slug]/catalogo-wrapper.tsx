'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import AggiungiArticolo, { type ArticoloListino } from './aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Voce = { id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null; descrizione?: string | null; filtro_battente?: number; filtro_scorrevole?: number; filtro_taglio_termico?: number; filtro_taglio_freddo?: number; filtro_economico?: number; filtro_fascia_alta?: number }

const FILTRI_CATALOGO: { key: keyof Voce; label: string }[] = [
  { key: 'filtro_battente',       label: 'A battente' },
  { key: 'filtro_scorrevole',     label: 'Scorrevole' },
  { key: 'filtro_taglio_termico', label: 'Taglio termico' },
  { key: 'filtro_taglio_freddo',  label: 'Taglio freddo' },
  { key: 'filtro_economico',      label: 'Economico' },
  { key: 'filtro_fascia_alta',    label: 'Fascia alta' },
]

const FILTRI_ARTICOLO = ['1 Anta', '2 Ante', '3+ Ante', 'Sopraluce']

const FILTRI_ARTICOLO_KEY: Record<string, keyof ArticoloListino> = {
  '1 Anta':    'filtro_1',
  '2 Ante':    'filtro_2',
  '3+ Ante':   'filtro_3',
  'Sopraluce': 'filtro_4',
}

const H = 28, THUMB = 22

function Linguetta({ label, attiva, onToggle }: { label: string; attiva: boolean; onToggle: () => void }) {
  const W = Math.max(THUMB + 8 + label.length * 7, 90)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggle() }}
      style={{
        position: 'relative', width: W, height: H, borderRadius: H / 2, flexShrink: 0,
        background: attiva ? '#1e5c1e' : '#3a3a3a',
        transition: 'background 0.2s',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      <span style={{
        position: 'absolute', left: 8, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        fontSize: 10, fontFamily: 'inherit', fontWeight: 700,
        color: attiva ? '#7dda7d' : 'transparent',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>{label}</span>
      <span style={{
        position: 'absolute', right: 8, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        fontSize: 10, fontFamily: 'inherit', fontWeight: 400,
        color: attiva ? 'transparent' : '#aaaaaa',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>{label}</span>
      <div style={{
        position: 'absolute',
        width: THUMB, height: THUMB, borderRadius: '50%', background: '#fff',
        top: (H - THUMB) / 2,
        left: attiva ? W - THUMB - 3 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
      }} />
    </div>
  )
}

function RigaFiltri({
  label,
  bambini,
  nAttivi,
  onClearAll,
}: {
  label: string
  bambini: React.ReactNode
  nAttivi: number
  onClearAll: () => void
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: '#fff', border: '1px solid #c8960c', borderRadius: 10,
      padding: '6px 24px', overflow: 'hidden',
    }}>
      {/* X */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <button
          onClick={onClearAll}
          disabled={nAttivi === 0}
          className={`${nAttivi > 0 ? 'btn-red' : 'btn-gray'} btn-icon fs-11`}
          style={{ flexShrink: 0 }}
        >✕</button>
      </div>
      {/* Separatore */}
      <div style={{ width: 1, height: 20, background: '#ddd', flexShrink: 0, margin: '0 10px' }} />
      {/* Chips scrollabili */}
      <div style={{
        display: 'flex', gap: 6,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const,
        paddingBottom: 2,
      }}>
        {bambini}
      </div>
    </div>
  )
}

const CatalogoClient = dynamic(() => import('./catalogo-client'), {
  ssr: false,
  loading: () => <p className="fs-14" style={{ color: '#aaa' }}>Caricamento…</p>,
})

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
}

export default function CatalogoWrapper({ voci, articoliPerListino, isStaff, isLoggedIn, preventiviBozza, cartNonVuoto, parentPendente, categorySlug, basePath, carrelloHref, preventivoClienteBaseHref, submitLabel, isApp, mostraFiltri = false }: Props) {
  const [selectedVoce, setSelectedVoce] = useState<Voce | null>(null)
  const [filtriAttivi, setFiltriAttivi] = useState<Set<keyof Voce>>(new Set())
  const [filtriArticoloAttivi, setFiltriArticoloAttivi] = useState<Set<string>>(new Set())

  const vociFiltrate = filtriAttivi.size === 0
    ? voci
    : voci.filter(v => [...filtriAttivi].every(k => (v[k] as number) === 1))

  function toggleFiltroCatalogo(key: keyof Voce) {
    setFiltriAttivi(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setSelectedVoce(null)
  }

  function toggleFiltroArticolo(label: string) {
    setFiltriArticoloAttivi(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  let articoliVisibili: ArticoloListino[]
  if (selectedVoce !== null) {
    articoliVisibili = selectedVoce.listino_categoria
      ? articoliPerListino[selectedVoce.listino_categoria] ?? []
      : []
  } else {
    const seen = new Set<number>()
    articoliVisibili = []
    for (const v of vociFiltrate) {
      if (!v.listino_categoria) continue
      for (const a of articoliPerListino[v.listino_categoria] ?? []) {
        if (!seen.has(a.id)) { seen.add(a.id); articoliVisibili.push(a) }
      }
    }
  }

  if (filtriArticoloAttivi.size > 0) {
    articoliVisibili = articoliVisibili.filter(a =>
      [...filtriArticoloAttivi].every(label => {
        const key = FILTRI_ARTICOLO_KEY[label]
        return key && Number(a[key]) === 1
      })
    )
  }

  return (
    <>
      {mostraFiltri && (
        <RigaFiltri
          label="Filtri catalogo"
          nAttivi={filtriAttivi.size}
          onClearAll={() => { setFiltriAttivi(new Set()); setSelectedVoce(null) }}
          bambini={FILTRI_CATALOGO.map(f => (
            <Linguetta
              key={String(f.key)}
              label={f.label}
              attiva={filtriAttivi.has(f.key)}
              onToggle={() => toggleFiltroCatalogo(f.key)}
            />
          ))}
        />
      )}

      {vociFiltrate.length === 0 ? (
        <p className="fs-13" style={{ color: '#aaa', padding: '12px 0' }}>
          Nessun catalogo corrisponde ai filtri selezionati.
        </p>
      ) : (
        <CatalogoClient voci={vociFiltrate} onSelect={setSelectedVoce} categorySlug={categorySlug} basePath={basePath} isApp={isApp} />
      )}

      {mostraFiltri && (
        <RigaFiltri
          label="Filtri articolo"
          nAttivi={filtriArticoloAttivi.size}
          onClearAll={() => setFiltriArticoloAttivi(new Set())}
          bambini={FILTRI_ARTICOLO.map(label => (
            <Linguetta
              key={label}
              label={label}
              attiva={filtriArticoloAttivi.has(label)}
              onToggle={() => toggleFiltroArticolo(label)}
            />
          ))}
        />
      )}

      {articoliVisibili.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <AggiungiArticolo
            articoli={articoliVisibili}
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
