import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import path from 'path'
import fs from 'fs'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 25, settings))
    return NextResponse.json({ ok: false, error: 'Non autorizzato.' }, { status: 403 })

  let fd: FormData
  try { fd = await req.formData() } catch {
    return NextResponse.json({ ok: false, error: 'FormData non valida.' })
  }

  const id   = parseInt(fd.get('id') as string)
  const file = fd.get('foto') as File | null

  if (isNaN(id))              return NextResponse.json({ ok: false, error: 'ID non valido.' })
  if (!file || file.size === 0) return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
    return NextResponse.json({ ok: false, error: 'Formato non supportato (jpg/png/webp/gif).' })
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: 'File troppo grande (max 5 MB).' })

  const dir = path.join(process.cwd(), 'public', 'listini')
  fs.mkdirSync(dir, { recursive: true })

  const db = await getConnection()
  try {
    // Cancella vecchia foto se presente
    const [rows] = await db.query('SELECT foto_url FROM listini WHERE id=? LIMIT 1', [id]) as [Record<string, unknown>[], unknown]
    const oldUrl = rows[0]?.foto_url as string | null
    if (oldUrl) {
      const oldPath = path.join(process.cwd(), 'public', oldUrl.replace(/^\//, ''))
      try { fs.unlinkSync(oldPath) } catch { /* già assente */ }
    }

    // Stream read — obbligatorio in Next.js App Router per file binari
    const reader = file.stream().getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const filename = `${id}-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.concat(chunks))
    const fotoUrl = `/listini/${filename}`

    await db.execute('UPDATE listini SET foto_url=? WHERE id=?', [fotoUrl, id])

    return NextResponse.json({ ok: true, foto_url: fotoUrl })
  } finally {
    await db.end()
  }
}
