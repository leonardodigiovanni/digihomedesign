'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clientPages, visibleAdminPages, visibleInternalPages, visibleFornitoriPages, visibleClientiPages, aiutoPages, categoryGroups, areaClientiPages, type NavPage, type CategoryGroup } from '@/lib/nav-config'
import HeaderAuth from '@/components/header-auth'

interface NavbarProps {
  role: string | null
  disabledPages?: number[]
  rolePermissions?: Record<string, number[]>
  username?: string | null
  registrazioniDisabilitate?: boolean
  bannerAbilitato?: boolean
}

export default function Navbar({ role, disabledPages = [], rolePermissions = {}, username, registrazioniDisabilitate, bannerAbilitato = false }: NavbarProps) {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [sectionOpen, setSectionOpen] = useState(false)
  const pathname    = usePathname()
  const dropRef     = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)
  const scrollPos   = useRef(0)

  // Chiudi tutto al cambio pagina
  useEffect(() => {
    setMenuOpen(false)
    setSectionOpen(false)
  }, [pathname])

  // Chiudi menu mobile se il browser diventa largo
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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

  // Scroll orizzontale con rotella: sposta l'inner div via transform
  useEffect(() => {
    const container = scrollRef.current
    const inner     = innerRef.current
    if (!container || !inner) return

    const innerEl = inner
    const containerEl = container
    function onWheel(e: WheelEvent) {
      if (e.deltaY === 0) return
      const maxScroll = innerEl.scrollWidth - containerEl.clientWidth
      if (maxScroll <= 0) return  // nessun overflow: lascia scorrere la pagina normalmente
      const next = Math.max(0, Math.min(scrollPos.current + e.deltaY, maxScroll))
      if (next === scrollPos.current) return  // già al limite: lascia scorrere la pagina
      e.preventDefault()
      scrollPos.current = next
      innerEl.style.transform = `translateX(-${scrollPos.current}px)`
    }

    containerEl.addEventListener('wheel', onWheel, { passive: false })
    return () => containerEl.removeEventListener('wheel', onWheel)
  }, [])

  const adminItems         = visibleAdminPages(role)
  const internalItems      = visibleInternalPages(role, rolePermissions).filter(p => !disabledPages.includes(p.id))
  const visibleClientPages = clientPages.filter(p => !disabledPages.includes(p.id))
  const fornitoriItems     = visibleFornitoriPages(role, rolePermissions, disabledPages)
  const clientiItems       = visibleClientiPages(role, rolePermissions, disabledPages)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkStyle = (href: string): React.CSSProperties => ({
    padding: '0 12px',
    height: 42,
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 500,
    color: isActive(href) ? '#000' : '#111',
    textDecoration: isActive(href) ? 'underline' : 'none',
    textDecorationThickness: isActive(href) ? '3px' : undefined,
    textUnderlineOffset: isActive(href) ? '4px' : undefined,
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  })

  return (
    <nav className="class_gold_D_safe" style={{ borderBottom: '1px solid #c8960c', flexShrink: 0 }}>

      {/* ── Desktop ── */}
      <div className="nav-bar">
        {/* Area scrollabile — tutti i link tranne auth */}
        <div className="nav-scroll" ref={scrollRef}>
        <div className="nav-scroll-inner" ref={innerRef}>
          <Link href="/" className="nav-link" style={{ ...linkStyle('/'), display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 2 }} aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1 }}>
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <text x="12" y="17.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#111" stroke="none" fontFamily="system-ui,sans-serif" strokeWidth="0">DG</text>
            </svg>
            <span style={{ display: 'block', width: 18, height: 3, borderRadius: 1, background: isActive('/') ? '#111' : 'transparent' }} />
          </Link>

          {visibleClientPages.length > 0 && (
            <><NavSep />
            <div ref={dropRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setSectionOpen(o => !o)}
                className="nav-link"
                style={{ ...linkStyle('/brand'), gap: 4 }}
              >
                Brand {sectionOpen ? '▴' : '▾'}
              </button>

              {sectionOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#fdfcf8',
                  border: '1px solid #c8960c',
                  borderRadius: 6,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  zIndex: 200,
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

          {role === 'cliente' && areaClientiPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <><NavSep /><AreaClientiDropdown items={areaClientiPages.filter(p => !disabledPages.includes(p.id))} isActive={isActive} linkStyle={linkStyle} /></>
          )}

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
            <><NavSep /><InternalDropdown items={internalItems} isActive={isActive} linkStyle={linkStyle} /></>
          )}

          {adminItems.length > 0 && (
            <><NavSep /><AdminDropdown items={adminItems} isActive={isActive} linkStyle={linkStyle} /></>
          )}
        </div>{/* fine nav-scroll-inner */}
        </div>{/* fine nav-scroll */}

        {/* Auth — sempre visibile, non scorre */}
        <div style={{ flexShrink: 0, paddingRight: 4, paddingLeft: 8, borderLeft: '1px solid #e8d89a' }}>
          <HeaderAuth username={username} registrazioniDisabilitate={registrazioniDisabilitate} forceDropdown />
        </div>
      </div>

      {/* ── Mobile bar: hamburger + auth ── */}
      <div className="nav-mobile-bar">
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          <span style={{ fontSize: 18, width: 20, display: 'inline-block', textAlign: 'center' }}>{menuOpen ? '✕' : '☰'}</span>
          Menu
        </button>
        <div style={{ marginLeft: 'auto', paddingRight: 12 }}>
          <HeaderAuth username={username} registrazioniDisabilitate={registrazioniDisabilitate} forceDropdown />
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

          {role === 'cliente' && areaClientiPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <>
              <div className="nav-mobile-section">Area Personale</div>
              {areaClientiPages.filter(p => !disabledPages.includes(p.id)).map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

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
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
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

function NavSep() {
  return <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.22)', flexShrink: 0, alignSelf: 'center', margin: '0 2px' }} />
}

function InternalDropdown({
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/area-lavoro'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Lavoro {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2,
          zIndex: 200, minWidth: 320,
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/aiuto'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Aiuto {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 2,
          zIndex: 200, minWidth: 220,
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/amministrazione'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Amministrazione {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 2,
          zIndex: 200, minWidth: 200,
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = isActive(group.href)

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="nav-link"
        style={{
          ...linkStyle(group.href),
          gap: 4,
          color: anyActive ? '#000' : '#111',
          textDecoration: anyActive ? 'underline' : 'none',
          textDecorationThickness: anyActive ? '3px' : undefined,
          textUnderlineOffset: anyActive ? '4px' : undefined,
        }}
      >
        {group.label} {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid',
          gridTemplateColumns: group.id === 'edilizia' ? 'repeat(2, 1fr)' : '1fr',
          gap: 0,
          zIndex: 200, minWidth: group.id === 'edilizia' ? 320 : 180,
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/area-fornitori'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Fornitori {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'flex', flexDirection: 'column', gap: 0,
          zIndex: 200, minWidth: 200,
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/clienti'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Clienti {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'flex', flexDirection: 'column', gap: 0,
          zIndex: 200, minWidth: 180,
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
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/area-clienti'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Personale {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'flex', flexDirection: 'column', gap: 0,
          zIndex: 200, minWidth: 180,
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

function MobileLink({ href, label, active, indent }: { href: string; label: string; active: boolean; indent?: boolean }) {
  return (
    <Link
      href={href}
      className={active ? 'nav-mobile-link nav-mobile-link-active' : 'nav-mobile-link'}
      style={{ padding: `10px ${indent ? 28 : 16}px` }}
    >
      <span>{label}</span>
    </Link>
  )
}

