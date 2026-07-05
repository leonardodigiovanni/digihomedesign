'use client'

import { useState, useActionState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  avviaCompletamento, verificaEmailCompletamento, verificaSmsCompletamento,
  finalizzaDopoEmail, reinviaEmailCompletamento, reinviaSmsCompletamento,
  saltaProfilo, type AvviaResult,
} from '@/app/app/completa-profilo/actions'

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', fontSize: 15,
  border: '1px solid #ccc', borderRadius: 8,
  background: '#fff',
}
const inpDisabled: React.CSSProperties = {
  ...inp, background: '#f0f0f0', color: '#888', cursor: 'not-allowed',
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#666',
  textTransform: 'uppercase',
  display: 'block', marginBottom: 4,
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: 16,
}

type Phase = 'form' | 'email-otp' | 'sms-otp' | 'done'

type UserData = {
  username: string
  nome: string
  cognome: string
  email: string
  cellulare: string
}

export default function CompletaFormSito({ user }: { user: UserData }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('form')
  const [pendingId, setPendingId] = useState<number | null>(null)

  const celRaw = user.cellulare?.replace(/^\+39/, '') ?? ''
  const [celInput, setCelInput] = useState(celRaw)

  const [emailCode, setEmailCode] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [emailPending, startEmailT] = useTransition()

  const [smsCode, setSmsCode] = useState('')
  const [smsError, setSmsError] = useState('')
  const [smsMsg, setSmsMsg] = useState('')
  const [smsPending, startSmsT] = useTransition()

  const [isDirty, setIsDirty] = useState(false)

  const [avviaResult, avviaAction, avviaPending] = useActionState<AvviaResult | null, FormData>(
    async (prev, fd) => {
      const res = await avviaCompletamento(prev, fd)
      if (res.ok) {
        if (res.saved) {
          setPhase('done')
        } else {
          setPendingId(res.pendingId)
          setPhase(res.needsEmail ? 'email-otp' : 'sms-otp')
        }
      }
      return res
    },
    null
  )

  function handleEmailVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingId) return
    setEmailError('')
    startEmailT(async () => {
      const res = await verificaEmailCompletamento(pendingId, emailCode)
      if (res.ok) {
        if (res.needsSms) {
          setPhase('sms-otp')
        } else {
          await finalizzaDopoEmail(pendingId)
          setPhase('done')
        }
      } else {
        setEmailError(res.error)
      }
    })
  }

  function handleSmsVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingId) return
    setSmsError('')
    startSmsT(async () => {
      const res = await verificaSmsCompletamento(pendingId, smsCode)
      if (res.ok) {
        setPhase('done')
      } else {
        setSmsError(res.error)
      }
    })
  }

  if (phase === 'done') {
    return (
      <div style={{ ...card, textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontSize: 20 }}>✓</p>
        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700 }}>Profilo aggiornato!</p>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#555' }}>I tuoi dati sono stati salvati.</p>
        <button className="btn-green" style={{ fontSize: 14 }}
          onClick={() => router.replace('/')}>
          Torna alla home
        </button>
      </div>
    )
  }

  if (phase === 'email-otp') {
    return (
      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>Verifica email</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555' }}>
          Abbiamo inviato un codice alla nuova email. Inseriscilo qui sotto.
        </p>
        <form onSubmit={handleEmailVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text" inputMode="numeric" maxLength={6} required placeholder="Codice a 6 cifre"
            value={emailCode} onChange={e => setEmailCode(e.target.value)}
            style={{ ...inp, letterSpacing: '0.2em', textAlign: 'center', fontSize: 22 }}
          />
          {emailError && <p style={{ margin: 0, fontSize: 12, color: '#c00' }}>{emailError}</p>}
          <button type="submit" disabled={emailPending}
            className={emailPending ? 'btn-gray' : 'btn-green'}
            style={{ fontSize: 15 }}>
            {emailPending ? 'Verifica…' : 'Verifica email →'}
          </button>
        </form>
        <button type="button" onClick={async () => {
          if (!pendingId) return
          setEmailMsg('')
          const res = await reinviaEmailCompletamento(pendingId)
          setEmailMsg(res.ok ? 'Nuovo codice inviato.' : res.error)
        }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Non hai ricevuto il codice? Reinvia
        </button>
        {emailMsg && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#1e4d2b' }}>{emailMsg}</p>}
      </div>
    )
  }

  if (phase === 'sms-otp') {
    return (
      <div style={card}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>Verifica cellulare</p>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#555' }}>
          Abbiamo inviato un codice SMS al nuovo numero. Inseriscilo qui sotto.
        </p>
        <form onSubmit={handleSmsVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text" inputMode="numeric" maxLength={6} required placeholder="Codice a 6 cifre"
            value={smsCode} onChange={e => setSmsCode(e.target.value)}
            style={{ ...inp, letterSpacing: '0.2em', textAlign: 'center', fontSize: 22 }}
          />
          {smsError && <p style={{ margin: 0, fontSize: 12, color: '#c00' }}>{smsError}</p>}
          <button type="submit" disabled={smsPending}
            className={smsPending ? 'btn-gray' : 'btn-green'}
            style={{ fontSize: 15 }}>
            {smsPending ? 'Verifica…' : 'Verifica e salva →'}
          </button>
        </form>
        <button type="button" onClick={async () => {
          if (!pendingId) return
          setSmsMsg('')
          const res = await reinviaSmsCompletamento(pendingId)
          setSmsMsg(res.ok ? 'Nuovo codice inviato via SMS.' : res.error)
        }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Non hai ricevuto il codice? Reinvia SMS
        </button>
        {smsMsg && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#1e4d2b' }}>{smsMsg}</p>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={card}>
        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700 }}>
          Completa il tuo profilo
        </p>
        <form action={avviaAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div>
            <label style={lbl}>Username</label>
            <input type="text" value={user.username} disabled style={inpDisabled} />
          </div>

          <div>
            <label style={lbl}>Nome *</label>
            <input
              name="nome" type="text" required
              defaultValue={user.nome}
              disabled={!!user.nome}
              style={user.nome ? inpDisabled : inp}
              onChange={() => setIsDirty(true)}
            />
          </div>

          <div>
            <label style={lbl}>Cognome *</label>
            <input
              name="cognome" type="text" required
              defaultValue={user.cognome}
              disabled={!!user.cognome}
              style={user.cognome ? inpDisabled : inp}
              onChange={() => setIsDirty(true)}
            />
          </div>

          <div>
            <label style={lbl}>Email</label>
            <input
              name="email" type="email"
              defaultValue={user.email}
              disabled={!!user.email}
              style={user.email ? inpDisabled : inp}
              onChange={() => setIsDirty(true)}
            />
          </div>

          <div>
            <label style={lbl}>Cellulare</label>
            {user.cellulare ? (
              <input type="text" value={user.cellulare} disabled style={inpDisabled} />
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                  <span style={{ padding: '10px 10px 10px 12px', fontSize: 15, color: '#333', whiteSpace: 'nowrap', userSelect: 'none' }}>+39</span>
                  <input
                    type="tel" inputMode="numeric"
                    style={{ ...inp, border: 'none', borderRadius: 0, paddingLeft: 4, flex: 1 }}
                    value={celInput}
                    onChange={e => {
                      const v = e.target.value.replace(/^\+?39/, '').replace(/[^\d\s\-]/g, '')
                      setCelInput(v)
                      setIsDirty(true)
                    }}
                    placeholder="000 0000000"
                  />
                </div>
                <input type="hidden" name="cellulare" value={celInput ? `+39${celInput}` : ''} />
              </>
            )}
          </div>

          {avviaResult && !avviaResult.ok && (
            <p style={{ margin: 0, fontSize: 12, color: '#c00' }}>{avviaResult.error}</p>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={avviaPending || !isDirty}
              className={isDirty && !avviaPending ? 'btn-black' : 'btn-gray'}
              style={{ flex: 1, fontSize: 15 }}>
              {avviaPending ? 'Salvataggio…' : 'Salva'}
            </button>
            <button type="button"
              className="btn-orange"
              style={{ flex: 1, fontSize: 15 }}
              onClick={async () => {
                await saltaProfilo()
                router.replace('/')
              }}>
              Salta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
