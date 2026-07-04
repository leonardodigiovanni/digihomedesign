import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import AppBottomNav from './app-bottom-nav'
import AccediBtn from './accedi-btn'
import InstallBtn from './install-btn'
import { ActionBarProvider } from './action-bar-context'
import AppActionBar from './app-action-bar'
import AvvisiNotifier from '@/components/avvisi-notifier'
import { decompressCart } from '@/lib/cart-cookie'
import { getConnection } from '@/lib/db'
import { readSettings } from '@/lib/settings'
import ManutenzioneWatcher from '@/components/manutenzione-watcher'
import { PreventiviProvider } from '@/lib/preventivi-flag-context'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? ''
  const preventivoCartCount = decompressCart(cookieStore.get('digi_cart')?.value ?? '').filter(i => i.parent == null).length
  const acquistiCartCount   = decompressCart(cookieStore.get('digi_cart_acquisti')?.value ?? '').filter(i => i.parent == null).length

  const { manutenzione, rolePermissions } = await readSettings()
  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviAbilitato = isStaff || (rolePermissions['cliente'] ?? []).includes(52)

  let avvisiUnreadCount = 0
  if (username && role === 'cliente') {
    const db = await getConnection()
    try {
      const [uRows] = await db.execute(
        'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      if (clienteId) {
        const [cnt] = await db.execute('SELECT COUNT(*) AS n FROM avvisi WHERE cliente_id = ? AND letto = 0 AND cestinato = 0', [clienteId]) as [{ n: number }[], unknown]
        avvisiUnreadCount = Number(cnt[0]?.n ?? 0)
      }
    } catch {}
    finally { await db.end() }
  }

  return (
    <div className="app-shell">

      {/* Top bar */}
      <header className="app-topbar">
        <Link href="/app" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          <Image src="/images/header/DIGIHOMEDESIGN.png" alt="DIGI Home Design" width={80} height={80} unoptimized loading="eager" style={{ objectFit: 'contain', display: 'block' }} />
        </Link>
        <InstallBtn />
        <div className="app-topbar-user">
          {username ? (
            <span style={{ fontSize: 10, color: '#fff', fontFamily: 'monospace', opacity: 0.75, pointerEvents: 'none', userSelect: 'none' }}>{username}</span>
          ) : (
            <AccediBtn />
          )}
        </div>
      </header>

      {/* Contenuto pagina + action bar */}
      <PreventiviProvider abilitato={preventiviAbilitato}>
        <ActionBarProvider>
          <main className="app-content">
            {children}
          </main>
          <AppActionBar />
        </ActionBarProvider>
      </PreventiviProvider>

      {role === 'cliente' && <AvvisiNotifier />}
      <ManutenzioneWatcher manutenzione={manutenzione} role={role} dest="/app" />

      {manutenzione && role !== 'admin' ? (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
          background: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px), #f5a623',
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: 12,
          fontFamily: 'monospace',
          fontWeight: 600,
          color: '#3a1f00',
          letterSpacing: '0.02em',
        }}>
          Sito in manutenzione — torna più tardi.<br />Ci scusiamo per il disagio.
        </div>
      ) : (
        <AppBottomNav username={username} preventivoCartCount={preventivoCartCount} acquistiCartCount={acquistiCartCount} avvisiUnreadCount={avvisiUnreadCount} manutenzione={manutenzione} preventiviAbilitato={preventiviAbilitato} />
      )}

      <Script id="sw-register" strategy="afterInteractive">{`
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
        }
      `}</Script>

    </div>
  )
}

