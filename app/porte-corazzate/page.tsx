import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porte Corazzate a Palermo — Sicurezza e Blindature',
  description: 'Porte corazzate a Palermo: blindature antintrusione, porte blindate e sistemi di sicurezza per abitazioni e uffici. Installazione professionale e preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/porte-corazzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Corazzate a Palermo — Sicurezza e Blindature',
    description: 'Porte corazzate a Palermo: blindature antintrusione, porte blindate e sistemi di sicurezza per abitazioni e uffici. Installazione professionale e preventivo gratuito.',
    url: 'https://www.digi-home-design.com/porte-corazzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Porte Corazzate a Palermo
      </h1>
      <p>
        Installiamo <strong>porte corazzate a Palermo</strong> per abitazioni, uffici e locali commerciali: porte blindate di classe 3, 4 e 5, con serrature multiblindo, cerniere antisvillo e pannelli in acciaio ad alta resistenza. La sicurezza della tua famiglia e dei tuoi beni è la nostra priorità.
      </p>
      <p style={{ marginTop: 12 }}>
        Collaboriamo con i principali produttori italiani di porte blindate e offriamo un&apos;ampia gamma di finiture, colori e rivestimenti interni per integrare la porta di sicurezza nell&apos;arredo della tua casa senza rinunciare all&apos;estetica.
      </p>
      <p style={{ marginTop: 12 }}>
        Il nostro servizio comprende sopralluogo gratuito, rimozione della vecchia porta, posa in opera certificata e garanzia post-installazione. Contattaci per scoprire la soluzione antintrusione più adatta alle tue esigenze.
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
