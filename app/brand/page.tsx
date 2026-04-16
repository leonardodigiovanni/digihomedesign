import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand — Digi Home Design Palermo',
  description: 'Scopri Digi Home Design: la nostra storia, galleria lavori, contatti, partners, cataloghi, condizioni di vendita e template documenti.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand' },
}

const pages = [
  { label: 'Storia',                href: '/brand/storia'                },
  { label: 'Galleria',              href: '/brand/galleria'              },
  { label: 'Contatti',              href: '/brand/contatti'              },
  { label: 'Partners',              href: '/brand/partners'              },
  { label: 'Cataloghi',             href: '/brand/cataloghi'             },
  { label: 'Condizioni di Vendita', href: '/brand/condizioni-di-vendita' },
  { label: 'Templates Documenti',   href: '/brand/templates-documenti'   },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 }}>Brand</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pages.map(p => (
          <li key={p.href}>
            <Link href={p.href} style={{ color: '#c8960c', fontWeight: 600, textDecoration: 'underline' }}>{p.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
