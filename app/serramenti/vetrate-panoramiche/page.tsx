import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Vetrate Panoramiche a Palermo — Pareti Vetrate Scorrevoli su Misura',
  description: 'Vetrate panoramiche a Palermo: pareti vetrate scorrevoli e pieghevoli in alluminio a taglio termico per aprire verande, terrazzi e soggiorni sul giardino, senza montanti a vista.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/vetrate-panoramiche' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Vetrate Panoramiche a Palermo — Pareti Vetrate Scorrevoli su Misura',
    description: 'Vetrate panoramiche a Palermo: pareti vetrate scorrevoli e pieghevoli in alluminio a taglio termico per aprire verande, terrazzi e soggiorni sul giardino, senza montanti a vista.',
    url: 'https://www.digi-home-design.com/serramenti/vetrate-panoramiche',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Vetrate Panoramiche<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Vetrate Panoramiche</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le <strong>vetrate panoramiche a Palermo</strong> sono pareti vetrate scorrevoli o pieghevoli che permettono di aprire completamente verande, terrazzi e soggiorni verso il giardino o la vista, azzerando la distinzione tra interno ed esterno quando il tempo lo permette.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I profili in alluminio a taglio termico sono progettati con montanti sottilissimi per massimizzare la superficie vetrata, con ante che scorrono in accumulo laterale (sistema a libro) o traslano su binario per l&apos;apertura totale del vano, senza soglie a vista.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Vetrocamera basso-emissiva, guarnizioni a doppia battuta e opzione di motorizzazione sono disponibili su richiesta. Il sopralluogo gratuito valuta luce disponibile, carichi di vento e la soluzione di scorrimento più adatta allo spazio. Preventivo dettagliato incluso.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/serramenti" className="btn-black fs-12">← Torna a Serramenti</Link>
          <CtaPreventivo />
          <CtaCantiere />
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti (contenuto nuovo, nessun catalogo DB collegato ancora)</p>
    </div>
  )
}
