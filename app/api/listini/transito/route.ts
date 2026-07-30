import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { put } from '@vercel/blob'

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

  const file = fd.get('foto') as File | null
  if (!file || file.size === 0) return NextResponse.json({ ok: false, error: 'Nessun file ricevuto.' })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
    return NextResponse.json({ ok: false, error: 'Formato non supportato (jpg/png/webp/gif).' })
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: 'File troppo grande (max 5 MB).' })

  const blob = await put(`listini/transito-${Date.now()}.${ext}`, file, { access: 'public' })
  return NextResponse.json({ ok: true, url: blob.url })
}
