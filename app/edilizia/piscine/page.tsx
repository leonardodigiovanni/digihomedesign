import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piscine a Palermo — Costruzione e Ristrutturazione',
  description: 'Piscine a Palermo: costruzione di piscine interrate su misura, ristrutturazione e impermeabilizzazione di vasche esistenti. Impianti di filtrazione inclusi.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/piscine' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Piscine a Palermo — Costruzione e Ristrutturazione',
    description: 'Piscine a Palermo: costruzione di piscine interrate su misura, ristrutturazione e impermeabilizzazione di vasche esistenti. Impianti di filtrazione inclusi.',
    url: 'https://www.digi-home-design.com/edilizia/piscine',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piscine
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Piscine a Palermo</h1>
      <p>Realizziamo <strong>piscine a Palermo</strong> su misura: interrate in cls armato con rivestimento in liner PVC, in mosaico di vetro, in resina o in gres porcellanato. Progettiamo la vasca in base allo spazio disponibile, alle normative locali e alle preferenze estetiche del cliente, con forme libere o geometriche.</p>
      <p style={{ marginTop: 12 }}>Il servizio è chiavi in mano: scavo, opere in cls, impermeabilizzazione, rivestimento, impianto di filtrazione e circolazione, skimmer, scalette, luci subacquee e automatismi per la copertura. Installiamo anche sistemi di trattamento acqua a sale, UV o ozono per ridurre l&apos;uso di cloro.</p>
      <p style={{ marginTop: 12 }}>Eseguiamo anche il rifacimento e l&apos;impermeabilizzazione di piscine esistenti con sostituzione del liner o applicazione di rivestimenti in resina poliuretanica. Contattaci per un sopralluogo e un progetto gratuito.</p>
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
