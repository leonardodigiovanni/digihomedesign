'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

const GOLD: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: [
    'repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
    'linear-gradient(135deg, #b89030 0%, #c8960c 18%, #f5d060 38%, #f0c840 50%, #f5d060 62%, #c8960c 82%, #b89030 100%)',
  ].join(', '),
}

const HomeSvg = () => (
  <div style={GOLD}>
    <svg width="26" height="26" viewBox="0 0 24 21" fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M1 10.5 L12 2 L17 5.8 L17 3 L19.5 3 L19.5 7.6 L23 10.5 V20.5 M1 20.5 V10.5"/>
      <text x="12" y="20" textAnchor="middle" fontSize="7" fontWeight="600" fill="#000" stroke="none" fontFamily="system-ui,sans-serif">DG</text>
    </svg>
  </div>
)

const CataloghiSvg = () => (
  <div style={GOLD}>
    <BookOpen size={24} color="#000000" strokeWidth={1.5} />
  </div>
)

function CarrelloIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={{ ...GOLD, overflow: 'hidden' }}>
        <img src="/images/carrello/carrello-acquisti.png" alt="Carrello acquisti" style={{ width: 36, height: 36, objectFit: 'contain', display: 'block' }} />
      </div>
      <span style={{
        position: 'absolute', top: 2, right: 0,
        background: '#e65100', color: '#fff', borderRadius: '50%',
        minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px', lineHeight: 1,
      }}>
        {count > 99 ? '99+' : count}
      </span>
    </div>
  )
}

function PreventivatoreIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={{ ...GOLD, overflow: 'hidden' }}>
        <img src="/images/carrello/carrello-preventivo-t.png" alt="Carrello preventivo" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
      </div>
      <span style={{
        position: 'absolute', top: 2, right: 0,
        background: '#2b8fcf', color: '#fff', borderRadius: '50%',
        minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px', lineHeight: 1,
      }}>
        {count > 99 ? '99+' : count}
      </span>
    </div>
  )
}

const DocumentiSvg = () => (
  <div style={GOLD}>
    <svg width="34" height="34" viewBox="0 0 24 24">
      <path fill="#000000" d="M8 5h5.17A1.5 1.5 0 0 1 14.24 5.44l2.83 2.83A1.5 1.5 0 0 1 17.5 9.33V18a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 18V6.5A1.5 1.5 0 0 1 8 5Zm0 1a.5.5 0 0 0-.5.5V18a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.5h-2.5A1.5 1.5 0 0 1 12.5 8V5.5H8Zm5 .21V8a.5.5 0 0 0 .5.5h2.29L13 6.21ZM9.5 12a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z"/>
    </svg>
  </div>
)

function AvvisiIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={GOLD}>
        <svg width="34" height="34" viewBox="0 0 24 24">
          <path fill="#000000" d="M12 5a1 1 0 0 1 1 1v.28A4.5 4.5 0 0 1 16.5 10.5v2.25l1.3 1.95A.75.75 0 0 1 17.17 16H6.83a.75.75 0 0 1-.63-1.3l1.3-1.95V10.5A4.5 4.5 0 0 1 11 6.28V6a1 1 0 0 1 1-1Zm-1.5 12h3a1.5 1.5 0 0 1-3 0Z"/>
        </svg>
      </div>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: 2, right: 0,
          background: '#c00', color: '#fff', borderRadius: '50%',
          minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px', lineHeight: 1,
        }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  )
}

const ContattiSvg = () => (
  <div style={GOLD}>
    <svg width="34" height="34" viewBox="0 0 24 24">
      <path fill="#000000" d="M5.5 8.25A1.25 1.25 0 0 1 6.75 7h10.5A1.25 1.25 0 0 1 18.5 8.25v7.5A1.25 1.25 0 0 1 17.25 17H6.75A1.25 1.25 0 0 1 5.5 15.75v-7.5Zm1.25-.25a.25.25 0 0 0-.25.25v.56l5.5 3.44 5.5-3.44v-.56a.25.25 0 0 0-.25-.25H6.75ZM17.5 10.19l-5 3.13a.5.5 0 0 1-.54 0l-5-3.13v5.56c0 .14.11.25.25.25h10.5a.25.25 0 0 0 .25-.25v-5.56Z"/>
    </svg>
  </div>
)

type NavItem = { href: string; label: string; node: React.ReactNode }

export default function AppBottomNav({
  username,
  preventivoCartCount = 0,
  acquistiCartCount = 0,
  avvisiUnreadCount = 0,
}: {
  username: string | null
  preventivoCartCount?: number
  acquistiCartCount?: number
  avvisiUnreadCount?: number
}) {
  const pathname = usePathname()
  const [avvisiCount, setAvvisiCount] = useState(avvisiUnreadCount)

  useEffect(() => {
    function onUpdate(e: Event) {
      setAvvisiCount((e as CustomEvent<{ count: number }>).detail.count)
    }
    window.addEventListener('avvisi-count-changed', onUpdate)
    return () => window.removeEventListener('avvisi-count-changed', onUpdate)
  }, [])

  if (!username && (pathname === '/app' || pathname === '/app/login')) return null

  const items: NavItem[] = [
    { href: '/app',                   label: 'Home',          node: <HomeSvg /> },
    { href: '/app/cataloghi',         label: 'Cataloghi',     node: <CataloghiSvg /> },
    ...(acquistiCartCount   > 0 ? [{ href: '/app/carrello-acquisti',   label: 'Carrello acquisti',       node: <CarrelloIcon count={acquistiCartCount} /> }] : []),
    ...(preventivoCartCount > 0 ? [{ href: '/app/carrello-preventivo', label: 'Simula preventivo', node: <PreventivatoreIcon count={preventivoCartCount} /> }] : []),
    { href: '/app/preventivo',        label: 'I miei preventivi', node: <div style={GOLD}><Image src="/images/cta/preventivo-online-t.png" alt="Preventivo" width={36} height={36} style={{ objectFit: 'contain' }} /></div> },
    { href: '/app/cantiere',          label: 'I miei cantieri', node: <div style={GOLD}><Image src="/images/cta/cantieri-online-t.png" alt="Cantiere" width={36} height={36} style={{ objectFit: 'contain' }} /></div> },
    { href: '/app/documenti',         label: 'Documenti',     node: <DocumentiSvg /> },
    { href: '/app/avvisi',            label: 'Avvisi',        node: <AvvisiIcon count={avvisiCount} /> },
    { href: '/app/contatti',          label: 'Contatti',      node: <ContattiSvg /> },
  ]

  return (
    <nav className="app-bottom-nav">
      {items.map(item => {
        const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} className={`app-nav-item${isActive ? ' active' : ''}`}>
            <div className="app-nav-icon-slot">
              {item.node}
            </div>
            <span className="app-nav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
