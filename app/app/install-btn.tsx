'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBtn() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    function onBefore(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    function onInstalled() {
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onBefore)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferredPrompt) return null

  return (
    <button
      onClick={async () => {
        await deferredPrompt.prompt()
        setDeferredPrompt(null)
      }}
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 20,
        color: '#fff',
        fontSize: 12,
        padding: '4px 14px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      ⬇ Installa
    </button>
  )
}
