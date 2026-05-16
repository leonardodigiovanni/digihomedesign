import Link from 'next/link'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: infissi, verande, persiane, imbotti, zanzariere e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/cataloghi' },
}

type CategoriaCard = { id: number; nome: string; haPreventivi: boolean; haVendita: boolean }

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
      haPreventivi: Number(r.n_prev) > 0,
      haVendita: Number(r.n_vend) > 0,
    }))
  } finally {
    await db.end()
  }
}

function CardLink({ c }: { c: CategoriaCard }) {
  return (
    <Link
      href={`/brand/cataloghi/${c.id}`}
      className="fs-16"
      style={{
        flex: '1 1 200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 10,
        textDecoration: 'none',
        color: '#1a1a1a',
        fontWeight: 600,
        textAlign: 'center',
        padding: '20px 16px',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      {c.nome}
    </Link>
  )
}

function Zona({ titolo, categorie, nota }: { titolo: string; categorie: CategoriaCard[]; nota?: React.ReactNode }) {
  if (categorie.length === 0) return null
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 className="effetto-3d fs-28" style={{ fontWeight: 700, margin: '0 0 6px' }}>{titolo}</h2>
      {nota && <div style={{ marginBottom: 12 }}>{nota}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {categorie.map(c => <CardLink key={c.id} c={c} />)}
      </div>
    </div>
  )
}

export default async function Page() {
  const cookieStore = await cookies()
  const loggedIn = !!cookieStore.get('session_user')?.value

  const categorie = await getCategorie()

  const perPreventivi = categorie.filter(c => c.haPreventivi)
  const perVendita    = categorie.filter(c => c.haVendita)
  const altri         = categorie.filter(c => !c.haPreventivi && !c.haVendita)

  const vuoto = categorie.length === 0

  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Cataloghi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Cataloghi</h1>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', marginBottom: 32 }}>
        <p className="testo-articoli" style={{ margin: 0 }}>Consulta e scarica i cataloghi dei nostri prodotti, organizzati per categoria. Clicca su una categoria per vedere i depliant disponibili.</p>
      </div>

      {vuoto ? (
        <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <>
          <Zona titolo="Cataloghi articoli con preventivo" categorie={perPreventivi} />
          <Zona titolo="Cataloghi per vendita" categorie={perVendita} />
          <Zona titolo="Altri cataloghi"       categorie={altri} />
        </>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
        <Link href="/brand" className="fs-12" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
          ← Torna a Brand
        </Link>
        {!loggedIn && (
          <p className="fs-12" style={{ margin: 0, color: '#555' }}>
            Vuoi capire come funziona il servizio preventivi?{' '}
            <Link href="/aiuto/guida-preventivo" className="fs-12" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
              Consulta la guida →
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
