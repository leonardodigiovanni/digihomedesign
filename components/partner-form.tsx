'use client'

import { useActionState, useEffect, useState } from 'react'
import Image from 'next/image'
import { inviaPartnership } from '@/app/partner-actions'
import type { PartnershipResult } from '@/app/partner-actions'

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

export default function PartnerForm() {
  const [aperto, setAperto] = useState(false)
  const [state, action, pending] = useActionState<PartnershipResult | null, FormData>(
    inviaPartnership,
    null
  )

  useEffect(() => {
    if (!aperto) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAperto(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aperto])

  // Blocca scroll body quando modal aperto
  useEffect(() => {
    document.body.style.overflow = aperto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aperto])

  return (
    <>
      <button
        onClick={() => setAperto(true)}
        className="cta-home-btn"
        style={{ width: 'auto', height: 'auto', padding: '14px 32px 42px', cursor: 'pointer', border: 'none', gap: 8, justifyContent: 'flex-start' }}
      >
        <Image src="/images/partnership - digi.png" alt="Partnership" width={115} height={115} style={{ objectFit: 'contain' }} />
        <span className="animato" style={{ fontSize: 15 }}>Diventa nostro partner</span>
      </button>

      {aperto && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setAperto(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px 28px',
            width: '100%', maxWidth: 520,
            maxHeight: '90vh', overflowY: 'auto',
            position: 'relative',
          }}>
            <button
              onClick={() => setAperto(false)}
              aria-label="Chiudi"
              style={{
                position: 'absolute', top: 14, right: 16,
                background: 'none', border: 'none', fontSize: 22,
                cursor: 'pointer', color: '#888', lineHeight: 1,
                fontFamily: 'inherit',
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
              Diventa nostro partner
            </h2>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 24, lineHeight: 1.5 }}>
              Compila il form e ti contatteremo per valutare insieme la collaborazione.
            </p>

            {state?.ok ? (
              <div style={{
                background: '#f0faf4', border: '1px solid #a8d5b5', borderRadius: 8,
                padding: '16px 18px', fontSize: 14, color: '#276749', lineHeight: 1.6,
              }}>
                Richiesta inviata. Ti contatteremo al più presto.
              </div>
            ) : (
              <>
                {state && !state.ok && (
                  <div style={{
                    background: '#fff0f0', border: '1px solid #f5c6c6', borderRadius: 8,
                    padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#c00',
                  }}>
                    {state.error}
                  </div>
                )}

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Nome azienda *</label>
                    <input name="azienda" type="text" required style={inputStyle} placeholder="Azienda Srl" />
                  </div>

                  <div>
                    <label style={labelStyle}>Nome referente *</label>
                    <input name="referente" type="text" required style={inputStyle} placeholder="Mario Rossi" />
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 180px' }}>
                      <label style={labelStyle}>Email *</label>
                      <input name="email" type="email" required style={inputStyle} placeholder="mario@azienda.it" />
                    </div>
                    <div style={{ flex: '1 1 180px' }}>
                      <label style={labelStyle}>Telefono</label>
                      <input name="telefono" type="tel" style={inputStyle} placeholder="+39 091 000000" />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Messaggio</label>
                    <textarea
                      name="messaggio"
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      placeholder="Descrivi brevemente la tua azienda e la proposta di collaborazione..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-green"
                    style={{ padding: '11px 28px', fontSize: 14, fontFamily: 'inherit', marginTop: 4, opacity: pending ? 0.6 : 1 }}
                  >
                    {pending ? 'Invio in corso…' : 'Invia richiesta'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
