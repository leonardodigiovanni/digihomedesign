'use client'

import { useRouter } from 'next/navigation'

export default function ApriBtnPreventivo({ id, numero }: { id: number; numero: string }) {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push(`/app/preventivo/${id}`)}
      className="btn-gold-app" style={{ padding: '0 24px' }}>
      {numero || `#${id}`}
    </button>
  )
}

