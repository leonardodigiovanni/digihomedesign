'use client'

import { useState, useActionState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startAppRegistration, verifyAppPhone, resendAppPhoneCode } from './actions'
import type { StartResult, VerifyResult } from './actions'
import { validatePassword } from '@/lib/password'

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', fontSize: 15,
  border: '1px solid #ccc', borderRadius: 8,
  fontFamily: 'monospace', background: '#fff',
}

export default function AppRegistrationFlow({ redirectTo }: { redirectTo: string }) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [smsError, setSmsError] = useState('')
  const [smsPending, startSmsT] = useTransition()
  const [resendMsg, setResendMsg] = useState('')

  const [username, setUsername] = useState('')
  const [cellulare, setCellulare] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const [startResult, startAction, startPending] = useActionState<StartResult | null, FormData>(
    async (prev, fd) => {
      const res = await startAppRegistration(prev, fd)
      if (res.ok) setPendingId(res.pendingId)
      return res
    },
    null
  )

  function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pendingId) return
    const code = (e.currentTarget.elements.namedItem('otp') as HTMLInputElement).value.trim()
    setSmsError('')
    startSmsT(async () => {
      const res: VerifyResult = await verifyAppPhone(pendingId, code)
      if (res.ok) {
        router.replace('/app/completa-profilo')
      } else {
        setSmsError(res.error)
      }
    })
  }

  async function handleResend() {
    if (!pendingId) return
    setResendMsg('')
    const res = await resendAppPhoneCode(pendingId)
    setResendMsg(res.ok ? 'Nuovo codice inviato via SMS.' : res.error)
  }

  if (pendingId !== null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 10, padding: 16 }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
            Verifica cellulare
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555', fontFamily: 'monospace' }}>
            Abbiamo inviato un codice SMS al numero indicato. Inseriscilo qui sotto.
          </p>
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Codice a 6 cifre"
              required
              style={{ ...inp, letterSpacing: '0.2em', textAlign: 'center', fontSize: 22 }}
            />
            {smsError && (
              <p style={{ margin: 0, fontSize: 12, color: '#c00', fontFamily: 'monospace' }}>{smsError}</p>
            )}
            <button type="submit" disabled={smsPending} className={smsPending ? 'btn-gray-app' : 'btn-green-app'}
              style={{ fontSize: 15, fontFamily: 'monospace' }}>
              {smsPending ? 'Verifica…' : 'Verifica e accedi'}
            </button>
          </form>
          <button type="button" onClick={handleResend}
            style={{ marginTop: 12, background: 'none', border: 'none', color: '#555', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
            Non hai ricevuto il codice? Reinvia SMS
          </button>
          {resendMsg && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#1e4d2b', fontFamily: 'monospace' }}>{resendMsg}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 10, padding: 16 }}>
        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
          Crea il tuo account
        </p>
        <form action={startAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#666', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Username *
            </label>
            <input name="username" type="text" required autoComplete="username" style={inp} value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#666', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Cellulare *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
              <span style={{ padding: '10px 10px 10px 12px', fontSize: 15, fontFamily: 'monospace', color: '#333', whiteSpace: 'nowrap', userSelect: 'none' }}>+39</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder=""
                required
                style={{ ...inp, border: 'none', borderRadius: 0, paddingLeft: 4, flex: 1 }}
                value={cellulare}
                onChange={e => {
                  const v = e.target.value.replace(/^\+?39/, '').replace(/[^\d\s\-]/g, '')
                  setCellulare(v)
                }}
              />
            </div>
            <input type="hidden" name="cellulare" value={`+39${cellulare}`} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#666', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Password *
            </label>
            <input name="password" type="password" required autoComplete="new-password" style={inp} value={password} onChange={e => setPassword(e.target.value)} />
            {password && validatePassword(password) && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#c00', fontFamily: 'monospace' }}>{validatePassword(password)}</p>
            )}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#666', fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Conferma password *
            </label>
            <input name="password2" type="password" required autoComplete="new-password" style={inp} value={password2} onChange={e => setPassword2(e.target.value)} />
            {password2 && password !== password2 && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#c00', fontFamily: 'monospace' }}>Le password non coincidono.</p>
            )}
          </div>
          {startResult && !startResult.ok && (
            <p style={{ margin: 0, fontSize: 12, color: '#c00', fontFamily: 'monospace' }}>{startResult.error}</p>
          )}
          <button type="submit" disabled={startPending} className={startPending ? 'btn-gray-app' : 'btn-green-app'}
            style={{ fontSize: 15, fontFamily: 'monospace' }}>
            {startPending ? 'Invio codice…' : 'Continua →'}
          </button>
        </form>
      </div>
    </div>
  )
}
