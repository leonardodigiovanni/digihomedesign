import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Imbotti a Palermo — Rivestimento Vani Finestra in Alluminio e PVC',
  description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/imbotti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Imbotti a Palermo — Rivestimento Vani Finestra in Alluminio e PVC',
    description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
    url: 'https://www.digi-home-design.com/serramenti/imbotti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Imbotti
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Imbotti a Palermo</h1>
      <p>Gli <strong>imbotti in alluminio e PVC a Palermo</strong> rivestono il vano finestra tra il telaio dell&apos;infisso e la muratura esterna, eliminando i ponti termici perimetrali, proteggendo l&apos;intonaco dall&apos;umidità di infiltrazione e conferendo all&apos;apertura un aspetto pulito e rifinito. Sono realizzati su misura per adattarsi a qualsiasi spessore di muro e profondità del vano.</p>
      <p style={{ marginTop: 12 }}>Gli imbotti in alluminio vengono verniciati nello stesso colore dell&apos;infisso per continuità estetica, mentre quelli in PVC sono disponibili in bianco e in versione foliata. La posa avviene con aggancio a clips o con viti a scomparsa, senza bisogno di opere murarie aggiuntive, e il giunto perimetrale viene sigillato con silicone neutro per la tenuta all&apos;acqua.</p>
      <p style={{ marginTop: 12 }}>Vengono installati contestualmente alla posa degli infissi o come intervento autonomo su serramenti esistenti. Contattaci per un preventivo gratuito.</p>
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
