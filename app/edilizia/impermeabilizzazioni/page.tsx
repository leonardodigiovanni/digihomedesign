import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impermeabilizzazioni a Palermo — Terrazzi, Bagni e Fondamenta',
  description: 'Impermeabilizzazioni a Palermo: guaine liquide e bituminose per terrazzi, balconi, bagni, coperture e fondamenta. Interventi su infiltrazioni e perdite.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/impermeabilizzazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impermeabilizzazioni a Palermo — Terrazzi, Bagni e Fondamenta',
    description: 'Impermeabilizzazioni a Palermo: guaine liquide e bituminose per terrazzi, balconi, bagni, coperture e fondamenta. Interventi su infiltrazioni e perdite.',
    url: 'https://www.digi-home-design.com/edilizia/impermeabilizzazioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Impermeabilizzazioni
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Impermeabilizzazioni a Palermo</h1>
      <p>Realizziamo <strong>impermeabilizzazioni a Palermo</strong> per terrazzi praticabili e non, balconi, bagni, docce, coperture piane, fondamenta e pareti interrate. Utilizziamo guaine bituminose a caldo, membrane liquide poliuretaniche, guaine in EPDM e sistemi cristallizzanti per murature.</p>
      <p style={{ marginTop: 12 }}>Prima di ogni impermeabilizzazione effettuiamo la diagnosi dell&apos;umidità e delle perdite attive, la rimozione del vecchio manto e la preparazione del supporto. Applichiamo i primer di aggrappaggio e il ciclo impermeabilizzante in più strati per garantire la tenuta nel tempo. Tutti gli interventi sono garantiti.</p>
      <p style={{ marginTop: 12 }}>Disponiamo anche di sistemi di impermeabilizzazione sotto-piastrella per docce e terrazze rivestite. Contattaci per un sopralluogo gratuito a Palermo e provincia.</p>
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
