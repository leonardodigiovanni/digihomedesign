'use client'

import { useState, useRef, useEffect } from 'react'
import { DropdownLoginForm } from '@/components/header-auth'

export default function AccediDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className={open ? 'btn-orange' : 'btn-black'}
        style={{ padding: '0 20px' }}
      >
        {open ? 'Chiudi ▴' : 'Accedi ▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 200,
        }}>
          <DropdownLoginForm />
        </div>
      )}
    </div>
  )
}
