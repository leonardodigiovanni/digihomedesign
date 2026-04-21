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

// ─── HTML singolo articolo ────────────────────────────────────────────────────
function articoloHTML(a: Record<string, unknown>, idx: number): string {
  const tipo    = String(a.tipo_prodotto ?? '')
  const marca   = String(a.marca ?? '')
  const modello = String(a.modello ?? '')
  const colore  = String(a.colore ?? '')
  const vetro   = String(a.tipo_vetro ?? '')
  const acc     = String(a.accessori ?? '')
  const h       = Number(a.altezza_cm)
  const l       = Number(a.larghezza_cm)
  const anteRaw = Number(a.n_ante)
  const ante    = anteRaw >= 2 ? anteRaw : 2
  const qtà     = Number(a.quantita)
  const prezzo  = Number(a.prezzo_totale)
  const fotoRaw = String(a.foto_url ?? '').trim()
  const fotoUrl = fotoRaw
    ? (fotoRaw.startsWith('http://') || fotoRaw.startsWith('https://') || fotoRaw.startsWith('/')
        ? fotoRaw
        : `/${fotoRaw.replace(/^\/+/, '')}`)
    : ''
  const fotoAttr = fotoUrl.replace(/"/g, '%22')

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
      <div style="margin-top:6px;font-size:13px;font-weight:bold;color:#1a3a5c;">
        Prezzo: € ${prezzo > 0 ? prezzo.toFixed(2) : '—'}
      </div>
    </div>
    <div style="width:156px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fcfcfc;">
      ${fotoUrl
        ? `<img src="${fotoAttr}" alt="Scheda tecnica" style="display:block;max-width:100%;max-height:124px;object-fit:contain;margin:0 auto;" />`
        : `<div style="font-size:10px;color:#b0b0b0;text-align:center;">Nessuna immagine<br/>scheda tecnica</div>`}
    </div>
    <div style="width:170px;border-left:1px solid #e0e0e0;padding:6px;display:flex;align-items:center;justify-content:center;background:#fafafa;">
      ${disegnoSVG(l, h, ante, Number(a.profilo_mm) > 0 ? Number(a.profilo_mm) : 70)}
    </div>
  </div>
</div>`
}

// ─── Stima altezza articolo in px (per paginazione) ───────────────────────────
function estimaAltezzaArticolo(a: Record<string, unknown>): number {
  let lines = 1 // quantità
  if (String(a.marca ?? '') || String(a.modello ?? '')) lines++
  if (String(a.colore ?? '')) lines++
  if (Number(a.altezza_cm) > 0 || Number(a.larghezza_cm) > 0) lines++
  if ((Number(a.n_ante) || 1) > 1) lines++
  if (String(a.tipo_vetro ?? '')) lines++
  if (String(a.accessori ?? '')) lines++
  lines++ // prezzo

  const lineH    = 11.5 * 1.75        // font-size * line-height ≈ 20px
  const textH    = 16 + lines * lineH + 6 + 16  // pad-top + lines + gap + price
  const { H: svgH } = computeSVGDims(Number(a.larghezza_cm), Number(a.altezza_cm))
  const mediaH = Math.max(svgH + 16, 136) // colonna scheda + colonna disegno
  const cardBody = Math.max(textH, mediaH)
  const headerBar = 23                // 5+5 padding + 11px text line
  return headerBar + cardBody + 10    // + margin-bottom
}

// ─── HTML intestazione completa (pagina 1) ────────────────────────────────────
function headerFullHTML(data: string, numero: string, nome: string, indirizzo: string): string {
  return `
<table style="width:100%;margin-bottom:14px;border-collapse:collapse;">
  <tr>
    <td style="vertical-align:top;width:50%;">
      <img src="/images/dg-t.png" alt="Logo" style="height:46px;margin-bottom:7px;display:block;"/>
      <div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Digi Home Design S.r.l.</div>
      <div style="font-size:10px;color:#555;line-height:1.55;margin-top:3px;">
        Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>
        P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>
        info@digi-home-design.com
      </div>
    </td>
    <td style="vertical-align:top;text-align:right;width:50%;">
      <img src="/images/nome_tr.png" alt="Logo 2" style="height:46px;"/>
    </td>
  </tr>
</table>
<hr style="border:none;border-top:2px solid #1a3a5c;margin:0 0 12px;"/>
<table style="width:100%;margin-bottom:12px;border-collapse:collapse;">
  <tr>
    <td style="vertical-align:top;width:50%;">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Data</div>
      <div style="font-size:12px;font-weight:bold;">${data}</div>
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:6px 0 2px;">Rif. N°</div>
      <div style="font-size:12px;font-weight:bold;">${numero}</div>
    </td>
    <td style="vertical-align:top;text-align:right;width:50%;">
      <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">Spett.le</div>
      <div style="font-size:13px;font-weight:bold;color:#1a3a5c;">${nome}</div>
      ${indirizzo ? `<div style="font-size:11px;color:#555;margin-top:3px;line-height:1.5;">${indirizzo}</div>` : ''}
    </td>
  </tr>
</table>
<div style="font-size:12px;margin-bottom:6px;"><strong>Oggetto:</strong> Bozza di preventivo</div>
<div style="font-size:12px;margin-bottom:14px;line-height:1.6;">Gentile Cliente,<br/>Vi rimettiamo la nostra offerta escluso IVA di:</div>`
}

// ─── HTML intestazione compatta (pagine successive) ───────────────────────────
function headerCompactHTML(data: string, numero: string): string {
  return `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
  <img src="/images/dg-t.png" alt="Logo" style="height:32px;display:block;"/>
  <div style="font-size:10px;color:#555;text-align:right;line-height:1.5;">
    <strong style="color:#1a3a5c;">Digi Home Design S.r.l.</strong> &nbsp;|&nbsp;
    Preventivo N° ${numero} — ${data} &nbsp;|&nbsp; <em>continua</em>
  </div>
</div>
<hr style="border:none;border-top:1.5px solid #1a3a5c;margin:0 0 12px;"/>`
}

// ─── HTML piè di pagina ───────────────────────────────────────────────────────
function footerHTML(pageNum: number, totalPages: number): string {
  return `
<div style="position:absolute;bottom:16px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:5px;display:flex;justify-content:space-between;font-size:8px;color:#aaa;line-height:1.5;">
  <span>Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</span>
  <span style="white-space:nowrap;font-weight:bold;color:#888;">Pag. ${pageNum} / ${totalPages}</span>
</div>`
}

// ─── Paginazione ──────────────────────────────────────────────────────────────
// Dimensioni A4 in CSS px a 96 DPI: 794 × 1123
const PAGE_H      = 1123
const PAD_TOP     = 38
const PAD_BTM     = 56   // lascia spazio al footer assoluto
const AVAIL       = PAGE_H - PAD_TOP - PAD_BTM  // 1029 px

const H_HEADER1   = 302  // intestazione completa
const H_HEADER_N  = 58   // intestazione compatta
const H_TOTAL     = 56   // blocco totale
const H_NOTE_BASE = 48   // note (minimo)

type Slice = {
  articles: Array<{ a: Record<string, unknown>; idx: number }>
  isFirst:  boolean
  isLast:   boolean
  pageNum:  number
  total:    number   // totalPages (filled after all slices known)
}

function buildPages(
  artRows: Record<string, unknown>[],
  nome: string, indirizzo: string,
  data: string, numero: string,
  totale: string, noteBlock: string,
): string[] {
  const tagged = artRows.map((a, i) => ({ a, idx: i }))
  const hasNote = noteBlock.length > 0
  const extraH  = H_TOTAL + (hasNote ? H_NOTE_BASE : 0)

  const buckets: Array<typeof tagged> = []
  let remaining = [...tagged]

  while (remaining.length > 0) {
    const isFirst  = buckets.length === 0
    const headerH  = isFirst ? H_HEADER1 : H_HEADER_N
    const available = AVAIL - headerH

    let count = 0, used = 0
    for (const entry of remaining) {
      const artH = estimaAltezzaArticolo(entry.a)
      // Se questo è l'ultimo articolo rimasto, prenota spazio per il blocco finale
      const reserve = (count + 1 >= remaining.length) ? extraH : 0
      if (used + artH + reserve > available) break
      used += artH
      count++
    }
    if (count === 0) count = 1  // almeno 1 articolo per pagina

    buckets.push(remaining.splice(0, count))
  }

  // Se non c'è spazio per totale+note nell'ultima pagina, aggiunge pagina vuota
  if (buckets.length > 0) {
    const last    = buckets[buckets.length - 1]
    const hdr     = buckets.length === 1 ? H_HEADER1 : H_HEADER_N
    let used      = hdr
    for (const e of last) used += estimaAltezzaArticolo(e.a)
    if (used + extraH > AVAIL) buckets.push([])
  }

  if (buckets.length === 0) buckets.push([])  // preventivo senza articoli

  const totalPages = buckets.length

  return buckets.map((arts, i) => {
    const isFirst = i === 0
    const isLast  = i === buckets.length - 1

    const header = isFirst
      ? headerFullHTML(data, numero, nome, indirizzo)
      : headerCompactHTML(data, numero)

    const articlesHTML = arts.map(({ a, idx }) => articoloHTML(a, idx)).join('\n')

    const bottom = isLast ? `
      <div style="margin-top:12px;text-align:right;padding:8px 14px;background:#f0f4fa;border-radius:4px;">
        <div style="font-size:10px;color:#555;margin-bottom:2px;">Totale offerta (escluso IVA)</div>
        <div style="font-size:20px;font-weight:bold;color:#1a3a5c;">€ ${totale}</div>
      </div>
      ${noteBlock}
    ` : ''

    return (
      `<div style="font-family:Arial,Helvetica,sans-serif;width:794px;height:${PAGE_H}px;` +
      `padding:${PAD_TOP}px 50px ${PAD_BTM}px;position:relative;background:#fff;` +
      `box-sizing:border-box;overflow:hidden;">` +
      header + articlesHTML + bottom +
      footerHTML(i + 1, totalPages) +
      `</div>`
    )
  })
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
      `SELECT pa.*, l.profilo_frontale_mm AS profilo_mm, l.foto_url AS foto_url
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
    const noteBlock = p.note
      ? `<div style="margin-top:10px;border-top:1px solid #eee;padding-top:8px;font-size:10px;color:#666;line-height:1.6;"><strong>Note:</strong><br/>${String(p.note)}</div>`
      : ''

    return buildPages(artRows as Record<string, unknown>[], clienteNome, clienteIndirizzo, data, numero, totale, noteBlock)
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
