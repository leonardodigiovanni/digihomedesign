// Trasforma tutte le pagine vetrina dal layout storia-row (testo|foto)
// al nuovo schema: riquadro bianco unico con card centrate in alto + testo sotto
const fs = require('fs')
const { execSync } = require('child_process')

const GAP10    = `<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>`
const TERZO    = `{/* Terzo articolo */}`
const TERZO_BOX = `<div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>`
const FLEX1    = `flex: 1, minWidth: 0 }}>`

function extractPara(source) {
  const pIdx = source.indexOf('<p ')
  if (pIdx === -1) return null
  const pTag = source.substring(pIdx)
  const openEnd = pTag.indexOf('>') + 1
  const closeTag = pTag.indexOf('</p>')
  if (closeTag === -1) return null
  return pTag.substring(openEnd, closeTag).trim()
}

function extractCard(cardSection) {
  const imgMatch = cardSection.match(/<Image src="([^"]+)" alt="([^"]+)" fill sizes="220px"/)
  if (!imgMatch) return null
  const spanMatch = cardSection.match(/<span className="testo-articoli">([^<]+)<\/span>/)
  return {
    src: imgMatch[1],
    alt: imgMatch[2],
    label: spanMatch ? spanMatch[1] : imgMatch[2], // fallback all'alt quando manca il label div
  }
}

function transform(content) {
  if (!content.includes('storia-card-1') || !content.includes('storia-row')) return null

  const sectionStart = content.indexOf(GAP10)
  if (sectionStart === -1) return null

  const terzoIdx = content.indexOf(TERZO, sectionStart)
  if (terzoIdx === -1) return null

  // trova il div del terzo articolo (subito dopo il commento)
  const terzoBoxStart = content.indexOf(TERZO_BOX, terzoIdx)
  if (terzoBoxStart === -1) return null

  // fine della sezione = fine del closing </div> del terzo box
  const afterTerzoBox = content.substring(terzoBoxStart + TERZO_BOX.length)
  const pClose  = afterTerzoBox.indexOf('</p>')
  const divClose = afterTerzoBox.indexOf('</div>', pClose)
  if (pClose === -1 || divClose === -1) return null
  const sectionEnd = terzoBoxStart + TERZO_BOX.length + divClose + 6

  const section = content.substring(sectionStart, sectionEnd)

  // --- Estrai card-1 e card-2 separatamente (con fallback label → alt) ---
  const C1 = `<div className="page-card storia-card-1"`
  const C2 = `<div className="page-card storia-card-2"`
  const c1Idx = section.indexOf(C1)
  const c2Idx = section.indexOf(C2)
  if (c1Idx === -1 || c2Idx === -1) return null

  const card1 = extractCard(section.substring(c1Idx, c2Idx))
  const card2 = extractCard(section.substring(c2Idx))
  if (!card1 || !card2) return null

  // --- Estrai para1 (primo box dentro storia-row) ---
  const flex1Idx = section.indexOf(FLEX1)
  if (flex1Idx === -1) return null
  const para1 = extractPara(section.substring(flex1Idx + FLEX1.length))
  if (!para1) return null

  // --- Estrai para2 (Secondo articolo) ---
  const SECONDO = `{/* Secondo articolo */}`
  const secondoIdx = section.indexOf(SECONDO)
  if (secondoIdx === -1) return null
  const para2 = extractPara(section.substring(secondoIdx + SECONDO.length))
  if (!para2) return null

  // --- Estrai para3 (Terzo articolo) ---
  const terzoInSection = section.indexOf(TERZO)
  const para3 = extractPara(section.substring(terzoInSection + TERZO.length))
  if (!para3) return null

  // --- Ricostruisci ---
  const newSection =
`        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 220, height: 240 }}>
                <Image src="${card1.src}" alt="${card1.alt}" fill sizes="220px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">${card1.label}</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 220, height: 240 }}>
                <Image src="${card2.src}" alt="${card2.alt}" fill sizes="220px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">${card2.label}</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              ${para1}
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              ${para2}
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              ${para3}
            </p>
          </div>

        </div>`

  return content.substring(0, sectionStart) + newSection + content.substring(sectionEnd)
}

// --- Main ---
const raw = execSync('grep -rl "storia-card-1" app --include="*.tsx"', { cwd: process.cwd() }).toString().trim()
const allFiles = raw.split('\n')

const files = allFiles.filter(f =>
  f.endsWith('page.tsx') &&
  !f.includes('brand/storia/')   // già fatto
)

console.log(`File trovati: ${files.length}`)

let ok = 0
const failed = []

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8')
    const result = transform(content)
    if (result === null) {
      failed.push({ file, reason: 'pattern non trovato o estrazione fallita' })
      continue
    }
    fs.writeFileSync(file, result, 'utf8')
    ok++
    console.log(`✓ ${file}`)
  } catch (e) {
    failed.push({ file, reason: e.message })
    console.error(`✗ ${file}: ${e.message}`)
  }
}

console.log(`\nOK: ${ok}  FAIL: ${failed.length}`)
if (failed.length) {
  console.log('\nFalliti:')
  failed.forEach(f => console.log(`  ${f.file}  →  ${f.reason}`))
}
