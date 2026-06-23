import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy & Cookie Policy — DIGI Home Design' }

const h2: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, margin: '28px 0 8px', fontFamily: 'monospace', color: '#1a1a1a',
}
const p: React.CSSProperties = {
  fontSize: 13, lineHeight: 1.7, margin: '0 0 10px', fontFamily: 'monospace', color: '#333',
}
const li: React.CSSProperties = {
  fontSize: 13, lineHeight: 1.7, fontFamily: 'monospace', color: '#333', marginBottom: 4,
}
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'monospace', marginBottom: 16,
}
const th: React.CSSProperties = {
  textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid #c8960c',
  fontWeight: 700, fontSize: 11, textTransform: 'uppercase', color: '#3a2000',
}
const td: React.CSSProperties = {
  padding: '6px 8px', borderBottom: '1px solid #eee', verticalAlign: 'top',
}

export default function Page() {
  return (
    <div style={{ padding: '0 0 80px' }}>

      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>
        Privacy Policy &amp; Cookie Policy
      </h1>
      <p style={{ ...p, color: '#888', marginBottom: 32 }}>
        Ultimo aggiornamento: giugno 2026
      </p>

      {/* 1 */}
      <h2 style={h2}>1. Titolare del trattamento</h2>
      <p style={p}>
        <strong>DIGI Home Design S.R.L.</strong><br />
        Sede legale: Palermo (PA)<br />
        P.IVA: 07407080824<br />
        Email: info@digi-home-design.com<br />
        PEC: digi_home_design_srl@namirialpec.it<br />
        Telefono: +39 351 871 6731
      </p>

      {/* 2 */}
      <h2 style={h2}>2. Dati raccolti e finalità</h2>
      <p style={p}>
        Il sito raccoglie i seguenti dati personali esclusivamente per le finalità indicate:
      </p>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}><strong>Dati di registrazione</strong> (username, nome, cognome, email, numero di cellulare, password): creazione e gestione dell'account utente.</li>
        <li style={li}><strong>Dati anagrafici aggiuntivi</strong> (data e luogo di nascita): richiesti nella registrazione completa per l'emissione di documenti commerciali.</li>
        <li style={li}><strong>Dati di navigazione</strong>: indirizzi IP e log del server, raccolti automaticamente per motivi di sicurezza e debugging. Non vengono condivisi con terzi né utilizzati per profilazione.</li>
        <li style={li}><strong>Contenuti caricati</strong> (immagini, file): archiviati su Vercel Blob Storage per la gestione del catalogo prodotti.</li>
      </ul>

      {/* 3 */}
      <h2 style={h2}>3. Cookie utilizzati</h2>
      <p style={p}>
        Questo sito utilizza <strong>esclusivamente cookie tecnici</strong>, necessari al funzionamento del servizio.
        Non vengono utilizzati cookie di profilazione, di tracciamento pubblicitario o di analisi di terze parti.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={th}>Nome</th>
            <th style={th}>Tipo</th>
            <th style={th}>Finalità</th>
            <th style={th}>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}><code>session_user</code></td>
            <td style={td}>Tecnico — autenticazione</td>
            <td style={td}>Mantiene la sessione dell'utente autenticato</td>
            <td style={td}>8 ore (rinnovato ad ogni attività)</td>
          </tr>
          <tr>
            <td style={td}><code>session_role</code></td>
            <td style={td}>Tecnico — autenticazione</td>
            <td style={td}>Memorizza il ruolo dell'utente per controllo degli accessi</td>
            <td style={td}>8 ore (rinnovato ad ogni attività)</td>
          </tr>
          <tr>
            <td style={td}><code>digi_cart</code></td>
            <td style={td}>Tecnico — funzionale</td>
            <td style={td}>Mantiene i contenuti del carrello preventivi</td>
            <td style={td}>Sessione browser</td>
          </tr>
          <tr>
            <td style={td}><code>digi_cart_acquisti</code></td>
            <td style={td}>Tecnico — funzionale</td>
            <td style={td}>Mantiene i contenuti del carrello acquisti</td>
            <td style={td}>Sessione browser</td>
          </tr>
          <tr>
            <td style={td}><code>profilo_incompleto</code></td>
            <td style={td}>Tecnico — funzionale</td>
            <td style={td}>Indica che il profilo utente richiede completamento</td>
            <td style={td}>Sessione browser</td>
          </tr>
          <tr>
            <td style={td}><code>cookie_consent</code></td>
            <td style={td}>Tecnico — preferenze</td>
            <td style={td}>Salva la scelta dell'utente sulle preferenze cookie</td>
            <td style={td}>12 mesi</td>
          </tr>
          <tr>
            <td style={td}><code>_digi_analytics</code></td>
            <td style={td}>Analitico (opzionale)</td>
            <td style={td}>Attivato solo con consenso; utilizzato per analisi statistica anonima delle visite</td>
            <td style={td}>12 mesi (solo se consenso "Accetta tutto")</td>
          </tr>
        </tbody>
      </table>
      <p style={p}>
        Poiché vengono utilizzati solo cookie tecnici, <strong>non è richiesto il consenso</strong> ai sensi
        dell'art. 122 del D.Lgs. 196/2003 e delle Linee guida del Garante Privacy del 10 giugno 2021.
      </p>

      {/* 4 */}
      <h2 style={h2}>4. Base giuridica del trattamento</h2>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}><strong>Esecuzione del contratto</strong> (art. 6, par. 1, lett. b GDPR): per la gestione dell'account, dei preventivi e degli ordini.</li>
        <li style={li}><strong>Legittimo interesse</strong> (art. 6, par. 1, lett. f GDPR): per la sicurezza del servizio e la prevenzione di accessi non autorizzati.</li>
        <li style={li}><strong>Obbligo legale</strong> (art. 6, par. 1, lett. c GDPR): per la conservazione dei documenti fiscali nei termini di legge.</li>
      </ul>

      {/* 5 */}
      <h2 style={h2}>5. Terze parti coinvolte nel trattamento</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={th}>Fornitore</th>
            <th style={th}>Servizio</th>
            <th style={th}>Dati trasmessi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}><strong>Twilio Inc.</strong></td>
            <td style={td}>Invio SMS per verifica OTP</td>
            <td style={td}>Numero di cellulare, testo del messaggio</td>
          </tr>
          <tr>
            <td style={td}><strong>Resend / SMTP provider</strong></td>
            <td style={td}>Invio email transazionali</td>
            <td style={td}>Indirizzo email, contenuto del messaggio</td>
          </tr>
          <tr>
            <td style={td}><strong>Vercel Inc.</strong></td>
            <td style={td}>Hosting applicazione e storage file</td>
            <td style={td}>Dati di navigazione, file caricati</td>
          </tr>
        </tbody>
      </table>
      <p style={p}>
        Tutti i fornitori operano come responsabili del trattamento ai sensi dell'art. 28 GDPR e garantiscono
        adeguate misure di sicurezza. I dati non vengono venduti né ceduti a terzi per finalità di marketing.
      </p>

      {/* 6 */}
      <h2 style={h2}>6. Conservazione dei dati</h2>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}>Dati dell'account: conservati per tutta la durata del rapporto contrattuale e per 10 anni successivi per obblighi fiscali.</li>
        <li style={li}>Log di navigazione: eliminati entro 12 mesi.</li>
        <li style={li}>Dati OTP (verifica SMS/email): eliminati automaticamente entro 15 minuti o al completamento della verifica.</li>
      </ul>

      {/* 7 */}
      <h2 style={h2}>7. Diritti dell'interessato</h2>
      <p style={p}>
        Ai sensi degli artt. 15–22 GDPR, l'interessato ha il diritto di:
      </p>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}>Accedere ai propri dati personali</li>
        <li style={li}>Richiederne la rettifica o la cancellazione</li>
        <li style={li}>Opporsi al trattamento o richiederne la limitazione</li>
        <li style={li}>Richiedere la portabilità dei dati</li>
        <li style={li}>Proporre reclamo all'autorità di controllo (Garante Privacy — <strong>www.garanteprivacy.it</strong>)</li>
      </ul>
      <p style={p}>
        Per esercitare questi diritti scrivere a: <strong>info@digi-home-design.com</strong>
      </p>

      {/* 8 */}
      <h2 style={h2}>8. Sicurezza</h2>
      <p style={p}>
        I dati sono archiviati su server protetti. Le comunicazioni tra browser e server avvengono tramite
        protocollo HTTPS con cifratura TLS. I cookie di sessione sono impostati con flag <code>HttpOnly</code> per
        prevenire accessi da codice JavaScript.
      </p>

      {/* 9 */}
      <h2 style={h2}>9. Modifiche alla presente informativa</h2>
      <p style={p}>
        Il Titolare si riserva il diritto di aggiornare questa informativa. Le modifiche sostanziali saranno
        comunicate agli utenti registrati via email. La versione aggiornata è sempre disponibile a questa pagina.
      </p>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee' }}>
        <Link href="/" style={{ fontSize: 12, fontFamily: 'monospace', color: '#888', textDecoration: 'underline' }}>
          ← Torna alla home
        </Link>
      </div>

    </div>
  )
}
