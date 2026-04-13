'use client'

import React, { useRef, useState, useEffect } from 'react'
import type { Rgba, BgMode } from '@/lib/settings'
import {
  rgbGradient, rgbGradientInv,
  rgbBrushedBackground, rgbBrushedBackgroundInv,
  rgbBoxShadow,
} from '@/lib/bg-utils'

// ─── Dimensioni A4 a 96 DPI ──────────────────────────────────────────────────
const A4_W = 794
const A4_H = 1123

const H_HEADER = Math.round(10  / 29.7 * A4_H)
const H_SUB    = Math.round(3   / 29.7 * A4_H)
const H_PAGE   = Math.round(8   / 29.7 * A4_H)
const H_FOOTER = Math.round(6.3 / 29.7 * A4_H)
const H_ZONE5  = A4_H - H_HEADER - H_SUB - H_PAGE - H_FOOTER

const PREVIEW_W = 480
const SCALE     = PREVIEW_W / A4_W

// ─── Classi CSS per effetti gold/silver (stesse dell'header/footer del sito) ─

const EFFECT_CLASS: Record<string, string> = {
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

// ─── Effetto bordeaux spazzolato per zona 2 volantino ─────────────────────────

function hex2v(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

function rgbVolantinoBackground(r: number, g: number, b: number): string {
  const dark  = `#${hex2v(r * 0.35)}${hex2v(g * 0.35)}${hex2v(b * 0.35)}`
  const mid   = `#${hex2v(r * 0.65)}${hex2v(g * 0.65)}${hex2v(b * 0.65)}`
  const base  = `#${hex2v(r)}${hex2v(g)}${hex2v(b)}`
  const light = `#${hex2v(r + (255 - r) * 0.22)}${hex2v(g + (255 - g) * 0.22)}${hex2v(b + (255 - b) * 0.22)}`
  const gradient = `linear-gradient(135deg, ${dark} 0%, ${mid} 18%, ${base} 35%, ${light} 45%, ${light} 55%, ${base} 65%, ${mid} 82%, ${dark} 100%)`
  const brushed  = 'repeating-linear-gradient(60deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 6px)'
  return [brushed, gradient].join(', ')
}

// ─── Helper sfondo ────────────────────────────────────────────────────────────

function buildBg(mode: BgMode, bg: Rgba): React.CSSProperties {
  const { r, g, b, a } = bg
  if (mode === 'rgb')                               return { background: `rgba(${r},${g},${b},${a / 100})` }
  if (mode === 'rgb_a' || mode === 'rgb_b')         return { background: rgbGradient(r, g, b),             boxShadow: rgbBoxShadow(r, g, b) }
  if (mode === 'rgb_a_inv' || mode === 'rgb_b_inv') return { background: rgbGradientInv(r, g, b),          boxShadow: rgbBoxShadow(r, g, b) }
  if (mode === 'rgb_c')                             return { background: rgbBrushedBackground(r, g, b),    boxShadow: rgbBoxShadow(r, g, b) }
  if (mode === 'rgb_c_inv')                         return { background: rgbBrushedBackgroundInv(r, g, b), boxShadow: rgbBoxShadow(r, g, b) }
  // gold/silver: nessuno stile inline, gestito dalla className
  return {}
}

// ─── Sezione volantino (applica classe CSS o stile inline) ────────────────────

function Section({ mode, bg, height, zIndex, children }: { mode: BgMode; bg: Rgba; height: number; zIndex?: number; children?: React.ReactNode }) {
  const cls   = EFFECT_CLASS[mode] ?? ''
  const style = buildBg(mode, bg)
  return (
    <div
      className={cls}
      style={{ width: '100%', height, position: 'relative', zIndex, ...style }}
    >
      {children}
    </div>
  )
}

// ─── Contenuto corpo volantino ────────────────────────────────────────────────

const COL1 = [
  'PROGETTO - ADEMPIMENTI',
  'DEMOLIZIONI - OPERE MURARIE',
  'TRAMEZZATURE - INTONACI',
  'MASSETTI - TRACCE',
  'ISOLAMENTI TERMICI',
  'ISOLAMENTI ACUSTICI',
  'PAVIMENTI - PIASTRELLE',
  'SANITARI - BOX DOCCIA',
  'TETTI - IMPERMEABILIZZAZIONI',
  'TINTEGGIATURA - ANTIMUFFA',
  'SMALTIMENTO CALCINACCI',
  'IMPIANTI IDRAULICI',
  'IRRIGAZIONE - ALLACCI',
  'IMPIANTI ELETTRICI',
]

const COL2 = [
  'ILLUMINAZIONE',
  'PORTE CORAZZATE RIV.LEGNO',
  'PORTE CORAZZATE RIV.ALLUMINIO',
  'ARMADI BLINDATI - CASSEFORTI',
  'INFISSI ALLUMINIO-PVC-LEGNO',
  'PORTE INTERNE - A SCOMPARSA',
  'PERSIANE - SCURETTI',
  'VENEZIANE - IMBOTTI',
  'AVVOLGIBILI (MOTORIZZATI)',
  'VETRATE - LUCERNAI',
  'CANCELLI - RECINZIONI',
  'BALCONI - STRUTTURE METALLICHE',
  'SARACINESCHE (MOTORIZZATE)',
  'PITTURAZIONI - INDORATURA',
]

const COL3 = [
  'VERANDE - TETTOIE',
  'ZANZARIERE',
  'CLIMATIZZAZIONE',
  'CALDAIE - POMPE DI CALORE',
  'PANNELLI SOLARI',
  'DOMOTICA - VIDEOSORVEGLIANZA',
  'CUCINE - ELETTRODOMESTICI',
  'MOBILI - DIVANI - QUADRI',
  'COMPLEMENTI - DECORAZIONI',
  'MONTAGGIO - RIPARAZIONI',
  'MANUTENZIONE PERIODICA',
  'TENDAGGI - DECORAZIONI',
  'PISCINE - SOLARIUM',
  'PULIZIA FINALE/PERIODICA',
]

function ColonnaServizi({ items }: { items: string[] }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      padding: '2px 8px',
    }}>
      {items.map(item => (
        <div key={item} style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.03em',
          color: '#1a1a1a',
          lineHeight: 1.3,
          textAlign: 'center',
        }}>
          {item}
        </div>
      ))}
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function VolantinoClient({
  headerBg, headerBgMode,
  pageBg,   pageBgMode,
  footerBg, footerBgMode,
}: {
  headerBg: Rgba; headerBgMode: BgMode
  pageBg:   Rgba; pageBgMode:   BgMode
  footerBg: Rgba; footerBgMode: BgMode
}) {
  const volRef       = useRef<HTMLDivElement>(null)
  const wrapRef      = useRef<HTMLDivElement>(null)
  const [sharing, setSharing]               = useState(false)
  const [shareUnsupported, setShareUnsupported] = useState(false)
  const [containerW, setContainerW]         = useState(PREVIEW_W)
  const [isMobile, setIsMobile]             = useState(false)

  // Rileva mobile (schermo stretto) per lo scaling adattivo
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ResizeObserver: aggiorna la scala solo su mobile
  useEffect(() => {
    if (!isMobile) return
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setContainerW(entries[0].contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [isMobile])

  async function handleExport() {
    if (!volRef.current) return
    await document.fonts.ready
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(volRef.current, {
      scale: 300 / 96,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })
    const url = canvas.toDataURL('image/jpeg', 0.95)
    const a   = document.createElement('a')
    a.href     = url
    a.download = 'volantino_A4.jpg'
    a.click()
  }

  async function handleExportPDF() {
    if (!volRef.current) return
    await document.fonts.ready
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF }   = await import('jspdf')
    const canvas = await html2canvas(volRef.current, {
      scale: 300 / 96,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)
    pdf.save('volantino_A4.pdf')
  }

  async function handleShareWhatsApp() {
    if (!volRef.current) return
    setShareUnsupported(false)

    if (!navigator.share) {
      setShareUnsupported(true)
      return
    }

    setSharing(true)
    try {
      await document.fonts.ready
      const html2canvas = (await import('html2canvas')).default
      // Scala ridotta per la condivisione: 2× è più che sufficiente per WhatsApp
      const canvas = await html2canvas(volRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.92)
      )
      const file = new File([blob], 'volantino_A4.jpg', { type: 'image/jpeg' })
      await navigator.share({ files: [file], title: 'Volantino DIGI Home Design' })
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setShareUnsupported(true)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
      {/* Bottone export */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            className="btn-green"
            style={{ padding: '8px 0', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, borderRadius: 6, width: 150 }}
          >
            Esporta JPG A4
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-green"
            style={{ padding: '8px 0', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, borderRadius: 6, width: 150 }}
          >
            Esporta PDF A4
          </button>
          <button
            onClick={handleShareWhatsApp}
            disabled={sharing}
            className={sharing ? 'btn-gray' : 'btn-green'}
            style={{ padding: '8px 0', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, borderRadius: 6, width: 150, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {sharing ? 'Generazione...' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="18" cy="5"  r="3" fill="currentColor" stroke="none"/>
                  <circle cx="18" cy="19" r="3" fill="currentColor" stroke="none"/>
                  <circle cx="6"  cy="12" r="3" fill="currentColor" stroke="none"/>
                  <line x1="6" y1="12" x2="18" y2="5"/>
                  <line x1="6" y1="12" x2="18" y2="19"/>
                </svg>
                Condividi
              </>
            )}
          </button>
          <span style={{ fontSize: 13, color: '#888' }}>
            2480 × 3508 px — 300 DPI
          </span>
        </div>
        {shareUnsupported && (
          <div style={{ fontSize: 13, color: '#b05000', background: '#fff8f0', border: '1px solid #f5cfa0', borderRadius: 6, padding: '7px 12px', maxWidth: 420 }}>
            La condivisione diretta non è supportata su questo browser. Apri questa pagina dal cellulare oppure esporta il file e condividilo manualmente.
          </div>
        )}
      </div>

      {/* Contenitore preview scalato — si adatta alla larghezza disponibile */}
      <div
        ref={wrapRef}
        style={{
          // Mobile: si adatta alla larghezza disponibile
          // Desktop: larghezza fissa, la pagina scrolla orizzontalmente se necessario
          width:      isMobile ? '100%' : PREVIEW_W,
          maxWidth:   isMobile ? PREVIEW_W : undefined,
          height:     Math.round(A4_H * (isMobile ? containerW / A4_W : SCALE)),
          position:   'relative',
          overflow:   'hidden',
          boxShadow:  '0 4px 24px rgba(0,0,0,0.18)',
          flexShrink: 0,
        }}
      >
        <div
          ref={volRef}
          style={{
            width:           A4_W,
            height:          A4_H,
            position:        'absolute',
            fontFamily:      '"Times New Roman", Times, serif',
            top:             0,
            left:            0,
            transform:       `scale(${isMobile ? containerW / A4_W : SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          {/* 1 — Header nero */}
          <div style={{ width: '100%', height: H_HEADER, position: 'relative', overflow: 'hidden' }}>
            {/* Immagine di sfondo chiave */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/chiave.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Logo + nome sovrapposti */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: Math.round(H_HEADER * 0.04), gap: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/dg-t.png" alt="logo" style={{ height: Math.round(H_HEADER * 0.15), width: 'auto' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/nome_tr.png" alt="Home Design" style={{ height: Math.round(H_HEADER * 0.11), width: 'auto' }} />
            </div>
          </div>

          {/* 2 — Sottoheader = bordeaux spazzolato (rgb-volantino) */}
          <div style={{ width: '100%', height: H_SUB, position: 'relative', background: rgbVolantinoBackground(90, 0, 25) }}>
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              boxSizing: 'border-box',
            }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                }}>
                  COSTRUZIONI E RISTRUTTURAZIONI COMPLETE
                </div>
                <div style={{
                  fontSize: 38,
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.35)',
                  lineHeight: 1,
                }}>
                  CHIAVI IN MANO
                </div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                  textShadow: '1px 1px 5px rgba(0,0,0,0.5)',
                }}>
                  Un solo referente che può occuparsi di tutto al posto tuo...
                </div>
              </div>
            </div>
          </div>

          {/* 3 — Corpo = colore pagina sito */}
          <Section mode={pageBgMode} bg={pageBg} height={H_PAGE}>
            <div style={{ display: 'flex', height: '100%', gap: 0 }}>
              <ColonnaServizi items={COL1} />
              <div style={{ width: 1, background: 'rgba(0,0,0,0.15)', margin: '10px 0' }} />
              <ColonnaServizi items={COL2} />
              <div style={{ width: 1, background: 'rgba(0,0,0,0.15)', margin: '10px 0' }} />
              <ColonnaServizi items={COL3} />
            </div>
          </Section>

          {/* 4 — Footer = colore footer sito */}
          <Section mode={footerBgMode} bg={footerBg} height={H_FOOTER} zIndex={1}>
            {/* Testo in cima */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 900,
              color: '#000',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.25,
              textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
            }}>
              Servizi Gratuiti Pensati Per Te<br />
              Disponibili su Sito e App
            </div>
            {/* Linea divisoria verticale */}
            <div style={{
              position: 'absolute',
              top: 80,
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 2,
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 1,
            }} />
            {/* Testo sinistra */}
            <div style={{
              position: 'absolute',
              top: 70,
              left: '28%',
              right: '51%',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#000',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}>
              Calcola il tuo preventivo in autonomia per l&apos;acquisto di serramenti. Basta scegliere modello, colore, misure
            </div>
            {/* Immagine sinistra */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mano-t.png" alt="Mano" style={{
              position: 'absolute',
              left: 0,
              bottom: -4,
              height: Math.round(H_FOOTER * 1.05),
              width: 'auto',
            }} />
            {/* Testo destra */}
            <div style={{
              position: 'absolute',
              top: 70,
              left: '51%',
              right: '26%',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#000',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}>
              Segui i lavori nel tuo cantiere da remoto. Accedendo alla tua area personale troverai video e foto aggiornati dai nostri addetti in tempo reale
            </div>
            {/* Immagine destra */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/app.png" alt="App" style={{
              position: 'absolute',
              right: 12,
              top: 12,
              height: H_FOOTER - 24,
              width: 'auto',
            }} />
          </Section>

          {/* 5 — Zona nera */}
          <div style={{
            width: '100%', height: H_ZONE5, background: '#000',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 4, padding: '8px 20px', boxSizing: 'border-box',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase' }}>
              Approfitta della scontistica per il lancio del marchio
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Contattaci subito
            </div>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['www.digihomedesign.com', '(+39) 3518716731', 'info@digi-home-design.com'].map(c => (
                <span key={c} style={{ fontSize: 17, fontWeight: 500, color: '#FFFFFF', letterSpacing: '0.03em' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info proporzioni */}
      <div style={{ fontSize: 12, color: '#aaa', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span>1 — Header:      {H_HEADER}px  (10 cm)</span>
        <span>2 — Sottoheader: {H_SUB}px     (3 cm)</span>
        <span>3 — Pagina:      {H_PAGE}px    (10 cm)</span>
        <span>4 — Footer:      {H_FOOTER}px  (3.7 cm)</span>
        <span>5 — Zona nera:   {H_ZONE5}px   (spazio liberato)</span>
      </div>
    </div>
  )
}
