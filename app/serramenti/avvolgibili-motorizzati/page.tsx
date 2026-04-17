import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avvolgibili Motorizzati a Palermo — Tapparelle con Automazione',
  description: 'Avvolgibili e tapparelle motorizzate a Palermo: motori tubulari con telecomando, timer e integrazione domotica. Alluminio, PVC coibentato e acciaio.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/avvolgibili-motorizzati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Avvolgibili Motorizzati a Palermo — Tapparelle con Automazione',
    description: 'Avvolgibili e tapparelle motorizzate a Palermo: motori tubulari con telecomando, timer e integrazione domotica. Alluminio, PVC coibentato e acciaio.',
    url: 'https://www.digi-home-design.com/serramenti/avvolgibili-motorizzati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Avvolgibili Motorizzati
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Avvolgibili Motorizzati a Palermo</h1>
      <p>Installiamo <strong>avvolgibili e tapparelle motorizzate a Palermo</strong>: motori tubulari silenziosi integrati nell&apos;avvolgitore con comando tramite pulsante a parete, telecomando radio o app da smartphone. Compatibili con i principali sistemi domotici — KNX, BTicino, Google Home, Alexa — per l&apos;automazione programmata in base all&apos;ora, al sole e al vento.</p>
      <p style={{ marginTop: 12 }}>Le tapparelle sono disponibili in doghe di PVC coibentato (ottimo isolamento termoacustico), alluminio estruso e acciaio zincato per applicazioni di sicurezza. I motori — Somfy, Nice, Came, Rolly — sono dotati di finecorsa meccanico o elettronico e di sistema anti-ostacolo per la sicurezza di bambini e animali.</p>
      <p style={{ marginTop: 12 }}>Installiamo motorizzazioni su avvolgibili esistenti (retrofit) senza sostituire l&apos;intera tapparella, riducendo i costi di intervento. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.</p>
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
