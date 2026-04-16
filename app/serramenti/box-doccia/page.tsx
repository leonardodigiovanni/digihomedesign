import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Box Doccia a Palermo — Vetro Temperato su Misura',
  description: 'Box doccia a Palermo su misura in vetro temperato: scorrevoli, a battente, walk-in e nicchia. Profili in alluminio anodizzato o finitura nera opaca.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/box-doccia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Box Doccia a Palermo — Vetro Temperato su Misura',
    description: 'Box doccia a Palermo su misura in vetro temperato: scorrevoli, a battente, walk-in e nicchia. Profili in alluminio anodizzato o finitura nera opaca.',
    url: 'https://www.digi-home-design.com/serramenti/box-doccia',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Box Doccia
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Box Doccia a Palermo</h1>
      <p>Realizziamo <strong>box doccia su misura a Palermo</strong> in vetro temperato da 6, 8 e 10 mm: a battente, scorrevole su binario, a libro e walk-in senza telaio per il massimo effetto minimalista. Ogni box viene misurato sul posto e tagliato alla dimensione esatta del piatto o della doccia a pavimento, senza spazi di infiltrazione.</p>
      <p style={{ marginTop: 12 }}>I profili di supporto sono in alluminio anodizzato argento, oro satinato, cromo lucido o nella moderna finitura nera opaca — abbinabile alla rubinetteria dark di tendenza. Il vetro è disponibile trasparente, acidato satinato o con pellicola decorativa, ed è trattato con anti-calcare permanente per facilitare la pulizia.</p>
      <p style={{ marginTop: 12 }}>Installiamo anche docce in muratura con sola parete laterale e nicchie senza telaio. Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo.</p>
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
