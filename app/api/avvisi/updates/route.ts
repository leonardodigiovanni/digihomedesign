import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') return NextResponse.json({ hash: '' })

  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT COALESCE(SUM(letto),0) AS letti, COALESCE(SUM(cestinato),0) AS cestinati FROM avvisi'
    ) as [{ letti: number; cestinati: number }[], unknown]
    const { letti, cestinati } = rows[0] ?? { letti: 0, cestinati: 0 }
    return NextResponse.json({ hash: `${letti}-${cestinati}` })
  } catch {
    return NextResponse.json({ hash: '' })
  } finally {
    await db.end()
  }
}
