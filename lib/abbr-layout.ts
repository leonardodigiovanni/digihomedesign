// Grammatica Abbr Tc(...)/Ta(...): parsing e layout geometrico condivisi tra l'anteprima a
// schermo (components/preview-infisso.tsx) e la stampa PDF (app/area-clienti/preventivi/[id]/stampa,
// app/area-clienti/carrello-preventivo/stampa) — prima erano tre copie indipendenti dello stesso
// algoritmo, con gli stessi bug duplicati in ciascuna.
//
// Questo modulo non disegna nulla: tokenize() analizza la stringa, layoutAbbr() calcola la
// posizione/dimensione (px + cm) di ogni foglia (anta/fisso) e divisorio, e le passa al `sink`
// del chiamante — che decide come tradurle in JSX (schermo) o in markup SVG stringa (PDF).

export type AntaKind = 'anta' | 'ribalta' | 'vasistas' | 'zoccolo'

export type AntaInfo = {
  antaKind: AntaKind
  hingeLeft: boolean
  handleLeft: boolean
  handleRight: boolean
  innerFisso: boolean
  innerContent: string
  // Solo per antaKind:'zoccolo' — spessore esplicito in mm della fascia di base dritta (es. Z120).
  // null/assente = stesso spessore delle altre fasce dell'anta (comportamento di default).
  zoccoloMm?: number | null
}

// `cm`: area a misura fissa in cm (es. 80(...)). `pct`: area a percentuale fissa del riquadro
// corrente (es. 33%(...)) — 0-100, alternativa a `cm` con la stessa identica semantica di
// "riserva prima, il resto si divide tra le variabili" ma espressa in proporzione anziché cm
// assoluti. Al più uno dei due è valorizzato; entrambi null = area variabile.
export type LeafTok = { type: 'area'; kind: 'leaf'; cm: number | null; pct: number | null; fisso: boolean; antaKind: AntaKind | null; hingeLeft: boolean; handleLeft: boolean; handleRight: boolean; innerFisso: boolean; innerContent?: string; zoccoloMm?: number | null }
export type SubTok  = { type: 'area'; kind: 'sub'; cm: number | null; pct: number | null; content: string }
export type AreaTok = LeafTok | SubTok
// `widthMm`: spessore esplicito in mm (es. T60 = divisorio T da 60mm), indipendente dal profilo
// dell'infisso — se assente, il divisorio usa lo spessore di default (pxDiv, derivato dal profilo).
export type DivTok  = { type: 'div'; kind: 'T' | 'P'; widthMm?: number }
export type Tok = AreaTok | DivTok

// Riconosce il wrapper esterno Tc(...)/Ta(...) di una stringa Abbr — le tre coppie di parentesi
// sono intercambiabili anche qui. Ritorna null se abbr non è nella grammatica Tc/Ta.
export function extractTcTa(abbr: string): { isTa: boolean; content: string } | null {
  const trimmed = (abbr ?? '').trim()
  const m = trimmed.match(/^T([CA])[([{](.*)[)\]}]$/i)
  if (!m) return null
  return { isTa: m[1].toUpperCase() === 'A', content: m[2] }
}

// Le tre coppie di parentesi sono intercambiabili nella grammatica Abbr — nessuna priorità tra
// loro, basta che chi scrive l'Abbr le chiuda in modo coerente (usate a piacere per leggere meglio
// l'annidamento, es. Tc(X[cA(F{})+mAc(F{})]+P+50()) ).
const isOpen  = (ch: string) => ch === '(' || ch === '[' || ch === '{'
const isClose = (ch: string) => ch === ')' || ch === ']' || ch === '}'

// Split su '-'/'+' rispettando parentesi bilanciate (di qualunque tipo).
export function splitTP(s: string): string[] {
  const r: string[] = []; let d = 0, c = ''
  for (const ch of s) {
    if (isOpen(ch)) d++; else if (isClose(ch)) d--
    if ((ch === '-' || ch === '+') && d === 0) { r.push(c); c = '' } else c += ch
  }
  return c.length > 0 ? [...r, c] : r
}

const isFisso = (s: string) => /^F[([{][)\]}]$/.test(s)
const hasFissoWrap = (s: string) => /[([{]F[([{][)\]}][)\]}]/.test(s)

// Riconosce una singola anta/ribalta/vasistas/zoccolo: [C/M]?[A/R/Z]<mm>?[C/M]?(inner) oppure
// V(inner). Z è una variante di A che differisce solo nella fascia di base (dritta, senza taglio a
// 45°, spessore personalizzabile in mm — es. Z120 = zoccolo da 120mm; Z() da sola = stesso spessore
// delle altre fasce, come una A normale) — cerniere/maniglia si comportano esattamente come in A.
export function tryAnta(u: string): AntaInfo | null {
  if (/^V[([{].*[)\]}]$/i.test(u)) return { antaKind: 'vasistas', hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false, innerContent: '' }
  const m = u.match(/^([CM]?)([ARZ])(\d+(?:\.\d+)?)?([CM]?)[([{](.*)[)\]}]$/)
  if (!m) return null
  return {
    antaKind: m[2] === 'R' ? 'ribalta' : m[2] === 'Z' ? 'zoccolo' : 'anta',
    hingeLeft: m[1] === 'C', handleLeft: m[1] === 'M', handleRight: m[4] === 'M',
    zoccoloMm: m[3] != null ? parseFloat(m[3]) : null,
    innerFisso: isFisso(m[5]) || hasFissoWrap(m[5]), innerContent: m[5],
  }
}

const blank    = (cm: number | null, pct: number | null = null): LeafTok => ({ type: 'area', cm, pct, kind: 'leaf', fisso: false, antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false })
const fissoTok = (cm: number | null, pct: number | null = null): LeafTok => ({ type: 'area', cm, pct, kind: 'leaf', fisso: true,  antaKind: null, hingeLeft: false, handleLeft: false, handleRight: false, innerFisso: false })

// Tokenizza un livello di contenuto (top-level di Tc/Ta, oppure l'interno di un wrapper
// N(...)/X(...)): divisori T/P, ante/fissi diretti (foglie), oppure — se il contenuto di un
// wrapper non si riduce a un caso semplice (singola anta, F(), vuoto) — un sotto-livello da
// disegnare ricorsivamente con la stessa funzione (vedi layoutAbbr più sotto).
export function tokenize(content: string): Tok[] {
  const toks: Tok[] = []
  for (const raw of splitTP(content)) {
    const u = raw.trim().toUpperCase()
    if (u === 'T') { toks.push({ type: 'div', kind: 'T' }); continue }
    if (u === 'P') { toks.push({ type: 'div', kind: 'P' }); continue }
    // T60/P40: divisorio con spessore esplicito in mm, indipendente da profilo_frontale_mm.
    const divWm = u.match(/^([TP])(\d+(?:\.\d+)?)$/)
    if (divWm) { toks.push({ type: 'div', kind: divWm[1] as 'T' | 'P', widthMm: parseFloat(divWm[2]) }); continue }
    const direct = tryAnta(u)
    if (direct) { toks.push({ type: 'area', cm: null, pct: null, kind: 'leaf', fisso: false, ...direct }); continue }

    // NUMBER(INNER): 85(F()), 160(cAm()), 120() ecc. — PERCENT(INNER): 33%(), 15%(cAm()) ecc. (riserva
    // una percentuale del riquadro corrente invece di cm assoluti, stessa semantica altrimenti) —
    // LETTER(INNER): X(F()), X(cAm()) ecc. (INNER) può usare indifferentemente (), [] o {}.
    const pctm = u.match(/^(\d+(?:\.\d+)?)%[([{](.*)[)\]}]$/)
    const nm = pctm ? null : u.match(/^(\d+(?:\.\d+)?)[([{](.*)[)\]}]$/)
    const xm = (pctm || nm) ? null : u.match(/^[A-Z][([{](.+)[)\]}]$/)
    if (pctm || nm || xm) {
      const totalCm  = nm   ? parseFloat(nm[1])   : null
      const totalPct = pctm ? parseFloat(pctm[1]) : null
      const inner = (pctm ? pctm[2] : nm ? nm[2] : xm![1]).trim()
      if (inner === '')      { toks.push(blank(totalCm, totalPct)); continue }
      if (isFisso(inner))    { toks.push(fissoTok(totalCm, totalPct)); continue }
      // tryAnta usa (.*) non bilanciato: va provato come "singola anta" SOLO se inner non ha già
      // un '+'/'-' di primo livello, altrimenti matcherebbe a sproposito ingoiando il resto
      // (es. "CA()+AC()" letta come una sola anta con innerContent spazzatura ")+AC(").
      if (splitTP(inner).length === 1) {
        const single = tryAnta(inner)
        if (single) { toks.push({ type: 'area', cm: totalCm, pct: totalPct, kind: 'leaf', fisso: false, ...single }); continue }
      }
      // Contenuto non riducibile a un caso semplice: sotto-livello, disegnato ricorsivamente
      // una volta noto il suo riquadro (vedi layoutAbbr).
      toks.push({ type: 'area', cm: totalCm, pct: totalPct, kind: 'sub', content: inner }); continue
    }

    if (isFisso(u)) { toks.push(fissoTok(null)); continue }
    toks.push(blank(null))
  }
  return toks
}

export interface LayoutSink {
  // wCm/hCm: dimensioni reali (cm) di questo riquadro — servono al chiamante per poter ricorrere
  // (es. un'anta col proprio divisorio T interno usa di nuovo tokenize/layoutAbbr sul proprio
  // contenuto, e per le percentuali serve sapere il vero cm del riquadro, non solo i px).
  leaf(tok: LeafTok, x: number, y: number, w: number, h: number, wCm: number, hCm: number): void
  divider(kind: 'T' | 'P', x: number, y: number, w: number, h: number): void
  // Confine tra due aree consecutive SENZA divisorio T/P tra loro (es. due ante affiancate dentro
  // X(anta+anta)): il telaio/divisorio forniscono "gratis" il bordo alle aree che li toccano, ma tra
  // due aree dirette non lo fornisce nessuno — va disegnato esplicitamente, una volta sola. Opzionale:
  // se il chiamante non lo implementa (es. i generatori PDF, che affidano il giunto al gradiente),
  // il confine viene semplicemente non disegnato.
  seam?(x1: number, y1: number, x2: number, y2: number): void
}

// Calcola posizione/dimensione (px + cm) di ogni token in un riquadro e le passa al sink: le
// foglie direttamente, i sotto-livelli richiamando se stessa sul riquadro appena calcolato —
// stessa formula per gli slot variabili (spazio residuo diviso per il numero di slot variabili),
// applicabile a qualunque profondità di annidamento. `pxDiv` è lo spessore in px del profilo
// (uguale per T e P, come nei due chiamanti attuali).
export function layoutAbbr(
  toks: Tok[],
  box: { x: number; y: number; w: number; h: number; wCm: number; hCm: number },
  pxDiv: number,
  sink: LayoutSink
): void {
  const { x: bx, y: by, w: bw, h: bh, wCm: bwCm, hCm: bhCm } = box
  const areaToks = toks.filter((t): t is AreaTok => t.type === 'area')
  if (areaToks.length === 0) return
  const axisH = toks.some(t => t.type === 'div' && t.kind === 'T')
  const divKind: 'T' | 'P' = axisH ? 'T' : 'P'
  const totalCm = axisH ? bhCm : bwCm
  const totalPx = axisH ? bh : bw
  // Spessore in px di un divisorio: quello esplicito in mm (T60/P40, convertito con la stessa
  // scala px/cm di questo riquadro) se presente, altrimenti il default pxDiv (derivato dal profilo).
  const divPxOf = (t: DivTok): number => t.widthMm != null && totalCm > 0
    ? Math.max(1, (t.widthMm / 10 / totalCm) * totalPx)
    : pxDiv
  const divTokens = toks.filter((t): t is DivTok => t.type === 'div' && t.kind === divKind)
  const totalDivPx = divTokens.reduce((s, t) => s + divPxOf(t), 0)
  // `pct` (33%(...)) è solo un'altra unità per la stessa riserva fissa di `cm` (80(...)): la
  // converto subito nel suo equivalente in cm rispetto al riquadro corrente, poi tutto il resto
  // della formula (spazio residuo diviso tra le aree variabili) resta identico.
  const cmOf = (a: AreaTok): number | null => a.pct != null ? (a.pct / 100) * totalCm : a.cm
  const fixedSumCm = areaToks.reduce((s, a) => { const c = cmOf(a); return c != null ? s + c : s }, 0)
  const nVar = areaToks.filter(a => cmOf(a) == null).length
  const fixedSumPx = totalCm > 0 ? (fixedSumCm / totalCm) * totalPx : 0
  const varPx = nVar > 0 ? (totalPx - totalDivPx - fixedSumPx) / nVar : 0
  const varCm = nVar > 0 ? Math.max(0, (totalCm - fixedSumCm) / nVar) : 0
  const fallback = nVar > 0 && varPx <= 0
  const equalPx = (totalPx - totalDivPx) / Math.max(1, areaToks.length)
  const lastAreaTok = [...toks].reverse().find((t): t is AreaTok => t.type === 'area')
  let cursor = axisH ? by : bx
  let cmCursor = 0
  let prevWasArea = false
  for (const tok of toks) {
    if (tok.type === 'div') {
      if (tok.kind !== divKind) continue
      const thisDivPx = divPxOf(tok)
      if (axisH) sink.divider(tok.kind, bx, cursor, bw, thisDivPx)
      else       sink.divider(tok.kind, cursor, by, thisDivPx, bh)
      cursor += thisDivPx
      prevWasArea = false
      continue
    }
    if (prevWasArea && sink.seam) {
      if (axisH) sink.seam(bx, cursor, bx + bw, cursor)
      else       sink.seam(cursor, by, cursor, by + bh)
    }
    prevWasArea = true
    const isLast = tok === lastAreaTok
    const tokCm = cmOf(tok)
    const sizePx = isLast
      ? (axisH ? (by + bh) - cursor : (bx + bw) - cursor)
      : Math.round(fallback ? equalPx : (tokCm != null ? (tokCm / totalCm) * totalPx : varPx))
    const sizeCm = isLast ? Math.max(0, totalCm - cmCursor) : (tokCm != null ? tokCm : varCm)
    const ax = axisH ? bx : cursor
    const ay = axisH ? cursor : by
    const aw = axisH ? bw : sizePx
    const ah = axisH ? sizePx : bh
    const cellCmW = axisH ? bwCm : sizeCm
    const cellCmH = axisH ? sizeCm : bhCm
    if (tok.kind === 'leaf') {
      sink.leaf(tok, ax, ay, aw, ah, cellCmW, cellCmH)
    } else {
      layoutAbbr(tokenize(tok.content), { x: ax, y: ay, w: aw, h: ah, wCm: cellCmW, hCm: cellCmH }, pxDiv, sink)
    }
    cursor += sizePx
    cmCursor += sizeCm
  }
}
