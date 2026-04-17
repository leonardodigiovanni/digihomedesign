import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porte Scrigno a Palermo — Porte a Scomparsa su Misura',
  description: 'Porte scrigno a Palermo: porte a scomparsa nel muro per ambienti moderni e funzionali. Installazione su muratura esistente o in fase di costruzione.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/porte-scrigno' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Scrigno a Palermo — Porte a Scomparsa su Misura',
    description: 'Porte scrigno a Palermo: porte a scomparsa nel muro per ambienti moderni e funzionali. Installazione su muratura esistente o in fase di costruzione.',
    url: 'https://www.digi-home-design.com/legno/porte-scrigno',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Porte Scrigno
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Porte Scrigno a Palermo
      </h1>
      <p>
        La <strong>porta scrigno</strong> — o porta a scomparsa — è la soluzione ideale per chi vuole massimizzare lo spazio e ottenere un effetto visivo pulito e continuo. L&apos;anta scorre all&apos;interno del controtelaio nascosto nella muratura, eliminando lo spazio occupato da battente e maniglia quando la porta è aperta.
      </p>
      <p style={{ marginTop: 12 }}>
        Installiamo sistemi scrigno a Palermo per vani di qualsiasi dimensione, sia in fase di nuova costruzione che su muratura esistente con apertura del vano. I controtelai sono in acciaio zincato con guide silenziate; le ante possono essere in qualsiasi essenza, laccate o rivestite in vetro per effetto continuità con la parete.
      </p>
      <p style={{ marginTop: 12 }}>
        Il sistema è disponibile anche in versione a doppia anta per aperture ampie. Contattaci per un sopralluogo gratuito e scopri la soluzione più adatta al tuo spazio.
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
      <Link href="/legno" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Legno
      </Link>
    </div>
  )
}
