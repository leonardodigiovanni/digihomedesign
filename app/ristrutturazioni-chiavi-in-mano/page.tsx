import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
  description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
  alternates: { canonical: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
    description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
    url: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Ristrutturazioni Chiavi in Mano a Palermo
      </h1>
      <p>
        Le nostre <strong>ristrutturazioni chiavi in mano a Palermo</strong> ti permettono di rinnovare casa o ufficio senza stress: un unico referente coordina tutte le lavorazioni — muratura, impianti, pavimenti, infissi, tinteggiatura — dalla progettazione alla consegna delle chiavi.
      </p>
      <p style={{ marginTop: 12 }}>
        Gestiamo pratiche edilizie, coordinamento delle maestranze e approvvigionamento dei materiali, garantendo rispetto dei tempi e del budget concordato. Grazie al nostro sistema di monitoraggio cantiere online, puoi seguire l&apos;avanzamento dei lavori in tempo reale dal tuo smartphone o computer.
      </p>
      <p style={{ marginTop: 12 }}>
        Siamo operativi su tutto il territorio di Palermo e provincia. Contattaci per un sopralluogo gratuito e scopri come possiamo trasformare il tuo immobile con un servizio completo, trasparente e senza pensieri.
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
