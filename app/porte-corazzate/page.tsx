import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
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
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Porte Corazzate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Porte Corazzate a Palermo
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Installiamo <strong>porte corazzate a Palermo</strong> per abitazioni, uffici e locali commerciali: porte blindate di classe 3, 4 e 5, con serrature multiblindo, cerniere antisvillo e pannelli in acciaio ad alta resistenza. La sicurezza della tua famiglia e dei tuoi beni è la nostra priorità.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Collaboriamo con i principali produttori italiani di porte blindate e offriamo un&apos;ampia gamma di finiture, colori e rivestimenti interni per integrare la porta di sicurezza nell&apos;arredo della tua casa senza rinunciare all&apos;estetica.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Il nostro servizio comprende sopralluogo gratuito, rimozione della vecchia porta, posa in opera certificata e garanzia post-installazione. Contattaci per scoprire la soluzione antintrusione più adatta alle tue esigenze.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai un progetto in mente?</p>
            <CtaPreventivo />
          </div>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
            <CtaCantiere />
          </div>
        </div>

      </div>

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
