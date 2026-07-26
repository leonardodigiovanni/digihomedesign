import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import AggiungiArticolo, { type ArticoloListino } from '../../aggiungi-articolo'
import VoceViewer from './voce-viewer'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'
import { LISTINO_COLS } from '@/lib/catalogo-matching'
import { ensurePercorsiTables } from '@/lib/percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

type Props = { params: Promise<{ slug: string; sottoSlug: string; voceSlug: string }> }

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const LABEL_GENERALE = 'Generale'

async function getData(slug: string, sottoSlug: string, voceSlug: string) {
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

    const [vociRows] = await db.query(`
      SELECT DISTINCT cv.id, cv.nome, cv.pdf_filename, cv.pdf_label
      FROM catalogo_voci cv
      JOIN catalogo_voci_percorsi vp ON vp.voce_id = cv.id
      WHERE vp.categoria = ? AND vp.sottocategoria = ?
      ORDER BY cv.nome ASC
    `, [catNome, sottoNome])
    const voceId = parseInt(voceSlug)
    const voce = (vociRows as { id: number; nome: string; pdf_filename: string; pdf_label: string }[])
      .find(v => isNaN(voceId) ? toSlug(v.nome) === voceSlug : v.id === voceId)
    if (!voce) return null

    return { categoria: { nome: catNome }, sottocategoria: { nome: sottoNome, label: sottoNome || LABEL_GENERALE }, voce }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sottoSlug, voceSlug } = await params
  const data = await getData(slug, sottoSlug, voceSlug)
  if (!data) return { title: 'Catalogo non trovato' }
  const { categoria, sottocategoria, voce } = data
  return {
    title: `${voce.pdf_label || voce.nome} — ${categoria.nome} — ${sottocategoria.label} — Digi Home Design Palermo`,
    robots: { index: false },
  }
}

export default async function Page({ params }: Props) {
  const { slug, sottoSlug, voceSlug } = await params
  const data = await getData(slug, sottoSlug, voceSlug)
  if (!data) notFound()
  const { categoria, sottocategoria, voce } = data

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
          FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
          WHERE p.stato IN ('bozza','richiesto')
          ORDER BY p.data DESC, p.id DESC
        `) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      } else {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione, '' AS cliente_nome
          FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
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

  let articoliPreventivo: ArticoloListino[] = []
  {
    const dbA = await getConnection()
    try {
      await dbA.execute(`ALTER TABLE listini ADD COLUMN principale    TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN Filtro_1      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN Filtro_2      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN Filtro_3      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN Filtro_4      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL`).catch(() => {})
      await ensurePercorsiTables(dbA)
      const principaleCol = parentPendente ? 'caratteristica' : 'principale'
      const [rows] = await dbA.query(
        `SELECT ${LISTINO_COLS} FROM listini
         WHERE disponibile = 1 AND preventivabile = 1 AND ${principaleCol} = 1
           AND id IN (
             SELECT lp.listino_id FROM listini_percorsi lp
             JOIN catalogo_voci_percorsi vp ON vp.categoria = lp.categoria AND vp.sottocategoria = lp.sottocategoria
             WHERE vp.voce_id = ?
           )
         ORDER BY descrizione ASC`,
        [voce.id]
      )
      articoliPreventivo = rows as ArticoloListino[]
      if (parentPendente && lacuneAperte.length > 0) {
        articoliPreventivo = articoliPreventivo.filter(a =>
          lacuneAperte.some(l =>
            (l === 'tipo_colore'    && a.richiede_tipo_colore    === 1) ||
            (l === 'tipo_vetro'     && a.richiede_tipo_vetro     === 1) ||
            (l === 'tipo_montaggio' && a.richiede_tipo_montaggio === 1)
          )
        )
      }
    } catch {}
    finally { await dbA.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/cataloghi" style={{ color: '#888', textDecoration: 'underline' }}>Cataloghi</Link>
        {' / '}
        <Link href={`/cataloghi/${slug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria.nome}</Link>
        {' / '}
        <Link href={`/cataloghi/${slug}/${sottoSlug}`} style={{ color: '#888', textDecoration: 'underline' }}>{sottocategoria.label}</Link>
        {' / '}{voce.pdf_label || voce.nome}<ShortcutStar />
      </p>
      <VoceViewer voce={voce} backHref={`/cataloghi/${slug}/${sottoSlug}`} />

      {articoliPreventivo.length > 0 && (
        <>
          <AggiungiArticolo
            articoli={articoliPreventivo}
            isStaff={isStaff}
            isLoggedIn={!!username}
            preventiviBozza={preventiviBozza}
            cartNonVuoto={cartNonVuoto}
            parentPendente={parentPendente}
            submitLabel="Conferma"
          />
        </>
      )}

      <StickyBottomBarContent>
        <Link href={`/cataloghi/${slug}/${sottoSlug}`} className="btn-black fs-12">
          ← Torna a cataloghi
        </Link>
        {cartNonVuoto && (
          <Link href="/area-clienti/carrello-preventivo" className="btn-black fs-12">
            Vai alla simulazione →
          </Link>
        )}
      </StickyBottomBarContent>
    </div>
  )
}
