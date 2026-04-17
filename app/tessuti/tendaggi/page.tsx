import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tendaggi a Palermo — Tende su Misura per Casa e Ufficio',
  description: 'Tendaggi a Palermo su misura: tende da interno, tende a rullo, tende tecniche e oscuranti. Fornitura e posa in opera. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/tessuti/tendaggi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tendaggi a Palermo — Tende su Misura per Casa e Ufficio',
    description: 'Tendaggi a Palermo su misura: tende da interno, tende a rullo, tende tecniche e oscuranti. Fornitura e posa in opera. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/tessuti/tendaggi',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/tessuti" style={{ color: '#888', textDecoration: 'underline' }}>Tessuti</Link> / Tendaggi
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Tendaggi a Palermo
      </h1>
      <p>
        Progettiamo e installiamo <strong>tendaggi su misura a Palermo</strong> per ambienti residenziali e commerciali. La nostra offerta comprende tende da interno classiche, tende a pannello, tende a rullo, sistemi oscuranti e tessuti tecnici filtranti, tutti personalizzabili per dimensione, colore e materiale.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni tendaggio viene realizzato su misura partendo dalle dimensioni reali delle tue finestre, garantendo un risultato impeccabile sia sotto il profilo estetico che funzionale. Utilizziamo tessuti certificati con proprietà di resistenza alla luce, facile lavabilità e lunga durata nel tempo.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio include sopralluogo gratuito, consulenza per la scelta del tessuto e del sistema di apertura, posa in opera e rimozione del vecchio tendaggio. Operiamo a Palermo e provincia con tempi certi e lavorazioni curate nei minimi dettagli.
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
      <Link href="/tessuti" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Tessuti
      </Link>
    </div>
  )
}
