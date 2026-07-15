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
    <div style={{ padding: '0 0 64px' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / Guida Cantiere
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Segui il tuo cantiere in tempo reale</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Un servizio esclusivo per monitorare l&apos;avanzamento dei tuoi lavori, ovunque tu sia.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <div className="vetrina-foto-row">
          <div className="page-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'relative', width: '100%', height: 148 }}>
              <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Fotografia da scegliere</span>
            </div>
          </div>
          <div className="page-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative', width: '100%', height: 148 }}>
              <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Fotografia da scegliere</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Di cosa si tratta</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            La tua area cantiere ti tiene sempre aggiornato sull&apos;andamento dei lavori: foto e video del progresso,
            documenti, scadenze e messaggi diretti con il tuo referente — tutto in un unico posto,
            accessibile da qualsiasi dispositivo.
          </p>
        </div>

        {/* Cosa trovi */}
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Cosa trovi nell&apos;area clienti</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { titolo: 'Stato avanzamento lavori', testo: 'Una timeline aggiornata con le fasi del cantiere completate e quelle in corso.' },
              { titolo: 'Foto e documenti',         testo: 'Il tuo referente carica foto e documenti direttamente dall\'area: contratti, planimetrie, foto di cantiere.' },
              { titolo: 'Comunicazioni dirette',    testo: 'Messaggi con il tuo referente senza email o telefonate: tutto tracciato e sempre consultabile.' },
              { titolo: 'Scadenze e appuntamenti',  testo: 'Ricevi notifiche sulle prossime fasi e sugli appuntamenti concordati.' },
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

        {/* Banner accesso */}
        <div style={{ background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Per accedere al cantiere online è necessario registrarsi e attendere la configurazione dell&apos;area personale.
          </p>
          <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
            La registrazione è gratuita. Una volta attivato il tuo profilo, il tuo referente
            configurerà la tua area cantiere e riceverai accesso immediato.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <AccediDropdown />
            <Link href={registrazioniDisabilitate ? '/brand/contatti' : '/registrazione'} className="btn-black fs-12">
              {registrazioniDisabilitate ? 'Richiedi registrazione' : 'Registrati'}
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1 }}>← Home</Link>
          <Link href="/area-clienti/cantieri" className="btn-black fs-12" style={{ flex: 1 }}>I miei cantieri →</Link>
        </div>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
