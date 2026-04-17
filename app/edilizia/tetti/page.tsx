import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tetti a Palermo — Rifacimento Coperture e Manutenzione',
  description: 'Tetti a Palermo: rifacimento e manutenzione di coperture in tegole, lamiera, guaine e lastrico solare. Interventi su perdite e impermeabilizzazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tetti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tetti a Palermo — Rifacimento Coperture e Manutenzione',
    description: 'Tetti a Palermo: rifacimento e manutenzione di coperture in tegole, lamiera, guaine e lastrico solare. Interventi su perdite e impermeabilizzazione inclusa.',
    url: 'https://www.digi-home-design.com/edilizia/tetti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tetti
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Tetti a Palermo</h1>
      <p>Realizziamo il <strong>rifacimento e la manutenzione di tetti a Palermo</strong>: coperture a falde con tegole marsigliesi, portoghesi e in laterizio, tetti piani con guaine bituminose o liquide, lastrici solari e coperture in lamiera grecata o sandwich. Interveniamo su infiltrazioni, tegole rotte e strutture in legno danneggiate.</p>
      <p style={{ marginTop: 12 }}>Prima di ogni intervento eseguiamo una diagnosi della copertura per individuare i punti di perdita. Le lavorazioni vengono eseguite in sicurezza con ponteggi o linee vita certificate. Per i tetti in legno forniamo anche trattamenti antitarlo, antifungini e ignifughi.</p>
      <p style={{ marginTop: 12 }}>Il servizio include lo smaltimento del materiale rimosso e il ripristino degli elementi di gronda e pluviali. Contattaci per un sopralluogo gratuito.</p>
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
