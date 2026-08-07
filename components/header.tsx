import Image from 'next/image'
import Link from 'next/link'
import type { Rgba, BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBrushedBackgroundDark, rgbBrushedBackgroundDarkInv, rgbBoxShadow, rgbBorderColor } from '@/lib/bg-utils'
import HeaderAuth from '@/components/header-auth'

interface HeaderProps {
  headerBg?: Rgba
  headerBgMode?: BgMode
  username?: string | null
  registrazioniDisabilitate?: boolean
}

const EFFECT_CLASS: Record<string, string> = {
  gold_a:       'class_gold_A',
  gold_b:       'class_gold_B_safe',
  gold_c:       'class_gold_C_safe',
  gold_d:       'class_gold_D_safe',
  gold_a_inv:   'class_gold_A_inv',
  gold_b_inv:   'class_gold_B_inv_safe',
  gold_c_inv:   'class_gold_C_inv_safe',
  gold_d_inv:   'class_gold_D_inv_safe',
  silver_a:     'class_silver_A',
  silver_b:     'class_silver_B_safe',
  silver_c:     'class_silver_C_safe',
  silver_d:     'class_silver_D_safe',
  silver_a_inv: 'class_silver_A_inv',
  silver_b_inv: 'class_silver_B_inv_safe',
  silver_c_inv: 'class_silver_C_inv_safe',
  silver_d_inv: 'class_silver_D_inv_safe',
}

const SHIMMER_WRAP: Record<string, string> = {
  gold_b: 'gold-shimmer-wrap', gold_c: 'gold-shimmer-wrap',
  gold_b_inv: 'gold-shimmer-wrap', gold_c_inv: 'gold-shimmer-wrap',
  silver_b: 'silver-shimmer-wrap', silver_c: 'silver-shimmer-wrap',
  silver_b_inv: 'silver-shimmer-wrap', silver_c_inv: 'silver-shimmer-wrap',
  rgb_b: 'gold-shimmer-wrap', rgb_c: 'gold-shimmer-wrap',
  rgb_b_inv: 'gold-shimmer-wrap', rgb_c_inv: 'gold-shimmer-wrap',
  // D non ha shimmer
}

const RADIAL_GOLD   = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)'
const RADIAL_SILVER = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)'
const RADIAL_RGB    = 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.16) 0%, transparent 70%)'

const RADIAL_BG: Record<string, string> = {
  gold_c:   RADIAL_GOLD,   gold_c_inv:   RADIAL_GOLD,
  gold_d:   RADIAL_GOLD,   gold_d_inv:   RADIAL_GOLD,
  silver_c: RADIAL_SILVER, silver_c_inv: RADIAL_SILVER,
  silver_d: RADIAL_SILVER, silver_d_inv: RADIAL_SILVER,
  rgb_c:    RADIAL_RGB,    rgb_c_inv:    RADIAL_RGB,
  rgb_d:    RADIAL_RGB,    rgb_d_inv:    RADIAL_RGB,
}

function buildHeaderStyle(mode: BgMode, bg: Rgba): React.CSSProperties {
  if (mode === 'rgb') {
    return { background: `rgba(${bg.r},${bg.g},${bg.b},${bg.a / 100})` }
  }
  if (mode === 'rgb_a' || mode === 'rgb_b') {
    return { background: rgbGradient(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_a_inv' || mode === 'rgb_b_inv') {
    return { background: rgbGradientInv(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_c') {
    return { background: rgbBrushedBackground(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_d') {
    return { background: rgbBrushedBackgroundDark(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_c_inv') {
    return { background: rgbBrushedBackgroundInv(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_d_inv') {
    return { background: rgbBrushedBackgroundDarkInv(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  return {}
}

function buildBorderColor(mode: BgMode, bg: Rgba): string {
  if (mode.startsWith('gold')) return '#c8960c'
  if (mode.startsWith('silver')) return '#aaa'
  if (mode.startsWith('rgb_')) return rgbBorderColor(bg.r, bg.g, bg.b)
  return '#e0e0e0'
}

export default function Header({
  headerBg = { r: 255, g: 255, b: 255, a: 100 },
  headerBgMode = 'rgb',
  username,
  registrazioniDisabilitate,
}: HeaderProps) {
  const isFixedEffect = headerBgMode in EFFECT_CLASS
  const isRgbEffect   = headerBgMode.startsWith('rgb_')
  const shimmerClass  = SHIMMER_WRAP[headerBgMode] ?? null
  const radialBg      = RADIAL_BG[headerBgMode] ?? null
  const borderColor   = buildBorderColor(headerBgMode, headerBg)
  const dynamicStyle  = buildHeaderStyle(headerBgMode, headerBg)

  return (
    <header
      className={isFixedEffect ? EFFECT_CLASS[headerBgMode] : ''}
      style={{
        ...dynamicStyle,
        background: '#000',
        borderBottom: `1px solid ${borderColor}`,
        padding: '6px 8px 0',
        overflow: 'visible',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        ...(isRgbEffect ? { position: 'relative' } : {}),
      }}
    >
      {radialBg && (
        <div style={{ position: 'absolute', inset: 0, background: radialBg, pointerEvents: 'none', zIndex: 0 }} />
      )}
      {shimmerClass && <div className={shimmerClass} />}

      <div className="header-top-row" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textDecoration: 'none', color: 'inherit', outline: 'none', cursor: 'pointer' }}>
            <Image src="/images/header/DIGIHOMEDESIGN.webp" alt="Home Design" width={80} height={80} style={{ objectFit: 'contain', display: 'block' }} />
          </Link>

          <div className="header-formula-center" style={{ display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 0.95, letterSpacing: '0.3px', fontSize: 15, fontWeight: 400, color: '#999', textAlign: 'left', fontFamily: 'var(--font-ornamental)', transform: 'translateY(-4px)' }}>
            <div><span style={{ color: '#e2e2e2', textTransform: 'uppercase' }}>Sicurezza</span> <span style={{ color: '#fff', fontWeight: 700 }}>+</span></div>
            <div><span style={{ color: '#f5d060', textTransform: 'uppercase' }}>Serramenti</span> <span style={{ color: '#fff', fontWeight: 700 }}>+</span></div>
            <div><span style={{ color: '#e39464', textTransform: 'uppercase' }}>Ristrutturazioni</span> <span style={{ color: '#fff', fontWeight: 700 }}>=</span></div>
            <div style={{ borderTop: '1px solid #fff', margin: '1px 0' }} />
            <div style={{ color: '#fff', textTransform: 'uppercase' }}>DIGI Home Design</div>
          </div>
        </div>

        <div style={{ zIndex: 20 }}>
          <HeaderAuth username={username} registrazioniDisabilitate={registrazioniDisabilitate} forceDropdown />
        </div>
      </div>
    </header>
  )
}
