'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clientPages, visibleAdminPages, visibleInternalPages, type NavPage } from '@/lib/nav-config'
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

  const adminItems         = visibleAdminPages(role)
  const internalItems      = visibleInternalPages(role, rolePermissions).filter(p => !disabledPages.includes(p.id))
  const visibleClientPages = clientPages.filter(p => !disabledPages.includes(p.id))

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
        <Link href="/" className="nav-link" style={linkStyle('/')}>Home</Link>

        {visibleClientPages.length > 0 && (
          <><NavSep />
          <div ref={dropRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setSectionOpen(o => !o)}
              className="nav-link"
              style={{ ...linkStyle('/pagine'), gap: 4 }}
            >
              Sezioni {sectionOpen ? '▴' : '▾'}
            </button>

            {sectionOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                padding: 12,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                zIndex: 200,
                minWidth: 360,
              }}>
                {visibleClientPages.map(p => (
                  <Link
                    key={p.id}
                    href={p.href}
                    style={{
                      padding: '7px 10px',
                      fontSize: 13,
                      color: isActive(p.href) ? '#1a1a1a' : '#444',
                      fontWeight: isActive(p.href) ? 600 : 400,
                      textDecoration: 'none',
                      borderRadius: 4,
                      background: isActive(p.href) ? '#f0f0f0' : 'transparent',
                    }}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          </>
        )}

        {internalItems.length > 0 && (
          <><NavSep /><InternalDropdown items={internalItems} isActive={isActive} linkStyle={linkStyle} /></>
        )}

        {adminItems.length > 0 && (
          <>
            <NavSep />
            {adminItems.map((p, i) => (
              <React.Fragment key={p.id}>
                {i > 0 && <NavSep />}
                <Link href={p.href} className="nav-link" style={linkStyle(p.href)}>
                  {p.label}
                </Link>
              </React.Fragment>
            ))}
          </>
        )}

        <div style={{ marginLeft: 'auto', paddingRight: 4 }}>
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

      {/* ── Mobile menu ── */}
      {menuOpen && (
      <div
        style={{
          position: 'fixed',
          top: 90 + (bannerAbilitato ? 42 : 0) + 42 + 1,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e8e8e8',
          padding: '8px 0 16px',
          overflowY: 'auto',
          maxHeight: `calc(100dvh - ${90 + (bannerAbilitato ? 42 : 0) + 42}px)`,
          zIndex: 99,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
          <MobileLink href="/" label="Home" active={isActive('/')} />

          {visibleClientPages.length > 0 && (
            <>
              <div style={{ padding: '8px 16px 4px', fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Sezioni
              </div>
              {visibleClientPages.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {internalItems.length > 0 && (
            <>
              <div style={{ padding: '12px 16px 4px', fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Area Lavoro
              </div>
              {internalItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </>
          )}

          {adminItems.length > 0 && (
            <>
              <div style={{ padding: '12px 16px 4px', fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Amministrazione
              </div>
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
      <button onClick={() => setOpen(o => !o)} className="nav-link" style={{ ...linkStyle('/interno'), gap: 4, color: anyActive ? '#000' : '#111', textDecoration: anyActive ? 'underline' : 'none', textDecorationThickness: anyActive ? '3px' : undefined, textUnderlineOffset: anyActive ? '4px' : undefined }}>
        Area Lavoro {open ? '▴' : '▾'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2,
          zIndex: 200, minWidth: 320,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              style={{
                padding: '7px 10px', fontSize: 13,
                color: isActive(p.href) ? '#1a1a1a' : '#444',
                fontWeight: isActive(p.href) ? 600 : 400,
                textDecoration: 'none', borderRadius: 4,
                background: isActive(p.href) ? '#f0f0f0' : 'transparent',
              }}
            >
              {p.label}
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
      style={{
        display: 'block',
        padding: `9px ${indent ? 28 : 16}px`,
        fontSize: 14,
        color: active ? '#1a1a1a' : '#444',
        fontWeight: active ? 600 : 400,
        textDecoration: 'none',
        background: active ? '#f5f5f5' : 'transparent',
      }}
    >
      {label}
    </Link>
  )
}
