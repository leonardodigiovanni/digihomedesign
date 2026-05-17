import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servizi a Palermo — Riparazioni, Montaggio, Manutenzione e Pulizie',
  description: 'Servizi professionali a Palermo: riparazioni, montaggio, manutenzione ordinaria e contratti di pulizia per casa e ufficio. Un unico referente per tutto.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Servizi a Palermo — Riparazioni, Montaggio, Manutenzione e Pulizie',
    description: 'Servizi professionali a Palermo: riparazioni, montaggio, manutenzione ordinaria e contratti di pulizia per casa e ufficio. Un unico referente per tutto.',
    url: 'https://www.digi-home-design.com/servizi',
    type: 'website',
  },
}

const subcategories = [
  {
    href: '/servizi/riparazioni',
    label: 'Riparazioni',
    desc: 'Riparazioni rapide e affidabili per infissi, serramenti, arredi e impianti.',
  },
  {
    href: '/servizi/montaggio',
    label: 'Montaggio',
    desc: 'Montaggio professionale di mobili, arredi, infissi e strutture su misura.',
  },
  {
    href: '/servizi/manutenzione',
    label: 'Manutenzione',
    desc: 'Manutenzione ordinaria e straordinaria per mantenere casa e ufficio in perfetto stato.',
  },
  {
    href: '/servizi/contratti-di-pulizia',
    label: 'Contratti di Pulizia',
    desc: 'Contratti di pulizia periodica per ambienti residenziali e commerciali a Palermo.',
  },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Servizi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Servizi a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Oltre alla fornitura e installazione, offriamo una gamma completa di servizi post-vendita e di supporto per casa e ufficio. Un unico referente per ogni esigenza.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {subcategories.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              flex: '1 1 240px',
              border: '2px solid #c8960c',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
            }}
          >
            <div className="fs-18" style={{ fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
