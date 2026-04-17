import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galleria Lavori — Digi Home Design Palermo',
  description: 'Galleria fotografica dei lavori realizzati da Digi Home Design a Palermo: ristrutturazioni, serramenti, arredi, impianti e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/galleria' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Galleria
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Galleria Lavori</h1>
      <p>Sfoglia la nostra galleria fotografica con i principali lavori realizzati a Palermo e provincia: ristrutturazioni complete, posa serramenti, arredamenti su misura, impianti termici ed elettrici, strutture metalliche e molto altro.</p>
      <p style={{ marginTop: 12 }}>Ogni progetto racconta una storia diversa — materiali scelti insieme al cliente, soluzioni su misura per ogni spazio, risultati che durano nel tempo.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
