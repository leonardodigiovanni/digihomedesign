'use client'

import { useState, useTransition } from 'react'
import { aggiungiAlCarrelloAcquisti, type CartResult } from '@/app/brand/cataloghi/actions'
import { type ArticoloEcommerce, getUnitaMode } from '@/lib/ecommerce'

const inpStyle: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc',
  borderRadius: 4, fontSize: 13, fontFamily: 'inherit',
  width: '100%', boxSizing: 'border-box', color: '#222', WebkitTextFillColor: '#222',
}
const lbl: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 3,
}

export default function EcommerceAddToCartForm({ articolo }: { articolo: ArticoloEcommerce }) {
  const [result, setResult] = useState<CartResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const mode = getUnitaMode(articolo.unita)
  const esaurito = articolo.max_acquistabile === 0

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await aggiungiAlCarrelloAcquisti(null, formData)
      setResult(res)
    })
  }

  if (esaurito) {
    return <p className="testo-articoli" style={{ margin: 0, color: '#c0392b', fontWeight: 600 }}>Esaurito</p>
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460 }}>
      <input type="hidden" name="listino_id" value={articolo.id} />

      {articolo.max_acquistabile != null && articolo.max_acquistabile > 0 && (
        <p className="testo-articoli" style={{ margin: 0, color: '#e65100', fontWeight: 600 }}>
          Disponibilità massima: {articolo.max_acquistabile} {articolo.unita}
        </p>
      )}

      {!!articolo.richiede_tipo_colore && (
        <label className="testo-articoli" style={lbl}>
          Colore
          <input name="colore" type="text" placeholder="es. Bianco RAL 9010" style={inpStyle} />
        </label>
      )}

      {mode === 'mq' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <label className="testo-articoli" style={lbl}>
            Larghezza (cm) *
            <input name="larghezza" type="number" min={0} step="0.1" placeholder="es. 120" required style={inpStyle} />
          </label>
          <label className="testo-articoli" style={lbl}>
            Altezza (cm) *
            <input name="altezza" type="number" min={0} step="0.1" placeholder="es. 210" required style={inpStyle} />
          </label>
          <label className="testo-articoli" style={{ ...lbl, gridColumn: '1 / -1' }}>
            Quantità *
            <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
          </label>
        </div>
      )}

      {mode === 'ml' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <label className="testo-articoli" style={lbl}>
            Lunghezza (cm) *
            <input name="larghezza" type="number" min={0} step="0.1" placeholder="es. 300" required style={inpStyle} />
          </label>
          <label className="testo-articoli" style={lbl}>
            Quantità *
            <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
          </label>
        </div>
      )}

      {mode === 'kg' && (
        <label className="testo-articoli" style={lbl}>
          Quantità (kg) *
          <input name="quantita" type="number" min={0.1} step="0.1" defaultValue={1} required style={inpStyle} />
        </label>
      )}

      {mode === 't' && (
        <label className="testo-articoli" style={lbl}>
          Quantità (t) *
          <input name="quantita" type="number" min={0.001} step="0.001" defaultValue={1} required style={inpStyle} />
        </label>
      )}

      {mode === 'pz' && (
        <label className="testo-articoli" style={lbl}>
          Quantità *
          <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
        </label>
      )}

      <button type="submit" disabled={isPending} className={isPending ? 'btn-gray' : 'btn-green'} style={{ height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600 }}>
        {isPending ? 'Aggiunta…' : 'Aggiungi al carrello'}
      </button>

      {result?.ok && (
        <p className="testo-articoli" style={{ margin: 0 }}>
          ✓ Articolo aggiunto.{' '}
          <a href="/area-clienti/carrello-acquisti" style={{ color: '#2e7d32', fontWeight: 600 }}>Vai al carrello →</a>
        </p>
      )}
      {result && !result.ok && (
        <p className="testo-articoli" style={{ margin: 0, WebkitTextFillColor: '#c0392b', color: '#c0392b' }}>{result.error}</p>
      )}
    </form>
  )
}
