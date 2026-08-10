'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

type Result = { label: string; href: string; count: number }
type Coords = { top: number; left: number; width: number; maxHeight: number }

type Ctx = {
  open: boolean
  toggle: () => void
  close: () => void
  registerAnchor: (el: HTMLElement | null) => void
}

const SiteSearchCtx = createContext<Ctx | null>(null)

export function useSiteSearchAnchor() {
  const ctx = useContext(SiteSearchCtx)
  if (!ctx) throw new Error('useSiteSearchAnchor va usato dentro <SiteSearchProvider>')
  return ctx
}

export default function SiteSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [visibleCount, setVisibleCount] = useState(10)
  const [coords, setCoords] = useState<Coords | null>(null)
  const [mounted, setMounted] = useState(false)

  // più lenti possono registrarsi (header + nav mobile): il pannello si aggancia
  // a quella attualmente visibile (le altre hanno display:none -> rect a zero)
  const anchorsRef = useRef<Set<HTMLElement>>(new Set())
  const registerAnchor = useCallback((el: HTMLElement | null) => {
    if (el) anchorsRef.current.add(el)
  }, [])

  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const close = useCallback(() => { setOpen(false); setQuery(''); setResults([]) }, [])
  const toggle = useCallback(() => setOpen(v => !v), [])

  const findVisibleAnchor = useCallback((): HTMLElement | null => {
    for (const el of anchorsRef.current) {
      const r = el.getBoundingClientRect()
      if (r.width > 0 || r.height > 0) return el
    }
    return null
  }, [])

  // riposiziona il pannello sull'ancora attualmente visibile: si ricalcola
  // all'apertura, a resize/scroll (anche quando l'ancora visibile cambia per
  // via di un breakpoint header<->nav mobile) e mentre è aperto
  useEffect(() => {
    if (!open) return
    const update = () => {
      const anchor = findVisibleAnchor()
      if (!anchor) return // nessuna lente visibile in questo momento: lascia l'ultima posizione nota
      const r = anchor.getBoundingClientRect()
      const margin = 8
      const width = 260
      let left = r.left - margin - width
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
      const spaceBelow = window.innerHeight - r.top - margin * 2
      const spaceAbove = r.bottom - margin * 2
      const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow
      const top = openUpward ? margin : r.top
      const maxHeight = Math.max(120, openUpward ? spaceAbove : spaceBelow)
      setCoords({ top, left, width, maxHeight })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, findVisibleAnchor])

  // chiudi al click fuori (dentro o fuori dal portal, e fuori da qualunque ancora)
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      for (const el of anchorsRef.current) {
        if (el.contains(target)) return
      }
      setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    setVisibleCount(10)
    if (!query.trim()) { setResults([]); return }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then(r => r.json())
        .then(data => setResults(data.results ?? []))
        .catch(() => setResults([]))
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  const goTo = (href: string) => {
    close()
    router.push(href)
  }

  return (
    <SiteSearchCtx.Provider value={{ open, toggle, close, registerAnchor }}>
      {children}
      {open && mounted && coords && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: coords.width, zIndex: 9999, maxHeight: coords.maxHeight, display: 'flex', flexDirection: 'column' }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') close()
              if (e.key === 'Enter' && results[0]) goTo(results[0].href)
            }}
            placeholder="Cerca nel sito..."
            style={{
              width: '100%', boxSizing: 'border-box', padding: '8px 12px', flexShrink: 0,
              fontSize: 13, border: '1px solid #c8960c', borderRadius: 6,
              background: '#fff', color: '#000',
            }}
          />
          {results.length > 0 && (
            <div style={{
              marginTop: 4, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              maxHeight: coords.maxHeight - 46, overflowY: 'auto',
            }}>
              {results.slice(0, visibleCount).map(r => (
                <button
                  key={r.href}
                  type="button"
                  onClick={() => goTo(r.href)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                    fontSize: 13, color: '#222', background: 'none', border: 'none',
                    borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                  }}
                >
                  {r.label} <span style={{ color: '#999' }}>({r.count})</span>
                </button>
              ))}
              {results.length > visibleCount && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(v => v + 10)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center', padding: '8px 12px',
                    fontSize: 12, fontWeight: 700, color: '#c8960c', background: '#fafafa', border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Mostra altri 10 ({results.length - visibleCount} rimanenti)
                </button>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </SiteSearchCtx.Provider>
  )
}
