'use client'
import React, { useMemo, useState } from 'react'
import { extractTcTa } from '@/lib/abbr-layout'
import { drawInfisso, innerRect, adaptiveStroke, type DrawSink } from '@/lib/infisso-drawing'

const MOSTRA_PAVIMENTO_SOFFITTO = false

export interface PreviewInfissoProps {
  larghezza_cm:  number
  altezza_cm:    number
  colore:        string
  descrizione:   string
  tipo_prodotto: string
  n_ante:        number
  abbr?:         string
  profilo_mm?:   number
  bar_color?:     string
  bar_color_acc?: string | null
  maxHeight?:     number | string
}

type Apertura = 'anta' | 'ribalta' | 'antaRibalta' | 'vasistas' | 'scorrevole' | 'fisso'

// imgW/imgH: dimensioni reali dell'immagine stanza
// ceilingFrac/floorFrac: frazione dell'altezza immagine dove si trova soffitto/pavimento
//   (misurate sull'immagine intera, non sulla versione croppata precedente)
const COMBINATIONS = [
  { stanza: 'casa-citta',    sfondo: 'sfondo-citta-finestra', imgW: 794, imgH: 746, ceilingFrac: 0.06, floorFrac: 0.86 },
  { stanza: 'casa-citta',    sfondo: 'sfondo-citta-balcone',  imgW: 794, imgH: 746, ceilingFrac: 0.06, floorFrac: 0.86 },
  { stanza: 'casa-citta2',   sfondo: 'sfondo-citta-finestra', imgW: 623, imgH: 434, ceilingFrac: 0.00, floorFrac: 0.84 },
  { stanza: 'ufficio',       sfondo: 'sfondo-citta-finestra', imgW: 800, imgH: 894, ceilingFrac: 0.00, floorFrac: 0.93 },
  { stanza: 'ufficio',       sfondo: 'sfondo-citta-balcone',  imgW: 800, imgH: 894, ceilingFrac: 0.00, floorFrac: 0.93 },
  { stanza: 'casa-campagna', sfondo: 'sfondo-campagna',       imgW: 791, imgH: 617, ceilingFrac: 0.12, floorFrac: 0.84 },
]

function parseApertura(s: string): Apertura {
  const t = s.toLowerCase()
  if (t.includes('scorrevole') || t.includes('coulisse') || t.includes('alzante')) return 'scorrevole'
  if (t.includes('anta ribalta') || t.includes('anta-ribalta'))                    return 'antaRibalta'
  if (t.includes('vasistas'))                                                       return 'vasistas'
  if (t.includes('ribalta'))                                                        return 'ribalta'
  if (t.includes('fisso') || t.includes('fissa'))                                  return 'fisso'
  return 'anta'
}

function isPortaTipo(tipo: string): boolean {
  const t = tipo.toLowerCase()
  return t.startsWith('porta') && !t.includes('finestra')
}

function getColors(colore: string) {
  const c = colore.toLowerCase()
  if (c.includes('antracite') || c.includes('7016') || c.includes('grafite'))
    return { main: '#3e3e3e', hi: '#585858', lo: '#282828', glass: 'rgba(150,175,205,0.22)' }
  if (c.includes('nero') || c.includes('9005'))
    return { main: '#1c1c1c', hi: '#303030', lo: '#101010', glass: 'rgba(150,175,205,0.22)' }
  if (c.includes('grigio') || c.includes('7015') || c.includes('7040'))
    return { main: '#5a5c60', hi: '#74767c', lo: '#424448', glass: 'rgba(150,175,205,0.22)' }
  if (c.includes('noce') || c.includes('rovere') || c.includes('legno') || c.includes('wood'))
    return { main: '#7b4f2e', hi: '#9a6440', lo: '#5a3820', glass: 'rgba(150,175,200,0.20)' }
  if (c.includes('bronzo'))
    return { main: '#8a6424', hi: '#a87c38', lo: '#684c18', glass: 'rgba(150,175,200,0.20)' }
  if (c.includes('oro') || c.includes('champagne'))
    return { main: '#c0a040', hi: '#d8bc58', lo: '#988030', glass: 'rgba(150,175,200,0.20)' }
  if (c.includes('blu'))
    return { main: '#2a4a8c', hi: '#3a5c9c', lo: '#1a3870', glass: 'rgba(150,175,205,0.22)' }
  if (c.includes('verde'))
    return { main: '#2a6a3a', hi: '#3a7a4a', lo: '#1a5028', glass: 'rgba(150,175,200,0.22)' }
  return { main: '#d0ccc4', hi: '#e4e0d8', lo: '#aca8a0', glass: 'rgba(165,190,215,0.28)' }
}

export default function PreviewInfisso({
  larghezza_cm, altezza_cm, colore, descrizione, tipo_prodotto, n_ante,
  abbr, profilo_mm, bar_color, bar_color_acc, maxHeight = 480,
}: PreviewInfissoProps) {

  const isBalcone = useMemo(() => {
    const t = tipo_prodotto.toLowerCase()
    const d = descrizione.toLowerCase()
    return t.includes('balcone') || t.includes('port') || d.includes('balcone') || d.includes('port')
  }, [tipo_prodotto, descrizione])

  const validCombos = useMemo(
    () => COMBINATIONS.filter(c => isBalcone ? !c.sfondo.includes('finestra') : !c.sfondo.includes('balcone')),
    [isBalcone]
  )

  const [comboIdx] = useState(() => Math.floor(Math.random() * 100))
  const combo = validCombos[comboIdx % validCombos.length]

  if (!larghezza_cm || !altezza_cm) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 13 }}>
        Dimensioni non disponibili
      </div>
    )
  }

  const stanzaSrc = `/images/preview/${combo.stanza}.webp`
  const sfondoSrc = `/images/preview/${combo.sfondo}.webp`

  // SVG adattato all'AR reale della stanza (H fisso, W calcolato) → nessun crop
  const H = 550
  const W = Math.round(combo.imgW / combo.imgH * H)

  // Posizione effettiva soffitto e pavimento in px, sull'immagine intera
  const ceilingY = combo.ceilingFrac * H
  const floorY   = combo.floorFrac   * H
  const pxPerCm  = (floorY - ceilingY) / 270

  const liftPx = isBalcone ? 0 : 100 * pxPerCm   // finestre: 100 cm da terra

  let iW = larghezza_cm * pxPerCm
  let iH = altezza_cm   * pxPerCm

  const maxAvailH = floorY - liftPx - ceilingY
  const maxAvailW = W - 80
  if (iH > maxAvailH || iW > maxAvailW) {
    const shrink = Math.min(maxAvailH / iH, maxAvailW / iW)
    iH *= shrink
    iW *= shrink
  }

  const iX = Math.round((W - iW) / 2)
  const iY = Math.round(floorY - liftPx - iH)

  const ft = Math.max(10, Math.round(iW * 0.058))
  const pt = Math.max(7,  Math.round(iW * 0.040))

  // ── Rendering Tc/Ta ──────────────────────────────────────────────────────────
  const abbrTcTa = extractTcTa(abbr ?? '')
  if (abbrTcTa) {
    const isTa = abbrTcTa.isTa
    const profMm = profilo_mm ?? 80
    // Spessore in px dalla scala della stanza (uguale orizzontale e verticale):
    // telaio (Tc/Ta + divisori T/P) = metà del profilo, ante/ribalta/vasistas = profilo intero.
    const mmToPx = (mm: number) => Math.round(Math.max(6, (mm / 10) * pxPerCm))
    const pxTelaio = mmToPx(profMm / 2)
    const pxAnta   = mmToPx(profMm)
    const bc = bar_color ?? '#d8d4cc'
    const hwFill = bar_color_acc ?? bc
    // Contorni: riempimento piatto ovunque (niente chiaroscuro/gradienti) + bordo 1px, colore
    // derivato dal colore infisso (un po' più scuro se chiaro, più chiaro se scuro) per farlo risaltare.
    const FRAME_STROKE = adaptiveStroke(bc)
    // Fermavetro (fissi + interno delle ante/ribalte/vasistas): sempre 20mm, indipendente dal profilo.
    const fvPx = Math.max(2, (20 / 10) * pxPerCm)
    // Porta (isBalcone): soglia sull'altezza propria, base a terra. Finestra: la base dell'anta qui
    // non è il pavimento (sollevata di liftPx), quindi puntiamo alla stessa altezza ~130cm da terra
    // delle porte alte, scontando il sollevamento — non alla base dell'anta.
    const liftCm = isBalcone ? 0 : liftPx / pxPerCm
    const handleFromBottomCm = isBalcone
      ? (altezza_cm >= 200 ? 130 : 35)
      : Math.max(10, 130 - liftCm)

    const clipId = `tc_${Math.round(iX)}_${Math.round(iY)}`
    const { innerX, innerY, innerW, innerH } = innerRect(isTa, iX, iY, iW, iH, pxTelaio)

    const elements: React.ReactElement[] = []
    let elKey = 0
    const sink: DrawSink = {
      rect: (x, y, w, h, opts) => {
        elements.push(<rect key={elKey++} x={x} y={y} width={w} height={h} fill={opts.fill ?? 'none'} stroke={opts.stroke ?? 'none'} strokeWidth={opts.strokeWidth ?? 1} rx={opts.rx} vectorEffect="non-scaling-stroke"/>)
      },
      polygon: (points, opts) => {
        elements.push(<polygon key={elKey++} points={points.map(([x, y]) => `${x},${y}`).join(' ')} fill={opts.fill ?? 'none'} stroke={opts.stroke ?? 'none'}/>)
      },
      line: (x1, y1, x2, y2, opts) => {
        elements.push(<line key={elKey++} x1={x1} y1={y1} x2={x2} y2={y2} stroke={opts?.stroke ?? FRAME_STROKE} strokeWidth={opts?.strokeWidth ?? 1} strokeDasharray={opts?.dash} vectorEffect="non-scaling-stroke"/>)
      },
    }

    drawInfisso(sink, isTa, iX, iY, iW, iH, abbrTcTa.content, larghezza_cm, altezza_cm, {
      fill: bc, hwFill, stroke: FRAME_STROKE, pxTelaio, pxAnta, fvPx, pxPerCm, handleFromBottomCm,
    })

    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ display: 'block', borderRadius: 6, maxHeight }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={innerX} y={innerY} width={innerW} height={innerH}/>
          </clipPath>
        </defs>

        <image href={stanzaSrc} x={0} y={0} width={W} height={H} preserveAspectRatio="none"/>

        <g clipPath={`url(#${clipId})`}>
          <image href={sfondoSrc} x={iX} y={iY} width={iW} height={iH} preserveAspectRatio="xMidYMid slice" opacity={0.94}/>
          {/* velo vetro: tinta piatta uniforme, nessun gradiente/lucido — simula il vetro davanti allo sfondo */}
          <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="rgba(190,215,235,0.14)"/>
          {/* finto riflesso: poligono bianco piatto in diagonale, nessun gradiente */}
          <polygon points={`${innerX},${innerY} ${innerX+innerW*0.42},${innerY} ${innerX},${innerY+innerH*0.28}`} fill="rgba(255,255,255,0.16)"/>
        </g>

        {elements}

        {MOSTRA_PAVIMENTO_SOFFITTO && <>
          <line x1={0} y1={ceilingY} x2={W} y2={ceilingY} stroke="blue" strokeWidth={1.5} strokeDasharray="6 3"/>
          <text x={4} y={ceilingY - 3} fontSize={9} fill="blue" fontFamily="Arial,sans-serif">soffitto</text>
          <line x1={0} y1={floorY} x2={W} y2={floorY} stroke="red" strokeWidth={1.5} strokeDasharray="6 3"/>
          <text x={4} y={floorY + 10} fontSize={9} fill="red" fontFamily="Arial,sans-serif">pavimento</text>
        </>}
      </svg>
    )
  }

  // ── Rendering classico (vecchia logica) ─────────────────────────────────────
  const nA      = Math.max(1, Math.min(6, n_ante || 1))
  const apertura = parseApertura(descrizione + ' ' + tipo_prodotto)
  const isPorta  = isPortaTipo(tipo_prodotto)
  const col      = getColors(colore || '')

  const gX = iX + ft
  const gY = iY + ft
  const gW = iW - 2 * ft
  const gH = iH - 2 * ft

  const panelH = isPorta ? Math.round(gH * 0.38) : 0
  const glassY = gY + panelH
  const glassH = gH - panelH

  const baseW = Math.floor((gW - (nA - 1) * pt) / nA)
  type Pane = { x: number; y: number; w: number; h: number }
  const panes: Pane[] = Array.from({ length: nA }, (_, i) => {
    const x = gX + i * (baseW + pt)
    return { x, y: glassY, w: i === nA - 1 ? (gX + gW) - x : baseW, h: glassH }
  })

  const cid = `gc_${Math.round(iW)}_${Math.round(iH)}_${nA}`

  function indicators(p: Pane, i: number) {
    const lc = 'rgba(45,65,135,0.40)'
    const lw = 1.2
    const cx = p.x + p.w / 2
    const hingeLeft = i % 2 === 0

    if (apertura === 'fisso') return null

    if (apertura === 'scorrevole') {
      const dir = i % 2 === 0 ? 1 : -1
      return (
        <g key={`ind${i}`}>
          <line x1={cx - dir * 22} y1={p.y + p.h / 2} x2={cx + dir * 22} y2={p.y + p.h / 2}
            stroke={lc} strokeWidth={lw}/>
          <polygon
            points={`${cx + dir * 22},${p.y + p.h / 2} ${cx + dir * 12},${p.y + p.h / 2 - 5} ${cx + dir * 12},${p.y + p.h / 2 + 5}`}
            fill={lc}/>
        </g>
      )
    }

    if (apertura === 'vasistas') {
      return (
        <g key={`ind${i}`}>
          <line x1={p.x + 3}       y1={p.y + 3} x2={cx} y2={p.y + p.h - 4} stroke={lc} strokeWidth={lw}/>
          <line x1={p.x + p.w - 3} y1={p.y + 3} x2={cx} y2={p.y + p.h - 4} stroke={lc} strokeWidth={lw}/>
        </g>
      )
    }

    if (apertura === 'ribalta') {
      return (
        <g key={`ind${i}`}>
          <line x1={p.x + 3}       y1={p.y + p.h - 4} x2={cx} y2={p.y + 3} stroke={lc} strokeWidth={lw}/>
          <line x1={p.x + p.w - 3} y1={p.y + p.h - 4} x2={cx} y2={p.y + 3} stroke={lc} strokeWidth={lw}/>
        </g>
      )
    }

    const hingeEdgeCX = hingeLeft ? p.x : p.x + p.w
    const hingeEdgeCY = p.y + p.h / 2
    const freeX       = hingeLeft ? p.x + p.w - 3 : p.x + 3

    if (apertura === 'antaRibalta') {
      return (
        <g key={`ind${i}`}>
          <line x1={freeX} y1={p.y + 3}       x2={hingeEdgeCX} y2={hingeEdgeCY} stroke={lc} strokeWidth={lw}/>
          <line x1={freeX} y1={p.y + p.h - 3} x2={hingeEdgeCX} y2={hingeEdgeCY} stroke={lc} strokeWidth={lw}/>
          <line x1={p.x + 3}       y1={p.y + p.h - 4} x2={cx} y2={p.y + 3} stroke={lc} strokeWidth={lw}/>
          <line x1={p.x + p.w - 3} y1={p.y + p.h - 4} x2={cx} y2={p.y + 3} stroke={lc} strokeWidth={lw}/>
        </g>
      )
    }

    return (
      <g key={`ind${i}`}>
        <line x1={freeX} y1={p.y + 3}       x2={hingeEdgeCX} y2={hingeEdgeCY} stroke={lc} strokeWidth={lw}/>
        <line x1={freeX} y1={p.y + p.h - 3} x2={hingeEdgeCX} y2={hingeEdgeCY} stroke={lc} strokeWidth={lw}/>
      </g>
    )
  }

  function handle(p: Pane, i: number) {
    if (apertura === 'fisso' || apertura === 'scorrevole') return null
    const hingeLeft = i % 2 === 0
    const hx = hingeLeft ? p.x + p.w - 10 : p.x + 6
    const hy = p.y + p.h * 0.44
    const hh = Math.max(14, Math.round(p.h * 0.12))
    return (
      <rect key={`hnd${i}`} x={hx} y={hy} width={4} height={hh} rx={2}
        fill={col.lo} stroke="rgba(0,0,0,0.30)" strokeWidth={0.5}/>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
      style={{ display: 'block', borderRadius: 6, maxHeight }}>
      <defs>
        <clipPath id={cid}>
          {panes.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h}/>)}
        </clipPath>
      </defs>

      <image href={stanzaSrc} x={0} y={0} width={W} height={H} preserveAspectRatio="none"/>

      <g clipPath={`url(#${cid})`}>
        <image href={sfondoSrc} x={iX} y={iY} width={iW} height={iH} preserveAspectRatio="xMidYMid slice"/>
        {panes.map((p, i) => (
          <React.Fragment key={`glass${i}`}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={col.glass}/>
            <polygon
              points={`${p.x + 2},${p.y + 2} ${p.x + p.w * 0.38},${p.y + 2} ${p.x + 2},${p.y + p.h * 0.32}`}
              fill="rgba(255,255,255,0.18)"/>
          </React.Fragment>
        ))}
      </g>

      <rect x={iX + 4} y={iY + 4} width={iW} height={iH} rx={2} fill="rgba(0,0,0,0.22)"/>
      <rect x={iX}           y={iY}           width={iW} height={ft} fill={col.hi}/>
      <rect x={iX}           y={iY + iH - ft} width={iW} height={ft} fill={col.lo}/>
      <rect x={iX}           y={iY}           width={ft}  height={iH} fill={col.hi}/>
      <rect x={iX + iW - ft} y={iY}           width={ft}  height={iH} fill={col.lo}/>
      {isPorta && panelH > 0 && (
        <rect x={gX} y={gY} width={gW} height={panelH} fill={col.main}
          stroke={col.lo} strokeWidth={0.5}/>
      )}
      {Array.from({ length: nA - 1 }, (_, i) => {
        const px = gX + (i + 1) * baseW + i * pt
        return <rect key={i} x={px} y={glassY} width={pt} height={glassH} fill={col.main}/>
      })}
      <rect x={iX}          y={iY}          width={iW} height={1.5} fill="rgba(255,255,255,0.45)"/>
      <rect x={iX}          y={iY}          width={1.5} height={iH} fill="rgba(255,255,255,0.30)"/>
      <rect x={iX + iW - 1} y={iY}          width={1}   height={iH} fill="rgba(0,0,0,0.15)"/>
      <rect x={iX}          y={iY + iH - 1} width={iW}  height={1}  fill="rgba(0,0,0,0.15)"/>

      {panes.map((p, i) => indicators(p, i))}
      {panes.map((p, i) => handle(p, i))}

      {/* linee debug soffitto/pavimento */}
      <line x1={0} y1={ceilingY} x2={W} y2={ceilingY} stroke="blue" strokeWidth={1.5} strokeDasharray="6 3"/>
      <text x={4} y={ceilingY - 3} fontSize={9} fill="blue" fontFamily="Arial,sans-serif">soffitto</text>
      <line x1={0} y1={floorY} x2={W} y2={floorY} stroke="red" strokeWidth={1.5} strokeDasharray="6 3"/>
      <text x={4} y={floorY + 10} fontSize={9} fill="red" fontFamily="Arial,sans-serif">pavimento</text>
    </svg>
  )
}
