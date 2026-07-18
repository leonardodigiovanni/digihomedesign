import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import AccediDropdown from '@/components/accedi-dropdown'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Guida Preventivo Online',
  description: 'Scopri come ottenere un preventivo serramenti online in autonomia. Configura, invia e ricevi la tua stima in tempo reale.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-preventivo' },
}

export default async function GuidaPreventivo() {
  const { registrazioniDisabilitate } = await readSettings()
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const cartRaw = cookieStore.get('digi_cart')?.value
  const cartNonVuoto = !!cartRaw && (() => { try { const c = JSON.parse(cartRaw); return Array.isArray(c) && c.length > 0 } catch { return false } })()
  return (
    <div style={{ padding: '0 0 64px' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / Guida Preventivo<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Preventivo serramenti online</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Un servizio esclusivo per configurare il tuo preventivo in autonomia, senza aspettare nessuno.
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
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Il nostro sistema di preventivo online ti permette di configurare infissi, persiane, verande e porte
            direttamente dal tuo browser o tramite DIGI-App. Inserisci le misure, scegli i materiali e le finiture: riceverai
            una stima immediata e se soddisfatto potrai inviare con un click la richiesta di ricontatto.
          </p>
        </div>

        {/* Come funziona */}
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { n: '1', titolo: 'Configura il tuo preventivo', testo: 'Scegli il tipo di serramento, le dimensioni, i materiali e le finiture che preferisci, per tutti gli elementi che devi acquistare. Potrai aggiungere elementi nel carrello-preventivo direttamente navigando tra i cataloghi oppure selezionandoli nella pagina preventivo-online.' },
              { n: '2', titolo: 'Ricevi la stima iniziale', testo: `Il sistema calcola il preventivo in tempo reale. Puoi modificarlo, salvarlo, stamparlo a piacimento. (*)` },
              { n: '3', titolo: 'Accedi alla tua area', testo: 'Se desideri scoprire le offerte e gli sconti abbinabili al preventivo, Accedi con le tue credenziali o se non ne hai Registrati.' },
              { n: '4', titolo: 'Contattaci per il preventivo finale', testo: 'Se sei soddisfatto contattaci al più presto per la definizione del preventivo finale. Ti contatteremo perché abbiamo bisogno di informazioni aggiuntive come comune di destinazione dei prodotti, indirizzo, piano, tipo di fornitura richiesta se include montaggio, opere murarie, sopralluogo, rilevazione misure, etc.' },
            ].map(({ n, titolo, testo }) => (
              <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="fs-15" style={{ width: 32, height: 32, borderRadius: '50%', background: '#c8960c', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n}
                </div>
                <div>
                  <div className="testo-articoli" style={{ marginBottom: 4 }}>{titolo}</div>
                  <div className="testo-articoli" style={{ lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="testo-articoli" style={{ margin: '8px 0 0' }}>
            (*) Il servizio è soggetto a limitazioni per utenti senza registrazione, fino all&apos;esclusione in caso di abusi.
          </p>
        </div>

        {/* Banner accesso — solo per utenti non loggati */}
        {!username && (
          <div style={{ background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Per accedere al preventivo online <span style={{ textDecoration: 'underline' }}>NON</span> è necessario registrarsi.
            </p>
            <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
              La registrazione comunque è gratuita e richiede meno di un minuto. Una volta registrato avrai accesso a tutte le promozioni disponibili e, se diventi cliente, al servizio Cantiere-Online in tempo reale, alla cronologia degli ultimi sei mesi (**) dei tuoi ordini, preventivi, cantieri, fatture e molto altro.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AccediDropdown />
              <Link href={registrazioniDisabilitate ? '/brand/contatti' : '/registrazione'} className="btn-black fs-12">
                {registrazioniDisabilitate ? 'Richiedi registrazione' : 'Registrati'}
              </Link>
            </div>
            <p className="testo-articoli" style={{ margin: 0 }}>
              (**) Si consiglia di scaricare e conservare o stampare i documenti del proprio archivio durante questo sufficiente periodo di tempo perché, una volta trascorso, saranno eliminati dal sistema.
            </p>
          </div>
        )}

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <Link href="/brand/cataloghi" className="btn-black fs-12">Cataloghi →</Link>
          {cartNonVuoto && (
          <Link href="/area-clienti/carrello-preventivo" className="btn-black fs-12">Carrello preventivi →</Link>
          )}
        </StickyBottomBarContent>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
