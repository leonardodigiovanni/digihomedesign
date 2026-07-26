'use client'

import { useState, useTransition } from 'react'
import { aggiungiAlCarrelloAcquisti, type CartResult } from '@/app/brand/cataloghi/actions'
import { b } from '@/lib/btn'
import SelectLookup from '@/components/select-lookup'

export type ArticoloListinoAcquisto = {
  id: number
  descrizione: string
  produttore: string
  serie?: string | null
  unita: string
  prezzo_vendita: number
  max_acquistabile: number | null
  foto_url?: string | null
  prezzo_promo?: number | null
}

// Stessa convenzione di aggiungi-articolo-form.tsx: normalizza il path della foto.
function immagineDi(a: ArticoloListinoAcquisto): string | null {
  const raw = a.foto_url
  if (!raw) return null
  return raw.startsWith('http') ? raw : raw.startsWith('/') ? raw : `/${raw}`
}

// Stesso schema prezzo di PrezzoAmazon (components/ecommerce-shop.tsx): un solo
// prezzo, oppure promo in rosso + normale barrato se prezzo_promo è impostato e diverso.
function PrezzoTile({ a }: { a: ArticoloListinoAcquisto }) {
  if (!a.prezzo_vendita) return null
  const normale = Number(a.prezzo_vendita)
  const promo = a.prezzo_promo != null ? Number(a.prezzo_promo) : null
  if (promo == null || promo === normale) {
    return <span style={{ fontSize: 12, fontWeight: 700, color: '#0f1111' }}>€ {normale.toFixed(2)}</span>
  }
  return (
    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#c0392b' }}>€ {promo.toFixed(2)}</span>
      <span style={{ fontSize: 11, color: '#888', textDecoration: 'line-through' }}>€ {normale.toFixed(2)}</span>
    </span>
  )
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

export default function AggiungiArticoloAcquistoForm({ articoli, isApp }: { articoli: ArticoloListinoAcquisto[]; isApp?: boolean }) {
  const [step, setStep] = useState<'select' | 'detail'>('select')
  const [selectedId, setSelectedId] = useState<number>(articoli[0]?.id ?? 0)
  const [result, setResult] = useState<CartResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [vista, setVista] = useState<'elenco' | 'immagini'>('elenco')

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
      padding: isApp ? '20px 4px 0' : '20px 4px',
    }}>
      <p className="testo-articoli" style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 24 }}>
        Aggiungi un articolo al carrello acquisti
      </p>

      {step === 'select' && (
        <div style={{ display: 'flex', flexDirection: isApp ? 'column' : 'row', gap: 8, flexWrap: isApp ? undefined : 'wrap', alignItems: isApp ? 'stretch' : 'flex-end' }}>
          <div style={isApp ? {} : { flex: '2 1 260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
              <label className="testo-articoli" style={{ margin: 0 }}>Articolo</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="button" onClick={() => setVista('elenco')}
                  className={vista === 'elenco' ? b('btn-black', isApp) : b('btn-gray', isApp)}
                  style={{ fontSize: 12, padding: '4px 10px' }}>
                  ☰ Elenco
                </button>
                <button type="button" onClick={() => setVista('immagini')}
                  className={vista === 'immagini' ? b('btn-black', isApp) : b('btn-gray', isApp)}
                  style={{ fontSize: 12, padding: '4px 10px' }}>
                  ▦ Immagini
                </button>
              </div>
            </div>
            {vista === 'elenco' ? (
              <SelectLookup
                value={String(selectedId)}
                onChange={v => setSelectedId(Number(v))}
                options={articoli.map(a => {
                  const parts = [a.descrizione, a.produttore, a.serie].filter(Boolean)
                  if (a.prezzo_vendita > 0) parts.push(`(€${Number(a.prezzo_vendita).toFixed(2)}${a.unita ? ` al ${a.unita}` : ''})`)
                  else if (a.unita) parts.push(a.unita)
                  const label = parts.join(' - ')
                  const stock = a.max_acquistabile === 0 ? ' [ESAURITO]' : a.max_acquistabile != null ? ` [Max ${a.max_acquistabile}]` : ''
                  return { value: String(a.id), label: `${label}${stock}` }
                })}
                style={inpStyle}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8, maxHeight: 320, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 6, padding: 10, background: '#fff' }}>
                {articoli.map(a => {
                  const isSel = a.id === selectedId
                  const esauritoA = a.max_acquistabile === 0
                  const url = immagineDi(a)
                  return (
                    <div key={a.id} onClick={() => setSelectedId(a.id)}
                      style={{
                        border: isSel ? '2px solid #266626' : '1px solid #ddd', borderRadius: 6, overflow: 'hidden',
                        cursor: 'pointer', userSelect: 'none', background: isSel ? '#e8f4e8' : '#fff',
                        display: 'flex', flexDirection: 'column', opacity: esauritoA ? 0.5 : 1,
                      }}>
                      <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt={a.descrizione} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: 10, color: '#bbb', textAlign: 'center', padding: 6 }}>Nessuna foto</span>
                        )}
                      </div>
                      <div style={{ padding: '6px 6px', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.3 }}>
                          {a.produttore ? `${a.produttore} · ` : ''}{a.descrizione}
                          {esauritoA && <span style={{ color: '#c0392b', fontWeight: 600 }}> (Esaurito)</span>}
                        </span>
                        {!esauritoA && <PrezzoTile a={a} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => { if (!esaurito) setStep('detail') }}
            disabled={esaurito}
            className={b('btn-green', isApp)}
            style={{ ...(isApp ? { alignSelf: 'center', marginTop: 6, marginBottom: 14 } : { height: 42, borderRadius: 21, flexShrink: 0 }), padding: '0 22px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', opacity: esaurito ? 0.5 : 1 }}
          >
            {esaurito ? 'Esaurito' : '+ Aggiungi ad acquisti'}
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
              className={b('btn-red', isApp)}
              style={{ flex: 1, ...(isApp ? {} : { height: 42, borderRadius: 21 }), fontSize: 13 }}
            >
              Annulla
            </button>
            <button type="submit" disabled={isPending} className={isPending ? b('btn-gray', isApp) : b('btn-green', isApp)} style={{ flex: 1, ...(isApp ? {} : { height: 42, borderRadius: 21 }), fontSize: 13, fontWeight: 600 }}>
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
