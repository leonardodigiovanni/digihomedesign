'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type ArticoloEcommerce, getUnitaMode } from '@/lib/ecommerce'
import EcommerceAddToCartForm from './ecommerce-add-to-cart-form'

export type { ArticoloEcommerce } from '@/lib/ecommerce'
export { formatPrezzo } from '@/lib/ecommerce'

const CARD_WIDTH = 220

export function PrezzoAmazon({ articolo }: { articolo: ArticoloEcommerce }) {
  if (!articolo.prezzo_vendita) return null
  const valore = Number(articolo.prezzo_vendita)
  const intero = Math.floor(valore)
  const decimali = Math.round((valore - intero) * 100).toString().padStart(2, '0')
  const suffisso = getUnitaMode(articolo.unita) === 'pz' ? '' : ` al ${articolo.unita}`
  return (
    <span style={{ color: '#0f1111' }}>
      <span style={{ fontSize: 13, fontWeight: 700, verticalAlign: 'top', position: 'relative', top: 2 }}>€</span>
      <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{intero}</span>
      <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>,</span>
      <span style={{ fontSize: 13, fontWeight: 700, verticalAlign: 'top', position: 'relative', top: 2 }}>{decimali}</span>
      {suffisso && <span style={{ fontSize: 12, fontWeight: 400, color: '#888' }}>{suffisso}</span>}
    </span>
  )
}

function ProductCard({ a, macro, onAggiungi }: { a: ArticoloEcommerce; macro: string; onAggiungi: (a: ArticoloEcommerce) => void }) {
  const esaurito = a.max_acquistabile === 0

  return (
    <div style={{
      width: CARD_WIDTH, display: 'flex', flexDirection: 'column',
      background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8,
      overflow: 'hidden', opacity: esaurito ? 0.6 : 1,
    }}>
      <Link href={`/shop/${macro}/${a.id}`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7' }}>
        {a.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.foto_url.startsWith('/') ? a.foto_url : `/${a.foto_url}`}
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

export default function EcommerceShop({ articoli, macro }: { articoli: ArticoloEcommerce[]; macro: string }) {
  const [quickAdd, setQuickAdd] = useState<ArticoloEcommerce | null>(null)

  if (articoli.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 4px', textAlign: 'center' }}>
        <p className="testo-articoli" style={{ margin: 0 }}>Nessun prodotto acquistabile al momento.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CARD_WIDTH}px)`, gap: 12 }}>
          {articoli.map(a => <ProductCard key={a.id} a={a} macro={macro} onAggiungi={setQuickAdd} />)}
        </div>
      </div>

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
