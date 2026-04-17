import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobili in Massello a Palermo — Artigianato in Legno Pieno',
  description: 'Mobili in legno massello a Palermo: armadi, librerie, tavoli e complementi artigianali in rovere, noce, ciliegio e altre essenze pregiate. Su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/mobili-in-massello' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mobili in Massello a Palermo — Artigianato in Legno Pieno',
    description: 'Mobili in legno massello a Palermo: armadi, librerie, tavoli e complementi artigianali in rovere, noce, ciliegio e altre essenze pregiate. Su misura.',
    url: 'https://www.digi-home-design.com/legno/mobili-in-massello',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Mobili in Massello
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Mobili in Massello a Palermo
      </h1>
      <p>
        I <strong>mobili in legno massello</strong> sono l&apos;espressione più autentica dell&apos;artigianato del legno: costruiti in legno pieno senza pannelli di supporto, resistono nel tempo e migliorano con gli anni. Realizziamo armadi, librerie, comodini, tavoli, sedie e complementi su misura nelle essenze più pregiate: rovere, noce nazionale, ciliegio, castagno e frassino.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni pezzo viene lavorato artigianalmente nel rispetto delle venature naturali del legno, con giunzioni a incastro o con tasselli in legno per la massima solidità. Le finiture includono oli naturali, cere, vernici all&apos;acqua o a solvente a seconda dell&apos;uso previsto.
      </p>
      <p style={{ marginTop: 12 }}>
        Progettiamo su disegno del cliente o proponiamo soluzioni ad hoc per ogni ambiente. Contattaci per un preventivo gratuito.
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
      <Link href="/legno" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Legno
      </Link>
    </div>
  )
}
