import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Divani a Palermo — Tessuti e Rivestimenti su Misura',
  description: 'Divani a Palermo: rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa. Qualità artigianale e materiali selezionati.',
  alternates: { canonical: 'https://www.digi-home-design.com/tessuti/divani' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Divani a Palermo — Tessuti e Rivestimenti su Misura',
    description: 'Divani a Palermo: rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa. Qualità artigianale e materiali selezionati.',
    url: 'https://www.digi-home-design.com/tessuti/divani',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/tessuti" style={{ color: '#888', textDecoration: 'underline' }}>Tessuti</Link> / Divani
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Divani a Palermo
      </h1>
      <p>
        Offriamo un servizio completo per il <strong>rivestimento e il rifacimento dei divani a Palermo</strong>: dalla scelta del tessuto alla realizzazione artigianale, fino alla consegna e al montaggio nel tuo spazio. Lavoriamo con stoffe tecniche, velluti, lini e materiali sintetici di alta qualità, selezionati per durabilità ed estetica.
      </p>
      <p style={{ marginTop: 12 }}>
        Sia che tu voglia rinnovare un divano esistente o scegliere un rivestimento personalizzato per un acquisto nuovo, i nostri artigiani ti guidano nella selezione dei materiali più adatti allo stile della tua casa e all&apos;uso quotidiano. I tessuti disponibili coprono ogni gusto: dal classico al moderno, dall&apos;elegante al pratico.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo su tutto il territorio palermitano, con sopralluogo gratuito a domicilio. Contattaci per un preventivo personalizzato e scopri come trasformare il tuo divano con la qualità artigianale che ci contraddistingue dal 1972.
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
      <Link href="/tessuti" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Tessuti
      </Link>
    </div>
  )
}
