'use client'

import { useState, useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { usePathname } from 'next/navigation'
import { login, logout } from '@/app/actions'

interface HeaderAuthProps {
  username?: string | null
  registrazioniDisabilitate?: boolean
  forceDropdown?: boolean
}

function useLoginFlash(error: string | null, isPending: boolean) {
  const wasSubmitting = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (wasSubmitting.current && !isPending && error) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 1000)
      return () => clearTimeout(t)
    }
    wasSubmitting.current = isPending
  }, [isPending, error])

  return visible
}

function InlineLoginForm({ redirectTo }: { redirectTo?: string }) {
  const [error, formAction, isPending] = useActionState(login, null)
  const showError = useLoginFlash(error, isPending)

  return (
    <div style={{ position: 'relative' }}>
      <form action={formAction} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {redirectTo && <input type="hidden" name="redirect_to" value={redirectTo} />}
        <input
          name="username"
          placeholder="Username"
          autoComplete="username"
          required
          style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, width: 110, fontFamily: 'monospace' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, width: 110, fontFamily: 'monospace' }}
        />
        <button
          type="submit"
          disabled={isPending}
          className={isPending ? 'btn-gray' : 'btn-green'}
          style={{ padding: '0 12px' }}
        >
          {isPending ? '...' : 'Entra'}
        </button>
      </form>
      {showError && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 1px)', left: 0, zIndex: 50,
          background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5,
          padding: '6px 12px', fontSize: 12, color: '#c00', whiteSpace: 'nowrap',
        }}>
          Login non riuscito.
        </div>
      )}
    </div>
  )
}

export function DropdownLoginForm({ registrazioniDisabilitate, redirectTo }: { registrazioniDisabilitate?: boolean; redirectTo?: string }) {
  const [error, formAction, isPending] = useActionState(login, null)
  const showError = useLoginFlash(error, isPending)

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px' }}>
      {redirectTo && <input type="hidden" name="redirect_to" value={redirectTo} />}
      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
        style={{ padding: '6px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'monospace' }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        style={{ padding: '6px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'monospace' }}
      />
      <button
        type="submit"
        disabled={isPending}
        className={isPending ? 'btn-gray' : 'btn-black'}
        style={{ padding: '0 12px' }}
      >
        {isPending ? '...' : 'Accedi'}
      </button>
      {showError && (
        <div style={{
          background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5,
          padding: '6px 12px', fontSize: 12, color: '#c00',
        }}>
          Login non riuscito.
        </div>
      )}
      {!registrazioniDisabilitate && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2px 0' }} />
          <a
            href={`/registrazione${redirectTo ? `?from=${encodeURIComponent(redirectTo)}` : ''}`}
            style={{ fontSize: 12, color: '#555', textDecoration: 'none', textAlign: 'center', fontFamily: 'monospace' }}
          >
            Non hai un account? <strong>Registrati</strong>
          </a>
        </>
      )}
    </form>
  )
}

export default function HeaderAuth({ username, registrazioniDisabilitate, forceDropdown }: HeaderAuthProps) {
  const pathname = usePathname()
  const [isNarrow, setIsNarrow] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownRedirectTo, setDropdownRedirectTo] = useState<string | undefined>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 720)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // apri dropdown da evento esterno (es. bottone Acquista)
  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail as { redirectTo?: string } | undefined
      setDropdownRedirectTo(detail?.redirectTo)
      setIsOpen(true)
    }
    window.addEventListener('open-login-form', handle)
    return () => window.removeEventListener('open-login-form', handle)
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

  // utente loggato: logout stesso ingombro di "Accedi ▾"
  if (username) {
    return (
      <form action={logout}>
        <input type="hidden" name="current_url" value={pathname} />
        <button
          type="submit"
          className="btn-orange"
          style={{ padding: '0 16px' }}
        >
          Esci
        </button>
      </form>
    )
  }

  // schermo stretto o forceDropdown: toggle dropdown verticale
  if (isNarrow || forceDropdown) {
    return (
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(v => !v)}
          className={isOpen ? 'btn-orange' : 'btn-black'}
          style={{ padding: '0 14px' }}
        >
          {isOpen ? 'Chiudi ▴' : 'Accedi ▾'}
        </button>
        {isOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 200,
          }}>
            <DropdownLoginForm registrazioniDisabilitate={registrazioniDisabilitate} redirectTo={dropdownRedirectTo ?? pathname} />
          </div>
        )}
      </div>
    )
  }

  // schermo largo: form inline con "Registrati"
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {!registrazioniDisabilitate && (
        <>
          <a
            href="/registrazione"
            style={{ fontSize: 13, color: '#555', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'monospace' }}
          >
            Registrati
          </a>
          <div style={{ width: 1, height: 16, background: '#e0e0e0' }} />
        </>
      )}
      <InlineLoginForm redirectTo={pathname} />
    </div>
  )
}
