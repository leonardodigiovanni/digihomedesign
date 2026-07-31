'use client'
import React, { useMemo, useState } from 'react'
import { tcTaProfileRatio } from '@/lib/disegno-infisso'

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
  const abbrUp = (abbr ?? '').trim().toUpperCase()
  if (abbrUp.startsWith('TC(') || abbrUp.startsWith('TA(')) {
    const isTa = abbrUp.startsWith('TA(')
    const Pmm  = (profilo_mm ?? 80) * (2 / 3)

    // Spessore profilo in px dalla scala della stanza (uguale orizzontale e verticale)
    const profilePx = Math.round(Math.max(6, (Pmm / 10) * pxPerCm))
    const pxW = profilePx
    const pxH = profilePx
    const bc = bar_color ?? '#d8d4cc'

    // Poligoni in coord SVG (identici al PDF, scalati a iW×iH)
    const top    = `${iX},${iY} ${iX+iW},${iY} ${iX+iW-pxW},${iY+pxH} ${iX+pxW},${iY+pxH}`
    const right  = isTa
      ? `${iX+iW},${iY} ${iX+iW},${iY+iH} ${iX+iW-pxW},${iY+iH} ${iX+iW-pxW},${iY+pxH}`
      : `${iX+iW},${iY} ${iX+iW},${iY+iH} ${iX+iW-pxW},${iY+iH-pxH} ${iX+iW-pxW},${iY+pxH}`
    const left   = isTa
      ? `${iX},${iY} ${iX+pxW},${iY+pxH} ${iX+pxW},${iY+iH} ${iX},${iY+iH}`
      : `${iX},${iY} ${iX+pxW},${iY+pxH} ${iX+pxW},${iY+iH-pxH} ${iX},${iY+iH}`
    const bottom = `${iX},${iY+iH} ${iX+iW},${iY+iH} ${iX+iW-pxW},${iY+iH-pxH} ${iX+pxW},${iY+iH-pxH}`

    // Apertura interna per mostrare lo sfondo
    const innerX = iX + pxW
    const innerY = iY + pxH
    const innerW = iW - 2 * pxW
    const innerH = isTa ? iH - pxH : iH - 2 * pxH
    const clipId = `tc_${Math.round(iX)}_${Math.round(iY)}`

    // Divisori interni T/P e fissi F()
    const tcContent = (abbr ?? '').trim().match(/^T[CA]\((.*)\)$/i)?.[1] ?? ''
    const dividers: React.ReactElement[] = []
    const sn = (v: number) => Math.round(v) + 0.5
    const fvPx = Math.max(2, pxW / 2)
    let fvKey = 0
    const darken = (hex: string, f = 0.72): string => {
      const h = hex.replace(/^#/, '')
      const full = h.length === 3 ? h.split('').map(c => c+c).join('') : h
      const m = full.match(/.{2}/g)
      if (!m || m.length < 3) return hex
      return '#' + m.slice(0, 3).map(ch => Math.max(0, Math.round(parseInt(ch, 16) * f)).toString(16).padStart(2, '0')).join('')
    }
    const mixWhite = (hex: string, amt: number): string => {
      const h = hex.replace(/^#/, ''), full = h.length === 3 ? h.split('').map(c=>c+c).join('') : h
      const m = full.match(/.{2}/g)
      if (!m || m.length < 3) return hex
      return '#' + m.slice(0,3).map(ch => { const v = parseInt(ch,16); return Math.min(255, Math.round(v + (255-v)*amt)).toString(16).padStart(2,'0') }).join('')
    }
    const sc    = darken(bc)
    const scHw  = darken(bc, 0.62)
    const bcHi  = mixWhite(bc, 0.55)
    const bcMid = mixWhite(bc, 0.24)
    const bcLo  = darken(bc, 0.80)
    const bcDrk = darken(bc, 0.58)
    const gTop  = `g-top-${clipId}`, gBot = `g-bot-${clipId}`
    const gLft  = `g-lft-${clipId}`, gRgt = `g-rgt-${clipId}`
    const gHw   = `g-hw-${clipId}`
    const bca    = bar_color_acc ?? null
    const scHwA  = bca ? darken(bca, 0.62)   : scHw
    const bcHiA  = bca ? mixWhite(bca, 0.55) : bcHi
    const bcLoA  = bca ? darken(bca, 0.80)   : bcLo
    const bcMidA = bca ? mixWhite(bca, 0.24) : bcMid
    const gHwa   = `g-hwa-${clipId}`

    const pushFermavetri = (ax: number, ay: number, aw: number, ah: number) => {
      const k = fvKey++
      const fvS = { stroke: sc, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' } as const
      dividers.push(<rect key={`fv-t${k}`} x={ax}           y={ay}         width={aw}   height={fvPx}         fill={bc} {...fvS}/>)
      dividers.push(<rect key={`fv-b${k}`} x={ax}           y={ay+ah-fvPx} width={aw}   height={fvPx}         fill={bc} {...fvS}/>)
      dividers.push(<rect key={`fv-l${k}`} x={ax}           y={ay+fvPx}    width={fvPx} height={ah-2*fvPx}    fill={bc} {...fvS}/>)
      dividers.push(<rect key={`fv-r${k}`} x={ax+aw-fvPx}   y={ay+fvPx}    width={fvPx} height={ah-2*fvPx}    fill={bc} {...fvS}/>)
    }

    const diagPx = (x1: number, y1: number, x2: number, y2: number, key: string) => {
      dividers.push(<line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
    }

    let antaKey = 0
    const drawAnta = (
      ax: number, ay: number, aw: number, ah: number,
      hingeLeft: boolean, handleLeft: boolean, handleRight: boolean,
      kind: 'anta' | 'ribalta' | 'vasistas', innerFisso: boolean, innerContent = ''
    ) => {
      const k = antaKey++
      const p = pxW
      const aS = { stroke: sc, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' } as const
      dividers.push(<polygon key={`a-top${k}`} points={`${ax},${ay} ${ax+aw},${ay} ${ax+aw-p},${ay+p} ${ax+p},${ay+p}`}             fill={`url(#${gTop})`} {...aS}/>)
      dividers.push(<polygon key={`a-bot${k}`} points={`${ax},${ay+ah} ${ax+aw},${ay+ah} ${ax+aw-p},${ay+ah-p} ${ax+p},${ay+ah-p}`} fill={`url(#${gTop})`} {...aS}/>)
      dividers.push(<polygon key={`a-lft${k}`} points={`${ax},${ay} ${ax+p},${ay+p} ${ax+p},${ay+ah-p} ${ax},${ay+ah}`}             fill={`url(#${gLft})`} {...aS}/>)
      dividers.push(<polygon key={`a-rgt${k}`} points={`${ax+aw},${ay} ${ax+aw-p},${ay+p} ${ax+aw-p},${ay+ah-p} ${ax+aw},${ay+ah}`} fill={`url(#${gLft})`} {...aS}/>)
      dividers.push(<line key={`a-sp-t${k}`} x1={ax} y1={ay} x2={ax+aw} y2={ay} stroke="rgba(255,255,255,0.55)" strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
      dividers.push(<line key={`a-sp-l${k}`} x1={ax} y1={ay} x2={ax} y2={ay+ah} stroke="rgba(255,255,255,0.28)" strokeWidth={0.8} vectorEffect="non-scaling-stroke"/>)
      diagPx(ax,    ay,    ax+p,    ay+p,    `a-d1-${k}`)
      diagPx(ax+aw, ay,    ax+aw-p, ay+p,    `a-d2-${k}`)
      diagPx(ax,    ay+ah, ax+p,    ay+ah-p, `a-d3-${k}`)
      diagPx(ax+aw, ay+ah, ax+aw-p, ay+ah-p, `a-d4-${k}`)
      if (kind === 'vasistas') {
        // cerniere orizzontali in basso
        const hvW = Math.max(5, 20 * pxPerCm)
        const hvH = Math.max(1.5, 2.5 * pxPerCm)
        const hy  = ay + ah - hvH
        const hx1 = ax + p
        const hx2 = ax + aw - p - hvW
        dividers.push(<rect key={`a-vh1${k}`}  x={hx1} y={hy} width={hvW} height={hvH} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-vhs1${k}`} x1={hx1} y1={hy} x2={hx1+hvW} y2={hy} stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-vhv1${k}`} x1={hx1+hvW/2} y1={hy} x2={hx1+hvW/2} y2={hy+hvH} stroke={scHwA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<rect key={`a-vh2${k}`}  x={hx2} y={hy} width={hvW} height={hvH} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-vhs2${k}`} x1={hx2} y1={hy} x2={hx2+hvW} y2={hy} stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-vhv2${k}`} x1={hx2+hvW/2} y1={hy} x2={hx2+hvW/2} y2={hy+hvH} stroke={scHwA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        // chiusura in alto al centro
        const clW = Math.max(4, 6 * pxPerCm)
        const clH = Math.max(2, p * 0.55)
        const clX = ax + aw / 2 - clW / 2
        const clY = ay
        const clRx = Math.max(0.5, clW * 0.2)
        dividers.push(<rect key={`a-vcl${k}`}  x={clX} y={clY} width={clW} height={clH} rx={clRx} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-vcls${k}`} x1={clX} y1={clY} x2={clX+clW} y2={clY} stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        const pvW = Math.max(1, clW * 0.18)
        const pvH = Math.max(2, p * 0.55)
        const pvX = clX + clW / 2 - pvW / 2
        dividers.push(<rect key={`a-vpv${k}`} x={pvX} y={clY+clH} width={pvW} height={pvH} rx={Math.max(0.3, pvW*0.25)} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
      } else {
        // cerniere laterali 20×200mm
        const hW = Math.max(1.5, 2.5 * pxPerCm)
        const hH = Math.max(5, 20 * pxPerCm)
        const hx = hingeLeft ? ax : ax+aw-hW
        dividers.push(<rect key={`a-h1${k}`}  x={hx} y={ay+p}       width={hW} height={hH} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-hsp1${k}`} x1={hx} y1={ay+p}    x2={hx+hW} y2={ay+p}   stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-hm1${k}`}  x1={sn(hx)} y1={sn(ay+p+hH/2)} x2={sn(hx+hW)} y2={sn(ay+p+hH/2)} stroke={scHwA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<rect key={`a-h2${k}`}  x={hx} y={ay+ah-p-hH} width={hW} height={hH} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-hsp2${k}`} x1={hx} y1={ay+ah-p-hH} x2={hx+hW} y2={ay+ah-p-hH} stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        dividers.push(<line key={`a-hm2${k}`}  x1={sn(hx)} y1={sn(ay+ah-p-hH/2)} x2={sn(hx+hW)} y2={sn(ay+ah-p-hH/2)} stroke={scHwA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        if (handleLeft || handleRight) {
          const mW = Math.max(2, 3.0 * pxPerCm)
          const mH = Math.max(5, 20 * pxPerCm)
          const fromBottomCm = altezza_cm >= 200 ? 135 : 35
          const mx = handleLeft ? ax + (p - mW) / 2 : ax+aw-p + (p - mW) / 2
          const my = (ay+ah-p) - fromBottomCm*pxPerCm - mH/2
          const rx = Math.max(1, mW * 0.3)
          dividers.push(<rect key={`a-m${k}`}   x={mx} y={my} width={mW} height={mH} rx={rx} fill={`url(#${gHwa})`} stroke={scHwA} strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>)
          dividers.push(<line key={`a-msp${k}`} x1={mx} y1={my} x2={mx+mW} y2={my} stroke={bcHiA} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
        }
      }
      const iX0 = ax+p, iY0 = ay+p, iW0 = aw-2*p, iH0 = ah-2*p
      if (innerContent) {
        const si = (s: string): string[] => {
          const r: string[] = []; let d = 0, c = ''
          for (const ch of s) {
            if (ch === '(') d++; else if (ch === ')') d--
            if ((ch === '-' || ch === '+') && d === 0) { r.push(c); c = '' } else c += ch
          }
          return c.length > 0 ? [...r, c] : r
        }
        const iParts = si(innerContent)
        const hasTi = iParts.some(t => t.trim().toUpperCase() === 'T')
        if (hasTi) {
          type IT = { ki: 'a'; cm: number|null } | { ki: 'T' }
          const iToks: IT[] = iParts.map(t => {
            const u = t.trim().toUpperCase()
            if (u === 'T') return { ki: 'T' as const }
            const nm = u.match(/^(\d+(?:\.\d+)?)\(/)
            return { ki: 'a' as const, cm: nm ? parseFloat(nm[1]) : null }
          })
          const iAreas = iToks.filter((t): t is { ki: 'a'; cm: number|null } => t.ki === 'a')
          const nT = iToks.filter(t => t.ki === 'T').length
          const fixedH = iAreas.reduce((s, a) => s + (a.cm != null ? a.cm * pxPerCm : 0), 0)
          const nVar = iAreas.filter(a => a.cm == null).length
          const vH = nVar > 0 ? (iH0 - nT * p - fixedH) / nVar : 0
          const lastA = [...iToks].reverse().find(t => t.ki === 'a') as { ki: 'a'; cm: number|null }|undefined
          let iCur = iY0
          let tiKey = 0
          for (const it of iToks) {
            if (it.ki === 'a') {
              const isLast = it === lastA
              const aH = isLast ? (iY0 + iH0) - iCur : Math.round(it.cm != null ? it.cm * pxPerCm : vH)
              pushFermavetri(iX0, iCur, iW0, aH)
              iCur += aH
            } else {
              dividers.push(<rect key={`a-ti-${k}-${tiKey++}`} x={iX0} y={iCur} width={iW0} height={p} fill={bc} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
              iCur += p
            }
          }
        } else {
          pushFermavetri(iX0, iY0, iW0, iH0)
        }
      } else {
        pushFermavetri(iX0, iY0, iW0, iH0)
      }
    }

    if (tcContent.trim()) {
      // Split su '-' o '+' rispettando parentesi bilanciate
      const splitTP = (s: string): string[] => {
        const r: string[] = []; let d = 0, c = ''
        for (const ch of s) {
          if (ch === '(') d++; else if (ch === ')') d--
          if ((ch === '-' || ch === '+') && d === 0) { r.push(c); c = '' } else c += ch
        }
        return c.length > 0 ? [...r, c] : r
      }
      const tryAnta = (u: string) => {
        if (/^V\(.*\)$/i.test(u)) return { antaKind: 'vasistas' as const, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false, innerContent: '' }
        const m = u.match(/^([CM]?)([AR])([CM]?)\((.*)\)$/)
        if (!m) return null
        return { antaKind: (m[2] === 'R' ? 'ribalta' : 'anta') as 'anta'|'ribalta'|'vasistas',
          hingeLeft: m[1] === 'C', handleLeft: m[1] === 'M', handleRight: m[3] === 'M',
          innerFisso: m[4] === 'F()' || m[4].includes('(F())'), innerContent: m[4] }
      }
      type AreaTok = { type: 'area'; cm: number|null; fisso: boolean; antaKind: 'anta'|'ribalta'|'vasistas'|null; hingeLeft: boolean; handleLeft: boolean; handleRight: boolean; innerFisso: boolean; innerContent?: string }
      type DivTok  = { type: 'div'; kind: 'T'|'P' }
      const tokens: (AreaTok|DivTok)[] = []
      for (const t of splitTP(tcContent)) {
        const u = t.trim().toUpperCase()
        if (u === 'T') { tokens.push({ type: 'div', kind: 'T' }); continue }
        if (u === 'P') { tokens.push({ type: 'div', kind: 'P' }); continue }
        const ai = tryAnta(u)
        if (ai) { tokens.push({ type: 'area', cm: null, fisso: false, ...ai }); continue }
        // NUMBER(INNER): 85(F()), 160(cAm()-Ac()), 120() ecc.
        const nm = u.match(/^(\d+(?:\.\d+)?)\((.*)\)$/)
        if (nm) {
          const totalCm = parseFloat(nm[1]), inner = nm[2]
          const ip = splitTP(inner).filter(p => p.trim().length > 0)
          const ais = ip.map(p => tryAnta(p.trim().toUpperCase()))
          if (ip.length > 0 && ais.every(a => a != null)) {
            const perCm = totalCm / ip.length
            ais.forEach(a => tokens.push({ type: 'area', cm: perCm, fisso: false, ...a! }))
            continue
          }
          if (inner.trim() === 'F()') {
            tokens.push({ type: 'area', cm: totalCm, fisso: true, antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false }); continue
          }
          tokens.push({ type: 'area', cm: totalCm, fisso: false, antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false }); continue
        }
        // X(anta(...)): area variabile che wrappa un anta — va controllata PRIMA di includes(F())
        const xAntaM = u.match(/^[A-Z]\((.+)\)$/)
        if (xAntaM) { const ia = tryAnta(xAntaM[1].trim()); if (ia) { tokens.push({ type: 'area', cm: null, fisso: false, ...ia }); continue } }
        // F() o X(F()): fisso variabile
        if (u === 'F()' || u.includes('(F())')) {
          tokens.push({ type: 'area', cm: null, fisso: true, antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false }); continue
        }
        // X() o altra area variabile
        tokens.push({ type: 'area', cm: null, fisso: false, antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false })
      }
      const areaTokens = tokens.filter((t): t is AreaTok => t.type === 'area')
      const hasDiv = tokens.some(t => t.type === 'div')

      if (!hasDiv && areaTokens.some(a => a.fisso || a.antaKind != null)) {
        const nArea = areaTokens.length
        const fixedSum = areaTokens.reduce((s, a) => a.cm != null ? s + (a.cm / larghezza_cm) * innerW : s, 0)
        const nVar = areaTokens.filter(a => a.cm == null).length
        const varW = nVar > 0 ? (innerW - fixedSum) / nVar : 0
        const fallback = varW <= 0
        const equalW = innerW / Math.max(1, nArea)
        let cur = innerX, firstNd = true
        for (let i = 0; i < areaTokens.length; i++) {
          const tok = areaTokens[i]
          const isLast = i === areaTokens.length - 1
          const aW = isLast ? (innerX + innerW) - cur : Math.round(fallback ? equalW : (tok.cm != null ? (tok.cm / larghezza_cm) * innerW : varW))
          if (tok.fisso) pushFermavetri(cur, innerY, aW, innerH)
          else if (tok.antaKind) drawAnta(cur, innerY, aW, innerH, tok.hingeLeft, tok.handleLeft, tok.handleRight, tok.antaKind, tok.innerFisso, tok.innerContent)
          cur += aW
          firstNd = false
        }
      }

      if (tokens.some(t => t.type === 'div' && t.kind === 'T')) {
        const nDiv = tokens.filter(t => t.type === 'div' && t.kind === 'T').length
        const nArea = areaTokens.length
        const fixedSum = areaTokens.reduce((s, a) => a.cm != null ? s + (a.cm / altezza_cm) * innerH : s, 0)
        const nVar = areaTokens.filter(a => a.cm == null).length
        const varH = nVar > 0 ? (innerH - nDiv * pxH - fixedSum) / nVar : 0
        const fallback = varH <= 0
        const equalH = (innerH - nDiv * pxH) / Math.max(1, nArea)
        const lastAreaTokT = [...tokens].slice().reverse().find(t => t.type === 'area')
        let cursor = innerY, prevWasAreaT = false
        for (const tok of tokens) {
          if (tok.type === 'area') {
            const isLast = tok === lastAreaTokT
            const areaH = isLast ? (innerY + innerH) - cursor : Math.round(fallback ? equalH : (tok.cm != null ? (tok.cm / altezza_cm) * innerH : varH))
            if (tok.fisso) pushFermavetri(innerX, cursor, innerW, areaH)
            else if (tok.antaKind) drawAnta(innerX, cursor, innerW, areaH, tok.hingeLeft, tok.handleLeft, tok.handleRight, tok.antaKind, tok.innerFisso, tok.innerContent)
            cursor += areaH
            prevWasAreaT = true
          } else if (tok.type === 'div' && tok.kind === 'T') {
            prevWasAreaT = false
            dividers.push(<rect key={`T${cursor}`} x={innerX} y={cursor} width={innerW} height={pxH} fill={bc} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
            cursor += pxH
          }
        }
      }

      if (tokens.some(t => t.type === 'div' && t.kind === 'P')) {
        const nDiv = tokens.filter(t => t.type === 'div' && t.kind === 'P').length
        const nArea = areaTokens.length
        const fixedSum = areaTokens.reduce((s, a) => a.cm != null ? s + (a.cm / larghezza_cm) * innerW : s, 0)
        const nVar = areaTokens.filter(a => a.cm == null).length
        const varW = nVar > 0 ? (innerW - nDiv * pxW - fixedSum) / nVar : 0
        const fallback = varW <= 0
        const equalW = (innerW - nDiv * pxW) / Math.max(1, nArea)
        const lastAreaTokP = [...tokens].slice().reverse().find(t => t.type === 'area')
        let cursor = innerX, prevWasAreaP = false
        for (const tok of tokens) {
          if (tok.type === 'area') {
            const isLast = tok === lastAreaTokP
            const areaW = isLast ? (innerX + innerW) - cursor : Math.round(fallback ? equalW : (tok.cm != null ? (tok.cm / larghezza_cm) * innerW : varW))
            if (tok.fisso) pushFermavetri(cursor, innerY, areaW, innerH)
            else if (tok.antaKind) drawAnta(cursor, innerY, areaW, innerH, tok.hingeLeft, tok.handleLeft, tok.handleRight, tok.antaKind, tok.innerFisso, tok.innerContent)
            cursor += areaW
            prevWasAreaP = true
          } else if (tok.type === 'div' && tok.kind === 'P') {
            prevWasAreaP = false
            dividers.push(<rect key={`P${cursor}`} x={cursor} y={innerY} width={pxW} height={innerH} fill={bc} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>)
            cursor += pxW
          }
        }
      }
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ display: 'block', borderRadius: 6, maxHeight }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={innerX} y={innerY} width={innerW} height={innerH}/>
          </clipPath>
          <linearGradient id={gTop} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={bcHi}/>
            <stop offset="45%"  stopColor={bc}/>
            <stop offset="100%" stopColor={bcLo}/>
          </linearGradient>
          <linearGradient id={gTop} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={bcDrk}/>
            <stop offset="55%"  stopColor={bc}/>
            <stop offset="100%" stopColor={bcMid}/>
          </linearGradient>
          <linearGradient id={gLft} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={bcHi}/>
            <stop offset="50%"  stopColor={bc}/>
            <stop offset="100%" stopColor={bcLo}/>
          </linearGradient>
          <linearGradient id={gHw} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={bcLo}/>
            <stop offset="32%"  stopColor={bcHi}/>
            <stop offset="65%"  stopColor={bcMid}/>
            <stop offset="100%" stopColor={bcLo}/>
          </linearGradient>
          <linearGradient id={gHwa} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={bcLoA}/>
            <stop offset="32%"  stopColor={bcHiA}/>
            <stop offset="65%"  stopColor={bcMidA}/>
            <stop offset="100%" stopColor={bcLoA}/>
          </linearGradient>
        </defs>

        <image href={stanzaSrc} x={0} y={0} width={W} height={H} preserveAspectRatio="none"/>

        <g clipPath={`url(#${clipId})`}>
          <image href={sfondoSrc} x={iX} y={iY} width={iW} height={iH} preserveAspectRatio="xMidYMid slice"/>
          <rect x={innerX} y={innerY} width={innerW} height={innerH} fill="rgba(170,200,230,0.06)"/>
          <polygon points={`${innerX},${innerY} ${innerX+innerW*0.42},${innerY} ${innerX},${innerY+innerH*0.28}`} fill="rgba(255,255,255,0.10)"/>
        </g>

        <polygon points={top}    fill={`url(#${gTop})`} stroke="none"/>
        <polygon points={right}  fill={`url(#${gLft})`} stroke="none"/>
        <polygon points={left}   fill={`url(#${gLft})`} stroke="none"/>
        {!isTa && <polygon points={bottom} fill={`url(#${gTop})`} stroke="none"/>}
        {/* luci speculari bordi esterni */}
        <line x1={iX} y1={iY} x2={iX+iW} y2={iY} stroke="rgba(255,255,255,0.65)" strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>
        <line x1={iX} y1={iY} x2={iX} y2={iY+iH} stroke="rgba(255,255,255,0.30)" strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        {/* bordo esterno */}
        {!isTa
          ? <rect x={iX} y={iY} width={iW} height={iH} fill="none" stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
          : <path d={`M ${iX},${iY+iH} L ${iX},${iY} L ${iX+iW},${iY} L ${iX+iW},${iY+iH}`} fill="none" stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        }
        {/* bordi interni + diagonali 45° giunti */}
        <line x1={innerX} y1={innerY} x2={innerX+innerW} y2={innerY} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        {!isTa && <line x1={innerX} y1={innerY+innerH} x2={innerX+innerW} y2={innerY+innerH} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>}
        <line x1={innerX}       y1={innerY} x2={innerX}       y2={innerY+innerH} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        <line x1={innerX+innerW} y1={innerY} x2={innerX+innerW} y2={innerY+innerH} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        <line x1={iX}    y1={iY}    x2={iX+pxW}    y2={iY+pxH}    stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        <line x1={iX+iW} y1={iY}    x2={iX+iW-pxW} y2={iY+pxH}    stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>
        {!isTa && <line x1={iX}    y1={iY+iH} x2={iX+pxW}    y2={iY+iH-pxH} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>}
        {!isTa && <line x1={iX+iW} y1={iY+iH} x2={iX+iW-pxW} y2={iY+iH-pxH} stroke={sc} strokeWidth={1} vectorEffect="non-scaling-stroke"/>}
        <g clipPath={`url(#${clipId})`}>
          {/* ombra interna */}
          <rect x={innerX} y={innerY} width={innerW} height={4} fill="rgba(0,0,0,0.22)"/>
          <rect x={innerX} y={innerY} width={4} height={innerH} fill="rgba(0,0,0,0.15)"/>
          {dividers}
        </g>

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
