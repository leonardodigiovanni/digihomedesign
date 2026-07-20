import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
  description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/solarium' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
    description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
    url: 'https://www.digi-home-design.com/edilizia/solarium',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Solarium<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Solarium a Palermo</h1>

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
              Progettiamo e realizziamo <strong>aree solarium a Palermo</strong> su terrazze, lastrici solari, giardini e bordo piscina: spazi attrezzati per il relax e l&apos;esposizione solare, con pavimentazioni drenanti antiscivolo in gres, pietra lavica, teak o composito WPC resistente ai raggi UV e all&apos;acqua.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il progetto include la sistemazione del piano di calpestio con pendenze di deflusso, l&apos;impermeabilizzazione del sottofondo, l&apos;installazione di docce esterne, punti luce, prese di corrente IP67 e schermature solari — tende a vela, pergolati bioclimatici o gazebo in alluminio — per il comfort nelle ore più calde.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni solarium è progettato su misura in base alle dimensioni dello spazio e alle esigenze del cliente. Contattaci per un sopralluogo e un progetto gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
