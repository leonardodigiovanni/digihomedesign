import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tapparelle Manuali a Palermo — PVC, Alluminio e Acciaio su Misura',
  description: 'Tapparelle manuali a Palermo su misura: cinghia, manovella o moschettone in PVC coibentato, alluminio estruso e acciaio. Fornitura e posa con garanzia.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/tapparelle-manuali' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tapparelle Manuali a Palermo — PVC, Alluminio e Acciaio su Misura',
    description: 'Tapparelle manuali a Palermo su misura: cinghia, manovella o moschettone in PVC coibentato, alluminio estruso e acciaio. Fornitura e posa con garanzia.',
    url: 'https://www.digi-home-design.com/serramenti/tapparelle-manuali',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Tapparelle Manuali
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Tapparelle Manuali a Palermo</h1>
      <p>Forniamo e installiamo <strong>tapparelle manuali su misura a Palermo</strong> in PVC coibentato, alluminio estruso e acciaio zincato: a cinghia, a manovella laterale o a moschettone, con avvolgitore a cassonetto incassato o a vista. Le tapparelle manuali sono la soluzione più semplice e affidabile per oscuramento, isolamento termoacustico e sicurezza delle aperture.</p>
      <p style={{ marginTop: 12 }}>Le doghe in PVC coibentato garantiscono ottimo isolamento termico e acustico, riducendo i ponti freddi e il rumore esterno. Le doghe in alluminio estruso sono più leggere e resistenti alla corrosione, ideali per ambienti marini o ad alta umidità. Disponibili in tutti i colori RAL e con finiture effetto legno.</p>
      <p style={{ marginTop: 12 }}>Ogni tapparella viene misurata sul posto e realizzata su misura. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
