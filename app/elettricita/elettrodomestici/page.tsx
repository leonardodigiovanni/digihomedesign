import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Elettrodomestici a Palermo — Fornitura e Installazione',
  description: 'Elettrodomestici a Palermo: fornitura, installazione e collegamento di grandi elettrodomestici da incasso e liberi. Assistenza post-vendita garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/elettrodomestici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Elettrodomestici a Palermo — Fornitura e Installazione',
    description: 'Elettrodomestici a Palermo: fornitura, installazione e collegamento di grandi elettrodomestici da incasso e liberi. Assistenza post-vendita garantita.',
    url: 'https://www.digi-home-design.com/elettricita/elettrodomestici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Elettrodomestici
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Elettrodomestici a Palermo
      </h1>
      <p>
        Forniamo e installiamo <strong>grandi elettrodomestici a Palermo</strong>: forni, piani cottura, lavastoviglie, frigoriferi, lavatrici e asciugatrici da incasso o liberi. Lavoriamo con i principali marchi — Bosch, Siemens, Whirlpool, Samsung, AEG — garantendo prodotti di qualità con garanzia ufficiale.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio comprende la fornitura, il trasporto, la posa in opera e il collegamento elettrico e idraulico a regola d&apos;arte. Per gli elettrodomestici da incasso gestiamo anche l&apos;adattamento del mobile e i fori di aerazione, in coordinamento con i mobilieri.
      </p>
      <p style={{ marginTop: 12 }}>
        Ritiriamo e smaltiamo il vecchio elettrodomestico nel rispetto della normativa RAEE. Contattaci per un preventivo comprensivo di fornitura e installazione.
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
