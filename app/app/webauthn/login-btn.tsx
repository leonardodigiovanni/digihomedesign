'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { startAuthentication } from '@simplewebauthn/browser'
import { getWebAuthnAuthOptions, verifyWebAuthnAuth } from './actions'
import FingerprintIcon from './fingerprint-icon'
import FaceIcon from './face-icon'

export default function WebAuthnLoginBtn() {
  const [supported, setSupported] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
      typeof window.PublicKeyCredential !== 'undefined' &&
      localStorage.getItem('wa_registered') === '1'
    )
  }, [])

  if (!supported) return null

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await getWebAuthnAuthOptions()
      if (!res.ok) { setError(res.error); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const authResponse = await startAuthentication({ optionsJSON: res.options as any })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const verify = await verifyWebAuthnAuth(authResponse as any, res.challengeKey)
      if (!verify.ok) { setError(verify.error); return }

      router.push('/app')
      router.refresh()
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'NotAllowedError') {
        setError('Autenticazione annullata.')
      } else {
        setError('Impronta non riconosciuta o non registrata.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      {error && (
        <p style={{ fontSize: 12, color: '#c00', textAlign: 'center', marginBottom: 8, fontFamily: 'monospace' }}>
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={loading ? 'btn-gray-app' : 'btn-green-app'}
        style={{ gap: 10, color: '#fff', alignSelf: 'center' }}
      >
        {loading ? 'Verifica in corso…' : 'Accedi con biometrico'}
        <FingerprintIcon size={26} color="#fff" />
        <FaceIcon size={26} color="#fff" />
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: '#aaa', fontFamily: 'monospace', marginTop: 6 }}>
        Usa il biometrico del tuo dispositivo
      </p>
    </div>
  )
}
