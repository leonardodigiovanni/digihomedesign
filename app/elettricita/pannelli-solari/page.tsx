import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pannelli Solari a Palermo — Fotovoltaico e Solare Termico',
  description: 'Pannelli solari a Palermo: impianti fotovoltaici per autoproduzione di energia e solare termico per acqua calda sanitaria. Incentivi e pratiche incluse.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/pannelli-solari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pannelli Solari a Palermo — Fotovoltaico e Solare Termico',
    description: 'Pannelli solari a Palermo: impianti fotovoltaici per autoproduzione di energia e solare termico per acqua calda sanitaria. Incentivi e pratiche incluse.',
    url: 'https://www.digi-home-design.com/elettricita/pannelli-solari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Pannelli Solari
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Pannelli Solari a Palermo
      </h1>
      <p>
        Palermo è tra le città italiane con la maggiore irradiazione solare: investire in <strong>pannelli solari fotovoltaici</strong> significa abbattere la bolletta elettrica e aumentare l&apos;autonomia energetica della tua abitazione o azienda. Progettiamo e installiamo impianti fotovoltaici residenziali e commerciali con sistemi di accumulo (batterie) per massimizzare l&apos;autoconsumo.
      </p>
      <p style={{ marginTop: 12 }}>
        Realizziamo anche impianti solari termici per la produzione di acqua calda sanitaria, integrabili con la caldaia esistente o con la pompa di calore. Ogni impianto viene dimensionato sul reale fabbisogno energetico del cliente.
      </p>
      <p style={{ marginTop: 12 }}>
        Gestiamo le pratiche per gli incentivi vigenti (Conto Energia, detrazione fiscale 50%) e le comunicazioni al GSE e al gestore di rete. Contattaci per un&apos;analisi energetica gratuita.
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
      <Link href="/elettricita" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Elettricità
      </Link>
    </div>
  )
}
