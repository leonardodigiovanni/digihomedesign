import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scarica la nostra App',
  description: 'Scarica l\'app DIGI Home Design per Android e iPhone. Preventivi, cantiere in tempo reale e molto altro dal tuo smartphone.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/app' },
}


export default function AppPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / App
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Scarica la nostra App</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 32 }}>
        Porta DIGI Home Design sempre con te, su Android e iPhone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Prima riga: primo articolo + foto */}
        <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
            <h3 className="testo-articoli" style={{ marginBottom: 12 }}>Tutto in tasca</h3>
            <p className="testo-articoli" style={{ lineHeight: 1.8 }}>
              Con la nostra app hai a portata di mano i preventivi, lo stato del tuo cantiere in tempo reale,
              i documenti e la comunicazione diretta con il tuo referente. Disponibile gratuitamente
              su Google Play Store e Apple App Store.
            </p>
          </div>

          <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', alignItems: 'flex-start' }}>
            <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 220, height: 240 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 220, height: 240 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>

        </div>

        </div>{/* fine gruppo ravvicinato */}

        {/* Cosa puoi fare Fotografia da scegliere larghezza piena */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 className="testo-articoli" style={{ marginBottom: 16 }}>Cosa puoi fare dall&apos;app</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { titolo: 'Preventivi online',          testo: 'Configura e salva i tuoi preventivi serramenti direttamente dallo smartphone.' },
              { titolo: 'Cantiere in tempo reale',    testo: 'Segui l\'avanzamento dei lavori con foto, documenti e aggiornamenti dal tuo referente.' },
              { titolo: 'Messaggi diretti',           testo: 'Comunica con il tuo referente senza telefonate: tutto tracciato nell\'app.' },
              { titolo: 'Notifiche push',             testo: 'Ricevi avvisi immediati sulle novità del tuo cantiere o sui tuoi preventivi.' },
            ].map(({ titolo, testo }) => (
              <div key={titolo} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="fs-18" style={{ color: '#c8960c', flexShrink: 0, lineHeight: 1.4 }}>◆</div>
                <div>
                  <div className="testo-articoli" style={{ marginBottom: 2 }}>{titolo}</div>
                  <div className="testo-articoli" style={{ lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Fotografia da scegliere larghezza piena */}
        <div style={{ background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Scarica l&apos;app gratuitamente
          </p>
          <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
            Disponibile per Android e iPhone. Accedi con le tue credenziali DIGI Home Design.
          </p>
          <Image src="/images/cta/digi-home-design-app.png" alt="QR code sito" width={140} height={140} style={{ display: 'block', marginTop: 4 }} />
        </div>

      </div>
    </div>
  )
}
