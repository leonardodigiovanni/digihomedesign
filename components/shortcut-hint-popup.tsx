'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useHomeShortcuts } from '@/lib/home-shortcuts-context'
import { nameFromPathname, labelFromPathname } from '@/lib/page-label'

const DWELL_MS = 2 * 60 * 1000
const COUNTDOWN_S = 15
const SESSION_KEY = 'shortcut_hint_shown_session'
const FOREVER_KEY = 'shortcut_hint_dismissed_forever'

/**
 * Solo per utenti loggati (solo sito, non PWA /app): se l'utente resta su
 * una pagina (diversa dalla home, non ancora una scorciatoia) per almeno 2
 * minuti continuativi, mostra un popup che spiega la funzione scorciatoie e
 * insegna il gesto del doppio click. Compare al massimo una volta per
 * sessione di navigazione (sessionStorage), a meno che l'utente scelga
 * "Non mostrare mai più" (localStorage, permanente).
 */
export default function ShortcutHintPopup({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname()
  const { isShortcut, add } = useHomeShortcuts()
  const [visible, setVisible] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_S)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setVisible(false)
    if (!loggedIn || pathname === '/' || isShortcut(pathname)) return
    if (sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(FOREVER_KEY)) return

    const timeout = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1')
      setSecondsLeft(COUNTDOWN_S)
      setVisible(true)
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setVisible(false)
            return COUNTDOWN_S
          }
          return s - 1
        })
      }, 1000)
    }, DWELL_MS)

    return () => {
      clearTimeout(timeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, loggedIn])

  if (!visible) return null

  function close() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisible(false)
  }

  const name = nameFromPathname(pathname)

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', border: '2px solid #c8960c', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16,
          minWidth: 280, maxWidth: 380, width: '90%', textAlign: 'center',
        }}
      >
        <p className="fs-14" style={{ margin: 0, color: '#222', lineHeight: 1.6 }}>
          Sei interessato a <strong>{name}</strong>?<br />
          Vuoi aggiungere una scorciatoia nella Homepage?
        </p>

        <button
          type="button"
          onClick={() => { add(pathname, labelFromPathname(pathname)); close() }}
          className="btn-green fs-12"
          style={{ height: 42, borderRadius: 21, padding: '0 20px' }}
        >
          Aggiungi {name} alla Home {secondsLeft}sec
        </button>

        <p className="fs-12" style={{ margin: 0, color: '#666', lineHeight: 1.5 }}>
          Puoi aggiungere scorciatoie di ogni pagina preferita facendo doppio click.
        </p>

        <button
          type="button"
          onClick={() => { localStorage.setItem(FOREVER_KEY, '1'); close() }}
          className="fs-11"
          style={{ background: 'none', border: 'none', color: '#999', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
        >
          Non mostrare mai più
        </button>
      </div>
    </div>
  )
}
