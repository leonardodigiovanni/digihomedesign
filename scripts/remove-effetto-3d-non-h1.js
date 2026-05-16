const fs = require('fs')
const path = require('path')

// Remove effetto-3d from non-h1 elements (h2, h3, div, span)
// Keep it on h1 (page titles)
const replacements = [
  // h3 with effetto-3d + another class
  ['className="effetto-3d fs-16"',  'className="fs-16"'],
  ['className="effetto-3d fs-20"',  'className="fs-20"'],
  // h2/div/span standalone effetto-3d
  [' className="effetto-3d"',       ''],
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
