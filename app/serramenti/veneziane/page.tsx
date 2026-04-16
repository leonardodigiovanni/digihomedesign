import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veneziane a Palermo — Interne ed Esterne su Misura',
  description: 'Veneziane a Palermo su misura: veneziane in alluminio da interni, veneziane esterne in alluminio e veneziane integrate nel vetrocamera. Controllo luce perfetto.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/veneziane' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Veneziane a Palermo — Interne ed Esterne su Misura',
    description: 'Veneziane a Palermo su misura: veneziane in alluminio da interni, veneziane esterne in alluminio e veneziane integrate nel vetrocamera. Controllo luce perfetto.',
    url: 'https://www.digi-home-design.com/serramenti/veneziane',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Veneziane
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Veneziane a Palermo</h1>
      <p>Forniamo e installiamo <strong>veneziane su misura a Palermo</strong> in tre configurazioni: veneziane da interno in alluminio con stecche da 16, 25 o 50 mm per uffici e abitazioni; veneziane esterne in alluminio estruso ad alta resistenza per la protezione solare delle facciate; e veneziane integrate nel vetrocamera — racchiuse tra i due vetri — per il controllo della luce senza polvere e senza manutenzione.</p>
      <p style={{ marginTop: 12 }}>Le stecche sono orientabili e sollevabili tramite cordino, catena o motorizzazione. I colori disponibili coprono l&apos;intera gamma RAL con finiture opache, lucide e in legno vero per le versioni da interno di pregio. Le veneziane esterne sono motorizzabili e integrabili nei sistemi domotici per il controllo automatico in base all&apos;irraggiamento.</p>
      <p style={{ marginTop: 12 }}>Ogni veneziana viene misurata sul posto e realizzata su misura. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
