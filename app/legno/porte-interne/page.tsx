import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porte Interne a Palermo — Legno su Misura Battenti e Scorrevoli',
  description: 'Porte interne in legno a Palermo: battenti, scorrevoli e filomuro su misura. Ampia scelta di essenze, finiture e accessori. Posa in opera inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/porte-interne' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Interne a Palermo — Legno su Misura Battenti e Scorrevoli',
    description: 'Porte interne in legno a Palermo: battenti, scorrevoli e filomuro su misura. Ampia scelta di essenze, finiture e accessori. Posa in opera inclusa.',
    url: 'https://www.digi-home-design.com/legno/porte-interne',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Porte Interne
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Porte Interne a Palermo
      </h1>
      <p>
        Forniamo e installiamo <strong>porte interne in legno a Palermo</strong> su misura: battenti singoli e doppi, scorrevoli a binario esterno o con kit filomuro, e soluzioni a soffietto. Lavoriamo con essenze naturali — rovere, noce, ciliegio, faggio — e con pannelli laccati o rivestiti in laminato per ogni gusto e budget.
      </p>
      <p style={{ marginTop: 12 }}>
        La posa in opera include la rimozione della vecchia porta, la preparazione del vano, il montaggio del telaio e dell&apos;anta, la regolazione delle cerniere e dei maniglioni, e il ritocco della tinteggiatura circostante. Lavoriamo in coordinamento con gli altri artigiani del cantiere per non creare ritardi.
      </p>
      <p style={{ marginTop: 12 }}>
        Offriamo sopralluogo gratuito con campionario fisico delle finiture. Contattaci per un preventivo personalizzato.
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
