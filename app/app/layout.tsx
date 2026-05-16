import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import AppBottomNav from './app-bottom-nav'
import { appLogout } from './login/actions'
import './app.css'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <div className="app-shell">

      {/* Top bar */}
      <header className="app-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Image src="/images/header/digi-tr.png" alt="DIGI" width={76} height={76} unoptimized style={{ objectFit: 'contain' }} />
          <Image src="/images/volantino/nome_tr.png" alt="Home Design" width={90} height={30} unoptimized style={{ objectFit: 'contain', marginLeft: -9, marginTop: 16 }} />
        </div>
        <div className="app-topbar-user">
          {username ? (
            <>
              <span style={{ display: 'block' }}>{username}</span>
              <form action={appLogout} style={{ display: 'inline' }}>
                <button type="submit" style={{ background: 'none', border: 'none', color: '#bbb', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Esci</button>
              </form>
            </>
          ) : (
            <Link href="/app/login" style={{ color: '#bbb', fontSize: 12 }}>Accedi</Link>
          )}
        </div>
      </header>

      {/* Contenuto pagina */}
      <main className="app-content">
        {children}
      </main>

      <AppBottomNav />

    </div>
  )
}
