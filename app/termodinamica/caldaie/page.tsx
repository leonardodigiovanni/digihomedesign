import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Caldaie a Palermo — Installazione e Manutenzione',
  description: 'Caldaie a Palermo: vendita, installazione e manutenzione di caldaie a condensazione, a gas e a biomassa. Tecnici abilitati e pronto intervento.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/caldaie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Caldaie a Palermo — Installazione e Manutenzione',
    description: 'Caldaie a Palermo: vendita, installazione e manutenzione di caldaie a condensazione, a gas e a biomassa. Tecnici abilitati e pronto intervento.',
    url: 'https://www.digi-home-design.com/termodinamica/caldaie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Caldaie
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Caldaie a Palermo
      </h1>
      <p>
        Offriamo un servizio completo per le <strong>caldaie a Palermo</strong>: fornitura, installazione, messa in servizio, manutenzione ordinaria e straordinaria, e pronto intervento per guasti. Lavoriamo con caldaie murali e a basamento a condensazione dei principali marchi — Vaillant, Baxi, Ariston, Ferroli — per massimizzare l&apos;efficienza e ridurre i consumi di gas.
      </p>
      <p style={{ marginTop: 12 }}>
        La manutenzione annuale obbligatoria per legge viene eseguita da tecnici abilitati con rilascio del libretto di impianto aggiornato. Offriamo contratti di manutenzione programmata con priorità di intervento in caso di guasto.
      </p>
      <p style={{ marginTop: 12 }}>
        Gestiamo anche le pratiche per gli incentivi alla sostituzione delle caldaie obsolete con modelli ad alta efficienza energetica (classe A+). Contattaci per un preventivo gratuito.
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
