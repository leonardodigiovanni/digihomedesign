import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

const STAFF_ROLES = ['dipendente','magazzino','direttore','admin','venditore','commercialista','ragioniere','operaio','marketing','email']

export async function GET() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!STAFF_ROLES.includes(role)) return NextResponse.json({ count: 0 })

  const db = await getConnection()
  try {
    const [rows] = await db.query('SELECT COUNT(*) as n FROM email_inbox WHERE letto = 0') as [{ n: number }[], unknown]
    return NextResponse.json({ count: Number(rows[0]?.n) || 0 })
  } finally {
    await db.end()
  }
}
