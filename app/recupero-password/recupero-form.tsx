'use client'

import { useState, useActionState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { avviaRecupero, verificaRecupero, salvaPassword, reinviaRecupero, type AvviaResult } from '@/app/app/recupero-password/actions'
import { validatePassword } from '@/lib/password'

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', fontSize: 15,
  border: '1px solid #ccc', borderRadius: 8,
  fontFamily: 'monospace', background: '#fff',
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#666',
  fontFamily: 'monospace', textTransform: 'uppercase',
  display: 'block', marginBottom: 4,
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: 16,
}

type Phase = 'cellulare' | 'otp' | 'password' | 'done'

export default function RecuperoFormSito() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('cellulare')
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [username, setUsername] = useState('')

  const [celInput, setCelInput] = useState('')

  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpPending, startOtpT] = useTransition()
  const [reinvioMsg, setReinvioMsg] = useState('')

  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwPending, startPwT] = useTransition()

  const [avviaResult, avviaAction, avviaPending] = useActionState<AvviaResult | null, FormData>(
    async (prev, fd) => {
      const res = await avviaRecupero(prev, fd)
      if (res.ok) {
        setPendingId(res.pendingId)
        setPhase('otp')
      }
      return res
    },
    null
  )

  function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingId) return
    setOtpError('')
    startOtpT(async () => {
      const res = await verificaRecupero(pendingId, otpCode)
      if (res.ok) {
        if (res.username) setUsername(res.username)
        setPhase('password')
      } else {
        setOtpError(res.error)
      }
    })
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingId) return
    setPwError('')
    const err = validatePassword(pw)
    if (err) { setPwError(err); return }
    if (pw !== pw2) { setPwError('Le password non coincidono.'); return }
    startPwT(async () => {
      const res = await salvaPassword(pendingId, pw)
      if (res.ok) setPhase('done')
      else setPwError(res.error)
    })
  }

  if (phase === 'done') {
    return (
      <div style={{ ...card, textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontSize: 20 }}>✓</p>
        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>Password aggiornata!</p>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#555', fontFamily: 'monospace' }}>Ora puoi accedere con la nuova password.</p>
        <button className="btn-green" style={{ fontSize: 14, fontFamily: 'monospace' }}
          onClick={() => router.replace('/')}>
          Torna alla home
        </button>
      </div>
    )
  }

  if (phase === 'password') {
    return (
      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>Nuova password</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555', fontFamily: 'monospace' }}>
          Scegli una password con almeno 8 caratteri, una maiuscola, una minuscola, un numero e un simbolo.
        </p>
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {username && (
            <div>
              <label style={lbl}>Username</label>
              <input type="text" value={username} disabled style={{ ...inp, background: '#f0f0f0', color: '#888', cursor: 'not-allowed' }} />
            </div>
          )}
          <div>
            <label style={lbl}>Nuova password *</label>
            <input type="password" required autoComplete="new-password"
              value={pw} onChange={e => { setPw(e.target.value); setPwError('') }} style={inp} />
          </div>
          <div>
            <label style={lbl}>Ripeti password *</label>
            <input type="password" required autoComplete="new-password"
              value={pw2} onChange={e => { setPw2(e.target.value); setPwError('') }} style={inp} />
          </div>
          {pwError && <p style={{ margin: 0, fontSize: 12, color: '#c00', fontFamily: 'monospace' }}>{pwError}</p>}
          <button type="submit" disabled={pwPending}
            className={pwPending ? 'btn-gray' : 'btn-black'}
            style={{ fontSize: 15, fontFamily: 'monospace' }}>
            {pwPending ? 'Salvataggio…' : 'Salva password'}
          </button>
        </form>
      </div>
    )
  }

  if (phase === 'otp') {
    return (
      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>Verifica cellulare</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555', fontFamily: 'monospace' }}>
          Abbiamo inviato un codice SMS al numero indicato. Inseriscilo qui sotto.
        </p>
        <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text" inputMode="numeric" maxLength={6} required placeholder="Codice a 6 cifre"
            value={otpCode} onChange={e => { setOtpCode(e.target.value); setOtpError('') }}
            style={{ ...inp, letterSpacing: '0.2em', textAlign: 'center', fontSize: 22 }}
          />
          {otpError && <p style={{ margin: 0, fontSize: 12, color: '#c00', fontFamily: 'monospace' }}>{otpError}</p>}
          <button type="submit" disabled={otpPending}
            className={otpPending ? 'btn-gray' : 'btn-green'}
            style={{ fontSize: 15, fontFamily: 'monospace' }}>
            {otpPending ? 'Verifica…' : 'Verifica →'}
          </button>
        </form>
        <button type="button" onClick={async () => {
          if (!pendingId) return
          setReinvioMsg('')
          const res = await reinviaRecupero(pendingId)
          setReinvioMsg(res.ok ? 'Nuovo codice inviato via SMS.' : res.error)
        }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#555', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Non hai ricevuto il codice? Reinvia
        </button>
        {reinvioMsg && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#1e4d2b', fontFamily: 'monospace' }}>{reinvioMsg}</p>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>Recupera credenziali</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555', fontFamily: 'monospace' }}>
          Inserisci il numero di cellulare associato al tuo account. Ti invieremo un codice SMS.
        </p>
        <form action={avviaAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={lbl}>Cellulare *</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
              <span style={{ padding: '10px 10px 10px 12px', fontSize: 15, fontFamily: 'monospace', color: '#333', whiteSpace: 'nowrap', userSelect: 'none' }}>+39</span>
              <input
                type="tel" inputMode="numeric" required
                style={{ ...inp, border: 'none', borderRadius: 0, paddingLeft: 4, flex: 1 }}
                value={celInput}
                onChange={e => {
                  const v = e.target.value.replace(/^\+?39/, '').replace(/[^\d\s\-]/g, '')
                  setCelInput(v)
                }}
              />
            </div>
            <input type="hidden" name="cellulare" value={celInput ? `+39${celInput}` : ''} />
          </div>
          {avviaResult && !avviaResult.ok && (
            <p style={{ margin: 0, fontSize: 12, color: '#c00', fontFamily: 'monospace' }}>{avviaResult.error}</p>
          )}
          <button type="submit" disabled={avviaPending}
            className={avviaPending ? 'btn-gray' : 'btn-black'}
            style={{ fontSize: 15, fontFamily: 'monospace' }}>
            {avviaPending ? 'Invio codice…' : 'Invia codice →'}
          </button>
        </form>
      </div>
    </div>
  )
}
