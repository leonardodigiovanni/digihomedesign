import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!['admin', 'dipendente', 'direttore'].includes(role))
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })

  const prefix = req.nextUrl.searchParams.get('prefix') ?? ''
  const { blobs } = await list({ prefix })
  return NextResponse.json({
    blobs: blobs.map(b => ({
      url: b.url,
      nome: decodeURIComponent(b.pathname.replace(prefix, '')),
      size: b.size,
    }))
  })
}
