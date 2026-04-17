import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Isolamenti Acustici a Palermo — Fonoisolamento e Fonoassorbimento',
  description: 'Isolamento acustico a Palermo per abitazioni, uffici e studi: pannelli fonoassorbenti, contropareti, pavimenti galleggianti e soluzioni su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/isolamenti-acustici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Isolamenti Acustici a Palermo — Fonoisolamento e Fonoassorbimento',
    description: 'Isolamento acustico a Palermo per abitazioni, uffici e studi: pannelli fonoassorbenti, contropareti, pavimenti galleggianti e soluzioni su misura.',
    url: 'https://www.digi-home-design.com/termodinamica/isolamenti-acustici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Acustici
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Isolamenti Acustici a Palermo
      </h1>
      <p>
        Il <strong>comfort acustico</strong> è parte integrante della qualità abitativa. Progettiamo e installiamo soluzioni di isolamento acustico su misura per appartamenti, uffici, studi di registrazione, sale riunioni e locali commerciali a Palermo.
      </p>
      <p style={{ marginTop: 12 }}>
        Le nostre soluzioni comprendono: contropareti con pannelli in lana di roccia o fibra di vetro, pavimenti galleggianti per ridurre i rumori da calpestio, controsoffitti fonoassorbenti e trattamenti delle giunzioni strutturali per eliminare i ponti acustici. Ogni soluzione viene progettata dopo un&apos;analisi delle frequenze e dei percorsi del rumore.
      </p>
      <p style={{ marginTop: 12 }}>
        Rispettiamo la normativa DPCM 5/12/1997 sui requisiti acustici passivi degli edifici. Contattaci per una valutazione gratuita del tuo spazio.
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
