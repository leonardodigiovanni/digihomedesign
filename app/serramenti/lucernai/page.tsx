import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lucernai a Palermo — Illuminazione Naturale per Tetti e Coperture',
  description: 'Lucernai e shed a Palermo su misura: cupole in policarbonato, lucernai piani in vetro e sistemi a shed per l\'illuminazione zenitale di ambienti interni.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/lucernai' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Lucernai a Palermo — Illuminazione Naturale per Tetti e Coperture',
    description: 'Lucernai e shed a Palermo su misura: cupole in policarbonato, lucernai piani in vetro e sistemi a shed per l\'illuminazione zenitale di ambienti interni.',
    url: 'https://www.digi-home-design.com/serramenti/lucernai',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Lucernai
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Lucernai a Palermo</h1>
      <p>Installiamo <strong>lucernai a Palermo</strong> per portare luce naturale zenitale in ambienti privi di finestre laterali: bagni ciechi, corridoi, vani scale, sottotetti e ambienti commerciali. Le tipologie disponibili comprendono cupole in policarbonato a doppia camera, lucernai piani in vetro temperato stratificato su telaio in alluminio, e sistemi a shed con ventilazione naturale integrata.</p>
      <p style={{ marginTop: 12 }}>I lucernai apribili — a vasistas o a motore elettrico con sensore di pioggia — consentono la ventilazione naturale dell&apos;ambiente oltre all&apos;illuminazione. Per i piani inclinati gestiamo la sigillatura del controtelaio e la guaina di raccordo con il manto impermeabile per la massima tenuta all&apos;acqua.</p>
      <p style={{ marginTop: 12 }}>Realizziamo anche la pratica SCIA per l&apos;apertura in copertura ove richiesta. Contattaci per un sopralluogo gratuito e un preventivo a Palermo.</p>
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
