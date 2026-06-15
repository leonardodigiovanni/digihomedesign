'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[2]) : null
}

function setYearCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getCookie('cookie_consent')) setVisible(true)
    const handle = () => setVisible(true)
    window.addEventListener('open-cookie-banner', handle)
    return () => window.removeEventListener('open-cookie-banner', handle)
  }, [])

  function acceptAll() {
    setYearCookie('cookie_consent', 'all')
    setYearCookie('_digi_analytics', '1')
    setVisible(false)
  }

  function acceptTechnical() {
    setYearCookie('cookie_consent', 'technical')
    deleteCookie('_digi_analytics')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#1a1a1a',
      borderTop: '2px solid #c8960c',
      padding: '16px 20px',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
    }}>
      <p style={{
        flex: '1 1 260px', margin: 0,
        fontSize: 12, fontFamily: 'monospace', color: '#ccc', lineHeight: 1.6,
      }}>
        I cookie tecnici sono sempre attivi perché necessari al funzionamento del sito (login, carrello, sessione). Con il tuo consenso attiviamo anche cookie analitici per migliorare l&apos;esperienza. &ldquo;Rifiuta tutto&rdquo; disattiva solo quelli opzionali.{' '}
        <Link href="/privacy-policy" style={{ color: '#c8960c', textDecoration: 'underline' }}>
          Scopri di più
        </Link>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button
          onClick={acceptAll}
          className="btn-orange"
          style={{ fontSize: 12, fontFamily: 'monospace', padding: '0 16px', height: 34 }}
        >
          Accetta tutto
        </button>
        <button
          onClick={acceptTechnical}
          className="btn-gray"
          style={{ fontSize: 12, fontFamily: 'monospace', padding: '0 16px', height: 34 }}
        >
          Solo tecnici
        </button>
        <button
          onClick={acceptTechnical}
          style={{
            fontSize: 11, fontFamily: 'monospace', color: '#888',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', padding: '0 4px',
          }}
        >
          Rifiuta tutto
        </button>
      </div>
    </div>
  )
}
