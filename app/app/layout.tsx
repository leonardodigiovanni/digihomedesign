import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import AppBottomNav from './app-bottom-nav'
import { appLogout } from './login/actions'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <div className="app-shell">

      {/* Top bar */}
      <header className="app-topbar">
        <Link href="/app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
          <Image src="/images/header/qqqqqqqqqqqqqqqqqqq-Photoroom.png" alt="DIGI Home Design" width={82} height={82} unoptimized style={{ objectFit: 'contain', display: 'block' }} />
          <Image src="/images/volantino/nome_tr.png" alt="Home Design" width={110} height={37} unoptimized style={{ objectFit: 'contain', display: 'block', marginTop: -8 }} />
        </Link>
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
