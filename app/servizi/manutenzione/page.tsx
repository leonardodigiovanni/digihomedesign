import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Manutenzione a Palermo — Casa e Ufficio in Perfetto Stato',
  description: 'Servizi di manutenzione ordinaria e straordinaria a Palermo per casa e ufficio. Infissi, serramenti, impianti e strutture sempre efficienti.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/manutenzione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Manutenzione a Palermo — Casa e Ufficio in Perfetto Stato',
    description: 'Servizi di manutenzione ordinaria e straordinaria a Palermo per casa e ufficio. Infissi, serramenti, impianti e strutture sempre efficienti.',
    url: 'https://www.digi-home-design.com/servizi/manutenzione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Manutenzione
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Manutenzione a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              La <strong>manutenzione regolare</strong> prolunga la vita di infissi, serramenti, verande, persiane e strutture metalliche, prevenendo guasti costosi e mantenendo l&apos;efficienza energetica dell&apos;edificio. Offriamo piani di manutenzione ordinaria personalizzati per privati, condomini e attività commerciali a Palermo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli interventi di manutenzione includono: lubrificazione e regolazione delle parti mobili, controllo delle guarnizioni e dei sigillanti, verifica delle chiusure di sicurezza, pulizia dei profili e degli spazi di drenaggio, e ispezione generale dello stato di conservazione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Proponiamo anche contratti di manutenzione annuale con visite programmate, per avere sempre tutto sotto controllo senza pensieri. Contattaci per un sopralluogo gratuito e un piano di manutenzione su misura.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/servizi" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Servizi</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
