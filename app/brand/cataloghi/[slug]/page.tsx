import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { type ArticoloListino } from './aggiungi-articolo'
import AggiungiArticoloAcquisto from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import CatalogoWrapper from './catalogo-wrapper'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Props = { params: Promise<{ slug: string }> }

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getData(slug: string) {
  const db = await getConnection()
  try {
    const [colCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_categorie' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((colCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_categorie ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }

    const [cats] = await db.query('SELECT id, nome, listino_categoria FROM catalogo_categorie')
    const allCats = cats as { id: number; nome: string; listino_categoria: string | null }[]
    const categoria = allCats.find(c => toSlug(c.nome) === slug)
    if (!categoria) return null

    const [descrCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_voci' AND COLUMN_NAME = 'descrizione'`
    ) as [{ cnt: number }[], unknown]
    if ((descrCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NULL`)
    }
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_battente TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_scorrevole TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_termico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_freddo TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_economico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_fascia_alta TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})

    const [voci] = await db.query(
      'SELECT id, nome, pdf_filename, pdf_label, listino_categoria, descrizione, filtro_battente, filtro_scorrevole, filtro_taglio_termico, filtro_taglio_freddo, filtro_economico, filtro_fascia_alta FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
      [categoria.id]
    )

    const acquistoCats = new Set<string>()
    if (categoria.listino_categoria) acquistoCats.add(categoria.listino_categoria)
    for (const v of voci as { listino_categoria: string | null }[]) {
      if (v.listino_categoria) acquistoCats.add(v.listino_categoria)
    }
    let articoliAcquisto: ArticoloListinoAcquisto[] = []
    if (acquistoCats.size > 0) {
      try {
        const cats = [...acquistoCats]
        const ph = cats.map(() => '?').join(',')
        const [rows2] = await db.query(
          `SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile FROM listini WHERE categoria IN (${ph}) AND disponibile = 1 AND acquistabile = 1 ORDER BY descrizione ASC`,
          cats
        )
        articoliAcquisto = (rows2 as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
          ...r,
          max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
        }))
      } catch {}
    }

    return {
      categoria,
      voci: voci as { id: number; nome: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null; descrizione: string | null; filtro_battente: number; filtro_scorrevole: number; filtro_taglio_termico: number; filtro_taglio_freddo: number; filtro_economico: number; filtro_fascia_alta: number }[],
      articoliAcquisto,
    }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) return { title: 'Categoria non trovata' }
  return {
    title: `Cataloghi ${data.categoria.nome} — Digi Home Design Palermo`,
    description: `Scarica i cataloghi PDF per la categoria ${data.categoria.nome}: depliant e schede tecniche dei prodotti Digi Home Design.`,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const data = await getData(slug)
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

  const { categoria, voci, articoliAcquisto } = data

  // Collect all unique listino_categoria values from categoria + voci
  const allListiniSet = new Set<string>()
  if (categoria.listino_categoria) allListiniSet.add(categoria.listino_categoria)
  for (const v of voci) { if (v.listino_categoria) allListiniSet.add(v.listino_categoria) }

  const COLS = 'id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro, richiede_tipo_montaggio, schema_url, max_acquistabile'
  const articoliPerListino: Record<string, ArticoloListino[]> = {}
  if (allListiniSet.size > 0) {
    const dbL = await getConnection()
    try {
      await dbL.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      for (const listino of allListiniSet) {
        try {
          let articoli: ArticoloListino[]
          if (!parentPendente) {
            const [rows] = await dbL.query(
              `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND principale = 1 ORDER BY descrizione ASC`,
              [listino]
            )
            articoli = rows as ArticoloListino[]
          } else if (lacuneAperte.length === 0) {
            const [rows] = await dbL.query(
              `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND caratteristica = 1 ORDER BY descrizione ASC`,
              [listino]
            )
            articoli = rows as ArticoloListino[]
          } else {
            const [rows] = await dbL.query(
              `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND caratteristica = 1 ORDER BY descrizione ASC`,
              [listino]
            )
            articoli = (rows as ArticoloListino[]).filter(a =>
              lacuneAperte.some(l =>
                (l === 'tipo_colore'    && a.richiede_tipo_colore    === 1) ||
                (l === 'tipo_vetro'     && a.richiede_tipo_vetro     === 1) ||
                (l === 'tipo_montaggio' && a.richiede_tipo_montaggio === 1)
              )
            )
          }
          articoliPerListino[listino] = articoli
        } catch {}
      }
    } finally { await dbL.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link>
        {' / '}
        <Link href="/brand/cataloghi" style={{ color: '#888', textDecoration: 'underline' }}>Cataloghi</Link>
        {' / '}{categoria.nome}
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>
        {categoria.nome}
      </h1>
      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 28px', marginBottom: 8 }}>
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
        submitLabel="Conferma"
        mostraFiltri={slug === 'infissi-in-alluminio'}
      />

      {articoliAcquisto.length > 0 && (
        <>
          <h2 className="fs-16" style={{ fontWeight: 700, margin: '8px 0 0', color: '#1a1a1a' }}>
            Articoli acquistabili
          </h2>
          <p className="fs-13" style={{ color: '#888', margin: '2px 0 0' }}>
            Questi articoli sono disponibili per l&apos;acquisto diretto.
          </p>
          <div style={{ marginTop: 8 }}><AggiungiArticoloAcquisto articoli={articoliAcquisto} /></div>
        </>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        <Link href="/brand/cataloghi" className="btn-black fs-12" style={{ flex: 1 }}>
          ← Torna ai Cataloghi
        </Link>
        {cartNonVuoto && (
          <Link href="/area-clienti/carrello-preventivo" className="btn-black fs-12" style={{ flex: 1 }}>
            Vai alla simulazione
          </Link>
        )}
      </div>
    </div>
  )
}
