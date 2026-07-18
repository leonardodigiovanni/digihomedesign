// Sposta il blocco di navigazione di fine pagina (bottoni "Torna a X" /
// CtaPreventivo / CtaCantiere ecc.) dentro <StickyBottomBarContent>, e
// aggiunge <ShortcutStar /> accanto al breadcrumb in testa alla pagina.
// Salta (segnala, non tocca) i file che non combaciano col pattern atteso.
const fs = require('fs')
const { execSync } = require('child_process')

const STICKY_IMPORT = "import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'"
const STAR_IMPORT = "import ShortcutStar from '@/components/shortcut-star'"

function stripFlex1(s) {
  return s.replace(/\s*style=\{\{\s*flex:\s*1\s*\}\}/g, '')
}

function addImportAfterLastImport(content, importLine) {
  if (content.includes(importLine)) return content
  const re = /^import .+$/gm
  let m, last = null
  while ((m = re.exec(content)) !== null) last = m
  if (!last) return importLine + '\n' + content
  const pos = last.index + last[0].length
  return content.slice(0, pos) + '\n' + importLine + content.slice(pos)
}

// Trova, scandendo da startIdx, l'indice subito dopo il tag </div> che
// chiude il <div ...> la cui apertura termina a openTagEndIdx (bilanciando
// <div ...> / </div> — nessun altro tag apre/chiude un "div" nel conteggio).
function findMatchingDivClose(content, openTagEndIdx) {
  let depth = 1
  const re = /<div\b|<\/div>/g
  re.lastIndex = openTagEndIdx
  let m
  while ((m = re.exec(content)) !== null) {
    if (m[0] === '</div>') {
      depth--
      if (depth === 0) return re.lastIndex
    } else {
      depth++
    }
  }
  return -1
}

function migrate(content, file) {
  const debugIdx = content.indexOf('<p className="IsDebug')
  if (debugIdx === -1) return { status: 'skip', reason: 'nessun anchor IsDebug' }
  const before = content.slice(0, debugIdx)

  // --- Trova l'ultimo <div style={{ display: 'flex', ...}}> prima dell'anchor ---
  const divOpenRe = /<div style=\{\{ display: 'flex'[^}]*\}\}>/g
  let m, lastDivOpen = null
  while ((m = divOpenRe.exec(before)) !== null) lastDivOpen = m

  let blockStart, blockEnd, inner, mode

  if (lastDivOpen) {
    const openTagEndIdx = lastDivOpen.index + lastDivOpen[0].length
    const closeIdx = findMatchingDivClose(content, openTagEndIdx)
    if (closeIdx === -1 || closeIdx > debugIdx + 50) {
      return { status: 'skip', reason: 'div wrapper senza chiusura chiara vicino a IsDebug' }
    }
    // Verifica che non ci sia altro contenuto significativo tra la chiusura e l'anchor
    const between = content.slice(closeIdx, debugIdx)
    if (!/^\s*<\/div>\s*$/.test(between) && !/^\s*$/.test(between)) {
      return { status: 'skip', reason: 'contenuto inatteso tra wrapper e IsDebug' }
    }
    blockStart = lastDivOpen.index
    blockEnd = closeIdx
    inner = content.slice(openTagEndIdx, closeIdx - '</div>'.length)
    mode = 'div-wrapper'
  } else {
    // --- Shape B: singolo <Link ...>...</Link> senza wrapper, subito prima dell'anchor ---
    const linkRe = /<Link\b[^>]*>[\s\S]*?<\/Link>/g
    let lm, lastLink = null
    while ((lm = linkRe.exec(before)) !== null) lastLink = lm
    if (!lastLink) return { status: 'skip', reason: 'nessun blocco riconosciuto' }
    const afterLink = content.slice(lastLink.index + lastLink[0].length, debugIdx)
    if (!/^\s*$/.test(afterLink)) {
      return { status: 'skip', reason: 'contenuto inatteso dopo il link singolo' }
    }
    blockStart = lastLink.index
    blockEnd = lastLink.index + lastLink[0].length
    inner = lastLink[0]
    mode = 'single-link'
  }

  inner = stripFlex1(inner).trim()
  // Indentazione presa dalla riga originale del blocco (non fissa), così
  // combacia con lo stile del file invece di un valore arbitrario.
  // L'indentazione originale prima di blockStart resta già nel prefisso
  // (content.slice(0, blockStart)) — la prima riga del nuovo blocco NON deve
  // ripeterla, solo le righe successive la usano per l'allineamento.
  const lineStart = content.lastIndexOf('\n', blockStart) + 1
  const indent = content.slice(lineStart, blockStart)
  const newBlock =
`<StickyBottomBarContent>
${inner.split('\n').map(l => indent + '  ' + l.trim()).join('\n')}
${indent}</StickyBottomBarContent>`

  let result = content.slice(0, blockStart) + newBlock + content.slice(blockEnd)
  result = addImportAfterLastImport(result, STICKY_IMPORT)

  // --- Stellina accanto al breadcrumb (sulla stessa riga del testo, non su una riga a parte) ---
  const breadcrumbRe = /(<p className="fs-12" style=\{\{ color: '#000', marginBottom: 8, textShadow: 'none' \}\}>[\s\S]*?)(\s*)(<\/p>)/
  const bm = result.match(breadcrumbRe)
  if (bm && !result.includes('<ShortcutStar')) {
    result = result.replace(breadcrumbRe, (_full, textPart, _ws, closeTag) => `${textPart}<ShortcutStar />\n      ${closeTag}`)
    result = addImportAfterLastImport(result, STAR_IMPORT)
  }

  return { status: 'ok', result, mode, breadcrumbFound: !!bm }
}

// --- Main ---
const raw = execSync('grep -rl \'IsDebug\' app --include="page.tsx"', { cwd: process.cwd() }).toString().trim()
const files = raw.split('\n').filter(f => f && !f.replace(/\\/g, '/').includes('/app/app/'))

console.log(`File candidati: ${files.length}`)

let ok = 0
const skipped = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const res = migrate(content, file)
  if (res.status === 'skip') {
    skipped.push({ file, reason: res.reason })
    continue
  }
  fs.writeFileSync(file, res.result, 'utf8')
  ok++
  console.log(`✓ ${file} [${res.mode}]${res.breadcrumbFound ? '' : ' (NESSUN BREADCRUMB TROVATO — stellina non inserita)'}`)
}

console.log(`\nOK: ${ok}  SKIP: ${skipped.length}`)
if (skipped.length) {
  console.log('\nSaltati (da controllare a mano):')
  skipped.forEach(s => console.log(`  ${s.file}  →  ${s.reason}`))
}
