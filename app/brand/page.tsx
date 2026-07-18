import Link from 'next/link'
import type { Metadata } from 'next'
import { readSettings } from '@/lib/settings'
import { clientPages } from '@/lib/nav-config'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Brand — Digi Home Design Palermo',
  description: 'Scopri Digi Home Design: la nostra storia, galleria lavori, contatti, partners, cataloghi, condizioni di vendita e template documenti.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Brand — Digi Home Design Palermo',
    description: 'Scopri Digi Home Design: la nostra storia, galleria lavori, contatti, partners, cataloghi, condizioni di vendita e template documenti.',
    url: 'https://www.digi-home-design.com/brand',
    type: 'website',
  },
}

const pages = [
  { label: 'Storia',                href: '/brand/storia',                desc: 'Le radici artigianali della nostra azienda, nata da poco ma con un grande bagaglio di conoscenza, a partire dal 1960.' },
  { label: 'Galleria',              href: '/brand/galleria',              desc: 'Foto e video dei nostri lavori completati: ristrutturazioni, serramenti e molto altro.' },
  { label: 'Contatti',              href: '/brand/contatti',              desc: 'Dove siamo, come raggiungerci e tutti i recapiti per richiedere un preventivo.' },
  { label: 'Partners',              href: '/brand/partners',              desc: 'I brand e i fornitori con cui collaboriamo per garantire qualità e affidabilità.' },
  { label: 'Cataloghi',             href: '/brand/cataloghi',             desc: 'Sfoglia i cataloghi dei prodotti disponibili: serramenti, porte, arredi e altro e componi il tuo preventivo senza registrazione.' },
  { label: 'Condizioni di Vendita', href: '/brand/condizioni-di-vendita', desc: 'Termini e condizioni che regolano i nostri contratti di fornitura e posa.' },
  { label: 'Documenti Legali',      href: '/brand/templates-documenti',   desc: 'Documenti legali ufficiali: Privacy Policy & Cookie Policy e Consenso Marketing, Newsletter e SMS, scaricabili in PDF.' },
]

export default async function Page() {
  const { disabledPages } = await readSettings()
  const disabledHrefs = new Set(
    clientPages.filter(p => disabledPages.includes(p.id)).map(p => p.href)
  )
  const ok = (href: string) => !disabledHrefs.has(href)

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Brand<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Brand
      </h1>
      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px', marginBottom: 36 }}>
        <p className="testo-articoli" style={{ margin: 0 }}>Tutto quello che riguarda Digi Home Design: la nostra storia, i lavori realizzati, come contattarci, i partner con cui lavoriamo e la documentazione ufficiale.</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {pages.filter(p => ok(p.href)).map(p => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              flex: '1 1 240px',
              border: '1px solid #c8960c',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
            }}
          >
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 8 }}>{p.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{p.desc}</div>
          </Link>
        ))}
      </div>
      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Torna alla home</Link>
      </StickyBottomBarContent>
    </div>
  )
}
