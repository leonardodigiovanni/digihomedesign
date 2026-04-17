import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impianti Idraulici a Palermo — Progettazione e Installazione',
  description: 'Impianti idraulici a Palermo: progettazione, installazione e manutenzione di impianti idrosanitari per abitazioni, uffici e strutture commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/impianti-idraulici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impianti Idraulici a Palermo — Progettazione e Installazione',
    description: 'Impianti idraulici a Palermo: progettazione, installazione e manutenzione di impianti idrosanitari per abitazioni, uffici e strutture commerciali.',
    url: 'https://www.digi-home-design.com/termodinamica/impianti-idraulici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Impianti Idraulici
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Impianti Idraulici a Palermo
      </h1>
      <p>
        Progettiamo e realizziamo <strong>impianti idraulici a Palermo</strong> per nuove costruzioni e ristrutturazioni: impianti idrosanitari, distribuzione acqua calda e fredda, sistemi di scarico e fognatura interna, impianti termici a pannelli radianti. Operiamo sia su edifici residenziali che commerciali e industriali.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni impianto viene progettato nel rispetto della normativa UNI e realizzato con materiali certificati (tubi in rame, PPR, multicstrato). Al termine dei lavori forniamo la dichiarazione di conformità impianto (modulo CPI) e il collaudo con certificazione di tenuta.
      </p>
      <p style={{ marginTop: 12 }}>
        Gestiamo anche interventi di manutenzione e riparazione urgente per perdite, intasamenti e guasti. Pronto intervento disponibile a Palermo e provincia. Contattaci per un preventivo gratuito.
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
