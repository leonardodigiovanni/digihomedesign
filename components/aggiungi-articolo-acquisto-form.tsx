'use client'

import { useActionState, useState, useEffect } from 'react'
import { aggiungiAlCarrelloAcquisti, type CartResult } from '@/app/brand/cataloghi/actions'

export type ArticoloListinoAcquisto = {
  id: number
  descrizione: string
  produttore: string
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
  width: '100%', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  fontSize: 11, color: '#666', display: 'flex', flexDirection: 'column', gap: 3,
}

export default function AggiungiArticoloAcquistoForm({ articoli }: { articoli: ArticoloListinoAcquisto[] }) {
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [selectedId, setSelectedId] = useState<number>(articoli[0]?.id ?? 0)
  const [result, action, pending] = useActionState<CartResult | null, FormData>(aggiungiAlCarrelloAcquisti, null)

  useEffect(() => {
    if (result?.ok) setStep('select')
  }, [result?.ok])

  if (articoli.length === 0) return null

  const selected = articoli.find(a => a.id === selectedId) ?? articoli[0]
  const mode = getUnitaMode(selected.unita)
  const esaurito = selected.max_acquistabile === 0

  return (
    <div style={{
      background: '#fdfcf8', border: '1px solid #e65100', borderRadius: 10,
      padding: '20px 24px', marginTop: 20,
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#1a1a1a' }}>
        Aggiungi articolo al carrello acquisti
      </h2>

      {step === 'select' && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 260px' }}>
            <label style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 3 }}>Articolo</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(Number(e.target.value))}
              style={inpStyle}
            >
              {articoli.map(a => {
                const esaurito = a.max_acquistabile === 0
                return (
                  <option key={a.id} value={a.id}>
                    {a.descrizione} — {a.produttore}{esaurito ? ' [ESAURITO]' : a.max_acquistabile != null ? ` [Max ${a.max_acquistabile}]` : ''}
                  </option>
                )
              })}
            </select>
          </div>
          <button
            type="button"
            onClick={() => !esaurito && setStep('detail')}
            disabled={esaurito}
            className="btn-green"
            style={{ padding: '7px 22px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, opacity: esaurito ? 0.5 : 1 }}
          >
            {esaurito ? 'Esaurito' : 'Aggiungi →'}
          </button>
        </div>
      )}

      {step === 'detail' && selected && !esaurito && (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
          <input type="hidden" name="listino_id" value={selected.id} />

          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
            {selected.descrizione}{' '}
            <span style={{ fontWeight: 400, color: '#888' }}>— {selected.produttore}</span>
            {' '}
            <span style={{ fontSize: 12, color: '#888' }}>({selected.unita})</span>
          </p>

          {selected.max_acquistabile != null && selected.max_acquistabile > 0 && (
            <p style={{ margin: 0, fontSize: 12, color: '#e65100', fontWeight: 600 }}>
              Disponibilità massima: {selected.max_acquistabile} {selected.unita}
            </p>
          )}

          {/* Campi adattivi per unità */}
          {mode === 'mq' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label style={lbl}>
                Larghezza (cm) *
                <input name="larghezza" type="number" min={0} step="0.1" placeholder="es. 120" required style={inpStyle} />
              </label>
              <label style={lbl}>
                Altezza (cm) *
                <input name="altezza" type="number" min={0} step="0.1" placeholder="es. 210" required style={inpStyle} />
              </label>
              <label style={{ ...lbl, gridColumn: '1 / -1' }}>
                Quantità *
                <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
              </label>
            </div>
          )}

          {mode === 'ml' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label style={lbl}>
                Lunghezza (cm) *
                <input name="larghezza" type="number" min={0} step="0.1" placeholder="es. 300" required style={inpStyle} />
              </label>
              <label style={lbl}>
                Quantità *
                <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
              </label>
            </div>
          )}

          {mode === 'kg' && (
            <label style={lbl}>
              Quantità (kg) *
              <input name="quantita" type="number" min={0.1} step="0.1" placeholder="es. 5" required style={inpStyle} />
            </label>
          )}

          {mode === 't' && (
            <label style={lbl}>
              Quantità (t) *
              <input name="quantita" type="number" min={0.001} step="0.001" placeholder="es. 1.5" required style={inpStyle} />
            </label>
          )}

          {mode === 'pz' && (
            <label style={lbl}>
              Quantità *
              <input name="quantita" type="number" min={1} defaultValue={1} required style={inpStyle} />
            </label>
          )}

          <label style={lbl}>
            Note (facoltative)
            <textarea name="note" rows={2} style={{ ...inpStyle, resize: 'vertical' }} placeholder="Eventuali note..." />
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setStep('select')}
              style={{
                padding: '7px 16px', fontSize: 13, border: '1px solid #ccc',
                borderRadius: 4, background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Annulla
            </button>
            <button type="submit" disabled={pending} className="btn-green" style={{ padding: '7px 22px', fontSize: 13, fontWeight: 600 }}>
              {pending ? 'Aggiunta…' : 'Aggiungi al carrello acquisti'}
            </button>
          </div>
        </form>
      )}

      {result?.ok && (
        <p style={{ color: '#2e7d32', fontSize: 13, marginTop: 10, marginBottom: 0 }}>
          ✓ Articolo aggiunto.{' '}
          <a href="/area-clienti/carrello-acquisti" style={{ color: '#2e7d32', fontWeight: 600 }}>Vai al carrello →</a>
        </p>
      )}
      {result && !result.ok && (
        <p style={{ color: '#c00', fontSize: 13, marginTop: 10, marginBottom: 0 }}>{result.error}</p>
      )}
    </div>
  )
}
