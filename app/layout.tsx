import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import Header from '@/components/header'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import InactivityGuard from '@/components/inactivity-guard'
import { readSettings, type BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBoxShadow } from '@/lib/bg-utils'
import { getConnection } from '@/lib/db'
import Image from 'next/image'
import EmergencyLogin from '@/components/emergency-login'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'DIGI Home Design',
    template: '%s | DIGI Home Design',
  },
  description: 'DIGI Home Design S.R.L. — Progettazione e ristrutturazione di interni',
}

const PAGE_EFFECT_CLASS: Record<string, string> = {
  gold_a:         'class_gold_A',
  gold_b:         'class_gold_B_safe',
  gold_c:         'class_gold_C_safe',
  gold_d:         'class_gold_D_safe',
  gold_a_inv:     'class_gold_A_inv',
  gold_b_inv:     'class_gold_B_inv_safe',
  gold_c_inv:     'class_gold_C_inv_safe',
  gold_d_inv:     'class_gold_D_inv_safe',
  silver_a:       'class_silver_A',
  silver_b:       'class_silver_B_safe',
  silver_c:       'class_silver_C_safe',
  silver_d:       'class_silver_D_safe',
  silver_a_inv:   'class_silver_A_inv',
  silver_b_inv:   'class_silver_B_inv_safe',
  silver_c_inv:   'class_silver_C_inv_safe',
  silver_d_inv:   'class_silver_D_inv_safe',
}

const PAGE_SHIMMER: Record<string, string> = {
  gold_b:     'gold-shimmer-wrap',
  gold_c:     'gold-shimmer-wrap',
  gold_b_inv: 'gold-shimmer-wrap',
  gold_c_inv: 'gold-shimmer-wrap',
  silver_b:     'silver-shimmer-wrap',
  silver_c:     'silver-shimmer-wrap',
  silver_b_inv: 'silver-shimmer-wrap',
  silver_c_inv: 'silver-shimmer-wrap',
  // D non ha shimmer
}

const RADIAL_GOLD   = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)'
const RADIAL_SILVER = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)'
const RADIAL_RGB    = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.16) 0%, transparent 70%)'

const PAGE_RADIAL: Record<string, string> = {
  gold_c:       RADIAL_GOLD,   gold_c_inv:   RADIAL_GOLD,
  gold_d:       RADIAL_GOLD,   gold_d_inv:   RADIAL_GOLD,
  silver_c:     RADIAL_SILVER, silver_c_inv: RADIAL_SILVER,
  silver_d:     RADIAL_SILVER, silver_d_inv: RADIAL_SILVER,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? null

  const settings = readSettings()
  let rolePermissions = settings.rolePermissions

  // Per i clienti: verifica i flag per-utente per nascondere voci di menu
  if (role === 'cliente' && username) {
    try {
      const db = await getConnection()
      const [rows] = await db.query(
        'SELECT cantieri_visibili, miei_ordini_visibili FROM users WHERE username = ? LIMIT 1', [username]
      ) as [Record<string, unknown>[], unknown]
      await db.end()
      const cantieriVisibili = (rows[0]?.cantieri_visibili as number) ?? 1
      const ordiniVisibili   = (rows[0]?.miei_ordini_visibili as number) ?? 1
      let pagesCliente = rolePermissions.cliente ?? []
      if (!cantieriVisibili) pagesCliente = pagesCliente.filter((id: number) => id !== 31)
      if (!ordiniVisibili)   pagesCliente = pagesCliente.filter((id: number) => id !== 30)
      rolePermissions = { ...rolePermissions, cliente: pagesCliente }
    } catch { /* ignora — colonne potrebbero non esistere ancora */ }
  }

  const { pageBgMode, pageBg } = settings
  const isPageEffect    = pageBgMode !== 'rgb'
  const isPageRgbEffect = pageBgMode.startsWith('rgb_')
  const pageShimmer     = ({ ...PAGE_SHIMMER, rgb_b: 'gold-shimmer-wrap', rgb_c: 'gold-shimmer-wrap', rgb_b_inv: 'gold-shimmer-wrap', rgb_c_inv: 'gold-shimmer-wrap' } as Record<string, string>)[pageBgMode] ?? null
  const pageRadial      = ({ ...PAGE_RADIAL, rgb_c: RADIAL_RGB, rgb_c_inv: RADIAL_RGB, rgb_d: RADIAL_RGB, rgb_d_inv: RADIAL_RGB } as Record<string, string>)[pageBgMode] ?? null

  const isBrushed = (m: string) => m === 'rgb_c' || m === 'rgb_c_inv' || m === 'rgb_d' || m === 'rgb_d_inv'
  const isInv     = (m: string) => m.endsWith('_inv')
  const pageRgbStyle: React.CSSProperties = isPageRgbEffect
    ? {
        background: isBrushed(pageBgMode)
          ? (isInv(pageBgMode) ? rgbBrushedBackgroundInv(pageBg.r, pageBg.g, pageBg.b) : rgbBrushedBackground(pageBg.r, pageBg.g, pageBg.b))
          : (isInv(pageBgMode) ? rgbGradientInv(pageBg.r, pageBg.g, pageBg.b) : rgbGradient(pageBg.r, pageBg.g, pageBg.b)),
        boxShadow: rgbBoxShadow(pageBg.r, pageBg.g, pageBg.b),
      }
    : {}

  const inManutenzione = settings.manutenzione && role !== 'admin'

  return (
    <html lang="it">
      <body style={isPageEffect ? {} : { background: `rgba(${pageBg.r}, ${pageBg.g}, ${pageBg.b}, ${pageBg.a / 100})` }}>

        {/* Sfondo pagina con effetto (fixed, sotto tutto) */}
        {isPageEffect && (
          <div
            className={isPageRgbEffect ? '' : (PAGE_EFFECT_CLASS[pageBgMode] ?? '')}
            style={{ position: 'fixed', inset: 0, zIndex: -1, ...pageRgbStyle }}
          >
            {pageShimmer && <div className={pageShimmer} />}
            {pageRadial && (
              <div style={{ position: 'absolute', inset: 0, background: pageRadial, pointerEvents: 'none', zIndex: 0 }} />
            )}
          </div>
        )}

        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
          <Header headerBg={settings.headerBg} headerBgMode={settings.headerBgMode} />
          {settings.bannerAbilitato && (
            <>
              <style>{`
                @keyframes banner-scroll {
                  from { transform: translateX(100vw); }
                  to   { transform: translateX(-100%); }
                }
              `}</style>
              <div
                className="class_silver_D_safe"
                style={{ height: 48, overflow: 'hidden', display: 'flex', alignItems: 'center', borderBottom: '1px solid #aaa' }}
              >
                <span style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#333',
                  animation: `banner-scroll ${Math.max(8, Math.round(settings.bannerTesto.length * 0.08))}s linear infinite`,
                }}>
                  {settings.bannerTesto}
                </span>
              </div>
            </>
          )}
          {!inManutenzione && <Navbar role={role} disabledPages={settings.disabledPages} rolePermissions={rolePermissions} username={username} registrazioniDisabilitate={settings.registrazioniDisabilitate} />}
        </div>

        <main style={{ flex: 1, padding: '32px 24px', paddingTop: inManutenzione
          ? `calc(90px + ${settings.bannerAbilitato ? '48px + ' : ''}32px)`
          : `calc(90px + ${settings.bannerAbilitato ? '48px + ' : ''}42px + 32px)` }}>
          {inManutenzione ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 20, textAlign: 'center' }}>
              <Image src="/images/manutenzione.png" alt="Manutenzione" width={360} height={360} priority style={{ objectFit: 'contain' }} />
              <p style={{ fontSize: 28, fontWeight: 600, color: '#444', maxWidth: 600, lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                Stiamo lavorando per migliorare il sito.<br />
                Torneremo online al più presto. Ci scusiamo per il disagio.
              </p>
            </div>
          ) : children}
        </main>

        <Footer footerBg={settings.footerBg} footerBgMode={settings.footerBgMode} />

        <EmergencyLogin inManutenzione={inManutenzione} />

        {username && !inManutenzione && (
          <InactivityGuard
            inactivityMs={settings.inactivityMinutes * 60 * 1000}
            countdownSec={settings.countdownSeconds}
          />
        )}
      </body>
    </html>
  )
}
