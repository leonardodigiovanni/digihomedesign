import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Persiane in Alluminio a Palermo — Fornitura e Installazione',
  description: 'Persiane in alluminio a Palermo: avvolgibili, veneziane e scuri su misura. Resistenti, eleganti e durevoli. Installazione professionale e preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/persiane' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Persiane in Alluminio a Palermo — Fornitura e Installazione',
    description: 'Persiane in alluminio a Palermo: avvolgibili, veneziane e scuri su misura. Resistenti, eleganti e durevoli. Installazione professionale e preventivo gratuito.',
    url: 'https://www.digi-home-design.com/persiane',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Persiane in Alluminio a Palermo
      </h1>
      <p>
        Le nostre <strong>persiane in alluminio a Palermo</strong> coniugano design moderno, durabilità e funzionalità: avvolgibili motorizzati, veneziane orientabili e scuri a battente realizzati con profili in alluminio pressofuso, resistenti alla corrosione e agli agenti atmosferici tipici del clima siciliano.
      </p>
      <p style={{ marginTop: 12 }}>
        Disponibili in un&apos;ampia gamma di colori RAL e finiture, le nostre persiane si adattano a qualsiasi stile architettonico, dal classico al contemporaneo. Offriamo anche soluzioni motorizzate con comando a distanza o integrazione con sistemi domotici.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio include sopralluogo, rilevazione misure, fornitura e montaggio professionale con pulizia finale del cantiere. Richiedi il tuo preventivo gratuito e personalizzato.
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
