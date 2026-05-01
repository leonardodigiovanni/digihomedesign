import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import AggiungiArticolo, { type ArticoloListino } from './aggiungi-articolo'
import AggiungiArticoloAcquisto from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import CatalogoWrapper from './catalogo-wrapper'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Props = { params: Promise<{ id: string }> }

async function getData(id: number) {
  const db = await getConnection()
  try {
    const [colCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_categorie' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((colCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_categorie ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }

    const [cats] = await db.execute(
      'SELECT id, nome, listino_categoria FROM catalogo_categorie WHERE id = ? LIMIT 1',
      [id]
    )
    const categoria = (cats as { id: number; nome: string; listino_categoria: string | null }[])[0]
    if (!categoria) return null

    const [voci] = await db.query(
      'SELECT id, nome, pdf_filename, pdf_label FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
      [id]
    )

    let articoliPreventivo: ArticoloListino[] = []
    let articoliAcquisto: ArticoloListinoAcquisto[] = []
    if (categoria.listino_categoria) {
      try {
        const [rows1] = await db.query(
          'SELECT id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 ORDER BY descrizione ASC',
          [categoria.listino_categoria]
        )
        articoliPreventivo = rows1 as ArticoloListino[]

        const [rows2] = await db.query(
          'SELECT id, descrizione, produttore, unita, prezzo_vendita, max_acquistabile FROM listini WHERE categoria = ? AND disponibile = 1 AND acquistabile = 1 ORDER BY descrizione ASC',
          [categoria.listino_categoria]
        )
        articoliAcquisto = (rows2 as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
          ...r,
          max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
        }))
      } catch {}
    }

    return {
      categoria,
      voci: voci as { id: number; nome: string; pdf_filename: string; pdf_label: string }[],
      articoliPreventivo,
      articoliAcquisto,
    }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const data = await getData(parseInt(id))
  if (!data) return { title: 'Categoria non trovata' }
  return {
    title: `Cataloghi ${data.categoria.nome} — Digi Home Design Palermo`,
    description: `Scarica i cataloghi PDF per la categoria ${data.categoria.nome}: depliant e schede tecniche dei prodotti Digi Home Design.`,
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const data = await getData(parseInt(id))
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
  if (parentCookieStr) {
    try {
      const p = JSON.parse(parentCookieStr) as { uid: number; desc: string }
      if (p.uid && p.desc) parentPendente = p
    } catch {}
  }

  const { categoria, voci, articoliPreventivo, articoliAcquisto } = data

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 12, color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link>
        {' / '}
        <Link href="/brand/cataloghi" style={{ color: '#888', textDecoration: 'underline' }}>Cataloghi</Link>
        {' / '}{categoria.nome}
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {categoria.nome}
      </h1>
      <p style={{ marginBottom: 32 }}>
        Clicca su un catalogo per scaricarlo in formato PDF.
      </p>

      <CatalogoWrapper voci={voci} />

      {articoliPreventivo.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '40px 0 0', color: '#1a1a1a' }}>
            Articoli da preventivare
          </h2>
          <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>
            Questi articoli vengono aggiunti al carrello preventivo per ricevere un preventivo personalizzato.
          </p>
          <AggiungiArticolo articoli={articoliPreventivo} isStaff={isStaff} preventiviBozza={preventiviBozza} cartNonVuoto={cartNonVuoto} parentPendente={parentPendente} />
        </>
      )}

      {articoliAcquisto.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '40px 0 0', color: '#1a1a1a' }}>
            Articoli acquistabili
          </h2>
          <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>
            Questi articoli sono disponibili per l&apos;acquisto diretto.
          </p>
          <AggiungiArticoloAcquisto articoli={articoliAcquisto} />
        </>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 40 }}>
        <Link href="/brand/cataloghi" style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline', fontSize: 12 }}>
          ← Torna ai Cataloghi
        </Link>
        {cartNonVuoto && (
          <Link href="/area-clienti/carrello-preventivo" style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
            Vai al Carrello preventivi →
          </Link>
        )}
      </div>
    </div>
  )
}
