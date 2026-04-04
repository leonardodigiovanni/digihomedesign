'use client'

import { useEffect, useRef, useState } from 'react'
import { logout, refreshSession } from '@/app/actions'

interface Props {
  inactivityMs: number
  countdownSec: number
}

export default function InactivityGuard({ inactivityMs, countdownSec }: Props) {
  const [countdown, setCountdown] = useState<number | null>(null)

  // Refs per i valori dinamici: le funzioni dentro useEffect le leggono sempre aggiornate
  const inactivityMsRef = useRef(inactivityMs)
  const countdownSecRef = useRef(countdownSec)
  const isWarning       = useRef(false)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout>>()
  const countdownInterval = useRef<ReturnType<typeof setInterval>>()

  // Aggiorna i refs quando cambiano le props e riavvia il timer
  useEffect(() => {
    inactivityMsRef.current  = inactivityMs
    countdownSecRef.current  = countdownSec
    if (!isWarning.current) startInactivityTimer()
  }, [inactivityMs, countdownSec])

  function startInactivityTimer() {
    clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(showWarning, inactivityMsRef.current)
  }

  function showWarning() {
    isWarning.current = true
    let secs = countdownSecRef.current
    setCountdown(secs)
    countdownInterval.current = setInterval(() => {
      secs -= 1
      if (secs <= 0) {
        clearInterval(countdownInterval.current)
        logout()
      } else {
        setCountdown(secs)
      }
    }, 1000)
  }

  function handleActivity() {
    if (isWarning.current) return
    startInactivityTimer()
  }

  async function handleStayConnected() {
    clearInterval(countdownInterval.current)
    isWarning.current = false
    setCountdown(null)
    await refreshSession()
    startInactivityTimer()
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }))
    startInactivityTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      clearTimeout(inactivityTimer.current)
      clearInterval(countdownInterval.current)
    }
  }, [])

  if (countdown === null) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: '36px 44px',
        maxWidth: 380,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#fff3cd',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 16px',
        }}>
          ⏱
        </div>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Sessione in scadenza</h3>
        <p style={{ color: '#555', marginBottom: 24, lineHeight: 1.5 }}>
          Verrai disconnesso per inattività tra{' '}
          <strong style={{
            fontSize: 20,
            color: countdown <= 2 ? '#c00' : '#1a1a1a',
            display: 'inline-block',
            minWidth: 20,
            transition: 'color 0.3s',
          }}>
            {countdown}
          </strong>{' '}
          secondi.
        </p>
        <button
          onClick={handleStayConnected}
          className="btn-green"
          style={{
            padding: '10px 28px', fontSize: 15, borderRadius: 6, width: '100%',
          }}
        >
          Rimani connesso
        </button>
      </div>
    </div>
  )
}
