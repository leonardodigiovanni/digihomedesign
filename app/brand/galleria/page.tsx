import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galleria Lavori — Digi Home Design Palermo',
  description: 'Galleria fotografica dei lavori realizzati da Digi Home Design a Palermo: ristrutturazioni, serramenti, arredi, impianti e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/galleria' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Galleria
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Galleria Lavori</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Sfoglia la nostra galleria fotografica con i principali lavori realizzati a Palermo e provincia: ristrutturazioni complete, posa serramenti, arredamenti su misura, impianti termici ed elettrici, strutture metalliche e molto altro.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Ogni progetto racconta una storia diversa — materiali scelti insieme al cliente, soluzioni su misura per ogni spazio, risultati che durano nel tempo.</p>
        </div>
      </div>
      <Link href="/brand" className="btn-black" style={{ marginTop: 32, fontSize: 14 }}>← Torna a Brand</Link>
    </div>
  )
}
