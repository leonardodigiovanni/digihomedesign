'use client'

import { useTransition } from 'react'
import { toggleVisibilitaPreventivo } from './actions'

export default function VisibilitaBtn({ id, visibile }: { id: number; visibile: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleVisibilitaPreventivo(id)
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={visibile ? 'btn-green' : 'btn-red'}
      style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontSize: 14, fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}
    >
      {visibile ? 'Sì' : 'No'}
    </button>
  )
}
