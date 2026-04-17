import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quadri a Palermo — Decorazioni e Arte per la Casa',
  description: 'Quadri e decorazioni per la casa a Palermo: selezione di opere d\'arte, stampe e dipinti su misura per valorizzare ogni ambiente.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi/quadri' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Quadri a Palermo — Decorazioni e Arte per la Casa',
    description: 'Quadri e decorazioni per la casa a Palermo: selezione di opere d\'arte, stampe e dipinti su misura per valorizzare ogni ambiente.',
    url: 'https://www.digi-home-design.com/arredi/quadri',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/arredi" style={{ color: '#888', textDecoration: 'underline' }}>Arredi</Link> / Quadri
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Quadri a Palermo
      </h1>
      <p>
        La scelta giusta di un <strong>quadro</strong> può trasformare completamente l&apos;atmosfera di una stanza. Proponiamo una selezione curata di opere d&apos;arte, stampe fotografiche, dipinti e decorazioni murali adatte a ogni stile: dal classico al contemporaneo, dal minimalista al ricco di colore.
      </p>
      <p style={{ marginTop: 12 }}>
        Offriamo consulenza personalizzata per abbinare il quadro giusto alle dimensioni della parete, ai colori dell&apos;ambiente e allo stile generale dell&apos;arredo. Il servizio include la fornitura, la cornice su misura e il montaggio professionale a domicilio.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo su tutto il territorio palermitano. Contattaci per una consulenza gratuita e scopri come valorizzare i tuoi spazi con l&apos;arte giusta.
      </p>
      {/* CTA esclusivi */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40, padding: '20px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <Link href="/aiuto/guida-preventivo" style={{ display: 'inline-block', padding: '10px 20px', background: '#c8960c', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Calcola il tuo preventivo
          </Link>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <Link href="/aiuto/guida-cantiere" style={{ display: 'inline-block', padding: '10px 20px', background: '#1a1a1a', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Segui il tuo cantiere online
          </Link>
        </div>
      </div>
      <Link href="/arredi" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna ad Arredi
      </Link>
    </div>
  )
}
