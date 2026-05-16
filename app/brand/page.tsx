import Link from 'next/link'
import type { Metadata } from 'next'

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
  // { label: 'Galleria',           href: '/brand/galleria',              desc: 'Foto e video dei nostri lavori completati: ristrutturazioni, serramenti e molto altro.' }, // id 6 — disabilitata da admin
  { label: 'Contatti',              href: '/brand/contatti',              desc: 'Dove siamo, come raggiungerci e tutti i recapiti per richiedere un preventivo.' },
  // { label: 'Partners',           href: '/brand/partners',              desc: 'I brand e i fornitori con cui collaboriamo per garantire qualità e affidabilità.' }, // id 37 — disabilitata da admin
  { label: 'Cataloghi',             href: '/brand/cataloghi',             desc: 'Sfoglia i cataloghi dei prodotti disponibili: serramenti, porte, arredi e altro e componi il tuo preventivo senza registrazione.' },
  { label: 'Condizioni di Vendita', href: '/brand/condizioni-di-vendita', desc: 'Termini e condizioni che regolano i nostri contratti di fornitura e posa.' },
  // { label: 'Templates Documenti',href: '/brand/templates-documenti',   desc: 'Modelli di documenti standard per preventivi, contratti e verbali di cantiere.' }, // id 40 — disabilitata da admin
]

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Brand
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Brand
      </h1>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', marginBottom: 36 }}>
        <p className="testo-articoli" style={{ margin: 0 }}>Tutto quello che riguarda Digi Home Design: la nostra storia, i lavori realizzati, come contattarci, i partner con cui lavoriamo e la documentazione ufficiale.</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {pages.map(p => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              flex: '1 1 240px',
              border: '1px solid #e0e0e0',
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
      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
