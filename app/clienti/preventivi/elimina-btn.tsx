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
      style={{ padding: '3px 10px', fontSize: 12 }}
      onClick={() => {
        if (!confirm('Eliminare questo preventivo e tutti i suoi articoli?')) return
        startT(async () => { await eliminaPreventivo(id); router.refresh() })
      }}
    >
      {pending ? '…' : 'Elimina'}
    </button>
  )
}
