import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
  description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/infissi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
    description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
    url: 'https://www.digi-home-design.com/infissi',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Infissi a Palermo
      </h1>
      <p>
        Siamo specialisti nella fornitura e installazione di <strong>infissi a Palermo</strong>: finestre, porte-finestre e vetrate scorrevoli realizzate su misura per ogni tipo di abitazione o ufficio. Utilizziamo profili in alluminio e PVC di alta qualità, con vetri a bassa emissività per il massimo isolamento termico e acustico.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni progetto parte da un sopralluogo gratuito: misuriamo, consigliamo i materiali più adatti e gestiamo la posa in opera con squadre specializzate. I nostri infissi sono installati a regola d&apos;arte e corredati da garanzia su prodotto e manodopera.
      </p>
      <p style={{ marginTop: 12 }}>
        Che si tratti di una singola finestra o di una ristrutturazione completa, siamo il tuo referente unico a Palermo per infissi di qualità a prezzi competitivi. Contattaci per un preventivo personalizzato.
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
      <Link href="/" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
