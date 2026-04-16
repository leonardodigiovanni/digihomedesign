import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Illuminazione a Palermo — LED e Sistemi per Interni ed Esterni',
  description: 'Illuminazione LED a Palermo per interni ed esterni: progettazione, fornitura e installazione di sistemi luce per casa, ufficio e spazi commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/illuminazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Illuminazione a Palermo — LED e Sistemi per Interni ed Esterni',
    description: 'Illuminazione LED a Palermo per interni ed esterni: progettazione, fornitura e installazione di sistemi luce per casa, ufficio e spazi commerciali.',
    url: 'https://www.digi-home-design.com/elettricita/illuminazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Illuminazione
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Illuminazione a Palermo
      </h1>
      <p>
        Progettiamo sistemi di <strong>illuminazione LED a Palermo</strong> per ogni tipo di ambiente: abitazioni, uffici, negozi, ristoranti e spazi esterni. La luce giusta valorizza gli spazi, riduce i consumi e migliora il benessere visivo. Ogni progetto parte dall&apos;analisi delle esigenze illuminotecniche specifiche.
      </p>
      <p style={{ marginTop: 12 }}>
        Installiamo faretti da incasso, binari elettrificati, strip LED, lampade a sospensione, illuminazione di sicurezza e sistemi di controllo intelligente (dimmer, sensori di presenza, timer). Per gli esterni progettiamo illuminazione di giardini, facciate, vialetti e aree parcheggio.
      </p>
      <p style={{ marginTop: 12 }}>
        La sostituzione con tecnologia LED consente risparmi fino all&apos;80% sui consumi rispetto alle lampade tradizionali. Contattaci per un progetto luce gratuito.
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
      <Link href="/elettricita" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Elettricità
      </Link>
    </div>
  )
}
