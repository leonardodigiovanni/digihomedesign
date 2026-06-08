'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminaPreventivo } from './actions'

export default function EliminaBtn({ id }: { id: number }) {
  const [pending, startT] = useTransition()
  const router = useRouter()

  return (
    <button
      disabled={pending}
      className="btn-red"
      style={{ height: 42, borderRadius: 21, padding: '0 24px', fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}
      onClick={() => {
        if (!confirm('Eliminare questo preventivo e tutti i suoi articoli?')) return
        startT(async () => { await eliminaPreventivo(id); router.refresh() })
      }}
    >
      {pending ? '…' : 'Elimina'}
    </button>
  )
}
