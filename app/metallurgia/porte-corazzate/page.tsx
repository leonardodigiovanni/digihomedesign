import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porte Corazzate a Palermo — Acciaio su Misura',
  description: 'Porte corazzate a Palermo su misura in acciaio: per abitazioni, uffici e locali commerciali. Serrature multipunto, pannelli personalizzabili, posa inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/porte-corazzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Corazzate a Palermo — Acciaio su Misura',
    description: 'Porte corazzate a Palermo su misura in acciaio: per abitazioni, uffici e locali commerciali. Serrature multipunto, pannelli personalizzabili, posa inclusa.',
    url: 'https://www.digi-home-design.com/metallurgia/porte-corazzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Corazzate
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Porte Corazzate a Palermo</h1>
      <p>Realizziamo e installiamo <strong>porte corazzate su misura a Palermo</strong> in acciaio per abitazioni, uffici, magazzini e locali commerciali: struttura in lamiera d&apos;acciaio piegata e saldata, rinforzi interni perimetrali, serratura multipunto a tre o cinque punti di chiusura con catenacci superiori e inferiori. Ogni porta è costruita artigianalmente nelle nostre officine su misura del vano, eliminando la necessità di adattamenti in cantiere.</p>
      <p style={{ marginTop: 12 }}>Il pannello esterno può essere rivestito in acciaio verniciato a polvere in qualsiasi colore RAL, lamiera bugnata o pannello decorativo su richiesta. Le cerniere in acciaio inox con cuscinetti garantiscono scorrimento fluido e resistenza nel tempo. Su richiesta installiamo serratura elettronica con codice, cilindro europeo ad alta sicurezza o sistema di apertura remota.</p>
      <p style={{ marginTop: 12 }}>Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.</p>
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
