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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piastrelle
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Piastrelle a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
