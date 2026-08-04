// Disegno vero e proprio dell'infisso Tc/Ta (bande del telaio, ante/ribalte/vasistas, fermavetro,
// cerniere, maniglie) — condiviso tra l'anteprima a schermo (components/preview-infisso.tsx) e i
// due generatori PDF (app/area-clienti/preventivi/[id]/stampa, app/area-clienti/carrello-preventivo/
// stampa). Prima erano tre implementazioni indipendenti con gli stessi bug (linee doppie ai giunti,
// chiaroscuro/gradienti) duplicati in ciascuna.
//
// Questo modulo non sa produrre JSX né stringhe SVG direttamente: riceve un `DrawSink` che decide
// come tradurre rect/polygon/line nel formato del chiamante (JSX per lo schermo, markup SVG stringa
// per il PDF) — incluse le chiavi React, l'escaping, i decimali ecc., tutti dettagli del chiamante.

import { tokenize, layoutAbbr, type LeafTok, type AntaKind } from './abbr-layout'

export interface DrawSink {
  rect(x: number, y: number, w: number, h: number, opts: { fill?: string | null; stroke?: string | null; strokeWidth?: number; rx?: number }): void
  polygon(points: [number, number][], opts: { fill?: string | null; stroke?: string | null }): void
  line(x1: number, y1: number, x2: number, y2: number, opts?: { stroke?: string; strokeWidth?: number; dash?: string }): void
}

export interface InfissoStyle {
  fill: string                 // colore profilo (bar_color)
  hwFill: string                // colore hardware/cerniere/maniglie (bar_color_acc ?? bar_color)
  stroke: string                 // colore contorni — un solo valore fisso, usato ovunque
  pxTelaio: number                // spessore telaio Tc/Ta + divisori T/P, in px
  pxAnta: number                   // spessore telaio di ogni anta/ribalta/vasistas, in px
  fvPx: number                      // spessore fermavetro (20mm fissi, indipendente dal profilo), in px
  pxPerCm: number                    // scala corrente, per dimensionare cerniere/maniglie/vasistas
  handleFromBottomCm: number          // altezza maniglia dal fondo dell'anta (già risolta dal chiamante)
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const m = full.match(/.{2}/g)
  if (!m || m.length < 3) return [128, 128, 128]
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)]
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

// Colore di contorno adattivo: un po' più scuro se il colore infisso è chiaro, un po' più chiaro
// se è scuro — solo per far risaltare i bordi, in modo leggero. È un unico valore fisso calcolato
// una volta dal colore base (non un gradiente/chiaroscuro sul profilo).
export function adaptiveStroke(fill: string, amount = 0.22): string {
  const [r, g, b] = hexToRgb(fill)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
    ? rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
    : rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

// Rettangolo interno (l'apertura vetrata) dato il riquadro esterno del telaio — usato sia da
// drawInfisso sia dal chiamante (es. per il clipPath dell'immagine di sfondo nell'anteprima).
export function innerRect(isTa: boolean, ox: number, oy: number, outerW: number, outerH: number, pxTelaio: number) {
  return {
    innerX: ox + pxTelaio,
    innerY: oy + pxTelaio,
    innerW: outerW - 2 * pxTelaio,
    innerH: isTa ? outerH - pxTelaio : outerH - 2 * pxTelaio,
  }
}

// Colori/simboli fissi del senso di apertura (condivisi tra pushFermavetri e drawAnta): blu per il
// battente (A/Z/R), verde per il vasistas (V/R — indicano entrambi movimento), rosso per il fisso
// (F — indica staticità, simbolo X).
const APERTURA_STROKE = '#1a56db'
const VASISTAS_STROKE = '#16a34a'
const FISSO_STROKE = '#dc2626'
const SIMBOLO_DASH = '4 3'

// Vetro fisso o interno di un'anta: cornice di fermavetro (4 barre + perimetro esterno/interno, una
// sola volta ciascuno — con un contorno a testa per barra si raddoppierebbe lo spessore agli angoli).
// `isFisso`: true solo per una vera foglia F() (non per il vetro semplice di un'anta senza contenuto
// strutturato) — disegna in più la X rossa nel vetro vero, simbolo di "non apribile".
function pushFermavetri(sink: DrawSink, ax: number, ay: number, aw: number, ah: number, style: InfissoStyle, isFisso = false) {
  const { fill, stroke, fvPx } = style
  sink.rect(ax,         ay,         aw,   fvPx,      { fill, stroke: null })
  sink.rect(ax,         ay+ah-fvPx, aw,   fvPx,      { fill, stroke: null })
  sink.rect(ax,         ay+fvPx,    fvPx, ah-2*fvPx, { fill, stroke: null })
  sink.rect(ax+aw-fvPx, ay+fvPx,    fvPx, ah-2*fvPx, { fill, stroke: null })
  sink.rect(ax,       ay,       aw,        ah,         { fill: null, stroke })
  sink.rect(ax+fvPx,  ay+fvPx,  aw-2*fvPx, ah-2*fvPx,  { fill: null, stroke })
  if (isFisso) {
    // Croce (+), non X: due linee dritte per la mezzeria orizzontale e verticale del vetro vero.
    const gx0 = ax + fvPx, gy0 = ay + fvPx, gw0 = aw - 2 * fvPx, gh0 = ah - 2 * fvPx
    const midX = gx0 + gw0 / 2, midY = gy0 + gh0 / 2
    sink.line(midX, gy0, midX, gy0 + gh0, { stroke: FISSO_STROKE, strokeWidth: 1 })
    sink.line(gx0, midY, gx0 + gw0, midY, { stroke: FISSO_STROKE, strokeWidth: 1 })
  }
}

const sn = (v: number) => Math.round(v) + 0.5

function drawAnta(
  sink: DrawSink,
  ax: number, ay: number, aw: number, ah: number,
  hingeLeft: boolean, handleLeft: boolean, handleRight: boolean,
  kind: AntaKind, zoccoloMm: number | null | undefined, innerContent: string | undefined,
  wCm: number, hCm: number,
  style: InfissoStyle
) {
  const { fill, hwFill, stroke, pxAnta: p, pxPerCm } = style
  // Zoccolo (kind:'zoccolo'): fascia di base dritta, senza taglio a 45°, di spessore personalizzabile
  // in mm (Z120 = 120mm); senza cifra esplicita usa lo stesso spessore delle altre fasce (p), come A.
  const zH = kind === 'zoccolo'
    ? (zoccoloMm != null ? Math.max(1, (zoccoloMm / 10) * pxPerCm) : p)
    : p
  // stroke:null sui 4 trapezi: col riempimento piatto non c'è bordo "gratis" tra loro (niente
  // gradiente a fare da giunto), quindi il taglio a 45° si disegna una volta sola con le diagonali.
  sink.polygon([[ax,ay],[ax+aw,ay],[ax+aw-p,ay+p],[ax+p,ay+p]], { fill, stroke: null })
  if (kind === 'zoccolo') {
    // I laterali sono dritti (nessun taglio a 45° in basso) e arrivano fino in fondo all'anta,
    // angolo vivo; la base è una fascia dritta INSET (tra le facce interne dei due laterali, non
    // sotto di loro) che li unisce, di spessore personalizzabile.
    sink.polygon([[ax,ay],[ax+p,ay+p],[ax+p,ay+ah],[ax,ay+ah]],             { fill, stroke: null })
    sink.polygon([[ax+aw,ay],[ax+aw-p,ay+p],[ax+aw-p,ay+ah],[ax+aw,ay+ah]], { fill, stroke: null })
    sink.rect(ax+p, ay+ah-zH, aw-2*p, zH, { fill, stroke: null })
  } else {
    sink.polygon([[ax,ay+ah],[ax+aw,ay+ah],[ax+aw-p,ay+ah-p],[ax+p,ay+ah-p]], { fill, stroke: null })
    sink.polygon([[ax,ay],[ax+p,ay+p],[ax+p,ay+ah-p],[ax,ay+ah]],             { fill, stroke: null })
    sink.polygon([[ax+aw,ay],[ax+aw-p,ay+p],[ax+aw-p,ay+ah-p],[ax+aw,ay+ah]], { fill, stroke: null })
  }
  sink.line(ax,    ay,    ax+p,    ay+p,    { stroke })
  sink.line(ax+aw, ay,    ax+aw-p, ay+p,    { stroke })
  if (kind === 'zoccolo') {
    // Niente diagonali qui: i laterali arrivano dritti fino in fondo, angolo vivo. Il bordo
    // superiore della base coincide esattamente col contorno del vetro/contenuto interno sopra di
    // essa (già disegnato da quel contorno). Servono però le due righe verticali di congiunzione
    // tra il laterale e la base (stesso colore ma due sagome distinte: senza una riga esplicita il
    // giunto sarebbe invisibile, come per il seam tra due aree adiacenti senza divisorio).
    sink.line(ax+p,      ay+ah-zH, ax+p,      ay+ah, { stroke })
    sink.line(ax+aw-p,   ay+ah-zH, ax+aw-p,   ay+ah, { stroke })
  } else {
    sink.line(ax,    ay+ah, ax+p,    ay+ah-p, { stroke })
    sink.line(ax+aw, ay+ah, ax+aw-p, ay+ah-p, { stroke })
  }

  if (kind === 'vasistas') {
    const hvW = Math.max(5, 15 * pxPerCm)
    const hvH = Math.max(1.5, 2 * pxPerCm)
    const hy  = ay + ah - hvH
    const hx1 = ax + p
    const hx2 = ax + aw - p - hvW
    sink.rect(hx1, hy, hvW, hvH, { fill: hwFill, stroke })
    sink.line(hx1+hvW/2, hy, hx1+hvW/2, hy+hvH, { stroke })
    sink.rect(hx2, hy, hvW, hvH, { fill: hwFill, stroke })
    sink.line(hx2+hvW/2, hy, hx2+hvW/2, hy+hvH, { stroke })
    const clW = Math.max(4, 6 * pxPerCm)
    const clH = Math.max(2, p * 0.55)
    const clX = ax + aw / 2 - clW / 2
    const clY = ay
    const clRx = Math.max(0.5, clW * 0.2)
    sink.rect(clX, clY, clW, clH, { fill: hwFill, stroke, rx: clRx })
    const pvW = Math.max(1, clW * 0.18)
    const pvH = Math.max(2, p * 0.55)
    const pvX = clX + clW / 2 - pvW / 2
    sink.rect(pvX, clY + clH, pvW, pvH, { fill: hwFill, stroke, rx: Math.max(0.3, pvW * 0.25) })
  } else {
    const hW = Math.max(1.5, 2 * pxPerCm)
    const hH = Math.max(5, 15 * pxPerCm)
    const hx = hingeLeft ? ax : ax + aw - hW
    sink.rect(hx, ay+p, hW, hH, { fill: hwFill, stroke })
    sink.line(sn(hx), sn(ay+p+hH/2), sn(hx+hW), sn(ay+p+hH/2), { stroke })
    sink.rect(hx, ay+ah-p-hH, hW, hH, { fill: hwFill, stroke })
    sink.line(sn(hx), sn(ay+ah-p-hH/2), sn(hx+hW), sn(ay+ah-p-hH/2), { stroke })
    if (handleLeft || handleRight) {
      const mW = Math.max(2, 2.5 * pxPerCm)
      const mH = Math.max(5, 15 * pxPerCm)
      const mx = handleLeft ? ax + (p - mW) / 2 : ax + aw - p + (p - mW) / 2
      const myFromFloor = (ay + ah - p) - style.handleFromBottomCm * pxPerCm - mH / 2
      // Se l'altezza ergonomica (misurata da terra) porrebbe la maniglia troppo vicina al bordo
      // superiore della finestra (finestra bassa), la centro a metà della finestra — distanza
      // relativa alla finestra stessa, non più alla stanza.
      const my = myFromFloor < ay + p ? ay + ah / 2 - mH / 2 : myFromFloor
      const rx = Math.max(1, mW * 0.3)
      sink.rect(mx, my, mW, mH, { fill: hwFill, stroke, rx })
    }
  }

  // Contenuto interno dell'anta: vetro fisso semplice, oppure — se l'anta ha un proprio contenuto
  // strutturato (es. cA(F()+T+F()), con divisori/percentuali/gruppi) — richiama lo stesso
  // tokenize/layoutAbbr usato per il resto della grammatica, ricorsivamente (stesso supporto
  // percentuali, seam, ante nidificate ecc. di qualunque altro livello).
  const iX0 = ax + p, iY0 = ay + p, iW0 = aw - 2 * p, iH0 = ah - p - zH
  if (innerContent && innerContent.trim()) {
    layoutAbbr(tokenize(innerContent), { x: iX0, y: iY0, w: iW0, h: iH0, wCm, hCm }, p, {
      leaf: (tok, x, y, w, h, cellWCm, cellHCm) => {
        // Niente X qui: F() come contenuto interno di un'anta (anche annidato, es. mAc(X()+T+F()))
        // è solo la specifica del vetro di QUELLA anta apribile — non un vero fisso indipendente.
        // La X è solo per i F() che sono aree fratelle a livello del telaio Tc/Ta (drawInfisso).
        if (tok.fisso) pushFermavetri(sink, x, y, w, h, style)
        else if (tok.antaKind) drawAnta(sink, x, y, w, h, tok.hingeLeft, tok.handleLeft, tok.handleRight, tok.antaKind, tok.zoccoloMm, tok.innerContent, cellWCm, cellHCm, style)
      },
      divider: (_kind, x, y, w, h) => sink.rect(x, y, w, h, { fill, stroke }),
      seam: (x1, y1, x2, y2) => sink.line(x1, y1, x2, y2, { stroke }),
    })
  } else {
    pushFermavetri(sink, iX0, iY0, iW0, iH0, style)
  }

  // Linee blu tratteggiate che indicano il senso di apertura (A/R/V) — blu e tratteggiate per
  // risaltare rispetto al contorno del telaio, visibili anche nella stampa PDF su carta bianca. Si
  // guarda sempre il lato dove sono le cerniere: i due spigoli vetro vicino alle cerniere (alta e
  // bassa, o le due orizzontali per il vasistas) si congiungono nella mezzeria del lato di vetro
  // OPPOSTO a quello delle cerniere.
  // Riquadro del vetro VERO (non del fermavetro): inset di fvPx rispetto al riquadro dell'anta,
  // perché il fermavetro (le 4 barre di pushFermavetri) è telaio, non vetro — le linee non devono
  // mai entrarci.
  const { fvPx } = style
  const gX0 = iX0 + fvPx, gY0 = iY0 + fvPx, gW0 = iW0 - 2 * fvPx, gH0 = iH0 - 2 * fvPx
  if (kind === 'anta' || kind === 'ribalta' || kind === 'zoccolo') {
    const hingeX = hingeLeft ? gX0 : gX0 + gW0
    const oppositeX = hingeLeft ? gX0 + gW0 : gX0
    const midY = gY0 + gH0 / 2
    sink.line(hingeX, gY0,        oppositeX, midY, { stroke: APERTURA_STROKE, strokeWidth: 1, dash: SIMBOLO_DASH })
    sink.line(hingeX, gY0 + gH0,  oppositeX, midY, { stroke: APERTURA_STROKE, strokeWidth: 1, dash: SIMBOLO_DASH })
  }

  // Vasistas — e ribalta (che apre anche a vasistas, seconda coppia che si aggiunge a quella
  // blu sopra): dai due angoli inferiori del vetro vero (filo vetro) alla mezzeria del lato
  // superiore del vetro vero, in verde (indica movimento, come il blu). Per il vasistas puro è
  // l'UNICA coppia (niente blu).
  if (kind === 'vasistas' || kind === 'ribalta') {
    const midX = gX0 + gW0 / 2
    sink.line(gX0,       gY0 + gH0, midX, gY0, { stroke: VASISTAS_STROKE, strokeWidth: 1, dash: SIMBOLO_DASH })
    sink.line(gX0 + gW0, gY0 + gH0, midX, gY0, { stroke: VASISTAS_STROKE, strokeWidth: 1, dash: SIMBOLO_DASH })
  }
}

// Disegna il telaio Tc/Ta (bande esterne, bordo esterno/interno, diagonali 45°) e tutto il contenuto
// (ante, fissi, divisori) dentro il riquadro [ox,oy,outerW,outerH]. `wCm`/`hCm` sono le dimensioni
// reali in cm, usate dal layout per calcolare le proporzioni delle aree.
export function drawInfisso(
  sink: DrawSink,
  isTa: boolean,
  ox: number, oy: number, outerW: number, outerH: number,
  content: string,
  wCm: number, hCm: number,
  style: InfissoStyle
): void {
  const { fill, stroke, pxTelaio: p } = style
  const { innerX, innerY, innerW, innerH } = innerRect(isTa, ox, oy, outerW, outerH, p)

  // Bande esterne del telaio — riempimento piatto, nessun contorno proprio (il taglio a 45° lo
  // disegnano le diagonali esplicite più sotto, una volta sola).
  sink.polygon([[ox,oy],[ox+outerW,oy],[ox+outerW-p,oy+p],[ox+p,oy+p]], { fill, stroke: null })
  const rightPts: [number, number][] = isTa
    ? [[ox+outerW,oy],[ox+outerW,oy+outerH],[ox+outerW-p,oy+outerH],[ox+outerW-p,oy+p]]
    : [[ox+outerW,oy],[ox+outerW,oy+outerH],[ox+outerW-p,oy+outerH-p],[ox+outerW-p,oy+p]]
  sink.polygon(rightPts, { fill, stroke: null })
  const leftPts: [number, number][] = isTa
    ? [[ox,oy],[ox+p,oy+p],[ox+p,oy+outerH],[ox,oy+outerH]]
    : [[ox,oy],[ox+p,oy+p],[ox+p,oy+outerH-p],[ox,oy+outerH]]
  sink.polygon(leftPts, { fill, stroke: null })
  if (!isTa) sink.polygon([[ox,oy+outerH],[ox+outerW,oy+outerH],[ox+outerW-p,oy+outerH-p],[ox+p,oy+outerH-p]], { fill, stroke: null })

  // Bordo esterno (Ta: aperto, senza il lato inferiore)
  if (!isTa) {
    sink.rect(ox, oy, outerW, outerH, { fill: null, stroke })
  } else {
    sink.line(ox, oy+outerH, ox, oy, { stroke })
    sink.line(ox, oy, ox+outerW, oy, { stroke })
    sink.line(ox+outerW, oy, ox+outerW, oy+outerH, { stroke })
  }
  // Bordo interno (contro il vetro/sfondo)
  sink.line(innerX, innerY, innerX+innerW, innerY, { stroke })
  if (!isTa) sink.line(innerX, innerY+innerH, innerX+innerW, innerY+innerH, { stroke })
  sink.line(innerX, innerY, innerX, innerY+innerH, { stroke })
  sink.line(innerX+innerW, innerY, innerX+innerW, innerY+innerH, { stroke })
  // Diagonali 45° (unica rappresentazione del giunto, non raddoppiate da nient'altro)
  sink.line(ox, oy, innerX, innerY, { stroke })
  sink.line(ox+outerW, oy, innerX+innerW, innerY, { stroke })
  if (!isTa) sink.line(ox, oy+outerH, innerX, innerY+innerH, { stroke })
  if (!isTa) sink.line(ox+outerW, oy+outerH, innerX+innerW, innerY+innerH, { stroke })

  if (content.trim()) {
    layoutAbbr(tokenize(content), { x: innerX, y: innerY, w: innerW, h: innerH, wCm, hCm }, p, {
      leaf: (tok: LeafTok, x, y, w, h, cellWCm, cellHCm) => {
        if (tok.fisso) pushFermavetri(sink, x, y, w, h, style, true)
        else if (tok.antaKind) drawAnta(sink, x, y, w, h, tok.hingeLeft, tok.handleLeft, tok.handleRight, tok.antaKind, tok.zoccoloMm, tok.innerContent, cellWCm, cellHCm, style)
      },
      divider: (_kind, x, y, w, h) => {
        sink.rect(x, y, w, h, { fill, stroke })
      },
      seam: (x1, y1, x2, y2) => {
        sink.line(x1, y1, x2, y2, { stroke })
      },
    })
  }
}
