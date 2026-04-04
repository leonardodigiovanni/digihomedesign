import Image from 'next/image'
import HeaderAuth from '@/components/header-auth'
import type { Rgba, BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackgroundInv, rgbBoxShadow, rgbBorderColor } from '@/lib/bg-utils'

interface HeaderProps {
  username?: string | null
  headerBg?: Rgba
  headerBgMode?: BgMode
}

const EFFECT_CLASS: Record<string, string> = {
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

const SHIMMER_WRAP: Record<string, string> = {
  gold_b: 'gold-shimmer-wrap', gold_c: 'gold-shimmer-wrap',
  gold_b_inv: 'gold-shimmer-wrap', gold_c_inv: 'gold-shimmer-wrap',
  silver_b: 'silver-shimmer-wrap', silver_c: 'silver-shimmer-wrap',
  silver_b_inv: 'silver-shimmer-wrap', silver_c_inv: 'silver-shimmer-wrap',
  rgb_b: 'gold-shimmer-wrap', rgb_c: 'gold-shimmer-wrap',
  rgb_b_inv: 'gold-shimmer-wrap', rgb_c_inv: 'gold-shimmer-wrap',
}

const RADIAL_BG: Record<string, string> = {
  gold_c:       'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)',
  gold_c_inv:   'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,250,200,0.35) 0%, transparent 70%)',
  silver_c:     'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
  silver_c_inv: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
  rgb_c:        'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)',
  rgb_c_inv:    'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)',
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
    const brushed = [
      'repeating-linear-gradient(60deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
      rgbGradient(bg.r, bg.g, bg.b),
    ].join(', ')
    return { background: brushed, boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  }
  if (mode === 'rgb_c_inv') {
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
  username,
  headerBg = { r: 255, g: 255, b: 255, a: 100 },
  headerBgMode = 'rgb',
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
      {shimmerClass && <div className={shimmerClass} />}
      {radialBg && (
        <div style={{ position: 'absolute', inset: 0, background: radialBg, pointerEvents: 'none', zIndex: 0 }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'inherit', height: '100%' }}>
          <Image src="/images/digi_tr.png" alt="Home Design" width={95} height={95} unoptimized style={{ objectFit: 'contain', display: 'block', margin: 'auto 0' }} />
          <Image src="/images/nome_tr.png" alt="Home Design" width={180} height={60} unoptimized style={{ objectFit: 'contain', display: 'block', alignSelf: 'flex-end', marginBottom: 10 }} />
        </a>
        <HeaderAuth username={username} />
      </div>
    </header>
  )
}
