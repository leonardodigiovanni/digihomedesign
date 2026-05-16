import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import StampaProvvisorioClient from './stampa-client'
import { decompressCart } from '@/lib/cart-cookie'

export const metadata: Metadata = { title: 'Stampa Preventivo Provvisorio' }

// ─── Tipi ─────────────────────────────────────────────────────────────────────

type ArtRow = {
  idx: number
  uid?: number
  parent_uid?: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  quantita: number
  larghezza_cm: number
  altezza_cm: number
  foto_url: string
  profilo_mm: number
  abbr: string
}

function calcolaPrezzo(a: ArtRow, allArts?: ArtRow[]): number {
  if (a.parent_uid != null && a.prezzo_vendita === 0 && a.sconto_articolo !== 0 && allArts) {
    const padre = allArts.find(x => x.uid === a.parent_uid)
    if (padre) return Math.round(-(calcolaPrezzo(padre) * a.sconto_articolo / 100) * 100) / 100
    return 0
  }
  const pb = a.prezzo_vendita
  const h  = a.altezza_cm  / 100
  const l  = a.larghezza_cm / 100
  const q  = a.quantita
  if (a.unita === 'm²') return Math.round(pb * h * l * q * 100) / 100
  if (a.unita === 'ml') return Math.round(pb * l * q * 100) / 100
  return Math.round(pb * q * 100) / 100
}

// ─── SVG serramento (stesse funzioni del definitivo) ─────────────────────────

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
  const PROFILE_CM = profiloMm / 10
  const ante = Math.max(1, Math.min(4, nAnte || 1))
  const widthCm  = larghezza > 0 ? larghezza : 100
  const heightCm = altezza   > 0 ? altezza   : 150

  const padTop = 4, padRight = 4, leftMeasureMargin = 20, bottomMeasureMargin = 16
  const outerX = leftMeasureMargin, outerY = padTop
  const outerW = W - leftMeasureMargin - padRight
  const outerH = H - padTop - bottomMeasureMargin
  const pxPerCmX = outerW / widthCm, pxPerCmY = outerH / heightCm
  const frameT_X = Math.max(4.5, PROFILE_CM * pxPerCmX)
  const frameT_Y = Math.max(4.5, PROFILE_CM * pxPerCmY)
  const innerX = outerX + frameT_X, innerY = outerY + frameT_Y
  const innerW = Math.max(18, outerW - frameT_X * 2)
  const innerH = Math.max(24, outerH - frameT_Y * 2)
  const sashW = innerW / ante, sashH = innerH

  const parts: string[] = []
  const profColor = '#ffffff', lineColor = '#000', glassFill = '#cfeeff'

  for (let i = 0; i < ante; i++) {
    const sx = innerX + i * sashW
    const sashT_X = Math.min(Math.max(3, PROFILE_CM * pxPerCmX), sashW * 0.38)
    const sashT_Y = Math.min(Math.max(3, PROFILE_CM * pxPerCmY), sashH * 0.38)
    const glassX = sx + sashT_X, glassY = innerY + sashT_Y
    const glassW = Math.max(2, sashW - sashT_X * 2), glassH = Math.max(2, sashH - sashT_Y * 2)
    const sashX2 = sx + sashW, sashY2 = innerY + sashH
    parts.push(`<rect x="${sx.toFixed(1)}" y="${innerY.toFixed(1)}" width="${sashW.toFixed(1)}" height="${sashH.toFixed(1)}" fill="${profColor}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${glassX.toFixed(1)}" y1="${glassY.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${(glassX+glassW).toFixed(1)}" y1="${glassY.toFixed(1)}" x2="${sashX2.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${glassX.toFixed(1)}" y1="${(glassY+glassH).toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sashY2.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    parts.push(`<line x1="${(glassX+glassW).toFixed(1)}" y1="${(glassY+glassH).toFixed(1)}" x2="${sashX2.toFixed(1)}" y2="${sashY2.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    if (i === 0) {
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${innerY.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${outerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<line x1="${sx.toFixed(1)}" y1="${sashY2.toFixed(1)}" x2="${outerX.toFixed(1)}" y2="${(outerY+outerH).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    }
    if (i === ante - 1) {
      parts.push(`<line x1="${sashX2.toFixed(1)}" y1="${innerY.toFixed(1)}" x2="${(outerX+outerW).toFixed(1)}" y2="${outerY.toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<line x1="${sashX2.toFixed(1)}" y1="${sashY2.toFixed(1)}" x2="${(outerX+outerW).toFixed(1)}" y2="${(outerY+outerH).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>`)
    }
    parts.push(`<rect x="${glassX.toFixed(1)}" y="${glassY.toFixed(1)}" width="${glassW.toFixed(1)}" height="${glassH.toFixed(1)}" fill="${glassFill}" stroke="${lineColor}" stroke-width="1"/>`)
    if (i === 0 || i === ante - 1) {
      const isLeft = i === 0
      const seamX = isLeft ? sx : sx + sashW
      const hingePartW = Math.max(1.8, 5 * pxPerCmX), hingePartH = Math.max(2.2, 5 * pxPerCmY)
      const hx = seamX - hingePartW / 2
      const hy1 = innerY + sashH * 0.27 - hingePartH, hy2 = innerY + sashH * 0.73 - hingePartH
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy1.toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy1+hingePartH).toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy2.toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy2+hingePartH).toFixed(1)}" width="${hingePartW.toFixed(1)}" height="${hingePartH.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)
    }
  }

  const handleLeafIndex = ante === 1 ? 0 : 1
  const hsx = innerX + handleLeafIndex * sashW
  const hOnLeftStile = ante > 1
  const handleW = Math.max(1.4, 3 * pxPerCmX), handleH = Math.max(4, 12 * pxPerCmY)
  const handlePad = 0.6
  const handleSashTX = Math.min(Math.max(3, PROFILE_CM * pxPerCmX), sashW * 0.38)
  const handleWClamped = Math.min(handleW, Math.max(1.2, handleSashTX - handlePad * 2))
  const handleHClamped = Math.min(handleH, Math.max(6, sashH - 4))
  const leftStileMinX = hsx + handlePad, leftStileMaxX = hsx + handleSashTX - handleWClamped - handlePad
  const rightStileMinX = hsx + sashW - handleSashTX + handlePad, rightStileMaxX = hsx + sashW - handleWClamped - handlePad
  const handleX = hOnLeftStile
    ? Math.max(leftStileMinX, Math.min(hsx + 1.2, leftStileMaxX))
    : Math.max(rightStileMinX, Math.min(hsx + sashW - handleWClamped - 1.2, rightStileMaxX))
  const handleY = innerY + (sashH - handleHClamped) / 2
  parts.push(`<rect x="${handleX.toFixed(1)}" y="${handleY.toFixed(1)}" width="${handleWClamped.toFixed(1)}" height="${handleHClamped.toFixed(1)}" fill="#ffffff" stroke="${lineColor}" stroke-width="1"/>`)

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;">
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="${profColor}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+outerH-frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+outerW-frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  ${parts.join('\n  ')}
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
        const fFrac   = 1 - FASCIA_CM / panelHcm
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
      const hpW = Math.max(1.8, 5*pxPerCmX), hpH = Math.max(2.2, 5*pxPerCmY)
      const hx  = curX - hpW/2
      const hy1 = panelY + panelH*0.27 - hpH, hy2 = panelY + panelH*0.73 - hpH
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy1.toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy1+hpH).toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${hy2.toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
      parts.push(`<rect x="${hx.toFixed(1)}" y="${(hy2+hpH).toFixed(1)}" width="${hpW.toFixed(1)}" height="${hpH.toFixed(1)}" fill="#fff" stroke="${lc}" stroke-width="1"/>`)
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

function caratteristicheHTML(children: ArtRow[], allArts: ArtRow[], parentPrezzo: number, parentIdx: number): string {
  let totaleBlocco = parentPrezzo
  const righeCaratt = children.map(c => {
    const contrib = calcolaPrezzo(c, allArts)
    totaleBlocco += contrib
    const fotoRaw = (c.foto_url ?? '').trim()
    const fotoUrl = fotoRaw
      ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw.replace(/^\/+/, '')}`)
      : ''
    const fotoAttr = fotoUrl.replace(/"/g, '%22')
    const label = [c.categoria, [c.produttore, c.descrizione].filter(Boolean).join(' ')].filter(Boolean).join(': ')
    const sign = contrib >= 0 ? '+' : '−'
    const contribColor = '#1a3a5c'
    return `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #ececec;">
      <div style="width:48px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        ${fotoUrl
          ? `<img src="${fotoAttr}" alt="" style="max-width:48px;max-height:36px;object-fit:contain;display:block;border:1px solid #888;"/>`
          : `<div style="width:48px;height:36px;background:#ececec;border-radius:2px;"></div>`}
      </div>
      <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">${label || 'Caratteristica'}</div>
      <div style="font-size:10.5px;font-weight:bold;color:${contribColor};white-space:nowrap;">${sign}€ ${Math.abs(contrib).toFixed(2)}</div>
    </div>`
  }).join('\n')

  const caratHeader = children.length > 0
    ? `<div style="font-size:9px;font-weight:bold;color:#999;text-transform:uppercase;letter-spacing:.05em;margin-top:6px;margin-bottom:4px;">Caratteristiche incluse</div>`
    : ''

  return `<div style="border-top:1px solid #d0d0d0;background:#f8fafc;padding:6px 12px 8px;">
  <div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #ececec;">
    <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">Subtotale indicativo</div>
    <div style="font-size:10.5px;font-weight:bold;color:#1a3a5c;white-space:nowrap;">€ ${parentPrezzo.toFixed(2)}</div>
  </div>
  ${caratHeader}
  ${righeCaratt}
  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:bold;color:#1a3a5c;border-top:1px solid #c8d4e8;padding-top:4px;margin-top:4px;">
    <span>Totale Articolo #${parentIdx + 1}:</span><span>€ ${totaleBlocco.toFixed(2)}</span>
  </div>
</div>`
}

// ─── HTML blocco articolo principale + caratteristiche ────────────────────────

function articoloBlockHTML(parent: ArtRow, children: ArtRow[], allArts: ArtRow[]): string {
  const subtotale = calcolaPrezzo(parent, allArts)
  const fotoRaw   = (parent.foto_url ?? '').trim()
  const fotoUrl   = fotoRaw
    ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/')
        ? fotoRaw
        : `/${fotoRaw.replace(/^\/+/, '')}`)
    : ''
  const fotoAttr  = fotoUrl.replace(/"/g, '%22')
  const profiloMm = Number(parent.profilo_mm) > 0 ? Number(parent.profilo_mm) : 70

  const righe = [
    `<span style="color:#555;">Produttore:</span> ${parent.produttore || '—'}`,
    `<span style="color:#555;">Articolo:</span> ${parent.descrizione}`,
    `<span style="color:#555;">Unità:</span> ${parent.unita}`,
    `<span style="color:#555;">Prezzo unit.:</span> € ${Number(parent.prezzo_vendita).toFixed(2)}`,
    `<span style="color:#555;">Quantità:</span> ${parent.quantita}`,
  ]

  return `<div style="border:1px solid #d0d0d0;border-radius:4px;margin-bottom:10px;overflow:hidden;">
  <div style="background:#1a3a5c;color:#fff;padding:5px 12px;font-size:11px;font-weight:bold;letter-spacing:.05em;">
    #${parent.idx + 1} &nbsp; ${parent.categoria.toUpperCase()}
  </div>
  <div style="display:flex;">
    <div style="flex:1;padding:8px 12px;font-size:11.5px;line-height:1.75;">
      ${righe.join('<br/>')}
    </div>
    ${fotoUrl ? `<div style="width:156px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      <img src="${fotoAttr}" alt="Foto" style="display:block;max-width:100%;max-height:124px;object-fit:contain;margin:0 auto;" />
    </div>` : `<div style="width:156px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      <div style="font-size:10px;color:#b0b0b0;text-align:center;">Nessuna immagine<br/>scheda tecnica</div>
    </div>`}
    <div style="width:170px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fafafa;">
      ${parent.abbr ? disegnoSVGAbbr(parent.abbr, parent.larghezza_cm, parent.altezza_cm, profiloMm) : disegnoSVG(parent.larghezza_cm, parent.altezza_cm, 1, profiloMm)}
    </div>
  </div>
  ${caratteristicheHTML(children, allArts, subtotale, parent.idx)}
</div>`
}

// ─── Stima altezza articolo ───────────────────────────────────────────────────

function estimaAltezza(): number {
  const lines  = 5  // produttore, articolo, unità, prezzo, qtà
  const lineH  = 11.5 * 1.75  // ~20px
  const textH  = 16 + lines * lineH + 6 + 22  // pad + righe + gap + subtotale
  const mediaH = Math.max(150, 136)             // colonna foto/svg
  return 23 + Math.max(textH, mediaH) + 10
}

function estimaAltezzaBlock(children: ArtRow[]): number {
  const parentH = estimaAltezza()
  if (children.length === 0) return parentH
  const n = children.length
  const caratH = 20 + n * 42 + (n + 2) * 14 + 16
  return parentH + caratH
}

// ─── Header da template DB (con placeholder sostituiti) ──────────────────────

async function getHeaderTemplate(data: string, nome: string): Promise<string> {
  try {
    const db = await getConnection()
    try {
      const [rows] = await db.query(
        `SELECT html FROM preventivo_templates WHERE tipo = 'preventivo_provvisorio' LIMIT 1`
      ) as [{ html: string }[], unknown]
      let html = rows[0]?.html ?? ''
      if (html) {
        html = html
          .replace(/\/images\/dg-t\.png/g, '/images/volantino/rrr.png')
          .replace(/\/images\/nome_tr\.png/g, '/images/volantino/nome_tr.png')
        return html
          .replace(/\{\{data\}\}/g, data)
          .replace(/\{\{cliente_nome\}\}/g, nome)
          .replace(/<img[^>]*nome_tr[^>]*>/gi, '')
      }
    } finally {
      await db.end()
    }
  } catch { /* fallback sotto */ }

  // Fallback hardcoded se il template non è ancora in DB
  return `<table style="width:100%;margin-bottom:14px;border-collapse:collapse;"><tr>` +
    `<td style="vertical-align:top;width:50%;"><img src="/images/volantino/rrr.png" alt="Logo" style="height:46px;margin-bottom:7px;display:block;"/>` +
    `<div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Digi Home Design S.r.l.</div>` +
    `<div style="font-size:10px;color:#555;line-height:1.55;margin-top:3px;">Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>info@digi-home-design.com</div></td>` +
    `<td style="vertical-align:top;text-align:right;width:50%;"></td></tr></table>` +
    `<hr style="border:none;border-top:2px solid #1a3a5c;margin:0 0 12px;"/>` +
    `<table style="width:100%;margin-bottom:12px;border-collapse:collapse;"><tr>` +
    `<td style="vertical-align:top;width:50%;"><div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Data</div>` +
    `<div style="font-size:12px;font-weight:bold;">${data}</div>` +
    `<div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:6px 0 2px;">Tipo</div>` +
    `<div style="font-size:12px;font-weight:bold;color:#1a3a5c;">Preventivo Provvisorio</div></td>` +
    `<td style="vertical-align:top;text-align:right;width:50%;"><div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">Spett.le</div>` +
    `<div style="font-size:13px;font-weight:bold;color:#1a3a5c;">${nome}</div></td></tr></table>` +
    `<div style="font-size:12px;margin-bottom:6px;"><strong>Oggetto:</strong> Preventivo provvisorio</div>` +
    `<div style="font-size:12px;margin-bottom:10px;line-height:1.6;">Gentile Cliente,<br/>vi trasmettiamo la nostra stima indicativa dei seguenti articoli:</div>` +
    `<div style="font-size:11px;margin-bottom:14px;padding:8px 12px;background:#f0f4fa;border-left:3px solid #1a3a5c;line-height:1.7;color:#444;">` +
    `<strong>Importante:</strong> Il presente preventivo è da intendersi come stima orientativa basata sui prezzi di listino correnti. ` +
    `I prezzi definitivi potranno variare a seguito di sopralluogo tecnico e rilevazione delle misure effettive.<br/>` +
    `Per confermare il preventivo e concordare un appuntamento si prega di contattare la nostra azienda ai recapiti sopra indicati.</div>`
}

// ─── HTML intestazione compatta (pagine successive) ───────────────────────────

function headerCompactHTML(data: string): string {
  return `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
  <img src="/images/volantino/rrr.png" alt="Logo" style="height:32px;display:block;"/>
  <div style="font-size:10px;color:#555;text-align:right;line-height:1.5;">
    <strong style="color:#1a3a5c;">Digi Home Design S.r.l.</strong> &nbsp;|&nbsp;
    Preventivo Provvisorio — ${data} &nbsp;|&nbsp; <em>continua</em>
  </div>
</div>
<hr style="border:none;border-top:1.5px solid #1a3a5c;margin:0 0 12px;"/>`
}

// ─── HTML piè di pagina ───────────────────────────────────────────────────────

function footerHTML(pageNum: number, totalPages: number): string {
  return `
<div style="flex-shrink:0;padding:5px 50px 12px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:8px;color:#aaa;line-height:1.5;box-sizing:border-box;">
  <span>Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</span>
  <span style="white-space:nowrap;font-weight:bold;color:#888;">Pag. ${pageNum} / ${totalPages}</span>
</div>`
}

// ─── Paginazione ──────────────────────────────────────────────────────────────

const PAGE_H     = 1123
const PAD_TOP    = 38
const PAD_BTM    = 56
const AVAIL      = PAGE_H - PAD_TOP - PAD_BTM

const H_HEADER1  = 280  // header provvisorio pagina 1 (più compatto del regolare)
const H_HEADER_N = 58
const H_EXTRA    = 76   // totale + avviso finale

type Block = { parent: ArtRow; children: ArtRow[] }

function buildPages(arts: ArtRow[], headerHtml: string, data: string, totale: string): string[] {
  // Raggruppa in blocchi parent+figli usando uid/parent_uid dal cookie
  const roots = arts.filter(a => a.parent_uid == null)
  const childrenMap = new Map<number, ArtRow[]>()
  for (const c of arts) {
    if (c.parent_uid == null) continue
    if (!childrenMap.has(c.parent_uid)) childrenMap.set(c.parent_uid, [])
    childrenMap.get(c.parent_uid)!.push(c)
  }
  const blocks: Block[] = roots.map(parent => ({
    parent,
    children: parent.uid != null ? (childrenMap.get(parent.uid) ?? []) : [],
  }))

  const buckets: Block[][] = []
  let remaining = [...blocks]

  while (remaining.length > 0) {
    const isFirst   = buckets.length === 0
    const headerH   = isFirst ? H_HEADER1 : H_HEADER_N
    const available = AVAIL - headerH

    let count = 0, used = 0
    for (const block of remaining) {
      const blockH  = estimaAltezzaBlock(block.children)
      const reserve = (count + 1 >= remaining.length) ? H_EXTRA : 0
      if (used + blockH + reserve > available) break
      used += blockH
      count++
    }
    if (count === 0) count = 1

    buckets.push(remaining.splice(0, count))
  }

  // Pagina extra per totale se non entra nell'ultima
  if (buckets.length > 0) {
    const last = buckets[buckets.length - 1]
    const hdr  = buckets.length === 1 ? H_HEADER1 : H_HEADER_N
    let used   = hdr
    for (const block of last) used += estimaAltezzaBlock(block.children)
    if (used + H_EXTRA > AVAIL) buckets.push([])
  }

  if (buckets.length === 0) buckets.push([])

  const totalPages = buckets.length

  return buckets.map((blockList, i) => {
    const isFirst = i === 0
    const isLast  = i === buckets.length - 1

    const header       = isFirst ? headerHtml : headerCompactHTML(data)
    const articlesHTML = blockList.map(b => articoloBlockHTML(b.parent, b.children, arts)).join('\n')

    const bottom = isLast ? `
      <div style="margin-top:12px;text-align:right;padding:8px 14px;background:#f0f4fa;border-radius:4px;">
        <div style="font-size:10px;color:#555;margin-bottom:2px;">Totale indicativo (prezzi di listino, escluso IVA)</div>
        <div style="font-size:20px;font-weight:bold;color:#1a3a5c;">€ ${totale}</div>
      </div>
    ` : ''

    return (
      `<div style="font-family:Arial,Helvetica,sans-serif;width:794px;height:${PAGE_H}px;` +
      `padding:0;background:#fff;box-sizing:border-box;overflow:hidden;` +
      `display:flex;flex-direction:column;">` +
      `<div style="flex:1;overflow:hidden;padding:${PAD_TOP}px 50px 12px;box-sizing:border-box;">` +
      header + articlesHTML + bottom +
      `</div>` +
      footerHTML(i + 1, totalPages) +
      `</div>`
    )
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  if (!digiCart) redirect('/area-clienti/carrello-preventivo')

  const cart = decompressCart(digiCart)
  if (cart.length === 0) redirect('/area-clienti/carrello-preventivo')

  const db = await getConnection()
  let arts: ArtRow[] = []
  let clienteNome = 'N/D'

  try {
    // Articoli dal listino
    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo, foto_url, profilo_frontale_mm, abbr FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; foto_url: string | null; profilo_frontale_mm: number | null; abbr: string | null }[], unknown]

    let rootIdx = 0
    arts = cart.map((item) => {
      const r = rows.find(x => x.id === item.id)
      if (!r) return null
      const isRoot = item.parent == null
      return {
        idx: isRoot ? rootIdx++ : 0,
        uid: item.uid,
        parent_uid: item.parent,
        categoria: r.categoria,
        produttore: r.produttore,
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: Number(r.prezzo_vendita),
        sconto_articolo: Number(r.sconto_articolo ?? 0),
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        foto_url: r.foto_url ?? '',
        profilo_mm: Number(r.profilo_frontale_mm ?? 0),
        abbr: r.abbr ?? '',
      }
    }).filter(x => x !== null) as ArtRow[]

    // Nome utente loggato
    if (username) {
      const [uRows] = await db.query(
        'SELECT email FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.query(
          'SELECT nome, cognome, ragione_sociale FROM clienti WHERE email = ? LIMIT 1', [email]
        ) as [{ nome: string; cognome: string; ragione_sociale: string }[], unknown]
        if (cRows[0]) {
          const c = cRows[0]
          clienteNome = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim() || username
        } else {
          clienteNome = username
        }
      } else {
        clienteNome = username
      }
    }
  } finally {
    await db.end()
  }

  if (arts.length === 0) redirect('/area-clienti/carrello-preventivo')

  const today      = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  const totale     = arts.reduce((s, a) => s + calcolaPrezzo(a, arts), 0).toFixed(2)
  const headerHtml = await getHeaderTemplate(today, clienteNome)
  const pages      = buildPages(arts, headerHtml, today, totale)

  return <StampaProvvisorioClient pages={pages} />
}
