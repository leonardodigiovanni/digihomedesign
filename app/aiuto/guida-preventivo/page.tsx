import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guida Preventivo Online',
  description: 'Scopri come ottenere un preventivo serramenti online in autonomia. Configura, invia e ricevi la tua stima in tempo reale.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-preventivo' },
}

export default function GuidaPreventivo() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Preventivo serramenti online</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
        Un servizio esclusivo per configurare il tuo preventivo in autonomia, senza aspettare.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>

        {/* Descrizione */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Di cosa si tratta</h3>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}>
            Il nostro sistema di preventivo online ti permette di configurare infissi, persiane, verande e porte
            direttamente dal tuo browser. Inserisci le misure, scegli i materiali e le finiture: riceverai
            una stima immediata e potrai richiedere la conferma con un click.
          </p>
        </div>

        {/* Come funziona */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Come funziona</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '1', titolo: 'Accedi alla tua area', testo: 'Registrati o accedi con le tue credenziali. Il servizio è riservato ai clienti registrati.' },
              { n: '2', titolo: 'Configura il tuo preventivo', testo: 'Scegli il tipo di serramento, le dimensioni, i materiali e le finiture che preferisci.' },
              { n: '3', titolo: 'Ricevi la stima', testo: 'Il sistema calcola il preventivo in tempo reale. Salvalo, modificalo o inviaci la richiesta di conferma.' },
            ].map(({ n, titolo, testo }) => (
              <div key={n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#c8960c', color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{titolo}</div>
                  <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner accesso */}
        <div style={{ background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
            Per accedere al preventivo online è necessario registrarsi.
          </p>
          <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.6 }}>
            La registrazione è gratuita e richiede meno di un minuto. Una volta registrato avrai accesso
            a tutti i servizi esclusivi: preventivi, cantiere in tempo reale e molto altro.
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
