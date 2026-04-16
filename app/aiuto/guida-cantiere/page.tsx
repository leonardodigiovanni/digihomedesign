import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guida Cantiere Online',
  description: 'Segui il tuo cantiere in tempo reale dalla tua area clienti. Foto, aggiornamenti, documenti e comunicazioni con il tuo referente.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-cantiere' },
}

export default function GuidaCantiere() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Segui il tuo cantiere in tempo reale</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
        Un servizio esclusivo per monitorare l&apos;avanzamento dei tuoi lavori, ovunque tu sia.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>

        {/* Descrizione */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Di cosa si tratta</h3>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}>
            La tua area cantiere ti tiene sempre aggiornato sull&apos;andamento dei lavori: foto del progresso,
            documenti, scadenze e messaggi diretti con il tuo referente — tutto in un unico posto,
            accessibile da qualsiasi dispositivo.
          </p>
        </div>

        {/* Cosa trovi */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cosa trovi nell&apos;area clienti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { titolo: 'Stato avanzamento lavori', testo: 'Una timeline aggiornata con le fasi del cantiere completate e quelle in corso.' },
              { titolo: 'Foto e documenti', testo: 'Il tuo referente carica foto e documenti direttamente dall\'area: contratti, planimetrie, foto di cantiere.' },
              { titolo: 'Comunicazioni dirette', testo: 'Messaggi con il tuo referente senza email o telefonate: tutto tracciato e sempre consultabile.' },
              { titolo: 'Scadenze e appuntamenti', testo: 'Ricevi notifiche sulle prossime fasi e sugli appuntamenti concordati.' },
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

        {/* Banner accesso */}
        <div style={{ background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
            Per accedere al cantiere online è necessario registrarsi.
          </p>
          <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.6 }}>
            La registrazione è gratuita. Una volta attivato il tuo profilo, il tuo referente
            configurerà la tua area cantiere e riceverai accesso immediato.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <Link href="/registrazione" className="btn-green" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600,
              borderRadius: 7, textDecoration: 'none',
            }}>
              Registrati gratis
            </Link>
            <Link href="/" className="btn-gray" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600,
              borderRadius: 7, textDecoration: 'none',
            }}>
              Accedi
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
