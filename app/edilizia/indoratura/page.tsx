import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Indoratura a Palermo — Dorature su Cornici, Soffitti e Arredi',
  description: 'Indoratura artigianale a Palermo: applicazione di foglia d\'oro e metalli preziosi su cornici, soffitti, capitelli e mobili. Restauro e nuove realizzazioni.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/indoratura' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Indoratura a Palermo — Dorature su Cornici, Soffitti e Arredi',
    description: 'Indoratura artigianale a Palermo: applicazione di foglia d\'oro e metalli preziosi su cornici, soffitti, capitelli e mobili. Restauro e nuove realizzazioni.',
    url: 'https://www.digi-home-design.com/edilizia/indoratura',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Indoratura
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Indoratura a Palermo</h1>
      <p>L&apos;<strong>indoratura artigianale</strong> è una delle arti decorative più raffinate: l&apos;applicazione di foglia d&apos;oro, argento, rame e altri metalli preziosi su superfici architettoniche e mobili trasforma ogni ambiente in uno spazio di grande impatto visivo. Realizziamo indorature a Palermo su cornici, soffitti a cassettoni, capitelli, colonne, altari, specchiere e mobili antichi e moderni.</p>
      <p style={{ marginTop: 12 }}>Utilizziamo la tecnica tradizionale a missione (olio o acqua) con foglia oro in libro da 23,75 carati, o tecniche moderne con polveri metalliche per grandi superfici. Ogni intervento è preceduto dalla preparazione del supporto con gesso e bolo armeno per garantire la massima brillantezza del metallo.</p>
      <p style={{ marginTop: 12 }}>Eseguiamo anche restauro e ripristino di dorature esistenti scolorite o danneggiate. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
