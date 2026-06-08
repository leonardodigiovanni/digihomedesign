'use client'

import { useRouter } from 'next/navigation'

export default function ApriBtnPreventivo({ id, numero, isStaff }: { id: number; numero: string; isStaff: boolean }) {
  const router = useRouter()
  const href = isStaff ? `/clienti/preventivi/${id}` : `/area-clienti/preventivi/${id}`

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="btn-black"
      style={{ height: 42, padding: '0 24px', borderRadius: 21, fontSize: 14, fontFamily: 'monospace', cursor: 'pointer' }}
    >
      {numero || `#${id}`}
    </button>
  )
}
