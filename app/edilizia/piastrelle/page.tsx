import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piastrelle a Palermo — Rivestimenti per Bagni e Cucine',
  description: 'Posa piastrelle a Palermo per bagni, cucine e ambienti umidi: rivestimenti in ceramica, gres e mosaico. Fornitura e posa in opera su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/piastrelle' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Piastrelle a Palermo — Rivestimenti per Bagni e Cucine',
    description: 'Posa piastrelle a Palermo per bagni, cucine e ambienti umidi: rivestimenti in ceramica, gres e mosaico. Fornitura e posa in opera su misura.',
    url: 'https://www.digi-home-design.com/edilizia/piastrelle',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piastrelle
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Piastrelle a Palermo</h1>
      <p>Posiamo <strong>piastrelle a Palermo</strong> per rivestimenti di bagni, cucine, docce, balconi e ambienti umidi: ceramica smaltata, gres porcellanato, klinker antiscivolo, mosaico in vetro e in pietra. Curiamo ogni dettaglio dalla preparazione del supporto alla stuccatura dei giunti con prodotti epossidici o cementizi.</p>
      <p style={{ marginTop: 12 }}>Realizziamo pose a correre, sfalsate, a spina e pattern decorativi personalizzati. Per le docce a pavimento gestiamo le pendenze di scarico, la membrana impermeabilizzante sotto-piastrella e i profili di raccordo. Utilizziamo adesivi ad alta deformabilità per evitare distacchi nel tempo.</p>
      <p style={{ marginTop: 12 }}>Offriamo anche il servizio di fornitura con selezione del materiale presso i nostri fornitori convenzionati. Contattaci per un preventivo gratuito.</p>
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
