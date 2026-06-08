'use client'

import { useState, useTransition } from 'react'
import { aggiungiAlCarrelloAcquisti, type CartResult } from '@/app/brand/cataloghi/actions'

export type ArticoloListinoAcquisto = {
  id: number
  descrizione: string
  produttore: string
  serie?: string | null
  unita: string
  prezzo_vendita: number
  max_acquistabile: number | null
}

type UnitaMode = 'pz' | 'kg' | 't' | 'ml' | 'mq'

function getUnitaMode(unita: string): UnitaMode {
  const u = unita.toLowerCase()
  if (u === 'kg') return 'kg'
  if (u === 't') return 't'
  if (u === 'ml' || u === 'm' || u === 'mt') return 'ml'
  if (u === 'm²' || u === 'mq' || u === 'm2') return 'mq'
  return 'pz'
}

const inpStyle: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc',
  borderRadius: 4, fontSize: 13, fontFamily: 'inherit',
  width: '100%', boxSizing: 'border-box', color: '#222', WebkitTextFillColor: '#222',
}
const lbl: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 3,
}

export default function AggiungiArticoloAcquistoForm({ articoli }: { articoli: ArticoloListinoAcquisto[] }) {
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [selectedId, setSelectedId] = useState<number>(articoli[0]?.id ?? 0)
  const [result, setResult] = useState<CartResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await aggiungiAlCarrelloAcquisti(null, formData)
      setResult(res)
      if (res.ok) setStep('select')
    })
  }

  if (articoli.length === 0) return null

  const selected = articoli.find(a => a.id === selectedId) ?? articoli[0]
  const mode = getUnitaMode(selected.unita)
  const esaurito = selected.max_acquistabile === 0

  return (
    <div style={{
      background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10,
      padding: '20px 4px',
    }}>
      <p className="testo-articoli" style={{ margin: '0 0 8px' }}>
        Acquista articoli
      </p>

      {step === 'select' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 260px' }}>
            <label className="testo-articoli" style={{ display: 'block', marginBottom: 3 }}>Articolo</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(Number(e.target.value))}
              style={inpStyle}
            >
              {articoli.map(a => {
                const parts = [a.descrizione, a.produttore, a.serie].filter(Boolean)
                if (a.prezzo_vendita > 0) parts.push(`(€${Number(a.prezzo_vendita).toFixed(2)}${a.unita ? ` al ${a.unita}` : ''})`)
                else if (a.unita) parts.push(a.unita)
                const label = parts.join(' - ')
                const stock = a.max_acquistabile === 0 ? ' [ESAURITO]' : a.max_acquistabile != null ? ` [Max ${a.max_acquistabile}]` : ''
                return (
                  <option key={a.id} value={a.id}>{label}{stock}</option>
                )
              })}
            </select>
          </div>
          <button
            type="button"
            onClick={() => { if (!esaurito) setStep('detail') }}
            disabled={esaurito}
            className="btn-green"
            style={{ height: 42, padding: '0 22px', borderRadius: 21, fontSize: 13, fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0, opacity: esaurito ? 0.5 : 1 }}
          >
            {esaurito ? 'Esaurito' : 'Acquista →'}
          </button>
        </div>
      )}

      {step === 'detail' && selected && !esaurito && (
        <form key={selected.id} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460 }}>
          <input type="hidden" name="listino_id" value={selected.id} />

          <p className="testo-articoli" style={{ margin: 0 }}>
            {selected.descrizione}{' '}
            <span style={{ fontWeight: 400 }}>— {selected.produttore}</span>
            {' '}
            <span style={{ color: '#888' }}>({selected.unita})</span>
          </p>

          {selected.max_acquistabile != null && selected.max_acquistabile > 0 && (
            <p className="testo-articoli" style={{ margin: 0, color: '#e65100', fontWeight: 600 }}>
              Disponibilità massima: {selected.max_acquistabile} {selected.unita}
            </p>
          )}

          {/* Campi adattivi per unità */}
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

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setStep('select')}
              className="btn-red"
              style={{ flex: 1, height: 42, borderRadius: 21, fontSize: 13, fontFamily: 'monospace' }}
            >
              Annulla
            </button>
            <button type="submit" disabled={isPending} className={isPending ? 'btn-gray' : 'btn-green'} style={{ flex: 1, height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>
              {isPending ? 'Aggiunta…' : 'Acquista'}
            </button>
          </div>
        </form>
      )}

      {result?.ok && (
        <p className="testo-articoli" style={{ marginTop: 8, marginBottom: 0 }}>
          ✓ Articolo aggiunto.{' '}
          <a href="/area-clienti/carrello-acquisti" style={{ color: '#2e7d32', fontWeight: 600 }}>Vai al carrello →</a>
        </p>
      )}
      {result && !result.ok && (
        <p className="testo-articoli" style={{ marginTop: 8, marginBottom: 0, WebkitTextFillColor: '#c0392b', color: '#c0392b' }}>{result.error}</p>
      )}
    </div>
  )
}
