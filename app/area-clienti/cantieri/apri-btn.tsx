'use client'

import type { Cantiere } from '@/app/area-lavoro/cantieri/cantieri-client'

export default function ApriCantiereBtn({ cantiere, onSelect }: { cantiere: Cantiere; onSelect: (c: Cantiere) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(cantiere)}
      className="btn-gold"
      style={{ padding: '0 24px' }}
    >
      {cantiere.titolo}
    </button>
  )
}
