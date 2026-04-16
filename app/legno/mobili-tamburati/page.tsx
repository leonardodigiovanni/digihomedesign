import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobili Tamburati a Palermo — Design Leggero e Moderno',
  description: 'Mobili tamburati a Palermo: armadi, librerie e sistemi componibili in legno tamburato con finiture laccate o impiallacciate. Leggeri, moderni e su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/mobili-tamburati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mobili Tamburati a Palermo — Design Leggero e Moderno',
    description: 'Mobili tamburati a Palermo: armadi, librerie e sistemi componibili in legno tamburato con finiture laccate o impiallacciate. Leggeri, moderni e su misura.',
    url: 'https://www.digi-home-design.com/legno/mobili-tamburati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Mobili Tamburati
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Mobili Tamburati a Palermo
      </h1>
      <p>
        I <strong>mobili tamburati</strong> combinano la struttura in legno con pannelli alleggeriti internamente, ottenendo superfici ampie e regolari con un peso ridotto rispetto al massello. Sono ideali per armadi con ante lisce e specchiate, librerie a tutta parete, sistemi componibili per ufficio e camerette.
      </p>
      <p style={{ marginTop: 12 }}>
        Le finiture disponibili spaziano dal laccato lucido o opaco, all&apos;impiallacciato in essenza naturale, al rivestimento in melamminico per ambienti ad alto utilizzo. I bordi vengono rifiniti con ABS o impiallacciatura per un aspetto pulito e resistente all&apos;usura.
      </p>
      <p style={{ marginTop: 12 }}>
        Realizziamo su misura in base alle dimensioni del tuo spazio, con accessori interni (cassetti, portabiti, moduli scarpe) scelti insieme al cliente. Contattaci per un preventivo gratuito con progetto 3D.
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
