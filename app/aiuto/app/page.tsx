import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import QRCode from 'qrcode'

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
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / App
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Scarica la nostra App</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Porta DIGI Home Design sempre con te, su Android e iPhone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Tutto in tasca</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Con la nostra app hai a portata di mano i preventivi, lo stato del tuo cantiere in tempo reale,
            i documenti e la comunicazione diretta con il tuo referente. Disponibile per Android e iOS.
          </p>
        </div>

        <style>{`
          .app-foto-grid { display: flex; flex-wrap: wrap; gap: 8px; }
          .app-foto-card { width: calc(25% - 6px); min-width: 0; }
          @media (max-width: 580px) { .app-foto-card { width: calc(50% - 4px); } }
          @media (max-width: 300px) { .app-foto-card { width: 100%; } }
        `}</style>
        <div className="app-foto-grid">
          <div className="page-card app-foto-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <Image src="/images/app/preventivo.jpg" alt="Preventivo serramenti" width={280} height={600} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '8px 12px 10px' }}>
              <span className="testo-articoli">Preventivi serramenti</span>
            </div>
          </div>
          <div className="page-card app-foto-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <Image src="/images/app/foto-cantiere.jpg" alt="Cantiere in tempo reale" width={280} height={600} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '8px 12px 10px' }}>
              <span className="testo-articoli">Cantiere in tempo reale</span>
            </div>
          </div>
          <div className="page-card app-foto-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <Image src="/images/app/avvisi.jpg" alt="Avvisi e notifiche" width={280} height={600} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '8px 12px 10px' }}>
              <span className="testo-articoli">Avvisi e notifiche</span>
            </div>
          </div>
          <div className="page-card app-foto-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <Image src="/images/app/lavori-cantiere.jpg" alt="Lavori in cantiere" width={280} height={600} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '8px 12px 10px' }}>
              <span className="testo-articoli">Lavori in cantiere</span>
            </div>
          </div>
        </div>

        {/* Cosa puoi fare */}
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
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
        <div style={{ background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
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

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1 }}>← Home</Link>
          <Link href="/app-download" className="btn-black fs-12" style={{ flex: 1 }}>Scarica l&apos;app →</Link>
        </div>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
