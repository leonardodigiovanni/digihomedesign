import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lampadari a Palermo — Illuminazione Design per la Casa',
  description: 'Lampadari e illuminazione design a Palermo: selezione di punti luce, lampadari e applique per valorizzare ogni ambiente con luce e stile.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi/lampadari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Lampadari a Palermo — Illuminazione Design per la Casa',
    description: 'Lampadari e illuminazione design a Palermo: selezione di punti luce, lampadari e applique per valorizzare ogni ambiente con luce e stile.',
    url: 'https://www.digi-home-design.com/arredi/lampadari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/arredi" style={{ color: '#888', textDecoration: 'underline' }}>Arredi</Link> / Lampadari
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Lampadari a Palermo
      </h1>
      <p>
        L&apos;illuminazione è uno degli elementi che più influenzano l&apos;atmosfera di un ambiente. Proponiamo una selezione di <strong>lampadari e punti luce design</strong> per ogni stanza della casa: dal lampadario da salone di grande impatto visivo alle applique discrete per camera da letto, dalle sospensioni moderne per cucina e sala pranzo ai faretti da incasso per corridoi e bagni.
      </p>
      <p style={{ marginTop: 12 }}>
        Tutti i prodotti sono selezionati tra marchi affidabili, con certificazioni di sicurezza e garanzia. Offriamo consulenza per la scelta del tipo di luce, della temperatura colore e della potenza in base all&apos;uso dell&apos;ambiente, con particolare attenzione all&apos;efficienza energetica (LED).
      </p>
      <p style={{ marginTop: 12 }}>
        La fornitura include il montaggio professionale a cura dei nostri elettricisti abilitati. Operiamo a Palermo e provincia con sopralluogo gratuito.
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
      <Link href="/arredi" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna ad Arredi
      </Link>
    </div>
  )
}
