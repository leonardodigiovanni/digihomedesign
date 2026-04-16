import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
  description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/riparazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
    description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/servizi/riparazioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Riparazioni
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Riparazioni a Palermo
      </h1>
      <p>
        Offriamo un servizio di <strong>riparazioni rapide e affidabili a Palermo</strong> per infissi, serramenti, porte, finestre, persiane, verande e arredi. I nostri tecnici qualificati intervengono con tempi certi, diagnosticano il problema e propongono la soluzione più efficace e conveniente.
      </p>
      <p style={{ marginTop: 12 }}>
        Gestiamo riparazioni di ogni entità: dalla semplice sostituzione di una guarnizione o di un meccanismo di chiusura, fino al ripristino strutturale di ante, telai e strutture danneggiate. Utilizziamo ricambi originali o equivalenti certificati per garantire la durata dell&apos;intervento.
      </p>
      <p style={{ marginTop: 12 }}>
        Il servizio è disponibile per privati, condomini e attività commerciali. Contattaci per un sopralluogo gratuito e un preventivo trasparente senza sorprese.
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
