import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'images', 'brand', 'partners')
const outFile = path.join(__dirname, '..', 'lib', 'loghi-partners.ts')

const files = fs.readdirSync(dir)
  .filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f))
  .sort((a, b) => a.localeCompare(b))
  .map(f => `/images/brand/partners/${f}`)

const content = `// Generato automaticamente da scripts/generate-loghi-partners.mjs — non modificare a mano.
// Rieseguito prima di ogni build/dev (vedi package.json), cosi' resta in sync con
// public/images/brand/partners senza dipendere da fs.readdirSync a runtime
// (in produzione su Vercel public/** e' escluso dal bundle serverless).
export const LOGHI_PARTNERS: string[] = ${JSON.stringify(files, null, 2)}
`

fs.writeFileSync(outFile, content)
console.log(`[generate-loghi-partners] ${files.length} loghi -> lib/loghi-partners.ts`)
