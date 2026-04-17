import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infissi in Alluminio a Palermo — Taglio Termico su Misura',
  description: 'Infissi in alluminio a Palermo: finestre e porte-finestre a taglio termico su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in Alluminio a Palermo — Taglio Termico su Misura',
    description: 'Infissi in alluminio a Palermo: finestre e porte-finestre a taglio termico su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in Alluminio
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Infissi in Alluminio a Palermo</h1>
      <p>Gli <strong>infissi in alluminio a taglio termico a Palermo</strong> rappresentano la scelta ideale per chi cerca durata, minima manutenzione e design contemporaneo. Il taglio termico — una barriera in poliammide che interrompe il ponte termico tra il profilo esterno e quello interno — garantisce elevate prestazioni di isolamento termoacustico, riducendo sensibilmente i consumi energetici.</p>
      <p style={{ marginTop: 12 }}>Lavoriamo con sistemi certificati dei principali produttori — Schüco, Metra, Reynaers, Wicona — nelle versioni a battente, a vasistas, scorrevole alzante e a libro. Le finiture disponibili includono verniciatura a polvere in qualsiasi colore RAL, anodizzazione e legno-alluminio per l&apos;interno.</p>
      <p style={{ marginTop: 12 }}>Il servizio comprende sopralluogo, rilievo quote, fornitura con vetrocamera selezionata, posa in opera e sigillatura perimetrale. Contattaci per un preventivo gratuito.</p>
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
      <Link href="/serramenti" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
