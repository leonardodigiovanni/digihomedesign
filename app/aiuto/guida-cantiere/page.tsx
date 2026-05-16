import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { readSettings } from '@/lib/settings'
import AccediDropdown from '@/components/accedi-dropdown'

export const metadata: Metadata = {
  title: 'Guida Cantiere Online',
  description: 'Segui il tuo cantiere in tempo reale dalla tua area clienti. Foto, aggiornamenti, documenti e comunicazioni con il tuo referente.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-cantiere' },
}

export default async function GuidaCantiere() {
  const { registrazioniDisabilitate } = await readSettings()
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / Guida Cantiere
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Segui il tuo cantiere in tempo reale</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 32 }}>
        Un servizio esclusivo per monitorare l&apos;avanzamento dei tuoi lavori, ovunque tu sia.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Prima riga: primo articolo + foto */}
        <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
            <h3 className="testo-articoli" style={{ marginBottom: 12 }}>Di cosa si tratta</h3>
            <p className="testo-articoli" style={{ lineHeight: 1.8 }}>
              La tua area cantiere ti tiene sempre aggiornato sull&apos;andamento dei lavori: foto e video del progresso,
              documenti, scadenze e messaggi diretti con il tuo referente Fotografia da scegliere tutto in un unico posto,
              accessibile da qualsiasi dispositivo.
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

        {/* Cosa trovi Fotografia da scegliere larghezza piena */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <h3 className="testo-articoli" style={{ marginBottom: 16 }}>Cosa trovi nell&apos;area clienti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { titolo: 'Stato avanzamento lavori', testo: 'Una timeline aggiornata con le fasi del cantiere completate e quelle in corso.' },
              { titolo: 'Foto e documenti', testo: 'Il tuo referente carica foto e documenti direttamente dall\'area: contratti, planimetrie, foto di cantiere.' },
              { titolo: 'Comunicazioni dirette', testo: 'Messaggi con il tuo referente senza email o telefonate: tutto tracciato e sempre consultabile.' },
              { titolo: 'Scadenze e appuntamenti', testo: 'Ricevi notifiche sulle prossime fasi e sugli appuntamenti concordati.' },
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

        {/* Banner accesso Fotografia da scegliere larghezza piena */}
        <div style={{ background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Per accedere al cantiere online è necessario registrarsi e attendere la configurazione dell&apos;area personale.
          </p>
          <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
            La registrazione è gratuita. Una volta attivato il tuo profilo, il tuo referente
            configurerà la tua area cantiere e riceverai accesso immediato.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <AccediDropdown />
            <Link href={registrazioniDisabilitate ? '/brand/contatti' : '/registrazione'} className="btn-black" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 22px', height: 38, fontWeight: 600,
              borderRadius: 7, textDecoration: 'none',
            }}>
              {registrazioniDisabilitate ? 'Richiedi registrazione' : 'Registrati'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
