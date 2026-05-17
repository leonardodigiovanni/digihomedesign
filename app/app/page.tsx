import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <>

      <h1 className="app-welcome-title">
        {username ? `Ciao, ${username}` : 'Benvenuto'}
      </h1>
      <p className="app-welcome-sub">
        {username
          ? 'Usa il menu in basso per accedere ai tuoi servizi.'
          : 'Accedi per visualizzare i tuoi preventivi, cantieri e documenti.'}
      </p>

      {!username && (
        <Link href="/login" className="app-btn" style={{ marginBottom: 12 }}>
          Accedi
        </Link>
      )}

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
    </>
  )
}
