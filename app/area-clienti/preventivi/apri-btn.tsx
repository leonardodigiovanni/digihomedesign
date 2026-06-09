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
      style={{ padding: '0 24px', fontSize: 14 }}
    >
      {numero || `#${id}`}
    </button>
  )
}
