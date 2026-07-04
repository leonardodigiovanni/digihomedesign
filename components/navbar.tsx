'use client'

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clientPages, visibleAdminPages, visibleInternalPages, visibleFornitoriPages, visibleClientiPages, aiutoPages, categoryGroups, areaClientiPages, type NavPage, type CategoryGroup } from '@/lib/nav-config'
import HeaderAuth from '@/components/header-auth'

interface NavbarProps {
  role: string | null
  disabledPages?: number[]
  rolePermissions?: Record<string, number[]>
  username?: string | null
  registrazioniDisabilitate?: boolean
  bannerAbilitato?: boolean
  cartCount?: number
  cartAcquistiCount?: number
  unreadEmailCount?: number
  unreadAvvisiCount?: number
  clienteAbilitato?: boolean
}

export default function Navbar({ role, disabledPages = [], rolePermissions = {}, username, registrazioniDisabilitate, bannerAbilitato = false, cartCount = 0, cartAcquistiCount = 0, unreadEmailCount = 0, unreadAvvisiCount = 0, clienteAbilitato = true }: NavbarProps) {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [liveAvvisiCount, setLiveAvvisiCount] = useState(unreadAvvisiCount)
  const [computoCount, setComputoCount] = useState(0)

  useEffect(() => {
    try { setComputoCount(parseInt(localStorage.getItem('computo_count') ?? '0', 10) || 0) } catch {}
    function handle(e: Event) { setComputoCount((e as CustomEvent<{ count: number }>).detail.count) }
    window.addEventListener('computo-count-changed', handle)
    return () => window.removeEventListener('computo-count-changed', handle)
  }, [])

  useEffect(() => {
    function handle(e: Event) {
      setLiveAvvisiCount((e as CustomEvent<{ count: number }>).detail.count)
    }
    window.addEventListener('avvisi-count-changed', handle)
    return () => window.removeEventListener('avvisi-count-changed', handle)
  }, [])
  const [sectionOpen, setSectionOpen] = useState(false)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(false)
  const pathname    = usePathname()
  const dropRef     = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)
  const scrollPos   = useRef(0)

  function updateArrows() {
    const container = scrollRef.current
    const inner     = innerRef.current
    if (!container || !inner) return
    const maxScroll = inner.offsetWidth - container.offsetWidth
    setCanLeft(scrollPos.current > 0)
    setCanRight(maxScroll > 0 && scrollPos.current < maxScroll - 1)
  }

  function scrollNav(direction: 'left' | 'right') {
    const container = scrollRef.current
    const inner     = innerRef.current
    if (!container || !inner) return
    const S = scrollPos.current
    const W = container.offsetWidth
    const AW = 42 // freccia quadrata: larghezza = altezza navbar
    const items = Array.from(inner.children) as HTMLElement[]
    const maxScroll = inner.offsetWidth - W
    if (maxScroll <= 0) return

    // Posizione iniziale basata sulla direzione
    let initial: number
    if (direction === 'right') {
      const target = items.find(el => el.offsetLeft + el.offsetWidth > S + W - AW + 1)
      initial = target ? Math.max(0, target.offsetLeft - AW) : maxScroll
    } else {
      initial = 0
    }

    initial = Math.max(0, Math.min(initial, maxScroll))

    // Cleanup solo per destra: la sinistra va sempre a S=0 (inizio esatto)
    let next = initial
    for (let i = 0; i < 6 && direction === 'right'; i++) {
      let adjusted = false
      // Bordo freccia destra: x = W-AW in nav-scroll
      if (next < maxScroll) {
        const rEdge = next + W - AW
        const rs = items.find(el => el.offsetLeft < rEdge && el.offsetLeft + el.offsetWidth > rEdge)
        if (rs) { next = Math.min(maxScroll, rs.offsetLeft - (W - AW)); adjusted = true }
      }
      // Bordo freccia sinistra: x = AW in nav-scroll (solo se freccia sinistra visibile)
      if (next > 0) {
        const lEdge = next + AW
        const ls = items.find(el => el.offsetLeft < lEdge && el.offsetLeft + el.offsetWidth > lEdge)
        if (ls) { next = Math.min(maxScroll, ls.offsetLeft + ls.offsetWidth - AW); adjusted = true }
      }
      if (!adjusted) break
    }

    next = Math.max(0, Math.min(next, maxScroll))
    scrollPos.current = next
    inner.style.marginLeft = `-${next}px`
    updateArrows()
  }

  // Chiudi tutto al cambio pagina e resetta scroll
  useEffect(() => {
    setMenuOpen(false)
    setSectionOpen(false)
    scrollPos.current = 0
    if (innerRef.current) innerRef.current.style.marginLeft = '0'
    updateArrows()
  }, [pathname])

  // Chiudi menu mobile se il browser diventa largo; aggiorna frecce al resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false)
      updateArrows()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Misura overflow iniziale e osserva variazioni di dimensione
  useEffect(() => {
    updateArrows()
    const observer = new ResizeObserver(updateArrows)
    if (scrollRef.current) observer.observe(scrollRef.current)
    if (innerRef.current)  observer.observe(innerRef.current)
    return () => observer.disconnect()
  }, [])

  // Chiudi dropdown desktop cliccando fuori
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setSectionOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const brandDropRef = useDropdownAlign(sectionOpen)

  const adminItems         = visibleAdminPages(role)
  const internalItems      = visibleInternalPages(role, rolePermissions).filter(p => !disabledPages.includes(p.id))
  const visibleClientPages = clientPages.filter(p => !disabledPages.includes(p.id))
  const fornitoriItems     = visibleFornitoriPages(role, rolePermissions, disabledPages)
  const clientiItems       = visibleClientiPages(role, rolePermissions, disabledPages)

  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviAbilitato     = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
  const computometricoAbilitato = !!username && (isStaff || (rolePermissions['cliente'] ?? []).includes(54))

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkStyle = (href: string): React.CSSProperties => ({
    padding: '0 12px',
    height: 46,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    textDecoration: isActive(href) ? 'underline' : 'none',
    textDecorationThickness: isActive(href) ? '3px' : undefined,
    textUnderlineOffset: isActive(href) ? '4px' : undefined,
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'monospace',
  })

  return (
    <nav className="class_gold_D_safe" style={{ borderBottom: '1px solid #c8960c', flexShrink: 0 }}>

      {/* ── Desktop ── */}
      <div className="nav-bar">
        {/* Area scrollabile — le frecce sono dentro, in position:absolute, coprono gli item parziali */}
        <div className="nav-scroll" ref={scrollRef}>
        {canLeft && (
          <button className="nav-arrow-btn nav-arrow-btn-left" onClick={() => scrollNav('left')} aria-label="Scorri sinistra">
            <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M14 0 L8 6 L14 12 Z M6 0 L0 6 L6 12 Z"/></svg>
          </button>
        )}
        <div className="nav-scroll-inner" ref={innerRef}>
          <Link href="/" className="nav-link testo-nav-bar" style={{ ...linkStyle('/'), display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 2, marginLeft: 8, position: 'relative' }} aria-label="Home">
            <img src="/images/header/home.png" alt="Home" style={{ height: 34, width: 34, display: 'block', objectFit: 'contain', marginTop: -10 }} />
            <span style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'block', width: 30, height: 3, background: isActive('/') ? '#111' : 'transparent' }} />
          </Link>

          {visibleClientPages.length > 0 && (
            <><NavSep />
            <div ref={dropRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setSectionOpen(o => !o)}
                className="nav-link testo-nav-bar"
                style={{ ...linkStyle('/brand'), gap: 4 }}
              >
                Brand {sectionOpen ? '▴' : '▾'}
              </button>

              {sectionOpen && (
                <div ref={brandDropRef} style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fdfcf8',
                  border: '1px solid #c8960c',
                  borderRadius: 6,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  zIndex: 200,
                  width: 'max-content',
                  minWidth: 200,
                }}>
                  {visibleClientPages.map(p => (
                    <Link
                      key={p.id}
                      href={p.href}
                      className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                      style={{ padding: '7px 10px' }}
                    >
                      <span>{p.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            </>
          )}

          {categoryGroups.map(g => {
            const visiblePages = g.pages.filter(p => !disabledPages.includes(p.id))
            if (visiblePages.length === 0) return null
            return (
              <React.Fragment key={g.id}>
                <NavSep />
                <CategoryDropdown group={{ ...g, pages: visiblePages }} isActive={isActive} linkStyle={linkStyle} />
              </React.Fragment>
            )
          })}

          {role === 'cliente' && (() => {
            const allowed = rolePermissions['cliente']
            const allItems = areaClientiPages.filter(p =>
              !disabledPages.includes(p.id) &&
              (allowed === undefined || allowed.includes(p.id))
            )
            const items = clienteAbilitato ? allItems : allItems.filter(p => p.id === 52 || p.id === 54)
            return items.length > 0 ? <><NavSep /><AreaClientiDropdown items={items} isActive={isActive} linkStyle={linkStyle} unreadAvvisiCount={liveAvvisiCount} /></> : null
          })()}

          {aiutoPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <><NavSep /><AiutoDropdown items={aiutoPages.filter(p => !disabledPages.includes(p.id))} isActive={isActive} linkStyle={linkStyle} /></>
          )}

          {fornitoriItems.length > 0 && (
            <><NavSep /><FornitoriDropdown items={fornitoriItems} isActive={isActive} linkStyle={linkStyle} /></>
          )}

          {clientiItems.length > 0 && (
            <><NavSep /><ClientiDropdown items={clientiItems} isActive={isActive} linkStyle={linkStyle} /></>
          )}

          {internalItems.length > 0 && (
            <><NavSep /><InternalDropdown items={internalItems} isActive={isActive} linkStyle={linkStyle} unreadEmailCount={unreadEmailCount} /></>
          )}

          {adminItems.length > 0 && (
            <><NavSep /><AdminDropdown items={adminItems} isActive={isActive} linkStyle={linkStyle} /></>
          )}
        </div>{/* fine nav-scroll-inner */}
        {canRight && (
          <button className="nav-arrow-btn nav-arrow-btn-right" onClick={() => scrollNav('right')} aria-label="Scorri destra">
            <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M0 0 L6 6 L0 12 Z M8 0 L14 6 L8 12 Z"/></svg>
          </button>
        )}
        </div>{/* fine nav-scroll */}

        {/* Icone carrello — sempre visibili, non scorrono */}
        {(cartCount > 0 || cartAcquistiCount > 0 || computoCount > 0 || !!username) && (
        <div style={{ flexShrink: 0, paddingRight: 4, paddingLeft: 8, borderLeft: '1px solid #e8d89a', display: 'flex', alignItems: 'center', gap: 8 }}>
          {computoCount > 0 && computometricoAbilitato && (
          <Link
            href="/area-clienti/carrello-computometrico"
            title="Computo metrico"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-computometrici.png" alt="Computo metrico" style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            {computoCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 1,
                background: '#1a9e2a', color: '#fff', borderRadius: '50%',
                minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {computoCount > 99 ? '99+' : computoCount}
              </span>
            )}
          </Link>
          )}
          {cartCount > 0 && preventiviAbilitato && (
          <Link
            href="/area-clienti/carrello-preventivo"
            title="Carrello preventivo"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-preventivo-t.png" alt="Carrello preventivo" style={{ height: 36, width: 36, display: 'block', objectFit: 'contain' }} />
            <span style={{
              position: 'absolute', top: 4, right: 1,
              background: '#2b8fcf', color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>
          )}
          {cartAcquistiCount > 0 && (
          <Link
            href="/area-clienti/carrello-acquisti"
            title="Carrello acquisti"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-acquisti.png" alt="Carrello acquisti" style={{ height: 46, width: 46, display: 'block', objectFit: 'contain' }} />
            <span className="fs-9" style={{
              position: 'absolute', top: 4, right: 1,
              background: '#e65100', color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartAcquistiCount > 99 ? '99+' : cartAcquistiCount}
            </span>
          </Link>
          )}
        </div>
        )}
      </div>

      {/* ── Mobile bar: hamburger + auth ── */}
      <div className="nav-mobile-bar">
        <button
          type="button"
          className="nav-hamburger testo-nav-bar"
          onClick={() => setMenuOpen(o => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
          style={{ position: 'relative' }}
        >
          <span className="fs-18" style={{ width: 20, display: 'inline-block', textAlign: 'center' }}>{menuOpen ? '✕' : '☰'}</span>
          Menu
          {!menuOpen && (unreadEmailCount > 0 || liveAvvisiCount > 0) && (
            <span style={{ position: 'absolute', top: 4, right: 4, background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
              {Math.min(99, unreadEmailCount + liveAvvisiCount)}
            </span>
          )}
        </button>
        <div style={{ marginLeft: 'auto', paddingRight: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          {computoCount > 0 && computometricoAbilitato && (
          <Link
            href="/area-clienti/carrello-computometrico"
            title="Computo metrico"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-computometrici.png" alt="Computo metrico" style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            {computoCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 1,
                background: '#1a9e2a', color: '#fff', borderRadius: '50%',
                minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {computoCount > 99 ? '99+' : computoCount}
              </span>
            )}
          </Link>
          )}
          {cartCount > 0 && preventiviAbilitato && (
          <Link
            href="/area-clienti/carrello-preventivo"
            title="Carrello preventivo"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-preventivo-t.png" alt="Carrello preventivo" style={{ height: 36, width: 36, display: 'block', objectFit: 'contain' }} />
            <span style={{
              position: 'absolute', top: 4, right: 0,
              background: '#2b8fcf', color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>
          )}
          {cartAcquistiCount > 0 && (
          <Link
            href="/area-clienti/carrello-acquisti"
            title="Carrello acquisti"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <img src="/images/carrello/carrello-acquisti.png" alt="Carrello acquisti" style={{ height: 46, width: 46, display: 'block', objectFit: 'contain' }} />
            <span style={{
              position: 'absolute', top: 4, right: 0,
              background: '#e65100', color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartAcquistiCount > 99 ? '99+' : cartAcquistiCount}
            </span>
          </Link>
          )}
        </div>
      </div>

      {/* ── Mobile menu ── incollato sotto la nav-mobile-bar, dentro il contenitore sticky */}
      {menuOpen && (
      <div
        style={{
          background: '#fdfcf8',
          borderTop: '1px solid #c8960c',
          padding: '6px 0 16px',
          overflowY: 'auto',
          maxHeight: `calc(100dvh - ${90 + (bannerAbilitato ? 42 : 0) + 42}px)`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
          <MobileLink href="/" label="Home" active={isActive('/')} indent />

          {visibleClientPages.length > 0 && (
            <>
              <div className="nav-mobile-section">Brand</div>
              {visibleClientPages.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {categoryGroups.map(g => {
            const visiblePages = g.pages.filter(p => !disabledPages.includes(p.id))
            if (visiblePages.length === 0) return null
            return (
              <React.Fragment key={g.id}>
                <div className="nav-mobile-section">{g.label}</div>
                {visiblePages.map(p => (
                  <MobileLink key={p.href} href={p.href} label={p.label} active={isActive(p.href)} indent />
                ))}
              </React.Fragment>
            )
          })}

          {role === 'cliente' && (() => {
            const allowed = rolePermissions['cliente']
            const allItems = areaClientiPages.filter(p =>
              !disabledPages.includes(p.id) &&
              (allowed === undefined || allowed.includes(p.id))
            )
            const items = clienteAbilitato ? allItems : allItems.filter(p => p.id === 52 || p.id === 54)
            return items.length > 0 ? (
              <>
                <div className="nav-mobile-section">Area Personale</div>
                {items.map(p => (
                  <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent
                    badge={p.href === '/area-clienti/avvisi' ? liveAvvisiCount : 0} />
                ))}
              </>
            ) : null
          })()}

          {aiutoPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <>
              <div className="nav-mobile-section">Aiuto</div>
              {aiutoPages.filter(p => !disabledPages.includes(p.id)).map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {fornitoriItems.length > 0 && (
            <>
              <div className="nav-mobile-section">Area Fornitori</div>
              {fornitoriItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {clientiItems.length > 0 && (
            <>
              <div className="nav-mobile-section">Area Clienti</div>
              {clientiItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {internalItems.length > 0 && (
            <>
              <div className="nav-mobile-section">Area Lavoro</div>
              {internalItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent
                  badge={p.href === '/area-lavoro/email' ? unreadEmailCount : 0} />
              ))}
            </>
          )}

          {adminItems.length > 0 && (
            <>
              <div className="nav-mobile-section">Amministrazione</div>
              {adminItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}
      </div>
      )}
    </nav>
  )
}

function useDropdownAlign(open: boolean): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !open) return

    const trigger = el.parentElement
    if (!trigger) return
    const tRect = trigger.getBoundingClientRect()

    // fixed sfugge a overflow-x:clip su nav-scroll
    el.style.position = 'fixed'
    el.style.top = `${tRect.bottom}px`
    el.style.maxWidth = `${window.innerWidth - 16}px`
    el.style.overflowX = 'auto'

    // centra sotto il trigger
    el.style.left = `${tRect.left + tRect.width / 2}px`
    el.style.right = 'auto'
    el.style.transform = 'translateX(-50%)'

    // aggiusta se esce dal viewport
    const eRect = el.getBoundingClientRect()
    if (eRect.right > window.innerWidth - 8) {
      el.style.left = 'auto'
      el.style.right = '8px'
      el.style.transform = 'none'
    } else if (eRect.left < 8) {
      el.style.left = '8px'
      el.style.right = 'auto'
      el.style.transform = 'none'
    }
  }, [open])
  return ref as React.RefObject<HTMLDivElement>
}

function NavSep() {
  return <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.22)', flexShrink: 0, alignSelf: 'center', margin: '0 2px' }} />
}

function InternalDropdown({
  items,
  isActive,
  linkStyle,
  unreadEmailCount = 0,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  unreadEmailCount?: number
}) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(unreadEmailCount)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)
  const audio = useRef<HTMLAudioElement | null>(null)
  const unreadRef = useRef(unreadEmailCount)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    audio.current = new Audio('/sounds/horse.mp3')
    audio.current.preload = 'auto'
  }, [])

  useEffect(() => { setUnread(unreadEmailCount) }, [unreadEmailCount])

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/email/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        setUnread(prev => {
          if (data.count > prev) audio.current?.play().catch(() => {})
          return data.count
        })
        if (data.count > unreadRef.current && pathname === '/area-lavoro/email') router.refresh()
        unreadRef.current = data.count
      } catch {}
    }
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/area-lavoro'), gap: 4, textDecoration: 'none' }}>
        <span className={anyActive ? 'nav-trigger-underline' : undefined}>Area Lavoro</span> {open ? '▴' : '▾'}
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 320,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>{p.label}</span>
              {p.href === '/area-lavoro/email' && unread > 0 && (
                <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AiutoDropdown({
  items,
  isActive,
  linkStyle,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/aiuto'), gap: 4, textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Aiuto {open ? '▴' : '▾'}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminDropdown({
  items,
  isActive,
  linkStyle,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/amministrazione'), gap: 4, textDecoration: 'none' }}>
        <span className={anyActive ? 'nav-trigger-underline' : undefined}>Amministrazione</span> {open ? '▴' : '▾'}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 200,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryDropdown({
  group,
  isActive,
  linkStyle,
}: {
  group: CategoryGroup
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setIsMounted(true) }, [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !dropRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const el = dropRef.current
    el.style.top = `${tr.bottom}px`
    el.style.left = `${tr.left + tr.width / 2}px`
    el.style.right = 'auto'
    el.style.transform = 'translateX(-50%)'
    const er = el.getBoundingClientRect()
    if (er.right > window.innerWidth - 8) {
      el.style.left = 'auto'
      el.style.right = '8px'
      el.style.transform = 'none'
    } else if (er.left < 8) {
      el.style.left = '8px'
      el.style.right = 'auto'
      el.style.transform = 'none'
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !dropRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const anyActive = isActive(group.href)

  return (
    <div ref={triggerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => { router.push(group.href); setOpen(true) }}
        className="nav-link testo-nav-bar"
        style={{
          ...linkStyle(group.href),
          gap: 4,
          textDecoration: anyActive ? 'underline' : 'none',
          textDecorationThickness: anyActive ? '3px' : undefined,
          textUnderlineOffset: anyActive ? '4px' : undefined,
        }}
      >
        {group.label} {open ? '▴' : '▾'}
      </button>
      {isMounted && open && createPortal(
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fdfcf8',
            border: '1px solid #c8960c',
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 9000,
            overflowX: 'auto',
            maxWidth: 'calc(100vw - 16px)',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(6, auto)',
            gridAutoFlow: 'column',
            gridAutoColumns: 'max-content',
            gap: 0,
            padding: 4,
            width: 'max-content',
            minWidth: group.id === 'edilizia' ? 320 : 180,
          }}>
            {group.pages.map(p => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                style={{ padding: '7px 10px' }}
              >
                <span>{p.label}</span>
              </Link>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function FornitoriDropdown({
  items,
  isActive,
  linkStyle,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/area-fornitori'), gap: 4, textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Fornitori {open ? '▴' : '▾'}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 200,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function ClientiDropdown({
  items,
  isActive,
  linkStyle,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/clienti'), gap: 4, textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Clienti {open ? '▴' : '▾'}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 180,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AreaClientiDropdown({
  items,
  isActive,
  linkStyle,
  unreadAvvisiCount = 0,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  unreadAvvisiCount?: number
}) {
  const [open, setOpen]       = useState(false)
  const [unread, setUnread]   = useState(unreadAvvisiCount)
  const ref       = useRef<HTMLDivElement>(null)
  const alignRef  = useDropdownAlign(open)
  const router    = useRouter()
  const pathname  = usePathname()
  const unreadRef = useRef(unreadAvvisiCount)

  useEffect(() => { setUnread(unreadAvvisiCount) }, [unreadAvvisiCount])

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/avvisi/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        setUnread(data.count)
        if (data.count > unreadRef.current && pathname === '/area-clienti/avvisi') router.refresh()
        unreadRef.current = data.count
      } catch {}
    }
    function handleEvent(e: Event) {
      const count = (e as CustomEvent<{ count: number }>).detail.count
      setUnread(count)
      unreadRef.current = count
    }
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    window.addEventListener('avvisi-count-changed', handleEvent)
    return () => { clearInterval(id); window.removeEventListener('avvisi-count-changed', handleEvent) }
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/area-clienti'), gap: 4, color: '#000', textDecoration: 'none' }}>
        <span style={{ textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
          Area Personale {open ? '▴' : '▾'}
        </span>
        {!open && unread > 0 && (
          <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 180,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>{p.label}</span>
              {p.href === '/area-clienti/avvisi' && open && unread > 0 && (
                <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileLink({ href, label, active, indent, badge = 0 }: { href: string; label: string; active: boolean; indent?: boolean; badge?: number }) {
  return (
    <Link
      href={href}
      className={active ? 'nav-mobile-link nav-mobile-link-active' : 'nav-mobile-link'}
      style={{ padding: `10px ${indent ? 28 : 16}px`, display: 'flex', alignItems: 'center', gap: 6 }}
    >
      <span>{label}</span>
      {badge > 0 && (
        <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

