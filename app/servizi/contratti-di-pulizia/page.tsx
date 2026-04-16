import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
  description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
    description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
    url: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Contratti di Pulizia
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Contratti di Pulizia a Palermo
      </h1>
      <p>
        Proponiamo <strong>contratti di pulizia periodica a Palermo</strong> per abitazioni private, uffici, studi professionali e spazi commerciali. Le nostre squadre operano con prodotti certificati e attrezzatura professionale, garantendo igiene e cura in ogni ambiente.
      </p>
      <p style={{ marginTop: 12 }}>
        I contratti sono completamente personalizzabili: scegli la frequenza degli interventi (settimanale, bisettimanale, mensile), gli ambienti da includere e il tipo di pulizia (ordinaria, straordinaria, post-cantiere). Ogni contratto include un referente dedicato e un piano di interventi concordato.
      </p>
      <p style={{ marginTop: 12 }}>
        Operiamo a Palermo e provincia. Il sopralluogo iniziale è gratuito e senza impegno: ti forniamo un preventivo dettagliato con il piano degli interventi prima di qualsiasi accordo.
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
