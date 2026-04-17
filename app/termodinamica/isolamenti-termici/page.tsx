import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Isolamenti Termici a Palermo — Cappotto e Soluzioni Energetiche',
  description: 'Isolamento termico a Palermo: cappotto esterno, isolamento sottotetto e pareti interne per ridurre le dispersioni e migliorare la classe energetica.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/isolamenti-termici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Isolamenti Termici a Palermo — Cappotto e Soluzioni Energetiche',
    description: 'Isolamento termico a Palermo: cappotto esterno, isolamento sottotetto e pareti interne per ridurre le dispersioni e migliorare la classe energetica.',
    url: 'https://www.digi-home-design.com/termodinamica/isolamenti-termici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Termici
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Isolamenti Termici a Palermo
      </h1>
      <p>
        Un buon <strong>isolamento termico</strong> riduce drasticamente i consumi energetici, migliora il comfort abitativo e aumenta la classe energetica dell&apos;edificio. Realizziamo cappotti termici esterni, isolamenti di sottotetti, solai, pareti interne e contropareti con materiali certificati ad alta performance.
      </p>
      <p style={{ marginTop: 12 }}>
        Utilizziamo pannelli in EPS, lana di roccia, fibra di legno e soluzioni a cappotto ventilato, scelti in base alle caratteristiche dell&apos;edificio e agli obiettivi energetici del cliente. Ogni intervento viene preceduto da una diagnosi energetica gratuita.
      </p>
      <p style={{ marginTop: 12 }}>
        Gli interventi possono beneficiare degli incentivi fiscali vigenti (Superbonus, Ecobonus). Forniamo assistenza completa per la gestione delle pratiche. Contattaci per un sopralluogo gratuito a Palermo e provincia.
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
