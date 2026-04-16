import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
  description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/irrigazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
    description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
    url: 'https://www.digi-home-design.com/termodinamica/irrigazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Irrigazione
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Irrigazione a Palermo
      </h1>
      <p>
        Progettiamo e installiamo <strong>impianti di irrigazione automatica a Palermo</strong> per giardini privati, terrazzi, aiuole condominiali e spazi verdi commerciali. Sistemi a goccia per orti e aiuole, irrigatori a pioggia per prati, e microirrigatori per vasi e fioriere: ogni soluzione è dimensionata sulle reali esigenze della vegetazione.
      </p>
      <p style={{ marginTop: 12 }}>
        Gli impianti sono dotati di programmatori digitali o smart (controllabili da smartphone) per ottimizzare i consumi idrici in base alla stagione e alle condizioni climatiche. Integriamo sensori di pioggia e umidità per evitare sprechi.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio comprende sopralluogo gratuito, progettazione del layout, posa delle tubazioni interrate, collegamento alla rete idrica e collaudo finale. Contattaci per un preventivo su misura.
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
      <Link href="/termodinamica" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Termodinamica
      </Link>
    </div>
  )
}
