import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
  description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/opere-murarie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
    description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
    url: 'https://www.digi-home-design.com/edilizia/opere-murarie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Opere Murarie
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Opere Murarie a Palermo</h1>
      <p>Realizziamo <strong>opere murarie a Palermo</strong> di ogni tipo: costruzione di nuovi muri portanti e di tamponamento, apertura di vani porta e finestra con posa di architravi, rinforzi strutturali, sopraelevazioni e ricostruzioni. Lavoriamo con laterizio, blocchi in cls, pietra naturale e sistemi a secco.</p>
      <p style={{ marginTop: 12 }}>Per le modifiche strutturali collaboriamo con tecnici abilitati (ingegneri e geometri) per la redazione dei calcoli e il deposito delle pratiche in Comune. Ogni opera è eseguita a regola d&apos;arte con materiali certificati e garanzia sul lavoro.</p>
      <p style={{ marginTop: 12 }}>Operiamo su tutto il territorio palermitano con sopralluogo gratuito e preventivo dettagliato. Contattaci per valutare il tuo intervento.</p>
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
      <Link href="/edilizia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
