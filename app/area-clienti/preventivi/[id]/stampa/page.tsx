import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import StampaClient from './stampa-client'

export const metadata: Metadata = { title: 'Stampa Preventivo' }

// ─── SVG serramento ───────────────────────────────────────────────────────────

function computeSVGDims(larghezza: number, altezza: number): { W: number; H: number } {
  const MAX_W = 154, MAX_H = 150
  if (larghezza > 0 && altezza > 0) {
    const ratio = larghezza / altezza
    if (ratio >= MAX_W / MAX_H) {
      return { W: MAX_W, H: Math.max(Math.round(MAX_W / ratio), 40) }
    } else {
      return { W: Math.max(Math.round(MAX_H * ratio), 50), H: MAX_H }
    }
  }
  return { W: MAX_W, H: MAX_H }
}

function disegnoSVG(larghezza: number, altezza: number, nAnte: number, profiloMm = 70): string {
  const { W, H } = computeSVGDims(larghezza, altezza)
  const PROFILE_CM = profiloMm / 10  // mm → cm; default 70mm = 7cm se scheda non compilata
  const ante = Math.max(1, Math.min(4, nAnte || 1))

  const widthCm = larghezza > 0 ? larghezza : 100
  const heightCm = altezza > 0 ? altezza : 150

  const padTop = 4
  const padRight = 4
  const leftMeasureMargin = 20
  const bottomMeasureMargin = 16
  const outerX = leftMeasureMargin
  const outerY = padTop
  const outerW = W - leftMeasureMargin - padRight
  const outerH = H - padTop - bottomMeasureMargin

  const pxPerCmX = outerW / widthCm
  const pxPerCmY = outerH / heightCm
  const frameT_X = Math.max(4.5, PROFILE_CM * pxPerCmX)
  const frameT_Y = Math.max(4.5, PROFILE_CM * pxPerCmY)

  // Luce netta interna dopo il telaio: L - 7 - 7, H - 7 - 7
  const innerX = outerX + frameT_X
  const innerY = outerY + frameT_Y
  const innerW = Math.max(18, outerW - frameT_X * 2)
  const innerH = Math.max(24, outerH - frameT_Y * 2)

  // Ante: divisone in larghezza della luce netta interna.
  const sashW = innerW / ante
  const sashH = innerH

  const parts: string[] = []
  const profColor = '#ffffff'
  const lineColor = '#000'
  const glassFill = '#cfeeff'

  const j = 6

  for (let i = 0; i < ante; i++) {
    const sx = innerX + i * sashW

    // Profilo anta (7cm): vetro = anta - 7 - 7 in entrambe le direzioni.
    const sashT_X = Math.min(Math.max(3, PROFILE_CM * pxPerCmX), sashW * 0.38)
    const sashT_Y = Math.min(Math.max(3, PROFILE_CM * pxPerCmY), sashH * 0.38)
    const glassX = sx + sashT_X
    const glassY = innerY + sashT_Y
    const glassW = Math.max(2, sashW - sashT_X * 2)
    const glassH = Math.max(2, sashH - sashT_Y * 2)
    const sashX2 = sx + sashW
    const sashY2 = innerY + sashH

    // Anta bianca.
    parts.push(`<rect x="${sx.toFixed(1)}" y="${innerY.toFixed(1)}" width="${sashW.toFixed(1)}" height="${sashH.toFixed(1)}" fill="${profColor}" stroke="${lineColor}" stroke-width="1"/>`)

    // Giunzioni 45°: vetro -> anta (sempre).
    parts.push(`<line x1="${glassX.toFixed(1)}" y1="${glassY.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${(glassX + glassW).toFixed(1)}" y1="${glassY.toFixed(1)}" x2="${sashX2.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${glassX.toFixed(1)}" y1="${(glassY + glassH).toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sashY2.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${(glassX + glassW).toFixed(1)}" y1="${(glassY + glassH).toFixed(1)}" x2="${sashX2.toFixed(1)}" y2="${sashY2.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)

    // Giunzioni 45°: anta -> telaio solo sugli spigoli esterni reali
    // (evita linee oblique extra nelle ante centrali).
    if (i === 0) {
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${innerY.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${outerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${sashY2.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${(outerY + outerH).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    }
    if (i === ante - 1) {
      parts.push(`<line x1="${sashX2.toFixed(1)}" y1="${innerY.toFixed(1)}" x2="${(outerX + outerW).toFixed(1)}" y2="${outerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<line x1="${sashX2.toFixed(1)}" y1="${sashY2.toFixed(1)}" x2="${(outerX + outerW).toFixed(1)}" y2="${(outerY + outerH).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    }

    // Vetro celestino.
    parts.push(`<rect x="${glassX.toFixed(1)}" y="${glassY.toFixed(1)}" width="${glassW.toFixed(1)}" height="${glassH.toFixed(1)}" fill="${glassFill}" stroke="${lineColor}" stroke-width="1"/>`)

    // Cerniere accoppiate telaio+anta sui lati esterni.
    if (i === 0 || i === ante - 1) {
      const isLeft = i === 0
      const seamX = isLeft ? sx : sx + sashW
      const hingePartW = Math.max(1.8, 5 * pxPerCmX)
      const hingePartH = Math.max(2.2, 5 * pxPerCmY)
      const hx = seamX - hingePartW / 2
      const hy1 = innerY + sashH * 0.27 - hingePartH
      const hy2 = innerY + sashH * 0.73 - hingePartH
      // Cerniera alta: 2 rettangolini sovrapposti verticalmente
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy1.toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy1 + hingePartH).toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      // Cerniera bassa: 2 rettangolini sovrapposti verticalmente
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy2.toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy2 + hingePartH).toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
    }
  }

  // Maniglia:
  // - 1 anta: laterale destra
  // - 2+ ante: sul montante centrale di una sola anta (qui sulla seconda anta).
  const handleLeafIndex = ante === 1 ? 0 : 1
  const hsx = innerX + handleLeafIndex * sashW
  const hOnLeftStile = ante > 1
  const handleW = Math.max(1.4, 3 * pxPerCmX)
  const handleH = Math.max(4, 12 * pxPerCmY)
  const handlePad = 0.6
  const handleSashTX = Math.min(Math.max(3, PROFILE_CM * pxPerCmX), sashW * 0.38)
  const handleWClamped = Math.min(handleW, Math.max(1.2, handleSashTX - handlePad * 2))
  const handleHClamped = Math.min(handleH, Math.max(6, sashH - 4))
  const leftStileMinX = hsx + handlePad
  const leftStileMaxX = hsx + handleSashTX - handleWClamped - handlePad
  const rightStileMinX = hsx + sashW - handleSashTX + handlePad
  const rightStileMaxX = hsx + sashW - handleWClamped - handlePad
  const handleX = hOnLeftStile
    ? Math.max(leftStileMinX, Math.min(hsx + 1.2, leftStileMaxX))
    : Math.max(rightStileMinX, Math.min(hsx + sashW - handleWClamped - 1.2, rightStileMaxX))
  const handleY = innerY + (sashH - handleHClamped) / 2
  parts.push(`<rect x="${handleX.toFixed(1)}" y="${handleY.toFixed(1)}" width="${handleWClamped.toFixed(1)}" height="${handleHClamped.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;">
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="${profColor}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX + frameT_X).toFixed(1)}" y1="${(outerY + frameT_Y).toFixed(1)}" x2="${(outerX + outerW - frameT_X).toFixed(1)}" y2="${(outerY + frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX + frameT_X).toFixed(1)}" y1="${(outerY + outerH - frameT_Y).toFixed(1)}" x2="${(outerX + outerW - frameT_X).toFixed(1)}" y2="${(outerY + outerH - frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX + frameT_X).toFixed(1)}" y1="${(outerY + frameT_Y).toFixed(1)}" x2="${(outerX + frameT_X).toFixed(1)}" y2="${(outerY + outerH - frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX + outerW - frameT_X).toFixed(1)}" y1="${(outerY + frameT_Y).toFixed(1)}" x2="${(outerX + outerW - frameT_X).toFixed(1)}" y2="${(outerY + outerH - frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  ${parts.join('\n  ')}
  ${larghezza > 0 ? `<text x="${(outerX + outerW / 2).toFixed(1)}" y="${(outerY + outerH + 12).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lineColor}" font-family="Arial,sans-serif">${larghezza} cm</text>` : ''}
  ${altezza > 0 ? `<text x="${(outerX - 10).toFixed(1)}" y="${(outerY + outerH / 2).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lineColor}" font-family="Arial,sans-serif" transform="rotate(-90,${(outerX - 10).toFixed(1)},${(outerY + outerH / 2).toFixed(1)})">${altezza} cm</text>` : ''}
</svg>`
  const svgDataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkup)}`
  return `<img src="${svgDataUri}" width="${W}" height="${H}" alt="Serramento" style="display:block;margin:0 auto;" />`
}

function disegnoSVGAbbr(abbr: string, larghezza: number, altezza: number, profiloMm = 70): string {
  const chars = abbr.toUpperCase().replace(/[^SFAVRP]/g, '').split('')
  if (chars.length === 0) return disegnoSVG(larghezza, altezza, 1, profiloMm)
  const hasSopraluce = chars[0] === 'S'
  const panelChars   = hasSopraluce ? chars.slice(1) : chars
  if (panelChars.length === 0) return disegnoSVG(larghezza, altezza, 1, profiloMm)

  const { W, H } = computeSVGDims(larghezza, altezza)
  const PROFILE_CM = profiloMm / 10
  const widthCm  = larghezza > 0 ? larghezza : 100
  const heightCm = altezza   > 0 ? altezza   : 150

  const padTop = 4, padRight = 4, lmm = 20, bmm = 16
  const outerX = lmm, outerY = padTop
  const outerW = W - lmm - padRight
  const outerH = H - padTop - bmm
  const pxPerCmX = outerW / widthCm, pxPerCmY = outerH / heightCm
  const frameT_X = Math.max(4.5, PROFILE_CM * pxPerCmX)
  const frameT_Y = Math.max(4.5, PROFILE_CM * pxPerCmY)
  const innerX = outerX + frameT_X, innerY = outerY + frameT_Y
  const innerW = Math.max(18, outerW - frameT_X * 2)
  const innerH = Math.max(24, outerH - frameT_Y * 2)

  const profColor = '#ffffff', lc = '#000', gf = '#cfeeff'
  const parts: string[] = []

  const MOBILE_W_CM  = 75
  const SOPRA_REF_CM = 140
  const FASCIA_CM    = 75

  const sopraCm  = hasSopraluce ? Math.max(0, heightCm - SOPRA_REF_CM) : 0
  const sopraPx  = Math.round((sopraCm / heightCm) * innerH)
  const travT    = hasSopraluce ? Math.max(4, frameT_Y * 0.9) : 0
  const panelY   = innerY + sopraPx + travT
  const panelH   = Math.max(10, innerH - sopraPx - travT)
  const panelHcm = heightCm - sopraCm

  // sopraluce glass + traverso
  if (hasSopraluce && sopraPx > 4) {
    const sT  = Math.min(Math.max(2, PROFILE_CM * pxPerCmX * 0.6), innerW * 0.1)
    const sTy = Math.min(Math.max(2, PROFILE_CM * pxPerCmY * 0.4), sopraPx * 0.3)
    const gX  = innerX + sT, gY = innerY + sTy
    const gW  = Math.max(2, innerW - sT * 2)
    const gH  = Math.max(2, sopraPx - sTy - travT * 0.5)
    parts.push(`<line x1="${gX.toFixed(1)}" y1="${gY.toFixed(1)}" x2="${innerX.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${(gX+gW).toFixed(1)}" y1="${gY.toFixed(1)}" x2="${(innerX+innerW).toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<rect x="${gX.toFixed(1)}" y="${gY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gH.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
    const ty = innerY + sopraPx
    parts.push(`<rect x="${innerX.toFixed(1)}" y="${ty.toFixed(1)}" width="${innerW.toFixed(1)}" height="${travT.toFixed(1)}" fill="${profColor}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${innerX.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${(innerX+innerW).toFixed(1)}" y1="${ty.toFixed(1)}" x2="${(outerX+outerW).toFixed(1)}" y2="${ty.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
  }

  // panel width distribution
  const mCnt = panelChars.filter(c => 'AVRP'.includes(c)).length
  const fCnt = panelChars.filter(c => c === 'F').length
  const fwCm = fCnt > 0 ? Math.max(30, (widthCm - mCnt * MOBILE_W_CM) / fCnt) : 0
  const pcms = panelChars.map(c => 'AVRP'.includes(c) ? MOBILE_W_CM : (c === 'F' ? fwCm : MOBILE_W_CM))
  const tCm  = pcms.reduce((s, w) => s + w, 0) || widthCm
  const ppx  = pcms.map(w => (w / tCm) * innerW)

  let curX = innerX
  for (let i = 0; i < panelChars.length; i++) {
    const c   = panelChars[i]
    const pw  = ppx[i]
    const sx2 = curX + pw, sy2 = panelY + panelH
    const isF = i === 0, isL = i === panelChars.length - 1
    const topY = hasSopraluce ? (innerY + sopraPx) : outerY

    const sT_X = Math.min(Math.max(3, PROFILE_CM * pxPerCmX), pw * 0.38)
    const sT_Y = Math.min(Math.max(3, PROFILE_CM * pxPerCmY), panelH * 0.38)
    const gX = curX + sT_X, gY = panelY + sT_Y
    const gW = Math.max(2, pw - sT_X * 2), gH = Math.max(2, panelH - sT_Y * 2)

    parts.push(`<rect x="${curX.toFixed(1)}" y="${panelY.toFixed(1)}" width="${pw.toFixed(1)}" height="${panelH.toFixed(1)}" fill="${profColor}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${gX.toFixed(1)}" y1="${gY.toFixed(1)}" x2="${curX.toFixed(1)}" y2="${panelY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${(gX+gW).toFixed(1)}" y1="${gY.toFixed(1)}" x2="${sx2.toFixed(1)}" y2="${panelY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${gX.toFixed(1)}" y1="${(gY+gH).toFixed(1)}" x2="${curX.toFixed(1)}" y2="${sy2.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    parts.push(`<line x1="${(gX+gW).toFixed(1)}" y1="${(gY+gH).toFixed(1)}" x2="${sx2.toFixed(1)}" y2="${sy2.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    if (isF) {
      parts.push(`<line x1="${curX.toFixed(1)}" y1="${panelY.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${topY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<line x1="${curX.toFixed(1)}" y1="${sy2.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${(outerY+outerH).toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    }
    if (isL) {
      parts.push(`<line x1="${sx2.toFixed(1)}" y1="${panelY.toFixed(1)}" x2="${(outerX+outerW).toFixed(1)}" y2="${topY.toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<line x1="${sx2.toFixed(1)}" y1="${sy2.toFixed(1)}" x2="${(outerX+outerW).toFixed(1)}" y2="${(outerY+outerH).toFixed(1)}" stroke="${lc}" stroke-width="1"/>`)
    }

    if (c === 'F') {
      parts.push(`<rect x="${gX.toFixed(1)}" y="${gY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gH.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
    } else if (c === 'A' || c === 'R' || c === 'P') {
      if (c === 'P' && panelHcm > FASCIA_CM + 20) {
        const fFrac  = 1 - FASCIA_CM / panelHcm
        const fasciaY = panelY + Math.round(fFrac * panelH)
        const fT      = Math.max(3, sT_Y * 0.6)
        const gHup    = Math.max(0, fasciaY - fT/2 - gY)
        const loGlY   = fasciaY + fT/2
        const gHlo    = Math.max(0, sy2 - sT_Y - loGlY)
        if (gHup > 0) parts.push(`<rect x="${gX.toFixed(1)}" y="${gY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gHup.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
        parts.push(`<rect x="${curX.toFixed(1)}" y="${(fasciaY-fT/2).toFixed(1)}" width="${pw.toFixed(1)}" height="${fT.toFixed(1)}" fill="${profColor}" stroke="${lc}" stroke-width="1"/>`)
        if (gHlo > 0) parts.push(`<rect x="${gX.toFixed(1)}" y="${loGlY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gHlo.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
      } else {
        parts.push(`<rect x="${gX.toFixed(1)}" y="${gY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gH.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
      }
      // hinges left
      const hpW = Math.max(1.8, 5*pxPerCmX), hpH = Math.max(2.2, 5*pxPerCmY)
      const hx  = curX - hpW/2
      const hy1 = panelY + panelH*0.27 - hpH, hy2 = panelY + panelH*0.73 - hpH
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy1.toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy1+hpH).toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy2.toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy2+hpH).toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      // handle right
      const hdW = Math.min(Math.max(1.4, 3*pxPerCmX), Math.max(1.2, sT_X - 1))
      const hdH = Math.min(Math.max(4, 12*pxPerCmY), Math.max(6, panelH - 4))
      const hdX = sx2 - sT_X + 0.6, hdY = panelY + (panelH - hdH)/2
      parts.push(`<rect x="${hdX.toFixed(1)}" y="${hdY.toFixed(1)}" width="${hdW.toFixed(1)}" height="${hdH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      if (c === 'R') {
        const mx = curX + pw/2, bY = gY + gH*0.75, tY = gY + gH*0.25, hw = pw*0.12
        parts.push(`<line x1="${mx.toFixed(1)}" y1="${bY.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${tY.toFixed(1)}" stroke="${lc}" stroke-width="1.5"/>`)
        parts.push(`<line x1="${(mx-hw).toFixed(1)}" y1="${(tY+hw).toFixed(1)}" x2="${mx.toFixed(1)}" y2="${tY.toFixed(1)}" stroke="${lc}" stroke-width="1.5"/>`)
        parts.push(`<line x1="${(mx+hw).toFixed(1)}" y1="${(tY+hw).toFixed(1)}" x2="${mx.toFixed(1)}" y2="${tY.toFixed(1)}" stroke="${lc}" stroke-width="1.5"/>`)
      }
    } else if (c === 'V') {
      parts.push(`<rect x="${gX.toFixed(1)}" y="${gY.toFixed(1)}" width="${gW.toFixed(1)}" height="${gH.toFixed(1)}" fill="${gf}" stroke="${lc}" stroke-width="1"/>`)
      const hpW2 = Math.max(1.8, 5*pxPerCmX), hpH2 = Math.max(2.2, 5*pxPerCmY)
      const hxL  = curX + pw*0.25 - hpW2/2, hxR = curX + pw*0.75 - hpW2/2
      const hyB  = sy2 - hpH2
      parts.push(`<rect x="${hxL.toFixed(1)}" y="${hyB.toFixed(1)}" width="${hpW2.toFixed(1)}" height="${hpH2.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hxR.toFixed(1)}" y="${hyB.toFixed(1)}" width="${hpW2.toFixed(1)}" height="${hpH2.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      const hdW3 = Math.max(4, pw*0.2), hdH3 = Math.max(2, 3*pxPerCmY)
      const hdX3 = curX + (pw - hdW3)/2, hdY3 = panelY + sT_Y*0.3
      parts.push(`<rect x="${hdX3.toFixed(1)}" y="${hdY3.toFixed(1)}" width="${hdW3.toFixed(1)}" height="${hdH3.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
    }
    curX += pw
  }

  const svgMarkupA = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;">
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="${profColor}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+outerH-frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+outerW-frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  ${parts.join('\n  ')}
  ${larghezza > 0 ? `<text x="${(outerX+outerW/2).toFixed(1)}" y="${(outerY+outerH+12).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lc}" font-family="Arial,sans-serif">${larghezza} cm</text>` : ''}
  ${altezza > 0 ? `<text x="${(outerX-10).toFixed(1)}" y="${(outerY+outerH/2).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lc}" font-family="Arial,sans-serif" transform="rotate(-90,${(outerX-10).toFixed(1)},${(outerY+outerH/2).toFixed(1)})">${altezza} cm</text>` : ''}
</svg>`
  const svgDataUriA = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkupA)}`
  return `<img src="${svgDataUriA}" width="${W}" height="${H}" alt="Serramento" style="display:block;margin:0 auto;" />`
}

// ─── HTML sezione caratteristiche figlie ─────────────────────────────────────
function caratteristicheHTML(children: Record<string, unknown>[], parentPrezzo: number, parentIdx: number, prezzoHTML: string): string {
  let totaleBlocco = parentPrezzo
  const righeCaratt = children.map(c => {
    const tipo    = String(c.tipo_prodotto ?? '').trim()
    const marca   = String(c.marca ?? '').trim()
    const modello = String(c.modello ?? '').trim()
    const label   = [tipo, [marca, modello].filter(Boolean).join(' ')].filter(Boolean).join(': ')
    const contrib = Number(c.prezzo_totale ?? 0)
    totaleBlocco += contrib
    const fotoRaw = String(c.foto_url ?? '').trim()
    const fotoUrl = fotoRaw
      ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/')
          ? fotoRaw : `/${fotoRaw.replace(/^\/+/, '')}`)
      : ''
    const fotoAttr  = fotoUrl.replace(/"/g, '%22')
    const sign      = contrib >= 0 ? '+' : '−'
    const absAmt    = Math.abs(contrib).toFixed(2)
    const contribColor = '#1a3a5c'
    return `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #ececec;">
      <div style="width:48px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        ${fotoUrl
          ? `<img src="${fotoAttr}" alt="" style="max-width:48px;max-height:36px;object-fit:contain;display:block;"/>`
          : `<div style="width:48px;height:36px;background:#ececec;border-radius:2px;"></div>`}
      </div>
      <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">${label || 'Caratteristica'}</div>
      <div style="font-size:10.5px;font-weight:bold;color:${contribColor};white-space:nowrap;">${sign}€ ${absAmt}</div>
    </div>`
  }).join('\n')

  const caratHeader = children.length > 0
    ? `<div style="font-size:9px;font-weight:bold;color:#999;text-transform:uppercase;letter-spacing:.05em;margin-top:6px;margin-bottom:4px;">Caratteristiche incluse</div>`
    : ''

  return `<div style="border-top:1px solid #d0d0d0;background:#f8fafc;padding:6px 12px 8px;">
  <div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #ececec;">
    <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">Subtotale indicativo</div>
    <div style="font-size:10.5px;white-space:nowrap;text-align:right;">${prezzoHTML}</div>
  </div>
  ${caratHeader}
  ${righeCaratt}
  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:bold;color:#1a3a5c;border-top:1px solid #c8d4e8;padding-top:4px;margin-top:4px;">
    <span>Totale Articolo #${parentIdx + 1}:</span><span>€ ${totaleBlocco.toFixed(2)}</span>
  </div>
</div>`
}

// ─── HTML blocco articolo principale + caratteristiche figlie ─────────────────
function articoloBlockHTML(parent: Record<string, unknown>, children: Record<string, unknown>[], idx: number): string {
  const tipo    = String(parent.tipo_prodotto ?? '')
  const marca   = String(parent.marca ?? '')
  const modello = String(parent.modello ?? '')
  const colore  = String(parent.colore ?? '')
  const vetro   = String(parent.tipo_vetro ?? '')
  const acc     = String(parent.accessori ?? '')
  const h       = Number(parent.altezza_cm)
  const l       = Number(parent.larghezza_cm)
  const anteRaw = Number(parent.n_ante)
  const ante    = anteRaw >= 2 ? anteRaw : 2
  const qtà     = Number(parent.quantita)
  const prezzo  = Number(parent.prezzo_totale)
  const unita   = String(parent.unita ?? 'pz')
  const pb      = Number(parent.prezzo_base ?? 0)
  const scontoArt = Number(parent.sconto_articolo_pct ?? 0)
  const fotoRaw = String(parent.foto_url ?? '').trim()
  const fotoUrl = fotoRaw
    ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/')
        ? fotoRaw
        : `/${fotoRaw.replace(/^\/+/, '')}`)
    : ''
  const fotoAttr = fotoUrl.replace(/"/g, '%22')
  const abbr = String(parent.abbr ?? '').trim()

  let prezzoBase = 0
  if (unita === 'm²')      prezzoBase = Math.round(pb * (h/100) * (l/100) * qtà * 100) / 100
  else if (unita === 'ml') prezzoBase = Math.round(pb * (l/100) * qtà * 100) / 100
  else                     prezzoBase = Math.round(pb * qtà * 100) / 100

  const scontoLabel = scontoArt < 0
    ? `Magg. +${Math.abs(scontoArt)}%`
    : `Promo −${scontoArt}%`
  const scontoColor = scontoArt < 0 ? '#1565c0' : '#e65100'
  const prezzoBaseHTML = scontoArt !== 0 && prezzoBase > 0
    ? `<span style="color:#aaa;text-decoration:line-through;font-size:10.5px;font-weight:normal;">€ ${prezzoBase.toFixed(2)}</span>
       <span style="color:${scontoColor};font-size:10.5px;font-weight:normal;margin-left:4px;">${scontoLabel}</span>
       <span style="display:block;font-size:10.5px;font-weight:bold;color:#1a3a5c;">€ ${prezzo > 0 ? prezzo.toFixed(2) : '—'}</span>`
    : `<span style="font-size:10.5px;font-weight:bold;color:#1a3a5c;">€ ${prezzo > 0 ? prezzo.toFixed(2) : '—'}</span>`

  const righe: string[] = []
  if (marca || modello) righe.push(`<span style="color:#555;">Profilo:</span> ${[marca, modello].filter(Boolean).join(' — ')}`)
  if (colore)           righe.push(`<span style="color:#555;">Colore:</span> ${colore}`)
  if (h > 0 || l > 0)  righe.push(`<span style="color:#555;">Dimensioni:</span> ${l} × ${h} cm`)
  if (ante > 1)         righe.push(`<span style="color:#555;">N° ante:</span> ${ante}`)
  if (vetro)            righe.push(`<span style="color:#555;">Vetro:</span> ${vetro}`)
  if (acc)              righe.push(`<span style="color:#555;">Accessori:</span> ${acc}`)
  righe.push(`<span style="color:#555;">Quantità:</span> ${qtà}`)

  return `<div style="border:1px solid #d0d0d0;border-radius:4px;margin-bottom:10px;overflow:hidden;">
  <div style="background:#1a3a5c;color:#fff;padding:5px 12px;font-size:11px;font-weight:bold;letter-spacing:.05em;">
    #${idx + 1} &nbsp; ${tipo.toUpperCase()}
  </div>
  <div style="display:flex;">
    <div style="flex:1;padding:8px 12px;font-size:11.5px;line-height:1.75;">
      ${righe.join('<br/>')}
    </div>
    <div style="width:156px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      ${fotoUrl
        ? `<img src="${fotoAttr}" alt="Scheda tecnica" style="display:block;max-width:100%;max-height:124px;object-fit:contain;margin:0 auto;" />`
        : `<div style="font-size:10px;color:#b0b0b0;text-align:center;">Nessuna immagine<br/>scheda tecnica</div>`}
    </div>
    <div style="width:170px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fafafa;">
      ${abbr ? disegnoSVGAbbr(abbr, l, h, Number(parent.profilo_mm) > 0 ? Number(parent.profilo_mm) : 70) : disegnoSVG(l, h, ante, Number(parent.profilo_mm) > 0 ? Number(parent.profilo_mm) : 70)}
    </div>
  </div>
  ${caratteristicheHTML(children, prezzo, idx, prezzoBaseHTML)}
</div>`
}

// ─── Template completo dal DB con sostituzione placeholder ────────────────────

const FALLBACK_TEMPLATE_DEF = `<div style="font-family:Arial,Helvetica,sans-serif;width:794px;min-height:1050px;padding:40px 50px 90px;position:relative;background:#fff;box-sizing:border-box;">
  <table style="width:100%;margin-bottom:14px;border-collapse:collapse;"><tr>
    <td style="vertical-align:top;width:50%;">
      <img src="/images/volantino/dg-t.png" alt="Logo" style="height:46px;margin-bottom:7px;display:block;"/>
      <div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Digi Home Design S.r.l.</div>
      <div style="font-size:10px;color:#555;line-height:1.55;margin-top:3px;">
        Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>info@digi-home-design.com
      </div>
    </td>
    <td style="vertical-align:top;text-align:right;width:50%;">
      <img src="/images/volantino/nome_tr.png" alt="Logo 2" style="height:46px;"/>
    </td>
  </tr></table>
  <hr style="border:none;border-top:2px solid #1a3a5c;margin:0 0 12px;"/>
  <table style="width:100%;margin-bottom:12px;border-collapse:collapse;"><tr>
    <td style="vertical-align:top;width:50%;">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Data</div>
      <div style="font-size:12px;font-weight:bold;">{{data}}</div>
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:6px 0 2px;">Rif. N°</div>
      <div style="font-size:12px;font-weight:bold;">{{numero}}</div>
    </td>
    <td style="vertical-align:top;text-align:right;width:50%;">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">Spett.le</div>
      <div style="font-size:13px;font-weight:bold;color:#1a3a5c;">{{cliente_nome}}</div>
      <div style="font-size:11px;color:#555;margin-top:3px;line-height:1.5;">{{cliente_indirizzo}}</div>
    </td>
  </tr></table>
  <div style="font-size:12px;margin-bottom:6px;"><strong>Oggetto:</strong> {{oggetto}}</div>
  <div style="font-size:12px;margin-bottom:14px;line-height:1.6;">Gentile Cliente,<br/>Vi rimettiamo la nostra offerta escluso IVA di:</div>
  {{articoli}}
  {{sconto_block}}
  {{note_block}}
  <div style="position:absolute;bottom:24px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:8px;font-size:9px;color:#888;text-align:center;line-height:1.6;">
    Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com
  </div>
</div>`

async function buildPageFromTemplate(opts: {
  artRows: Record<string, unknown>[]
  totale: string
  data: string
  numero: string
  clienteNome: string
  clienteIndirizzo: string
  stato: string
  scontoClientePct: number
  noteRaw: string | null
  db: Awaited<ReturnType<typeof getConnection>>
}): Promise<string> {
  const { artRows, totale, data, numero, clienteNome, clienteIndirizzo, stato, scontoClientePct, noteRaw, db } = opts

  // Raggruppa articoli in blocchi padre+figli
  const roots = artRows.filter(a => a.parent_id == null)
  const childrenMap = new Map<number, Record<string, unknown>[]>()
  for (const c of artRows) {
    if (c.parent_id == null) continue
    const pid = Number(c.parent_id)
    if (!childrenMap.has(pid)) childrenMap.set(pid, [])
    childrenMap.get(pid)!.push(c)
  }
  const articoliHtml = roots
    .map((parent, i) => articoloBlockHTML(parent, childrenMap.get(Number(parent.id)) ?? [], i))
    .join('\n')

  // Blocco sconto + totale
  const scontoBlock = (() => {
    if (scontoClientePct > 0) {
      const subtotale = artRows.reduce((s, a) => s + Number(a.prezzo_totale ?? 0), 0)
      const scontoAmt = (subtotale * scontoClientePct / 100).toFixed(2)
      return `<div style="margin-top:22px;text-align:right;padding:12px 16px;background:#f0f4fa;border-radius:4px;">
        <div style="font-size:10px;color:#555;margin-bottom:3px;">Subtotale (escluso IVA)</div>
        <div style="font-size:15px;font-weight:bold;color:#1a3a5c;margin-bottom:4px;">€ ${subtotale.toFixed(2)}</div>
        <div style="font-size:10px;color:#e65100;margin-bottom:3px;">${scontoClientePct === 5 ? 'Sconto di benvenuto (5%)' : `Sconto riservato al cliente (${scontoClientePct}%)`}</div>
        <div style="font-size:15px;font-weight:bold;color:#e65100;margin-bottom:6px;">− € ${scontoAmt}</div>
        <div style="border-top:1px solid #c8d4e8;padding-top:6px;">
          <div style="font-size:10px;color:#555;margin-bottom:2px;">Totale offerta (escluso IVA)</div>
          <div style="font-size:22px;font-weight:bold;color:#1a3a5c;">€ ${totale}</div>
        </div>
      </div>`
    }
    return `<div style="margin-top:22px;text-align:right;padding:12px 16px;background:#f0f4fa;border-radius:4px;">
      <div style="font-size:11px;color:#555;margin-bottom:2px;">Totale offerta (escluso IVA)</div>
      <div style="font-size:22px;font-weight:bold;color:#1a3a5c;">€ ${totale}</div>
    </div>`
  })()

  const noteBlock = noteRaw
    ? `<div style="margin-top:16px;border-top:1px solid #eee;padding-top:10px;font-size:11px;color:#666;line-height:1.6;"><strong>Note:</strong><br/>${noteRaw}</div>`
    : ''

  const oggetto = stato === 'bozza' || stato === 'richiesto' ? 'Bozza di preventivo' : 'Preventivo'

  // Leggi template dal DB
  let tpl = FALLBACK_TEMPLATE_DEF
  try {
    const [tplRows] = await db.query(
      `SELECT html FROM preventivo_templates WHERE tipo = 'preventivo' AND attivo = 1 ORDER BY id DESC LIMIT 1`
    ) as [{ html: string }[], unknown]
    if (tplRows[0]?.html) tpl = tplRows[0].html
  } catch { /* usa fallback */ }

  return tpl
    .replace(/\{\{data\}\}/g, data)
    .replace(/\{\{numero\}\}/g, numero)
    .replace(/\{\{cliente_nome\}\}/g, clienteNome)
    .replace(/\{\{cliente_indirizzo\}\}/g, clienteIndirizzo)
    .replace(/\{\{oggetto\}\}/g, oggetto)
    .replace(/\{\{stato\}\}/g, stato)
    .replace(/\{\{articoli\}\}/g, articoliHtml)
    .replace(/\{\{sconto_block\}\}/g, scontoBlock)
    .replace(/\{\{totale\}\}/g, totale)
    .replace(/\{\{note_block\}\}/g, noteBlock)
}

// ─── Caricamento dati ─────────────────────────────────────────────────────────
async function loadData(prevId: number, username: string, isStaff: boolean): Promise<string[] | null> {
  const db = await getConnection()
  try {
    const [pRows] = await db.query('SELECT * FROM preventivi WHERE id = ?', [prevId]) as [Record<string, unknown>[], unknown]
    if (!pRows[0]) return null
    const p = pRows[0]

    if (!isStaff) {
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
      if (Number(p.cliente_id) !== (cRows[0]?.id ?? null)) return null
    }

    let clienteNome = '—', clienteIndirizzo = ''
    if (p.cliente_id) {
      const [cRows] = await db.query(
        'SELECT nome, cognome, ragione_sociale, indirizzo FROM clienti WHERE id = ? LIMIT 1',
        [p.cliente_id]
      ) as [Record<string, unknown>[], unknown]
      if (cRows[0]) {
        const c = cRows[0]
        clienteNome      = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim()
        clienteIndirizzo = String(c.indirizzo ?? '').trim()
      }
    }

    const [artRows] = await db.query(
      `SELECT pa.id, pa.preventivo_id, pa.tipo_prodotto, pa.marca, pa.modello,
              pa.listino_id, pa.prezzo_base, pa.unita, pa.colore, pa.tipo_vetro,
              pa.accessori, pa.altezza_cm, pa.larghezza_cm, pa.n_ante, pa.quantita,
              pa.prezzo_totale, pa.note, pa.sconto_articolo_pct, pa.parent_id,
              l.profilo_frontale_mm AS profilo_mm, l.foto_url AS foto_url, l.abbr AS abbr
       FROM preventivo_articoli pa
       LEFT JOIN listini l ON pa.listino_id = l.id
       WHERE pa.preventivo_id = ?
       ORDER BY pa.id ASC`,
      [prevId]
    ) as [Record<string, unknown>[], unknown]

    const dataRaw = p.data instanceof Date ? p.data : new Date(String(p.data))
    const data    = isNaN(dataRaw.getTime()) ? String(p.data) : dataRaw.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
    const numero  = String(p.numero || `#${p.id}`)
    const totale  = Number(p.importo).toFixed(2)

    const pageHtml = await buildPageFromTemplate({
      artRows: artRows as Record<string, unknown>[],
      totale,
      data,
      numero,
      clienteNome,
      clienteIndirizzo,
      stato: String(p.stato ?? 'bozza'),
      scontoClientePct: Number(p.sconto_cliente_pct ?? 0),
      noteRaw: p.note != null ? String(p.note) : null,
      db,
    })

    return [pageHtml]
  } finally {
    await db.end()
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { id } = await params
  const prevId  = parseInt(id)
  if (isNaN(prevId)) redirect('/area-clienti/preventivi')

  const isStaff = role === 'admin' || role === 'dipendente'
  const pages   = await loadData(prevId, username, isStaff)
  if (!pages) redirect('/area-clienti/preventivi')

  return <StampaClient pages={pages} />
}
