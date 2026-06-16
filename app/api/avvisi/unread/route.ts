import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (role !== 'cliente' || !username) return NextResponse.json({ count: 0 })

  const db = await getConnection()
  try {
    const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
    const clienteId = uRows[0]?.cliente_id ?? null
    if (!clienteId) return NextResponse.json({ count: 0 })
    const [rows] = await db.query(
      'SELECT COUNT(*) as n FROM avvisi WHERE cliente_id = ? AND letto = 0 AND cestinato = 0',
      [clienteId]
    ) as [{ n: number }[], unknown]
    return NextResponse.json({ count: Number(rows[0]?.n) || 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  } finally {
    await db.end()
  }
}
