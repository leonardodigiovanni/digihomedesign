import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pavimenti a Palermo — Ceramica, Gres, Marmo e Naturale',
  description: 'Posa pavimenti a Palermo: ceramica, gres porcellanato, marmo, pietra naturale e resina. Posa a correre, a spina, diagonale e a posa a piena colla.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/pavimenti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pavimenti a Palermo — Ceramica, Gres, Marmo e Naturale',
    description: 'Posa pavimenti a Palermo: ceramica, gres porcellanato, marmo, pietra naturale e resina. Posa a correre, a spina, diagonale e a posa a piena colla.',
    url: 'https://www.digi-home-design.com/edilizia/pavimenti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Pavimenti
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Pavimenti a Palermo</h1>
      <p>Posiamo <strong>pavimenti a Palermo</strong> in ogni materiale: ceramica, gres porcellanato grande formato, marmo, travertino, pietra lavica, cotto e pavimenti in resina. Curiamo la preparazione del sottofondo, la scelta della colla e delle fughe in base al materiale e all&apos;ambiente, e la stuccatura finale.</p>
      <p style={{ marginTop: 12 }}>Eseguiamo posature tradizionali a correre, a spina di pesce, a opus incertum e posature a grande formato con piastrelle fino a 120×280 cm. Per i pavimenti in resina gestiamo primer, strato di base, decorazione e finitura protettiva in un unico ciclo continuo senza fughe.</p>
      <p style={{ marginTop: 12 }}>Disponiamo di taglierine a acqua per tagli precisi su ogni formato. Contattaci per un preventivo al metro quadro con campionatura gratuita.</p>
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
