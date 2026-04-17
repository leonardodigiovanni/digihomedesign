import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pulizia Finale Cantiere a Palermo — Post-Lavori Professionale',
  description: 'Pulizia finale post-cantiere a Palermo: rimozione polvere, cemento e residui da pavimenti, infissi e superfici. Consegna dell\'immobile pronto all\'uso.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/pulizia-finale' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pulizia Finale Cantiere a Palermo — Post-Lavori Professionale',
    description: 'Pulizia finale post-cantiere a Palermo: rimozione polvere, cemento e residui da pavimenti, infissi e superfici. Consegna dell\'immobile pronto all\'uso.',
    url: 'https://www.digi-home-design.com/edilizia/pulizia-finale',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Pulizia Finale
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Pulizia Finale Cantiere a Palermo</h1>
      <p>Al termine di ogni cantiere di ristrutturazione offriamo il servizio di <strong>pulizia finale post-lavori a Palermo</strong>: rimozione di polvere di cemento, residui di stucco, schizzi di pittura, adesivo per piastrelle e ogni altro residuo di lavorazione da pavimenti, infissi, vetri, sanitari e superfici tinteggiate.</p>
      <p style={{ marginTop: 12 }}>Utilizziamo attrezzatura professionale — aspiratori HEPA, monospazzola, vapore secco — e prodotti specifici per ogni tipo di superficie: detergenti acidi diluiti per il cemento su ceramica, solventi delicati per i vetri, prodotti neutri per i parquet. Il risultato è un immobile consegnato pulito e pronto all&apos;uso.</p>
      <p style={{ marginTop: 12 }}>Il servizio è disponibile sia come fase finale dei nostri cantieri che come intervento autonomo su cantieri di terzi. Contattaci per un preventivo in base alla metratura.</p>
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
