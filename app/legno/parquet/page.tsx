import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parquet a Palermo — Posa, Levigatura e Trattamento',
  description: 'Parquet a Palermo: posa di parquet in legno massello, prefinito e laminato. Levigatura, trattamento e ripristino di pavimenti esistenti. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/parquet' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Parquet a Palermo — Posa, Levigatura e Trattamento',
    description: 'Parquet a Palermo: posa di parquet in legno massello, prefinito e laminato. Levigatura, trattamento e ripristino di pavimenti esistenti. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/legno/parquet',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Parquet
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Parquet a Palermo
      </h1>
      <p>
        Posiamo <strong>parquet a Palermo</strong> in legno massello, prefinito e laminato: pavimenti a listoni, a pannelli, a spina di pesce o con posature personalizzate. Lavoriamo con le principali essenze — rovere, noce, ciliegio, bambù — in vari formati e finiture: naturale oliato, laccato, spazzolato o affumicato.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio include la preparazione del sottofondo (massetto autolivellante se necessario), la posa incollata, flottante o chiodatura, la levigatura a terra e il trattamento finale con olio o vernice protettiva. Eseguiamo anche il ripristino e la levigatura di parquet esistenti danneggiati o semplicemente opachi.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo a Palermo e provincia con attrezzatura professionale e polvere aspirata direttamente dalla levigatrice. Contattaci per un sopralluogo gratuito e un preventivo al metro quadro.
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
