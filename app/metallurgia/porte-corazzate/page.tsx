import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Porte Corazzate a Palermo — Acciaio su Misura',
  description: 'Porte corazzate a Palermo su misura in acciaio: per abitazioni, uffici e locali commerciali. Serrature multipunto, pannelli personalizzabili, posa inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/porte-corazzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Corazzate a Palermo — Acciaio su Misura',
    description: 'Porte corazzate a Palermo su misura in acciaio: per abitazioni, uffici e locali commerciali. Serrature multipunto, pannelli personalizzabili, posa inclusa.',
    url: 'https://www.digi-home-design.com/metallurgia/porte-corazzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Corazzate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Porte Corazzate a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo e installiamo <strong>porte corazzate su misura a Palermo</strong> in acciaio per abitazioni, uffici, magazzini e locali commerciali: struttura in lamiera d&apos;acciaio piegata e saldata, rinforzi interni perimetrali, serratura multipunto a tre o cinque punti di chiusura con catenacci superiori e inferiori. Ogni porta è costruita artigianalmente nelle nostre officine su misura del vano, eliminando la necessità di adattamenti in cantiere.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il pannello esterno può essere rivestito in acciaio verniciato a polvere in qualsiasi colore RAL, lamiera bugnata o pannello decorativo su richiesta. Le cerniere in acciaio inox con cuscinetti garantiscono scorrimento fluido e resistenza nel tempo. Su richiesta installiamo serratura elettronica con codice, cilindro europeo ad alta sicurezza o sistema di apertura remota.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10 }}>
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
