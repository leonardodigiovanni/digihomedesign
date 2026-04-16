import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impianti Elettrici a Palermo — Civili e Industriali a Norma',
  description: 'Impianti elettrici a Palermo: progettazione, realizzazione e messa a norma per abitazioni, uffici e strutture commerciali. Dichiarazione di conformità inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/impianti-elettrici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impianti Elettrici a Palermo — Civili e Industriali a Norma',
    description: 'Impianti elettrici a Palermo: progettazione, realizzazione e messa a norma per abitazioni, uffici e strutture commerciali. Dichiarazione di conformità inclusa.',
    url: 'https://www.digi-home-design.com/elettricita/impianti-elettrici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Impianti Elettrici
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Impianti Elettrici a Palermo
      </h1>
      <p>
        Realizziamo <strong>impianti elettrici civili e industriali a Palermo</strong> nel pieno rispetto della normativa CEI e del D.M. 37/08. Dalla progettazione alla messa in servizio, ogni intervento è eseguito da elettricisti abilitati con rilascio della dichiarazione di conformità (DICO).
      </p>
      <p style={{ marginTop: 12 }}>
        I nostri servizi comprendono: nuovi impianti per costruzioni e ristrutturazioni, messa a norma di impianti obsoleti, ampliamenti e modifiche, installazione di quadri elettrici, impianti di terra e protezione da scariche atmosferiche, cablaggi strutturati e impianti speciali.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo su tutto il territorio palermitano con sopralluogo gratuito e preventivo trasparente. Contattaci per valutare il tuo intervento.
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
