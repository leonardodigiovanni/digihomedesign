function computeSVGDims(larghezza: number, altezza: number) {
  const MAX_W = 154, MAX_H = 150
  if (larghezza > 0 && altezza > 0) {
    const ratio = larghezza / altezza
    if (ratio >= MAX_W / MAX_H) return { W: MAX_W, H: Math.max(Math.round(MAX_W / ratio), 40) }
    return { W: Math.max(Math.round(MAX_H * ratio), 50), H: MAX_H }
  }
  return { W: MAX_W, H: MAX_H }
}

export function tcTaSvg(
  isTa: boolean, larghezza: number, altezza: number,
  profiloMm = 80, barColor: string | null = null
): string {
  const { W, H } = computeSVGDims(larghezza, altezza)
  const widthCm  = larghezza > 0 ? larghezza : 100
  const heightCm = altezza   > 0 ? altezza   : 150
  const ox = 0, oy = 0
  const outerW = W, outerH = H
  const pxPerCmX = outerW / widthCm
  const pxPerCmY = outerH / heightCm
  const PROFILE_CM = profiloMm / 10
  const pxPerCm = Math.min(pxPerCmX, pxPerCmY)
  const pX = Math.max(4.5, PROFILE_CM * pxPerCm)
  const pY = pX
  const pc = barColor ?? '#d8d4cc'

  const pts = (coords: [number, number][]) =>
    coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  const top    = pts([[ox, oy],[ox+outerW, oy],[ox+outerW-pX, oy+pY],[ox+pX, oy+pY]])
  const right  = isTa
    ? pts([[ox+outerW, oy],[ox+outerW, oy+outerH],[ox+outerW-pX, oy+outerH],[ox+outerW-pX, oy+pY]])
    : pts([[ox+outerW, oy],[ox+outerW, oy+outerH],[ox+outerW-pX, oy+outerH-pY],[ox+outerW-pX, oy+pY]])
  const left   = isTa
    ? pts([[ox, oy],[ox+pX, oy+pY],[ox+pX, oy+outerH],[ox, oy+outerH]])
    : pts([[ox, oy],[ox+pX, oy+pY],[ox+pX, oy+outerH-pY],[ox, oy+outerH]])
  const bottom = pts([[ox, oy+outerH],[ox+outerW, oy+outerH],[ox+outerW-pX, oy+outerH-pY],[ox+pX, oy+outerH-pY]])

  const bars = [
    `<polygon points="${top}"   fill="${pc}" stroke="#000" stroke-width="1"/>`,
    `<polygon points="${right}" fill="${pc}" stroke="#000" stroke-width="1"/>`,
    `<polygon points="${left}"  fill="${pc}" stroke="#000" stroke-width="1"/>`,
    ...(!isTa ? [`<polygon points="${bottom}" fill="${pc}" stroke="#000" stroke-width="1"/>`] : []),
  ].join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">\n${bars}\n</svg>`
}

export function tcTaDataUri(
  isTa: boolean, larghezza: number, altezza: number,
  profiloMm = 80, barColor: string | null = null
): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(tcTaSvg(isTa, larghezza, altezza, profiloMm, barColor))}`
}

// Calcola Ag (m²) e Lg (m) dai fermavetro dell'abbr — usati per Uw = (Ug*Ag + Uf*Af + Yg*Lg) / Aw
export function computeGlassGeometry(abbr: string, W_cm: number, H_cm: number, profiloMm: number): { Ag: number; Lg: number } | null {
  const abbrUp = abbr.trim().toUpperCase()
  const isTa = abbrUp.startsWith('TA(')
  if (!abbrUp.startsWith('TC(') && !isTa) return null
  if (W_cm <= 0 || H_cm <= 0) return null

  const P  = profiloMm / 10   // spessore profilo in cm
  const Wi = W_cm - 2 * P     // larghezza interna
  const Hi = isTa ? H_cm - P : H_cm - 2 * P  // altezza interna
  if (Wi <= 0 || Hi <= 0) return null

  const splitTP = (s: string): string[] => {
    const r: string[] = []; let d = 0, c = ''
    for (const ch of s) {
      if (ch === '(') d++; else if (ch === ')') d--
      if ((ch === '-' || ch === '+') && d === 0) { r.push(c); c = '' } else c += ch
    }
    return c.length > 0 ? [...r, c] : r
  }
  const isAntaStr = (u: string) =>
    /^V\(.*\)$/i.test(u) || /^([CM]?)([AR])([CM]?)\(.*\)$/.test(u)

  const content = abbrUp.match(/^T[CA]\((.*)\)$/i)?.[1] ?? ''

  type AreaTok = { type: 'area'; cm: number | null; isAnta: boolean }
  type DivTok  = { type: 'div'; kind: 'T' | 'P' }
  const tokens: (AreaTok | DivTok)[] = []

  if (content.trim()) {
    for (const t of splitTP(content)) {
      const u = t.trim().toUpperCase()
      if (!u) continue
      if (u === 'T') { tokens.push({ type: 'div', kind: 'T' }); continue }
      if (u === 'P') { tokens.push({ type: 'div', kind: 'P' }); continue }
      if (isAntaStr(u)) { tokens.push({ type: 'area', cm: null, isAnta: true }); continue }
      const nm = u.match(/^(\d+(?:\.\d+)?)\((.*)\)$/)
      if (nm) {
        const totalCm = parseFloat(nm[1]), inner = nm[2]
        const ip = splitTP(inner).filter(x => x.trim().length > 0)
        if (ip.length > 0 && ip.every(x => isAntaStr(x.trim().toUpperCase()))) {
          const perCm = totalCm / ip.length
          ip.forEach(() => tokens.push({ type: 'area', cm: perCm, isAnta: true }))
          continue
        }
        tokens.push({ type: 'area', cm: totalCm, isAnta: false }); continue
      }
      // X(anta(...)): area variabile che wrappa un anta — va controllata PRIMA di includes(F())
      const xAntaM = u.match(/^[A-Z]\((.+)\)$/)
      if (xAntaM && isAntaStr(xAntaM[1].trim())) { tokens.push({ type: 'area', cm: null, isAnta: true }); continue }
      tokens.push({ type: 'area', cm: null, isAnta: false })
    }
  } else {
    tokens.push({ type: 'area', cm: null, isAnta: false })
  }

  const areaToks = tokens.filter((t): t is AreaTok => t.type === 'area')
  if (areaToks.length === 0) return null

  let totalAg = 0, totalLg = 0
  const addGlass = (aW: number, aH: number, isAnta: boolean) => {
    // fisso: fermavetro P/2 su ogni lato → vetro = (aW-P)×(aH-P)
    // anta: frame P + fermavetro P/2 su ogni lato → vetro = (aW-3P)×(aH-3P)
    const gW = isAnta ? aW - 3 * P : aW - P
    const gH = isAnta ? aH - 3 * P : aH - P
    if (gW > 0 && gH > 0) { totalAg += gW * gH; totalLg += 2 * (gW + gH) }
  }

  const hasPDiv = tokens.some(t => t.type === 'div' && (t as DivTok).kind === 'P')
  const hasTDiv = tokens.some(t => t.type === 'div' && (t as DivTok).kind === 'T')
  const nDiv = tokens.filter(t => t.type === 'div').length
  const fixedSum = areaToks.reduce((s, a) => s + (a.cm ?? 0), 0)
  const nVar = areaToks.filter(a => a.cm == null).length

  if (!hasPDiv && !hasTDiv) {
    const varW = nVar > 0 ? (Wi - fixedSum) / nVar : 0
    let cur = 0
    for (let i = 0; i < areaToks.length; i++) {
      const tok = areaToks[i]
      const aW = i === areaToks.length - 1 ? Wi - cur : (tok.cm ?? varW)
      addGlass(aW, Hi, tok.isAnta)
      cur += aW
    }
  } else if (hasPDiv) {
    const varW = nVar > 0 ? (Wi - nDiv * P - fixedSum) / nVar : 0
    let cur = 0
    const lastArea = [...tokens].reverse().find(t => t.type === 'area') as AreaTok | undefined
    for (const tok of tokens) {
      if (tok.type === 'area') {
        const aW = tok === lastArea ? Wi - nDiv * P - cur : (tok.cm ?? varW)
        addGlass(aW, Hi, tok.isAnta)
        cur += aW
      } else if (tok.type === 'div') { cur += P }
    }
  } else {
    const varH = nVar > 0 ? (Hi - nDiv * P - fixedSum) / nVar : 0
    let cur = 0
    const lastArea = [...tokens].reverse().find(t => t.type === 'area') as AreaTok | undefined
    for (const tok of tokens) {
      if (tok.type === 'area') {
        const aH = tok === lastArea ? Hi - nDiv * P - cur : (tok.cm ?? varH)
        addGlass(Wi, aH, tok.isAnta)
        cur += aH
      } else if (tok.type === 'div') { cur += P }
    }
  }

  if (totalAg <= 0) return null
  return { Ag: totalAg / 10000, Lg: totalLg / 100 }
}

// Profile ratio: pX / outerW (= pY / outerH) — used by preview to clip sfondo
export function tcTaProfileRatio(larghezza: number, altezza: number, profiloMm = 80) {
  const { W, H } = computeSVGDims(larghezza, altezza)
  const widthCm  = larghezza > 0 ? larghezza : 100
  const heightCm = altezza   > 0 ? altezza   : 150
  const PROFILE_CM = profiloMm / 10
  const pxPerCmX = W / widthCm
  const pxPerCmY = H / heightCm
  const pxPerCm = Math.min(pxPerCmX, pxPerCmY)
  const pX = Math.max(4.5, PROFILE_CM * pxPerCm)
  const pY = pX
  return { rx: pX / W, ry: pY / H }
}
