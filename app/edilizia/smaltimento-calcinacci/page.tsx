import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smaltimento Calcinacci a Palermo — Trasporto a Norma',
  description: 'Smaltimento calcinacci e macerie a Palermo: raccolta, insaccamento, trasporto e conferimento a discarica autorizzata con formulario di trasporto rifiuti.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/smaltimento-calcinacci' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Smaltimento Calcinacci a Palermo — Trasporto a Norma',
    description: 'Smaltimento calcinacci e macerie a Palermo: raccolta, insaccamento, trasporto e conferimento a discarica autorizzata con formulario di trasporto rifiuti.',
    url: 'https://www.digi-home-design.com/edilizia/smaltimento-calcinacci',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Smaltimento Calcinacci
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Smaltimento Calcinacci a Palermo</h1>
      <p>Offriamo il servizio di <strong>smaltimento calcinacci e macerie a Palermo</strong>: raccolta dei detriti prodotti durante i lavori di demolizione, ristrutturazione o manutenzione, insaccamento o carico su cassone, trasporto e conferimento a discarica autorizzata per inerti nel rispetto della normativa sui rifiuti speciali.</p>
      <p style={{ marginTop: 12 }}>Forniamo il formulario di identificazione rifiuti (FIR) per ogni trasporto, garantendo al cliente la tracciabilità completa dello smaltimento. Disponiamo di cassoni scarrabili di varie dimensioni per cantieri di qualsiasi entità, con ritiro su prenotazione o programmato.</p>
      <p style={{ marginTop: 12 }}>Il servizio è disponibile anche in forma autonoma, indipendentemente da altri lavori edili. Contattaci per un preventivo basato sul volume stimato dei materiali.</p>
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
      <Link href="/edilizia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
