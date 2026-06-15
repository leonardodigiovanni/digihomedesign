'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { startAuthentication } from '@simplewebauthn/browser'
import { getWebAuthnAuthOptions, verifyWebAuthnAuth } from './actions'
import FingerprintIcon from './fingerprint-icon'
import FaceIcon from './face-icon'

interface Props {
  onError?: (msg: string) => void
}

export default function WebAuthnLoginBtn({ onError }: Props) {
  const [supported, setSupported] = useState(false)
  const [loading, setLoading]     = useState(false)
  const router = useRouter()

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
      typeof window.PublicKeyCredential !== 'undefined' &&
      Object.keys(localStorage).some(k => k.startsWith('wa_registered_'))
    )
  }, [])

  if (!supported) return null

  async function doAuth() {
    const res = await getWebAuthnAuthOptions()
    if (!res.ok) throw new Error(res.error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authResponse = await startAuthentication({ optionsJSON: res.options as any })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verify = await verifyWebAuthnAuth(authResponse as any, res.challengeKey)
    if (!verify.ok) throw new Error(verify.error)
  }

  async function handleClick() {
    setLoading(true)
    try {
      try {
        await doAuth()
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'NotAllowedError') {
          onError?.('Autenticazione annullata.')
          return
        }
        // Errore transitorio (cold start FIDO2) — riprova silenziosamente
        await doAuth()
      }
      router.push('/app')
      router.refresh()
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'NotAllowedError') {
        onError?.('Autenticazione annullata.')
      } else {
        onError?.(e instanceof Error ? e.message : 'Errore, riprova.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={loading ? 'btn-gray-app' : 'btn-green-app'}
        style={{ gap: 10, color: '#fff', width: '100%' }}
      >
        {loading ? 'Verifica in corso…' : 'Accedi con biometrico'}
        <FingerprintIcon size={26} color="#fff" />
        <FaceIcon size={26} color="#fff" />
      </button>
    </div>
  )
}
