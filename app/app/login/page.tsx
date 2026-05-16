'use client'

import { useActionState } from 'react'
import { appLogin } from './actions'
import Image from 'next/image'

export default function AppLoginPage() {
  const [error, action, pending] = useActionState<string | null, FormData>(appLogin, null)

  return (
    <div style={{ maxWidth: 360, margin: '32px auto 0', padding: '0 8px' }}>
      <Image
        src="/images/app/digi.png"
        alt="DIGI"
        width={72}
        height={72}
        className="app-welcome-logo"
      />
      <h1 className="app-welcome-title" style={{ marginBottom: 4 }}>Accedi</h1>
      <p className="app-welcome-sub" style={{ marginBottom: 28 }}>Inserisci le tue credenziali per continuare.</p>

      {error && (
        <div className="app-card" style={{ background: '#fff0f0', border: '1px solid #f5c6c6', marginBottom: 16 }}>
          <p className="app-card-body" style={{ color: '#c00', margin: 0 }}>{error}</p>
        </div>
      )}

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
          className="app-btn"
          style={{ marginTop: 8, opacity: pending ? 0.6 : 1 }}
        >
          {pending ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
