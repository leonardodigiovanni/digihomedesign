'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { appLogout } from './login/actions'

const ORANGE_NAV: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px), var(--orange-app)',
}

const GOLD: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 6px), #d4a010',
}

const HomeSvg = () => (
  <div style={GOLD}>
    <svg width="34" height="30" viewBox="-1 -1 26 23" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" style={{ marginTop: -6 }}>
      <path d="M1 10.5 L12 2 L17 5.8 L17 3 L19.5 3 L19.5 7.6 L23 10.5 V20.5 M1 20.5 V10.5"/>
      <text x="12" y="20" textAnchor="middle" fontSize="13" fontWeight="600" fill="#000" stroke="none" fontFamily="system-ui,sans-serif">DG</text>
    </svg>
  </div>
)

const CataloghiSvg = () => (
  <div style={GOLD}>
    <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2 }}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="#d4a010"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="#d4a010"/>
      <line x1="4" y1="8" x2="9" y2="8"/>
      <line x1="4" y1="11" x2="9" y2="11"/>
      <line x1="4" y1="14" x2="9" y2="14"/>
      <line x1="15" y1="8" x2="20" y2="8"/>
      <line x1="15" y1="11" x2="20" y2="11"/>
      <line x1="15" y1="14" x2="20" y2="14"/>
    </svg>
  </div>
)

function CarrelloIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={{ ...GOLD, overflow: 'hidden' }}>
        <img src="/images/carrello/acquisti.png" alt="Carrello acquisti" style={{ width: 36, height: 36, objectFit: 'contain', display: 'block' }} />
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
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="miter" style={{ marginLeft: 5 }}>
      {/* Fogli dietro senza piega */}
      <rect x="2" y="6" width="13" height="16" fill="#d4a010"/>
      <rect x="3.5" y="4.5" width="13" height="16" fill="#d4a010"/>
      {/* Foglio principale con piega */}
      <polygon points="5,3 16,3 19,6 19,21 5,21" fill="#d4a010"/>
      <polyline points="16,3 16,6 19,6"/>
      <line x1="7.5" y1="11.5" x2="16.5" y2="11.5"/>
      <line x1="7.5" y1="14.5" x2="16.5" y2="14.5"/>
      <line x1="7.5" y1="17.5" x2="13" y2="17.5"/>
    </svg>
  </div>
)

function AvvisiIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={GOLD}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2 }}>
          <path d="M12 3 L12 4.5 C8.5 5.2 6.5 8 6.5 10.5 V14 L5 16 H19 L17.5 14 V10.5 C17.5 8 15.5 5.2 12 4.5 Z" fill="#d4a010"/>
          <line x1="12" y1="3" x2="12" y2="4.5"/>
          <path d="M10.5 16 A1.5 1.5 0 0 0 13.5 16"/>
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
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" fill="#d4a010"/>
      <polyline points="2,5 12,13 22,5"/>
    </svg>
  </div>
)

type NavItem = { href: string; label: string; node: React.ReactNode }

export default function AppBottomNav({
  username,
  preventivoCartCount = 0,
  acquistiCartCount = 0,
  avvisiUnreadCount = 0,
  manutenzione = false,
  preventiviAbilitato = true,
}: {
  username: string | null
  preventivoCartCount?: number
  acquistiCartCount?: number
  avvisiUnreadCount?: number
  manutenzione?: boolean
  preventiviAbilitato?: boolean
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

  if (pathname === '/app/login') return null
  if (manutenzione && !username) return null

  const items: NavItem[] = username ? [
    { href: '/app',                   label: 'Home',             node: <HomeSvg /> },
    { href: '/app/cataloghi',         label: 'Cataloghi',        node: <CataloghiSvg /> },
    ...(acquistiCartCount   > 0 ? [{ href: '/app/carrello-acquisti',   label: 'Carrello acquisti',  node: <CarrelloIcon count={acquistiCartCount} /> }] : []),
    ...(preventiviAbilitato && preventivoCartCount > 0 ? [{ href: '/app/carrello-preventivo', label: 'Simulazione',  node: <PreventivatoreIcon count={preventivoCartCount} /> }] : []),
    ...(preventiviAbilitato ? [{ href: '/app/preventivo',        label: 'Preventivi',       node: (
        <div style={GOLD}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="3" width="14" height="18" fill="#d4a010"/>
            <text x="12" y="12" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#000" stroke="none" fontFamily="system-ui,sans-serif">€</text>
            {/* Firma dentro il foglio */}
            <line x1="11" y1="18" x2="17" y2="18" stroke="#000" strokeWidth="0.9"/>
            {/* Matita — punta sull'estremità destra della firma, sale diagonale uscendo dal foglio a destra */}
            <polygon points="17.5,16.5 18.5,17.5 24,11 23,10" fill="#000" stroke="none"/>
            <polygon points="17.5,16.5 18.5,17.5 17,18" fill="#555" stroke="none"/>
          </svg>
        </div>
      ) }] : []),
    { href: '/app/cantiere',          label: 'Cantieri',         node: (
        <div style={GOLD}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Foto (dietro) */}
            <rect x="2" y="3" width="13" height="10" rx="1" fill="#d4a010"/>
            <rect x="5.5" y="5.5" width="5" height="5" fill="none" strokeWidth="1"/>
            <line x1="8" y1="5.5" x2="8" y2="10.5" strokeWidth="1"/>
            <line x1="5.5" y1="8" x2="10.5" y2="8" strokeWidth="1"/>
            {/* Video (davanti sovrapposto) */}
            <rect x="9" y="11" width="13" height="10" rx="1" fill="#d4a010"/>
            <polygon points="13.5,14 13.5,18 17.5,16" fill="#000" stroke="none"/>
          </svg>
        </div>
      ) },
    { href: '/app/documenti',         label: 'Documenti',        node: <DocumentiSvg /> },
    { href: '/app/avvisi',            label: 'Avvisi',           node: <AvvisiIcon count={avvisiCount} /> },
    { href: '/app/contatti',          label: 'Contatti',         node: <ContattiSvg /> },
  ] : [
    { href: '/app',                   label: 'Home',             node: <HomeSvg /> },
    { href: '/app/cataloghi',         label: 'Cataloghi',        node: <CataloghiSvg /> },
    ...(preventiviAbilitato && preventivoCartCount > 0 ? [{ href: '/app/carrello-preventivo', label: 'Simulazione',  node: <PreventivatoreIcon count={preventivoCartCount} /> }] : []),
    { href: '/app/contatti',          label: 'Contatti',         node: <ContattiSvg /> },
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
      {username && (
        <form action={appLogout}>
          <button
            type="submit"
            onClick={e => { if (!window.confirm('Vuoi uscire?')) e.preventDefault() }}
            className="app-nav-item"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <div className="app-nav-icon-slot">
              <div style={ORANGE_NAV}>
                <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                  {/* Cornice porta */}
                  <rect x="2" y="2" width="12" height="20" fill="#f29878"/>
                  {/* Anta aperta */}
                  <path d="M14 2 L16.5 3 L16.5 21 L14 22 Z" fill="#f29878"/>
                  {/* Maniglia */}
                  <circle cx="12.5" cy="12" r="0.8" fill="#000" stroke="none"/>
                  {/* Freccia uscita */}
                  <line x1="7" y1="12" x2="22" y2="12" stroke="#000" strokeWidth="1.3"/>
                  <polyline points="19,9 22,12 19,15" stroke="#000" strokeWidth="1.3"/>
                </svg>
              </div>
            </div>
            <span className="app-nav-label">Esci</span>
          </button>
        </form>
      )}
    </nav>
  )
}
