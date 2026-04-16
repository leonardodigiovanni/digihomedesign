import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soprammobili a Palermo — Complementi d\'Arredo Selezionati',
  description: 'Soprammobili e complementi d\'arredo a Palermo: oggetti decorativi di qualità per completare e personalizzare ogni ambiente della casa.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi/soprammobili' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Soprammobili a Palermo — Complementi d\'Arredo Selezionati',
    description: 'Soprammobili e complementi d\'arredo a Palermo: oggetti decorativi di qualità per completare e personalizzare ogni ambiente della casa.',
    url: 'https://www.digi-home-design.com/arredi/soprammobili',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/arredi" style={{ color: '#888', textDecoration: 'underline' }}>Arredi</Link> / Soprammobili
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Soprammobili a Palermo
      </h1>
      <p>
        I <strong>soprammobili</strong> sono i dettagli che completano un arredo e rivelano la personalità di chi abita uno spazio. Proponiamo una selezione di complementi d&apos;arredo di qualità: vasi, sculture, centrotavola, oggettistica etnica e moderna, scelti per abbinarsi a ogni stile abitativo.
      </p>
      <p style={{ marginTop: 12 }}>
        Collaboriamo con fornitori selezionati per offrirti pezzi originali e di qualità, con un occhio sempre attento al rapporto tra estetica e prezzo. Il servizio di consulenza è gratuito: ti aiutiamo a scegliere gli oggetti giusti in base agli ambienti da arredare e al budget disponibile.
      </p>
      <p style={{ marginTop: 12 }}>
        Disponibile anche la fornitura per ambienti professionali, reception, uffici e spazi commerciali a Palermo e provincia.
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
      <Link href="/arredi" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna ad Arredi
      </Link>
    </div>
  )
}
