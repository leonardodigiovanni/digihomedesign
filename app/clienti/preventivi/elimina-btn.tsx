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
      style={{ padding: '0 24px', fontWeight: 600 }}
      onClick={() => {
        if (!confirm('Eliminare questo preventivo e tutti i suoi articoli?')) return
        startT(async () => { await eliminaPreventivo(id); router.refresh() })
      }}
    >
      {pending ? '…' : 'Elimina'}
    </button>
  )
}
