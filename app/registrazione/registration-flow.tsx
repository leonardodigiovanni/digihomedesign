'use client'

import { useActionState, useTransition, useState } from 'react'
import {
  startRegistration,
  verifyEmail,
  verifyPhone,
  resendEmailCode,
  resendPhoneCode,
  type StartResult,
  type VerifyResult,
} from './actions'

// ─── Stili comuni ─────────────────────────────────────────────────────────────

const card = 'reg-card'
const fieldset: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  border: 'none',
  padding: 0,
  margin: 0,
}
const label: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 13,
  fontWeight: 500,
  color: '#444',
}
const input: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 15,
  border: '1px solid #ccc',
  borderRadius: 5,
  outline: 'none',
  fontFamily: 'inherit',
}
const primaryBtn: React.CSSProperties = {
  marginTop: 6,
  padding: '11px',
  fontSize: 15,
  borderRadius: 6,
  width: '100%',
  fontFamily: 'inherit',
}
const errorBox: React.CSSProperties = {
  background: '#fff3f3',
  border: '1px solid #f5c2c2',
  borderRadius: 5,
  padding: '8px 12px',
  fontSize: 13,
  color: '#c00',
}
const steps = ['Dati personali', 'Verifica email', 'Verifica cellulare']

// ─── Barra progressi ──────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: 3,
              background: i <= current ? '#1a1a1a' : '#e0e0e0',
              marginBottom: 6,
              borderRadius: 2,
              transition: 'background 0.3s',
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: i === current ? '#1a1a1a' : '#aaa',
              fontWeight: i === current ? 600 : 400,
            }}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: dati personali ───────────────────────────────────────────────────

function Step1({ onSuccess }: { onSuccess: (id: number) => void }) {
  const [state, formAction, isPending] = useActionState<StartResult | null, FormData>(
    startRegistration,
    null
  )

  if (state?.ok) {
    onSuccess(state.pendingId)
    return null
  }

  return (
    <form
      action={(fd) => {
        formAction(fd)
      }}
    >
      <fieldset style={fieldset} disabled={isPending}>
        <label style={label}>
          Username *{' '}
          <span style={{ fontWeight: 400, color: '#888' }}>(lettere, numeri, _ . -)</span>
          <input name="username" required minLength={3} style={input} autoComplete="username" />
        </label>
        <div className="reg-grid-2">
          <label style={label}>
            Nome *
            <input name="nome" required style={input} />
          </label>
          <label style={label}>
            Cognome *
            <input name="cognome" required style={input} />
          </label>
        </div>
        <div className="reg-grid-2">
          <label style={label}>
            Data di nascita *
            <input name="data_nascita" type="date" required style={input} />
          </label>
          <label style={label}>
            Luogo di nascita *
            <input name="luogo_nascita" required style={input} />
          </label>
        </div>
        <label style={label}>
          Email *
          <input name="email" type="email" required style={input} autoComplete="email" />
        </label>
        <label style={label}>
          Cellulare *
          <input name="cellulare" type="tel" required placeholder="+39 333 1234567" style={input} />
        </label>
        <label style={label}>
          Password *{' '}
          <span style={{ fontWeight: 400, color: '#888' }}>(min. 8 caratteri)</span>
          <input name="password" type="password" required minLength={8} style={input} autoComplete="new-password" />
        </label>
        <label style={label}>
          Conferma password *
          <input name="password2" type="password" required minLength={8} style={input} autoComplete="new-password" />
        </label>

        {state && !state.ok && <div style={errorBox}>{state.error}</div>}

        <button type="submit" className={isPending ? 'btn-gray' : 'btn-green'} style={primaryBtn}>
          {isPending ? 'Invio codici...' : 'Continua →'}
        </button>
      </fieldset>
    </form>
  )
}

// ─── Step 2: verifica email ───────────────────────────────────────────────────

function Step2({ pendingId, onSuccess }: { pendingId: number; onSuccess: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res: VerifyResult = await verifyEmail(pendingId, code)
      if (res.ok) {
        onSuccess()
      } else {
        setError(res.error)
      }
    })
  }

  function handleResend() {
    setResendMsg(null)
    startTransition(async () => {
      const res: VerifyResult = await resendEmailCode(pendingId)
      setResendMsg(res.ok ? 'Nuovo codice inviato.' : (res as { ok: false; error: string }).error)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={fieldset}>
      <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
        Abbiamo inviato un codice a 6 cifre al tuo indirizzo email. Inseriscilo qui sotto.
      </p>
      <label style={label}>
        Codice email *
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          maxLength={6}
          inputMode="numeric"
          required
          style={{ ...input, letterSpacing: 8, fontSize: 22, textAlign: 'center' }}
          autoComplete="one-time-code"
        />
      </label>
      {error && <div style={errorBox}>{error}</div>}
      {resendMsg && <div style={{ fontSize: 13, color: '#555' }}>{resendMsg}</div>}
      <button type="submit" className={isPending ? 'btn-gray' : 'btn-green'} style={primaryBtn} disabled={isPending}>
        {isPending ? 'Verifica...' : 'Verifica email →'}
      </button>
      <button
        type="button"
        onClick={handleResend}
        disabled={isPending}
        style={{ background: 'none', border: 'none', fontSize: 13, color: '#555', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Non hai ricevuto il codice? Reinvia
      </button>
    </form>
  )
}

// ─── Step 3: verifica cellulare ───────────────────────────────────────────────

function Step3({ pendingId, onSuccess }: { pendingId: number; onSuccess: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res: VerifyResult = await verifyPhone(pendingId, code)
      if (res.ok) {
        onSuccess()
      } else {
        setError(res.error)
      }
    })
  }

  function handleResend() {
    setResendMsg(null)
    startTransition(async () => {
      const res: VerifyResult = await resendPhoneCode(pendingId)
      setResendMsg(res.ok ? 'Nuovo codice inviato via SMS.' : (res as { ok: false; error: string }).error)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={fieldset}>
      <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
        Abbiamo inviato un SMS con un codice a 6 cifre al tuo cellulare.
      </p>
      <label style={label}>
        Codice SMS *
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          maxLength={6}
          inputMode="numeric"
          required
          style={{ ...input, letterSpacing: 8, fontSize: 22, textAlign: 'center' }}
          autoComplete="one-time-code"
        />
      </label>
      {error && <div style={errorBox}>{error}</div>}
      {resendMsg && <div style={{ fontSize: 13, color: '#555' }}>{resendMsg}</div>}
      <button type="submit" className={isPending ? 'btn-gray' : 'btn-green'} style={primaryBtn} disabled={isPending}>
        {isPending ? 'Verifica...' : 'Completa registrazione →'}
      </button>
      <button
        type="button"
        onClick={handleResend}
        disabled={isPending}
        style={{ background: 'none', border: 'none', fontSize: 13, color: '#555', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Non hai ricevuto l&apos;SMS? Reinvia
      </button>
    </form>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function RegistrationFlow() {
  const [step, setStep] = useState(0)
  const [pendingId, setPendingId] = useState<number | null>(null)

  if (step === 3) {
    return (
      <div className={card}>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Registrazione completata!</h2>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
            Il tuo account è stato creato con successo.<br />
            <strong>È in attesa di attivazione</strong> da parte dell&apos;amministratore.<br />
            Riceverai una conferma quando potrai accedere.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block', padding: '10px 24px', fontSize: 14,
              background: '#1a1a1a', color: '#fff', borderRadius: 6, textDecoration: 'none',
            }}
          >
            Torna alla home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={card}>
      <h2 style={{ marginBottom: 4, fontSize: 20 }}>Crea un account</h2>
      <StepBar current={step} />

      {step === 0 && (
        <Step1
          onSuccess={(id) => {
            setPendingId(id)
            setStep(1)
          }}
        />
      )}
      {step === 1 && pendingId !== null && (
        <Step2 pendingId={pendingId} onSuccess={() => setStep(2)} />
      )}
      {step === 2 && pendingId !== null && (
        <Step3 pendingId={pendingId} onSuccess={() => setStep(3)} />
      )}
    </div>
  )
}
