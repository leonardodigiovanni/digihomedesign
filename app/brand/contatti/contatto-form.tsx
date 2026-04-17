'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { inviaCodice, inviaContatto, inviaContattoLoggato } from './actions'
import type { CodiceResult, ContattoResult, ContattoLoggatoResult } from './actions'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  border: '1px solid #d0d0d0',
  borderRadius: 7,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  color: '#1a1a1a',
  background: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#444',
  marginBottom: 5,
}

const successBox = {
  background: '#f0faf4', border: '1px solid #a8d5b5', borderRadius: 8,
  padding: '18px 20px', fontSize: 15, color: '#276749',
}

const errorBox = {
  background: '#fff0f0', border: '1px solid #f5c6c6', borderRadius: 8,
  padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#c00',
}

type FormValues = {
  nome: string; cognome: string; email: string; cellulare: string; messaggio: string
}

/* ── Form per utenti NON loggati (con OTP SMS) ── */
function FormAnonimo() {
  const [fase, setFase] = useState<'form' | 'verifica' | 'inviato'>('form')
  const [saved, setSaved] = useState<FormValues>({ nome: '', cognome: '', email: '', cellulare: '', messaggio: '' })
  const [isDirty, setIsDirty] = useState(false)

  const [codiceState, codiceAction, codicePending] = useActionState<CodiceResult | null, FormData>(inviaCodice, null)
  const [contattoState, contattoAction, contattoPending] = useActionState<ContattoResult | null, FormData>(inviaContatto, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { if (codiceState?.ok) setFase('verifica') }, [codiceState])
  useEffect(() => { if (contattoState?.ok) setFase('inviato') }, [contattoState])

  if (fase === 'inviato') return (
    <div style={successBox}>Messaggio inviato correttamente. Ti risponderemo entro 24 ore.</div>
  )

  if (fase === 'verifica') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
        Abbiamo inviato un codice a 6 cifre al numero <strong>{saved.cellulare}</strong>. Inseriscilo per inviare la richiesta.
      </p>
      {contattoState && !contattoState.ok && <div style={errorBox}>{contattoState.error}</div>}
      <form action={contattoAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="nome"      value={saved.nome} />
        <input type="hidden" name="cognome"   value={saved.cognome} />
        <input type="hidden" name="email"     value={saved.email} />
        <input type="hidden" name="cellulare" value={saved.cellulare} />
        <input type="hidden" name="messaggio" value={saved.messaggio} />
        <div>
          <label style={labelStyle}>Codice SMS *</label>
          <input name="codice" type="text" required maxLength={6} inputMode="numeric"
            autoComplete="one-time-code" placeholder="000000"
            style={{ ...inputStyle, maxWidth: 180, letterSpacing: '0.2em', fontSize: 18, textAlign: 'center' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="submit" disabled={contattoPending} className="btn-green"
            style={{ padding: '10px 28px', fontSize: 14, fontFamily: 'inherit', opacity: contattoPending ? 0.6 : 1 }}>
            {contattoPending ? 'Invio in corso…' : 'Invia messaggio'}
          </button>
          <button type="button" onClick={() => setFase('form')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#888', textDecoration: 'underline', fontFamily: 'inherit' }}>
            ← Modifica dati
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {codiceState && !codiceState.ok && <div style={errorBox}>{codiceState.error}</div>}
      <form ref={formRef} action={codiceAction}
        onChange={() => {
          const fd = new FormData(formRef.current!)
          setIsDirty(['nome','cognome','email','cellulare','messaggio'].some(k => (fd.get(k) as string)?.trim()))
        }}
        onSubmit={e => {
          const fd = new FormData(e.currentTarget)
          setSaved({
            nome:      (fd.get('nome')      as string) ?? '',
            cognome:   (fd.get('cognome')   as string) ?? '',
            email:     (fd.get('email')     as string) ?? '',
            cellulare: (fd.get('cellulare') as string) ?? '',
            messaggio: (fd.get('messaggio') as string) ?? '',
          })
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Nome *</label>
            <input name="nome" type="text" required defaultValue={saved.nome} style={inputStyle} placeholder="Mario" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Cognome</label>
            <input name="cognome" type="text" defaultValue={saved.cognome} style={inputStyle} placeholder="Rossi" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Email *</label>
            <input name="email" type="email" required defaultValue={saved.email} style={inputStyle} placeholder="mario@esempio.it" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Cellulare *</label>
            <input name="cellulare" type="tel" required defaultValue={saved.cellulare} style={inputStyle} placeholder="+39 333 0000000" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Messaggio *</label>
          <textarea name="messaggio" required rows={5} defaultValue={saved.messaggio}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Descrivi la tua richiesta..." />
        </div>
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" disabled={codicePending} className="btn-green"
              style={{ padding: '10px 28px', fontSize: 14, fontFamily: 'inherit', opacity: codicePending ? 0.6 : 1 }}>
              {codicePending ? 'Invio codice…' : 'Invia codice SMS'}
            </button>
            {isDirty && (
              <button type="button" className="btn-red"
                style={{ padding: '10px 22px', fontSize: 14, fontFamily: 'inherit' }}
                onClick={() => { formRef.current?.reset(); setIsDirty(false) }}>
                Annulla
              </button>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
            Riceverai un codice di verifica via SMS sul cellulare indicato.
          </p>
        </div>
      </form>
    </div>
  )
}

/* ── Form per utenti loggati (senza OTP) ── */
function FormLoggato({ username, role }: { username: string; role: string }) {
  const [inviato, setInviato] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [state, action, pending] = useActionState<ContattoLoggatoResult | null, FormData>(inviaContattoLoggato, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { if (state?.ok) setInviato(true) }, [state])

  if (inviato) return <div style={successBox}>Messaggio inviato correttamente. Ti risponderemo entro 24 ore.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
        Sei loggato come <strong>{username}</strong> ({role}). Il messaggio sarà inviato a nome tuo.
      </p>
      {state && !state.ok && <div style={errorBox}>{state.error}</div>}
      <form ref={formRef} action={action}
        onChange={() => {
          const fd = new FormData(formRef.current!)
          setIsDirty(['nome','cognome','email','cellulare','messaggio'].some(k => (fd.get(k) as string)?.trim()))
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Nome *</label>
            <input name="nome" type="text" required style={inputStyle} placeholder="Mario" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Cognome</label>
            <input name="cognome" type="text" style={inputStyle} placeholder="Rossi" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Email *</label>
            <input name="email" type="email" required style={inputStyle} placeholder="mario@esempio.it" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={labelStyle}>Cellulare</label>
            <input name="cellulare" type="tel" style={inputStyle} placeholder="+39 333 0000000" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Messaggio *</label>
          <textarea name="messaggio" required rows={5}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Descrivi la tua richiesta..." />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="submit" disabled={pending} className="btn-green"
            style={{ padding: '10px 28px', fontSize: 14, fontFamily: 'inherit', opacity: pending ? 0.6 : 1 }}>
            {pending ? 'Invio in corso…' : 'Invia messaggio'}
          </button>
          {isDirty && (
            <button type="button" className="btn-red"
              style={{ padding: '10px 22px', fontSize: 14, fontFamily: 'inherit' }}
              onClick={() => { formRef.current?.reset(); setIsDirty(false) }}>
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* ── Componente principale ── */
export default function ContattoForm({ username, role }: { username: string | null; role: string | null }) {
  const loggato = !!username && !!role

  return (
    <div style={{ marginTop: 36 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 }}>Scrivici</h2>
      {loggato
        ? <FormLoggato username={username} role={role} />
        : <FormAnonimo />
      }
    </div>
  )
}
