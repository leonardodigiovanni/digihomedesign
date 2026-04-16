import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: serramenti, arredi, sistemi termici, elettrici e molto altro. Sempre aggiornati.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/cataloghi' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Cataloghi
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Cataloghi</h1>
      <p>Consulta e scarica i nostri cataloghi prodotti aggiornati: trovi schede tecniche, varianti di colore e finitura, dimensioni standard e prezzi indicativi per tutte le categorie di intervento — serramenti, arredo, impianti, edilizia e strutture metalliche.</p>
      <p style={{ marginTop: 12 }}>I cataloghi sono in formato PDF e vengono aggiornati periodicamente con le ultime novità di prodotto. Per un preventivo personalizzato contattaci direttamente.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
