const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', 'page.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// Match each <Link ... className="page-card" ...> ... </Link> block
// that is NOT already preceded by {ok(
// We use a regex that captures the full Link element
const linkRe = /(<Link href="([^"]+)" className="page-card"[\s\S]*?<\/Link>)/g

let result = content
let offset = 0

const matches = []
let m
while ((m = linkRe.exec(content)) !== null) {
  matches.push({ index: m.index, full: m[1], href: m[2] })
}

// Process in reverse order to preserve indices
for (let i = matches.length - 1; i >= 0; i--) {
  const { index, full, href } = matches[i]

  // Check if already wrapped with ok()
  const before = result.slice(Math.max(0, index - 30), index)
  if (before.includes('ok(')) continue

  // Detect leading whitespace of the <Link line
  const lineStart = result.lastIndexOf('\n', index - 1) + 1
  const ws = result.slice(lineStart, index).match(/^(\s*)/)[1]

  const wrapped = `{ok('${href}') && (\n${ws}${full.trim()}\n${ws})}`
  result = result.slice(0, index) + wrapped + result.slice(index + full.length)
}

fs.writeFileSync(filePath, result, 'utf-8')
console.log('Done.')
