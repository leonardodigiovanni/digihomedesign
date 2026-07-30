import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { put, del } from '@vercel/blob'
import {
  ensureCategoriaImmaginiTables, getImmagineCategoria, getImmagineSottocategoria,
  upsertImmagineCategoria, upsertImmagineSottocategoria,
  type TipoCategoriaImmagini, type TipoConSottocategoria, type SlotImmagine,
} from '@/lib/categoria-immagini'

function safe(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x'
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 403 })

  let fd: FormData
  try { fd = await req.formData() } catch {
    return NextResponse.json({ ok: false, error: 'FormData non valida.' })
  }

  const tipo          = fd.get('tipo') as TipoCategoriaImmagini | null
  const categoria      = (fd.get('categoria') as string | null)?.trim() ?? ''
  const sottocategoria = (fd.get('sottocategoria') as string | null)?.trim() ?? ''
  const slot           = fd.get('slot') as SlotImmagine | null
  const file           = fd.get('foto') as File | null

  if (!tipo || !['shop', 'promo', 'cataloghi'].includes(tipo))
    return NextResponse.json({ ok: false, error: 'Tipo non valido.' })
  if (!categoria) return NextResponse.json({ ok: false, error: 'Categoria mancante.' })
  if (slot !== 'categoria' && slot !== 'sottocategoria')
    return NextResponse.json({ ok: false, error: 'Slot non valido.' })
  // I cataloghi ammettono sottocategoria vuota (voce "Generale" per i cataloghi
  // senza sottocategoria) — shop/promo no, lì la sottocategoria è sempre richiesta.
  if (slot === 'sottocategoria' && !sottocategoria && tipo !== 'cataloghi')
    return NextResponse.json({ ok: false, error: 'Sottocategoria mancante.' })
  if (!file || file.size === 0) return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
    return NextResponse.json({ ok: false, error: 'Formato non supportato (jpg/png/webp/gif).' })
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: 'File troppo grande (max 5 MB).' })

  const db = await getConnection()
  try {
    await ensureCategoriaImmaginiTables(db)

    const oldUrl = slot === 'categoria'
      ? await getImmagineCategoria(db, tipo, categoria)
      : await getImmagineSottocategoria(db, tipo as TipoConSottocategoria, categoria, sottocategoria)
    if (oldUrl && oldUrl.startsWith('https://')) await del(oldUrl).catch(() => {})

    const filename = `${tipo}-${safe(categoria)}-${safe(sottocategoria)}-${slot}-${Date.now()}.${ext}`
    const blob = await put(`categoria-immagini/${filename}`, file, { access: 'public' })

    if (slot === 'categoria') await upsertImmagineCategoria(db, tipo, categoria, blob.url)
    else await upsertImmagineSottocategoria(db, tipo as TipoConSottocategoria, categoria, sottocategoria, blob.url)

    return NextResponse.json({ ok: true, url: blob.url })
  } finally {
    await db.end()
  }
}
