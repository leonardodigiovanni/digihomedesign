import { cookies } from 'next/headers'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <>
      <div className="app-card">
        <p className="app-card-title">Cataloghi</p>
        <p className="app-card-body">Sfoglia i nostri cataloghi, aggiungi gli articoli che ti interessano e scegli: acquistali subito oppure usali per simulare un preventivo personalizzato per i tuoi infissi, verande o ristrutturazioni.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">I miei preventivi</p>
        <p className="app-card-body">Consulta tutti i preventivi che hai salvato: riepilogo articoli, prezzi e stato di avanzamento.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">I miei cantieri</p>
        <p className="app-card-body">Segui i tuoi lavori in tempo reale: foto, aggiornamenti e rapporti giornalieri.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Documenti</p>
        <p className="app-card-body">Consulta fatture, contratti e tutta la documentazione legata ai tuoi interventi.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Avvisi</p>
        <p className="app-card-body">Riceverai qui i nostri messaggi: aggiornamenti sui lavori, offerte riservate e comunicazioni importanti.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Contatti</p>
        <p className="app-card-body">Trova i nostri recapiti, scrivici o richiedi un appuntamento direttamente da qui.</p>
      </div>
    </>
  )
}
