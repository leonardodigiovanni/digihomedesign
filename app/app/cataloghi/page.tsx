import Link from 'next/link'
import { getConnection } from '@/lib/db'
import { CatalogoGrid } from '@/app/brand/cataloghi/catalogo-grid'
import type { CategoriaCard } from '@/app/brand/cataloghi/page'
import SetActionBar from '@/app/app/set-action-bar'

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
    const [rows] = await db.query(`SELECT cc.id, cc.nome FROM catalogo_categorie cc ORDER BY cc.ordine ASC, cc.nome ASC`) as [{ id: number; nome: string }[], unknown]
    return rows.map(r => ({ id: r.id, nome: r.nome, slug: toSlug(r.nome) }))
  } finally {
    await db.end()
  }
}

export default async function AppCataloghiPage() {
  const categorie = await getCategorie()

  return (
    <div className="fs-14" style={{ padding: '0 0 80px', color: '#444', lineHeight: 1.8 }}>
      <div style={{ background: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: '12px', marginBottom: 12, marginLeft: 3, marginRight: 3 }}>
        <p className="app-card-title">Cataloghi</p>
        <p className="app-card-body">Sfoglia i nostri cataloghi, aggiungi gli articoli che ti interessano e scegli: acquistali subito oppure usali per simulare un preventivo personalizzato per i tuoi infissi, verande o ristrutturazioni.</p>
      </div>

      {categorie.length === 0 ? (
        <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <CatalogoGrid categorie={categorie} basePath="/app/cataloghi" isApp={true} />
      )}

      <SetActionBar>
        <Link href="/app" className="btn-black-app fs-12" style={{ margin: '0 auto' }}>
          ← Torna alla home
        </Link>
      </SetActionBar>
    </div>
  )
}

