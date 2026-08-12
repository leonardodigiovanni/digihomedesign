import { getConnection } from '@/lib/db'
import { categoryGroups, clientPages, standalonePages, prodottiPages, comfortSpaziEsterniPages, antintrusioneSicurezzaPages, carpenteriaArredoPages, ristrutturazioniChiaviInManoPages, areaClientiPages, aiutoPages, matchesPage } from '@/lib/nav-config'

export type VisitBucket = 'sloggato' | 'cliente'

export type PageVisitStats = { sloggato: number; cliente: number; minuti: number }
export type PageShortcutStats = { attive: number; cancellate: number }

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      href             VARCHAR(255) NOT NULL,
      bucket           ENUM('sloggato','cliente') NOT NULL,
      visits           INT NOT NULL DEFAULT 0,
      total_dwell_min  DECIMAL(12,2) NOT NULL DEFAULT 0,
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_href_bucket (href, bucket)
    )
  `)
  await db.end()
}

export async function recordVisit(href: string, bucket: VisitBucket): Promise<void> {
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      `INSERT INTO page_visits (href, bucket, visits) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE visits = visits + 1`,
      [href, bucket]
    )
  } finally {
    await db.end()
  }
}

export async function recordDwell(href: string, bucket: VisitBucket, minutes: number): Promise<void> {
  if (!(minutes > 0)) return
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      `INSERT INTO page_visits (href, bucket, total_dwell_min) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE total_dwell_min = total_dwell_min + VALUES(total_dwell_min)`,
      [href, bucket, minutes]
    )
  } finally {
    await db.end()
  }
}

/** Numeri per pagina per il pannello "Pagine visibili": visite sloggato/cliente + minuti totali (somma dei due bucket). */
export async function getVisitStats(): Promise<Record<string, PageVisitStats>> {
  await ensureTable()
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT href, bucket, visits, total_dwell_min FROM page_visits'
    ) as [{ href: string; bucket: VisitBucket; visits: number; total_dwell_min: string }[], unknown]

    const stats: Record<string, PageVisitStats> = {}
    for (const row of rows) {
      const entry = stats[row.href] ?? { sloggato: 0, cliente: 0, minuti: 0 }
      entry[row.bucket] = Number(row.visits) || 0
      entry.minuti += Number(row.total_dwell_min) || 0
      stats[row.href] = entry
    }
    return stats
  } finally {
    await db.end()
  }
}

// Href "canoniche" note al pannello Pagine visibili (hub categoria + sotto-pagine
// + Brand + Voci singole + Prodotti + i menu flat (Comfort/Antintrusione/Carpenteria/
// Ristrutturazioni, aggiunti 2026-08-12 — mancavano, le visite a quelle pagine non
// risultavano riconosciute) + Area Personale + Aiuto), ordinate dalla più lunga alla
// più corta così una sotto-pagina dinamica combacia sempre con la voce più specifica.
const KNOWN_PAGE_HREFS: string[] = [
  ...categoryGroups.map(g => g.href),
  ...categoryGroups.flatMap(g => g.pages.map(p => p.href)),
  ...clientPages.map(p => p.href),
  ...standalonePages.map(p => p.href),
  ...prodottiPages.map(p => p.href),
  ...comfortSpaziEsterniPages.map(p => p.href),
  ...antintrusioneSicurezzaPages.map(p => p.href),
  ...carpenteriaArredoPages.map(p => p.href),
  ...ristrutturazioniChiaviInManoPages.map(p => p.href),
  ...areaClientiPages.map(p => p.href),
  ...aiutoPages.map(p => p.href),
].sort((a, b) => b.length - a.length)

// Fa confluire varianti dinamiche (/pagina/dettaglio, /pagina?query=x) nella
// pagina madre nota, così una scorciatoia su /area-clienti/ordini/4 conta
// insieme a quelle su /area-clienti/ordini. Se non trova nessuna pagina nota
// (es. i carrelli, che non sono voci di menu), lascia l'href originale.
function resolveCanonicalHref(href: string): string {
  return KNOWN_PAGE_HREFS.find(known => matchesPage(href, known)) ?? href
}

/**
 * Scorciatoie home attive/cancellate per pagina, dalla tabella home_shortcuts
 * già esistente. Solo quelle create da utenti cliente — dipendenti/admin
 * escluse (stessa regola delle visite: non è traffico/interesse SEO).
 */
export async function getShortcutStats(): Promise<Record<string, PageShortcutStats>> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(`
      SELECT hs.href, hs.cancellato
      FROM home_shortcuts hs
      JOIN users u ON u.username = hs.username
      WHERE u.role = 'cliente'
    `) as [{ href: string; cancellato: number }[], unknown]

    const stats: Record<string, PageShortcutStats> = {}
    for (const row of rows) {
      const canonical = resolveCanonicalHref(row.href)
      const entry = stats[canonical] ?? { attive: 0, cancellate: 0 }
      if (row.cancellato) entry.cancellate += 1
      else entry.attive += 1
      stats[canonical] = entry
    }
    return stats
  } catch {
    // home_shortcuts potrebbe non esistere ancora (nessuna scorciatoia mai creata)
    return {}
  } finally {
    await db.end()
  }
}
