import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings))
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })

  const { blobs } = await list({ prefix: 'cataloghi/' })
  const risultati = blobs.map(b => ({
    url: b.url,
    nome: decodeURIComponent(b.pathname.replace('cataloghi/', '')),
    size: b.size,
  }))
  return NextResponse.json({ blobs: risultati })
}
