import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (role !== 'cliente' || !username) return NextResponse.json({ avviso: null })

  const db = await getConnection()
  try {
    const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
    const email = uRows[0]?.email ?? ''
    if (!email) return NextResponse.json({ avviso: null })
    const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
    const clienteId = cRows[0]?.id ?? null
    if (!clienteId) return NextResponse.json({ avviso: null })
    const [rows] = await db.query(
      'SELECT id, oggetto, testo FROM avvisi WHERE cliente_id = ? AND letto = 0 AND cestinato = 0 ORDER BY created_at DESC LIMIT 1',
      [clienteId]
    ) as [{ id: number; oggetto: string; testo: string }[], unknown]
    return NextResponse.json({ avviso: rows[0] ?? null })
  } catch {
    return NextResponse.json({ avviso: null })
  } finally {
    await db.end()
  }
}
