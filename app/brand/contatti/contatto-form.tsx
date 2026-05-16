'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { inviaCodice, inviaContatto, inviaContattoLoggato } from './actions'
import type { CodiceResult, ContattoResult, ContattoLoggatoResult } from './actions'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
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
  marginBottom: 5,
}

const successBox = {
  background: '#f0faf4', border: '1px solid #a8d5b5', borderRadius: 8,
  padding: '18px 20px',
}

const errorBox = {
  background: '#fff0f0', border: '1px solid #f5c6c6', borderRadius: 8,
  padding: '12px 16px', marginBottom: 16, color: '#c00',
}

type FormValues = {
  nome: string; cognome: string; email: string; cellulare: string; messaggio: string
}

/* ── Form per utenti NON loggati (con OTP SMS) ── */
function FormAnonimo() {
  const [fase, setFase] = useState<'form' | 'verifica' | 'inviato'>('form')
  const [saved, setSaved] = useState<FormValues>({ nome: '', cognome: '', email: '', cellulare: '', messaggio: '' })
  const [isDirty, setIsDirty] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const [codiceState, codiceAction, codicePending] = useActionState<CodiceResult | null, FormData>(inviaCodice, null)
  const [contattoState, contattoAction, contattoPending] = useActionState<ContattoResult | null, FormData>(inviaContatto, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { if (codiceState?.ok) setFase('verifica') }, [codiceState])
  useEffect(() => { if (contattoState?.ok) setFase('inviato') }, [contattoState])

  if (fase === 'inviato') return (
    <div className="testo-articoli" style={successBox}>Messaggio inviato correttamente. Ti risponderemo entro 24 ore.</div>
  )

  if (fase === 'verifica') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="testo-articoli" style={{ margin: 0 }}>
        Abbiamo inviato un codice a 6 cifre al numero <strong>{saved.cellulare}</strong>. Inseriscilo per inviare la richiesta.
      </p>
      {contattoState && !contattoState.ok && <div className="fs-14" style={errorBox}>{contattoState.error}</div>}
      <form action={contattoAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="nome"      value={saved.nome} />
        <input type="hidden" name="cognome"   value={saved.cognome} />
        <input type="hidden" name="email"     value={saved.email} />
        <input type="hidden" name="cellulare" value={saved.cellulare} />
        <input type="hidden" name="messaggio" value={saved.messaggio} />
        <div>
          <label className="testo-articoli" style={labelStyle}>Codice SMS *</label>
          <input name="codice" type="text" required maxLength={6} inputMode="numeric"
            autoComplete="one-time-code" placeholder="000000"
            className="fs-18" style={{ ...inputStyle, maxWidth: 180, letterSpacing: '0.2em', textAlign: 'center' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="submit" disabled={contattoPending} className="btn-black fs-14"
            style={{ padding: '10px 28px', fontFamily: 'inherit', opacity: contattoPending ? 0.6 : 1 }}>
            {contattoPending ? 'Invio in corso…' : 'Invia messaggio'}
          </button>
          <button type="button" onClick={() => setFase('form')}
            className="fs-13" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', textDecoration: 'underline', fontFamily: 'inherit' }}>
            ← Modifica dati
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {codiceState && !codiceState.ok && <div className="fs-14" style={errorBox}>{codiceState.error}</div>}
      <form ref={formRef} action={codiceAction}
        onChange={() => {
          const fd = new FormData(formRef.current!)
          const fields = ['nome','cognome','email','cellulare','messaggio']
          setIsDirty(fields.some(k => (fd.get(k) as string)?.trim()))
          setIsValid(fields.every(k => (fd.get(k) as string)?.trim()))
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
            <label className="testo-articoli" style={labelStyle}>Nome *</label>
            <input name="nome" type="text" required defaultValue={saved.nome} className="fs-14" style={inputStyle} placeholder="Mario" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Cognome *</label>
            <input name="cognome" type="text" required defaultValue={saved.cognome} className="fs-14" style={inputStyle} placeholder="Rossi" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Email *</label>
            <input name="email" type="email" required defaultValue={saved.email} className="fs-14" style={inputStyle} placeholder="mario@esempio.it" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Cellulare *</label>
            <input name="cellulare" type="tel" required defaultValue={saved.cellulare} className="fs-14" style={inputStyle} placeholder="+39 333 0000000" />
          </div>
        </div>
        <div>
          <label className="testo-articoli" style={labelStyle}>Messaggio *</label>
          <textarea name="messaggio" required rows={5} defaultValue={saved.messaggio}
            className="fs-14" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Descrivi la tua richiesta..." />
        </div>
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" disabled={codicePending || !isValid} className="btn-black fs-14"
              style={{ padding: '10px 28px', fontFamily: 'inherit', opacity: (codicePending || !isValid) ? 0.4 : 1, cursor: (codicePending || !isValid) ? 'not-allowed' : 'pointer' }}>
              {codicePending ? 'Invio codice…' : 'Invia codice SMS'}
            </button>
            {isDirty && (
              <button type="button" className="btn-orange fs-14"
                style={{ padding: '10px 22px', fontFamily: 'inherit', borderRadius: 6 }}
                onClick={() => { formRef.current?.reset(); setIsDirty(false); setIsValid(false) }}>
                Annulla
              </button>
            )}
          </div>
          <p className="testo-articoli" style={{ marginTop: 8 }}>
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

  if (inviato) return <div className="testo-articoli" style={successBox}>Messaggio inviato correttamente. Ti risponderemo entro 24 ore.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="testo-articoli" style={{ margin: 0 }}>
        Sei loggato come <strong>{username}</strong> ({role}). Il messaggio sarà inviato a nome tuo.
      </p>
      {state && !state.ok && <div className="fs-14" style={errorBox}>{state.error}</div>}
      <form ref={formRef} action={action}
        onChange={() => {
          const fd = new FormData(formRef.current!)
          setIsDirty(['nome','cognome','email','cellulare','messaggio'].some(k => (fd.get(k) as string)?.trim()))
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Nome *</label>
            <input name="nome" type="text" required className="fs-14" style={inputStyle} placeholder="Mario" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Cognome *</label>
            <input name="cognome" type="text" required className="fs-14" style={inputStyle} placeholder="Rossi" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Email *</label>
            <input name="email" type="email" required className="fs-14" style={inputStyle} placeholder="mario@esempio.it" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="testo-articoli" style={labelStyle}>Cellulare</label>
            <input name="cellulare" type="tel" className="fs-14" style={inputStyle} placeholder="+39 333 0000000" />
          </div>
        </div>
        <div>
          <label className="testo-articoli" style={labelStyle}>Messaggio *</label>
          <textarea name="messaggio" required rows={5}
            className="fs-14" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Descrivi la tua richiesta..." />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="submit" disabled={pending} className="btn-black fs-14"
            style={{ padding: '10px 28px', fontFamily: 'inherit', opacity: pending ? 0.6 : 1 }}>
            {pending ? 'Invio in corso…' : 'Invia messaggio'}
          </button>
          {isDirty && (
            <button type="button" className="btn-orange fs-14"
              style={{ padding: '10px 22px', fontFamily: 'inherit' }}
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
      <h2 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 20 }}>Scrivici</h2>
      {loggato
        ? <FormLoggato username={username} role={role} />
        : <FormAnonimo />
      }
    </div>
  )
}
