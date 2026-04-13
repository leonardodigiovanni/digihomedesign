'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { login } from '@/app/actions'

export default function EmergencyLogin({ inManutenzione }: { inManutenzione: boolean }) {
  const [visible, setVisible] = useState(false)
  const [error, formAction, pending] = useActionState<string | null, FormData>(login, null)
  const usernameRef  = useRef<HTMLInputElement>(null)
  const tapCount     = useRef(0)
  const tapTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!inManutenzione) return

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setVisible(v => !v)
      }
      if (e.key === 'Escape') setVisible(false)
    }

    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('#subfooter-logo')) return
      tapCount.current += 1
      if (tapTimer.current) clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => { tapCount.current = 0 }, 2000)
      if (tapCount.current >= 5) {
        tapCount.current = 0
        setVisible(true)
      }
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [inManutenzione])

  useEffect(() => {
    if (visible) usernameRef.current?.focus()
  }, [visible])

  if (!visible) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) setVisible(false) }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 10, padding: '28px 32px',
        width: 320, boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>Accesso amministratore</div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            ref={usernameRef}
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }}
          />
          {error && (
            <div style={{ fontSize: 12, color: '#c04444', fontWeight: 500 }}>{error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
            <button
              type="submit"
              disabled={pending}
              className={pending ? 'btn-gray' : 'btn-green'}
              style={{ flex: 1, padding: '8px 0', fontSize: 13, borderRadius: 7, fontFamily: 'inherit' }}
            >
              {pending ? '…' : 'Accedi'}
            </button>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="btn-gray"
              style={{ flex: 1, padding: '8px 0', fontSize: 13, borderRadius: 7, fontFamily: 'inherit' }}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
