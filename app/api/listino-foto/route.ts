import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id) return NextResponse.json({ foto_url: '' })
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT foto_url FROM listini WHERE id = ? LIMIT 1', [id]
    ) as [{ foto_url: string | null }[], unknown]
    return NextResponse.json({ foto_url: rows[0]?.foto_url ?? '' })
  } finally {
    await db.end()
  }
}
