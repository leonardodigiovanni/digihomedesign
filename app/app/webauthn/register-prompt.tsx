'use client'

import { useEffect, useRef, useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import { getWebAuthnRegOptions, verifyWebAuthnReg } from './actions'
import FingerprintIcon from './fingerprint-icon'
import FaceIcon from './face-icon'

interface Props {
  username: string
  hasCredential: boolean
}

export default function WebAuthnRegisterPrompt({ username, hasCredential }: Props) {
  const [supported, setSupported] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
      typeof window.PublicKeyCredential !== 'undefined'
    )
  }, [])

  // Ripristina il flag localStorage dopo una reinstallazione dell'app
  useEffect(() => {
    if (supported && hasCredential) {
      localStorage.setItem('wa_registered_' + username, '1')
    }
  }, [supported, hasCredential, username])

  // Sparisce su qualsiasi interazione fuori dal banner (scroll, tap, click)
  useEffect(() => {
    if (!supported || hasCredential || dismissed || done) return

    function onOutside(e: PointerEvent) {
      if (bannerRef.current && !bannerRef.current.contains(e.target as Node)) {
        setDismissed(true)
      }
    }
    function onScroll() {
      setDismissed(true)
    }

    // Piccolo delay per evitare che il click di login che porta alla home triggeri subito
    const t = setTimeout(() => {
      document.addEventListener('pointerdown', onOutside, { capture: true })
      window.addEventListener('scroll', onScroll, { passive: true })
    }, 300)

    return () => {
      clearTimeout(t)
      document.removeEventListener('pointerdown', onOutside, { capture: true })
      window.removeEventListener('scroll', onScroll)
    }
  }, [supported, hasCredential, dismissed, done])

  if (!supported || hasCredential || dismissed || done) return null

  async function handleRegister() {
    setLoading(true)
    setError(null)
    try {
      const res = await getWebAuthnRegOptions()
      if (!res.ok) { setError(res.error); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const regResponse = await startRegistration({ optionsJSON: res.options as any })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const verify = await verifyWebAuthnReg(regResponse as any, res.challengeKey)
      if (!verify.ok) { setError(verify.error); return }

      localStorage.setItem('wa_registered_' + username, '1')
      setDone(true)
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'NotAllowedError') {
        setError('Operazione annullata.')
      } else {
        setError('Errore durante la registrazione. Riprova.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={bannerRef}
      style={{
        margin: '0 0 12px',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2000 100%)',
        border: '1px solid #c8a96e',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: '#e8d5a0', fontWeight: 700 }}>
        Accedi più velocemente senza digitare la password.
      </p>
      <p style={{ margin: 0, fontSize: 12, color: '#bbb' }}>
        Registra il biometrico del tuo dispositivo.
      </p>
      {error && (
        <p style={{ margin: 0, fontSize: 11, color: '#f5a0a0' }}>{error}</p>
      )}
      <button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        className={loading ? 'btn-gray-app' : 'btn-green-app'}
        style={{ gap: 10, color: '#fff', alignSelf: 'center' }}
      >
        {loading ? 'Attendi…' : '+ Registra accesso biometrico'}
        <FingerprintIcon size={26} color="#fff" />
        <FaceIcon size={26} color="#fff" />
      </button>
    </div>
  )
}
