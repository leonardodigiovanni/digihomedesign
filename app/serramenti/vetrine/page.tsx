import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Vetrine Commerciali a Palermo — Alluminio su Misura per Negozi',
  description: 'Vetrine commerciali a Palermo in alluminio su misura: ingressi con porta e vetrina fissa, sistemi scorrevoli e pieghevoli per negozi, show-room e ristoranti.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/vetrine' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Vetrine Commerciali a Palermo — Alluminio su Misura per Negozi',
    description: 'Vetrine commerciali a Palermo in alluminio su misura: ingressi con porta e vetrina fissa, sistemi scorrevoli e pieghevoli per negozi, show-room e ristoranti.',
    url: 'https://www.digi-home-design.com/serramenti/vetrine',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Vetrine
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Vetrine Commerciali a Palermo</h1>

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
              Progettiamo e installiamo <strong>vetrine commerciali a Palermo</strong> su misura per negozi, show-room, ristoranti, banche e uffici: sistemi in alluminio strutturale con vetro stratificato di sicurezza, ingressi con porta a battente o scorrevole automatica, facciate continue vetrate e sistemi a libro per l&apos;apertura totale del fronte su strada.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I profili in alluminio sono disponibili in sezione sottile per la massima visibilità del prodotto esposto, con finitura in qualsiasi colore RAL o anodizzatura. Il vetro viene scelto in base alle esigenze di sicurezza (stratificato 33.1 o 44.2), isolamento termico e resistenza al vento (calcolo NTC 2018).
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni progetto viene accompagnato da un disegno tecnico in pianta e prospetto per l&apos;approvazione prima della produzione. Contattaci per un sopralluogo gratuito a Palermo e provincia.
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

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
