import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Climatizzazione a Palermo — Condizionatori e Impianti',
  description: 'Climatizzazione a Palermo: vendita, installazione e manutenzione di condizionatori monosplit, multisplit e sistemi centralizzati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/climatizzazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Climatizzazione a Palermo — Condizionatori e Impianti',
    description: 'Climatizzazione a Palermo: vendita, installazione e manutenzione di condizionatori monosplit, multisplit e sistemi centralizzati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/termodinamica/climatizzazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Climatizzazione
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Climatizzazione a Palermo
      </h1>
      <p>
        Installiamo e manuteniamo <strong>impianti di climatizzazione a Palermo</strong> per abitazioni, uffici e locali commerciali: sistemi monosplit, multisplit e VRF per edifici con più unità. Lavoriamo con i principali marchi del settore — Daikin, Mitsubishi, Fujitsu, Samsung — garantendo efficienza energetica e silenziosità.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio comprende sopralluogo gratuito, progettazione dell&apos;impianto, fornitura delle unità, posa dei circuiti frigoriferi e collaudo finale. Ci occupiamo anche della ricarica del gas refrigerante e della manutenzione periodica per mantenere le prestazioni nel tempo.
      </p>
      <p style={{ marginTop: 12 }}>
        Tutti gli impianti vengono installati da tecnici certificati F-Gas in conformità alla normativa vigente. Contattaci per un preventivo gratuito.
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
      <Link href="/termodinamica" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Termodinamica
      </Link>
    </div>
  )
}
