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
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#888',
  marginBottom: 10,
  marginTop: 0,
}

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 6,
  fontSize: 13,
  color: '#555',
  textDecoration: 'none',
  lineHeight: 1.9,
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
      borderTop: '1px solid rgba(0,0,0,0.1)',
      padding: '40px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '28px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: 28 }}>
          Indice pagine
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '28px 20px',
        }}>

          {/* Prodotti principali — sempre visibili */}
          <div>
            <p style={headingStyle}>Prodotti</p>
            {topPages.map(p => (
              <Link key={p.href} href={p.href} style={linkStyle}>
                <span style={{ color: '#1a1a1a', flexShrink: 0 }}>•</span>
                <span>{p.label}</span>
              </Link>
            ))}
          </div>

          {/* Brand — filtrato */}
          {visibleBrand.length > 0 && (
            <div>
              <p style={headingStyle}>Brand</p>
              {visibleBrand.map(p => (
                <Link key={p.href} href={p.href} style={linkStyle}>
                  <span style={{ color: '#1a1a1a', flexShrink: 0 }}>•</span>
                  <span>{p.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Categorie prodotto — filtrate */}
          {visibleGroups.map(g => (
            <div key={g.id}>
              <Link href={g.href} style={{ ...headingStyle, textDecoration: 'none', display: 'block' }}>
                {g.label}
              </Link>
              {g.pages.map(p => (
                <Link key={p.id} href={p.href} style={linkStyle}>
                  <span style={{ color: '#1a1a1a', flexShrink: 0 }}>•</span>
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
