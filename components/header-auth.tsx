'use client'

import { useState, useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { login, logout } from '@/app/actions'

interface HeaderAuthProps {
  username?: string | null
}

function InlineLoginForm() {
  const [error, formAction, isPending] = useActionState(login, null)
  return (
    <form action={formAction} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, width: 110 }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, width: 110 }}
      />
      <button
        type="submit"
        disabled={isPending}
        className={isPending ? 'btn-gray' : 'btn-green'}
        style={{ padding: '4px 12px', fontSize: 13, borderRadius: 4 }}
      >
        {isPending ? '...' : 'Entra'}
      </button>
      {error && <span style={{ fontSize: 12, color: '#c00', whiteSpace: 'nowrap' }}>{error}</span>}
    </form>
  )
}

function DropdownLoginForm() {
  const [error, formAction, isPending] = useActionState(login, null)
  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px' }}>
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        style={{ padding: '6px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        style={{ padding: '6px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }}
      />
      <button
        type="submit"
        disabled={isPending}
        className={isPending ? 'btn-gray' : 'btn-green'}
        style={{ padding: '6px 12px', fontSize: 13, borderRadius: 4 }}
      >
        {isPending ? '...' : 'Entra'}
      </button>
      {error && <span style={{ fontSize: 12, color: '#c00' }}>{error}</span>}
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2px 0' }} />
      <a
        href="/registrazione"
        style={{ fontSize: 12, color: '#555', textDecoration: 'none', textAlign: 'center' }}
      >
        Non hai un account? <strong>Registrati</strong>
      </a>
    </form>
  )
}

export default function HeaderAuth({ username }: HeaderAuthProps) {
  const [isNarrow, setIsNarrow] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 720)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // chiudi dropdown al click fuori
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isOpen])

  // utente loggato: logout sempre inline, compatto
  if (username) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={{ fontSize: 11, color: '#ffffff', whiteSpace: 'nowrap' }}>
          Benvenuto, <strong>{username}</strong>
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="btn-red"
            style={{ padding: '4px 12px', fontSize: 13, borderRadius: 4 }}
          >
            Logout
          </button>
        </form>
      </div>
    )
  }

  // schermo stretto: toggle dropdown verticale
  if (isNarrow) {
    return (
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(v => !v)}
          className="btn-green"
          style={{ padding: '5px 14px', fontSize: 13, borderRadius: 4, whiteSpace: 'nowrap' }}
        >
          {isOpen ? '✕ Chiudi' : 'Accedi ▾'}
        </button>
        {isOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 200,
          }}>
            <DropdownLoginForm />
          </div>
        )}
      </div>
    )
  }

  // schermo largo: form inline con "Registrati"
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <a
        href="/registrazione"
        style={{ fontSize: 13, color: '#555', textDecoration: 'none', whiteSpace: 'nowrap' }}
      >
        Registrati
      </a>
      <div style={{ width: 1, height: 16, background: '#e0e0e0' }} />
      <InlineLoginForm />
    </div>
  )
}
