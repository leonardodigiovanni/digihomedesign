import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grate di Sicurezza a Palermo — Finestre e Vani in Ferro',
  description: 'Grate di sicurezza a Palermo per finestre, vani e aperture: in ferro quadro, tondo e acciaio inox. Fisse, apribili a cardine e scorrevoli. Su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/grate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Grate di Sicurezza a Palermo — Finestre e Vani in Ferro',
    description: 'Grate di sicurezza a Palermo per finestre, vani e aperture: in ferro quadro, tondo e acciaio inox. Fisse, apribili a cardine e scorrevoli. Su misura.',
    url: 'https://www.digi-home-design.com/metallurgia/grate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Grate
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Grate di Sicurezza a Palermo</h1>
      <p>Realizziamo e installiamo <strong>grate di sicurezza a Palermo</strong> per la protezione di finestre, vani cantina, bocche di lupo e aperture di qualsiasi dimensione. Lavoriamo con ferro quadro, piatto e tondo, acciaio inox AISI 304 e alluminio, con saldature a piena penetrazione e verniciatura a polvere epossidica.</p>
      <p style={{ marginTop: 12 }}>Le grate sono disponibili in versione fissa a muro, apribile a cardine con serratura di sicurezza (obbligatoria come via di fuga secondo il D.M. 9/04/1994), o scorrevole su binario. I pattern decorativi spaziano dal classico a lancia al moderno geometrico, con possibilità di inserire motivi personalizzati in ferro battuto.</p>
      <p style={{ marginTop: 12 }}>Ogni grata viene misurata sul posto e realizzata su misura. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.</p>
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
