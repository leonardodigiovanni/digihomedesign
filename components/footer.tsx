import type { Rgba, BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbBoxShadow, rgbBorderColor, rgbTextColors } from '@/lib/bg-utils'

interface FooterProps {
  footerBg?: Rgba
  footerBgMode?: BgMode
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

type TC = { label: string; value: string; title: string; sep: string }

const STATIC_TEXT: Record<string, TC> = {
  gold_a:   { label: '#fff', value: '#ddd', title: '#fff', sep: 'rgba(255,255,255,0.2)' },
  gold_b:   { label: '#fff', value: '#ddd', title: '#fff', sep: 'rgba(255,255,255,0.2)' },
  gold_c:   { label: '#fff', value: '#ddd', title: '#fff', sep: 'rgba(255,255,255,0.2)' },
  silver_a: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  silver_b: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  silver_c: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  gold_a_inv:   { label: '#4a2800', value: '#5a3800', title: '#4a2800', sep: 'rgba(0,0,0,0.15)' },
  gold_b_inv:   { label: '#4a2800', value: '#5a3800', title: '#4a2800', sep: 'rgba(0,0,0,0.15)' },
  gold_c_inv:   { label: '#4a2800', value: '#5a3800', title: '#4a2800', sep: 'rgba(0,0,0,0.15)' },
  silver_a_inv: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  silver_b_inv: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  silver_c_inv: { label: '#222', value: '#444', title: '#111', sep: 'rgba(0,0,0,0.15)' },
  rgb:      { label: '#fff', value: '#ccc', title: '#fff', sep: 'rgba(255,255,255,0.2)' },
}

function getTextColors(mode: BgMode, bg: Rgba): TC {
  if (mode.startsWith('rgb_')) return rgbTextColors(bg.r, bg.g, bg.b)
  return STATIC_TEXT[mode] ?? STATIC_TEXT.rgb
}

function getFooterBgStyle(mode: BgMode, bg: Rgba): React.CSSProperties {
  if (mode === 'rgb') return { background: `rgba(${bg.r},${bg.g},${bg.b},${bg.a / 100})` }
  if (mode === 'rgb_a' || mode === 'rgb_b')         return { background: rgbGradient(bg.r, bg.g, bg.b),            boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  if (mode === 'rgb_a_inv' || mode === 'rgb_b_inv') return { background: rgbGradientInv(bg.r, bg.g, bg.b),         boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  if (mode === 'rgb_c')                             return { background: rgbBrushedBackground(bg.r, bg.g, bg.b),   boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  if (mode === 'rgb_c_inv')                         return { background: rgbBrushedBackgroundInv(bg.r, bg.g, bg.b), boxShadow: rgbBoxShadow(bg.r, bg.g, bg.b) }
  return {}
}

function getBorderColor(mode: BgMode, bg: Rgba): string {
  if (mode.startsWith('gold'))   return '#c8960c'
  if (mode.startsWith('silver')) return '#aaa'
  if (mode.startsWith('rgb_'))   return rgbBorderColor(bg.r, bg.g, bg.b)
  return '#e0e0e0'
}

function IconWhatsApp() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.523 3.656 1.432 5.168L2 22l4.98-1.404A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.953 7.953 0 0 1-4.078-1.117l-.292-.174-3.057.862.822-3.001-.19-.308A7.953 7.953 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Zm4.362-5.996c-.238-.119-1.407-.694-1.625-.773-.218-.079-.376-.119-.535.119-.158.238-.614.773-.752.931-.139.158-.277.178-.515.059-.238-.119-1.005-.371-1.914-1.181-.707-.631-1.185-1.411-1.323-1.649-.139-.238-.015-.366.104-.485.107-.107.238-.277.357-.416.119-.139.158-.238.238-.396.079-.158.04-.297-.02-.416-.059-.119-.535-1.29-.733-1.766-.193-.464-.389-.401-.535-.409l-.456-.008c-.158 0-.416.059-.634.297-.218.238-.832.813-.832 1.983s.852 2.3.97 2.459c.119.158 1.677 2.561 4.063 3.591.568.245 1.011.391 1.357.5.57.181 1.089.156 1.499.095.457-.068 1.407-.575 1.606-1.131.198-.556.198-1.033.139-1.131-.059-.099-.218-.158-.456-.277Z"/>
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.085-1.856-.601-3.698-1.942-5.039C20.646.673 18.804.157 16.948.072 15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/>
    </svg>
  )
}

const socials = [
  { label: 'WhatsApp',  href: '#', icon: <IconWhatsApp /> },
  { label: 'Telegram',  href: '#', icon: <IconTelegram /> },
  { label: 'Instagram', href: '#', icon: <IconInstagram /> },
  { label: 'Facebook',  href: '#', icon: <IconFacebook /> },
  { label: 'LinkedIn',  href: '#', icon: <IconLinkedIn /> },
]

const infoRows = [
  { label: 'Azienda',      value: 'DIGI Home Design SRL' },
  { label: 'Sede legale',  value: 'Via Esempio 1, 00100 Roma (RM)' },
  { label: 'P.IVA',        value: '12345678901' },
  { label: 'Email',        value: 'info@digihomedesign.it' },
  { label: 'PEC',          value: 'digihomedesign@pec.it' },
  { label: 'Telefono',     value: '+39 06 1234567' },
]

export default function Footer({
  footerBg = { r: 255, g: 255, b: 255, a: 100 },
  footerBgMode = 'rgb',
}: FooterProps) {
  const isFixedEffect = footerBgMode in EFFECT_CLASS
  const isRgbEffect   = footerBgMode.startsWith('rgb_')
  const shimmerClass  = SHIMMER_WRAP[footerBgMode] ?? null
  const radialBg      = RADIAL_BG[footerBgMode] ?? null
  const borderColor   = getBorderColor(footerBgMode, footerBg)
  const tc            = getTextColors(footerBgMode, footerBg)
  const dynamicStyle  = getFooterBgStyle(footerBgMode, footerBg)

  return (
    <>
    <footer
      className={isFixedEffect ? EFFECT_CLASS[footerBgMode] : ''}
      style={{
        ...dynamicStyle,
        ...(isFixedEffect || isRgbEffect ? {} : { background: `rgba(${footerBg.r},${footerBg.g},${footerBg.b},${footerBg.a / 100})` }),
        borderTop: `1px solid ${borderColor}`,
        padding: '28px 24px 16px',
        ...(isRgbEffect ? { position: 'relative' } : {}),
      }}
    >
      {shimmerClass && <div className={shimmerClass} />}
      {radialBg && (
        <div style={{ position: 'absolute', inset: 0, background: radialBg, pointerEvents: 'none', zIndex: 0 }} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Sezione a due colonne */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px', marginBottom: 24 }}>

          {/* Colonna sinistra: dati aziendali */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {infoRows.map(({ label, value }) => (
              <div key={label} style={{ fontSize: 13, color: tc.value, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: tc.label }}>{label}:</span> {value}
              </div>
            ))}
          </div>

          {/* Colonna destra: icone social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: tc.title }}>Seguici</span>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', background: '#fff', borderRadius: 10, padding: '8px 14px' }}>
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="footer-social-icon"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separatore */}
        <div style={{ borderTop: `1px solid ${tc.sep}`, marginBottom: 0 }} />
      </div>
    </footer>

    {/* Ultima riga nera */}
    <div style={{
      background: '#000',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', margin: 0 }}>
        © 2026
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/dgt.png" alt="logo" style={{ height: 46, width: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
      <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', margin: 0 }}>
        DIGI Home Design SRL — tutti i diritti riservati
      </p>
    </div>
    </>
  )
}

