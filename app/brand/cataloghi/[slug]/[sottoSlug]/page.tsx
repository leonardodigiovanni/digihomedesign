import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { type ArticoloListino } from '../aggiungi-articolo'
import { LISTINO_COLS } from '@/lib/catalogo-matching'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'
import { getFiltriCatalogoLabels } from '@/lib/filtri-catalogo-labels'
import AggiungiArticoloAcquisto from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import CatalogoWrapper from '../catalogo-wrapper'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Props = { params: Promise<{ slug: string; sottoSlug: string }> }

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const LABEL_GENERALE = 'Generale'

async function getData(slug: string, sottoSlug: string) {
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)

    const [catRows] = await db.query(
      `SELECT DISTINCT categoria FROM catalogo_voci_percorsi WHERE categoria != '' ORDER BY categoria ASC`
    ) as [{ categoria: string }[], unknown]
    const catNome = (catRows as { categoria: string }[]).find(r => toSlug(r.categoria) === slug)?.categoria
    if (!catNome) return null

    const [subRows] = await db.query(
      `SELECT DISTINCT sottocategoria FROM catalogo_voci_percorsi WHERE categoria = ?`,
      [catNome]
    ) as [{ sottocategoria: string }[], unknown]
    const subMatch = (subRows as { sottocategoria: string }[]).find(r => (r.sottocategoria ? toSlug(r.sottocategoria) : 'generale') === sottoSlug)
    if (subMatch === undefined) return null
    const sottoNome = subMatch.sottocategoria

    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_7 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_8 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_9 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fase VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN materiale VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN tipologia VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN ambiente VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fascia VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    const [vociRows] = await db.query(`
      SELECT cv.id, cv.nome, cv.pdf_filename, cv.pdf_label, cv.descrizione,
             cv.filtro_c1, cv.filtro_c2, cv.filtro_c3,
             cv.filtro_c4, cv.filtro_c5, cv.filtro_c6,
             ? AS sottocategoria,
             cv.fase, cv.materiale, cv.tipologia, cv.ambiente, cv.fascia,
             cv.filtro_1, cv.filtro_2, cv.filtro_3, cv.filtro_4,
             cv.filtro_5, cv.filtro_6, cv.filtro_7, cv.filtro_8, cv.filtro_9, cv.filtro_10
      FROM catalogo_voci cv
      WHERE cv.id IN (SELECT vp.voce_id FROM catalogo_voci_percorsi vp WHERE vp.categoria = ? AND vp.sottocategoria = ?)
      ORDER BY cv.nome ASC
    `, [sottoNome, catNome, sottoNome])

    const [rowsAcq] = await db.query(
      `SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile
       FROM listini WHERE disponibile = 1 AND acquistabile = 1
         AND id IN (SELECT listino_id FROM listini_percorsi WHERE categoria = ? AND sottocategoria = ?)
       ORDER BY descrizione ASC`,
      [catNome, sottoNome]
    )
    const articoliAcquisto = (rowsAcq as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
      ...r, max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
    }))

    const filtriLabels = await getFiltriModelloLabels(db)
    const filtriCatalogoLabels = await getFiltriCatalogoLabels(db)

    return {
      categoria: { nome: catNome },
      sottocategoria: { nome: sottoNome, label: sottoNome || LABEL_GENERALE },
      voci: vociRows as { id: number; nome: string; pdf_filename: string; pdf_label: string; descrizione: string | null; filtro_c1: number; filtro_c2: number; filtro_c3: number; filtro_c4: number; filtro_c5: number; filtro_c6: number; sottocategoria?: string | null; fase?: string | null; materiale?: string | null; tipologia?: string | null; ambiente?: string | null; fascia?: string | null; filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number; filtro_5?: number; filtro_6?: number; filtro_7?: number; filtro_8?: number; filtro_9?: number; filtro_10?: number }[],
      articoliAcquisto,
      filtriLabels,
      filtriCatalogoLabels,
    }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sottoSlug } = await params
  const data = await getData(slug, sottoSlug)
  if (!data) return { title: 'Categoria non trovata' }
  return {
    title: `Cataloghi ${data.categoria.nome} — ${data.sottocategoria.label} — Digi Home Design Palermo`,
    description: `Scarica i cataloghi PDF per ${data.categoria.nome} — ${data.sottocategoria.label}: depliant e schede tecniche dei prodotti Digi Home Design.`,
  }
}

export default async function Page({ params }: Props) {
  const { slug, sottoSlug } = await params
  const data = await getData(slug, sottoSlug)
  if (!data) notFound()

  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const isStaff = role === 'admin' || role === 'dipendente'
  const cartRaw = cookieStore.get('digi_cart')?.value
  const cartNonVuoto = !!cartRaw && (() => { try { const c = JSON.parse(cartRaw); return Array.isArray(c) && c.length > 0 } catch { return false } })()

  const username = cookieStore.get('session_user')?.value ?? ''
  let preventiviBozza: PreventivoDestOption[] = []
  if (username && !cartNonVuoto) {
    const db2 = await getConnection()
    try {
      let rows: { id: number; numero: string; descrizione: string; cliente_nome: string }[]
      if (isStaff) {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione,
            CASE WHEN c.id IS NULL THEN '' WHEN c.ragione_sociale != '' THEN c.ragione_sociale ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome)) END AS cliente_nome
          FROM preventivi p
          LEFT JOIN clienti c ON c.id = p.cliente_id
          WHERE p.stato IN ('bozza','richiesto')
          ORDER BY p.data DESC, p.id DESC
        `) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      } else {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione, '' AS cliente_nome
          FROM preventivi p
          LEFT JOIN clienti c ON c.id = p.cliente_id
          JOIN users u ON u.username = ?
          WHERE p.stato IN ('bozza','richiesto')
            AND ((c.email = u.email) OR (p.creato_da = ? AND p.cliente_id IS NULL))
          ORDER BY p.data DESC, p.id DESC
        `, [username, username]) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      }
      preventiviBozza = rows.map(p => {
        const parts = [p.numero || `#${p.id}`]
        if (p.cliente_nome) parts.push(p.cliente_nome)
        if (p.descrizione) parts.push(p.descrizione)
        return { id: p.id, label: parts.join(' — ') }
      })
    } catch {}
    finally { await db2.end() }
  }

  const parentCookieStr = cookieStore.get('digi_cart_parent')?.value
  let parentPendente: { uid: number; desc: string } | undefined
  let lacuneAperte: string[] = []
  if (parentCookieStr) {
    try {
      const p = JSON.parse(parentCookieStr) as { uid: number; desc: string; lacune?: string[] }
      if (p.uid && p.desc) { parentPendente = p; lacuneAperte = p.lacune ?? [] }
    } catch {}
  }

  const { categoria, sottocategoria, voci, articoliAcquisto, filtriLabels, filtriCatalogoLabels } = data

  const dbL = await getConnection()
  const articoliPerListino: Record<string, ArticoloListino[]> = {}
  try {
    // Assicura colonne listini
    await dbL.execute(`ALTER TABLE listini ADD COLUMN principale    TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_1      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_2      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_3      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_4      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_5      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_6      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_7      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_8      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_9      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN Filtro_10     TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL`).catch(() => {})
    await dbL.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL`).catch(() => {})

    await ensurePercorsiTables(dbL)

    // Pool: articoli i cui percorsi matchano la coppia esatta categoria/sottocategoria
    {
      const principaleCol = parentPendente ? 'caratteristica' : 'principale'
      const [rows] = await dbL.query(
        `SELECT ${LISTINO_COLS} FROM listini
         WHERE disponibile = 1 AND preventivabile = 1 AND ${principaleCol} = 1
           AND id IN (SELECT listino_id FROM listini_percorsi WHERE categoria = ? AND sottocategoria = ?)
         ORDER BY descrizione ASC`,
        [categoria.nome, sottocategoria.nome]
      )
      let articoli = rows as ArticoloListino[]
      if (parentPendente && lacuneAperte.length > 0) {
        articoli = articoli.filter(a =>
          lacuneAperte.some(l =>
            (l === 'tipo_colore'    && a.richiede_tipo_colore    === 1) ||
            (l === 'tipo_vetro'     && a.richiede_tipo_vetro     === 1) ||
            (l === 'tipo_montaggio' && a.richiede_tipo_montaggio === 1)
          )
        )
      }
      articoliPerListino['0'] = articoli
    }
  } catch {} finally { await dbL.end() }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/cataloghi" style={{ color: '#888', textDecoration: 'underline' }}>Cataloghi</Link>
        {' / '}
        <Link href={`/cataloghi/${slug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria.nome}</Link>
        {' / '}{sottocategoria.label}<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>
        {categoria.nome} — {sottocategoria.label}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Sfoglia i cataloghi disponibili:</p>
        </div>

        <CatalogoWrapper
          voci={voci}
          articoliPerListino={articoliPerListino}
          isStaff={isStaff}
          isLoggedIn={!!username}
          preventiviBozza={preventiviBozza}
          cartNonVuoto={cartNonVuoto}
          parentPendente={parentPendente}
          categorySlug={slug}
          fixedCat={categoria.nome}
          fixedSottocat={sottocategoria.nome || undefined}
          submitLabel="Conferma"
          filtriLabels={filtriLabels}
          filtriCatalogoLabels={filtriCatalogoLabels}
        />

        {articoliAcquisto.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 className="fs-16" style={{ fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
              Articoli acquistabili
            </h2>
            <p className="fs-13" style={{ color: '#888', margin: 0 }}>
              Questi articoli sono disponibili per l&apos;acquisto diretto.
            </p>
            <AggiungiArticoloAcquisto articoli={articoliAcquisto} />
          </div>
        )}

        <p className="IsDebug fs-11" style={{ marginTop: 8 }}>
          {`cat=${categoria.nome} | sotto=${sottocategoria.label} | voci=${voci.length} | artPool=${Object.entries(articoliPerListino).map(([k,v]) => `${k}:${v.length}`).join(' ')}`}
        </p>

        <StickyBottomBarContent>
          <Link href={`/cataloghi/${slug}`} className="btn-black fs-12">
            ← Torna a {categoria.nome}
          </Link>
          {cartNonVuoto && (
            <Link href="/area-clienti/carrello-preventivo" className="btn-black fs-12">
              Vai alla simulazione →
            </Link>
          )}
        </StickyBottomBarContent>

      </div>
    </div>
  )
}
