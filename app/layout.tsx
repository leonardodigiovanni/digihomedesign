import { cookies } from 'next/headers'
import Header from '@/components/header'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import InactivityGuard from '@/components/inactivity-guard'
import { readSettings, type BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBoxShadow } from '@/lib/bg-utils'
import './globals.css'

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
          <Header username={username} headerBg={settings.headerBg} headerBgMode={settings.headerBgMode} />
          <Navbar role={role} disabledPages={settings.disabledPages} rolePermissions={settings.rolePermissions} />
        </div>

        <main style={{ flex: 1, padding: '32px 24px', paddingTop: 'calc(90px + 42px + 32px)' }}>
          {children}
        </main>

        <Footer footerBg={settings.footerBg} footerBgMode={settings.footerBgMode} />

        {username && (
          <InactivityGuard
            inactivityMs={settings.inactivityMinutes * 60 * 1000}
            countdownSec={settings.countdownSeconds}
          />
        )}
      </body>
    </html>
  )
}
