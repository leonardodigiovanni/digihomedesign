const fs = require('fs')
const path = require('path')

// Replacements: exact string → replacement
// Order matters: more specific patterns first
const replacements = [
  // Combined: remove just the deleted class, keep the rest
  ['className="neon-oro testo-banner"',         'className="testo-banner"'],
  ['className="ombra-semplice-chiaro fs-15"',   'className="fs-15"'],
  ['className="home-hero-text riquadro-bianco"', 'className="home-hero-text"'],

  // Standalone: remove entire className attribute (with leading space or newline+spaces)
  [' className="page-main"',         ''],
  [' className="ombra-semplice-chiaro"', ''],
  [' className="ombra-semplice"',    ''],
  [' className="riquadro-bianco"',   ''],
  [' className="no-print"',          ''],
  [' className="pulsa-rosso-bianco"',''],
  [' className="storia-testo"',      ''],
]

function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue
      walkDir(full, callback)
    } else if (entry.isFile() && (full.endsWith('.tsx') || full.endsWith('.ts'))) {
      callback(full)
    }
  }
}

const root = path.join(__dirname, '..')
let filesChanged = 0
let totalReplacements = 0

walkDir(root, filePath => {
  let src = fs.readFileSync(filePath, 'utf8')
  let changed = false
  let fileReplacements = 0

  for (const [from, to] of replacements) {
    let next = src
    while (next.includes(from)) {
      next = next.replace(from, to)
      fileReplacements++
    }
    if (next !== src) {
      src = next
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8')
    filesChanged++
    totalReplacements += fileReplacements
    console.log(`  ${path.relative(root, filePath)} (${fileReplacements} replacements)`)
  }
})

console.log(`\nDone: ${filesChanged} files changed, ${totalReplacements} replacements total`)
