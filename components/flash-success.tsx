'use client'
import { useState, useEffect } from 'react'

export default function FlashSuccess({ result, message }: {
  result: { ok: boolean } | null | undefined
  message: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!result?.ok) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(t)
  }, [result])

  if (!visible) return null
  return (
    <div style={{ background: '#f0faf0', border: '1px solid #b2dfb2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#2a7a2a' }}>
      {message}
    </div>
  )
}
