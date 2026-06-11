'use client'

import type { Cantiere } from '@/app/area-lavoro/cantieri/cantieri-client'
import { b } from '@/lib/btn'

export default function ApriCantiereBtn({ cantiere, onSelect, isApp }: { cantiere: Cantiere; onSelect: (c: Cantiere) => void; isApp?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(cantiere)}
      className={b('btn-gold', isApp)}
      style={{ padding: '0 24px' }}
    >
      {cantiere.titolo}
    </button>
  )
}
