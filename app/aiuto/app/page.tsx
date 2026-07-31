import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import QRCode from 'qrcode'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Scarica la nostra App',
  description: 'Scarica l\'app DIGI Home Design per Android e iPhone. Preventivi, cantiere in tempo reale e molto altro dal tuo smartphone.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/app' },
}

export default async function AppPage() {
  const qrDataUrl = await QRCode.toDataURL('https://www.digi-home-design.com/app', {
    width: 140,
    margin: 2,
    color: { dark: '#1c1c1c', light: '#ffffff' },
  })
  return (
    <div style={{ padding: '0 0 64px' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / App<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Scarica la nostra App</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Porta DIGI Home Design sempre con te, su Android e iPhone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Tutto in tasca</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Con la nostra app hai a portata di mano i preventivi, lo stato del tuo cantiere in tempo reale,
            i documenti e la comunicazione diretta con il tuo referente. Disponibile per Android e iOS.
          </p>
        </div>

        <div className="vetrina-foto-row">
          <div className="page-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <Image src="/images/app/preventivo.webp" alt="Preventivo serramenti" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Preventivi serramenti</span>
            </div>
          </div>
          <div className="page-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <Image src="/images/app/lavori-cantiere.webp" alt="Lista cantieri" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Lista cantieri</span>
            </div>
          </div>
          <div className="page-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <Image src="/images/app/foto-cantiere.webp" alt="Cantiere in tempo reale" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Cantiere in tempo reale</span>
            </div>
          </div>
          <div className="page-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <Image src="/images/app/avvisi.webp" alt="Avvisi e notifiche" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Avvisi e notifiche</span>
            </div>
          </div>
        </div>

        {/* Cosa puoi fare */}
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Cosa puoi fare dall&apos;app</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { titolo: 'Preventivi online',       testo: 'Configura e salva i tuoi preventivi serramenti direttamente dallo smartphone.' },
              { titolo: 'Cantiere in tempo reale', testo: 'Segui l\'avanzamento dei lavori con foto, documenti e aggiornamenti dal tuo referente.' },
              { titolo: 'Messaggi diretti',        testo: 'Comunica con il tuo referente senza telefonate: tutto tracciato nell\'app.' },
              { titolo: 'Notifiche push',          testo: 'Ricevi avvisi immediati sulle novità del tuo cantiere o sui tuoi preventivi.' },
            ].map(({ titolo, testo }) => (
              <div key={titolo} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="fs-18" style={{ color: '#c8960c', flexShrink: 0, lineHeight: 1.4 }}>◆</div>
                <div>
                  <div className="testo-articoli" style={{ marginBottom: 2 }}>{titolo}</div>
                  <div className="testo-articoli" style={{ lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <div style={{ background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Scarica l&apos;app gratuitamente
          </p>
          <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
            Disponibile per Android e iPhone. Accedi con le tue credenziali DIGI Home Design.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href="https://www.digi-home-design.com/app" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: 'fit-content', margin: '0 auto' }}>
            <img src={qrDataUrl} alt="QR code app" width={140} height={140} style={{ display: 'block' }} />
          </a>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <Link href="/app-download" className="btn-black fs-12">Scarica l&apos;app →</Link>
        </StickyBottomBarContent>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
