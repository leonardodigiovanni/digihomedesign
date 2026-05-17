import { cookies } from 'next/headers'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <>
      <div className="app-card">
        <p className="app-card-title">Preventivo Online</p>
        <p className="app-card-body">Calcola un preventivo personalizzato per i tuoi infissi, verande o ristrutturazioni.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Cantiere Online</p>
        <p className="app-card-body">Segui i tuoi lavori in tempo reale: foto, aggiornamenti e rapporti giornalieri.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Documenti</p>
        <p className="app-card-body">Consulta fatture, contratti e tutta la documentazione legata ai tuoi interventi.</p>
      </div>

      <div className="app-card">
        <p className="app-card-title">Notifiche</p>
        <p className="app-card-body">Riceverai qui i nostri messaggi: aggiornamenti sui lavori, offerte riservate e comunicazioni importanti.</p>
      </div>
    </>
  )
}
