'use client'

import { useStickyBottomBarContent } from '@/lib/sticky-bottom-bar-context'

const NUMERI = [
  { label: 'Uno', n: 1 },
  { label: 'Due', n: 2 },
  { label: 'Tre', n: 3 },
  { label: 'Quattro', n: 4 },
  { label: 'Cinque', n: 5 },
  { label: 'Sei', n: 6 },
  { label: 'Sette', n: 7 },
  { label: 'Otto', n: 8 },
  { label: 'Nove', n: 9 },
  { label: 'Dieci', n: 10 },
]

/** Solo di test: registra i bottoni nella barra fissa in fondo, solo per la pagina che la monta. */
export default function StickyBottomBarTestContent() {
  useStickyBottomBarContent(
    <div style={{ display: 'flex', gap: 10 }}>
      {NUMERI.map(({ label, n }) => (
        <button
          key={n}
          type="button"
          className="btn-green"
          onClick={() => alert(`Il numero è ${n}`)}
          style={{ padding: '0 20px' }}
        >
          {label}
        </button>
      ))}
    </div>
  )
  return null
}
