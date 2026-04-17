import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

async function getData(id: number) {
  const db = await getConnection()
  try {
    const [cats] = await db.execute(
      'SELECT id, nome FROM catalogo_categorie WHERE id = ? LIMIT 1',
      [id]
    )
    const categoria = (cats as { id: number; nome: string }[])[0]
    if (!categoria) return null

    const [voci] = await db.query(
      'SELECT id, nome, pdf_filename, pdf_label FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
      [id]
    )
    return {
      categoria,
      voci: voci as { id: number; nome: string; pdf_filename: string; pdf_label: string }[],
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

  const { categoria, voci } = data

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
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

      {voci.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun catalogo disponibile per questa categoria.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {voci.map(v => (
            <a
              key={v.id}
              href={`/uploads/cataloghi/${v.pdf_filename}`}
              download
              style={{
                flex: '1 1 200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                minHeight: 140,
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                textDecoration: 'none',
                color: '#1a1a1a',
                padding: '20px 16px',
                textAlign: 'center',
              }}
            >
              <svg width="36" height="44" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="34" rx="3" fill="#e53935"/>
                <path d="M17 0 L17 8 L28 8 Z" fill="#b71c1c"/>
                <text x="14" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="system-ui,sans-serif">PDF</text>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                {v.pdf_label || v.nome}
              </span>
              {v.pdf_label && v.nome !== v.pdf_label && (
                <span style={{ fontSize: 12, color: '#888' }}>{v.nome}</span>
              )}
              <span style={{ fontSize: 12, color: '#888' }}>Scarica</span>
            </a>
          ))}
        </div>
      )}

      <Link href="/brand/cataloghi" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna ai Cataloghi
      </Link>
    </div>
  )
}
