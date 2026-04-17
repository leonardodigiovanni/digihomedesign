import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zanzariere a Palermo — A Rullo, Plissé e Telaio Fisso su Misura',
  description: 'Zanzariere su misura a Palermo: a rullo verticale, plissé, a telaio fisso e scorrevoli. Per finestre, porte e aperture di qualsiasi dimensione. Posa inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/zanzariere' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Zanzariere a Palermo — A Rullo, Plissé e Telaio Fisso su Misura',
    description: 'Zanzariere su misura a Palermo: a rullo verticale, plissé, a telaio fisso e scorrevoli. Per finestre, porte e aperture di qualsiasi dimensione. Posa inclusa.',
    url: 'https://www.digi-home-design.com/serramenti/zanzariere',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Zanzariere
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Zanzariere a Palermo</h1>
      <p>Realizziamo e installiamo <strong>zanzariere su misura a Palermo</strong> per ogni tipo di apertura: a telaio fisso estraibile per finestre standard, a rullo verticale con molla a richiamoautomatico, plissé orizzontale per porte-finestre e balconi, scorrevoli su binario laterale per grandi aperture e zanzariere a soffitto per verande e porticati.</p>
      <p style={{ marginTop: 12 }}>I telai sono in alluminio anodizzato o verniciato, abbinabili al colore degli infissi esistenti. Le reti sono disponibili in fibra di vetro standard, in acciaio inox per ambienti marini, anti-polline ad alta densità e con trattamento antizanzara larvicida. I sistemi a rullo con cassonetto integrato nell&apos;infisso sono la soluzione più elegante perché invisibili quando non in uso.</p>
      <p style={{ marginTop: 12 }}>Ogni zanzariera viene misurata sul posto e prodotta su misura in pochi giorni. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
      <Link href="/serramenti" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
