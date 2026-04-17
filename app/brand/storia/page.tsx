import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Nostra Storia — Digi Home Design Palermo',
  description: 'La storia di Digi Home Design: chi siamo, la nostra missione e i valori che guidano il nostro lavoro a Palermo dal primo giorno.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/storia' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Storia
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>La Nostra Storia</h1>
      <p>Digi Home Design nasce a Palermo dalla passione per il design d&apos;interni e la volontà di offrire soluzioni complete per la casa e gli spazi commerciali. Dalla progettazione alla posa in opera, ogni intervento è seguito con cura artigianale e attenzione al dettaglio.</p>
      <p style={{ marginTop: 12 }}>Nel corso degli anni abbiamo ampliato la nostra offerta abbracciando tutti gli ambiti dell&apos;edilizia, dalla falegnameria ai serramenti, dall&apos;impiantistica alle ristrutturazioni chiavi in mano — sempre con un unico interlocutore per il cliente.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
