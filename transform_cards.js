const fs = require('fs');
const path = require('path');

const targetFiles = [
  // tessuti
  'app/tessuti/divani/page.tsx',
  'app/tessuti/tendaggi/page.tsx',
  // arredi
  'app/arredi/lampadari/page.tsx',
  'app/arredi/quadri/page.tsx',
  'app/arredi/soprammobili/page.tsx',
  // serramenti
  'app/serramenti/avvolgibili-motorizzati/page.tsx',
  'app/serramenti/box-doccia/page.tsx',
  'app/serramenti/imbotti/page.tsx',
  'app/serramenti/infissi-in-alluminio/page.tsx',
  'app/serramenti/infissi-in-pvc/page.tsx',
  'app/serramenti/lucernai/page.tsx',
  'app/serramenti/persiane-in-alluminio/page.tsx',
  'app/serramenti/tapparelle-manuali/page.tsx',
  'app/serramenti/tapparelle-motorizzate/page.tsx',
  'app/serramenti/veneziane/page.tsx',
  'app/serramenti/verande/page.tsx',
  'app/serramenti/verande-in-alluminio/page.tsx',
  'app/serramenti/verande-in-pvc/page.tsx',
  'app/serramenti/vetrine/page.tsx',
  'app/serramenti/zanzariere/page.tsx',
  // termodinamica
  'app/termodinamica/allacci/page.tsx',
  'app/termodinamica/caldaie/page.tsx',
  'app/termodinamica/climatizzazione/page.tsx',
  'app/termodinamica/impianti-idraulici/page.tsx',
  'app/termodinamica/irrigazione/page.tsx',
  'app/termodinamica/isolamenti-acustici/page.tsx',
  'app/termodinamica/isolamenti-termici/page.tsx',
  'app/termodinamica/pompe-di-calore/page.tsx',
  // elettricita
  'app/elettricita/domotica/page.tsx',
  'app/elettricita/elettrodomestici/page.tsx',
  'app/elettricita/illuminazione/page.tsx',
  'app/elettricita/impianti-elettrici/page.tsx',
  'app/elettricita/pannelli-solari/page.tsx',
  'app/elettricita/videosorveglianza/page.tsx',
  // legno
  'app/legno/cucine/page.tsx',
  'app/legno/infissi-in-legno/page.tsx',
  'app/legno/mobili-in-massello/page.tsx',
  'app/legno/mobili-tamburati/page.tsx',
  'app/legno/parquet/page.tsx',
  'app/legno/porte-interne/page.tsx',
  'app/legno/porte-scrigno/page.tsx',
  'app/legno/rivestimento-compensato/page.tsx',
  // edilizia
  'app/edilizia/antimuffa/page.tsx',
  'app/edilizia/demolizioni/page.tsx',
  'app/edilizia/impermeabilizzazioni/page.tsx',
  'app/edilizia/indoratura/page.tsx',
  'app/edilizia/intonaci/page.tsx',
  'app/edilizia/massetti/page.tsx',
  'app/edilizia/opere-murarie/page.tsx',
  'app/edilizia/pavimenti/page.tsx',
  'app/edilizia/piastrelle/page.tsx',
  'app/edilizia/piscine/page.tsx',
  'app/edilizia/pitturazioni/page.tsx',
  'app/edilizia/pulizia-finale/page.tsx',
  'app/edilizia/sanitari/page.tsx',
  'app/edilizia/smaltimento-calcinacci/page.tsx',
  'app/edilizia/solarium/page.tsx',
  'app/edilizia/tetti/page.tsx',
  'app/edilizia/tinteggiatura/page.tsx',
  'app/edilizia/tracce/page.tsx',
  'app/edilizia/tramezzature/page.tsx',
  // metallurgia
  'app/metallurgia/armadi-blindati/page.tsx',
  'app/metallurgia/balconi/page.tsx',
  'app/metallurgia/cancelli/page.tsx',
  'app/metallurgia/casseforti/page.tsx',
  'app/metallurgia/grate/page.tsx',
  'app/metallurgia/grondaie/page.tsx',
  'app/metallurgia/pannelli-bugnato-alluminio/page.tsx',
  'app/metallurgia/porte-antincendio/page.tsx',
  'app/metallurgia/porte-blindate/page.tsx',
  'app/metallurgia/porte-corazzate/page.tsx',
  'app/metallurgia/ringhiere/page.tsx',
  'app/metallurgia/saracinesche-manuali/page.tsx',
  'app/metallurgia/saracinesche-motorizzate/page.tsx',
  'app/metallurgia/scale/page.tsx',
  'app/metallurgia/scale-a-chiocciola/page.tsx',
  'app/metallurgia/scale-a-rampe/page.tsx',
  'app/metallurgia/scale-antincendio/page.tsx',
  'app/metallurgia/strutture/page.tsx',
  'app/metallurgia/tetti-coibentati/page.tsx',
  // servizi
  'app/servizi/montaggio/page.tsx',
  'app/servizi/riparazioni/page.tsx',
  'app/servizi/manutenzione/page.tsx',
  'app/servizi/contratti-di-pulizia/page.tsx',
];

const ALREADY_DONE_MARKER = "border: '1px solid #e0e0e0'";
const STORIA_ROW_MARKER = 'storia-row';

// The exact strings we're replacing (using the indentation observed in the files)

// Pattern 1: First paragraph inside storia-row (12-space indent inside the div)
// Original: "            <p style={{ flex: 1, minWidth: 0, margin: 0 }}>"
// Replace with opening wrapper div + inner p
const P1_OLD = "            <p style={{ flex: 1, minWidth: 0, margin: 0 }}>";
const P1_NEW = "            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>\n              <p style={{ margin: 0 }}>";

// The closing </p> for paragraph 1 comes right before </div> and then <div className="storia-foto"
// We need to close the inner <p> and add </div> for the wrapper
// Original closing sequence:
//   "            </p>\n            <div className=\"storia-foto\""
// New closing sequence:
//   "              </p>\n            </div>\n            <div className=\"storia-foto\""
const P1_CLOSE_OLD = "            </p>\n            <div className=\"storia-foto\"";
const P1_CLOSE_NEW = "              </p>\n            </div>\n            <div className=\"storia-foto\"";

// Pattern 2: Second paragraph (10-space indent, inside the inner flex-column div)
// Original: "          <p style={{ margin: 0 }}>"
// Replace with wrapper div + inner p
const P2_OLD = "          <p style={{ margin: 0 }}>";
const P2_NEW = "          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>\n            <p style={{ margin: 0 }}>";

// Closing for paragraph 2: "          </p>\n\n        </div>" → "            </p>\n          </div>\n\n        </div>"
// But we need to be careful not to match </p> inside CTA
// The second paragraph closes right before the outer flex column div closes:
//   "          </p>\n\n        </div>"  (paragraph 2, then blank line, then end of inner flex-column div)
const P2_CLOSE_OLD = "          </p>\n\n        </div>";
const P2_CLOSE_NEW = "            </p>\n          </div>\n\n        </div>";

// Pattern 3: Third paragraph (8-space indent, inside the outer flex-column div)
// Original: "        <p style={{ margin: 0 }}>"
const P3_OLD = "        <p style={{ margin: 0 }}>";
const P3_NEW = "        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>\n          <p style={{ margin: 0 }}>";

// Closing for paragraph 3: "        </p>\n\n        {/* CTA */}"
const P3_CLOSE_OLD = "        </p>\n\n        {/* CTA */}";
const P3_CLOSE_NEW = "          </p>\n        </div>\n\n        {/* CTA */}";

let transformed = 0;
let skipped_already_done = 0;
let skipped_no_storia = 0;
let skipped_missing = 0;
let errors = [];

const root = __dirname;

for (const relPath of targetFiles) {
  const fullPath = path.join(root, relPath.replace(/\//g, path.sep));

  if (!fs.existsSync(fullPath)) {
    skipped_missing++;
    errors.push(`MISSING: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  if (!content.includes(STORIA_ROW_MARKER)) {
    skipped_no_storia++;
    console.log(`SKIP (no storia-row): ${relPath}`);
    continue;
  }

  if (content.includes(ALREADY_DONE_MARKER)) {
    skipped_already_done++;
    console.log(`SKIP (already done): ${relPath}`);
    continue;
  }

  let original = content;

  // Step 1: Replace paragraph 1 opening (flex paragraph inside storia-row)
  if (content.includes(P1_OLD)) {
    content = content.replace(P1_OLD, P1_NEW);
  } else {
    errors.push(`WARN: P1_OLD not found in ${relPath}`);
  }

  // Step 2: Fix closing of paragraph 1 (before storia-foto div)
  if (content.includes(P1_CLOSE_OLD)) {
    content = content.replace(P1_CLOSE_OLD, P1_CLOSE_NEW);
  } else {
    errors.push(`WARN: P1_CLOSE_OLD not found in ${relPath}`);
  }

  // Step 3: Replace paragraph 2 opening (inside inner flex-column div)
  if (content.includes(P2_OLD)) {
    content = content.replace(P2_OLD, P2_NEW);
  } else {
    errors.push(`WARN: P2_OLD not found in ${relPath}`);
  }

  // Step 4: Fix closing of paragraph 2 (before end of inner flex-column div)
  if (content.includes(P2_CLOSE_OLD)) {
    content = content.replace(P2_CLOSE_OLD, P2_CLOSE_NEW);
  } else {
    errors.push(`WARN: P2_CLOSE_OLD not found in ${relPath}`);
  }

  // Step 5: Replace paragraph 3 opening (standalone, outside inner div)
  if (content.includes(P3_OLD)) {
    content = content.replace(P3_OLD, P3_NEW);
  } else {
    errors.push(`WARN: P3_OLD not found in ${relPath}`);
  }

  // Step 6: Fix closing of paragraph 3 (before CTA)
  if (content.includes(P3_CLOSE_OLD)) {
    content = content.replace(P3_CLOSE_OLD, P3_CLOSE_NEW);
  } else {
    errors.push(`WARN: P3_CLOSE_OLD not found in ${relPath}`);
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    transformed++;
    console.log(`DONE: ${relPath}`);
  } else {
    errors.push(`WARN: No changes made to ${relPath}`);
  }
}

console.log('\n=== Summary ===');
console.log(`Transformed: ${transformed}`);
console.log(`Skipped (already done): ${skipped_already_done}`);
console.log(`Skipped (no storia-row): ${skipped_no_storia}`);
console.log(`Skipped (file missing): ${skipped_missing}`);

if (errors.length > 0) {
  console.log('\n=== Warnings/Errors ===');
  errors.forEach(e => console.log(e));
}
