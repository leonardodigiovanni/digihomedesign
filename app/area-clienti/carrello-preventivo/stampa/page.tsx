import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import StampaProvvisorioClient, { type StampaData, type StampaBlock } from './stampa-client'
import { decompressCart } from '@/lib/cart-cookie'
import { logPdfRequest } from '../actions'
import { extractAvgColor } from '@/lib/extract-color'
import { COND_PREV_OUTER_STYLE, COND_PREV_TITLE_HTML, condizioniPreventivoArticles } from '@/lib/templates/condizioni-preventivo'
import { COND_VEND_OUTER_STYLE, COND_VEND_TITLE_HTML, condizioniVenditaArticles } from '@/lib/templates/condizioni-vendita'
import { computeGlassGeometry } from '@/lib/disegno-infisso'
import { extractTcTa } from '@/lib/abbr-layout'
import { drawInfisso, adaptiveStroke, type DrawSink } from '@/lib/infisso-drawing'

export const metadata: Metadata = { title: 'Stampa Preventivo Provvisorio' }

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type ArtRow = {
  idx: number
  uid?: number
  parent_uid?: number
  categoria: string
  produttore: string
  serie: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  costante: number
  quantita: number
  larghezza_cm: number
  altezza_cm: number
  foto_url: string
  profilo_mm: number
  abbr: string
  richiede_larghezza?: number
  richiede_altezza?: number
  richiede_tipo_colore?: number
  richiede_tipo_colore_acc?: number
  richiede_tipo_vetro?: number
  richiede_tipo_montaggio?: number
  minimo: number | null
  trasmittanza_uw: number | null
  escluso?: number
}

export function calcolaPrezzo(a: ArtRow, allArts?: ArtRow[]): number {
  if (a.parent_uid != null && a.prezzo_vendita === 0 && a.sconto_articolo !== 0 && allArts) {
    const padre = allArts.find(x => x.uid === a.parent_uid)
    if (padre) return Math.round(-(calcolaPrezzo(padre, allArts) * a.sconto_articolo / 100) * 100) / 100
    return 0
  }
  const pb = a.prezzo_vendita
  const h  = a.altezza_cm  / 100
  const l  = a.larghezza_cm / 100
  const q  = a.quantita
  const costante = (a.parent_uid != null && allArts)
    ? (allArts.find(x => x.uid === a.parent_uid)?.costante || 1)
    : 1
  if (a.unita === 'm²') {
    const mq = a.parent_uid == null ? Math.max(h * l, a.minimo ?? 0) : h * l
    return Math.round(pb * mq * q * costante * 100) / 100
  }
  if (a.unita === 'ml') return Math.round(pb * l * q * costante * 100) / 100
  return Math.round(pb * q * 100) / 100
}

function fmt(n: number): string {
  const [int, dec] = n.toFixed(2).split('.')
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec
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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;flex-shrink:0;">
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="${profColor}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+outerH-frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  <line x1="${(outerX+outerW-frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lineColor}" stroke-width="1"/>
  ${parts.join('\n  ')}
</svg>`
}

function disegnoTcTa(isTa: boolean, larghezza: number, altezza: number, profiloMm = 80, barColor: string | null | undefined = null, content = '', barColorAcc?: string | null): string {
  const widthCm  = larghezza > 0 ? larghezza : 100
  const heightCm = altezza   > 0 ? altezza   : 150
  const FRAME_MAX = 130
  const ratio = widthCm / heightCm
  const outerW = ratio >= 1 ? FRAME_MAX : Math.max(8, Math.round(FRAME_MAX * ratio))
  const outerH = ratio >= 1 ? Math.max(8, Math.round(FRAME_MAX / ratio)) : FRAME_MAX
  const padTop = 4, padRight = 4, lmm = 20, bmm = 16
  const W = outerW + lmm + padRight
  const H = outerH + padTop + bmm
  const ox = lmm, oy = padTop
  const pxPerCmX = outerW / widthCm
  // Spessore in px: telaio (Tc/Ta + divisori T/P) = metà del profilo, ante/ribalta/vasistas = profilo intero.
  const mmToPx = (mm: number) => Math.round(Math.min(Math.max(4, (mm / 10) * pxPerCmX), outerW * 0.44))
  const pxTelaio = mmToPx(profiloMm / 2)
  const pxAnta = mmToPx(profiloMm)
  const fill = barColor ?? '#d8d4cc'
  const hwFill = barColorAcc ?? fill
  const stroke = adaptiveStroke(fill)
  // Fermavetro (fissi + interno delle ante/ribalte/vasistas): sempre 20mm, indipendente dal profilo.
  const fvPx = Math.max(2, (20 / 10) * pxPerCmX)
  // Il PDF è uno schema tecnico piatto, senza il concetto "sollevato da terra" della finestra
  // nell'anteprima a schermo: soglia sull'altezza propria, come per una porta a terra.
  const handleFromBottomCm = heightCm >= 200 ? 130 : 35

  const parts: string[] = []
  const f1 = (n: number) => n.toFixed(1)
  const sink: DrawSink = {
    rect: (x, y, w, h, o) => {
      const rx = o.rx != null ? ` rx="${f1(o.rx)}"` : ''
      parts.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${o.fill ?? 'none'}" stroke="${o.stroke ?? 'none'}" stroke-width="${o.strokeWidth ?? 1}" vector-effect="non-scaling-stroke"${rx}/>`)
    },
    polygon: (points, o) => {
      const pts = points.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ')
      parts.push(`<polygon points="${pts}" fill="${o.fill ?? 'none'}" stroke="${o.stroke ?? 'none'}"/>`)
    },
    line: (x1, y1, x2, y2, o) => {
      const dash = o?.dash ? ` stroke-dasharray="${o.dash}"` : ''
      parts.push(`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${o?.stroke ?? stroke}" stroke-width="${o?.strokeWidth ?? 1}"${dash} vector-effect="non-scaling-stroke"/>`)
    },
  }

  drawInfisso(sink, isTa, ox, oy, outerW, outerH, content, widthCm, heightCm, {
    fill, hwFill, stroke, pxTelaio, pxAnta, fvPx, pxPerCm: pxPerCmX, handleFromBottomCm,
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;flex-shrink:0;">
  ${parts.join('\n  ')}
  ${larghezza > 0 ? `<text x="${(ox+outerW/2).toFixed(1)}" y="${(oy+outerH+12).toFixed(1)}" text-anchor="middle" font-size="9" fill="#000" font-family="'Times New Roman',Times,serif">${larghezza} cm</text>` : ''}
  ${altezza > 0 ? `<text x="${(ox-10).toFixed(1)}" y="${(oy+outerH/2).toFixed(1)}" text-anchor="middle" font-size="9" fill="#000" font-family="'Times New Roman',Times,serif" transform="rotate(-90,${(ox-10).toFixed(1)},${(oy+outerH/2).toFixed(1)})">${altezza} cm</text>` : ''}
</svg>`
}

function disegnoSVGAbbr(abbr: string, larghezza: number, altezza: number, profiloMm = 70, barColor?: string | null, barColorAcc?: string | null): string {
  const tcTa = extractTcTa(abbr)
  if (tcTa) {
    return disegnoTcTa(tcTa.isTa, larghezza, altezza, profiloMm || 80, barColor, tcTa.content, barColorAcc)
  }

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

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin:0 auto;flex-shrink:0;">
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="${profColor}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+outerH-frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  <line x1="${(outerX+outerW-frameT_X).toFixed(1)}" y1="${(outerY+frameT_Y).toFixed(1)}" x2="${(outerX+outerW-frameT_X).toFixed(1)}" y2="${(outerY+outerH-frameT_Y).toFixed(1)}" stroke="${lc}" stroke-width="1"/>
  ${parts.join('\n  ')}
  ${larghezza > 0 ? `<text x="${(outerX+outerW/2).toFixed(1)}" y="${(outerY+outerH+12).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lc}" font-family="'Times New Roman',Times,serif">${larghezza} cm</text>` : ''}
  ${altezza > 0 ? `<text x="${(outerX-10).toFixed(1)}" y="${(outerY+outerH/2).toFixed(1)}" text-anchor="middle" font-size="9" fill="${lc}" font-family="'Times New Roman',Times,serif" transform="rotate(-90,${(outerX-10).toFixed(1)},${(outerY+outerH/2).toFixed(1)})">${altezza} cm</text>` : ''}
</svg>`
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
    const label = c.descrizione || ''
    const isIncluso = contrib === 0 && (c.sconto_articolo ?? 0) !== 100
    const prezzoHtml = isIncluso
      ? `<div style="font-size:10.5px;font-style:italic;color:#555;white-space:nowrap;">Incluso</div>`
      : `<div style="font-size:10.5px;font-weight:bold;color:#111;white-space:nowrap;">${contrib >= 0 ? '+' : '−'}€ ${fmt(Math.abs(contrib))}</div>`
    return `<div style="display:flex;align-items:center;gap:8px;padding:2px 0;border-bottom:1px solid #ececec;">
      <div style="width:80px;height:56px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        ${fotoUrl
          ? `<div style="position:relative;width:80px;height:56px;"><img src="${fotoAttr}" alt="" style="max-width:80px;max-height:56px;object-fit:contain;display:block;border:1px solid #888;${c.escluso === 1 ? 'opacity:0.4;' : ''}"/>${c.escluso === 1 ? `<img src="/images/app/escluso.webp" alt="ESCLUSO" style="position:absolute;top:-20%;left:-20%;width:140%;height:140%;object-fit:contain;pointer-events:none;"/>` : ''}</div>`
          : `<div style="width:80px;height:56px;background:#ececec;border-radius:2px;"></div>`}
      </div>
      <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">${label || 'Caratteristica'}</div>
      ${prezzoHtml}
    </div>`
  }).join('\n')

  const caratHeader = children.length > 0
    ? `<div style="font-size:9px;font-weight:bold;color:#999;text-transform:uppercase;letter-spacing:.05em;margin-top:3px;margin-bottom:2px;">Caratteristiche/composizione</div>`
    : ''

  return `<div style="border-top:1px solid #d0d0d0;background:#f5f5f5;padding:4px 10px 5px;">
  <div style="display:flex;align-items:center;gap:8px;padding:2px 0;border-bottom:1px solid #ececec;">
    <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">Subtotale indicativo</div>
    <div style="font-size:10.5px;font-weight:bold;color:#111;white-space:nowrap;">€ ${fmt(parentPrezzo)}</div>
  </div>
  ${caratHeader}
  ${righeCaratt}
  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:bold;color:#111;border-top:1px solid #c8d4e8;padding-top:3px;margin-top:3px;">
    <span>Totale Articolo Rif#${String(parentIdx + 1).padStart(3, '0')}:</span><span>€ ${fmt(totaleBlocco)}</span>
  </div>
</div>`
}

function caratteristichePreviewHTML(children: ArtRow[], allArts: ArtRow[], parentPrezzo: number, maxN: number): string {
  const shown = children.slice(0, maxN)
  const righe = shown.map(c => {
    const contrib = calcolaPrezzo(c, allArts)
    const fotoRaw = (c.foto_url ?? '').trim()
    const fotoUrl = fotoRaw
      ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw.replace(/^\/+/, '')}`)
      : ''
    const fotoAttr = fotoUrl.replace(/"/g, '%22')
    const label = c.descrizione || ''
    const isIncluso = contrib === 0 && (c.sconto_articolo ?? 0) !== 100
    const prezzoHtml = isIncluso
      ? `<div style="font-size:10.5px;font-style:italic;color:#555;white-space:nowrap;">Incluso</div>`
      : `<div style="font-size:10.5px;font-weight:bold;color:#111;white-space:nowrap;">${contrib >= 0 ? '+' : '−'}€ ${fmt(Math.abs(contrib))}</div>`
    return `<div style="display:flex;align-items:center;gap:8px;padding:2px 0;border-bottom:1px solid #ececec;">
      <div style="width:80px;height:56px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        ${fotoUrl
          ? `<div style="position:relative;width:80px;height:56px;"><img src="${fotoAttr}" alt="" style="max-width:80px;max-height:56px;object-fit:contain;display:block;border:1px solid #888;${c.escluso === 1 ? 'opacity:0.4;' : ''}"/>${c.escluso === 1 ? `<img src="/images/app/escluso.webp" alt="ESCLUSO" style="position:absolute;top:-20%;left:-20%;width:140%;height:140%;object-fit:contain;pointer-events:none;"/>` : ''}</div>`
          : `<div style="width:80px;height:56px;background:#ececec;border-radius:2px;"></div>`}
      </div>
      <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">${label || 'Caratteristica'}</div>
      ${prezzoHtml}
    </div>`
  }).join('\n')
  return `<div style="border-top:1px solid #d0d0d0;background:#f5f5f5;padding:4px 10px 5px;">
  <div style="display:flex;align-items:center;gap:8px;padding:2px 0;border-bottom:1px solid #ececec;">
    <div style="flex:1;font-size:10.5px;color:#333;line-height:1.4;">Subtotale indicativo</div>
    <div style="font-size:10.5px;font-weight:bold;color:#111;white-space:nowrap;">€ ${fmt(parentPrezzo)}</div>
  </div>
  <div style="font-size:9px;font-weight:bold;color:#999;text-transform:uppercase;letter-spacing:.05em;margin-top:3px;margin-bottom:2px;">Caratteristiche/composizione</div>
  ${righe}
  ${children.length > maxN ? `<div style="font-size:9px;color:#999;font-style:italic;margin-top:4px;">continua nella pagina successiva…</div>` : ''}
</div>`
}

// ─── HTML blocco articolo principale + caratteristiche ────────────────────────

function articoloBlockHTML(parent: ArtRow, children: ArtRow[], allArts: ArtRow[], barColor?: string | null, barColorAcc?: string | null, onlyMain = false): string {
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
    `<span style="color:#555;">Prezzo unit.:</span> ${subtotale === 0 && parent.sconto_articolo !== 100 ? '<span style="color:#c77700;font-style:italic;">Da definire</span>' : subtotale === 0 && parent.sconto_articolo === 100 ? '<span style="color:#2e7d32;font-style:italic;">Omaggio</span>' : `€ ${fmt(Number(parent.prezzo_vendita))}`}`,
    `<span style="color:#555;">Quantità:</span> ${parent.quantita}`,
  ]

  const Uf = parent.trasmittanza_uw
  const vetroChild = children.find(c => {
    const s = (c.categoria + ' ' + c.descrizione).toLowerCase()
    return s.includes('vetro') || s.includes('glass')
  })
  const Ug = vetroChild?.trasmittanza_uw ?? null
  let uwDisplay = '—'
  if (Uf != null && Ug != null && parent.larghezza_cm > 0 && parent.altezza_cm > 0 && parent.abbr) {
    const geo = computeGlassGeometry(parent.abbr, parent.larghezza_cm, parent.altezza_cm, profiloMm)
    if (geo) {
      const Aw = parent.larghezza_cm * parent.altezza_cm / 10000
      const Uw = (Ug * geo.Ag + Uf * (Aw - geo.Ag) + 0.05 * geo.Lg) / Aw
      uwDisplay = Uw.toFixed(2).replace('.', ',')
    }
  }

  return `<div style="border:1px solid #d0d0d0;border-radius:4px;margin-bottom:6px;overflow:hidden;page-break-inside:avoid;break-inside:avoid;">
  <div style="background:#111;color:#fff;padding:3px 12px;font-size:11px;font-weight:bold;letter-spacing:.05em;">
    Rif#${String(parent.idx + 1).padStart(3, '0')} &nbsp; ${[String(parent.categoria||''), String(parent.produttore||''), String(parent.serie||'')].filter(Boolean).join(' · ').toUpperCase()}
  </div>
  <div style="display:flex;">
    <div style="flex:1;padding:5px 10px;font-size:11.5px;line-height:1.5;display:flex;flex-direction:column;">
      <div style="flex:1;">${righe.join('<br/>')}</div>
      ${parent.abbr ? `<div style="margin-top:4px;padding-top:4px;border-top:1px solid #e8e8e8;font-size:10px;color:#444;">
        Trasmittanza Termica: <strong>${uwDisplay}</strong> W/(m²·K)
      </div>` : ''}
    </div>
    ${parent.abbr ? `<div style="width:170px;flex-shrink:0;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fafafa;">
      ${disegnoSVGAbbr(parent.abbr, parent.larghezza_cm, parent.altezza_cm, profiloMm, barColor, barColorAcc)}
    </div>` : ''}
    ${fotoUrl ? `<div style="width:156px;flex-shrink:0;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      <div style="position:relative;width:100%;height:124px;display:flex;align-items:center;justify-content:center;">
        <img src="${fotoAttr}" alt="Foto" style="display:block;max-width:100%;max-height:124px;object-fit:contain;margin:0 auto;${parent.escluso === 1 ? 'opacity:0.4;' : ''}" />
        ${parent.escluso === 1 ? `<img src="/images/app/escluso.webp" alt="ESCLUSO" style="position:absolute;top:-20%;left:-20%;width:140%;height:140%;object-fit:contain;pointer-events:none;"/>` : ''}
      </div>
    </div>` : `<div style="width:156px;flex-shrink:0;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      <div style="font-size:10px;color:#b0b0b0;text-align:center;">Nessuna immagine<br/>scheda tecnica</div>
    </div>`}
  </div>
  ${onlyMain ? (children.length > 0 ? caratteristichePreviewHTML(children, allArts, subtotale, 2) : '') : caratteristicheHTML(children, allArts, subtotale, parent.idx)}
</div>`
}


function riepilogoHTML(roots: ArtRow[], totale: string, hasDaDefinire = false): string {
  const rows = roots.map(r => {
    const dims = r.larghezza_cm > 0 && r.altezza_cm > 0 ? `${r.larghezza_cm}×${r.altezza_cm} cm` : '—'
    return `<tr>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;text-align:center;">Rif#${String(r.idx + 1).padStart(3, '0')}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;">${r.categoria}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;">${r.produttore}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;">${r.serie}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;">${r.descrizione}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;text-align:center;white-space:nowrap;">${dims}</td>
      <td style="padding:3px 8px;border:1px solid #ddd;font-size:10px;text-align:center;">${r.quantita}</td>
    </tr>`
  }).join('\n')
  return `<div style="font-size:12px;color:#333;line-height:1.4;margin-top:14px;margin-bottom:14px;text-align:justify;">
  <div style="margin-bottom:4px;">Gentile Cliente,</div>
  <div style="margin-bottom:6px;">siamo lieti di poterLe sottoporre la nostra migliore offerta e desideriamo innanzitutto ringraziarLa per aver scelto di affidarsi a noi.</div>
  <div style="margin-bottom:6px;">Per la nostra azienda ogni nuovo cliente rappresenta molto più di una semplice collaborazione commerciale: rappresenta un rapporto di fiducia che desideriamo costruire nel tempo, con serietà, qualità e attenzione costante alle Sue esigenze.</div>
  <div style="margin-bottom:6px;">Operiamo con professionalità e passione, selezionando prodotti innovativi e soluzioni all'avanguardia, studiati per garantire affidabilità, comfort, durata nel tempo ed efficienza energetica. Ci avvaliamo infatti di tecnologie e materiali sempre più evoluti sotto il profilo termodinamico ed energetico, con l'obiettivo di offrire un concreto risparmio nei consumi e, allo stesso tempo, contribuire al rispetto dell'ambiente.</div>
  <div style="margin-bottom:4px;">Scegliere la nostra azienda significa poter contare su:</div>
  <div style="margin-left:12px;margin-bottom:3px;">• prodotti di qualità certificata e sempre aggiornati;</div>
  <div style="margin-left:12px;margin-bottom:3px;">• installazioni eseguite a regola d'arte;</div>
  <div style="margin-left:12px;margin-bottom:3px;">• assistenza e consulenza personalizzata;</div>
  <div style="margin-left:12px;margin-bottom:3px;">• attenzione reale ai bisogni del cliente;</div>
  <div style="margin-left:12px;margin-bottom:3px;">• prezzi equi, trasparenti e competitivi;</div>
  <div style="margin-left:12px;margin-bottom:8px;">• soluzioni studiate per garantire il miglior rapporto qualità/prezzo.</div>
  <div style="margin-bottom:6px;">Per noi il cliente è al centro di ogni progetto.</div>
  <div style="margin-bottom:6px;">Per questo motivo, entrando a far parte della nostra rete clienti, Le verrà assegnato un codice referral personale che Le consentirà di accedere a vantaggi esclusivi, premi fedeltà, offerte promozionali dedicate e iniziative riservate.</div>
  <div style="margin-bottom:6px;">Il nostro impegno è quello di accompagnarLa nel tempo con professionalità, disponibilità e proposte sempre innovative, affinché possa sentirsi seguito e valorizzato in ogni fase della collaborazione.</div>
  <div style="margin-bottom:14px;">Con piacere, di seguito Le sottoponiamo l'elenco degli articoli e delle soluzioni da Lei richieste nella presente offerta economica, da intendersi IVA esclusa.</div>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:12px;page-break-inside:avoid;break-inside:avoid;">
  <thead>
    <tr style="background:#f0f0f0;">
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;width:28px;">Rif.</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:left;">Categoria</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:left;">Marca</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:left;">Serie/Modello</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:left;">Descrizione articolo</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;">L×H</th>
      <th style="padding:4px 8px;border:1px solid #ddd;font-size:10px;">Qtà</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>
${totaleNoteHtml(totale, hasDaDefinire)}
<div style="font-size:12px;color:#333;line-height:1.6;margin-top:10px;margin-bottom:6px;">
  <div style="margin-bottom:2px;">Restando a Sua completa disposizione per qualsiasi chiarimento o approfondimento, porgiamo</div>
  <div style="font-weight:bold;">Cordiali saluti</div>
  <img src="/images/carrello/sigla.webp" style="height:90px;display:block;margin-top:-20px;" />
</div>
<div style="position:absolute;bottom:${PAD_BOT}px;left:${PAD_SIDE}px;right:${PAD_SIDE}px;">
  <div style="font-size:10px;padding:6px 12px;background:#f5f5f5;border:1px solid #ddd;line-height:1.5;color:#555;">
    <div style="font-weight:bold;margin-bottom:3px;">Note:</div>
    <div style="margin-bottom:3px;">– Per ogni articolo in elenco è fornita una scheda di dettaglio delle caratteristiche tecniche e specifiche di acquisto nel seguito del documento.</div>
    <div style="margin-bottom:3px;">– I prezzi indicati sono a listino e potrebbero variare nel preventivo ufficiale in base alle dimensioni effettive e al sopralluogo tecnico.</div>
    <div>– Salvo accordi integrativi scritti e firmati tra le parti si fa riferimento alle condizioni generali di preventivo (<a href="https://www.digi-home-design.com/docs/condizioni-generali-del-preventivo.pdf" style="color:#555;">www.digi-home-design.com/docs/condizioni-generali-del-preventivo.pdf</a>) e di vendita (<a href="https://www.digi-home-design.com/docs/condizioni-generali-di-vendita.pdf" style="color:#555;">www.digi-home-design.com/docs/condizioni-generali-di-vendita.pdf</a>), riportate nel seguito del documento.</div>
  </div>
</div>
`
}

function caratteristicheWrapperHTML(children: ArtRow[], allArts: ArtRow[], subtotale: number, parentIdx: number, parentCategoria: string): string {
  return `<div style="border:1px solid #d0d0d0;border-radius:4px;margin-bottom:10px;overflow:hidden;page-break-inside:avoid;break-inside:avoid;">
  <div style="background:#444;color:#fff;padding:4px 12px;font-size:10px;">
    ↳ Continua — Rif#${String(parentIdx + 1).padStart(3, '0')} ${parentCategoria.toUpperCase()}
  </div>
  ${caratteristicheHTML(children, allArts, subtotale, parentIdx)}
</div>`
}


// ─── Costanti layout pagina A4 ───────────────────────────────────────────────

const PAGE_W    = 794
const PAGE_H    = 1123
const PAD_TOP   = 32
const PAD_SIDE  = 50
const PAD_BOT   = 54

function header1Html(data: string, numero: string, clienteNome: string, clienteIndirizzo: string): string {
  return `<div style="background:#111;margin:-${PAD_TOP}px -${PAD_SIDE}px 16px;padding:14px ${PAD_SIDE}px;display:flex;align-items:center;">
  <div style="flex:1;">
    <div style="font-size:17px;font-weight:bold;color:#fff;">DIGI Home Design S.R.L.</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.72);line-height:1.7;">URL: www.digi-home-design.com</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.72);line-height:1.7;">Email: info@digi-home-design.com</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.72);line-height:1.7;">Tel: +39 351 871 6731</div>
  </div>
  <div style="flex:1;display:flex;justify-content:center;">
    <img src="/images/header/DIGIHOMEDESIGN.webp" alt="Logo" style="height:70px;object-fit:contain;display:block;"/>
  </div>
  <div style="flex:1;"></div>
</div>
<div style="display:flex;gap:24px;margin-bottom:12px;">
  <div>
    <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;">Data</div>
    <div style="font-size:12px;font-weight:bold;">${data}</div>
  </div>
  <div>
    <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;">N. Preventivo</div>
    <div style="font-size:12px;font-weight:bold;">${numero}</div>
  </div>
  <div style="flex:1;">
    <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;">Cliente</div>
    <div style="font-size:12px;font-weight:bold;">${clienteNome || 'N/D'}</div>
    ${clienteIndirizzo ? `<div style="font-size:10px;color:#555;">${clienteIndirizzo}</div>` : ''}
  </div>
</div>
<div style="font-size:12px;font-weight:bold;margin-bottom:6px;">Oggetto: Preventivo Provvisorio</div>
`
}

function headerNHtml(numero: string): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #1a3a5c;">
  <div style="font-size:14px;font-weight:bold;color:#111;">DIGI Home Design S.R.L.</div>
  <div style="font-size:10px;color:#666;">Preventivo Provvisorio ${numero}</div>
</div>`
}

function footerTemplateHtml(): string {
  return `<div style="position:absolute;bottom:16px;left:${PAD_SIDE}px;right:${PAD_SIDE}px;border-top:1px solid #ddd;padding-top:6px;font-size:9px;color:#999;display:flex;justify-content:space-between;line-height:1.4;">
  <span>DIGI Home Design S.R.L. — Sede: Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA: 07407080824 — PEC: digi_home_design_srl@namirialpec.it — Cap.Soc. €1 I.V.</span>
  <span style="white-space:nowrap;margin-left:12px;">Pagina {{PAGE}} di {{TOTAL}}</span>
</div>`
}

function totaleNoteHtml(totale: string, hasDaDefinire = false): string {
  return `<div style="text-align:right;margin-top:8px;padding:7px 12px;background:#f5f5f5;border:1px solid #ddd;">
  <div style="font-size:10px;color:#555;margin-bottom:2px;">Totale offerta (escluso IVA)</div>
  <div style="font-size:20px;font-weight:bold;color:#111;">€ ${fmt(parseFloat(totale))}</div>
  ${hasDaDefinire ? `<div style="text-align:right;font-size:11px;color:#c77700;font-style:italic;margin-top:2px;">+ Prezzi da definire</div>` : ''}
</div>`
}

function accettazioneHtml(): string {
  return `<div style="margin-top:8px;padding-top:8px;font-size:12px;line-height:1.4;color:#222;font-family:'Times New Roman',Times,serif;">
  <div style="margin-bottom:12px;padding:8px 12px;border:1px solid #e53e3e;border-radius:4px;color:#c00;font-size:11px;font-weight:600;line-height:1.5;text-align:justify;text-transform:uppercase;">Questo preventivo è provvisorio e non può essere accettato.<br/>A titolo esemplificativo le proponiamo lo schema di accettazione nel futuro preventivo ufficiale.</div>
  <div style="font-size:11px;font-weight:bold;text-align:center;text-decoration:underline;letter-spacing:.04em;margin-bottom:8px;">ACCETTAZIONE</div>
  <div style="margin-bottom:3px;">Con l'accettazione del preventivo ufficiale il Cliente dichiara:</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di aver letto integralmente l'elenco degli articoli;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di aver letto integralmente il dettaglio caratteristiche e specifiche dei singoli articoli;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di aver letto integralmente il totale dell'offerta;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di aver letto integralmente le presenti Condizioni Generali di Preventivo;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di aver letto integralmente le presenti Condizioni Generali di Vendita;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• di comprenderne il contenuto;</div>
  <div style="margin-left:12px;margin-bottom:8px;">• di accettarle senza riserva alcuna.</div>
  <div style="margin-bottom:3px;">Per accettazione restituire il preventivo ufficiale firmato con una delle seguenti modalità:</div>
  <div style="margin-left:12px;margin-bottom:2px;">• copia cartacea con firma autografa;</div>
  <div style="margin-left:12px;margin-bottom:2px;">• file PDF firmato digitalmente;</div>
  <div style="margin-left:12px;margin-bottom:12px;">• procedura di Firma Elettronica Avanzata con OTP dall'area personale del sito.</div>
  <div style="display:flex;justify-content:space-between;font-size:12px;color:#333;margin-top:24px;">
    <div>Luogo e data, ________________,___________</div>
    <div style="position:relative;">PER ACCETTAZIONE ________________________________________________<img src="/images/app/NO-SIGN-TRASP.webp" style="position:absolute;bottom:0;left:62%;transform:translateX(-50%);width:130px;opacity:0.85;pointer-events:none;" /></div>
  </div>
</div>`
}

// ─── Costruzione dati stampa ──────────────────────────────────────────────────

export async function buildStampaData(opts: {
  arts: ArtRow[]
  totale: string
  data: string
  numero: string
  clienteNome: string
  clienteIndirizzo: string
}): Promise<StampaData> {
  const { arts, totale, data, numero, clienteNome, clienteIndirizzo } = opts

  const roots = arts.filter(a => a.parent_uid == null)
  const childrenMap = new Map<number, ArtRow[]>()
  for (const c of arts) {
    if (c.parent_uid == null) continue
    if (!childrenMap.has(c.parent_uid)) childrenMap.set(c.parent_uid, [])
    childrenMap.get(c.parent_uid)!.push(c)
  }

  const colorMap    = new Map<number, string>()
  const colorAccMap = new Map<number, string>()
  await Promise.all(roots.map(async p => {
    if (!extractTcTa(p.abbr ?? '')) return
    if (p.uid == null) return
    const children = childrenMap.get(p.uid) ?? []
    const notAcc = (c: ArtRow) => (c.richiede_tipo_colore_acc ?? 0) !== 1
    const coloreChild =
      children.find(c => notAcc(c) && (/color/i.test(c.categoria) || /color/i.test(c.descrizione))) ??
      children.find(c => notAcc(c) && !!c.foto_url)
    if (coloreChild?.foto_url) {
      const fotoRaw = coloreChild.foto_url.trim()
      const fotoUrl = fotoRaw.startsWith('http') || fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`
      const hex = await extractAvgColor(fotoUrl)
      if (hex) colorMap.set(p.uid, hex)
    }
    const coloreAccChild = children.find(c => (c.richiede_tipo_colore_acc ?? 0) === 1 && !!c.foto_url)
    if (coloreAccChild?.foto_url) {
      const fotoRaw = coloreAccChild.foto_url.trim()
      const fotoUrl = fotoRaw.startsWith('http') || fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`
      const hex = await extractAvgColor(fotoUrl)
      if (hex) colorAccMap.set(p.uid, hex)
    }
  }))

  const childTypeOrder = (c: ArtRow) => {
    if ((c.richiede_tipo_colore     ?? 0) === 1) return 0
    if ((c.richiede_tipo_colore_acc ?? 0) === 1) return 1
    if ((c.richiede_tipo_vetro      ?? 0) === 1) return 2
    if ((c.richiede_tipo_montaggio  ?? 0) === 1) return 3
    return 4
  }

  const hasArticoliDaDefinire = roots.some(p => calcolaPrezzo(p, arts) === 0 && p.sconto_articolo !== 100)

  const blocks: StampaBlock[] = []

  blocks.push({ html: riepilogoHTML(roots, totale, hasArticoliDaDefinire) })
  blocks.push({ html: `<div style="font-size:11px;font-weight:bold;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #ddd;">DETTAGLIO FORNITURA:</div>`, forceNewPage: true })

  for (const p of roots) {
    const children = (p.uid != null ? (childrenMap.get(p.uid) ?? []) : []).slice().sort((a, b) => childTypeOrder(a) - childTypeOrder(b))
    const barColor    = p.uid != null ? colorMap.get(p.uid)    : undefined
    const barColorAcc = p.uid != null ? colorAccMap.get(p.uid) : undefined
    const htmlFull = articoloBlockHTML(p, children, arts, barColor, barColorAcc, false)
    if (children.length === 0) {
      blocks.push({ html: htmlFull })
    } else {
      const htmlMain   = articoloBlockHTML(p, children, arts, barColor, barColorAcc, true)
      const subtotale  = calcolaPrezzo(p, arts)
      const htmlCaratt = caratteristicheWrapperHTML(children, arts, subtotale, p.idx, p.categoria)
      blocks.push({ html: htmlFull, htmlMain, htmlCaratt })
    }
  }

  blocks.push({ html: totaleNoteHtml(totale, hasArticoliDaDefinire) })

  const prevArts = condizioniPreventivoArticles()
  const prevMid  = 9
  blocks.push({ html: `<div style="${COND_PREV_OUTER_STYLE}"><div style="margin-top:10px;">${COND_PREV_TITLE_HTML}</div><div style="display:flex;gap:20px;align-items:stretch;"><div style="flex:1;min-width:0;border-right:1px solid #ccc;padding-right:20px;margin-bottom:10px;">${prevArts.slice(0, prevMid).join('\n')}</div><div style="flex:1;min-width:0;">${prevArts.slice(prevMid).join('\n')}</div></div></div>` })

  const vendArts = condizioniVenditaArticles()
  const vendMid  = 6
  blocks.push({ html: `<div style="${COND_VEND_OUTER_STYLE}"><div style="margin-top:10px;">${COND_VEND_TITLE_HTML}</div><div style="display:flex;gap:20px;align-items:stretch;"><div style="flex:1;min-width:0;border-right:1px solid #ccc;padding-right:20px;margin-bottom:10px;">${vendArts.slice(0, vendMid).join('\n')}</div><div style="flex:1;min-width:0;">${vendArts.slice(vendMid).join('\n')}</div></div></div>` })

  blocks.push({ html: accettazioneHtml() })

  return {
    blocks,
    header1: header1Html(data, numero, clienteNome, clienteIndirizzo),
    headerN: headerNHtml(numero),
    footerTemplate: footerTemplateHtml(),
    layout: { pageW: PAGE_W, pageH: PAGE_H, padTop: PAD_TOP, padSide: PAD_SIDE, padBot: PAD_BOT },
  }
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  if (!digiCart) redirect('/area-clienti/carrello-preventivo')

  const cart = decompressCart(digiCart)
  if (cart.length === 0) redirect('/area-clienti/carrello-preventivo')

  const db = await getConnection()
  let arts: ArtRow[] = []
  let clienteNome = 'N/D'
  let clienteIndirizzo = ''

  try {
    // Articoli dal listino
    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, serie, descrizione, unita, prezzo_vendita, sconto_articolo, costante, foto_url, profilo_frontale_mm, abbr, richiede_larghezza, richiede_altezza, richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio, trasmittanza_uw, minimo, escluso FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; serie: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; costante: number; foto_url: string | null; profilo_frontale_mm: number | null; abbr: string | null; richiede_larghezza: number | null; richiede_altezza: number | null; richiede_tipo_colore: number | null; richiede_tipo_colore_acc: number | null; richiede_tipo_vetro: number | null; richiede_tipo_montaggio: number | null; minimo: number | null; trasmittanza_uw: number | null; escluso: number | null }[], unknown]

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
        serie: r.serie ?? '',
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: Number(r.prezzo_vendita),
        sconto_articolo: Number(r.sconto_articolo ?? 0),
        costante: Number(r.costante ?? 0),
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        foto_url: r.foto_url ?? '',
        profilo_mm: Number(r.profilo_frontale_mm ?? 0),
        abbr: r.abbr ?? '',
        richiede_larghezza:       Number(r.richiede_larghezza       ?? 0),
        richiede_altezza:         Number(r.richiede_altezza         ?? 0),
        richiede_tipo_colore:     Number(r.richiede_tipo_colore     ?? 0),
        richiede_tipo_colore_acc: Number(r.richiede_tipo_colore_acc ?? 0),
        richiede_tipo_vetro:      Number(r.richiede_tipo_vetro      ?? 0),
        richiede_tipo_montaggio:  Number(r.richiede_tipo_montaggio  ?? 0),
        minimo: r.minimo != null ? Number(r.minimo) : null,
        trasmittanza_uw: r.trasmittanza_uw != null ? Number(r.trasmittanza_uw) : null,
        escluso: Number(r.escluso ?? 0),
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
          'SELECT nome, cognome, ragione_sociale, indirizzo FROM clienti WHERE email = ? LIMIT 1', [email]
        ) as [{ nome: string; cognome: string; ragione_sociale: string; indirizzo: string }[], unknown]
        if (cRows[0]) {
          const c = cRows[0]
          clienteNome = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim() || username
          clienteIndirizzo = String(c.indirizzo || '').trim()
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

  try {
    await logPdfRequest(arts.map(a => ({
      categoria: a.categoria,
      produttore: a.produttore,
      descrizione: a.descrizione,
      unita: a.unita,
      prezzo_vendita: a.prezzo_vendita,
      quantita: a.quantita,
      sconto_articolo: a.sconto_articolo,
      tipo: a.parent_uid != null ? 'caratteristica' : 'articolo',
    })))
  } catch {}

  const today  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  const totale = arts.reduce((s, a) => s + calcolaPrezzo(a, arts), 0).toFixed(2)
  const now    = new Date()
  const numero = `PP-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`

  const stampaData = await buildStampaData({ arts, totale, data: today, numero, clienteNome, clienteIndirizzo })

  return <StampaProvvisorioClient data={stampaData} />
}
