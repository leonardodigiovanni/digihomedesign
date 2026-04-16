import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porte Blindate a Palermo — Classe 3, 4, 5 e 6',
  description: 'Porte blindate a Palermo: fornitura e installazione di porte blindate classe 3-6 con serrature di sicurezza multipunto. Misure standard e su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/porte-blindate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Blindate a Palermo — Classe 3, 4, 5 e 6',
    description: 'Porte blindate a Palermo: fornitura e installazione di porte blindate classe 3-6 con serrature di sicurezza multipunto. Misure standard e su misura.',
    url: 'https://www.digi-home-design.com/metallurgia/porte-blindate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Blindate
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Porte Blindate a Palermo</h1>
      <p>Forniamo e installiamo <strong>porte blindate a Palermo</strong> certificate dalla classe 3 alla classe 6 secondo la norma UNI EN 1627: la scelta della classe dipende dal livello di rischio e dal contesto abitativo o commerciale. Ogni porta è dotata di serratura multipunto con chiusura perimetrale, cerniere anti-scasso e pannello esterno in acciaio da almeno 1,5 mm.</p>
      <p style={{ marginTop: 12 }}>Le ante sono disponibili con rivestimento esterno in acciaio inox satinato, laminato laccato o legno impiallacciato per integrarsi con l&apos;estetica dell&apos;ambiente. Installiamo modelli con apertura a destra, sinistra, doppia anta e scorrevole. La posa include la rimozione della vecchia porta, la posa del controtelaio in acciaio e il sigillamento perimetrale.</p>
      <p style={{ marginTop: 12 }}>Collaboriamo con i principali marchi italiani — Dierre, Alias, Oikos, Bertolotto Blindate. Contattaci per un sopralluogo e un preventivo gratuito.</p>
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
      <Link href="/metallurgia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
