import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy & Cookie Policy — DIGI Home Design' }

const h2: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, margin: '28px 0 8px', color: '#1a1a1a',
}
const p: React.CSSProperties = {
  fontSize: 13, lineHeight: 1.7, margin: '0 0 10px', color: '#333',
}
const li: React.CSSProperties = {
  fontSize: 13, lineHeight: 1.7, color: '#333', marginBottom: 4,
}
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16,
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
    <div style={{ padding: '24px 12px 100px' }}>

      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        Privacy Policy &amp; Cookie Policy
      </h1>
      <p style={{ ...p, color: '#888', marginBottom: 28 }}>
        Ultimo aggiornamento: giugno 2026
      </p>

      <h2 style={h2}>1. Titolare del trattamento</h2>
      <p style={p}>
        <strong>DIGI Home Design S.R.L.</strong><br />
        Sede legale: Palermo (PA)<br />
        P.IVA: 07407080824<br />
        Email: info@digi-home-design.com<br />
        PEC: digi_home_design_srl@namirialpec.it<br />
        Telefono: +39 351 871 6731
      </p>

      <h2 style={h2}>2. Dati raccolti e finalità</h2>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}><strong>Dati di registrazione</strong> (username, nome, cognome, email, numero di cellulare, password): creazione e gestione dell'account utente.</li>
        <li style={li}><strong>Dati anagrafici aggiuntivi</strong> (data e luogo di nascita): richiesti nella registrazione completa per l'emissione di documenti commerciali.</li>
        <li style={li}><strong>Dati di navigazione</strong>: indirizzi IP e log del server, raccolti automaticamente per motivi di sicurezza e debugging.</li>
        <li style={li}><strong>Contenuti caricati</strong> (immagini, file): archiviati su Vercel Blob Storage per la gestione del catalogo prodotti.</li>
      </ul>

      <h2 style={h2}>3. Cookie utilizzati</h2>
      <p style={p}>
        Questa app utilizza <strong>esclusivamente cookie tecnici</strong>, necessari al funzionamento del servizio.
        Non vengono utilizzati cookie di profilazione, tracciamento pubblicitario o analisi di terze parti.
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
            <td style={td}>8 ore</td>
          </tr>
          <tr>
            <td style={td}><code>session_role</code></td>
            <td style={td}>Tecnico — autenticazione</td>
            <td style={td}>Memorizza il ruolo dell'utente per controllo degli accessi</td>
            <td style={td}>8 ore</td>
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
        </tbody>
      </table>

      <h2 style={h2}>4. Base giuridica del trattamento</h2>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}><strong>Esecuzione del contratto</strong> (art. 6, par. 1, lett. b GDPR): gestione account, preventivi e ordini.</li>
        <li style={li}><strong>Legittimo interesse</strong> (art. 6, par. 1, lett. f GDPR): sicurezza del servizio.</li>
        <li style={li}><strong>Obbligo legale</strong> (art. 6, par. 1, lett. c GDPR): conservazione documenti fiscali.</li>
      </ul>

      <h2 style={h2}>5. Terze parti</h2>
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
            <td style={td}>Hosting e storage file</td>
            <td style={td}>Dati di navigazione, file caricati</td>
          </tr>
        </tbody>
      </table>

      <h2 style={h2}>6. Conservazione dei dati</h2>
      <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        <li style={li}>Dati dell'account: per tutta la durata del rapporto e 10 anni successivi per obblighi fiscali.</li>
        <li style={li}>Log di navigazione: eliminati entro 12 mesi.</li>
        <li style={li}>Dati OTP: eliminati automaticamente entro 15 minuti o al completamento della verifica.</li>
      </ul>

      <h2 style={h2}>7. Diritti dell'interessato</h2>
      <p style={p}>
        Ai sensi degli artt. 15–22 GDPR puoi richiedere accesso, rettifica, cancellazione, limitazione,
        portabilità dei tuoi dati, oppure opporti al trattamento. Puoi anche proporre reclamo al Garante Privacy
        (<strong>www.garanteprivacy.it</strong>).
      </p>
      <p style={p}>
        Scrivi a: <strong>info@digi-home-design.com</strong>
      </p>

      <h2 style={h2}>8. Sicurezza</h2>
      <p style={p}>
        Tutte le comunicazioni avvengono tramite HTTPS con cifratura TLS. I cookie di sessione sono
        impostati con flag <code>HttpOnly</code> per prevenire accessi da codice JavaScript.
      </p>

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #eee' }}>
        <Link href="/app" className="btn-black-app fs-12">← Torna alla home</Link>
      </div>

    </div>
  )
}
