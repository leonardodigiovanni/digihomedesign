import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Pannelli Bugnato Alluminio a Palermo — Facciate e Rivestimenti',
  description: 'Pannelli in alluminio bugnato a Palermo per facciate, cancelli e recinzioni. Leggeri, resistenti alla corrosione e disponibili in ogni colore RAL.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/pannelli-bugnato-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pannelli Bugnato Alluminio a Palermo — Facciate e Rivestimenti',
    description: 'Pannelli in alluminio bugnato a Palermo per facciate, cancelli e recinzioni. Leggeri, resistenti alla corrosione e disponibili in ogni colore RAL.',
    url: 'https://www.digi-home-design.com/metallurgia/pannelli-bugnato-alluminio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Pannelli Bugnato Alluminio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Pannelli Bugnato Alluminio a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/pannelli-bugnato-alluminio/photo_2026-04-15_23-13-47.jpg" alt="Pannelli bugnato in alluminio" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Pannelli bugnato in alluminio</span>
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
              I <strong>pannelli in alluminio bugnato</strong> sono elementi decorativi e funzionali ampiamente utilizzati per rivestimenti di facciate, tamponamenti di cancelli e recinzioni, pannellature per saracinesche e portoni industriali. La lavorazione bugnata conferisce rigidità strutturale al pannello pur mantenendo il peso ridotto tipico dell&apos;alluminio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Lavoriamo con lamiere in alluminio da 1 a 3 mm in vari pattern di bugne — quadra, tonda, elongata — con finitura grezza, anodizzata o verniciata a polvere in qualsiasi colore RAL. I pannelli vengono tagliati su misura e forati per il fissaggio a telai in ferro o alluminio estruso.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ideali per ambienti costieri grazie alla totale resistenza alla ruggine. Contattaci per un preventivo gratuito con campionatura delle finiture disponibili.
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
