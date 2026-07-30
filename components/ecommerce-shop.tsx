'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { type ArticoloEcommerce, getUnitaMode } from '@/lib/ecommerce'
import EcommerceAddToCartForm from './ecommerce-add-to-cart-form'

export type { ArticoloEcommerce } from '@/lib/ecommerce'
export { formatPrezzo } from '@/lib/ecommerce'

const CARD_WIDTH = 220
const GRID_GAP = 12
// Numero minimo di articoli per pagina (per ora, per test): la pagina reale è il
// primo multiplo delle colonne per riga che entrano nella larghezza disponibile,
// >= a questa base — così ogni pagina è fatta di righe complete, mai una riga a metà
// (tranne l'ultima pagina, che ha semplicemente quelli che restano).
const PER_PAGINA_BASE = 10

// Quante card da CARD_WIDTH (+ gap) entrano nella larghezza disponibile del contenitore.
function useColonneGriglia(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [colonne, setColonne] = useState(1)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function update() {
      if (!el) return
      const n = Math.max(1, Math.floor((el.clientWidth + GRID_GAP) / (CARD_WIDTH + GRID_GAP)))
      setColonne(n)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])
  return colonne
}

// ─── Ordinamento ────────────────────────────────────────────────────────────
// Solo criteri calcolabili sui dati reali (prezzo, nome, marca, sconto): niente
// "qualità" inventata, nel DB non esiste un dato di qualità da ordinare.

type SortKey = 'rilevanza' | 'prezzo-asc' | 'prezzo-desc' | 'nome-asc' | 'nome-desc' | 'sconto-desc' | 'marca-asc' | 'marca-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'rilevanza',   label: 'Rilevanza' },
  { value: 'prezzo-asc',  label: 'Prezzo: dal più basso' },
  { value: 'prezzo-desc', label: 'Prezzo: dal più alto' },
  { value: 'sconto-desc', label: 'Sconto maggiore' },
  { value: 'nome-asc',    label: 'Nome: A → Z' },
  { value: 'nome-desc',   label: 'Nome: Z → A' },
  { value: 'marca-asc',   label: 'Marca: A → Z' },
  { value: 'marca-desc',  label: 'Marca: Z → A' },
]

function prezzoEffettivo(a: ArticoloEcommerce): number {
  const normale = Number(a.prezzo_vendita) || 0
  const promo = a.prezzo_promo != null ? Number(a.prezzo_promo) : null
  return promo != null && promo > 0 && promo < normale ? promo : normale
}

function scontoPct(a: ArticoloEcommerce): number {
  const normale = Number(a.prezzo_vendita) || 0
  const promo = a.prezzo_promo != null ? Number(a.prezzo_promo) : null
  if (!normale || promo == null || promo >= normale) return 0
  return (normale - promo) / normale
}

function ordina(articoli: ArticoloEcommerce[], sort: SortKey): ArticoloEcommerce[] {
  const arr = [...articoli]
  switch (sort) {
    case 'prezzo-asc':  return arr.sort((a, b) => prezzoEffettivo(a) - prezzoEffettivo(b))
    case 'prezzo-desc': return arr.sort((a, b) => prezzoEffettivo(b) - prezzoEffettivo(a))
    case 'sconto-desc': return arr.sort((a, b) => scontoPct(b) - scontoPct(a))
    case 'nome-asc':    return arr.sort((a, b) => a.descrizione.localeCompare(b.descrizione))
    case 'nome-desc':   return arr.sort((a, b) => b.descrizione.localeCompare(a.descrizione))
    case 'marca-asc':   return arr.sort((a, b) => (a.produttore || '').localeCompare(b.produttore || ''))
    case 'marca-desc':  return arr.sort((a, b) => (b.produttore || '').localeCompare(a.produttore || ''))
    default:            return arr
  }
}

// ─── Paginazione ──────────────────────────────────────────────────────────────

function Pager({ pagina, totali, onVai }: { pagina: number; totali: number; onVai: (p: number) => void }) {
  if (totali <= 1) return null

  const pageBtn = (p: number, attivo: boolean): React.CSSProperties => ({
    minWidth: 32, height: 32, padding: '0 8px', borderRadius: 16, border: 'none',
    background: attivo ? '#c8960c' : '#2a2a3e', color: attivo ? '#1a1a1a' : '#ddd',
    fontWeight: 700, fontSize: 12, cursor: attivo ? 'default' : 'pointer',
  })

  // Finestra di pagine intorno alla corrente, con la prima/ultima sempre visibili
  const pagine: (number | '…')[] = []
  const start = Math.max(2, pagina - 2)
  const end = Math.min(totali - 1, pagina + 2)
  pagine.push(1)
  if (start > 2) pagine.push('…')
  for (let p = start; p <= end; p++) pagine.push(p)
  if (end < totali - 1) pagine.push('…')
  if (totali > 1) pagine.push(totali)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, width: '100%' }}>
      <button type="button" disabled={pagina === 1} onClick={() => onVai(pagina - 1)}
        style={{ ...pageBtn(0, false), opacity: pagina === 1 ? 0.4 : 1, cursor: pagina === 1 ? 'default' : 'pointer' }}>
        ‹
      </button>
      {pagine.map((p, i) => p === '…'
        ? <span key={`e${i}`} style={{ color: '#888', fontSize: 12, padding: '0 2px' }}>…</span>
        : <button key={p} type="button" disabled={p === pagina} onClick={() => onVai(p)} style={pageBtn(p, p === pagina)}>{p}</button>
      )}
      <button type="button" disabled={pagina === totali} onClick={() => onVai(pagina + 1)}
        style={{ ...pageBtn(0, false), opacity: pagina === totali ? 0.4 : 1, cursor: pagina === totali ? 'default' : 'pointer' }}>
        ›
      </button>
    </div>
  )
}

function PrezzoCifre({ valore, suffisso, colore = '#0f1111' }: { valore: number; suffisso: string; colore?: string }) {
  const intero = Math.floor(valore)
  const decimali = Math.round((valore - intero) * 100).toString().padStart(2, '0')
  return (
    <span style={{ color: colore }}>
      <span style={{ fontSize: 13, fontWeight: 700, verticalAlign: 'top', position: 'relative', top: 2 }}>€</span>
      <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{intero}</span>
      <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>,</span>
      <span style={{ fontSize: 13, fontWeight: 700, verticalAlign: 'top', position: 'relative', top: 2 }}>{decimali}</span>
      {suffisso && <span style={{ fontSize: 12, fontWeight: 400, color: '#888' }}>{suffisso}</span>}
    </span>
  )
}

export function PrezzoAmazon({ articolo }: { articolo: ArticoloEcommerce }) {
  if (!articolo.prezzo_vendita) return null
  const normale = Number(articolo.prezzo_vendita)
  const promo = articolo.prezzo_promo != null ? Number(articolo.prezzo_promo) : null
  const suffisso = getUnitaMode(articolo.unita) === 'pz' ? '' : ` al ${articolo.unita}`

  // Prezzo promo: valorizzato solo quando impostato e diverso dal prezzo normale
  // (se null o uguale, si comporta come prima: un solo prezzo, nessun confronto).
  if (promo == null || promo === normale) {
    return <PrezzoCifre valore={normale} suffisso={suffisso} />
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <PrezzoCifre valore={promo} suffisso={suffisso} colore="#c0392b" />
      <span style={{ fontSize: 14, color: '#888', textDecoration: 'line-through' }}>
        € {normale.toFixed(2)}
      </span>
    </span>
  )
}

function ProductCard({ a, hrefBase, onAggiungi }: { a: ArticoloEcommerce; hrefBase: string; onAggiungi: (a: ArticoloEcommerce) => void }) {
  const esaurito = a.max_acquistabile === 0

  return (
    <div style={{
      width: CARD_WIDTH, display: 'flex', flexDirection: 'column',
      background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8,
      overflow: 'hidden', opacity: esaurito ? 0.6 : 1,
    }}>
      <Link href={`${hrefBase}/${a.id}`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7' }}>
        {a.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.foto_url.startsWith('http') ? a.foto_url : a.foto_url.startsWith('/') ? a.foto_url : `/${a.foto_url}`}
            alt={a.descrizione}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12 }}>
            Nessuna foto
          </div>
        )}
      </Link>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <span style={{
          fontSize: 14, lineHeight: 1.3, color: '#0f1111',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {a.descrizione}
        </span>
        {a.produttore && <span style={{ fontSize: 12, color: '#888' }}>{a.produttore}</span>}
        <PrezzoAmazon articolo={a} />
        {esaurito ? (
          <span style={{ fontSize: 12, color: '#c0392b', fontWeight: 600 }}>Esaurito</span>
        ) : (
          <button
            type="button"
            onClick={() => onAggiungi(a)}
            className="btn-green"
            style={{ marginTop: 'auto', height: 36, borderRadius: 18, fontSize: 12, fontWeight: 600 }}
          >
            Aggiungi al carrello
          </button>
        )}
      </div>
    </div>
  )
}

export default function EcommerceShop({ articoli, hrefBase, emptyLabel }: { articoli: ArticoloEcommerce[]; hrefBase: string; emptyLabel?: string }) {
  const [quickAdd, setQuickAdd] = useState<ArticoloEcommerce | null>(null)
  const [sort, setSort] = useState<SortKey>('rilevanza')
  const [pagina, setPagina] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const colonne = useColonneGriglia(gridRef)
  const perPagina = Math.ceil(PER_PAGINA_BASE / colonne) * colonne

  const ordinati = useMemo(() => ordina(articoli, sort), [articoli, sort])
  const totali = Math.max(1, Math.ceil(ordinati.length / perPagina))
  const paginaClamp = Math.min(pagina, totali)
  const visibili = ordinati.slice((paginaClamp - 1) * perPagina, paginaClamp * perPagina)

  function cambiaOrdinamento(v: SortKey) {
    setSort(v)
    setPagina(1)
  }

  function vaiAPagina(p: number) {
    setPagina(p)
    // "body" è l'elemento che scrolla davvero in questo layout, non "window"
    // (html{overflow-y:scroll} + body{height:100%}) — resettiamo tutti e tre per sicurezza.
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.scrollTo(0, 0)
  }

  if (articoli.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 4px', textAlign: 'center' }}>
        <p className="testo-articoli" style={{ margin: 0 }}>{emptyLabel ?? 'Nessun prodotto acquistabile al momento.'}</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <p className="fs-12" style={{ margin: 0, color: '#888' }}>
          {ordinati.length} risultat{ordinati.length === 1 ? 'o' : 'i'}
        </p>
        <label className="fs-12" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555' }}>
          Ordina per
          <select
            value={sort}
            onChange={e => cambiaOrdinamento(e.target.value as SortKey)}
            style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, fontSize: 12, fontFamily: 'inherit' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CARD_WIDTH}px)`, gap: GRID_GAP }}>
          {visibili.map(a => <ProductCard key={a.id} a={a} hrefBase={hrefBase} onAggiungi={setQuickAdd} />)}
        </div>
      </div>

      <Pager pagina={paginaClamp} totali={totali} onVai={vaiAPagina} />

      {quickAdd && (
        <div
          onClick={() => setQuickAdd(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 10, border: '1px solid #c8960c', padding: 20, maxWidth: 420, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => setQuickAdd(null)}
              className="btn-red"
              style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, padding: 0, fontSize: 14 }}
            >
              ✕
            </button>
            <p className="testo-articoli" style={{ margin: '0 32px 12px 0', fontWeight: 700 }}>{quickAdd.descrizione}</p>
            <EcommerceAddToCartForm articolo={quickAdd} />
          </div>
        </div>
      )}
    </>
  )
}
