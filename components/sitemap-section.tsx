import Link from 'next/link'
import { categoryGroups, clientPages } from '@/lib/nav-config'

const topPages = [
  { label: 'Infissi',                        href: '/infissi'                        },
  { label: 'Verande',                         href: '/verande'                        },
  { label: 'Persiane',                         href: '/persiane'                       },
  { label: 'Porte Corazzate',                 href: '/porte-corazzate'                },
  { label: 'Strutture Metalliche',            href: '/strutture-metalliche'           },
  { label: 'Ristrutturazioni Chiavi in Mano', href: '/ristrutturazioni-chiavi-in-mano'},
]

const brandPages = clientPages.map(p => ({ label: p.label, href: p.href }))

const headingStyle: React.CSSProperties = {
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 8,
  marginTop: 0,
}

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 4,
  textDecoration: 'none',
  lineHeight: 1.7,
}


export default function SitemapSection({ disabledPages }: { disabledPages: number[] }) {
  const visibleBrand = brandPages.filter(p => {
    const navPage = clientPages.find(c => c.href === p.href)
    return !navPage || !disabledPages.includes(navPage.id)
  })

  const visibleGroups = categoryGroups
    .map(g => ({
      ...g,
      pages: g.pages.filter(p => !disabledPages.includes(p.id)),
    }))
    .filter(g => g.pages.length > 0)

  return (
    <section style={{
      padding: '32px 24px 28px',
      background: '#1c1c1c',
    }}>
      <div style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
        <p className="fs-10" style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#777', marginBottom: 18 }}>
          Indice pagine
        </p>

        <div className="sitemap-scroll" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'flex-start',
            gap: '0 16px',
          }}>

            {/* Prodotti principali — sempre visibili */}
            <div style={{ flex: '0 0 120px', width: 120 }}>
              <p className="testo-indice" style={headingStyle}>Prodotti</p>
              {topPages.map(p => (
                <Link key={p.href} href={p.href} className="testo-indice" style={linkStyle}>
                  <span style={{ color: '#777', flexShrink: 0 }}>•</span>
                  <span>{p.label}</span>
                </Link>
              ))}
            </div>

            {/* Brand — filtrato */}
            {visibleBrand.length > 0 && (
              <div style={{ flex: '0 0 120px', width: 120 }}>
                <p className="testo-indice" style={headingStyle}>Brand</p>
                {visibleBrand.map(p => (
                  <Link key={p.href} href={p.href} className="testo-indice" style={linkStyle}>
                    <span style={{ color: '#777', flexShrink: 0 }}>•</span>
                    <span>{p.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Categorie prodotto — filtrate */}
            {visibleGroups.map(g => (
              <div key={g.id} style={{ flex: '0 0 120px', width: 120 }}>
                <Link href={g.href} className="testo-indice" style={{ ...headingStyle, textDecoration: 'none', display: 'block' }}>
                  {g.label}
                </Link>
                {g.pages.map(p => (
                  <Link key={p.id} href={p.href} className="testo-indice" style={linkStyle}>
                    <span style={{ color: '#777', flexShrink: 0 }}>•</span>
                    <span>{p.label}</span>
                  </Link>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  )
}
