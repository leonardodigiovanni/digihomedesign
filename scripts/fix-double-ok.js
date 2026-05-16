const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', 'page.tsx')
let content = fs.readFileSync(filePath, 'utf-8')

// The orphaned )} only appears where two )} lines follow in sequence
// outside of comment blocks. Replace every occurrence of two consecutive
// )} lines (same indent) with a single one.
// Pattern: "        )}\n        )}" → "        )}"
content = content.replace(/        \)\}\n        \)\}/g, '        )}')

fs.writeFileSync(filePath, content, 'utf-8')
console.log('Replacements done.')
