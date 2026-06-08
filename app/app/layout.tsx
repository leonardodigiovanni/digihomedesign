import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import AppBottomNav from './app-bottom-nav'
import { appLogout } from './login/actions'
import AvvisiNotifier from '@/components/avvisi-notifier'
import { decompressCart } from '@/lib/cart-cookie'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? ''
  const preventivoCartCount = decompressCart(cookieStore.get('digi_cart')?.value ?? '').filter(i => i.parent == null).length
  const acquistiCartCount   = decompressCart(cookieStore.get('digi_cart_acquisti')?.value ?? '').filter(i => i.parent == null).length

  return (
    <div className="app-shell">

      {/* Top bar */}
      <header className="app-topbar">
        <Link href="/app" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          <Image src="/images/header/DIGIHOMEDESIGN.png" alt="DIGI Home Design" width={80} height={80} unoptimized style={{ objectFit: 'contain', display: 'block' }} />
        </Link>
        <div className="app-topbar-user">
          {username ? (
            <>
              <span style={{ fontSize: 10, color: '#fff', fontFamily: 'monospace', opacity: 0.75, pointerEvents: 'none', userSelect: 'none' }}>{username}</span>
              <form action={appLogout}>
                <button type="submit" className="btn-orange" style={{ height: 42, padding: '0 16px', borderRadius: 21, fontSize: 13, fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Esci</button>
              </form>
            </>
          ) : (
            <>
              <span style={{ fontSize: 10, opacity: 0, pointerEvents: 'none', userSelect: 'none' }}>.</span>
              <Link href="/app/login" className="btn-black" style={{ height: 42, padding: '0 20px', borderRadius: 21, fontSize: 13, fontFamily: 'monospace', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Accedi</Link>
            </>
          )}
        </div>
      </header>

      {/* Contenuto pagina */}
      <main className="app-content">
        {children}
      </main>

      {role === 'cliente' && <AvvisiNotifier />}
      <AppBottomNav username={username} preventivoCartCount={preventivoCartCount} acquistiCartCount={acquistiCartCount} />

    </div>
  )
}
