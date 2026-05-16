import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const orientamento = req.nextUrl.searchParams.get('orientamento') ?? 'portrait'
  const tipo = orientamento === 'landscape' ? 'disegno_landscape' : 'disegno_portrait'

  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT html FROM preventivo_templates WHERE tipo = ? LIMIT 1',
      [tipo]
    ) as [Record<string, unknown>[], unknown]

    const html = rows.length > 0 ? String((rows[0] as Record<string, unknown>).html ?? '') : ''
    return NextResponse.json({ html })
  } finally {
    await db.end()
  }
}
