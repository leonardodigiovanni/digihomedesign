import Link from 'next/link'
import { notFound } from 'next/navigation'
import SetActionBar from '@/app/app/set-action-bar'
import { getConnection } from '@/lib/db'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { ensureCategoriaImmaginiTables, getCoppieConImmagine } from '@/lib/categoria-immagini'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'

type Props = { params: Promise<{ slug: string }> }

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const SLUG_GENERALE = 'generale'
const LABEL_GENERALE = 'Generale'

async function getData(slug: string) {
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)
    await ensureCategoriaImmaginiTables(db)

    const [catRows] = await db.query(
      `SELECT DISTINCT categoria FROM catalogo_voci_percorsi WHERE categoria != '' ORDER BY categoria ASC`
    ) as [{ categoria: string }[], unknown]
    const catNome = (catRows as { categoria: string }[]).find(r => toSlug(r.categoria) === slug)?.categoria
    if (!catNome) return null

    const [rows] = await db.query(
      `SELECT sottocategoria, COUNT(DISTINCT voce_id) AS n FROM catalogo_voci_percorsi WHERE categoria = ? GROUP BY sottocategoria ORDER BY sottocategoria ASC`,
      [catNome]
    ) as [{ sottocategoria: string; n: number }[], unknown]

    const immagini = await getCoppieConImmagine(db, 'cataloghi', true)
    const immaginePer = new Map(immagini.filter(i => i.categoria === catNome).map(i => [i.sottocategoria, i.immagine_url]))

    const sottocategorie = (rows as { sottocategoria: string; n: number }[]).map(r => ({
      nome: r.sottocategoria || LABEL_GENERALE,
      slug: r.sottocategoria ? toSlug(r.sottocategoria) : SLUG_GENERALE,
      numVoci: Number(r.n),
      immagine: immaginePer.get(r.sottocategoria) ?? null,
    }))

    return { categoria: catNome, sottocategorie }
  } finally {
    await db.end()
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) notFound()
  const { categoria, sottocategorie } = data

  return (
    <div className="fs-14" style={{ padding: '0 0 80px', color: '#444', lineHeight: 1.8, marginLeft: 3, marginRight: 3 }}>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>{categoria}</h1>

      {sottocategorie.length === 0 ? (
        <p className="fs-14" style={{ color: '#aaa', marginTop: 12 }}>Nessuna sottocategoria disponibile.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginTop: 12 }}>
          {sottocategorie.map(s => (
            <CategoryTile key={s.slug} href={`/app/cataloghi/${slug}/${s.slug}`} nome={s.nome} numArticoli={s.numVoci} unita={['catalogo', 'cataloghi']} immagine={s.immagine} />
          ))}
        </div>
      )}

      <SetActionBar>
        <Link href="/app/cataloghi" className="btn-black-app fs-12" style={{ margin: '0 auto' }}>
          ← Torna ai Cataloghi
        </Link>
      </SetActionBar>
    </div>
  )
}
