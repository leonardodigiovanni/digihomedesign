import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rivestimento Compensato a Palermo — Pareti e Soffitti in Legno',
  description: 'Rivestimenti in compensato a Palermo per pareti, soffitti e superfici decorative. Pannelli idrorepellenti, ignifughi e personalizzabili per ogni ambiente.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/rivestimento-compensato' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Rivestimento Compensato a Palermo — Pareti e Soffitti in Legno',
    description: 'Rivestimenti in compensato a Palermo per pareti, soffitti e superfici decorative. Pannelli idrorepellenti, ignifughi e personalizzabili per ogni ambiente.',
    url: 'https://www.digi-home-design.com/legno/rivestimento-compensato',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Rivestimento Compensato
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Rivestimento Compensato a Palermo
      </h1>
      <p>
        I <strong>rivestimenti in compensato</strong> offrono versatilità e calore a pareti, soffitti e superfici decorative, con un peso contenuto e una posa più rapida rispetto al massello. Utilizziamo pannelli multistrato di betulla, okumé e pioppo in diversi spessori, con finiture impiallacciate in essenza naturale, laccate o con pellicole decorative.
      </p>
      <p style={{ marginTop: 12 }}>
        Le applicazioni sono molteplici: boiserie per soggiorni e camere, rivestimenti per scale e battiscopa, controsoffitti in legno, pareti attrezzate e fondali per librerie e armadi. Realizziamo anche pannelli sagomati e fresati a CNC per effetti decorativi su misura.
      </p>
      <p style={{ marginTop: 12 }}>
        Disponibili pannelli idrorepellenti per bagni e cucine, e versioni ignifughe per ambienti pubblici e commerciali. Contattaci per un preventivo gratuito a Palermo e provincia.
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
