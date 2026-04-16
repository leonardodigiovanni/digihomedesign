import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demolizioni a Palermo — Selettive e Totali con Smaltimento',
  description: 'Demolizioni a Palermo: abbattimento di muri, tramezzi, solai e strutture. Smaltimento dei calcinacci a norma e ripristino del cantiere. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/demolizioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Demolizioni a Palermo — Selettive e Totali con Smaltimento',
    description: 'Demolizioni a Palermo: abbattimento di muri, tramezzi, solai e strutture. Smaltimento dei calcinacci a norma e ripristino del cantiere. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/edilizia/demolizioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Demolizioni
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Demolizioni a Palermo</h1>
      <p>Eseguiamo <strong>demolizioni selettive e totali a Palermo</strong>: abbattimento di tramezzi, muri non portanti, solai, pavimenti, rivestimenti e strutture in cls armato. Operiamo con attrezzatura meccanica e manuale a seconda delle condizioni del cantiere e delle strutture adiacenti da preservare.</p>
      <p style={{ marginTop: 12 }}>Prima di ogni demolizione effettuiamo un sopralluogo tecnico per verificare la natura strutturale delle pareti, la presenza di impianti nascosti e le eventuali necessità di puntellamento. Lavoriamo in sicurezza nel rispetto del D.Lgs. 81/08.</p>
      <p style={{ marginTop: 12 }}>Il servizio comprende la raccolta e il conferimento dei materiali di risulta a discarica autorizzata con formulario di trasporto. Contattaci per un preventivo gratuito.</p>
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
