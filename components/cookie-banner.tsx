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

function Toggle({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  const W = 68, H = 28, THUMB = 22
  return (
    <div style={{
      position: 'relative', width: W, height: H,
      borderRadius: H / 2,
      background: checked ? '#1e5c1e' : '#3a3a3a',
      opacity: disabled ? 0.55 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      <span style={{
        position: 'absolute', left: 8, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
        color: checked ? '#7dda7d' : 'transparent',
        transition: 'color 0.2s',
      }}>SI</span>
      <span style={{
        position: 'absolute', right: 8, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
        color: checked ? 'transparent' : '#aaaaaa',
        transition: 'color 0.2s',
      }}>NO</span>
      <div style={{
        position: 'absolute',
        width: THUMB, height: THUMB,
        borderRadius: '50%',
        background: '#fff',
        top: (H - THUMB) / 2,
        left: checked ? W - THUMB - 3 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }} />
    </div>
  )
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)

  useEffect(() => {
    if (!getCookie('cookie_consent')) setVisible(true)
    const handle = () => setVisible(true)
    window.addEventListener('open-cookie-banner', handle)
    return () => window.removeEventListener('open-cookie-banner', handle)
  }, [])

  function acceptAll() {
    setYearCookie('cookie_consent', 'all')
    setYearCookie('_digi_analytics', '1')
    setYearCookie('_digi_marketing', '1')
    setVisible(false)
    setShowPrefs(false)
  }

  function rejectAll() {
    setYearCookie('cookie_consent', 'technical')
    deleteCookie('_digi_analytics')
    deleteCookie('_digi_marketing')
    setVisible(false)
    setShowPrefs(false)
  }

  function savePrefs() {
    setYearCookie('cookie_consent', 'technical')
    deleteCookie('_digi_analytics')
    deleteCookie('_digi_marketing')
    setVisible(false)
    setShowPrefs(false)
  }

  if (!visible) return null

  const btnStyle: React.CSSProperties = {
    fontSize: 12, padding: '0 16px', height: 34,
    flex: 1, minWidth: 110,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 14,
    marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #2a2a2a',
  }

  return (
    <>
      {showPrefs && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000,
          background: '#111',
          borderTop: '2px solid #c8960c',
          padding: '20px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: '#c8960c', fontWeight: 700 }}>
            Gestisci preferenze cookie
          </p>

          {/* Cookie Tecnici */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 12, color: '#eee', fontWeight: 700 }}>
                Cookie Tecnici
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                Necessari al funzionamento del sito: login, carrello, sessione. Non possono essere disattivati.
              </p>
            </div>
            <Toggle checked={true} disabled={true} />
          </div>

          {/* Cookie Analitici */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 12, color: '#eee', fontWeight: 700 }}>
                Cookie Analitici
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#555', lineHeight: 1.6 }}>
                Questo sito non utilizza attualmente cookie analitici di terze parti.
              </p>
            </div>
            <Toggle checked={false} disabled={true} />
          </div>

          {/* Cookie Profilazione */}
          <div style={{ ...rowStyle, borderBottom: 'none', marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 12, color: '#eee', fontWeight: 700 }}>
                Cookie di Profilazione e Marketing
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#555', lineHeight: 1.6 }}>
                Questo sito non utilizza attualmente cookie di profilazione o marketing.
              </p>
            </div>
            <Toggle checked={false} disabled={true} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button onClick={savePrefs} className="btn-gray" style={{ ...btnStyle, flex: 1, minWidth: 130 }}>
              Salva preferenze
            </button>
            <button onClick={acceptAll} className="btn-orange" style={{ ...btnStyle, flex: 1, minWidth: 130 }}>
              Accetta tutto
            </button>
          </div>
        </div>
      )}

      {!showPrefs && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: '#1a1a1a',
          borderTop: '2px solid #c8960c',
          padding: '16px 20px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
        }}>
          <p style={{
            flex: '1 1 260px', margin: 0,
            fontSize: 12, color: '#ccc', lineHeight: 1.6,
          }}>
            Usiamo cookie tecnici essenziali per il funzionamento del sito (login, carrello, sessione). Con il tuo consenso possiamo attivare anche cookie analitici e di marketing.{' '}
            <Link href="/privacy-policy" style={{ color: '#c8960c', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={acceptAll} className="btn-orange" style={btnStyle}>
              Accetta tutto
            </button>
            <button onClick={rejectAll} className="btn-orange" style={btnStyle}>
              Rifiuta tutto
            </button>
            <button onClick={() => setShowPrefs(true)} className="btn-gray" style={btnStyle}>
              Gestisci preferenze
            </button>
          </div>
        </div>
      )}
    </>
  )
}
