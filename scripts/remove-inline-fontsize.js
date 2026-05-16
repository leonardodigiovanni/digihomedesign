// One-time script: removes inline fontSize from vetrina/brand/aiuto pages
// Run with: node scripts/remove-inline-fontsize.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── String replacements (exact, order matters for overlapping patterns) ──
const replacements = [
  // Outer container divs
  [`<div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>`,
   `<div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>`],
  [`<div style={{ maxWidth: 1000, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>`,
   `<div className="fs-15" style={{ maxWidth: 1000, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>`],

  // Breadcrumb p
  [`style={{ fontSize: 12, color: '#000', marginBottom: 8, textShadow: 'none' }}`,
   `className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}`],

  // h1 effetto-3d (various marginBottom)
  [`className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}`,
   `className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}`],
  [`className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}`,
   `className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}`],
  [`className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}`,
   `className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}`],
  [`className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, marginTop: 0 }}`,
   `className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 24, marginTop: 0 }}`],

  // h3 effetto-3d (aiuto pages)
  [`className="effetto-3d" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}`,
   `className="effetto-3d fs-16" style={{ fontWeight: 700, marginBottom: 12 }}`],
  [`className="effetto-3d" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}`,
   `className="effetto-3d fs-16" style={{ fontWeight: 700, marginBottom: 16 }}`],

  // h2 cataloghi effetto-3d
  [`className="effetto-3d" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}`,
   `className="effetto-3d fs-20" style={{ fontWeight: 700, margin: 0 }}`],

  // Image captions (ombra-semplice-chiaro)
  [`className="ombra-semplice-chiaro" style={{ fontSize: 15, fontWeight: 600 }}`,
   `className="ombra-semplice-chiaro fs-15" style={{ fontWeight: 600 }}`],

  // aiuto subtitle
  [`className="sottotitolo-3d" style={{ fontSize: 14, marginBottom: 32 }}`,
   `className="sottotitolo-3d fs-14" style={{ marginBottom: 32 }}`],

  // CTA text
  [`style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}`,
   `className="fs-14" style={{ fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}`],

  // Back links
  [`style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline', fontSize: 12 }}`,
   `className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}`],
  [`style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline', fontSize: 12 }}`,
   `className="fs-12" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}`],

  // Category card label
  [`style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}`,
   `className="fs-17" style={{ fontWeight: 700, marginBottom: 8 }}`],

  // Category card desc / aiuto item desc
  [`style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}`,
   `className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}`],

  // aiuto body text
  [`style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }}`,
   `className="fs-14" style={{ color: '#444', lineHeight: 1.8 }}`],

  // aiuto diamond icon
  [`style={{ color: '#c8960c', fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}`,
   `className="fs-18" style={{ color: '#c8960c', flexShrink: 0, lineHeight: 1.4 }}`],

  // aiuto item title (fontWeight first)
  [`style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}`,
   `className="fs-14" style={{ fontWeight: 600, marginBottom: 2 }}`],

  // aiuto section heading
  [`style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: 0 }}`,
   `className="fs-15" style={{ fontWeight: 600, color: '#1a1a1a', margin: 0 }}`],

  // aiuto section desc
  [`style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.6 }}`,
   `className="fs-14" style={{ color: '#555', margin: 0, lineHeight: 1.6 }}`],

  // aiuto small notes
  [`style={{ fontSize: 11, color: '#aaa', margin: '12px 0 0' }}`,
   `className="fs-11" style={{ color: '#aaa', margin: '12px 0 0' }}`],
  [`style={{ fontSize: 11, color: '#aaa', margin: '4px 0 0' }}`,
   `className="fs-11" style={{ color: '#aaa', margin: '4px 0 0' }}`],

  // aiuto/brand underline links (with and without trailing space)
  [`style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}`,
   `className="fs-12" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}`],
  [`style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline'}}`,
   `className="fs-12" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline'}}`],

  // storia hearts
  [`style={{ color: '#8c0808', fontSize: 36, verticalAlign: 'middle' }}`,
   `className="fs-36" style={{ color: '#8c0808', verticalAlign: 'middle' }}`],

  // contatti icon
  [`style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.3 }}`,
   `className="fs-22" style={{ flexShrink: 0, lineHeight: 1.3 }}`],

  // contatti label
  [`style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#999', marginBottom: 3 }}`,
   `className="fs-11" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#999', marginBottom: 3 }}`],

  // contatti value link
  [`style={{ fontSize: 14, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}`,
   `className="fs-14" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}`],

  // contatti value span
  [`style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap' }}`,
   `className="fs-14" style={{ color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap' }}`],

  // condizioni "Scarica" span
  [`style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}`,
   `className="fs-12" style={{ marginLeft: 'auto', color: '#888' }}`],

  // brand/cataloghi h2 section
  [`style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}`,
   `className="fs-18" style={{ fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}`],

  // brand/cataloghi no-catalog note
  [`style={{ color: '#aaa', fontSize: 14 }}`,
   `className="fs-14" style={{ color: '#aaa' }}`],

  // brand/cataloghi/[id] h2
  [`style={{ fontSize: 16, fontWeight: 700, margin: '40px 0 0', color: '#1a1a1a' }}`,
   `className="fs-16" style={{ fontWeight: 700, margin: '40px 0 0', color: '#1a1a1a' }}`],

  // brand/cataloghi/[id] note
  [`style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}`,
   `className="fs-13" style={{ color: '#888', margin: '2px 0 0' }}`],

  // brand/cataloghi small text
  [`style={{ margin: 0, fontSize: 12, color: '#555' }}`,
   `className="fs-12" style={{ margin: 0, color: '#555' }}`],

  // catalogo-client toolbar items
  [`style={{ fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}`,
   `className="fs-13" style={{ color: '#555', whiteSpace: 'nowrap' }}`],
  [`style={{ fontSize: 13, color: '#555', minWidth: 42, textAlign: 'center' }}`,
   `className="fs-13" style={{ color: '#555', minWidth: 42, textAlign: 'center' }}`],
  [`style={{ fontSize: 11, color: '#bbb' }}`,
   `className="fs-11" style={{ color: '#bbb' }}`],
  [`style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginTop: 10, display: 'block' }}`,
   `className="fs-13" style={{ fontWeight: 600, lineHeight: 1.3, marginTop: 10, display: 'block' }}`],
  [`style={{ fontSize: 11, color: '#888', marginTop: 2, display: 'block' }}`,
   `className="fs-11" style={{ color: '#888', marginTop: 2, display: 'block' }}`],
  [`style={{ fontSize: 11, color: isActive ? '#2b6cb0' : '#888', marginTop: 4, display: 'block' }}`,
   `className="fs-11" style={{ color: isActive ? '#2b6cb0' : '#888', marginTop: 4, display: 'block' }}`],

  // catalogo-client title span
  [`style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}`,
   `className="fs-15" style={{ fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}`],

  // aiuto button fontSize in multi-line style (indented line)
  [`              padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600,`,
   `              padding: '0 22px', height: 38, fontWeight: 600,`],
];

// ── Directories / files to process ──
function getAllTsxFiles(dirs) {
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.tsx')) files.push(full);
    }
  }
  for (const d of dirs) walk(d);
  return files;
}

const targetDirs = [
  'app/serramenti',
  'app/metallurgia',
  'app/edilizia',
  'app/elettricita',
  'app/termodinamica',
  'app/tessuti',
  'app/arredi',
  'app/legno',
  'app/servizi',
  'app/brand',
  'app/aiuto',
].map(d => path.join(ROOT, d));

const targetFiles = [
  'app/infissi/page.tsx',
  'app/verande/page.tsx',
  'app/persiane/page.tsx',
  'app/porte-corazzate/page.tsx',
  'app/strutture-metalliche/page.tsx',
  'app/ristrutturazioni-chiavi-in-mano/page.tsx',
].map(f => path.join(ROOT, f));

const allFiles = [...getAllTsxFiles(targetDirs), ...targetFiles];

let totalChanged = 0;
let totalReplacements = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  let fileReplacements = 0;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      fileReplacements++;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ ${path.relative(ROOT, file)} (${fileReplacements} replacement${fileReplacements > 1 ? 's' : ''})`);
    totalChanged++;
    totalReplacements += fileReplacements;
  }
}

console.log(`\nDone: ${totalChanged} files changed, ${totalReplacements} total replacements.`);
