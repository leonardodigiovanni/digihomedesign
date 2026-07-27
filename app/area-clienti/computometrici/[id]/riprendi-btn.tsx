'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { riprendiComputometrico } from '@/app/area-clienti/carrello-computometrico/actions'

export default function RiprendiBtn({ id }: { id: number }) {
  const [pending, startT] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      disabled={pending}
      className="btn-green"
      style={{ padding: '0 20px', height: 36, lineHeight: '36px', borderRadius: 18 }}
      onClick={() => {
        if (!confirm('Riprendere questo computo nel carrello? Se hai un computo in corso non ancora salvato verrà sostituito.')) return
        startT(async () => {
          const res = await riprendiComputometrico(id)
          if (!res.ok) { alert(res.error ?? 'Errore.'); return }
          router.push('/area-clienti/carrello-computometrico')
        })
      }}
    >
      {pending ? '…' : 'Riprendi in carrello'}
    </button>
  )
}
