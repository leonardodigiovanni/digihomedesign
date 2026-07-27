'use client'

import { useRouter } from 'next/navigation'

export default function ApriBtnComputometrico({ id, numero }: { id: number; numero: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(`/area-clienti/computometrici/${id}`)}
      className="btn-gold"
      style={{ padding: '0 24px', fontSize: 14 }}
    >
      {numero || `#${id}`}
    </button>
  )
}
