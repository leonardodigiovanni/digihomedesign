import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings))
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })

  const { url } = await req.json() as { url: string }
  if (!url?.startsWith('https://')) return NextResponse.json({ error: 'URL non valido.' }, { status: 400 })

  const db = await getConnection()
  try {
    const [refs] = await db.query('SELECT COUNT(*) AS cnt FROM catalogo_voci WHERE pdf_filename = ?', [url]) as [{ cnt: number }[], unknown]
    if ((refs[0]?.cnt ?? 0) > 0)
      return NextResponse.json({ error: 'File in uso da una voce catalogo — rimuovilo prima dalla voce.' }, { status: 409 })

    await del(url)
    return NextResponse.json({ ok: true })
  } finally {
    await db.end()
  }
}
