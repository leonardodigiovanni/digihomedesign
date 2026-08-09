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

      <div className="header-top-row" style={{ position: 'relative', zIndex: 50, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 80 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, margin: 'auto 0', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 14, width: 'fit-content', height: 'fit-content', zIndex: 10 }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textDecoration: 'none', color: 'inherit', outline: 'none', cursor: 'pointer' }}>
            <Image src="/images/header/DIGIHOMEDESIGN.webp" alt="Home Design" width={80} height={80} style={{ objectFit: 'contain', display: 'block' }} />
          </Link>

          <div className="header-comparti-wrap" style={{ transform: 'translateY(-3px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: 'fit-content', zIndex: 10 }}>
          <div className="header-comparti-row" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-start', gap: 4, marginBottom: 12 }}>
            <div className="header-comparti-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, marginRight: -8 }}>
              <span style={{ whiteSpace: 'nowrap', fontSize: 10, fontWeight: 700, letterSpacing: '0.2px', fontFamily: 'var(--font-ornamental)', color: '#e2e2e2' }}>SERRAMENTI</span>
              <Image unoptimized className="header-comparti-icon" src="/images/icons/icona-serramenti.png" alt="Serramenti" width={316} height={339} style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <div className="header-comparti-col header-comparti-ristrutt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginTop: 5, marginLeft: -39 }}>
              <Image unoptimized className="header-comparti-icon" src="/images/icons/icona-ristrutturazioni-rame.png" alt="Ristrutturazioni" width={421} height={343} style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block', position: 'relative', left: 4 }} />
              <span style={{ whiteSpace: 'nowrap', fontSize: 10, fontWeight: 700, letterSpacing: '0.2px', fontFamily: 'var(--font-ornamental)', color: '#e39464' }}>RISTRUTTURAZIONI</span>
            </div>
            <div className="header-comparti-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0, marginLeft: -47, width: 84 }}>
              <span style={{ whiteSpace: 'nowrap', fontSize: 10, fontWeight: 700, letterSpacing: '0.2px', fontFamily: 'var(--font-ornamental)', color: '#f5d060' }}>SICUREZZA</span>
              <Image unoptimized className="header-comparti-icon" src="/images/icons/icona-sicurezza-gold.png" alt="Sicurezza" width={307} height={357} style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 170, background: '#fff', border: '1px solid #000', boxShadow: '0 0 0 1px #fff', borderRadius: 10, padding: '1px 3px 3px' }}>
            <span style={{ whiteSpace: 'nowrap', lineHeight: 1, color: '#000', fontWeight: 700, fontSize: 15, letterSpacing: '0.3px', fontFamily: 'var(--font-ornamental)' }}><span className="header-digi-word">DIGI </span>Home Design</span>
          </div>
          </div>
        </div>

        <div className="header-auth-slot" style={{ zIndex: 20 }}>
          <HeaderAuth username={username} registrazioniDisabilitate={registrazioniDisabilitate} forceDropdown />
        </div>
      </div>
    </header>
  )
}
