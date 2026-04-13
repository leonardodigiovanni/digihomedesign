import Image from 'next/image'
import Link from 'next/link'
import type { Rgba, BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBoxShadow, rgbBorderColor } from '@/lib/bg-utils'

interface HeaderProps {
  headerBg?: Rgba
  headerBgMode?: BgMode
  username?: string | null
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
  if (mode === 'rgb_c' || mode === 'rgb_d') {
    return { background: rgbBrushedBackground(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_c_inv' || mode === 'rgb_d_inv') {
    return { background: rgbBrushedBackgroundInv(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
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
        borderBottom: `1px solid ${borderColor}`,
        padding: '0 32px 0 16px',
        height: 90,
        position: 'relative',
        ...(isRgbEffect ? { position: 'relative' } : {}),
      }}
    >
      {radialBg && (
        <div style={{ position: 'absolute', inset: 0, background: radialBg, pointerEvents: 'none', zIndex: 0 }} />
      )}
      {shimmerClass && <div className={shimmerClass} />}

      <div style={{ display: 'flex', alignItems: 'center', height: '100%', position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'inherit', height: '100%', outline: 'none', cursor: 'pointer' }}>
          <Image src="/images/digi_tr.png" alt="Home Design" width={95} height={95} sizes="95px" style={{ objectFit: 'contain', display: 'block', alignSelf: 'center', flexShrink: 0 }} />
          <Image src="/images/nome_tr.png" alt="Home Design" width={143} height={48} sizes="143px" loading="eager" style={{ objectFit: 'contain', display: 'block', alignSelf: 'center', position: 'relative', top: 12, flexShrink: 0 }} />
        </Link>
      </div>
      {username && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          fontSize: 12, fontWeight: 500, color: '#fff',
          whiteSpace: 'nowrap', zIndex: 2,
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}>
          {username}
        </span>
      )}
    </header>
  )
}
