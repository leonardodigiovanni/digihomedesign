import Link from 'next/link'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { CatalogoGrid } from './catalogo-grid'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { ensureCategoriaImmaginiTables, getCategorieConImmagine } from '@/lib/categoria-immagini'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getStandaloneNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: infissi, verande, persiane, monoblocchi, zanzariere e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/cataloghi' },
}

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export type CategoriaCard = { id: number; nome: string; slug: string; immagine: string | null }

async function getCategorie(): Promise<CategoriaCard[]> {
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)
    await ensureCategoriaImmaginiTables(db)
    const righe = await getCategorieConImmagine(db, 'cataloghi')
    return righe.map((r, i) => ({
      id: i,
      nome: r.categoria,
      slug: toSlug(r.categoria),
      immagine: r.immagine_url,
    }))
  } finally {
    await db.end()
  }
}



export default async function Page() {
  const cookieStore = await cookies()
  const loggedIn = !!cookieStore.get('session_user')?.value
  const { disabledPages } = await readSettings()
  const { prev, next } = getStandaloneNeighbors(38, disabledPages)

  const categorie = await getCategorie()

  const vuoto = categorie.length === 0

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Cataloghi<ShortcutStar />
      </p>
      {vuoto ? (
        <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <CatalogoGrid categorie={categorie} />
      )}

      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">
        ← Home
        </Link>
        {prev && <Link href={prev.href} className="btn-gold fs-12">← {prev.label}</Link>}
        {next ? <Link href={next.href} className="btn-gold fs-12">{next.label} →</Link> : <NavDropdownTriggerButton dropdownId="cat-serramenti" label="Serramenti →" />}
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
