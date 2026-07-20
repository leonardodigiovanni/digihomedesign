'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { MacroSezione } from '@/lib/ecommerce'

const inpStyle: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc',
  borderRadius: 4, fontSize: 13, fontFamily: 'inherit',
  width: '100%', boxSizing: 'border-box', color: '#222', WebkitTextFillColor: '#222',
}

const CARD_WIDTH = 220

type Ordinamento = 'nome-asc' | 'nome-desc'

function SezioneCard({ s }: { s: MacroSezione }) {
  return (
    <Link
      href={`/shop/${s.slug}`}
      style={{
        width: CARD_WIDTH, display: 'flex', flexDirection: 'column', textDecoration: 'none',
        background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8, overflow: 'hidden',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 13,
      }}>
        {s.nome}
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1111' }}>{s.nome}</span>
        <span style={{
          fontSize: 12, color: '#888', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {s.descrizione}
        </span>
      </div>
    </Link>
  )
}

export default function EcommerceHub({ sezioni }: { sezioni: MacroSezione[] }) {
  const [ricerca, setRicerca] = useState('')
  const [ordinamento, setOrdinamento] = useState<Ordinamento>('nome-asc')
  const [filtriAperti, setFiltriAperti] = useState(false)

  const filtrate = useMemo(() => {
    const q = ricerca.trim().toLowerCase()
    const base = q ? sezioni.filter(s => `${s.nome} ${s.descrizione}`.toLowerCase().includes(q)) : sezioni
    const ordinate = [...base].sort((a, b) => a.nome.localeCompare(b.nome))
    return ordinamento === 'nome-desc' ? ordinate.reverse() : ordinate
  }, [sezioni, ricerca, ordinamento])

  const filtriAttivi = ordinamento !== 'nome-asc'

  function azzeraFiltri() {
    setOrdinamento('nome-asc')
  }

  return (
    <div>
      <input
        type="search"
        value={ricerca}
        onChange={e => setRicerca(e.target.value)}
        placeholder="Cerca una categoria…"
        style={{ ...inpStyle, marginBottom: 16, padding: '10px 14px', fontSize: 14 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setFiltriAperti(true)}
          className="btn-black"
          style={{ height: 42, borderRadius: 21, padding: '0 20px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          ☰ Filtri{filtriAttivi ? ' •' : ''}
        </button>
      </div>

      {filtriAperti && (
        <div
          onClick={() => setFiltriAperti(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, maxWidth: '85vw',
              background: '#fff', padding: '20px 16px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#222' }}>Filtri</p>
              <button
                type="button"
                onClick={() => setFiltriAperti(false)}
                className="btn-red"
                style={{ width: 32, height: 32, borderRadius: 16, padding: 0, fontSize: 14 }}
              >
                ✕
              </button>
            </div>

            <div>
              <p className="testo-articoli" style={{ margin: '0 0 8px', fontWeight: 700 }}>Ordina per</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444', padding: '3px 0', cursor: 'pointer' }}>
                <input type="radio" name="ordinamento" checked={ordinamento === 'nome-asc'} onChange={() => setOrdinamento('nome-asc')} />
                Nome (A → Z)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444', padding: '3px 0', cursor: 'pointer' }}>
                <input type="radio" name="ordinamento" checked={ordinamento === 'nome-desc'} onChange={() => setOrdinamento('nome-desc')} />
                Nome (Z → A)
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #eee' }}>
              {filtriAttivi && (
                <button type="button" onClick={azzeraFiltri} className="btn-red" style={{ height: 36, borderRadius: 18, fontSize: 12 }}>
                  Cancella filtri
                </button>
              )}
              <button type="button" onClick={() => setFiltriAperti(false)} className="btn-green" style={{ height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600 }}>
                Mostra {filtrate.length} risultat{filtrate.length === 1 ? 'o' : 'i'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{ margin: '0 0 10px', fontSize: 12, color: '#888' }}>
        {filtrate.length} categori{filtrate.length === 1 ? 'a' : 'e'}
      </p>

      {filtrate.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 4px', textAlign: 'center' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Nessuna categoria trovata.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CARD_WIDTH}px)`, gap: 12 }}>
            {filtrate.map(s => <SezioneCard key={s.slug} s={s} />)}
          </div>
        </div>
      )}
    </div>
  )
}
