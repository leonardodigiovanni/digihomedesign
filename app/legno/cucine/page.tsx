import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cucine in Legno a Palermo — Su Misura Classiche e Moderne',
  description: 'Cucine in legno a Palermo su misura: componibili in legno naturale o laccato, cucine in muratura e progettazione personalizzata. Installazione chiavi in mano.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/cucine' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Cucine in Legno a Palermo — Su Misura Classiche e Moderne',
    description: 'Cucine in legno a Palermo su misura: componibili in legno naturale o laccato, cucine in muratura e progettazione personalizzata. Installazione chiavi in mano.',
    url: 'https://www.digi-home-design.com/legno/cucine',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Cucine
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Cucine in Legno a Palermo
      </h1>
      <p>
        Progettiamo e realizziamo <strong>cucine in legno su misura a Palermo</strong>: componibili con ante in legno naturale, noce, rovere o laccato, e cucine in muratura con rivestimenti in pietra o ceramica. Ogni cucina è progettata partendo dalla planimetria reale dello spazio, ottimizzando ergonomia e contenitori.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio è chiavi in mano: dalla progettazione 3D alla fornitura dei mobili, dal montaggio al collegamento degli elettrodomestici da incasso, fino alla posa del piano lavoro in legno, marmo, quarzo o acciaio. Gestiamo anche le opere murarie, idrauliche ed elettriche necessarie.
      </p>
      <p style={{ marginTop: 12 }}>
        Collaboriamo con i principali produttori italiani di cucine per offrirti qualità certificata con garanzia pluriennale. Contattaci per una consulenza e un progetto gratuito.
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
