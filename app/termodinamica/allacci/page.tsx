import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Allacci a Palermo — Acqua, Gas ed Elettricità',
  description: 'Allacci idrici, gas ed elettrici a Palermo: gestione pratiche, scavi, posa tubazioni e collaudi per nuove utenze e variazioni di contratto.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/allacci' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Allacci a Palermo — Acqua, Gas ed Elettricità',
    description: 'Allacci idrici, gas ed elettrici a Palermo: gestione pratiche, scavi, posa tubazioni e collaudi per nuove utenze e variazioni di contratto.',
    url: 'https://www.digi-home-design.com/termodinamica/allacci',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Allacci
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Allacci a Palermo
      </h1>
      <p>
        Gestiamo le pratiche e i lavori per <strong>allacci idrici, gas ed elettrici a Palermo</strong>: dalle richieste agli enti erogatori fino alla posa delle tubazioni e al collaudo finale. Un unico interlocutore per tutte le utenze, con gestione completa della burocrazia e dei rapporti con i gestori di rete.
      </p>
      <p style={{ marginTop: 12 }}>
        I servizi includono: nuovi allacci per costruzioni e ristrutturazioni, spostamento di contatori e derivazioni, adeguamento degli impianti a nuove normative, scavi e ripristino del manto stradale in coordinamento con il Comune di Palermo.
      </p>
      <p style={{ marginTop: 12 }}>
        Disponiamo di tecnici abilitati per lavori su gas (patentino installatori), impianti elettrici (D.M. 37/08) e impianti idrosanitari. Contattaci per una consulenza gratuita e un preventivo trasparente.
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
