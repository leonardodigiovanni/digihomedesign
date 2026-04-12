import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Header from '@/components/header'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import InactivityGuard from '@/components/inactivity-guard'
import { readSettings, type BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBoxShadow } from '@/lib/bg-utils'
import { getConnection } from '@/lib/db'
import Image from 'next/image'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DIGI Home Design',
    template: '%s | DIGI Home Design',
  },
  description: 'DIGI Home Design S.R.L. — Progettazione e ristrutturazione di interni',
}

const PAGE_EFFECT_CLASS: Record<string, string> = {
  gold_a:       'class_gold_A',
  gold_b:       'class_gold_B_safe',
  gold_c:       'class_gold_C_safe',
  gold_a_inv:   'class_gold_A_inv',
  gold_b_inv:   'class_gold_B_inv_safe',
  gold_c_inv:   'class_gold_C_inv_safe',
  silver_a:     'class_silver_A',
  silver_b:     'class_silver_B_safe',
  silver_c:     'class_silver_C_safe',
  silver_a_inv: 'class_silver_A_inv',
  silver_b_inv: 'class_silver_B_inv_safe',
  silver_c_inv: 'class_silver_C_inv_safe',
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
}

const PAGE_RADIAL: Record<string, string> = {
  gold_c:       'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)',
  gold_c_inv:   'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)',
  silver_c:     'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
  silver_c_inv: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
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
  const pageRadial      = ({ ...PAGE_RADIAL, rgb_c: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)', rgb_c_inv: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)' } as Record<string, string>)[pageBgMode] ?? null

  const pageRgbStyle: React.CSSProperties = isPageRgbEffect
    ? {
        background: pageBgMode === 'rgb_c'     ? rgbBrushedBackground(pageBg.r, pageBg.g, pageBg.b)
          : pageBgMode === 'rgb_c_inv'          ? rgbBrushedBackgroundInv(pageBg.r, pageBg.g, pageBg.b)
          : pageBgMode === 'rgb_a_inv' || pageBgMode === 'rgb_b_inv' ? rgbGradientInv(pageBg.r, pageBg.g, pageBg.b)
          : rgbGradient(pageBg.r, pageBg.g, pageBg.b),
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
          <Header username={username} headerBg={settings.headerBg} headerBgMode={settings.headerBgMode} registrazioniDisabilitate={settings.registrazioniDisabilitate} />
          {!inManutenzione && <Navbar role={role} disabledPages={settings.disabledPages} rolePermissions={rolePermissions} />}
        </div>

        <main style={{ flex: 1, padding: '32px 24px', paddingTop: inManutenzione ? 'calc(90px + 32px)' : 'calc(90px + 42px + 32px)' }}>
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
