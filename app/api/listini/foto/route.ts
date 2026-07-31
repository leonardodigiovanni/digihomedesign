import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { put } from '@vercel/blob'
import { isConvertibleImageExt, toWebpFile } from '@/lib/image-convert'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 25, settings))
    return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 403 })

  let fd: FormData
  try { fd = await req.formData() } catch {
    return NextResponse.json({ ok: false, error: 'FormData non valida.' })
  }

  const id   = parseInt(fd.get('id') as string)
  const file = fd.get('foto') as File | null
  const tipo = (fd.get('tipo') as string | null) === 'schema' ? 'schema' : 'foto'
  const col  = tipo === 'schema' ? 'schema_url' : 'foto_url'

  if (isNaN(id))                return NextResponse.json({ ok: false, error: 'ID non valido.' })
  if (!file || file.size === 0) return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
    return NextResponse.json({ ok: false, error: 'Formato non supportato (jpg/png/webp/gif).' })
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: 'File troppo grande (max 5 MB).' })

  const uploadFile = isConvertibleImageExt(ext) ? await toWebpFile(file) : file
  const uploadExt  = isConvertibleImageExt(ext) ? 'webp' : ext

  const db = await getConnection()
  try {
    const filename = `${id}-${tipo}-${Date.now()}.${uploadExt}`
    const blob = await put(`listini/${filename}`, uploadFile, { access: 'public' })

    await db.execute(`UPDATE listini SET ${col}=? WHERE id=?`, [blob.url, id])

    return NextResponse.json({ ok: true, [col]: blob.url })
  } finally {
    await db.end()
  }
}
