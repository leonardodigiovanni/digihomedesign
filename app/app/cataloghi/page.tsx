import Link from 'next/link'
import { getConnection } from '@/lib/db'
import { CatalogoGrid } from '@/app/brand/cataloghi/catalogo-grid'
import type { CategoriaCard } from '@/app/brand/cataloghi/page'
import SetActionBar from '@/app/app/set-action-bar'
import InfoCard from '@/app/app/info-card'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { ensureCategoriaImmaginiTables, getCategorieConImmagine } from '@/lib/categoria-immagini'

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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

export default async function AppCataloghiPage() {
  const categorie = await getCategorie()

  return (
    <div className="fs-14" style={{ padding: '0 0 80px', color: '#444', lineHeight: 1.8, marginLeft: 3, marginRight: 3 }}>
      <InfoCard titolo="Cataloghi" corpo="Sfoglia i nostri cataloghi, aggiungi gli articoli che ti interessano e scegli: acquistali subito oppure usali per simulare un preventivo personalizzato per i tuoi infissi, verande o ristrutturazioni." />

      {categorie.length === 0 ? (
        <p className="fs-14" style={{ color: '#aaa', marginTop: 12 }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          <CatalogoGrid categorie={categorie} basePath="/app/cataloghi" isApp={true} />
        </div>
      )}

      <SetActionBar>
        <Link href="/app" className="btn-black-app fs-12" style={{ margin: '0 auto' }}>
          ← Torna alla home
        </Link>
      </SetActionBar>
    </div>
  )
}

