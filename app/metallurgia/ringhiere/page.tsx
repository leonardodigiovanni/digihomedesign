import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ringhiere a Palermo — Scale e Balconi in Ferro e Acciaio Inox',
  description: 'Ringhiere su misura a Palermo per scale interne, balconi e terrazze: ferro battuto, acciaio inox, alluminio e vetro. Design classico e moderno.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/ringhiere' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ringhiere a Palermo — Scale e Balconi in Ferro e Acciaio Inox',
    description: 'Ringhiere su misura a Palermo per scale interne, balconi e terrazze: ferro battuto, acciaio inox, alluminio e vetro. Design classico e moderno.',
    url: 'https://www.digi-home-design.com/metallurgia/ringhiere',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Ringhiere
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Ringhiere a Palermo</h1>
      <p>Progettiamo e installiamo <strong>ringhiere su misura a Palermo</strong> per scale interne ed esterne, balconi, terrazze e soppalchi: in ferro verniciato, acciaio inox AISI 316L, alluminio anodizzato o sistemi misti acciaio-vetro per un effetto contemporaneo di massima luminosità.</p>
      <p style={{ marginTop: 12 }}>Le ringhiere in ferro battuto vengono lavorate artigianalmente con motivi classici — a lancia, a torciglione, con rosoni — o moderne con piattina e quadro geometrico. I sistemi in acciaio inox con cavi o pannelli in vetro temperato laminato sono ideali per ambienti di design dove si vuole mantenere la continuità visiva dello spazio.</p>
      <p style={{ marginTop: 12 }}>Ogni ringhiera rispetta le norme UNI EN 13374 sull&apos;altezza e la resistenza ai carichi. Contattaci per un sopralluogo gratuito e un preventivo personalizzato.</p>
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
      <Link href="/metallurgia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
