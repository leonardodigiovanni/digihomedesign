import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import {
  categoryGroups,
  standalonePages,
  clientPages,
  prodottiPages,
  comfortSpaziEsterniPages,
  antintrusioneSicurezzaPages,
  carpenteriaArredoPages,
  ristrutturazioniChiaviInManoPages,
  aiutoPages,
} from '@/lib/nav-config'

type SearchEntry = { label: string; href: string; content: string }

// Mappa un href pubblico al file page.tsx corrispondente sotto app/, tenendo conto
// dei rewrite di next.config.ts (/chi-siamo -> app/brand, /cataloghi -> app/brand/cataloghi).
function hrefToPageFile(href: string): string {
  let rel = href
  if (rel === '/cataloghi' || rel.startsWith('/cataloghi/')) {
    rel = '/brand' + rel.slice('/cataloghi'.length)
  } else if (rel === '/chi-siamo' || rel.startsWith('/chi-siamo/')) {
    rel = '/brand' + rel.slice('/chi-siamo'.length)
  }
  if (rel === '') rel = '/'
  const relPath = rel === '/' ? '' : rel
  return path.join(process.cwd(), 'app', relPath, 'page.tsx')
}

// Estrae il testo VISIBILE in pagina (i paragrafi <p className="testo-articoli">...</p>)
// invece della description SEO (che è invisibile all'utente e non sotto il suo controllo).
// Best-effort: torna stringa vuota se il file non esiste o non ha paragrafi testo-articoli.
function readPageVisibleText(href: string): string {
  try {
    const file = hrefToPageFile(href)
    const src = fs.readFileSync(file, 'utf8')
    const matches = [...src.matchAll(/<p className="testo-articoli"[^>]*>([\s\S]*?)<\/p>/g)]
    return matches
      .map(m => m[1]
        .replace(/<[^>]+>/g, ' ')        // rimuove tag interni (<strong>, <span>...)
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\{[^}]*\}/g, ' ')      // rimuove eventuali espressioni JSX residue
        .replace(/\s+/g, ' ')
        .trim()
      )
      .filter(Boolean)
      .join(' ')
  } catch {
    return ''
  }
}

let cachedIndex: SearchEntry[] | null = null

function buildIndex(): SearchEntry[] {
  if (cachedIndex) return cachedIndex

  const raw: { label: string; href: string }[] = []
  for (const group of categoryGroups) {
    for (const p of group.pages) raw.push({ label: p.label, href: p.href })
  }
  for (const list of [
    standalonePages,
    clientPages,
    prodottiPages,
    comfortSpaziEsterniPages,
    antintrusioneSicurezzaPages,
    carpenteriaArredoPages,
    ristrutturazioniChiaviInManoPages,
    aiutoPages,
  ]) {
    for (const p of list) raw.push({ label: p.label, href: p.href })
  }

  // Dedup per href (alcune liste "flat" riusano pagine già presenti in categoryGroups)
  const seen = new Set<string>()
  const deduped = raw.filter(p => {
    if (seen.has(p.href)) return false
    seen.add(p.href)
    return true
  })

  cachedIndex = deduped.map(p => ({
    label: p.label,
    href: p.href,
    content: readPageVisibleText(p.href),
  }))
  return cachedIndex
}

// Conta le occorrenze non sovrapposte di `q` dentro `text` (entrambi già lowercase).
function countOccurrences(text: string, q: string): number {
  if (!q) return 0
  return text.split(q).length - 1
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase()
  if (!q) return NextResponse.json({ results: [] })

  const index = buildIndex()
  // Ordinamento: 1° numero di occorrenze del termine (titolo+testo, più alto
  // prima), 2° match nel titolo prima di un match solo nel testo (spareggio
  // a parità di occorrenze), 3° ordine "catalogo" di nav-config.ts (implicito,
  // sort stabile).
  const results = index
    .map(e => {
      const label = e.label.toLowerCase()
      const content = e.content.toLowerCase()
      const labelHit = label.includes(q)
      const contentHit = content.includes(q)
      if (!labelHit && !contentHit) return null
      const count = countOccurrences(label, q) + countOccurrences(content, q)
      return { ...e, score: labelHit ? 2 : 1, count }
    })
    .filter((e): e is SearchEntry & { score: number; count: number } => e !== null)
    .sort((a, b) => b.count - a.count || b.score - a.score)
    .map(({ label, href, count }) => ({ label, href, count }))

  return NextResponse.json({ results })
}
