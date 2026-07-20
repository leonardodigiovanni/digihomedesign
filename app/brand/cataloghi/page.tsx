import Link from 'next/link'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { CatalogoGrid } from './catalogo-grid'
import { ensurePercorsiTables } from '@/lib/percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: infissi, verande, persiane, imbotti, zanzariere e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/chi-siamo/cataloghi' },
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
    await ensurePercorsiTables(db)
    const [rows] = await db.query(
      `SELECT DISTINCT categoria FROM catalogo_voci_percorsi WHERE categoria != '' ORDER BY categoria ASC`
    ) as [{ categoria: string }[], unknown]
    return (rows as { categoria: string }[]).map((r, i) => ({
      id: i,
      nome: r.categoria,
      slug: toSlug(r.categoria),
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
        <Link href="/chi-siamo" style={{ color: '#888', textDecoration: 'underline' }}>Chi Siamo</Link> / Cataloghi<ShortcutStar />
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

      <StickyBottomBarContent>
        <Link href="/chi-siamo" className="btn-black fs-12">
        ← Torna a Chi Siamo
        </Link>
        {!loggedIn && (
        <Link href="/aiuto/guida-preventivo" className="btn-black fs-12">
        Vai alla guida →
        </Link>
        )}
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
