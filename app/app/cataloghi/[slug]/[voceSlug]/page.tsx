import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import AggiungiArticolo, { type ArticoloListino } from '@/app/brand/cataloghi/[slug]/aggiungi-articolo'
import VoceViewer from '@/app/brand/cataloghi/[slug]/[voceSlug]/voce-viewer'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Props = { params: Promise<{ slug: string; voceSlug: string }> }

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getData(slug: string, voceSlug: string) {
  const db = await getConnection()
  try {
    const [colCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_categorie' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((colCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_categorie ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }

    const [cats] = await db.query('SELECT id, nome, listino_categoria FROM catalogo_categorie')
    const categoria = (cats as { id: number; nome: string; listino_categoria: string | null }[]).find(c => toSlug(c.nome) === slug)
    if (!categoria) return null

    const [voci] = await db.query(
      'SELECT id, nome, pdf_filename, pdf_label, listino_categoria FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
      [categoria.id]
    )
    const voce = (voci as { id: number; nome: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null }[])
      .find(v => toSlug(v.nome) === voceSlug)
    if (!voce) return null

    return { categoria, voce }
  } finally {
    await db.end()
  }
}

export default async function Page({ params }: Props) {
  const { slug, voceSlug } = await params
  const data = await getData(slug, voceSlug)
  if (!data) notFound()
  const { categoria, voce } = data

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
      const [r] = await db2.query(`
        SELECT p.id, p.numero, p.descrizione, '' AS cliente_nome
        FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
        JOIN users u ON u.username = ?
        WHERE p.stato IN ('bozza','richiesto')
          AND ((c.email = u.email) OR (p.creato_da = ? AND p.cliente_id IS NULL))
        ORDER BY p.data DESC, p.id DESC
      `, [username, username]) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
      preventiviBozza = r.map(p => {
        const parts = [p.numero || `#${p.id}`]
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
  if (voce.listino_categoria) {
    const COLS = 'id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro, richiede_tipo_montaggio, schema_url'
    const dbA = await getConnection()
    try {
      await dbA.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await dbA.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      if (!parentPendente) {
        const [rows] = await dbA.query(
          `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND principale = 1 ORDER BY descrizione ASC`,
          [voce.listino_categoria]
        )
        articoliPreventivo = rows as ArticoloListino[]
      } else if (lacuneAperte.length === 0) {
        const [rows] = await dbA.query(
          `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND caratteristica = 1 ORDER BY descrizione ASC`,
          [voce.listino_categoria]
        )
        articoliPreventivo = rows as ArticoloListino[]
      } else {
        const [rows] = await dbA.query(
          `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND caratteristica = 1 ORDER BY descrizione ASC`,
          [voce.listino_categoria]
        )
        articoliPreventivo = (rows as ArticoloListino[]).filter(a =>
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
    <div className="fs-15" style={{ padding: '0 0 80px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/app/cataloghi" style={{ color: '#888', textDecoration: 'underline' }}>Cataloghi</Link>
        {' / '}
        <Link href={`/app/cataloghi/${slug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria.nome}</Link>
        {' / '}{voce.pdf_label || voce.nome}
      </p>
      <VoceViewer voce={voce} />

      {articoliPreventivo.length > 0 && (
        <AggiungiArticolo
          articoli={articoliPreventivo}
          isStaff={isStaff}
          isLoggedIn={!!username}
          preventiviBozza={preventiviBozza}
          cartNonVuoto={cartNonVuoto}
          parentPendente={parentPendente}
          carrelloHref="/app/carrello-preventivo"
          preventivoClienteBaseHref="/app/preventivo"
          submitLabel="Conferma"
        />
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Link href={`/app/cataloghi/${slug}`} className="btn-black-app fs-12" style={{ flex: 1 }}>
          ← Torna a cataloghi
        </Link>
        {cartNonVuoto && (
          <Link href="/app/carrello-preventivo" className="btn-black-app fs-12" style={{ flex: 1 }}>
            Vai alla simulazione
          </Link>
        )}
      </div>
    </div>
  )
}
