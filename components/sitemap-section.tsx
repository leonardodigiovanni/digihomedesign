import Link from 'next/link'
import { categoryGroups, clientPages, prodottiPages } from '@/lib/nav-config'

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
  alignItems: 'center',
  gap: 4,
  textDecoration: 'none',
  minHeight: 44,
  whiteSpace: 'nowrap',
}

const MAX_PER_COL = 5

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

type SimpleLink = { label: string; href: string }

function renderColumns(heading: string, pages: SimpleLink[]) {
  return chunk(pages, MAX_PER_COL).map((group, ci) => (
    <div key={`${heading}-${ci}`} style={{ flex: '0 0 auto', minWidth: 100 }}>
      <p className="testo-indice" style={{ ...headingStyle, visibility: ci === 0 ? 'visible' : 'hidden' }}>
        {heading}
      </p>
      {group.map(p => (
        <Link key={p.href} href={p.href} className="testo-indice" style={linkStyle}>
          <span style={{ color: '#999', flexShrink: 0 }}>•</span>
          <span>{p.label}</span>
        </Link>
      ))}
    </div>
  ))
}

export default function SitemapSection({ disabledPages }: { disabledPages: number[] }) {
  const visibleProdotti = prodottiPages
    .filter(p => !disabledPages.includes(p.id))
    .map(p => ({ label: p.label, href: p.href }))

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
      padding: '8px 24px 28px',
      background: '#1c1c1c',
    }}>
      <div style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
        <p className="fs-10" style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: 18, marginTop: 0 }}>
          Indice pagine
        </p>

        <div className="sitemap-scroll" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'flex-start',
            gap: '0 16px',
          }}>

            {/* Brand — filtrato */}
            {visibleBrand.length > 0 && renderColumns('Brand', visibleBrand)}

            {/* Prodotti principali — filtrato */}
            {visibleProdotti.length > 0 && (
              <>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.18)', alignSelf: 'stretch', flexShrink: 0 }} />
                {renderColumns('Prodotti', visibleProdotti)}
              </>
            )}

            {/* Categorie prodotto — una serie di colonne per gruppo */}
            {visibleGroups.map(g =>
              chunk(g.pages, MAX_PER_COL).map((group, ci) => (
                <div key={`${g.id}-${ci}`} style={{ display: 'contents' }}>
                  {ci === 0 && <div style={{ width: 1, background: 'rgba(255,255,255,0.18)', alignSelf: 'stretch', flexShrink: 0 }} />}
                <div style={{ flex: '0 0 auto', minWidth: 100 }}>
                  {ci === 0 ? (
                    <Link href={g.href} className="testo-indice" style={{ ...headingStyle, textDecoration: 'none', display: 'block' }}>
                      {g.label}
                    </Link>
                  ) : (
                    <p className="testo-indice" style={{ ...headingStyle, visibility: 'hidden' }}>{g.label}</p>
                  )}
                  {group.map(p => (
                    <Link key={p.id} href={p.href} className="testo-indice" style={linkStyle}>
                      <span style={{ color: '#999', flexShrink: 0 }}>•</span>
                      <span>{p.label}</span>
                    </Link>
                  ))}
                </div>
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
