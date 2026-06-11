import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!['admin', 'dipendente', 'direttore'].includes(role))
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })

  const { url } = await req.json() as { url: string }
  if (!url?.startsWith('https://'))
    return NextResponse.json({ error: 'URL non valido.' }, { status: 400 })

  await del(url)
  return NextResponse.json({ ok: true })
}
