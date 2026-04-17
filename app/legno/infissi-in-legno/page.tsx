import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infissi in Legno a Palermo — Finestre e Porte-Finestre su Misura',
  description: 'Infissi in legno a Palermo su misura: finestre, porte-finestre e scorrevoli in legno naturale o legno-alluminio. Alta efficienza termica e design senza tempo.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/infissi-in-legno' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in Legno a Palermo — Finestre e Porte-Finestre su Misura',
    description: 'Infissi in legno a Palermo su misura: finestre, porte-finestre e scorrevoli in legno naturale o legno-alluminio. Alta efficienza termica e design senza tempo.',
    url: 'https://www.digi-home-design.com/legno/infissi-in-legno',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Infissi in Legno
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Infissi in Legno a Palermo
      </h1>
      <p>
        Gli <strong>infissi in legno a Palermo</strong> rappresentano la scelta classica per chi cerca estetica senza tempo unita a eccellenti prestazioni termoacustiche. Realizziamo finestre, porte-finestre e scorrevoli in legno massiccio — larice, meranti, iroko — con vetrocamera a bassa emissività e ferramenta di qualità europea.
      </p>
      <p style={{ marginTop: 12 }}>
        Proponiamo anche il sistema <strong>legno-alluminio</strong>: la parte interna in legno garantisce calore e bellezza, mentre il rivestimento esterno in alluminio protegge dall&apos;aggressione degli agenti atmosferici, eliminando quasi del tutto la manutenzione periodica della verniciatura.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni infisso viene realizzato su misura con sopralluogo incluso, installazione professionale e garanzia sul prodotto e sulla posa. Contattaci per un preventivo gratuito a Palermo e provincia.
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
      <Link href="/legno" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Legno
      </Link>
    </div>
  )
}
