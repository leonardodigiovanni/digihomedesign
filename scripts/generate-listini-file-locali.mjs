import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'listini')
const outFile = path.join(__dirname, '..', 'lib', 'listini-file-locali.ts')

const files = fs.readdirSync(dir)
  .filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b))
  .map(f => `/listini/${f}`)

const content = `// Generato automaticamente da scripts/generate-listini-file-locali.mjs — non modificare a mano.
// Rieseguito prima di ogni build/dev (vedi package.json), cosi' resta in sync con
// public/listini senza dipendere da fs.readdirSync a runtime (in produzione su
// Vercel public/** e' escluso dal bundle serverless).
export const LISTINI_FILE_LOCALI: string[] = ${JSON.stringify(files, null, 2)}
`

fs.writeFileSync(outFile, content)
console.log(`[generate-listini-file-locali] ${files.length} file -> lib/listini-file-locali.ts`)
