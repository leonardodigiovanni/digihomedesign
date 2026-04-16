import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scarica la nostra App',
  description: 'Scarica l\'app DIGI Home Design per Android e iPhone. Preventivi, cantiere in tempo reale e molto altro dal tuo smartphone.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/app' },
}

// TODO: sostituire con i link reali degli store
const GOOGLE_PLAY_URL = '#'
const APP_STORE_URL   = '#'

export default function AppPage() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Scarica la nostra App</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
        Porta DIGI Home Design sempre con te, su Android e iPhone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>

        {/* Descrizione */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Tutto in tasca</h3>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}>
            Con la nostra app hai a portata di mano i preventivi, lo stato del tuo cantiere in tempo reale,
            i documenti e la comunicazione diretta con il tuo referente. Disponibile gratuitamente
            su Google Play Store e Apple App Store.
          </p>
        </div>

        {/* Cosa trovi */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cosa puoi fare dall&apos;app</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { titolo: 'Preventivi online',          testo: 'Configura e salva i tuoi preventivi serramenti direttamente dallo smartphone.' },
              { titolo: 'Cantiere in tempo reale',    testo: 'Segui l\'avanzamento dei lavori con foto, documenti e aggiornamenti dal tuo referente.' },
              { titolo: 'Messaggi diretti',           testo: 'Comunica con il tuo referente senza telefonate: tutto tracciato nell\'app.' },
              { titolo: 'Notifiche push',             testo: 'Ricevi avvisi immediati sulle novità del tuo cantiere o sui tuoi preventivi.' },
            ].map(({ titolo, testo }) => (
              <div key={titolo} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ color: '#c8960c', fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>◆</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{titolo}</div>
                  <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <div style={{ background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
            Scarica l&apos;app gratuitamente
          </p>
          <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.6 }}>
            Disponibile per Android e iPhone. Accedi con le tue credenziali DIGI Home Design.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <a href={GOOGLE_PLAY_URL} className="btn-green" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600,
              borderRadius: 7, textDecoration: 'none',
            }}>
              ▶ Google Play
            </a>
            <a href={APP_STORE_URL} className="btn-gray" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600,
              borderRadius: 7, textDecoration: 'none',
            }}>
              ⌘ App Store
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
