import Link from 'next/link'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cataloghi — Digi Home Design Palermo',
  description: 'Scarica i cataloghi prodotti di Digi Home Design: infissi, verande, persiane, imbotti, zanzariere e molto altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/cataloghi' },
}

async function getCategorie() {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_categorie (
        id     INT AUTO_INCREMENT PRIMARY KEY,
        nome   VARCHAR(100) NOT NULL,
        ordine INT NOT NULL DEFAULT 0
      )
    `)
    const [rows] = await db.query('SELECT id, nome FROM catalogo_categorie ORDER BY ordine ASC, nome ASC')
    return rows as { id: number; nome: string }[]
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const categorie = await getCategorie()

  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Cataloghi
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Cataloghi</h1>
      <p style={{ marginBottom: 32 }}>
        Consulta e scarica i cataloghi dei nostri prodotti, organizzati per categoria. Clicca su una categoria per vedere i depliant disponibili.
      </p>

      {categorie.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun catalogo disponibile al momento.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {categorie.map(c => (
            <Link
              key={c.id}
              href={`/brand/cataloghi/${c.id}`}
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
                fontSize: 16,
                fontWeight: 600,
                textAlign: 'center',
                padding: '20px 16px',
                transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
            >
              {c.nome}
            </Link>
          ))}
        </div>
      )}

      <Link href="/brand" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Brand
      </Link>
    </div>
  )
}
