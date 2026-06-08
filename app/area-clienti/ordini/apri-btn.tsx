'use client'

import { useRouter } from 'next/navigation'

export default function ApriOrdineBtn({ id, numero }: { id: number; numero: string }) {
  const router = useRouter()

  const style: React.CSSProperties = {
    height: 42,
    padding: '0 24px',
    borderRadius: 21,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'monospace',
    cursor: 'pointer',
    background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px),
                 linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 20%, #404040 45%, #2d2d2d 80%, #1a1a1a 100%)`,
    color: '#e8e8e8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(200,200,200,0.1)',
  }

  return (
    <button
      type="button"
      onClick={() => router.push(`/area-clienti/ordini/${id}`)}
      style={style}
    >
      {numero || `#${id}`}
    </button>
  )
}
