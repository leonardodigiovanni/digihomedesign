import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Montaggio a Palermo — Mobili, Arredi e Infissi',
  description: 'Servizio di montaggio professionale a Palermo: mobili, arredi, infissi, serramenti e strutture. Tecnici esperti, tempi certi e lavoro garantito.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/montaggio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Montaggio a Palermo — Mobili, Arredi e Infissi',
    description: 'Servizio di montaggio professionale a Palermo: mobili, arredi, infissi, serramenti e strutture. Tecnici esperti, tempi certi e lavoro garantito.',
    url: 'https://www.digi-home-design.com/servizi/montaggio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Montaggio
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Montaggio a Palermo
      </h1>
      <p>
        Il nostro servizio di <strong>montaggio professionale a Palermo</strong> copre ogni esigenza: mobili, armadi, cucine, arredi su misura, infissi, serramenti, tende, lampadari e strutture metalliche. Che tu abbia acquistato da noi o altrove, i nostri montatori esperti garantiscono un lavoro preciso e curato.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo con attrezzatura professionale e rispettiamo i tempi concordati. Ogni montaggio include la verifica del corretto funzionamento del prodotto installato e la pulizia dell&apos;area di lavoro al termine dell&apos;intervento.
      </p>
      <p style={{ marginTop: 12 }}>
        Disponibile per privati, imprese e condomini a Palermo e provincia. Richiedi un preventivo gratuito: ti forniremo un prezzo chiaro prima di iniziare qualsiasi lavoro.
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
      <Link href="/servizi" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Servizi
      </Link>
    </div>
  )
}
