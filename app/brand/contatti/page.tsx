import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contatti — Digi Home Design Palermo',
  description: 'Contatta Digi Home Design a Palermo: telefono, email, indirizzo e modulo di contatto per preventivi e informazioni sui nostri servizi.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/contatti' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Contatti
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Contatti</h1>
      <p>Siamo a disposizione per sopralluoghi gratuiti, preventivi e informazioni su tutti i nostri servizi. Contattaci telefonicamente, via email o compila il modulo — ti risponderemo entro 24 ore.</p>
      <p style={{ marginTop: 12 }}>Operiamo a Palermo e in tutta la provincia. Per interventi urgenti siamo raggiungibili anche fuori orario.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
