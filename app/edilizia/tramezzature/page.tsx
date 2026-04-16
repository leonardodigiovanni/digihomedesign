import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tramezzature a Palermo — Laterizio, Cartongesso e Blocchi',
  description: 'Tramezzature a Palermo: realizzazione di pareti divisorie in laterizio forato, cartongesso e blocchi in cls. Rapide, economiche e con isolamento incluso.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tramezzature' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tramezzature a Palermo — Laterizio, Cartongesso e Blocchi',
    description: 'Tramezzature a Palermo: realizzazione di pareti divisorie in laterizio forato, cartongesso e blocchi in cls. Rapide, economiche e con isolamento incluso.',
    url: 'https://www.digi-home-design.com/edilizia/tramezzature',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tramezzature
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Tramezzature a Palermo</h1>
      <p>Realizziamo <strong>tramezzature a Palermo</strong> per suddividere e ridistribuire gli spazi interni: pareti divisorie in laterizio forato da 8 o 12 cm, sistemi in cartongesso con intercapedine isolante, e blocchi in cls alleggerito per spessori ridotti. Ogni soluzione viene scelta in base alle esigenze di isolamento termico, acustico e di spazio.</p>
      <p style={{ marginTop: 12 }}>Le tramezzature in cartongesso sono particolarmente indicate per interventi rapidi: si posano a secco senza opere bagnate, riducendo i tempi di cantiere e la produzione di polvere. Possono ospitare canaline per impianti e intercapedini per lana di roccia fonoassorbente.</p>
      <p style={{ marginTop: 12 }}>Il servizio include la posa, la rasatura delle superfici e la preparazione per la tinteggiatura finale. Contattaci per un preventivo gratuito.</p>
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
      <Link href="/edilizia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
