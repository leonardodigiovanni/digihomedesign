import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Templates Documenti — Digi Home Design Palermo',
  description: 'Scarica i modelli di documento ufficiali Digi Home Design: contratti, moduli di accettazione preventivo, dichiarazioni di conformità e altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/templates-documenti' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Templates Documenti
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Templates Documenti</h1>
      <p>Raccolta dei modelli di documento ufficiali Digi Home Design: contratti di appalto, moduli di accettazione preventivo, dichiarazioni di conformità impianti, verbali di consegna lavori e liberatorie per accesso cantiere.</p>
      <p style={{ marginTop: 12 }}>I template sono disponibili in formato Word e PDF, pronti per essere compilati e firmati. Per modelli personalizzati o versioni aggiornate contatta il nostro ufficio amministrativo.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
