import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Videosorveglianza a Palermo — Impianti TVCC e IP',
  description: 'Impianti di videosorveglianza a Palermo: telecamere IP, TVCC, sistemi di registrazione e accesso remoto per abitazioni, uffici e attività commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/videosorveglianza' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Videosorveglianza a Palermo — Impianti TVCC e IP',
    description: 'Impianti di videosorveglianza a Palermo: telecamere IP, TVCC, sistemi di registrazione e accesso remoto per abitazioni, uffici e attività commerciali.',
    url: 'https://www.digi-home-design.com/elettricita/videosorveglianza',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Videosorveglianza
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Videosorveglianza a Palermo
      </h1>
      <p>
        Installiamo <strong>impianti di videosorveglianza a Palermo</strong> per abitazioni, condomini, uffici e attività commerciali: telecamere IP ad alta definizione, sistemi TVCC analogici, NVR e DVR con archiviazione locale o cloud, e accesso remoto da smartphone in tempo reale.
      </p>
      <p style={{ marginTop: 12 }}>
        Progettiamo il posizionamento ottimale delle telecamere per massimizzare la copertura, minimizzare i punti ciechi e rispettare la normativa sulla privacy (GDPR). Installiamo sistemi con visione notturna, rilevazione del movimento, audio bidirezionale e notifiche push in caso di allarme.
      </p>
      <p style={{ marginTop: 12 }}>
        I sistemi sono integrabili con impianti antifurto, citofoni video e sistemi domotici. Forniamo tutta la documentazione per la conformità al Garante della Privacy. Contattaci per un sopralluogo gratuito e un preventivo su misura.
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
