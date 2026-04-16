import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partners — Digi Home Design Palermo',
  description: 'I partner e fornitori selezionati di Digi Home Design: marchi di qualità con cui collaboriamo per garantire materiali e prodotti al top del mercato.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/partners' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Partners
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Partners</h1>
      <p>Collaboriamo con fornitori e produttori selezionati per garantire ai nostri clienti materiali di qualità certificata, consegne affidabili e assistenza post-vendita. Ogni partner è scelto sulla base di criteri di qualità, affidabilità e compatibilità con i nostri standard di lavoro.</p>
      <p style={{ marginTop: 12 }}>Le partnership ci consentono di offrire prezzi competitivi su un&apos;ampia gamma di prodotti, dalla componentistica impiantistica agli infissi di fascia alta.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
