import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Pannelli Solari a Palermo — Fotovoltaico e Solare Termico',
  description: 'Pannelli solari a Palermo: impianti fotovoltaici per autoproduzione di energia e solare termico per acqua calda sanitaria. Incentivi e pratiche incluse.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/pannelli-solari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pannelli Solari a Palermo — Fotovoltaico e Solare Termico',
    description: 'Pannelli solari a Palermo: impianti fotovoltaici per autoproduzione di energia e solare termico per acqua calda sanitaria. Incentivi e pratiche incluse.',
    url: 'https://www.digi-home-design.com/elettricita/pannelli-solari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Pannelli Solari
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Pannelli Solari a Palermo</h1>

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
              Palermo è tra le città italiane con la maggiore irradiazione solare: investire in <strong>pannelli solari fotovoltaici</strong> significa abbattere la bolletta elettrica e aumentare l&apos;autonomia energetica della tua abitazione o azienda. Progettiamo e installiamo impianti fotovoltaici residenziali e commerciali con sistemi di accumulo (batterie) per massimizzare l&apos;autoconsumo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo anche impianti solari termici per la produzione di acqua calda sanitaria, integrabili con la caldaia esistente o con la pompa di calore. Ogni impianto viene dimensionato sul reale fabbisogno energetico del cliente.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo le pratiche per gli incentivi vigenti (Conto Energia, detrazione fiscale 50%) e le comunicazioni al GSE e al gestore di rete. Contattaci per un&apos;analisi energetica gratuita.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/elettricita" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
