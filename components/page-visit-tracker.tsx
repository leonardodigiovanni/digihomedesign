'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const HEARTBEAT_MS = 30_000
const SEEN_KEY = 'pv_seen'
// Stessi eventi di inactivity-guard.tsx: definiscono cosa conta come "utente attivo".
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'touchmove', 'pointerdown', 'pointermove', 'click', 'scroll']

function send(href: string, event: 'visit' | 'dwell', minutes?: number) {
  const body = JSON.stringify({ href, event, minutes })
  if (typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon('/api/track-visit', new Blob([body], { type: 'application/json' }))
  } else {
    fetch('/api/track-visit', { method: 'POST', body, keepalive: true }).catch(() => {})
  }
}

function hasSeenThisSession(href: string): boolean {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY)
    const seen: string[] = raw ? JSON.parse(raw) : []
    return seen.includes(href)
  } catch {
    return false
  }
}

function markSeenThisSession(href: string) {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY)
    const seen: string[] = raw ? JSON.parse(raw) : []
    if (!seen.includes(href)) sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, href]))
  } catch {}
}

/**
 * Traccia visite (dedup per sessione via sessionStorage — la stessa pagina
 * rivisitata nella stessa "uscita" non conta una seconda volta) e minuti di
 * permanenza attiva (solo se c'è stata interazione utente nella finestra di
 * tempo misurata — niente conteggio se l'utente si addormenta con la pagina
 * aperta). Montato una volta sola nel layout, per tutti gli utenti.
 */
export default function PageVisitTracker() {
  const pathname = usePathname()
  const lastActivityRef = useRef(0)

  useEffect(() => {
    const handleActivity = () => { lastActivityRef.current = Date.now() }
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true, capture: true }))
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity, { capture: true }))
  }, [])

  useEffect(() => {
    const href = pathname
    const lastFlushRef = { current: Date.now() }
    lastActivityRef.current = Date.now() // il cambio pagina stesso conta come attività

    if (!hasSeenThisSession(href)) {
      markSeenThisSession(href)
      send(href, 'visit')
    }

    function flush(now: number) {
      const elapsedMs = now - lastFlushRef.current
      if (elapsedMs <= 0) return
      const wasActive = lastActivityRef.current >= lastFlushRef.current
      lastFlushRef.current = now
      if (wasActive) send(href, 'dwell', elapsedMs / 60_000)
    }

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') flush(Date.now())
    }, HEARTBEAT_MS)

    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        flush(Date.now())
      } else {
        // Il tempo passato in background non deve contare né come attivo né come inattivo misurato: si riparte da qui.
        lastFlushRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    function handlePageHide() { flush(Date.now()) }
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      flush(Date.now()) // si sta lasciando questa pagina: manda il residuo non ancora inviato
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [pathname])

  return null
}
