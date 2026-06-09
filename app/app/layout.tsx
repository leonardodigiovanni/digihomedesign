import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import AppBottomNav from './app-bottom-nav'
import { appLogout } from './login/actions'
import AvvisiNotifier from '@/components/avvisi-notifier'
import { decompressCart } from '@/lib/cart-cookie'
import { getConnection } from '@/lib/db'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? ''
  const preventivoCartCount = decompressCart(cookieStore.get('digi_cart')?.value ?? '').filter(i => i.parent == null).length
  const acquistiCartCount   = decompressCart(cookieStore.get('digi_cart_acquisti')?.value ?? '').filter(i => i.parent == null).length

  let avvisiUnreadCount = 0
  if (username && role === 'cliente') {
    const db = await getConnection()
    try {
      const [uRows] = await db.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.execute('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
        const clienteId = cRows[0]?.id
        if (clienteId) {
          const [cnt] = await db.execute('SELECT COUNT(*) AS n FROM avvisi WHERE cliente_id = ? AND letto = 0 AND cestinato = 0', [clienteId]) as [{ n: number }[], unknown]
          avvisiUnreadCount = Number(cnt[0]?.n ?? 0)
        }
      }
    } catch {}
    finally { await db.end() }
  }

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
                <button type="submit" className="btn-orange" style={{ padding: '0 16px' }}>Esci</button>
              </form>
            </>
          ) : (
            <>
              <span style={{ fontSize: 10, opacity: 0, pointerEvents: 'none', userSelect: 'none' }}>.</span>
              <Link href="/app/login" className="btn-black">Accedi</Link>
            </>
          )}
        </div>
      </header>

      {/* Contenuto pagina */}
      <main className="app-content">
        {children}
      </main>

      {role === 'cliente' && <AvvisiNotifier />}
      <AppBottomNav username={username} preventivoCartCount={preventivoCartCount} acquistiCartCount={acquistiCartCount} avvisiUnreadCount={avvisiUnreadCount} />

    </div>
  )
}
