import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancelli a Palermo — Ferro Battuto e Acciaio Manuali o Motorizzati',
  description: 'Cancelli a Palermo su misura: carrabili e pedonali in ferro, acciaio e alluminio, manuali o con automazione. Scorrevoli, a battente e a libro.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/cancelli' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Cancelli a Palermo — Ferro Battuto e Acciaio Manuali o Motorizzati',
    description: 'Cancelli a Palermo su misura: carrabili e pedonali in ferro, acciaio e alluminio, manuali o con automazione. Scorrevoli, a battente e a libro.',
    url: 'https://www.digi-home-design.com/metallurgia/cancelli',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Cancelli
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', fontWeight: 700, marginBottom: 16 }}>Cancelli a Palermo</h1>
      <p>Progettiamo e installiamo <strong>cancelli su misura a Palermo</strong>: carrabili scorrevoli, a battente singolo e doppio, a libro e sollevabili in ferro zincato, acciaio inox o alluminio estruso. I cancelli vengono realizzati in officina su disegno tecnico e verniciati a polvere epossidica per la massima resistenza agli agenti atmosferici.</p>
      <p style={{ marginTop: 12 }}>Installiamo automazioni per apertura motorizzata con operatori interrati o a braccio dei principali marchi — FAAC, Nice, BFT, Came — con telecomandi, tastiere a codice, videocitofoni e lettori di transponder. I sistemi sono predisposti per l&apos;integrazione con impianti domotici e videosorveglianza.</p>
      <p style={{ marginTop: 12 }}>Realizziamo anche cancelletti pedonali a fianco e recinzioni perimetrali abbinate. Contattaci per un sopralluogo gratuito e un progetto con rendering 3D.</p>
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
