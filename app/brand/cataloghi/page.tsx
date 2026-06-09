import Link from 'next/link'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { CatalogoGrid } from './catalogo-grid'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: infissi, verande, persiane, imbotti, zanzariere e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/cataloghi' },
}

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type CategoriaCard = { id: number; nome: string; slug: string }

async function getCategorie(): Promise<CategoriaCard[]> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_categorie (
        id     INT AUTO_INCREMENT PRIMARY KEY,
        nome   VARCHAR(100) NOT NULL,
        ordine INT NOT NULL DEFAULT 0
      )
    `)
    const [colCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_categorie' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((colCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_categorie ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }

    const [rows] = await db.query(`
      SELECT
        cc.id,
        cc.nome,
        cc.listino_categoria,
        (SELECT COUNT(*) FROM listini l WHERE l.categoria = cc.listino_categoria AND l.disponibile = 1 AND l.preventivabile = 1) AS n_prev,
        (SELECT COUNT(*) FROM listini l WHERE l.categoria = cc.listino_categoria AND l.disponibile = 1 AND l.acquistabile  = 1) AS n_vend
      FROM catalogo_categorie cc
      ORDER BY cc.ordine ASC, cc.nome ASC
    `) as [{ id: number; nome: string; listino_categoria: string | null; n_prev: number; n_vend: number }[], unknown]

    return (rows as { id: number; nome: string; listino_categoria: string | null; n_prev: number; n_vend: number }[]).map(r => ({
      id: r.id,
      nome: r.nome,
      slug: toSlug(r.nome),
    }))
  } finally {
    await db.end()
  }
}



export default async function Page() {
  const cookieStore = await cookies()
  const loggedIn = !!cookieStore.get('session_user')?.value

  const categorie = await getCategorie()

  const vuoto = categorie.length === 0

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Cataloghi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Cataloghi</h1>
      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 28px', marginBottom: 8 }}>
        <p className="testo-articoli" style={{ margin: 0 }}>Consulta e scarica i cataloghi dei nostri prodotti, organizzati per categoria. Clicca su una categoria per vedere i depliant disponibili.</p>
      </div>

      {vuoto ? (
        <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <CatalogoGrid categorie={categorie} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        <Link href="/brand" className="btn-black fs-12" style={{ flex: 1 }}>
          ← Torna a Brand
        </Link>
        {!loggedIn && (
          <Link href="/aiuto/guida-preventivo" className="btn-black fs-12" style={{ flex: 1 }}>
            Vai alla guida →
          </Link>
        )}
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
