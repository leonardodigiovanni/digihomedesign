'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clientPages, visibleAdminPages, visibleInternalPages, type NavPage } from '@/lib/nav-config'

interface NavbarProps {
  role: string | null
  disabledPages?: number[]
  rolePermissions?: Record<string, number[]>
}

export default function Navbar({ role, disabledPages = [], rolePermissions = {} }: NavbarProps) {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [sectionOpen, setSectionOpen] = useState(false)
  const pathname  = usePathname()
  const dropRef   = useRef<HTMLDivElement>(null)

  // Chiudi tutto al cambio pagina
  useEffect(() => {
    setMenuOpen(false)
    setSectionOpen(false)
  }, [pathname])

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

  const adminItems    = visibleAdminPages(role)
  const internalItems = visibleInternalPages(role, rolePermissions)
  const showClient    = true     // pagine 2-15 visibili a tutti (sito vetrina)
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
    color: isActive(href) ? '#1a1a1a' : '#555',
    textDecoration: 'none',
    // box-shadow invece di border-bottom evita che l'elemento cambi altezza
    boxShadow: isActive(href) ? 'inset 0 -2px 0 #1a1a1a' : 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  })

  return (
    <nav style={{ background: '#f8f8f8', borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>
      <style>{`
        .nav-bar   { display: flex; height: 42px; flex-shrink: 0; align-items: center; padding: 0 8px 0 13px; gap: 2px; }
        .nav-hamburger { display: none; }
        .nav-mobile-menu { display: none; }
        @media (max-width: 768px) {
          .nav-bar        { display: none; }
          .nav-hamburger  { display: flex; align-items: center; padding: 0 16px; height: 42px; gap: 8px;
                            font-size: 14px; font-weight: 500; background: none; border: none;
                            cursor: pointer; width: 100%; color: #333; }
          .nav-mobile-menu { display: block; }
        }
      `}</style>

      {/* ── Desktop ── */}
      <div className="nav-bar">
        <Link href="/" style={linkStyle('/')}>Home</Link>

        {showClient && (
          <div ref={dropRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setSectionOpen(o => !o)}
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
        )}

        {internalItems.length > 0 && (
          <InternalDropdown items={internalItems} isActive={isActive} linkStyle={linkStyle} />
        )}

        {adminItems.length > 0 && (
          <>
            <div style={{ width: 1, background: '#e0e0e0', margin: '10px 0' }} />
            {adminItems.map(p => (
              <Link key={p.id} href={p.href} style={linkStyle(p.href)}>
                {p.label}
              </Link>
            ))}
          </>
        )}
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-expanded={menuOpen}
      >
        <span style={{ fontSize: 18 }}>{menuOpen ? '✕' : '☰'}</span>
        Menu
      </button>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          borderTop: '1px solid #e8e8e8',
          background: '#fff',
          padding: '8px 0 16px',
        }}>
          <MobileLink href="/" label="Home" active={isActive('/')} />

          {showClient && (
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

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} style={{ ...linkStyle('/interno'), gap: 4 }}>
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
