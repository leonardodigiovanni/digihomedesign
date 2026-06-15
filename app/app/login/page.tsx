'use client'

import { useActionState, useEffect, useState } from 'react'
import { appLogin } from './actions'
import Link from 'next/link'
import WebAuthnLoginBtn from '../webauthn/login-btn'

export default function AppLoginPage() {
  const [error, action, pending] = useActionState<string | null, FormData>(appLogin, null)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!error || pending) return
    setToastVisible(true)
    const t = setTimeout(() => setToastVisible(false), 1000)
    return () => clearTimeout(t)
  }, [error, pending])

  return (
    <div style={{ maxWidth: 360, margin: '32px auto 0', padding: '0 8px' }}>
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        background: '#c00', color: '#fff', borderRadius: 8, padding: '10px 20px',
        fontSize: 13, fontFamily: 'monospace', zIndex: 9999, whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: toastVisible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {error}
      </div>

      <h1 className="app-welcome-title" style={{ marginBottom: 4 }}>Accedi</h1>
      <p className="app-welcome-sub" style={{ marginBottom: 28 }}>Inserisci le tue credenziali per continuare.</p>

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="app-section-title" style={{ display: 'block', marginBottom: 6 }}>Username</label>
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #d0d0d0', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>
        <div>
          <label className="app-section-title" style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid #d0d0d0', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={pending ? 'btn-gray-app' : 'btn-black-app'}
          style={{ width: '100%', marginTop: 20 }}
        >
          {pending ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, fontFamily: 'monospace', color: '#555' }}>
        Non hai un account?{' '}
        <Link href="/app/registrazione" style={{ color: '#333', fontWeight: 700, textDecoration: 'underline' }}>
          Registrati
        </Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: 10, fontSize: 13, fontFamily: 'monospace', color: '#555' }}>
        Non ricordi le credenziali?{' '}
        <Link href="/app/recupero-password" style={{ color: '#333', fontWeight: 700, textDecoration: 'underline' }}>
          Recuperale
        </Link>
      </p>

      <WebAuthnLoginBtn />
    </div>
  )
}
