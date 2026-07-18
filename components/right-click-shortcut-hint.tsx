'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useHomeShortcuts } from '@/lib/home-shortcuts-context'
import { nameFromPathname } from '@/lib/page-label'

const COUNTDOWN_S = 5

const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, label, [role="button"], [contenteditable="true"]'

/** true se il doppio click è avvenuto su (o dentro) un elemento cliccabile/interattivo della pagina */
function isOnInteractiveElement(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE_SELECTOR) != null
}

/**
 * Montato globalmente (solo sito, non PWA /app): al doppio click (fuori da
 * elementi già interattivi) mostra un bottone con countdown vicino al punto
 * cliccato — verde "Aggiungi {nome} alla Home Nsec" se la pagina non è
 * ancora una scorciatoia, rosso "Elimina {nome} dalla Home Nsec" se lo è
 * già. Il doppio click non apre nessun menu nativo del browser (a differenza
 * del tasto destro, scartato perché il menu contestuale nativo intercetta il
 * primo click successivo comunque arrivi, rendendo il bottone sottostante
 * non cliccabile). Si nasconde da solo a fine countdown, al click altrove
 * (ma NON se il click è dentro il bottone stesso — altrimenti il bottone
 * sparirebbe al mousedown prima che il click possa registrarsi), premendo
 * Esc, scrollando o cambiando pagina.
 */
export default function RightClickShortcutHint() {
  const pathname = usePathname()
  const { isShortcut, add, remove } = useHomeShortcuts()
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_S)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (pathname === '/') return

    let interval: ReturnType<typeof setInterval> | null = null

    function clearCountdown() {
      if (interval) { clearInterval(interval); interval = null }
    }

    function show(e: MouseEvent) {
      if (isOnInteractiveElement(e.target)) return
      setPos({ x: e.clientX, y: e.clientY })
      setSecondsLeft(COUNTDOWN_S)
      clearCountdown()
      interval = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearCountdown()
            setPos(null)
            return COUNTDOWN_S
          }
          return s - 1
        })
      }, 1000)
    }
    function hide(e?: Event) {
      if (e && btnRef.current && btnRef.current.contains(e.target as Node)) return
      setPos(null)
      clearCountdown()
    }
    function onKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') hide() }

    document.addEventListener('dblclick', show)
    document.addEventListener('mousedown', hide)
    window.addEventListener('scroll', hide, { passive: true, capture: true })
    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearCountdown()
      document.removeEventListener('dblclick', show)
      document.removeEventListener('mousedown', hide)
      window.removeEventListener('scroll', hide, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [pathname])

  // Nasconde al cambio pagina
  useEffect(() => { setPos(null) }, [pathname])

  if (!pos || pathname === '/') return null

  const name = nameFromPathname(pathname)
  const label = `Vai a ${name}`
  const alreadyAdded = isShortcut(pathname)

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => {
        if (alreadyAdded) remove(pathname)
        else add(pathname, label)
        setPos(null)
      }}
      title={alreadyAdded ? `Elimina scorciatoia a "${label}" dalla Homepage` : `Aggiungi scorciatoia a "${label}" nella Homepage`}
      className={alreadyAdded ? 'btn-red fs-12' : 'btn-green fs-12'}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -130%)',
        zIndex: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {alreadyAdded ? `Elimina ${name} dalla Home ${secondsLeft}sec` : `Aggiungi ${name} alla Home ${secondsLeft}sec`}
    </button>
  )
}
