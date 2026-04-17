import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
  description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
  alternates: { canonical: 'https://www.digi-home-design.com/strutture-metalliche' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
    description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
    url: 'https://www.digi-home-design.com/strutture-metalliche',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Strutture Metalliche a Palermo
      </h1>
      <p>
        Progettiamo e installiamo <strong>strutture metalliche a Palermo</strong> su misura: tettoie, pensiline, scale interne ed esterne, pergolati e carport in acciaio zincato e alluminio. Ogni struttura viene dimensionata da tecnici qualificati nel rispetto delle normative antisismiche e delle prescrizioni edilizie locali.
      </p>
      <p style={{ marginTop: 12 }}>
        Realizziamo sia strutture di copertura per spazi esterni — garage, aree commerciali, cortili — sia elementi decorativi e funzionali per abitazioni private. I materiali utilizzati garantiscono resistenza agli agenti atmosferici e durata nel tempo, con finiture zincate, verniciate o in acciaio inox.
      </p>
      <p style={{ marginTop: 12 }}>
        Offriamo un servizio completo: progettazione, pratica edilizia se necessaria, fornitura e montaggio con squadre specializzate. Contattaci per un sopralluogo gratuito e un preventivo su misura.
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
      <Link href="/" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
