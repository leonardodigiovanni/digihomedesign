'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const HomeSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="22" fill="#1c1c1c"/>
    <g transform="translate(4, 5.5) scale(1.5)" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 9.5 L12 3 L16.5 6.3 L16.5 3.5 L18 3.5 L18 7.3 L21 9.5 V18.25 M3 18.25 V9.5"/>
      <text x="12" y="18" textAnchor="middle" fontSize="11" fontWeight="500" fill="#ffffff" stroke="none" fontFamily="system-ui,sans-serif" strokeWidth="0">DG</text>
    </g>
  </svg>
)

const DocumentiSvg = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1c1c1c"/>
    <path fill="#ffffff" d="M8 5h5.17A1.5 1.5 0 0 1 14.24 5.44l2.83 2.83A1.5 1.5 0 0 1 17.5 9.33V18a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 18V6.5A1.5 1.5 0 0 1 8 5Zm0 1a.5.5 0 0 0-.5.5V18a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.5h-2.5A1.5 1.5 0 0 1 12.5 8V5.5H8Zm5 .21V8a.5.5 0 0 0 .5.5h2.29L13 6.21ZM9.5 12a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5Zm0 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z"/>
  </svg>
)

const NotificheSvg = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1c1c1c"/>
    <path fill="#ffffff" d="M12 5a1 1 0 0 1 1 1v.28A4.5 4.5 0 0 1 16.5 10.5v2.25l1.3 1.95A.75.75 0 0 1 17.17 16H6.83a.75.75 0 0 1-.63-1.3l1.3-1.95V10.5A4.5 4.5 0 0 1 11 6.28V6a1 1 0 0 1 1-1Zm-1.5 12h3a1.5 1.5 0 0 1-3 0Z"/>
  </svg>
)

const ContattiSvg = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1c1c1c"/>
    <path fill="#ffffff" d="M5.5 8.25A1.25 1.25 0 0 1 6.75 7h10.5A1.25 1.25 0 0 1 18.5 8.25v7.5A1.25 1.25 0 0 1 17.25 17H6.75A1.25 1.25 0 0 1 5.5 15.75v-7.5Zm1.25-.25a.25.25 0 0 0-.25.25v.56l5.5 3.44 5.5-3.44v-.56a.25.25 0 0 0-.25-.25H6.75ZM17.5 10.19l-5 3.13a.5.5 0 0 1-.54 0l-5-3.13v5.56c0 .14.11.25.25.25h10.5a.25.25 0 0 0 .25-.25v-5.56Z"/>
  </svg>
)

const NAV_ITEMS: { href: string; label: string; img: string | null; node?: React.ReactNode }[] = [
  { href: '/app',            label: 'Home',       img: null,                                    node: <HomeSvg /> },
  { href: '/app/preventivo', label: 'Preventivo', img: '/images/cta/preventivo-online-t.png' },
  { href: '/app/cantiere',   label: 'Cantiere',   img: '/images/cta/cantieri-online-t.png'   },
  { href: '/app/documenti',  label: 'Documenti',  img: null, node: <DocumentiSvg /> },
  { href: '/app/notifiche',  label: 'Notifiche',  img: null, node: <NotificheSvg /> },
  { href: '/app/contatti',   label: 'Contatti',   img: null,                                    node: <ContattiSvg /> },
]

export default function AppBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="app-bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} className={`app-nav-item${isActive ? ' active' : ''}`}>
            <div className="app-nav-icon-slot">
              {item.node ? (
                item.node
              ) : item.img ? (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image src={item.img} alt={item.label} width={32} height={32} style={{ objectFit: 'contain' }} />
                </div>
              ) : (
                <span className="app-nav-icon">📁</span>
              )}
            </div>
            <span className="app-nav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
