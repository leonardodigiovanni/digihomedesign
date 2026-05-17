import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Piastrelle a Palermo — Rivestimenti per Bagni e Cucine',
  description: 'Posa piastrelle a Palermo per bagni, cucine e ambienti umidi: rivestimenti in ceramica, gres e mosaico. Fornitura e posa in opera su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/piastrelle' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Piastrelle a Palermo — Rivestimenti per Bagni e Cucine',
    description: 'Posa piastrelle a Palermo per bagni, cucine e ambienti umidi: rivestimenti in ceramica, gres e mosaico. Fornitura e posa in opera su misura.',
    url: 'https://www.digi-home-design.com/edilizia/piastrelle',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piastrelle
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Piastrelle a Palermo</h1>

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
              Posiamo <strong>piastrelle a Palermo</strong> per rivestimenti di bagni, cucine, docce, balconi e ambienti umidi: ceramica smaltata, gres porcellanato, klinker antiscivolo, mosaico in vetro e in pietra. Curiamo ogni dettaglio dalla preparazione del supporto alla stuccatura dei giunti con prodotti epossidici o cementizi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo pose a correre, sfalsate, a spina e pattern decorativi personalizzati. Per le docce a pavimento gestiamo le pendenze di scarico, la membrana impermeabilizzante sotto-piastrella e i profili di raccordo. Utilizziamo adesivi ad alta deformabilità per evitare distacchi nel tempo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo anche il servizio di fornitura con selezione del materiale presso i nostri fornitori convenzionati. Contattaci per un preventivo gratuito.
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

      <Link href="/edilizia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
